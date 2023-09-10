import { SCHEDULED_QUEUE_NAME } from '@fanout/envs';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Queue } from 'bull';

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  constructor(@InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const status = this.scheduleQueue.client.status;
    const isHealthy = status === 'ready';
    const result = this.getStatus('redis', isHealthy, { status: status });
    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Redis failed', result);
  }
}
