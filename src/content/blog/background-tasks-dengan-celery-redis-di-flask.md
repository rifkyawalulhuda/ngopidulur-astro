---
title: Background Tasks dengan Celery + Redis di Flask
description: Dalam pengembangan aplikasi web modern, tidak semua proses bisa
  (dan seharusnya) dilakukan secara sinkron di dalam request cycle.
  Proses-proses yang berat seperti mengirim email, generate laporan, resize
  gambar, atau sinkronisasi data sebaiknya dijalankan di background.
pubDate: 2026-06-06T19:58:00.000Z
image: /image/dockerize-a-flask-celery-and-redis-application-with-docker-compose.webp
draft: false
categories:
  - Teknologi
tags:
  - flask
  - celery
  - redis
  - python
  - web-development
  - background-task
series: "Flask Web"
seriesOrder: 4
---
Di artikel ini, kita akan membahas cara mengimplementasikan **Background Tasks** di Flask menggunakan **Celery** dengan **Redis** sebagai message broker.

---

## 1. Mengapa Perlu Background Tasks?

Beberapa alasan utama:

- Menghindari request timeout
- Meningkatkan responsivitas aplikasi
- Memproses tugas yang berat tanpa membebani web server
- Menjalankan tugas secara asinkron dan terjadwal
- Meningkatkan skalabilitas

Contoh tugas yang cocok dijalankan di background:
- Mengirim email
- Generate PDF / laporan
- Resize dan optimasi gambar
- Sinkronisasi data dengan layanan pihak ketiga
- Proses machine learning / analisis data

---

## 2. Apa itu Celery?

**Celery** adalah distributed task queue yang sangat populer di ekosistem Python. Celery memungkinkan Anda menjalankan tugas secara asinkron di luar request cycle.

**Komponen Utama Celery:**

| Komponen         | Fungsi |
|------------------|--------|
| **Task**         | Fungsi Python yang akan dijalankan di background |
| **Broker**       | Message queue (Redis / RabbitMQ) |
| **Worker**       | Proses yang menjalankan task |
| **Result Backend** | Tempat menyimpan hasil task (opsional) |
| **Beat**         | Scheduler untuk periodic task |

---

## 3. Arsitektur Celery + Redis

```
Flask App
   ↓
   Celery Task (dipanggil secara async)
   ↓
Redis (Message Broker)
   ↓
Celery Worker (menjalankan task)
   ↓
Redis (Result Backend - opsional)
```

---

## 4. Instalasi

```bash
pip install celery redis
```

Jika menggunakan Flask, biasanya juga diperlukan:

```bash
pip install Flask-SQLAlchemy Flask-Mail
```

---

## 5. Konfigurasi Celery di Flask

### Struktur Proyek yang Direkomendasikan

```
myapp/
├── app/
│   ├── __init__.py
│   ├── tasks.py
│   └── celery.py
├── celery_worker.py
└── run.py
```

### `app/celery.py`

```python
from celery import Celery

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
```

### `app/__init__.py`

```python
from flask import Flask
from .celery import make_celery

app = Flask(__name__)
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379/0',
    CELERY_RESULT_BACKEND='redis://localhost:6379/0'
)

celery = make_celery(app)
```

---

## 6. Membuat Task

### `app/tasks.py`

```python
from . import celery
from time import sleep

@celery.task(bind=True, max_retries=3)
def send_welcome_email(self, user_id):
    try:
        # Logika mengirim email
        print(f"Sending welcome email to user {user_id}")
        sleep(5)  # Simulasi proses berat
        return f"Email sent to user {user_id}"
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

---

## 7. Memanggil Task dari Flask

```python
from flask import Flask, jsonify
from .tasks import send_welcome_email

@app.route('/register', methods=['POST'])
def register():
    # ... proses registrasi user ...
    
    # Panggil task secara asynchronous
    send_welcome_email.delay(user.id)
    
    return jsonify({"message": "User registered successfully"}), 201
```

Perbedaan pemanggilan:
- `.delay()` → Asynchronous (paling umum)
- `.apply_async()` → Bisa menambahkan countdown, eta, dll
- `()` → Synchronous (jarang digunakan)

---

## 8. Menjalankan Celery Worker

```bash
celery -A app.celery worker --loglevel=info
```

Atau buat file `celery_worker.py`:

```python
from app import celery

if __name__ == '__main__':
    celery.start()
```

Jalankan dengan:

```bash
python celery_worker.py
```

---

## 9. Monitoring dengan Flower

**Flower** adalah tool monitoring untuk Celery yang sangat berguna.

```bash
pip install flower
```

Jalankan:

```bash
celery -A app.celery flower
```

Akses di: `http://localhost:5555`

Flower menampilkan:
- Task yang sedang berjalan
- Task yang gagal
- Statistik worker
- Grafik performa

---

## 10. Periodic Tasks (Celery Beat)

Untuk menjalankan task secara terjadwal:

### Konfigurasi Beat

```python
app.config['CELERY_BEAT_SCHEDULE'] = {
    'send-daily-report': {
        'task': 'app.tasks.send_daily_report',
        'schedule': 86400.0,  # Setiap 24 jam
    },
}
```

Jalankan beat:

```bash
celery -A app.celery beat --loglevel=info
```

---

## 11. Error Handling & Retries

Celery menyediakan mekanisme retry yang powerful:

```python
@celery.task(bind=True, max_retries=5, default_retry_delay=60)
def process_data(self, data_id):
    try:
        # proses data
    except Exception as exc:
        raise self.retry(exc=exc)
```

Anda juga bisa menggunakan `autoretry_for`:

```python
from celery import Celery
from requests.exceptions import RequestException

@celery.task(autoretry_for=(RequestException,), retry_kwargs={'max_retries': 3})
def call_external_api():
    ...
```

---

## 12. Best Practices

| Praktik                              | Rekomendasi |
|--------------------------------------|-------------|
| Gunakan `bind=True` jika butuh retry | Sangat disarankan |
| Jangan lakukan query database di task tanpa app context | Gunakan `with app.app_context()` |
| Gunakan `max_retries` dan `countdown` | Hindari spam retry |
| Monitor dengan Flower                | Wajib di production |
| Gunakan Redis sebagai broker         | Ringan dan cepat |
| Pisahkan task ke file terpisah       | Lebih rapi |
| Gunakan `task_always_eager = True` di testing | Memudahkan testing |

---

## Kesimpulan

**Celery + Redis** adalah kombinasi yang sangat powerful untuk menangani background tasks di aplikasi Flask. Dengan menggunakan Celery, Anda bisa:

- Membuat aplikasi lebih responsif
- Menjalankan proses berat secara asinkron
- Menjadwalkan tugas secara otomatis
- Meningkatkan skalabilitas aplikasi

Meskipun ada sedikit kompleksitas dalam setup awal, manfaat jangka panjangnya sangat besar, terutama untuk aplikasi yang memiliki banyak proses berat.

Mulailah dengan tugas sederhana (seperti mengirim email), lalu kembangkan sesuai kebutuhan proyek Anda.
