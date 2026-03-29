const { config } = require('dotenv');
config();

module.exports = {
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
  exchangeName: process.env.EXCHANGE_NAME || 'notifications',
  consumerType: (process.env.CONSUMER_TYPE || 'email').toLowerCase(),
};
