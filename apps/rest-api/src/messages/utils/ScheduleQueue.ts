import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { DriverNameEnum } from '@fanout/interface';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ScheduleQueue {
  constructor(
    @InjectQueue(SCHEDULED_HTTP_QUEUE_NAME) private readonly httpScheduleQueue: Queue,
    @InjectQueue(SCHEDULED_KAFKA_QUEUE_NAME) private readonly kafkaScheduleQueue: Queue,
  ) {}

  async isExistJob(key: string, driverName: string) {
    const job = await this.findOne(key, driverName);
    if (job) {
      return true;
    }
    return false;
  }

  async isExistJobDelete(key: string, driverName: string) {
    const job = await this.isExistJob(key, driverName);
    if (job) {
      await this.remove(key, driverName);
    }
  }

  async findOne(id: string, driverName: string) {
    return await this.getQueueInstance(driverName).getJob(id);
  }

  async remove(key: string, driverName: string) {
    return await this.getQueueInstance(driverName).removeJobs(key);
  }

  async count(driverName: string) {
    return await this.getQueueInstance(driverName).getJobCounts();
  }

  getQueueInstance(driverName: string) {
    if (driverName === DriverNameEnum.KAFKA) {
      return this.kafkaScheduleQueue;
    } else if (driverName === DriverNameEnum.HTTP) {
      return this.httpScheduleQueue;
    }
    return null;
  }
}
