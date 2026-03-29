const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const rabbitmq = require('../publisher/rabbitmq');
const app = express();
app.use(bodyParser.json());
app.post('/publish', async (req, res) => {
  const body = req.body;
  if (!body.order_id) return res.status(400).send({ code: 400 });
  await rabbitmq.publish(body);
  res.send({ code: 200 });
});

describe('publisher path', () => {
  it('returns 400 for invalid request', async () => {
    const res = await request(app).post('/publish').send({});
    expect(res.statusCode).toBe(400);
  });
});
