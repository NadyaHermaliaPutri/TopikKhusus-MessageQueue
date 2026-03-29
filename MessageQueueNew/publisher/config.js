const { config } = require('dotenv');
config();

module.exports = {
  port: process.env.PUBLISHER_PORT || 8080,
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
  exchangeName: process.env.EXCHANGE_NAME || 'notifications'
};
