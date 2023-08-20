import { Logger, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_QUEUE_NAME } from '@fanout/envs';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SCHEDULED_QUEUE_NAME,
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, Logger],
})
export class MessagesModule {}
