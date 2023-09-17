export const SCHEDULED_QUEUE_PROCESS_NAME = 'REDIS_PROCESS';
export const SCHEDULED_KAFKA_QUEUE_NAME = 'SCHEDULED__REDIS__KAFAK__DRIVERS';
export const SCHEDULED_HTTP_QUEUE_NAME = 'SCHEDULED__REDIS__HTTP__DRIVERS';

//cron task delay run
export const SCHEDULED_FAILED_RETRY_CRON = '*/30 * * * * *';

//cron task maximum item retry.
export const SCHEDULED_FAILED_RETRY_CRON_MAXIMUM_JOB_RETRY_LENGTH = 10000;

//cron task, how many times retry when a queue item is failed. How much time will retry equation (SCHEDULED_FAILED_RETRY_CRON in second * SCHEDULED_FAILED_MAX_ITEM_ATTEMPT) and unit will be in second or cron time.
export const SCHEDULED_FAILED_MAX_ITEM_ATTEMPT = 3000;

export const REQUEST_ID_HEADER: string = 'x-request-id';
export const REQUEST_LOG_HEADER_ID: string = 'x-log-id';
export const USE_JSON_LOGGER: string = 'true';
export const DEBUG = process.env.DEBUG;

export const HTTP_DRIVER_CLIENT_TIMEOUT = 10000;
