const express = require('express');
const bodyParser = require('body-parser');
const rabbitmq = require('./rabbitmq');
const { port } = require('./config');
const logger = require('./logger');

const app = express();
app.use(bodyParser.json());

function validateMessage(body) {
  if (!body || typeof body !== 'object') return 'payload must be object';
  const fields = ['order_id', 'user_id', 'content', 'timestamp'];
  for (const field of fields) {
    if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
      return `${field} is required and must be non-empty string`;
    }
  }
  return null;
}

app.post('/publish', async (req, res) => {
  const error = validateMessage(req.body);
  if (error) return res.status(400).json({ code: 400, message: error });

  try {
    await rabbitmq.publish(req.body);
    return res.status(200).json({ code: 200, message: 'Message published successfully' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ code: 500, message: 'Failed to publish message' });
  }
});

async function main() {
  try {
    await rabbitmq.connect();
    app.listen(port, () => {
      logger.info(`Publisher listening on http://localhost:${port}`);
    });
  } catch (err) {
    logger.error('Failed to start publisher', err);
    process.exit(1);
  }
}

main();
