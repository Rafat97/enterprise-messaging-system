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
import { getDriverConfig } from '@fanout/utils';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
    private readonly logger: Logger,
  ) {}

  private createJobId(headers: Headers, createMessageDto: CreateDelayedMessageDto) {
    const uniqId = ulid();
    const requestId = headers?.[REQUEST_ID_HEADER] ?? 'NONE';

    const jobId =
      `${createMessageDto.driverName}__${createMessageDto.eventName}__` +
      (createMessageDto?.option?.jobId ?? `${requestId}__${uniqId}`);

    return jobId;
  }

  private getBullOption(jobId: string, createMessageDto: CreateDelayedMessageDto) {
    return {
      jobId: jobId,
      delay: createMessageDto?.delay ?? 10,
      removeOnComplete: true,
      priority: createMessageDto?.option?.priority ?? 1,
    };
  }

  private createBullData(headers: Headers, createMessageDto: CreateDelayedMessageDto) {
    const jobId = this.createJobId(headers, createMessageDto);
    const options = this.getBullOption(jobId, createMessageDto);
    const driverConfig = getDriverConfig(createMessageDto.driverConfig);
    const sendData: IJobQueue = {
      driverName: createMessageDto.driverName,
      driverConfig: driverConfig,
      eventName: createMessageDto.eventName,
      message: createMessageDto.data ?? {},
      timestamp: Date.now(),
      metaData: {
        eventInfo: `driver = ${createMessageDto.driverName}, delayed message queued, delay = ${options.delay}ms, priority = ${options.priority}`,
      },
    };
    return {
      jobId: jobId,
      options: options,
      data: sendData,
    };
  }

  async create(headers: Headers, createMessageDto: CreateDelayedMessageDto) {
    const { data, jobId, options } = this.createBullData(headers, createMessageDto);

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
