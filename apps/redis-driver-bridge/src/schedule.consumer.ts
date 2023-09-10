import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { SCHEDULED_QUEUE_NAME, SCHEDULED_QUEUE_PROCESS_NAME } from '@fanout/envs';
import { ProducerFactory } from './utils/ProducerFactory';
import { IJobQueue } from '@fanout/interface';

interface IScheduleConsumer {
  bridgeScheduleSend(job: Job<IJobQueue>): Promise<void>;
}

@Processor(SCHEDULED_QUEUE_NAME)
export class ScheduleConsumer implements IScheduleConsumer {
  private readonly logger = new Logger(ScheduleConsumer.name);

  constructor(@InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue) {
    this.logger.log(`JOB RUN ON ${SCHEDULED_QUEUE_NAME}`);
  }

  @Process(SCHEDULED_QUEUE_PROCESS_NAME)
  async bridgeScheduleSend(job: Job<IJobQueue>) {
    this.logger.log(
      `Schedule Consumer Process ${SCHEDULED_QUEUE_PROCESS_NAME} start for job: ${job.id}`,
    );
    const driverName = job?.data?.driverName ?? 'kafka';
    const response = await new ProducerFactory(driverName).sendData(job);
    this.logger.log({ acceptData: job?.data, response });
    this.logger.log(
      `Schedule Consumer Process ${SCHEDULED_QUEUE_PROCESS_NAME} finish for job: ${job.id}`,
    );

    return;
  }
}
