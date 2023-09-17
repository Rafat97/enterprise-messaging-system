import { Injectable, Logger } from '@nestjs/common';
import { CreateDelayedMessageDto } from './dto/create-delayed-message.dto';
import { REQUEST_ID_HEADER } from '@fanout/envs';
import { ulid } from 'ulid';
import { IJobQueue } from '@fanout/interface';
import { getDriverConfig, getProcessName } from '@fanout/utils';
import { CreateWithoutDelayedMessageDto } from './dto/create-without-delayed-message.dto';
import { Request } from 'express';
import { ScheduleQueue } from './utils/ScheduleQueue';

@Injectable()
export class MessagesService {
  constructor(private readonly scheduleQueue: ScheduleQueue, private readonly logger: Logger) {}

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
    const processName = getProcessName(createMessageDto.driverName);
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
      driverName: createMessageDto.driverName,
      options: options,
      data: sendData,
      processName: processName,
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
    const processName = getProcessName(createMessageDto.driverName);
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
      driverName: createMessageDto.driverName,
      processName: processName,
    };
  }

  async createDelayedMessage(
    req: Request,
    headers: Headers,
    createMessageDto: CreateDelayedMessageDto,
  ) {
    const { data, jobId, options, processName, driverName } = this.createDelayBullData(
      req,
      headers,
      createMessageDto,
    );

    if (createMessageDto?.option?.jobId) {
      await this.scheduleQueue.isExistJobDelete(jobId, driverName);
    }

    this.logger.log({ logData: { createMessageDto, data, options } }, MessagesService.name);
    const message = await this.scheduleQueue
      .getQueueInstance(driverName)
      .add(processName, data, options);
    return message;
  }

  async createWithoutDelayedMessage(
    req: Request,
    headers: Headers,
    createMessageDto: CreateWithoutDelayedMessageDto,
  ) {
    const { data, jobId, options, processName, driverName } = this.createWithoutDelayBullData(
      req,
      headers,
      createMessageDto,
    );

    if (createMessageDto?.option?.jobId) {
      await this.scheduleQueue.isExistJobDelete(jobId, driverName);
    }

    this.logger.log({ logData: { createMessageDto, data, options } }, MessagesService.name);
    const message = await this.scheduleQueue
      .getQueueInstance(driverName)
      .add(processName, data, options);
    return message;
  }
}
