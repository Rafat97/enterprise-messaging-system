import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_HTTP_QUEUE_NAME, SCHEDULED_KAFKA_QUEUE_NAME } from '@fanout/envs';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { HttpTasksService } from './http.cron';
import { KafkaTasksService } from './kafka.cron';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ScheduleModule.forRoot(),
    HealthModule,
  ],
  controllers: [],
  providers: [AppService, HttpTasksService, KafkaTasksService],
})
export class AppModule {}
