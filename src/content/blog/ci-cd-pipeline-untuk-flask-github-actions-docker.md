---
title: CI/CD Pipeline untuk Flask (GitHub Actions + Docker)
description: Di era modern, proses pengembangan dan deployment aplikasi tidak
  lagi dilakukan secara manual. CI/CD (Continuous Integration / Continuous
  Deployment) adalah praktik yang memungkinkan tim untuk mengintegrasikan kode
  secara terus-menerus dan merilis perubahan dengan cepat serta aman.
pubDate: 2026-06-06T20:03:00.000Z
image: /image/maxresdefault.webp
draft: false
categories:
  - Teknologi
tags:
  - flask
  - web-development
  - python
  - docker
  - github
  - ci/cd
  - pipeline
---
Di artikel ini, kita akan membahas cara membangun **CI/CD Pipeline** untuk aplikasi Flask menggunakan **GitHub Actions** dan **Docker**.

---

## 1. Apa itu CI/CD?

| Istilah | Arti | Tujuan |
|---------|------|--------|
| **CI (Continuous Integration)** | Mengintegrasikan kode secara otomatis setiap ada perubahan | Mendeteksi error lebih awal |
| **CD (Continuous Delivery)** | Otomatisasi proses rilis | Siap deploy kapan saja |
| **CD (Continuous Deployment)** | Otomatisasi proses deploy | Deploy otomatis ke production |

---

## 2. Mengapa CI/CD Penting untuk Flask?

Manfaat utama:

- Otomatis menjalankan test setiap ada commit
- Memastikan kode selalu dalam kondisi deployable
- Mengurangi human error saat deployment
- Mempercepat feedback loop
- Meningkatkan kualitas kode secara keseluruhan

---

## 3. Komponen Pipeline yang Direkomendasikan

Pipeline CI/CD yang baik untuk Flask biasanya memiliki tahapan berikut:

1. **Checkout Code**
2. **Setup Environment** (Python + Dependencies)
3. **Linting** (flake8, black, isort)
4. **Testing** (pytest)
5. **Build Docker Image**
6. **Push Docker Image** (ke registry)
7. **Deploy** (ke server / platform)

---

## 4. Setup GitHub Actions

Buat folder dan file workflow:

```
.github/
└── workflows/
    └── flask-ci-cd.yml
```

### Contoh Workflow Dasar

```yaml
name: Flask CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest flake8

    - name: Lint with flake8
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

    - name: Test with pytest
      run: |
        pytest --cov=app --cov-report=xml
```

---

## 5. Menambahkan Docker Build

```yaml
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-flask-app:latest
```

---

## 6. Deployment ke Server (VPS)

Contoh deployment ke VPS menggunakan SSH:

```yaml
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /path/to/your/app
          docker pull ${{ secrets.DOCKERHUB_USERNAME }}/my-flask-app:latest
          docker-compose down
          docker-compose up -d
```

---

## 7. Deployment ke Platform Modern (Render / Railway)

Jika menggunakan platform seperti **Render** atau **Railway**, Anda bisa menggunakan webhook atau built-in integration.

Contoh untuk Render:

```yaml
    - name: Deploy to Render
      run: |
        curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 8. Best Practices CI/CD untuk Flask

| Praktik                              | Rekomendasi |
|--------------------------------------|-------------|
| Jalankan test di setiap push & PR    | Wajib |
| Gunakan matrix untuk multiple Python version | Bagus untuk proyek besar |
| Cache dependencies                   | Mempercepat pipeline |
| Gunakan Docker multi-stage build     | Image lebih kecil |
| Simpan secret di GitHub Secrets      | Jangan hardcode |
| Deploy otomatis hanya dari branch `main` | Hindari deploy dari branch development |
| Gunakan linter + formatter           | flake8, black, isort |
| Laporkan coverage                    | Gunakan Codecov atau GitHub Actions coverage |

---

## 9. Contoh Workflow Lengkap

Berikut adalah contoh workflow yang lebih lengkap:

```yaml
name: Flask CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt pytest flake8 pytest-cov
      - run: flake8 .
      - run: pytest --cov=app --cov-report=xml

  build-and-deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: myapp:latest
      # Tambahkan step deploy di sini
```

---

## Kesimpulan

Menerapkan **CI/CD Pipeline** dengan GitHub Actions + Docker adalah salah satu langkah terbaik yang bisa Anda ambil untuk meningkatkan kualitas dan kecepatan pengembangan aplikasi Flask.

Manfaat utama:
- Deteksi bug lebih cepat
- Deployment yang konsisten dan aman
- Mengurangi pekerjaan manual
- Meningkatkan kolaborasi tim

Mulailah dengan pipeline sederhana (Lint + Test), lalu tambahkan Docker build dan deployment secara bertahap.

Dengan CI/CD yang baik, Anda bisa fokus pada pengembangan fitur tanpa khawatir proses rilis menjadi bottleneck.
