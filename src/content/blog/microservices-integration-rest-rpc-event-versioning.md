---
title: "Microservices Integration: REST, RPC, Event, dan Versioning"
description: Panduan integrasi microservices dari Sam Newman - shared database
  antipattern, REST vs RPC vs event-driven, orchestration vs choreography,
  semantic versioning, strangler pattern, dan integrasi COTS produk dengan API.
pubDate: 2026-09-21T08:00:00.000Z
image: /image/microservices-nginx-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - REST
  - EventDriven
  - SoftwareArchitecture
series: "Building Microservices"
seriesOrder: 2
---

Chapter 2 dari *Building Microservices* oleh Sam Newman membahas salah satu tantangan terbesar dalam arsitektur microservices: **bagaimana service-service ini berkomunikasi satu sama lain**. Pilihan integrasi yang salah bisa menciptakan coupling yang ketat — menghancurkan semua manfaat microservices yang sudah dicapai.

## Daftar Isi

- [Prinsip Integrasi yang Ideal](#prinsip-integrasi-yang-ideal)
- [The Shared Database Antipattern](#the-shared-database-antipattern)
- [Synchronous vs Asynchronous](#synchronous-vs-asynchronous)
- [Orchestration vs Choreography](#orchestration-vs-choreography)
- [Remote Procedure Calls (RPC)](#remote-procedure-calls-rpc)
- [REST: Representational State Transfer](#rest-representational-state-transfer)
- [Hypermedia Controls dan HATEOAS](#hypermedia-controls-dan-hateoas)
- [Event-Driven Integration](#event-driven-integration)
- [Versioning API](#versioning-api)
- [User Interface Integration](#user-interface-integration)
- [Strangler Pattern untuk Legacy Systems](#strangler-pattern-untuk-legacy-systems)
- [Integrasi COTS dan SaaS](#integrasi-cots-dan-saas)

## Prinsip Integrasi yang Ideal

Sebelum memilih teknologi integrasi, pahami dulu prinsip-prinsip yang harus dipenuhi:

**PRINSIP INTEGRASI MICROSERVICES:**

1. HIDE IMPLEMENTATION DETAILS
→ Consumer tidak tahu implementasi internal
→ Perubahan internal tidak merusak consumer
→ Hindari expose database schema langsung

2. KEEP APIs TECHNOLOGY AGNOSTIC
→ Jangan terikat satu teknologi tertentu
→ Consumer bisa ditulis dalam bahasa apapun

3. MAKE SERVICES EASY TO CONSUME
→ Developer experience yang baik
→ Dokumentasi yang jelas
→ Contoh yang bisa langsung dijalankan

4. HIDE INTERNAL IMPLEMENTATION
→ External API ≠ Internal implementation
→ Free to change internal tanpa breaking change

## The Shared Database Antipattern

Salah satu **antipattern paling berbahaya** dalam microservices adalah berbagi database antar service.

**SHARED DATABASE (ANTIPATTERN):**

![Pola Integrasi Microservices — Request/Response dan Event-Driven](/image/microservices-integration-patterns.svg)

**MASALAH:**

1. COUPLING tinggi:
- Perubahan schema → semua service mungkin rusak
- Tidak ada enkapsulasi domain

2. Salah satu service bisa bypass business logic:
- Service A bisa langsung UPDATE tabel service B
- Tidak ada validation, no business rules

3. Sulit melakukan independent deployment:
- Migration database memerlukan koordinasi semua tim

**DATABASE PER SERVICE (REKOMENDASI):**

Service A → [DB-A]
Service B → [DB-B]
Service C → [DB-C]

- Komunikasi via API atau Events, bukan shared DB

Jika memang butuh data dari service lain, akses via **API service tersebut** — bukan langsung ke database-nya.

## Synchronous vs Asynchronous

Dua pendekatan fundamental dalam komunikasi antar service:

SYNCHRONOUS (Request/Response):
- Client menunggu response sebelum lanjut

ASYNCHRONOUS (Event/Message):
- Client tidak menunggu
- Service mengonsumsi event kapanpun siap

### Kapan Synchronous?

- Operasi yang butuh response segera
- Simple CRUD operations
- Query data yang butuh hasil langsung
- Client butuh konfirmasi sukses/gagal

### Kapan Asynchronous?

- Long-running operations
- Fanout (satu event → banyak consumer)
- Operasi yang tidak perlu response segera
- Decoupling lebih penting dari latency

## Orchestration vs Choreography

Ketika ada proses bisnis yang melibatkan banyak service, ada dua pola koordinasi:

### Orchestration (Orkestra)

Satu service "dirigent" yang mengkoordinasikan service lain:

**ORCHESTRATION:**

-
Order Service
![Orchestration vs Choreography — dua pola koordinasi](/image/microservices-orchestration-choreography.svg)

Alur: Order Service memanggil setiap service secara eksplisit

**Masalah:** Order Service menjadi **God Service** — tahu terlalu banyak, coupling tinggi.

### Choreography (Koreografi)

Service merespons event tanpa koordinator terpusat:

**CHOREOGRAPHY:**

Contoh alur: saat pelanggan mendaftar, event `CustomerRegistered` dipublish ke **Event Bus**. Setiap service yang subscribe bereaksi secara independen — tanpa ada koordinator yang mengatur urutannya:

1. **Email Service** — menerima event, mengirim email welcome
2. **Loyalty Service** — menerima event, membuat akun loyalty
3. **Analytics Service** — menerima event, mencatat event registrasi

Setiap service tahu "apa yang harus dilakukan saat X terjadi". Tidak ada koordinator central.

**Keunggulan choreography:** loosely coupled, mudah menambah consumer baru. **Kelemahan:** sulit untuk melihat business flow secara keseluruhan.

Sam Newman merekomendasikan **choreography** sebagai default, tapi orchestration untuk flow yang kompleks.

## Remote Procedure Calls (RPC)

RPC memungkinkan memanggil fungsi di service lain seolah-olah lokal.

**RPC CALL:**

Client Code:
- user = userService.getUser(123)  // terasa seperti local call
- print(user.name)

Realita di balik layar:
Client → Network → Server → Proses → Network → Client

### Masalah dengan RPC

**PITFALLS RPC:**

1. NETWORK TIDAK RELIABLE:
- Network bisa timeout
- Packet bisa hilang
- Perlu handle retry, timeout, partial failure

2. TIGHT COUPLING (terutama SOAP/XML-RPC):
- Interface perubahan → semua client harus update
- Code generation menyembunyikan complexity

3. FALSE SENSE OF SECURITY:
- Terlihat seperti local call tapi sangat berbeda
- Developer lupa bahwa network bisa gagal

**Rekomendasi:** Jika pakai RPC, pastikan developer **sadar** mereka melakukan network call, bukan local call. Gunakan gRPC jika butuh performa tinggi dan type safety antar bahasa.

## REST: Representational State Transfer

REST adalah gaya arsitektur — bukan protokol — yang didasarkan pada prinsip web.

### Prinsip REST

**REST PRINCIPLES:**

1. RESOURCES (Sumber Daya):
- Setiap entitas direpresentasikan sebagai resource
- /customers/123
- /orders/456
- /products/789

2. HTTP VERBS yang bermakna:
GET    → baca resource (safe, idempotent)
POST   → buat resource baru
PUT    → update resource lengkap (idempotent)
PATCH  → update sebagian resource
DELETE → hapus resource (idempotent)

3. REPRESENTASI:
- Resource bisa direpresentasikan dalam berbagai format
- JSON (paling umum), XML, HTML

4. STATELESS:
- Setiap request mengandung semua info yang diperlukan
- Server tidak menyimpan client state

### Contoh REST API Design

**Contoh: Customer API**

```http
# Buat pelanggan baru
POST /customers
Body: {"name": "Rifky", "email": "rifky@example.com"}
Response 201: {"id": 123, "name": "Rifky", ...}

# Ambil data pelanggan
GET /customers/123
Response 200: {"id": 123, "name": "Rifky", ...}

# Update pelanggan
PUT /customers/123
Body: {"name": "Rifky Awalul", "email": "rifky@example.com"}

# Hapus pelanggan
DELETE /customers/123
Response 204: No Content

# List semua order pelanggan
GET /customers/123/orders
Response 200: [{"id": 456, "status": "shipped", ...}]
```

### REST vs RPC — Perbandingan

| Aspek | REST | RPC |
|-------|------|-----|
| Fokus | Resources (data) | Actions (fungsi) |
| Verbs | HTTP verbs | Custom methods |
| Teknologi | HTTP/HTTPS | gRPC, Thrift, dll |
| Discoverability | Lebih baik (HATEOAS) | Butuh dokumentasi |
| Performance | Baik | Lebih baik (binary) |
| Web-friendly | Sangat | Kurang |

## Hypermedia Controls dan HATEOAS

HATEOAS (Hypermedia as the Engine of Application State) adalah prinsip REST yang paling sering diabaikan — tapi sangat powerful.

**TANPA HATEOAS:**

GET /customers/123
{
- "id": 123,
- "name": "Rifky",
- "status": "active"
}
Client harus tahu sendiri: /customers/123/orders, /customers/123/delete, dll.

**DENGAN HATEOAS:**

GET /customers/123
{
- "id": 123,
- "name": "Rifky",
- "status": "active",
- "_links": {
- "self":   {"href": "/customers/123"},
- "orders": {"href": "/customers/123/orders"},
- "delete": {"href": "/customers/123", "method": "DELETE"},
- "suspend":{"href": "/customers/123/suspend", "method": "POST"}
- }
}

**Keunggulan HATEOAS:** client tidak perlu hardcode URL — mengikuti links. Perubahan URL di server tidak merusak client.

**Rekomendasi Sam Newman:** Gunakan **HAL (Hypertext Application Language)** sebagai format hypermedia. HAL lebih populer dari Swagger untuk use case hypermedia.

## Event-Driven Integration

Dalam event-driven architecture, service berkomunikasi melalui **events** — pemberitahuan bahwa sesuatu telah terjadi.

**EVENT-DRIVEN FLOW:**

Order Service
→ publishes: "OrderPlaced" event
- {orderId: 123, customerId: 456, items: [...]}

Message Broker (RabbitMQ / Kafka / SQS)
→ routes ke semua subscriber

Payment Service        ← subscribes: "OrderPlaced"
Inventory Service      ← subscribes: "OrderPlaced"
Notification Service   ← subscribes: "OrderPlaced"
Analytics Service      ← subscribes: "OrderPlaced"

### Keunggulan Event-Driven

1. **Temporal decoupling** — producer dan consumer tidak harus aktif bersamaan
2. **Location decoupling** — tidak perlu tahu alamat consumer
3. **Scalability** — mudah menambah consumer baru tanpa ubah producer
4. **Resilience** — kegagalan satu consumer tidak mempengaruhi yang lain

### Tantangan Event-Driven

1. **Eventual consistency** — data mungkin tidak langsung konsisten
2. **Debugging complexity** — sulit trace alur bisnis
3. **Message ordering** — urutan event mungkin tidak terjamin
4. **Schema evolution** — perubahan event schema bisa breaking

## Versioning API

Perubahan API adalah keniscayaan. Bagaimana mengelolanya tanpa merusak client yang ada?

### Semantic Versioning

SEMANTIC VERSIONING: MAJOR.MINOR.PATCH

1.0.0 → Initial release
1.1.0 → Tambah field baru (backward compatible) — MINOR up
1.2.3 → Bug fix — PATCH up
2.0.0 → Breaking change (hapus field, ubah format) — MAJOR up

### Strategi Versioning URL

**URL VERSIONING:**

- /v1/customers/123
- /v2/customers/123

Versi v1 tetap jalan → v2 bisa perkenalkan breaking changes

### Postel's Law (Robustness Principle)

> *"Be conservative in what you do, be liberal in what you accept from others."*

Implementasi dalam API:
- **Conservative output:** kirim hanya field yang diperlukan
- **Liberal input:** terima request meskipun ada field tambahan yang tidak dikenal

**TOLERANT READER PATTERN:**

// BURUK:
if (response.fields.length !== 5) throw Error("Invalid response")

// BAIK:
const name = response.name    // ambil hanya yang dibutuhkan
const email = response.email  // ignore field lain yang tidak dikenal

## User Interface Integration

Microservices juga mempengaruhi cara membangun UI.

**TIGA PENDEKATAN UI:**

1. MONOLITHIC FRONTEND + MICROSERVICES BACKEND:
-
**Backend for Frontend (BFF):** aplikasi React/Angular di sisi client memanggil BFF khusus yang mengagregasi data dari beberapa service backend untuk satu tampilan halaman.
- User API    Order API   Product API
- Masalah: UI team bottleneck

2. API GATEWAY + BFF (Backend for Frontend):
Mobile  → Mobile BFF  → Services
Web     → Web BFF     → Services
- BFF agregasi calls dari multiple services

3. MICRO FRONTENDS:
- Setiap service memiliki UI fragment sendiri
- Host menggabungkan fragments
- Masalah: konsistensi UI, UX seragam

## Strangler Pattern untuk Legacy Systems

Cara aman bermigrasi dari monolith ke microservices:

STRANGLER PATTERN (dari Sam Newman):

Langkah 1: Intercept semua calls ke monolith
Client → [Proxy] → Monolith

Langkah 2: Redirect beberapa calls ke microservice baru
Client → [Proxy] → Monolith (80% traffic)
→ New Service (20% traffic)

Langkah 3: Secara bertahap pindahkan lebih banyak
Client → [Proxy] → Monolith (20% traffic)
→ New Services (80% traffic)

Langkah 4: Monolith eventually bisa dihapus
Client → [Proxy] → New Services (100%)

**Analogi pohon ara pencekik (strangler fig):** Pohon ara tumbuh di sekitar pohon yang ada, secara perlahan mengambil alih hingga pohon aslinya mati dan bisa dilepaskan.

## Integrasi COTS dan SaaS

COTS (Commercial Off-The-Shelf) dan SaaS products sering digunakan dalam enterprise. Tantangan integrasi:

### Masalah Umum

**MASALAH INTEGRASI COTS:**

1. VENDOR LOCK-IN:
- Sulit ganti vendor tanpa major rewrite
- Priced for lock-in, not value

2. SHARED DATA ANTIPATTERN:
- Banyak produk COTS meng-expose database langsung
- Semua service reach into shared data store

3. LIMITED CUSTOMIZATION:
- Business logic terbatas pada apa yang vendor izinkan
- Plug-in API sering sangat terbatas

### Solusi: Wrapping COTS

**HIDE COTS BEHIND YOUR OWN SERVICE:**

External Services
**Pola Hide COTS:** buat service sendiri (misal CRM Service) yang membungkus produk COTS (commercial off-the-shelf) untuk menyembunyikan kompleksitas dan API vendor dari internal services. External services dan direct DB access tidak boleh menembus ke produk COTS secara langsung.

Benefits:
- Ganti COTS product tanpa ubah internal consumers
- Custom business logic di dalam wrapper
- Control atas data exposure
- Bisa mock untuk testing

Newman memberikan contoh klien yang meng-wrap CRM product:
- Awalnya, banyak sistem internal mengakses CRM API langsung
- Ini menciptakan coupling ke implementasi CRM
- Solusi: buat service sendiri yang wrap CRM, semua akses lewat situ
- Ketika vendor berubah atau CRM diganti → hanya wrapper yang perlu diupdate

## Ringkasan

| Topik | Rekomendasi Sam Newman |
|-------|----------------------|
| Database | Database per service, tidak shared |
| Sync vs Async | Async default, sync jika butuh response langsung |
| Koordinasi | Choreography default, orchestration untuk flow kompleks |
| REST vs RPC | REST untuk public API, gRPC untuk internal performa tinggi |
| Hypermedia | Gunakan HAL/HATEOAS untuk discoverability |
| Versioning | Semantic versioning + Postel's Law |
| Legacy migration | Strangler Pattern, incremental |
| COTS | Wrap dalam service sendiri |

**Sumber:** Sam Newman, *Building Microservices* (2015), O'Reilly Media. Preview Edition sponsored by NGINX.
