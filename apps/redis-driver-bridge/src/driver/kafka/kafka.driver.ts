import { CompressionTypes, Kafka, KafkaConfig, Producer, ProducerRecord } from 'kafkajs';

export class KafkaDriver {
  private kafkaClient: Kafka = null;
  private producer: Producer = null;

  constructor() {
    this.config();
  }

  private config() {
    const kafkaConnectionValueInString = process?.env?.KAFKA_CLIENT_CONFIG_VALUE ?? '';
    const kafkaConnectionValue: KafkaConfig = JSON.parse(kafkaConnectionValueInString);
    const kafka = new Kafka(kafkaConnectionValue);
    this.kafkaClient = kafka;
  }

  private async connect() {
    const producer = this.kafkaClient.producer();
    await producer.connect();
    this.producer = producer;
  }

  public async send(data: ProducerRecord) {
    await this.connect();
    const recordMetadata = await this.producer.send({
      ...data,
      compression: CompressionTypes.GZIP,
    });
    return recordMetadata;
  }
}

export const KafkaDriverInstance = new KafkaDriver();
