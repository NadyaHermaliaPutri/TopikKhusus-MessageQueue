const amqplib = require('amqplib');
const logger = require('./logger');
const { rabbitmqUrl, exchangeName } = require('./config');

class RabbitMQPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = exchangeName;
    this.url = rabbitmqUrl;
  }

  async connect() {
    this.connection = await amqplib.connect(this.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
    logger.info(`Publisher connected to ${this.url}, exchange=${this.exchangeName}`);
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async publish(message) {
    const payload = Buffer.from(JSON.stringify(message));
    const sent = this.channel.publish(this.exchangeName, '', payload, {
      contentType: 'application/json',
      persistent: true,
      deliveryMode: 2,
    });
    if (!sent) {
      throw new Error('failed to publish message');
    }
    logger.info('Message published: %o', message);
  }
}

module.exports = new RabbitMQPublisher();
