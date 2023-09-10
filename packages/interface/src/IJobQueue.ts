export interface IJobQueue {
  message: { [x: string]: any };
  eventName: string;
  driverName: string;
  timestamp: number;
  metaData: { [x: string]: any };
}
