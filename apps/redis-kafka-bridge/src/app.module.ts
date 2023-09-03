import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SCHEDULED_QUEUE_NAME } from '@fanout/envs';
import { ScheduleConsumer } from './schedule.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAME } from './constant';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'producer1',
              brokers: configService.get<string>('KAFKA_BROKERS').split(','),
            },
            producerOnlyMode: true,
            consumer: {
              groupId: SERVICE_NAME,
              allowAutoTopicCreation: true,
            },
          },
        }),
      },
    ]),
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
  providers: [AppService, ScheduleConsumer],
})
export class AppModule {}
