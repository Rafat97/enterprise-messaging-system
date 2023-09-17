import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { BullHealthIndicator } from './bull.health';

@Module({
  imports: [
    TerminusModule,
    BullModule.registerQueue({
      name: SCHEDULED_KAFKA_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: SCHEDULED_HTTP_QUEUE_NAME,
    }),
  ],
  controllers: [HealthController],
  providers: [BullHealthIndicator],
})
export class HealthModule {}
