import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  SCHEDULED_FAILED_RETRY_CRON,
  SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH,
  SCHEDULED_QUEUE_NAME,
} from './constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
  ) {}

  @Cron(SCHEDULED_FAILED_RETRY_CRON)
  async failedJobHandle() {
    let jobs = await this.scheduleQueue.getFailed();
    this.logger.log(
      `[${new Date(Date.now()).toUTCString()}] Failed job total size: ${
        jobs.length
      }`,
    );
    if (jobs.length >= SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH) {
      jobs = jobs.slice(
        0,
        SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH,
      );
    }
    jobs.forEach((job) => {
      job.retry();
    });
    this.logger.log(
      `[${new Date(Date.now()).toUTCString()}] Failed job total retry size: ${
        jobs.length
      }`,
    );
  }
}
