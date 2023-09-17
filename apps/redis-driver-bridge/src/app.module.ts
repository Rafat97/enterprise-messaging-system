import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { HealthModule } from './health/health.module';
import { KafkaDriver } from './driver/kafka/kafka.driver';
import { KafkaScheduleConsumer } from './schedule/kafka.consumer';
import { HttpScheduleConsumer } from './schedule/http.consumer';

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
      name: SCHEDULED_KAFKA_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: SCHEDULED_HTTP_QUEUE_NAME,
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [KafkaDriver, KafkaScheduleConsumer, HttpScheduleConsumer],
})
export class AppModule {}
