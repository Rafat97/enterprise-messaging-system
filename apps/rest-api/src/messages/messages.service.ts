import { Injectable, Logger } from '@nestjs/common';
import { CreateDelayedMessageDto } from './dto/create-delayed-message.dto';
import { InjectQueue } from '@nestjs/bull';
import {
  SCHEDULED_QUEUE_NAME,
  SCHEDULED_QUEUE_PROCESS_NAME,
  REQUEST_ID_HEADER,
} from '@fanout/envs';
import { Queue } from 'bull';
import { ulid } from 'ulid';
import { IJobQueue } from '@fanout/interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
    private readonly logger: Logger,
  ) {}

  async create(headers: Headers, createMessageDto: CreateDelayedMessageDto) {
    const uniqId = ulid();
    const requestId = headers?.[REQUEST_ID_HEADER] ?? 'NONE';

    const jobId =
      `${createMessageDto.driverName}__${createMessageDto.eventName}__` +
      (createMessageDto?.option?.jobId ?? `${requestId}__${uniqId}`);

    const options = {
      jobId: jobId,
      delay: createMessageDto?.delay ?? 10,
      removeOnComplete: true,
      priority: createMessageDto?.option?.priority ?? 1,
    };

    const data: IJobQueue = {
      driverName: createMessageDto.driverName,
      eventName: createMessageDto.eventName,
      message: createMessageDto.data ?? {},
      timestamp: Date.now(),
      metaData: {
        eventType: `delayed message queued, delay = ${options.delay}ms, priority = ${options.priority}`,
        driverName: 'kafka',
      },
    };

    if (createMessageDto?.option?.jobId) {
      await this.isExistJobDelete(jobId);
    }

    this.logger.log({ logData: { createMessageDto, data, options } }, MessagesService.name);
    const message = await this.scheduleQueue.add(SCHEDULED_QUEUE_PROCESS_NAME, data, options);
    return message;
  }

  async isExistJob(key: string) {
    const job = await this.findOne(key);
    if (job) {
      return true;
    }
    return false;
  }

  async isExistJobDelete(key: string) {
    const job = await this.isExistJob(key);
    if (job) {
      await this.remove(key);
    }
  }

  async findOne(id: string) {
    return await this.scheduleQueue.getJob(id);
  }

  async remove(key: string) {
    return await this.scheduleQueue.removeJobs(key);
  }
}
