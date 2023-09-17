import { Logger, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { ScheduleQueue } from './utils/ScheduleQueue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SCHEDULED_KAFKA_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: SCHEDULED_HTTP_QUEUE_NAME,
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, Logger, ScheduleQueue],
})
export class MessagesModule {}
