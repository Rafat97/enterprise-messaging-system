import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_QUEUE_NAME } from '@fanout/envs';
import { ScheduleConsumer } from './schedule.consumer';
import { HealthModule } from './health/health.module';
import { KafkaDriver } from './driver/kafka/kafka.driver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: SCHEDULED_QUEUE_NAME,
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [KafkaDriver, ScheduleConsumer],
})
export class AppModule {}
