import { SCHEDULED_QUEUE_PROCESS_NAME } from '@fanout/envs';
import { DriverNameEnum, IDriverConfig } from '@fanout/interface';

function isEmpty(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

export const getDriverConfig = (driverConfig: IDriverConfig) => {
  let config = driverConfig ?? null;
  if (!driverConfig || isEmpty(driverConfig)) {
    config = null;
  }
  return config;
};

export const getProcessName = (driverName: string) => {
  const PROCESS_NAME = `${SCHEDULED_QUEUE_PROCESS_NAME}_${DriverNameEnum[driverName.toUpperCase()]}`.toUpperCase();
  return PROCESS_NAME;
};
