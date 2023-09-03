import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_QUEUE_NAME } from '@fanout/envs';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.cron';
import { HealthModule } from './health/health.module';

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
      name: SCHEDULED_QUEUE_NAME,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
  ],
  controllers: [],
  providers: [AppService, TasksService],
})
export class AppModule {}
