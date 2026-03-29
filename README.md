# Message Queue

Nadya Hermalia Putri

2311082034

TRPL 3D

## Pengantar
Repositori ini menyediakan contoh implementasi sistem message queue menggunakan RabbitMQ untuk pola pub/sub. Kami menyediakan implementasi dalam beberapa bahasa pemrograman untuk memudahkan pembelajaran dan perbandingan.

## Struktur Proyek
- `MessageQueueCloning/`: Implementasi asli dalam Go
  - `notification_publisher/`: Publisher HTTP
  - `notification_consumer/`: Konsumer untuk email, SMS, FCM
- `MessageQueueNew/`: Implementasi ulang dalam Node.js
  - `publisher/`: API Express untuk publish pesan
  - `consumer/`: Konsumer yang mendengarkan antrean
- `docs/`: Dokumentasi analisis arsitektur

## Prasyarat
- Node.js 18+ (untuk MessageQueueNew)
- Go 1.20+ (untuk MessageQueueCloning)
- RabbitMQ server berjalan di localhost:5672
- Git untuk cloning repositori

## Instalasi dan Setup
### RabbitMQ
Pastikan RabbitMQ terinstal dan berjalan. Untuk Windows:
```powershell
rabbitmq-service start
```

### MessageQueueNew (Node.js)
```bash
cd MessageQueueNew
npm install
```

### MessageQueueCloning (Go)
```bash
cd MessageQueueCloning/notification_publisher
go mod tidy
go mod vendor

cd ../notification_consumer
go mod tidy
go mod vendor
```

## Menjalankan Aplikasi
### Versi Node.js
1. Publisher:
   ```bash
   cd MessageQueueNew
   npm run start:publisher
   ```

2. Konsumer:
   ```bash
   npm run start:consumer:email
   npm run start:consumer:sms
   npm run start:consumer:fcm
   ```

3. Test publish:
   ```bash
   curl -X POST http://localhost:8080/publish -H "Content-Type: application/json" -d '{"order_id":"123","user_id":"456","content":"Pesan baru","timestamp":"2026-03-29T12:00:00Z"}'
   ```

### Versi Go
1. Publisher:
   ```bash
   cd MessageQueueCloning/notification_publisher
   go run main.go
   ```

2. Konsumer:
   ```bash
   cd MessageQueueCloning/notification_consumer
   go run cmd/email/main.go
   go run cmd/sms/main.go
   go run cmd/fcm/main.go
   ```

## Arsitektur Sistem
Sistem menggunakan pola publisher-subscriber dengan RabbitMQ:
- Publisher mengirim pesan ke exchange fanout
- Exchange mendistribusikan pesan ke semua antrean terikat
- Setiap konsumer memproses pesan dari antreannya masing-masing

## Testing
Untuk versi Node.js:
```bash
cd MessageQueueNew
npm test
```

## Kontribusi
Proyek ini dikembangkan oleh Nadya Hermalia Putri sebagai bagian dari pembelajaran arsitektur perangkat lunak dan sistem terdistribusi. Fokus utama adalah pada pemisahan tanggung jawab dan skalabilitas.
