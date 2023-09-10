export const SCHEDULED_QUEUE_PROCESS_NAME = 'REDIS_PROCESS';
export const SCHEDULED_QUEUE_NAME = 'SCHEDULED__REDIS__DRIVERS';
export const SCHEDULED_FAILED_RETRY_CRON = '*/30 * * * * *';
export const SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH = 10000;
export const REQUEST_ID_HEADER: string = 'x-request-id';
export const REQUEST_LOG_HEADER_ID: string = 'x-log-id';
export const USE_JSON_LOGGER: string = 'true';
export const DEBUG = process.env.DEBUG;
