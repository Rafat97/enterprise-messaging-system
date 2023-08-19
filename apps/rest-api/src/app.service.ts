import { Injectable, Logger } from '@nestjs/common';
import { SCHEDULED_QUEUE_NAME, SCHEDULED_QUEUE_PROCESS_NAME } from '@fanout/envs';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ulid } from 'ulid';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(SCHEDULED_QUEUE_NAME) private readonly scheduleQueue: Queue,
    private readonly logger: Logger,
  ) {}

  async getHello() {
    const size = 110000;
    this.logger.log('getHello', AppService.name);
    this.logger.error('getHello', AppService.name);
    // for (let index = 0; index < size; index++) {
    //   const data = {
    //     fileName: `./file-${index}.mp3`,
    //     time: new Date(Date.now()).toUTCString(),
    //   };

    //   const jobId = ulid();

    //   this.scheduleQueue.add(SCHEDULED_QUEUE_PROCESS_NAME, data, {
    //     jobId: jobId,
    //     delay: 30000,
    //     removeOnComplete: true,
    //   });
    // }

    return {
      status: `send ${size}`,
    };
  }

  async retryFailedJobs() {
    const jobs = await this.scheduleQueue.getFailed();
    for (const item of jobs) {
      await item.retry();
    }

    return { count: await this.scheduleQueue.getFailedCount() };
  }
}
