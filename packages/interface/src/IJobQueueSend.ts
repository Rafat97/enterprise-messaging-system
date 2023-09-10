export interface IJobQueueSendToProducer {
  id: number | string;
  eventName: string;
  timestamp: number;
  eventMetaData: { [x: string]: any };
  data: { [x: string]: any };
}
