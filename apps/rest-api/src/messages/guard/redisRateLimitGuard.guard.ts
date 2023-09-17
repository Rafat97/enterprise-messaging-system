import {
  Injectable,
  CanActivate,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ScheduleQueue } from '../utils/ScheduleQueue';
import { DriverNameEnum } from '@fanout/interface';
import { HTTP_QUEUE_MAX_LIMIT, KAFKA_QUEUE_MAX_LIMIT } from '@fanout/envs';

@Injectable()
export class QueueRedisRateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private scheduleQueue: ScheduleQueue,
    private readonly logger: Logger,
  ) {}
  async canActivate(context: ExecutionContext) {
    const reflectorValue = this.reflector.get('QueueRedisRateLimit', context.getHandler());
    const { body } = context.switchToHttp().getRequest();
    const driverName = body.driverName;
    const maxLimit = reflectorValue?.[driverName] ?? 0;
    const totalJob = await this.scheduleQueue.count(driverName);
    const totalCount = totalJob.waiting + totalJob.active + totalJob.failed + totalJob.delayed;

    if (totalCount <= maxLimit) {
      return true;
    }
    this.logger.log(
      {
        logData: { totalCount, maxLimit, message: `${driverName} driver maximum limit exceeded` },
      },
      QueueRedisRateLimitGuard.name,
    );
    return false;
  }
}

export interface SelfDecoratorParams {
  userIDParam: string;
  allowAdmins?: boolean;
}

export const QueueRedisRateLimit = () => {
  return applyDecorators(
    SetMetadata('QueueRedisRateLimit', {
      [DriverNameEnum.KAFKA]: KAFKA_QUEUE_MAX_LIMIT,
      [DriverNameEnum.HTTP]: HTTP_QUEUE_MAX_LIMIT,
    }),
    UseGuards(QueueRedisRateLimitGuard),
  );
};
