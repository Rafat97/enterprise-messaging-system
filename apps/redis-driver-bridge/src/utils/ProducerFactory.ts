import { IJobQueue } from '../interface/IJobQueue';
import { KafkaDriverInstance } from '../driver/kafka/kafka.driver';
import { Job } from 'bull';

export class ProducerFactory {
  private driverName = 'kafka';
  constructor(driverName?: string) {
    this.driverName = driverName;
  }

  private async kafkaSendData(job: Job<IJobQueue>) {
    const data = {
      topic: job.data.eventName,
      messages: [
        {
          key: `${job.id}`,
          value: JSON.stringify({
            id: job.id,
            timestamp: Date.now(),
            eventName: job.data.eventName,
            data: job.data.message,
          }),
        },
      ],
    };
    return await KafkaDriverInstance.send(data);
  }

  async sendData(job: Job<IJobQueue>) {
    if (this.driverName == 'kafka') {
      return await this.kafkaSendData(job);
    } else {
      throw new Error('This driver not supported yet.');
    }
  }
}
