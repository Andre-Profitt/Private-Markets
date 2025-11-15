import { Kafka, Producer, Consumer } from 'kafkajs';

export class KafkaClient {
  private kafka: Kafka;
  private producer?: Producer;

  constructor(brokers: string[], clientId: string) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }
    return this.producer;
  }

  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }
}
