import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Queue } from 'bull';

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  constructor(
    @InjectQueue(SCHEDULED_HTTP_QUEUE_NAME) private readonly httpScheduleQueue: Queue,
    @InjectQueue(SCHEDULED_KAFKA_QUEUE_NAME) private readonly kafkaScheduleQueue: Queue,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const statusHttp = this.httpScheduleQueue.client.status;
    const statusKafka = this.kafkaScheduleQueue.client.status;
    const isHealthy = status === 'ready';
    const result = this.getStatus('redis', isHealthy, { status: { statusHttp, statusKafka } });
    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Redis failed', result);
  }
}
