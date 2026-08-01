---
title: "Case Study Desain Arsitektur: FCAPS, Big Data, dan Banking"
description: Tiga contoh desain arsitektur software dari buku Designing Software
  Architectures - sistem manajemen jaringan FCAPS dengan layered architecture,
  sistem big data dengan lambda architecture, dan sistem banking brownfield
  dengan API gateway.
pubDate: 2026-10-27T08:00:00.000Z
image: /image/designing-software-architectures-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - CaseStudy
  - BigData
  - ADD
series: "Designing Software Architectures"
seriesOrder: 3
---

Chapter 4-6 dari *Designing Software Architectures* (Cervantes & Kazman) mempraktikkan ADD 3.0 pada **tiga case study nyata**: sistem **FCAPS** (manajemen jaringan, greenfield), sistem **Big Data** (greenfield), dan sistem **Banking** (brownfield, memodifikasi sistem yang sudah ada). Artikel ini menunjukkan **contoh desain arsitektur** yang bisa dipelajari arsitek pemula maupun senior sebelum menerapkan metode pada proyek sendiri.

## Daftar Isi

- [Case Study 1: FCAPS System](#case-study-1-fcaps-system)
- [FCAPS: Business Case](#business-case)
- [FCAPS: System Requirements](#fcaps-system-requirements)
- [FCAPS: Iterasi 2](#fcaps-iterasi-2)
- [FCAPS: Iterasi 3](#fcaps-iterasi-3)
- [Case Study 2: Big Data System](#case-study-2-big-data-system)
- [Big Data: Business Case](#business-case-1)
- [Big Data: Iterasi 1](#big-data-iterasi-1)
- [Big Data: Iterasi 2](#big-data-iterasi-2)
- [Big Data: Iterasi 3 dan 4](#big-data-iterasi-3-dan-4)
- [Case Study 3: Banking System](#case-study-3-banking-system)
- [Banking: Existing Documentation](#existing-architectural-documentation)
- [Banking: Iterasi 1](#banking-iterasi-1)
- [Pelajaran dari Tiga Case Study](#pelajaran-dari-tiga-case-study)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Case Study 1: FCAPS System

**FCAPS** adalah standar manajemen jaringan (Fault, Configuration, Accounting, Performance, Security): sistem untuk mengelola perangkat jaringan operator telekomunikasi.

### Business Case

Perusahaan telekomunikasi butuh sistem terpusat untuk memantau dan mengelola jaringan yang tersebar: ribuan perangkat (router, switch) di banyak lokasi. Sistem harus **selalu tersedia**, karena kegagalan jaringan berarti kehilangan pendapatan.

## FCAPS: System Requirements

### Use Case Model

- Operator melihat status perangkat
- Operator mengelola konfigurasi
- Alarms diterima dan diproses
- Laporan performa dihasilkan

### Quality Attribute Scenarios

| QA | Scenario |
|----|----------|
| **Availability** | Jika 100 perangkat mengirim alarm bersamaan, sistem tetap memproses tanpa down |
| **Performance** | Alarm harus diproses dalam 5 detik pada beban puncak |
| **Modifiability** | Tipe perangkat baru bisa ditambahkan dalam 1 person-month |
| **Security** | Hanya operator terautentikasi yang bisa mengubah konfigurasi |

### Constraints

- Menggunakan Java/J2EE (kebijakan perusahaan)
- Integrasi dengan database Oracle yang ada
- Budget dan timeline terbatas

### Architectural Concerns

- Organisasi: tim terpisah per modul
- Evolusi: dukungan perangkat baru terus-menerus
- Operasional: monitoring 24/7

## FCAPS: Iterasi 1

### Drivers Terpilih

- Availability tinggi (QA-1)
- Performance (QA-2)

### Design Concepts

- Reference architecture: **layered + publish-subscribe**
- Tactics availability: **redundancy, heartbeat, watchdog**
- Tactics performance: **queues, concurrency**

### Struktur yang Dihasilkan

```
FCAPS System (root)
+-- Presentation Layer (UI operator)
+-- Business Layer
    +-- Fault Manager
    +-- Configuration Manager
    +-- Accounting Manager
    +-- Performance Manager
    +-- Security Manager
+-- Data Layer (Oracle DB)
+-- Event Bus (publish-subscribe untuk alarms)
```

Keputusan: **Event bus** untuk decouple alarm processing: receiver dan processor terpisah, memungkinkan redundancy.

## FCAPS: Iterasi 2

### Drivers Terpilih

- Primary functionality: alarm processing (use case inti)

### Elemen yang Di-refine

- **Event Bus**: refine jadi komponen konkret (JMS topics)
- **Fault Manager**: refine: alarm collector, alarm correlator, alarm display

```
Fault Manager
+-- Alarm Collector (terima dari Event Bus)
+-- Alarm Correlator (grouping alarms terkait)
+-- Alarm Display (UI real-time)
```

Keputusan: **correlator** memisahkan logika grouping: memudahkan modifiability (aturan correlasi baru).

## FCAPS: Iterasi 3

### Drivers Terpilih

- Modifiability (QA-3): dukungan perangkat baru

### Design Concepts

- Tactics modifiability: **separation of concerns, generalization**
- Pattern: **plug-in architecture** untuk device adapters

```
Device Adapters (plug-in)
+-- CiscoAdapter
+-- JuniperAdapter
+-- HuaweiAdapter  (baru: tinggal tambah plug-in)
```

Keputusan: **device adapter interface**: perangkat baru tinggal implement interface, tanpa mengubah core system.

## Case Study 2: Big Data System

Sistem **Big Data** untuk menganalisis data streaming besar (misal: log, sensor, event millions per detik).

### Business Case

Perusahaan butuh sistem yang **menerima data streaming masif**, menyimpannya, dan menyediakan **analisis real-time dan batch**: dengan latensi rendah dan skalabilitas horizontal.

### Requirements

- **Use cases**: ingest events, query real-time, laporan batch
- **QAs**: scalability (jutaan events/detik), availability (24/7), performance (query < 1 detik)
- **Constraints**: teknologi open source (Hadoop ecosystem)
- **Concerns**: biaya infrastruktur, evolusi cepat teknologi

## Big Data: Iterasi 1

### Drivers Terpilih

- Scalability (QA utama)
- Primary functionality: ingest dan query

### Design Concepts

- Reference architecture: **Lambda Architecture** (batch + speed layers)

### Struktur yang Dihasilkan

```
Big Data System
+-- Ingest Layer (kafka: event ingestion)
+-- Batch Layer (Hadoop: proses data historis)
+-- Speed Layer (Spark Streaming: data real-time)
+-- Serving Layer (HBase/Cassandra: query hasil)
+-- Query Interface (API untuk analisis)
```

Keputusan: **Lambda architecture**: dua jalur (batch untuk akurasi, speed untuk latensi) digabung di serving layer.

## Big Data: Iterasi 2

### Drivers Terpilih

- Selection of technologies

### Keputusan Teknologi

| Kebutuhan | Teknologi | Alasan |
|-----------|-----------|--------|
| Event ingest | **Kafka** | High-throughput, durable |
| Batch processing | **Hadoop MapReduce** | Mature, scalable |
| Real-time processing | **Spark Streaming** | Micro-batch, cepat |
| Serving layer | **HBase** | Random access besar |
| Query | **Hive/Presto** | SQL-like queries |

Keputusan didasarkan: maturity, community, compatibility constraints.

## Big Data: Iterasi 3 dan 4

### Iterasi 3: Refinement of Data Stream Element

- Ingest Layer di-refine: **producers, consumers, partitioning**
- Handle **backpressure**: jika downstream lambat
- **Replication** Kafka untuk durability

### Iterasi 4: Refinement of Serving Layer

- HBase schema design: row keys optimal untuk query
- **Caching layer** (Redis) untuk hot data
- Query interface: REST API + SQL

```
Serving Layer
+-- HBase (raw results)
+-- Redis Cache (hot data)
+-- Query Service (REST API)
+-- BI Integration (Presto/SQL)
```

## Case Study 3: Banking System

Sistem **Banking**: ini **brownfield**: sistem sudah ada, dengan arsitektur terdokumentasi, dan butuh **drivers baru**.

### Business Case

Bank punya sistem core banking yang berjalan. Kebutuhan baru: **mobile banking app** yang harus terintegrasi: dengan QA baru: keamanan ketat, performa tinggi, availability.

### Existing Architectural Documentation

#### Module View

```
Banking System (existing)
+-- Account Management
+-- Transaction Processing
+-- Customer Management
+-- Loan Management
+-- Reporting
```

#### Allocation View

- Core systems di mainframe (legacy)
- Integration layer (SOA) menghubungkan ke aplikasi baru
- Database terpusat

## Banking: Iterasi 1

### Drivers Terpilih

- **Security** (mobile banking = target serangan)
- **Performance** (response mobile cepat)
- **Availability** (banking selalu tersedia)

### Review Inputs Khusus Brownfield

- Analisis arsitektur existing: **gaps** dengan drivers baru
- Security existing lemah di API layer
- Performance: SOA integration lambat
- Availability: single point of failure di integration

### Design Concepts

- **API Gateway** untuk mobile: security, rate limiting, versioning
- **Redundancy** untuk availability
- **Caching** untuk performa

### Struktur Baru

```
Mobile Banking
+-- API Gateway (baru: auth, rate limit, SSL)
+-- Mobile Backend Service (baru)
+-- Integration Layer (existing: di-refine)
    +-- Account Service
    +-- Transaction Service
+-- Core Systems (mainframe: existing)
+-- Monitoring (baru)
```

Keputusan: **API Gateway** sebagai choke point: semua request mobile lewat gateway untuk security dan kontrol.

### Konsekuensi Brownfield

- **Backward compatibility**: sistem lama tidak boleh rusak
- **Incremental deployment**: layanan baru ditambahkan bertahap
- **Testing ketat**: regresi pada sistem yang berjalan
- **Coexistence**: old dan new berjalan bersamaan

## Pelajaran dari Tiga Case Study

### Greenfield (FCAPS, Big Data)

- **Reference architecture** mempercepat: gunakan template proven
- Iterasi mulai dari struktur keseluruhan, lalu refine bertahap
- Keputusan teknologi bisa ditunda (iterasi 2 untuk Big Data)

### Brownfield (Banking)

- **Review existing dulu**: sebelum desain baru
- Identifikasi **gaps** antara arsitektur existing dan drivers baru
- **Minimalkan dampak**: perubahan incremental
- **API Gateway** sering jadi solusi untuk menambah keamanan/performa pada legacy

### Umum

- **Drivers per iterasi sedikit** (1-3): fokus
- **Tactics dan patterns** dipilih berdasarkan QA spesifik
- **Keputusan didokumentasikan**: ADR
- **Design purpose** sebagai kompas semua keputusan

## Kesimpulan

Tiga case study menunjukkan ADD 3.0 dalam aksi: **FCAPS** (greenfield mature domain: layered + publish-subscribe + plug-in), **Big Data** (greenfield novel domain: Lambda architecture, keputusan teknologi bertahap), dan **Banking** (brownfield: API Gateway, gaps analysis, incremental change).

ADD terbukti fleksibel untuk berbagai tipe sistem dan konteks.

Di artikel berikutnya: **[metode desain lain, analisis, dan ADD dalam organisasi](/blog/metode-desain-analisis-add-organisasi)** (Chapter 7-10). Kembali ke **[proses ADD 3.0 7 langkah](/blog/attribute-driven-design-3.0-process-7-langkah)** untuk memahami metodologi di balik case study ini.

## FAQ

### Apa itu arsitektur lambda dalam sistem big data?

Lambda architecture memisahkan processing menjadi dua jalur: batch layer (Hadoop MapReduce) untuk akurasi data historis dan speed layer (Spark Streaming) untuk latensi real-time. Keduanya digabung di serving layer (HBase/Cassandra) yang melayani query. Teknologi umum: Kafka untuk ingest, Redis untuk cache hot data.

### Apa itu arsitektur brownfield dalam pengembangan software?

Brownfield berarti memodifikasi sistem yang sudah berjalan: lawan dari greenfield (sistem baru). Prosesnya: review dokumentasi arsitektur existing, identifikasi gaps terhadap kebutuhan baru, lalu lakukan perubahan incremental yang backward-compatible. Contohnya penambahan API gateway di depan sistem banking legacy untuk mendukung mobile app.

### Kapan sebaiknya menggunakan API gateway?

Gunakan API gateway saat mengekspos sistem (terutama legacy) ke client baru seperti mobile apps. Gateway menjadi choke point tunggal untuk authentication, rate limiting, SSL termination, dan versioning: menambah keamanan dan kontrol tanpa mengubah core system. Cocok untuk brownfield maupun greenfield dengan banyak client.

### Bagaimana menangani banyak drivers dalam desain arsitektur?

Jangan tangani semua sekaligus. Pilih 1-3 drivers per iterasi ADD agar fokus: iterasi pertama membangun struktur keseluruhan, iterasi berikutnya me-refine elemen fungsional, lalu menangani quality attribute scenarios penting satu per satu. Drivers yang belum ditangani masuk architectural backlog untuk iterasi berikutnya.

## Referensi

- Cervantes, H., & Kazman, R. (2016). *Designing Software Architectures: A Practical Approach*. Addison-Wesley.
- Marz, N., & Warren, J. (2015). *Big Data: Principles and Best Practices of Scalable Realtime Data Systems*. Manning.
- Kreps, J. (2014). *Questioning the Lambda Architecture*. O'Reilly Radar.
- Fowler, M. (2014). *Microservices: A definition of this new architectural term*. martinfowler.com.
