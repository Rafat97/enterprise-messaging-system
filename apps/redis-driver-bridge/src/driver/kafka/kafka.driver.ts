import { IDriverConfig } from '@fanout/interface';
import {
  CompressionTypes,
  Kafka,
  KafkaConfig,
  Partitioners,
  Producer,
  ProducerRecord,
} from 'kafkajs';

export class KafkaDriver {
  private kafkaClient: Kafka = null;
  private producer: Producer = null;

  constructor(driverConfig?: IDriverConfig) {
    this.config(driverConfig);
  }

  private config(driverConfig?: IDriverConfig) {
    let kafkaConnectionValueInString = process?.env?.KAFKA_CLIENT_CONFIG_VALUE ?? '';
    if (driverConfig) {
      kafkaConnectionValueInString = JSON.stringify(driverConfig);
    }
    const kafkaConnectionValue: KafkaConfig = JSON.parse(kafkaConnectionValueInString);
    const kafka = new Kafka(kafkaConnectionValue);
    this.kafkaClient = kafka;
  }

  private async connect() {
    const producer = this.kafkaClient.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    await producer.connect();
    this.producer = producer;
  }

  private async disconnect() {
    await this.producer.disconnect();
  }

  public async send(data: ProducerRecord) {
    await this.connect();
    const recordMetadata = await this.producer.send({
      ...data,
      compression: CompressionTypes.GZIP,
    });
    await this.disconnect();
    return recordMetadata;
  }
}
