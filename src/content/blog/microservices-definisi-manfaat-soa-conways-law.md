---
title: "Microservices: Definisi, Manfaat, dan Perbandingan dengan SOA"
description: Panduan lengkap microservices dari buku Sam Newman - definisi small
  autonomous services, 8 manfaat utama, perbandingan dengan SOA, Conway's Law,
  prinsip loose coupling high cohesion, dan migration dari monolith ke microservices.
pubDate: 2026-09-20T08:00:00.000Z
image: /image/microservices-nginx-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - SoftwareArchitecture
  - SOA
  - DistributedSystems
series: "Building Microservices"
seriesOrder: 1
---

Industri software tidak pernah berhenti berevolusi. Selama beberapa tahun terakhir, terjadi pergeseran besar dalam cara kita membangun sistem — dari aplikasi monolitik besar menuju arsitektur yang lebih kecil, lebih terdistribusi, lebih otonom. Itulah microservices.

*Building Microservices* oleh **Sam Newman** (O'Reilly, 2015) adalah referensi definitif untuk memahami arsitektur ini. Edisi preview yang disponsori NGINX ini mencakup tiga chapter kunci yang membangun fondasi, teknik integrasi, dan strategi scaling di dunia microservices.

## Daftar Isi

- [Apa itu Microservices?](#apa-itu-microservices)
- [Seberapa Kecil itu "Micro"?](#seberapa-kecil-itu-micro)
- [8 Manfaat Utama Microservices](#8-manfaat-utama-microservices)
- [Microservices vs SOA](#microservices-vs-soa)
- [Prinsip Loose Coupling dan High Cohesion](#prinsip-loose-coupling-dan-high-cohesion)
- [Conway's Law dan Struktur Tim](#conways-law-dan-struktur-tim)
- [Migration dari Monolith](#migration-dari-monolith)
- [Kapan TIDAK Menggunakan Microservices?](#kapan-tidak-menggunakan-microservices)



## Apa itu Microservices?

> *"Microservices are small, autonomous services that work together."*

Definisi sederhana ini mengandung dua kata kunci yang penting:

1. **Small** — setiap service kecil dan fokus pada satu domain
2. **Autonomous** — setiap service bisa di-deploy, di-scale, dan dikembangkan secara independen

```
ARSITEKTUR MONOLITH vs MICROSERVICES

MONOLITH:
┌─────────────────────────────────────────┐
│           Single Application            │
│  ┌───────┐ ┌─────────┐ ┌────────────┐  │
│  │  UI   │ │Business │ │  Database  │  │
│  │Layer  │ │  Logic  │ │   Access   │  │
│  └───────┘ └─────────┘ └────────────┘  │
└─────────────────────────────────────────┘
Deploy sebagai satu unit → scale semua atau tidak sama sekali

MICROSERVICES:
┌──────────┐  ┌──────────┐  ┌──────────┐
│  User    │  │  Order   │  │ Payment  │
│ Service  │  │ Service  │  │ Service  │
│  [DB]    │  │  [DB]    │  │  [DB]    │
└──────────┘  └──────────┘  └──────────┘
     │               │              │
     └───────────────┴──────────────┘
              API / Message Bus
Deploy, scale, develop secara INDEPENDEN
```

Microservices adalah layanan **loosely coupled** yang dapat dideploy secara independen, masing-masing memodelkan **domain bisnis** tertentu.



## Seberapa Kecil itu "Micro"?

Pertanyaan yang sering muncul: seberapa kecil seharusnya sebuah microservice?

Newman memberikan beberapa panduan praktis:

### Prinsip Single Responsibility

> *"When it comes to how small is small enough, I like to think in terms of the Single Responsibility Principle."*

Setiap service harus melakukan **satu hal dan melakukannya dengan baik**. Ini terinspirasi dari Unix philosophy — program kecil yang fokus, digabungkan lewat pipe.

### Ukuran vs Kemampuan Rewrite

Indikator lain: **apakah service bisa ditulis ulang dalam 2 minggu?** Jika ya, ukurannya sudah tepat. Sam Newman pernah bertemu dengan tim yang mendefinisikan microservice sebagai "sesuatu yang bisa ditulis ulang dalam 2 minggu."

### Alignment dengan Struktur Tim

Faktor penting lainnya: **alignment dengan struktur tim**. Jika codebase terlalu besar untuk dikelola satu tim kecil, wajar untuk memecahnya.

```
PANDUAN UKURAN MICROSERVICE:

Terlalu besar jika:
  - Tim tidak bisa memahami codebase sepenuhnya
  - Deployment butuh koordinasi banyak tim
  - Perubahan kecil perlu waktu lama

Tepat ukurannya jika:
  - Satu tim kecil (2-8 orang) bisa memilikinya
  - Bisa ditulis ulang dalam waktu wajar
  - Fokus pada satu domain bisnis

Terlalu kecil jika:
  - Lebih banyak overhead komunikasi dari manfaatnya
  - Setiap request harus panggil 10+ services
```



## 8 Manfaat Utama Microservices

### 1. Technology Heterogeneity (Heterogenitas Teknologi)

Dengan sistem yang terdiri dari banyak service yang berkolaborasi, kita bisa menggunakan **teknologi berbeda di setiap service**. Ini memungkinkan memilih tool yang tepat untuk pekerjaan yang tepat.

```
CONTOH NYATA:
  Katalog produk → ElasticSearch (full-text search)
  Transaksi      → PostgreSQL (ACID transactions)
  Session user   → Redis (in-memory, fast)
  Analitik       → Hadoop/Spark (big data)
  ML Rekomendasi → Python + TensorFlow
```

Netflix dan Twitter membatasi pilihan bahasa dengan menggunakan JVM sebagai platform, mempertahankan fleksibilitas bahasa sambil memanfaatkan tooling JVM yang matang.

### 2. Resilience (Ketahanan)

Dalam arsitektur monolith, satu component yang gagal bisa menjatuhkan seluruh sistem. Dengan microservices, **kegagalan satu service tidak harus merusak keseluruhan**.

> *"If one component of a system fails, but that failure doesn't cascade, you can isolate the problem and the rest of the system can carry on working."*

### 3. Scaling (Skalabilitas)

Dalam monolith, kita harus men-scale seluruh aplikasi. Dengan microservices, kita bisa **men-scale hanya service yang membutuhkannya**.

```
TARGETED SCALING:

User Service:     1 instance   (traffic rendah)
Product Service:  3 instances  (traffic sedang)
Search Service:   10 instances (traffic tinggi — butuh scale!)
Order Service:    2 instances  (traffic sedang)
```

**Studi kasus Gilt:** Gilt memulai sebagai aplikasi Rails monolitik pada 2007. Pada 2009, sistemnya tidak mampu menangani beban. Dengan memecah bagian-bagian yang membutuhkan scale, mereka berhasil mengatasi masalah performa tanpa harus scale seluruh sistem.

### 4. Ease of Deployment (Kemudahan Deployment)

Perubahan pada satu baris kode di monolith bisa memerlukan deployment seluruh aplikasi — berisiko tinggi, koordinasi kompleks. Dengan microservices:

```
DEPLOYMENT COMPARISON:

MONOLITH:
  1 perubahan kecil → deploy seluruh aplikasi
  Risiko: perubahan kecil bisa merusak fitur lain
  Frekuensi: sekali seminggu/bulan

MICROSERVICES:
  1 perubahan → deploy 1 service saja
  Risiko: terisolasi ke 1 service
  Frekuensi: berkali-kali sehari
```

### 5. Organizational Alignment (Keselarasan Organisasi)

Banyak dari kita pernah mengalami masalah dari tim besar dan codebase besar. Microservices memungkinkan **menyelaraskan arsitektur dengan struktur tim**.

Satu tim kecil → satu service. Tim kecil = produktif, komunikasi efisien, ownership jelas.

### 6. Composability (Kemampuan Komposisi)

Dengan membuka fungsionalitas melalui service network, kita membuka kemungkinan bagi pihak lain untuk **mengonsumsi layanan dengan cara berbeda**. Microservices yang sama bisa melayani web, mobile, IoT — semuanya melalui API yang sama.

### 7. Optimizing for Replaceability (Kemudahan Penggantian)

Seberapa sering kamu punya kode warisan yang semua orang takut untuk disentuh? Dengan microservices yang kecil, **biaya untuk mengganti atau bahkan menghapus service jauh lebih murah**.

> *"If you want to rewrite a microservice, you can do so in a couple of days. With a monolith that can take months."*

### 8. No Silver Bullet

Newman jujur: microservices tidak gratis. Ada trade-off yang harus dipahami, termasuk kompleksitas jaringan, distributed transactions, dan kebutuhan infrastruktur yang lebih matang.



## Microservices vs SOA

Sering ada kebingungan: apakah microservices sama dengan SOA (Service-Oriented Architecture)?

```
PERBANDINGAN SOA vs MICROSERVICES

Aspek              │ SOA              │ Microservices
───────────────────┼──────────────────┼──────────────────
Granularitas       │ Coarse-grained   │ Fine-grained
                   │ (service besar)  │ (service kecil)
Smart Pipeline     │ Smart ESB        │ Dumb pipes
atau Smart         │ (middleware      │ (smart endpoints)
Endpoint?          │ complex)         │
Komunikasi         │ SOAP/WS-*        │ REST/gRPC/Events
Data Store         │ Shared database  │ Database per service
Deployment         │ Coordinated      │ Independent
Governance         │ Centralized      │ Decentralized
```

**Perbedaan filosofis utama:** SOA menggunakan **smart middleware** (ESB — Enterprise Service Bus) dengan endpoint yang "bodoh". Microservices menggunakan **dumb pipes** (HTTP/messaging) dengan endpoint yang "cerdas".

> *"SOA became ​synonymous with vendor middleware, heavy specs, and a whole lot of complexity. Microservices are a response to those challenges."*



## Prinsip Loose Coupling dan High Cohesion

Dua prinsip desain fundamental untuk microservices yang baik:

### Loose Coupling

**Coupling** mengacu pada seberapa banyak perubahan di satu service mempengaruhi service lain.

```
COUPLING TINGGI (buruk):
Service A ──────────────────► Service B
              (banyak dependensi internal)
Perubahan B → harus ubah A juga

COUPLING RENDAH (baik):
Service A ──────────────────► Service B
              (interface bersih, stabil)
Perubahan internal B → A tidak terpengaruh
```

Sebuah loosely coupled service tahu sesedikit mungkin tentang service lain yang digunakan. Batasi jenis panggilan dari satu service ke service lain.

### High Cohesion

**Cohesion** mengacu pada seberapa baik kode yang berubah bersama dikumpulkan bersama.

> *"We want to find boundaries within our problem domain that help ensure related behavior sits together, and that communicate with other boundaries as loosely as possible."*

```
COHESION RENDAH (buruk):         HIGH COHESION (baik):
┌────────────────────────┐       ┌─────────────────┐
│ User Service           │       │ Customer Service │
│  - Manage users        │       │  - Register      │
│  - Process payments    │       │  - Update profile│
│  - Send notifications  │       │  - View history  │
│  - Generate reports    │       └─────────────────┘
└────────────────────────┘
```



## Conway's Law dan Struktur Tim

**Conway's Law** menyatakan:

> *"Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure."*

```
IMPLIKASI CONWAY'S LAW:

Organisasi dengan 4 tim terpisah:
  Tim A: Frontend
  Tim B: Backend
  Tim C: Database
  Tim D: QA

Hasil arsitektur sistem:
  Layer: Frontend → Backend → Database → Testing
  (layer architecture = struktur organisasi)

Untuk microservices:
  Ubah struktur tim → arsitektur akan ikut berubah
  1 tim = ownership 1 service atau beberapa service terkait
```

Sam Newman merekomendasikan tim yang **cross-functional** — setiap tim memiliki semua kemampuan yang diperlukan untuk mengembangkan, men-deploy, dan mengoperasikan service mereka sendiri.



## Migration dari Monolith

Tidak ada yang mulai dari microservices secara langsung. Hampir semua sistem dimulai dari monolith. Bagaimana cara bermigrasi?

### Incremental Migration

Jangan lakukan **"big bang rewrite"**. Sebaliknya, pecah monolith secara bertahap:

```
INCREMENTAL MIGRATION STRATEGY:

Fase 1: Identifikasi domain boundary
  → Domain mana yang paling sering berubah?
  → Domain mana yang butuh scale berbeda?

Fase 2: Strangler Pattern
  ┌─────────────────────────────────┐
  │         Load Balancer           │
  └──────────────┬──────────────────┘
                 │
     ┌───────────┴────────────┐
     │                        │
  ┌──────────┐          ┌──────────────┐
  │ Monolith │          │  New Service │
  │(legacy)  │          │(microservice)│
  └──────────┘          └──────────────┘

Fase 3: Secara bertahap pindah traffic ke service baru
  → Mulai dari feature baru, bukan migrasi fitur lama
  → Tambah service baru, jangan modifikasi monolith

Fase 4: Akhirnya monolith menyusut dan bisa dihapus
```

### Kapan Mulai?

Newman jujur: **jangan mulai dengan microservices jika kamu baru memulai**. Mulai dengan monolith dulu, pahami domain-nya, lalu pecah ketika ada alasan yang jelas.



## Kapan TIDAK Menggunakan Microservices?

Microservices bukan solusi untuk semua masalah. Ada beberapa situasi di mana ini bukan pilihan terbaik:

```
HINDARI MICROSERVICES JIKA:

1. Domain belum dipahami dengan baik
   → Microservices prematur = mahal untuk di-refactor
   → Monolith lebih mudah di-refactor

2. Tim sangat kecil (1-3 orang)
   → Overhead ops microservices bisa overwhelming
   → ROI tidak worth it

3. Startup tahap awal
   → Fokus pada product-market fit dulu
   → Eric Ries: "6 bulan membangun produk yang tidak didownload siapapun"

4. Sistem yang tidak butuh independent scaling
   → Overhead tidak worth it

5. Strong consistency requirements
   → Distributed transactions = sangat kompleks
   → ACID di monolith jauh lebih mudah
```



## Ringkasan

| Konsep | Penjelasan |
|--------|-----------|
| Definisi | Small, autonomous services yang bekerja bersama |
| Ukuran ideal | Satu domain bisnis, bisa ditulis ulang dalam 2 minggu |
| Manfaat utama | Tech heterogeneity, resilience, targeted scaling, easy deployment |
| vs SOA | Smart endpoints dumb pipes, database per service, independent deploy |
| Loose coupling | Perubahan di satu service tidak merusak yang lain |
| High cohesion | Kode yang berubah bersama, dikumpulkan bersama |
| Conway's Law | Arsitektur = struktur organisasi |
| Migrasi | Strangler pattern, incremental, jangan big bang |

**Sumber:** Sam Newman, *Building Microservices* (2015), O'Reilly Media. Preview Edition sponsored by NGINX. [nginx.com](https://nginx.com)
