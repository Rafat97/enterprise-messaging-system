export interface IJobQueueSendToProducer {
  id: number | string;
  eventName: string;
  timestamp: number;
  data: { [x: string]: any };
}
