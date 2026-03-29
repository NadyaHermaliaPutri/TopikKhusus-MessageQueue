const rabbitmq = require('./rabbitmq');
const { consumerType } = require('./config');
const { sendEmail, sendSms, sendFcm } = require('./actions');
const logger = require('./logger');

const handlerMap = {
  email: sendEmail,
  sms: sendSms,
  fcm: sendFcm,
};

if (!handlerMap[consumerType]) {
  throw new Error(`Unknown consumer type ${consumerType}. Expected one of email/sms/fcm`);
}

const stopSignal = { stopped: false, unsubscribe: null };

process.on('SIGINT', async () => {
  stopSignal.stopped = true;
  if (stopSignal.unsubscribe) await stopSignal.unsubscribe();
  await rabbitmq.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  stopSignal.stopped = true;
  if (stopSignal.unsubscribe) await stopSignal.unsubscribe();
  await rabbitmq.close();
  process.exit(0);
});

(async function main() {
  try {
    await rabbitmq.connect();
    await rabbitmq.consume(consumerType, handlerMap[consumerType], stopSignal);
    logger.info(`Consumer running type=${consumerType}`);
  } catch (err) {
    logger.error('Consumer error', err);
    process.exit(1);
  }
})();
