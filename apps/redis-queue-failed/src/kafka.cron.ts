import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  SCHEDULED_FAILED_MAX_ITEM_ATTEMPT,
  SCHEDULED_FAILED_RETRY_CRON,
  SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH,
  SCHEDULED_KAFKA_QUEUE_NAME,
} from '@fanout/envs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class KafkaTasksService {
  private readonly logger = new Logger(KafkaTasksService.name);

  constructor(@InjectQueue(SCHEDULED_KAFKA_QUEUE_NAME) private readonly scheduleQueue: Queue) {}

  @Cron(SCHEDULED_FAILED_RETRY_CRON)
  async failedJobHandle() {
    let jobs = await this.scheduleQueue.getFailed();
    this.logger.log(
      `[${new Date(Date.now()).toUTCString()}] kafka Failed job total size: ${jobs.length}`,
    );
    jobs = jobs.filter((job) => job.attemptsMade <= SCHEDULED_FAILED_MAX_ITEM_ATTEMPT);
    if (jobs.length >= SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH) {
      jobs = jobs.slice(0, SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH);
    }
    jobs.forEach((job) => {
      job.retry();
    });
    this.logger.log(
      `[${new Date(Date.now()).toUTCString()}] kafka job total retry size: ${jobs.length}`,
    );
  }
}
