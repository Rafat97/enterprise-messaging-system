import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { SCHEDULED_QUEUE_NAME, SCHEDULED_QUEUE_PROCESS_NAME } from '@fanout/envs';
import { SERVICE_NAME } from './constant';
import { ClientKafka } from '@nestjs/microservices';

interface IJobQueue {
  message: { [x: string]: any };
  eventName: string;
  metaData: { [x: string]: any };
}

interface IScheduleConsumer {
  bridgeScheduleSend(job: Job<IJobQueue>): Promise<void>;
}

@Processor(SCHEDULED_QUEUE_NAME)
export class ScheduleConsumer implements IScheduleConsumer {
  private readonly logger = new Logger(ScheduleConsumer.name);

  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
    @Inject(SERVICE_NAME) private readonly kafkaClient: ClientKafka,
  ) {
    this.logger.log(`JOB RUN ON ${SCHEDULED_QUEUE_NAME}`);
  }

  @Process(SCHEDULED_QUEUE_PROCESS_NAME)
  async bridgeScheduleSend(job: Job<IJobQueue>) {
    this.logger.log(
      `Schedule Consumer Process ${SCHEDULED_QUEUE_PROCESS_NAME} complete for job: ${job.id}`,
    );
    console.log(job.data);
    // await this.kafkaClient.send(job.data.eventName, JSON.stringify(job.data.message));
    // await this.kafkaClient.emit(job.data.eventName, JSON.stringify(job.data.message));
    const producer = await this.kafkaClient.connect();
    await producer.send({
      topic: job.data.eventName,
      messages: [
        {
          value: JSON.stringify(job.data.message),
        },
      ],
    });
    return;
  }
}
