import { CronExpression } from '@nestjs/schedule';

export const SCHEDULED_QUEUE_NAME = 'SCHEDULED__REDIS__KAFKA';
export const SCHEDULED_FAILED_RETRY_CRON = CronExpression.EVERY_30_SECONDS;
export const SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH = 10000;
