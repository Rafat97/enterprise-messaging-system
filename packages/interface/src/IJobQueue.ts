export type IDrivers = 'kafka' | 'http';
export type IDriverConfig = null | { [x: string]: any };

export interface IJobQueue {
  message: { [x: string]: any };
  eventName: string;
  driverName: IDrivers;
  driverConfig: IDriverConfig;
  timestamp: number;
  metaData: { [x: string]: any };
}
