import { IJobQueue, IJobQueueSendToProducer } from '@fanout/interface';
import { KafkaDriver } from '../driver/kafka/kafka.driver';
import { Job } from 'bull';
import { getDriverConfig } from '@fanout/utils';

export class ProducerFactory {
  private driverName = 'kafka';
  constructor(driverName?: string) {
    this.driverName = driverName;
  }

  private createData(job: Job<IJobQueue>) {
    const sendDataValue: IJobQueueSendToProducer = {
      id: job.id,
      timestamp: Date.now(),
      eventName: job.data.eventName,
      data: job.data.message,
    };
    return sendDataValue;
  }

  private async kafkaSend(job: Job<IJobQueue>) {
    const sendDataValue: IJobQueueSendToProducer = this.createData(job);
    const driverConfig = getDriverConfig(job.data.driverConfig);
    const data = {
      topic: job.data.eventName,
      messages: [
        {
          key: `${job.id}`,
          value: JSON.stringify(sendDataValue),
        },
      ],
    };
    const kafkaProducerDriver = new KafkaDriver(driverConfig);
    return await kafkaProducerDriver.send(data);
  }

  async sendData(job: Job<IJobQueue>) {
    const driverName = this.driverName;
    if (driverName == 'kafka') {
      return await this.kafkaSend(job);
    } else {
      throw new Error(`${driverName} driver not supported yet.`);
    }
  }
}
