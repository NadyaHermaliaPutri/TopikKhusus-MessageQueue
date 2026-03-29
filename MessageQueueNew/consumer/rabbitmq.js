const amqplib = require('amqplib');
const { rabbitmqUrl, exchangeName } = require('./config');
const logger = require('./logger');

class RabbitMQConsumer {
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
    logger.info(`Consumer connected to ${this.url}, exchange=${this.exchangeName}`);
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async consume(queueName, handler, stopSignal) {
    const queue = await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queue.queue, this.exchangeName, '');

    const consumer = await this.channel.consume(queue.queue, async (msg) => {
      if (!msg) return;
      if (stopSignal.stopped) {
        this.channel.nack(msg, false, true);
        return;
      }

      const raw = msg.content.toString('utf-8');
      logger.info('Raw message from queue=%s: %s', queueName, raw);

      try {
        const payload = JSON.parse(raw);
        handler(payload);
        this.channel.ack(msg);
      } catch (err) {
        logger.error('Failed to process message', err);
        this.channel.nack(msg, false, false);
      }
    }, { noAck: false });

    stopSignal.unsubscribe = async () => {
      await this.channel.cancel(consumer.consumerTag);
    };

    logger.info(`Consumer started for queue=${queueName}`);
    return consumer;
  }
}

module.exports = new RabbitMQConsumer();
