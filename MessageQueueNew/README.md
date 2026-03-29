# MessageQueueNew (Node.js Edition)

## Project Overview

`MessageQueueNew` sekarang diimplementasikan ulang dengan Node.js (JavaScript) sebagai publisher/consumer yang dipisah:

- `publisher/`: Express API `POST /publish` untuk publish payload ke RabbitMQ fanout exchange.
- `consumer/`: query consumer dengan `CONSUMER_TYPE` (`email`, `sms`, `fcm`) yang membaca dari exchange yang sama.
- `rabbitmq`: connection dan exchange/queue management dikurangi duplikasi.
- payload domain: `order_id`, `user_id`, `content`, `timestamp`.

## Architecture

```
+-----------+      +----------------------+      +--------------------+
| HTTP POST | ---> | Node.js Publisher    | ---> | RabbitMQ Exchange  |
| /publish  |      | (Express + amqplib)  |      | (fanout notifications)
+-----------+      +----------------------+      +------+-------+------+
                                                    |       |      |
                                            +-------+  +----+  +---+  
                                            | Email q|  | SMS q| | FCM q|
                                            +-------+  +----+  +---+
                                               |          |       |
                                          +----v----+  +--v---+ +--v----+
                                          | Email   |  | SMS  | | FCM   |
                                          | Consumer|  |Consumer| |Consumer|
                                          +---------+  +------+ +-------+
```

## Why Node.js

- Ecosystem `amqplib` / Express ideal untuk microservice I/O-heavy.
- Ringan, cold-start cepat, mudah dijalankan dengan `npm`.
- Konsistensi dan pendistribusian lebih baik pada container / cloud.

## Prerequisites

- Node.js 18+
- RabbitMQ server running (default `amqp://guest:guest@localhost:5672/`)

## Setup

```bash
cd "d:/data_iyaa/SEMESTER 6/Topik Khusus/MessageQueue/MessageQueueNew"
npm install
```

## Running

### Publisher

```bash
set RABBITMQ_URL=amqp://guest:guest@localhost:5672/
set EXCHANGE_NAME=notifications
set PUBLISHER_PORT=8080
npm run start:publisher
```

### Consumer

#### Windows (cmd/powershell)
```bash
set RABBITMQ_URL=amqp://guest:guest@localhost:5672/
set EXCHANGE_NAME=notifications
set CONSUMER_TYPE=email
npm run start:consumer:email
```

Untuk SMS/FCM:
```bash
set CONSUMER_TYPE=sms
npm run start:consumer:sms

set CONSUMER_TYPE=fcm
npm run start:consumer:fcm
```

#### Linux/macOS
```bash
CONSUMER_TYPE=email npm run start:consumer:email
CONSUMER_TYPE=sms npm run start:consumer:sms
CONSUMER_TYPE=fcm npm run start:consumer:fcm
```

## Testing

```bash
npm test
```

## Key Design Decisions

- `Express` untuk API HTTP publik.
- `amqplib` untuk RabbitMQ publikasi/consumption.
- `dotenv` & env vars untuk config, tidak hardcode.
- `pino` untuk structured log.
- consumer ditentukan dengan `CONSUMER_TYPE` environment variable.
- folder terpisah `publisher/` dan `consumer/` sesuai arsitektur awal.
