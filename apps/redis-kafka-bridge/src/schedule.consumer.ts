import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import {
  SCHEDULED_QUEUE_NAME,
  SCHEDULED_QUEUE_PROCESS_NAME,
} from './constants';

@Processor(SCHEDULED_QUEUE_NAME)
export class ScheduleConsumer {
  private readonly logger = new Logger(ScheduleConsumer.name);

  constructor(@InjectQueue(SCHEDULED_QUEUE_NAME) private scheduleQueue: Queue) {
    this.logger.log(`JOB RUN ON ${SCHEDULED_QUEUE_NAME}`);
  }

  @Process()
  async schedule(job: Job<unknown>) {
    this.logger.log(
      `Schedule Consumer Process _default_ complete for job: ${job.id}`,
    );
  }

  @Process(SCHEDULED_QUEUE_PROCESS_NAME)
  async transcode(job: Job<unknown>) {
    this.logger.log(
      `Schedule Consumer Process transcode complete for job: ${job.id}`,
    );
  }
}
