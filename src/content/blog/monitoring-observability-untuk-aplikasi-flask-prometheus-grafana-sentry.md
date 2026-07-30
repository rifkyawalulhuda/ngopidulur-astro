---
title: Monitoring & Observability untuk Aplikasi Flask (Prometheus, Grafana, Sentry)
description: Di era modern, menjalankan aplikasi di production tanpa sistem
  monitoring dan observability yang baik adalah seperti mengemudi mobil dengan
  kaca depan yang tertutup. Anda tidak akan tahu apa yang terjadi di dalam
  aplikasi sampai terjadi masalah besar.
pubDate: 2026-06-06T19:48:00.000Z
image: /image/hardware-sentry-opentelemetry-collector-grafana.webp
draft: false
categories:
  - Teknologi
tags:
  - flask
  - monitoring
  - observability
  - python
series: "Flask Web"
seriesOrder: 8
---
Di artikel ini, kita akan membahas cara membangun sistem **Monitoring & Observability** yang solid untuk aplikasi Flask menggunakan tiga tools paling populer:

- **Prometheus** → Metrics & Alerting
- **Grafana** → Visualisasi Dashboard
- **Sentry** → Error Tracking & Performance Monitoring

---

## 1. Apa itu Monitoring dan Observability?

### Monitoring
Monitoring adalah proses mengumpulkan dan menganalisis data untuk mengetahui **kondisi kesehatan** aplikasi.

### Observability
Observability adalah kemampuan untuk **memahami kondisi internal** sistem hanya dari data eksternal yang dikumpulkan. Terdiri dari tiga pilar utama:

| Pilar           | Deskripsi                          | Tools yang Umum Digunakan      |
|-----------------|------------------------------------|--------------------------------|
| **Metrics**     | Data numerik dari waktu ke waktu   | Prometheus + Grafana           |
| **Logs**        | Catatan kejadian aplikasi          | ELK Stack, Loki, Papertrail    |
| **Traces**      | Alur request antar layanan         | Jaeger, Zipkin, Sentry         |

---

## 2. Mengapa Penting untuk Flask?

Aplikasi Flask yang berjalan di production perlu dipantau karena:

- Mendeteksi error sebelum user melaporkan
- Mengetahui performa endpoint mana yang lambat
- Melihat tren penggunaan resource
- Mendapatkan alert ketika ada masalah
- Mempercepat proses debugging

---

## 3. Prometheus + Grafana untuk Metrics

**Prometheus** adalah tools monitoring open source yang sangat populer untuk mengumpulkan metrics. **Grafana** digunakan untuk membuat dashboard visual yang indah.

### Instalasi (menggunakan Docker)

```yaml
# docker-compose.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

### Integrasi Prometheus dengan Flask

Gunakan library `prometheus-flask-exporter`:

```bash
pip install prometheus-flask-exporter
```

### Contoh Implementasi

```python
from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)

@app.route('/api/users')
def get_users():
    return {"users": []}
```

Setelah dijalankan, metrics akan tersedia di endpoint `/metrics`.

### Contoh Dashboard Grafana yang Berguna

- Request per second per endpoint
- Response time (p50, p95, p99)
- Error rate
- CPU & Memory usage
- Database query performance

---

## 4. Sentry untuk Error Tracking & APM

**Sentry** adalah tools yang sangat powerful untuk:

- Menangkap error secara otomatis
- Melihat stack trace lengkap
- Melihat performa transaksi (APM)
- Mendapatkan alert via email/Slack
- Melihat user yang terdampak error

### Instalasi

```bash
pip install sentry-sdk[flask]
```

### Konfigurasi di Flask

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project-id",
    integrations=[FlaskIntegration()],
    traces_sample_rate=0.2,  # 20% sampling untuk performance
    environment="production"
)

app = Flask(__name__)
```

### Fitur Utama Sentry

- **Error Tracking**: Otomatis menangkap exception
- **Performance Monitoring**: Melihat endpoint mana yang paling lambat
- **Release Tracking**: Menghubungkan error dengan versi deployment
- **User Context**: Melihat user mana yang mengalami error

---

## 5. Logging yang Baik

Selain metrics dan error tracking, logging yang terstruktur juga sangat penting.

### Rekomendasi Logging

Gunakan format JSON dan kirim ke centralized logging (seperti **Loki** atau **ELK Stack**).

Contoh konfigurasi logging sederhana:

```python
import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=5)
handler.setFormatter(logging.Formatter(
    '{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}'
))
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)
```

---

## 6. Arsitektur Monitoring yang Direkomendasikan

Berikut arsitektur monitoring yang umum digunakan di production:

```
Flask App
   ├── Prometheus Exporter → Prometheus → Grafana (Dashboard)
   ├── Sentry SDK → Sentry (Error + APM)
   └── Structured Logs → Loki / ELK Stack
```

---

## 7. Best Practices Monitoring & Observability

| Praktik                              | Rekomendasi |
|--------------------------------------|-------------|
| Gunakan **RED Method**               | Rate, Errors, Duration per endpoint |
| Gunakan **USE Method**               | Utilization, Saturation, Errors (untuk resource) |
| Sampling di Sentry                   | Jangan 100% untuk aplikasi dengan traffic tinggi |
| Alert yang actionable                | Jangan terlalu banyak alert (alert fatigue) |
| Dashboard yang fokus                 | Buat dashboard untuk tim berbeda (Dev, SRE, Business) |
| Monitor dependency eksternal         | Database, Redis, Third-party API |
| Simpan metrics historis              | Minimal 15-30 hari |

---

## 8. Tools Alternatif

| Kebutuhan             | Tools Alternatif                     | Kelebihan |
|-----------------------|--------------------------------------|---------|
| Metrics + Dashboard   | Prometheus + Grafana, Datadog        | Open source vs All-in-one |
| Error Tracking        | Sentry, Rollbar, Bugsnag             | Sentry paling populer |
| Logging               | Loki + Grafana, ELK, Papertrail      | Loki ringan |
| Full Observability    | OpenTelemetry + Jaeger + Prometheus  | Standar terbuka |
| All-in-one            | Datadog, New Relic, Dynatrace        | Mahal tapi lengkap |

---

## Kesimpulan

**Monitoring dan Observability** adalah investasi yang sangat penting untuk aplikasi production. Dengan kombinasi:

- **Prometheus + Grafana** → Untuk metrics dan visualisasi
- **Sentry** → Untuk error tracking dan performance monitoring
- **Logging terstruktur** → Untuk investigasi mendalam

Anda akan memiliki visibilitas yang jauh lebih baik terhadap kondisi aplikasi Anda.

Ingat prinsip penting ini:
> **"You can’t fix what you can’t see."**

Mulailah dengan mengintegrasikan **Sentry** (paling cepat memberikan value), kemudian tambahkan **Prometheus + Grafana** untuk metrics, dan lengkapi dengan logging yang baik.
