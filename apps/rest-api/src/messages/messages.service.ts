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
import { CreateWithoutDelayedMessageDto } from './dto/create-without-delayed-message.dto';
import { Request } from 'express';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
    private readonly logger: Logger,
  ) {}

  private createJobId(
    headers: Headers,
    createMessageDto: CreateDelayedMessageDto | CreateWithoutDelayedMessageDto,
  ) {
    const uniqId = ulid();
    const requestId = headers?.[REQUEST_ID_HEADER] ?? 'NONE';

    const jobId =
      `${createMessageDto.driverName}__${createMessageDto.eventName}__` +
      (createMessageDto?.option?.jobId ?? `${requestId}__${uniqId}`);

    return jobId;
  }

  private getBullOption(
    jobId: string,
    createMessageDto: CreateDelayedMessageDto | CreateWithoutDelayedMessageDto,
  ) {
    const option = {
      jobId: jobId,
      delay: 0,
      removeOnComplete: true,
      priority: createMessageDto?.option?.priority ?? 1,
    };
    if (createMessageDto instanceof CreateDelayedMessageDto) {
      option.delay = createMessageDto?.delay ?? 10;
    }
    return option;
  }

  private createDelayBullData(
    req: Request,
    headers: Headers,
    createMessageDto: CreateDelayedMessageDto,
  ) {
    const jobId = this.createJobId(headers, createMessageDto);
    const options = this.getBullOption(jobId, createMessageDto);
    const driverConfig = getDriverConfig(createMessageDto.driverConfig);
    const currentTime = Date.now();
    const sendData: IJobQueue = {
      driverName: createMessageDto.driverName,
      driverConfig: driverConfig,
      eventName: createMessageDto.eventName,
      message: createMessageDto.data ?? {},
      timestamp: currentTime,
      metaData: {
        url: `${req.originalUrl}`,
        timestamp: currentTime,
        eventInfo: `driver = ${createMessageDto.driverName}, delayed message queued, delay = ${options.delay}ms, priority = ${options.priority}`,
      },
    };
    return {
      jobId: jobId,
      options: options,
      data: sendData,
    };
  }

  private createWithoutDelayBullData(
    req: Request,
    headers: Headers,
    createMessageDto: CreateWithoutDelayedMessageDto,
  ) {
    const jobId = this.createJobId(headers, createMessageDto);
    const options = this.getBullOption(jobId, createMessageDto);
    const driverConfig = getDriverConfig(createMessageDto.driverConfig);
    const currentTime = Date.now();
    const sendData: IJobQueue = {
      driverName: createMessageDto.driverName,
      driverConfig: driverConfig,
      eventName: createMessageDto.eventName,
      message: createMessageDto.data ?? {},
      timestamp: currentTime,
      metaData: {
        url: `${req.originalUrl}`,
        timestamp: currentTime,
        eventInfo: `driver = ${createMessageDto.driverName}, without delayed message queued, delay = ${options.delay}ms, priority = ${options.priority}`,
      },
    };
    return {
      jobId: jobId,
      options: options,
      data: sendData,
    };
  }

  async createDelayedMessage(
    req: Request,
    headers: Headers,
    createMessageDto: CreateDelayedMessageDto,
  ) {
    const { data, jobId, options } = this.createDelayBullData(req, headers, createMessageDto);

    if (createMessageDto?.option?.jobId) {
      await this.isExistJobDelete(jobId);
    }

    this.logger.log({ logData: { createMessageDto, data, options } }, MessagesService.name);
    const message = await this.scheduleQueue.add(SCHEDULED_QUEUE_PROCESS_NAME, data, options);
    return message;
  }

  async createWithoutDelayedMessage(
    req: Request,
    headers: Headers,
    createMessageDto: CreateWithoutDelayedMessageDto,
  ) {
    const { data, jobId, options } = this.createWithoutDelayBullData(
      req,
      headers,
      createMessageDto,
    );

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
