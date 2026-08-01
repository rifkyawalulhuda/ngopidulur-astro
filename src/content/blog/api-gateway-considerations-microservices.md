---
title: "API Gateway di Arsitektur Microservices: Panduan Lengkap"
description: Panduan lengkap dari white paper IBM tentang API Gateway di
  microservices - single entry point, security, service discovery, orchestration,
  monitoring, HA, dan scaling.
pubDate: 2026-09-26T08:00:00.000Z
image: /image/apigee-apis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - Microservices
  - APIGateway
series: "APIs for Dummies"
seriesOrder: 8
---

Di dunia microservices yang semakin kompleks, **API Gateway** adalah komponen krusial yang sering terlupakan. White paper ini oleh Sanjay Gadge dan Vijaya Kotwani (IBM) membahas peran API Gateway sebagai **single entry point** dan **anti-corruption layer** untuk arsitektur microservices.

## Daftar Isi


- [Mengapa API Gateway Penting di Microservices?](#mengapa-api-gateway-penting-di-microservices)
- [Konsep Dasar: Reverse Proxy dan Anti-Corruption Layer](#konsep-dasar-reverse-proxy-dan-anti-corruption-layer)
- [Security: Authentication, Authorization, dan Threat Protection](#security-authentication-authorization-dan-threat-protection)
- [Service Registry dan Service Discovery](#service-registry-dan-service-discovery)
- [Orchestration dan Transformation](#orchestration-dan-transformation)
- [Monitoring dan Health Checks](#monitoring-dan-health-checks)
- [Load Balancing dan Scaling](#load-balancing-dan-scaling)
- [High Availability dan Failover](#high-availability-dan-failover)
- [Kesimpulan dan Best Practices](#kesimpulan-dan-best-practices)

## Mengapa API Gateway Penting di Microservices?


Di era digital, customer mengharapkan pengalaman yang seragam dan cepat di semua channel. **Microservice architecture** sering ditawarkan sebagai solusi, tapi tanpa layer penolong, kelebihannya justru sulit dikelola.

**Kelebihan microservices:**

- Independent deployment — tiap service bisa di-update tanpa restart service lain
- Scalability — scale per service, bukan monolit utuh
- Technology diversity — bahasa/stack berbeda per service
- Fault isolation — failure di satu service tidak otomatis meruntuhkan semua

**Kelemahan tanpa API Gateway:**

- Multiple entry points (banyak URL service yang harus diingat client)
- Policy tersebar (security, rate limiting, auth di banyak tempat)
- Client harus tahu banyak service URL dan sering implement discovery sendiri
- Monitoring dan observability tersebar
- Evolusi API sulit karena setiap service punya kontrak sendiri

API Gateway hadir sebagai **single entry point** yang merapikan masalah di atas.

## Konsep Dasar: Reverse Proxy dan Anti-Corruption Layer


API Gateway berfungsi sebagai titik masuk tunggal untuk semua microservices. Dua konsep fundamental yang perlu dipahami adalah peran sebagai reverse proxy dan anti-corruption layer.


### API Gateway sebagai Reverse Proxy


Tanpa API Gateway, client sering berkomunikasi langsung ke banyak service. Dengan gateway, client hanya mengenal satu pintu masuk.

![Dengan vs Tanpa API Gateway](/image/api-gateway-without-with.svg)

(bisa ada load balancer di depan atau di belakang gateway)

**Kelebihan pola ini:**

- Client tidak perlu tahu detail URL internal service
- Gateway bisa routing, transformation, dan policy enforcement
- Complex backend disembunyikan di belakang facade tunggal

### API Gateway sebagai Anti-Corruption Layer


Dalam Domain-Driven Design (DDD), **Anti-Corruption Layer** mencegah perubahan di domain internal merembes ke API eksternal.

API Gateway berperan sebagai anti-corruption layer ketika:

- Backend service evolve (API berubah) tanpa memaksa client ikut berubah
- Client tetap memakai URL yang stabil
- Gateway melakukan translation: rename field, add/remove field, ganti path

Contoh konsep:

- Client memanggil `/orders`
- Backend setelah refactor memakai `/v2/orders`
- Gateway menerjemahkan antara kedua kontrak

Contoh request yang melewati gateway:

```http
POST /orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "customerName": "John",
  "flightNumber": 1001,
  "class": "Business"
}
```

Gateway bisa meneruskan atau mentransformasi ke backend:

```http
POST /v2/orders HTTP/1.1
Host: orders.internal
Content-Type: application/json
X-Request-Id: req-9f3a

{
  "customer": "John",
  "flight_id": 1001,
  "cabin": "Business"
}
```

## Security: Authentication, Authorization, dan Threat Protection


Security adalah persyaratan utama enterprise. API Gateway idealnya menjadi tempat pusat penerapan kebijakan keamanan, bukan diulang di setiap microservice.

### Authentication dan Authorization


Solusi yang direkomendasikan white paper: **federated identity**.

**Federated identity** (SAML, OAuth 2.0, OpenID Connect) cocok untuk microservices karena:

- Tidak perlu implement auth penuh di setiap service
- Reusable across services
- Bisa diintegrasikan ke on-premise (Active Directory) maupun cloud (Azure AD, AWS IAM)

Alur ringkas di gateway:

1. Client mengirim credential/token ke gateway
2. Gateway validasi token ke authorization server
3. Jika valid, request diteruskan ke microservice (sering dengan claim/header yang sudah di-enrich)
4. Service fokus ke business logic, bukan login flow

Contoh header yang sering dilampirkan client:

```http
GET /orders/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
```

### Threat Protection


API Gateway biasanya menyediakan beberapa lapis proteksi:

### Threat Protection


API Gateway biasanya menyediakan beberapa lapis proteksi:

### Threat Protection


API Gateway biasanya menyediakan beberapa lapis proteksi:

1. **DDoS protection** — rate limiting, IP filtering, throttling
2. **Authentication & authorization** — API key, OAuth, mTLS
3. **Message protection** — TLS, encryption, schema validation
4. **API key / OAuth validation** — reject request yang tidak sah di tepi sistem

Dengan menaruh proteksi di gateway, policy security menjadi konsisten untuk seluruh platform.

## Service Registry dan Service Discovery


Microservices bersifat dinamis: instance bisa naik-turun kapan saja. Tanpa discovery, hardcoding IP/URL cepat rusak.

### Dua Pola Service Discovery


**Client-side discovery (populer):**

- Client (atau library di client side) tahu service registry
- Client melakukan lookup IP/URL service
- Contoh: Eureka, Consul, Kubernetes DNS
- Keunggulan: gateway bisa lebih fokus ke policy; client/library yang resolve target

**Server-side discovery:**

- Client hanya kirim request ke gateway/load balancer
- Gateway (atau LB) yang query service registry
- Gateway routing ke instance yang sehat
- Contoh: Netflix Zuul, NGINX Plus, banyak managed LB cloud

### Rekomendasi Implementasi


| Lingkungan | Pendekatan umum |
|------------|-----------------|
| Cloud (Azure/AWS) | Managed service discovery (Service Fabric, AWS Cloud Map/Service Discovery) |
| On-premise | Eureka, Consul, atau registry sejenis |
| Hybrid | Kombinasi managed cloud + registry on-prem |

**Contoh gateway yang sering dipakai:**

- IBM DataPower API Gateway
- NGINX Plus
- Kong
- Apache APISIX

## Orchestration dan Transformation


### Orchestration


Orchestration menggabungkan beberapa microservice menjadi satu use case bisnis (misalnya create order + reserve inventory + charge payment).

**Opsi 1 — Orchestration di API Gateway**

- Gateway menyusun beberapa call backend
- Kelemahan: melanggar Single Responsibility, gateway jadi bottleneck, lebih sulit test/debug

**Opsi 2 — Orchestration di microservice terpisah**

- Buat service khusus orchestration/BFF
- Kelemahan: tambah service, deployment lebih kompleks

**Rekomendasi praktis:**

- Use case sederhana: orchestration ringan di gateway masih wajar (sesuai white paper)
- Use case kompleks: dedicated orchestration service / BFF

### Transformation


Transformation mengubah format request/response antara client dan backend:

- Request transformation — ubah field, tambah header, normalisasi payload
- Response transformation — rapikan output untuk client
- Protocol transformation — misalnya SOAP ke JSON, XML ke JSON

Contoh transformasi field di edge:

javascript
// Pseudo-logic di API Gateway / middleware
const transformedRequest = {
  customer: body.customerName,
  flight_id: body.flightNumber,
  cabin: body.class,
};

const transformedResponse = {
  orderId: backend.order_number,
  totalPrice: backend.total_price,
  status: backend.status,
};

## Monitoring dan Health Checks


Karena gateway adalah single entry point, hampir semua traffic lewat sini. Monitoring gateway = visibilitas platform.

### Health Monitoring


API Gateway idealnya menyediakan:

- Health endpoint, misalnya `/health`
- Readiness probe — siap menerima traffic?
- Liveness probe — proses masih hidup?

Status health biasanya di-export ke sistem monitoring seperti Prometheus, Datadog, atau New Relic.

Contoh probe Kubernetes:

yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5

### Monitoring Data Flow


Data yang biasanya di-capture gateway:

- Volume request/response
- Latency
- Error rate
- Authentication failure
- Rate limiting event

Data ini dipakai untuk dashboard operasi, enforcement policy, capacity planning, dan respons insiden keamanan.

## Load Balancing dan Scaling


### Load Balancing


API Gateway atau load balancer di depannya umumnya mendukung:

- Round-robin
- Weighted round-robin (berdasarkan kapasitas)
- Least connections
- IP hash / sticky session

**Praktik umum:**

- Deploy multiple instance API Gateway
- Taruh load balancer di depan (NGINX, F5, Azure Load Balancer, dsb.)
- Pilih stateful (session sticky) atau stateless sesuai desain

Contoh konfigurasi NGINX di depan beberapa instance gateway:

nginx
upstream api_gateways {
    server api-gateway-1:8080;
    server api-gateway-2:8080;
    server api-gateway-3:8080;
}

server {
    listen 80;

    location / {
        proxy_pass http://api_gateways;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

### Scaling


**Horizontal scaling (paling direkomendasikan):**

- Tambah instance gateway
- Cocok untuk traffic API yang bisa di-distribusi

**Vertical scaling:**

- Naikkan CPU/RAM per instance
- Berguna jika workload belum mudah dipecah

**Rekomendasi:**

- Utamakan horizontal scaling
- Deploy gateway dalam mode HA
- Pakai load balancer untuk distribusi traffic

## High Availability dan Failover


API Gateway adalah komponen kritis: sering menjadi **satu-satunya entry point** ke microservices. Karena itu harus di-deploy high availability.

**Konfigurasi HA tipikal:**

- Minimal dua instance gateway
- Di belakang load balancer standar
- Load balancer secara periodik cek health gateway
- Jika satu instance down, traffic dialihkan ke instance sehat

**Best practices HA:**

- Active-active lebih disukai daripada single active
- Ada heartbeat / health check
- Uji skenario failover secara rutin
- Tentukan apakah gateway stateful atau stateless sejak awal desain

## Kesimpulan dan Best Practices


API Gateway penting di microservices karena membantu:

1. **Decouple** consumer dari detail backend service
2. **Sentralisasi policy** — security, rate limit, auth di satu tempat
3. **Reusability** — API yang sama bisa dipakai banyak client
4. **Monitoring** — single point of visibility untuk platform
5. **Scaling** — scale service tanpa memaksa client berubah

### Best Practices


1. Jadikan API Gateway sebagai single entry point
2. Implement federated identity untuk authentication dan authorization
3. Gunakan service discovery mechanism (client-side lebih direkomendasikan)
4. Hindari orchestration kompleks di gateway layer
5. Implement health checks dan monitoring sejak awal
6. Deploy gateway dalam mode HA
7. Gunakan load balancing untuk scaling
8. Terapkan transformation layer untuk fleksibilitas
9. Document semua endpoint dan policies
10. Test failover dan scaling secara rutin

### References


- Pattern: API Gateway / Backend for Front-End (Microservices.io)
- IBM White Paper: *Microservice Architecture — API Gateway Considerations*

**Sumber:** Sanjay Gadge dan Vijaya Kotwani, *Microservice Architecture: API Gateway Considerations* (White Paper, IBM).

## Referensi

- Gadge, S., & Kotwani, V. (2016). *Microservice Architecture: API Gateway Considerations* (White Paper). IBM.
- Newman, S. (2015). *Building Microservices*. O'Reilly Media.
- Richardson, C. (2018). *Microservices Patterns*. Manning Publications.
- Microservices.io. (2024). *Pattern: API Gateway / Backend for Front-End*. microservices.io.
