import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { SCHEDULED_HTTP_QUEUE_NAME } from '@fanout/envs';
import { ProducerFactory } from '../utils/ProducerFactory';
import { DriverNameEnum, IJobQueue } from '@fanout/interface';
import { getProcessName } from '@fanout/utils';

interface IScheduleConsumer {
  bridgeScheduleSend(job: Job<IJobQueue>): Promise<void>;
}

const PROCESS_NAME = getProcessName(DriverNameEnum.HTTP);

@Processor(SCHEDULED_HTTP_QUEUE_NAME)
export class HttpScheduleConsumer implements IScheduleConsumer {
  private readonly logger = new Logger(HttpScheduleConsumer.name);

  constructor(@InjectQueue(SCHEDULED_HTTP_QUEUE_NAME) private readonly scheduleQueue: Queue) {
    this.logger.log(`JOB RUN ON ${SCHEDULED_HTTP_QUEUE_NAME}`);
  }

  @Process(PROCESS_NAME)
  async bridgeScheduleSend(job: Job<IJobQueue>) {
    this.logger.log(`Schedule Consumer Process ${PROCESS_NAME} start for job: ${job.id}`);
    const driverName = job?.data?.driverName ?? 'kafka';
    const response = await new ProducerFactory(driverName).sendData(job);
    this.logger.log({ acceptData: job?.data, response });
    this.logger.log(`Schedule Consumer Process ${PROCESS_NAME} finish for job: ${job.id}`);

    return;
  }
}
