import { IDriverConfig } from '@fanout/interface';
import isEmpty from 'lodash/isEmpty';

export const getDriverConfig = (driverConfig: IDriverConfig) => {
  let config = driverConfig ?? null;
  if (!driverConfig || isEmpty(driverConfig)) {
    config = null;
  }
  return config;
};
