# Analisis Arsitektur Sistem Message Queue

## Pendahuluan
Dokumen ini menganalisis arsitektur proyek MessageQueue, yang mengimplementasikan pola publish-subscribe menggunakan RabbitMQ. Fokus utama adalah pada desain sistem, alur kerja, dan praktik terbaik yang diterapkan.

## Ringkasan Proyek
Proyek ini terdiri dari dua implementasi utama:
- **MessageQueueCloning**: Versi asli dalam bahasa Go, dengan publisher HTTP dan konsumer untuk notifikasi email, SMS, dan FCM.
- **MessageQueueNew**: Reimplementasi dalam Node.js, dengan struktur yang lebih modular dan fokus pada skalabilitas.

Kedua versi menggunakan exchange fanout RabbitMQ untuk distribusi pesan ke multiple konsumer.

## Arsitektur Tingkat Tinggi
### Komponen Utama
- **Publisher**: Endpoint HTTP yang menerima payload JSON dan mempublikasikan ke RabbitMQ exchange.
- **Exchange Fanout**: Komponen RabbitMQ yang menduplikasi pesan ke semua queue terikat.
- **Queues**: Antrean khusus untuk setiap jenis notifikasi (email, SMS, FCM).
- **Consumers**: Proses yang mengkonsumsi pesan dari queue dan mengeksekusi aksi notifikasi.

### Struktur Kode
- **Go Version**:
  - `notification_publisher`: Handler HTTP dengan Echo framework.
  - `notification_consumer`: Konsumer terpisah per jenis, menggunakan goroutine untuk pemrosesan async.
- **Node.js Version**:
  - `publisher`: API Express dengan middleware validasi.
  - `consumer`: Konsumer dengan event loop async menggunakan amqplib.

## Alur Kerja Sistem
1. **Publikasi Pesan**:
   - Client mengirim POST request ke `/publish` dengan data JSON.
   - Publisher memvalidasi payload dan publish ke exchange fanout.
2. **Distribusi Pesan**:
   - Exchange fanout mengirim salinan pesan ke setiap queue yang terikat.
3. **Konsumsi Pesan**:
   - Konsumer masing-masing mendengarkan queue-nya.
   - Pesan diproses, di-ack secara manual untuk memastikan reliability.
4. **Pemrosesan Notifikasi**:
   - Berdasarkan jenis konsumer, pesan dikirim sebagai email, SMS, atau FCM.

## Pola Desain yang Diterapkan
- **Publish-Subscribe**: Decoupling antara publisher dan konsumer.
- **Clean Architecture**: Pemisahan layer (handler, usecase, repository, infrastructure).
- **Dependency Injection**: Konfigurasi dan koneksi di-inject secara manual.
- **Asynchronous Processing**: Goroutine di Go, async/await di Node.js.
- **Manual Acknowledgment**: Memastikan pesan tidak hilang jika konsumer gagal.

## Kelebihan dan Kekurangan
### Kelebihan
- **Skalabilitas**: Mudah menambah konsumer baru tanpa mengubah publisher.
- **Reliability**: Pesan disimpan di queue sampai di-ack.
- **Decoupling**: Komponen independen, memudahkan testing dan maintenance.
- **Multi-Language**: Implementasi di Go dan Node.js memungkinkan perbandingan.

### Kekurangan
- **Kompleksitas Setup**: Membutuhkan RabbitMQ server yang berjalan.
- **Overhead Network**: Pesan dikirim ke semua konsumer, meskipun tidak semua butuh.
- **Manual Management**: Ack dan nack perlu dikelola dengan hati-hati.
- **Resource Usage**: Multiple konsumer berjalan secara paralel.

## Diagram Arsitektur
```
[Client HTTP] --> [Publisher API] --> RabbitMQ Exchange (Fanout)
                                      |
                                      +--> Queue Email --> Consumer Email
                                      |
                                      +--> Queue SMS --> Consumer SMS
                                      |
                                      +--> Queue FCM --> Consumer FCM
```

## Kesimpulan
Arsitektur ini efektif untuk sistem notifikasi terdistribusi dengan fokus pada decoupling dan skalabilitas. Implementasi di dua bahasa memberikan wawasan tentang trade-offs antara performa (Go) dan ekosistem (Node.js). Untuk pengembangan lebih lanjut, pertimbangkan routing yang lebih spesifik atau integrasi dengan database untuk persistence.