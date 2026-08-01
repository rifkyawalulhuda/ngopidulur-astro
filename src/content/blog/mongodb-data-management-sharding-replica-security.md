---
title: "MongoDB Data Management: Sharding, Replica Set, dan Security"
description: Panduan data management MongoDB dari Architecture Guide - auto
  sharding query router, consistency write concern, replication oplog, election
  failover, in-memory performance, compression, security authentication
  authorization, Ops Manager monitoring backup.
pubDate: 2026-10-17T08:00:00.000Z
image: /image/mongodb-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MongoDB
  - Sharding
  - Replication
  - Security
series: "MongoDB Architecture"
seriesOrder: 2
---

Bagian kedua dari *MongoDB Architecture Guide* membahas operasional dan keandalan: **auto-sharding** untuk skala horizontal, **replica sets** untuk availability, konsistensi dan durability, performa, keamanan, serta pengelolaan deployment dengan Ops Manager.

## Daftar Isi

- [Auto-Sharding](#auto-sharding)
- [Query Router (mongos)](#query-router-mongos)
- [Policies Sharding](#policies-sharding)
- [Consistency: Transaction Model](#consistency-transaction-model)
- [Configurable Write Availability](#configurable-write-availability)
- [Replication dan Replica Sets](#replication-dan-replica-sets)
- [Replica Set Oplog](#replica-set-oplog)
- [Elections dan Failover](#elections-dan-failover)
- [In-Memory Performance](#in-memory-performance)
- [Storage Efficiency dengan Compression](#storage-efficiency-dengan-compression)
- [Security MongoDB](#security-mongodb)
- [Ops Manager dan Cloud Manager](#ops-manager-dan-cloud-manager)
- [Monitoring](#monitoring)
- [Disaster Recovery: Backup dan PITR](#disaster-recovery-backup-dan-pitr)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Auto-Sharding

**Sharding** adalah teknik MongoDB untuk **horizontal scale-out** — mendistribusikan data ke banyak physical partitions (shards) di commodity hardware atau cloud.

![MongoDB Sharded Cluster](/image/mongodb-sharding-cluster.svg)

### Kenapa Sharding?

- Mengatasi **keterbatasan hardware single server** — bottleneck RAM, disk I/O
- **Transparan ke aplikasi** — aplikasi tidak perlu tahu sharding
- **Auto-balancing** — MongoDB otomatis menyeimbangkan data saat cluster tumbuh/menyusut
- **Tanpa clustering software tambahan** — tidak perlu shared-disk infrastructure mahal

### Perbedaan dengan Relational

- Di relational, sharding sering harus dibangun **di application code** — kompleks dan harus diupdate saat shard dimigrasi
- Di MongoDB, sharding **built-in dan otomatis** — developer tidak pusing, ops tidak deploy software tambahan

## Query Router (mongos)

**Query router (mongos)** adalah komponen yang membuat sharding transparan:

- Aplikasi terhubung ke mongos (bukan langsung ke shard)
- mongos meneruskan query ke shard yang tepat berdasarkan **shard key**
- **Config servers** menyimpan metadata: distribusi shard key ranges, routing information
- Bisa di-scale (banyak mongos) untuk high availability

## Policies Sharding

MongoDB menawarkan **beberapa policy sharding** — distribusi data sesuai query patterns atau data locality:

### Range-based Sharding

- Dokumen dipartisi berdasarkan **nilai shard key**
- Dokumen dengan nilai berdekatan → shard sama
- **Kelebihan**: query range efisien (data berurutan di shard sama)
- **Kekurangan**: bisa menimbulkan hotspot (semua data baru ke satu shard) jika shard key monotonik

### Hash-based Sharding

- Shard key di-hash → distribusi **merata** antar shards
- **Kelebihan**: distribusi seimbang, tanpa hotspot
- **Kekurangan**: query range lintas shard (kurang efisien)

### Zone-aware Sharding (data locality)

- Data dikelompokkan ke **zona** (region, data center)
- Dokumen ditempatkan di zona sesuai konfigurasi
- Mendukung **data residency** dan mengurangi latensi geografis

### Memilih Shard Key

Shard key adalah keputusan penting: pilih field dengan **kardinalitas tinggi** dan **distribusi merata** untuk menghindari jumbo chunks dan hotspot.

## Consistency: Transaction Model

### ACID di Level Dokumen

MongoDB **ACID compliant pada level dokumen**:

- Satu atau lebih fields ditulis dalam **satu operasi atomic**
- Termasuk update ke sub-documents dan elemen array
- **Isolation penuh** saat dokumen diupdate
- Error → operasi **rollback otomatis**
- Client selalu melihat **view konsisten** dari dokumen

### Multi-Document Transactions

MongoDB 4.0+ mendukung **multi-document transactions** (ACID lintas dokumen dan koleksi) — melengkapi atomicity level dokumen.

## Configurable Write Availability

**Write concern** mengontrol kapan operasi dianggap sukses:

```javascript
// Default: acknowledged oleh primary
db.orders.insertOne(order);  // w: 1

// Tunggu sampai flushed ke journal di disk
db.orders.insertOne(order, { writeConcern: { w: 1, j: true } });

// Tunggu sampai direplikasi ke 2 replica (1 data center) + 1 (data center lain)
db.orders.insertOne(order, { writeConcern: { w: 3 } });
```

| Write Concern | Makna |
|---------------|-------|
| **Unacknowledged** | Tanpa konfirmasi (fastest, risikonya sendiri) |
| **Acknowledged (default)** | Dikonfirmasi primary |
| **Journaled (j: true)** | Flushed ke journal di disk |
| **Replica Acknowledged** | Direplikasi ke N replica |
| **Majority** | Mayoritas anggota replica set |

Setiap query bisa menentukan write concern sendiri — dari unacknowledged sampai committed ke semua replicas.

## Replication dan Replica Sets

MongoDB mempertahankan **banyak salinan data** (replica sets) menggunakan native replication:

- **Replica set** adalah shard self-healing yang mencegah downtime
- Bisa **scale read operations** (baca dari secondary)
- **Failover otomatis** — tanpa intervensi administrator
- Konfigurasi jumlah replica fleksibel — sampai **50 members** per replica set

### Keuntungan Replica Sets

- **Data durability** — banyak salinan melindungi dari machine failures, rack failures, data center failures, network partitions
- **Read scaling** — aplikasi bisa membaca dari secondaries (eventual consistency, cocok untuk reporting)
- **Data-center awareness** — baca dari salinan terdekat (ping distance) untuk kurangi geographic latency
- **Zero-downtime maintenance** — upgrade hardware/software tanpa offline (sering menyumbang sepertiga downtime di sistem tradisional)

## Replica Set Oplog

**Oplog (operations log)** adalah mekanisme replikasi:

- Operasi yang memodifikasi database di primary **direplikasi ke secondaries via oplog**
- Oplog berisi **set operasi idempotent** yang di-replay di secondaries
- **Ukuran konfigurable** — default 5% free disk space
- Untuk kebanyakan aplikasi: mewakili **banyak jam operasi**
- Mendefinisikan **recovery window** — berapa lama secondary bisa offline lalu catch up ke primary

## Elections dan Failover

Saat primary gagal, **election** otomatis memilih primary baru:

- Primary baru dipromosikan dalam **beberapa detik** setelah primary gagal
- Selama itu, query dengan read preference yang sesuai tetap dilayani secondaries
- **Algoritma election** mengevaluasi:
  - **Election identifiers dan timestamps** — member yang sudah apply update paling terbaru
  - **Heartbeat dan connectivity status** — member yang sehat
  - **User-defined priorities** — nilai yang ditetapkan administrator

### Election Priority

- Default semua member priority = 1 — peluang sama menjadi primary
- Priority bisa di-set: member dengan **priority tertinggi** yang eligible terpilih
- Contoh operasional: replica di data center sekunder diberi priority rendah — **hanya menjadi primary jika data center utama gagal**

## In-Memory Performance

**In-Memory storage engine** memberikan performa in-memory computing untuk workload operasional dan real-time analytics:

- **Extreme throughput** dan **predictable latency**
- Untuk AdTech, finance, telecoms, IoT, eCommerce
- **Menghilangkan kebutuhan caching layer terpisah**
- **Hybrid deployment** — replica set bisa campur in-memory dan on-disk engines
- Data In-Memory diproses real-time; data on-disk untuk kapasitas besar (Enterprise Advanced)

## Storage Efficiency dengan Compression

**WiredTiger** (engine default) menyediakan kompresi:

- **Compression** mengurangi ukuran data di disk — storage lebih hemat
- Data terkompresi tetap dibaca cepat (decompression efisien)
- **Prefix compression** pada index entries
- Mengurangi I/O dan biaya storage

## Security MongoDB

### Authentication

Integrasi dengan mekanisme eksternal:

- **LDAP**
- **Windows Active Directory**
- **Kerberos**
- **x.509 certificates**

### Authorization

- **User-defined roles** — permission granular per user/aplikasi sesuai privilege yang dibutuhkan
- **Field-level redaction** — bekerja dengan trusted middleware untuk mengelola akses field individual dalam dokumen
- **Co-locate data** dengan multi security level dalam satu dokumen

### Auditing

- **Native audit log** untuk compliance regulasi
- Track **semua operasi** — DML, DCL, DDL

### Encryption

- Enkripsi **di network** (TLS) dan **di disk** (at-rest)
- **Encrypted storage engine** — enkripsi native file database di disk
- Menghilangkan overhead eksternal encryption mechanisms
- Hanya staff dengan authorization credentials bisa akses data terenkripsi

## Ops Manager dan Cloud Manager

**MongoDB Ops Manager** — cara paling sederhana menjalankan MongoDB, dibuat oleh engineer yang mengembangkan database:

- **Deploy, monitor, backup, scale** MongoDB
- **Cloud Manager** — versi hosted di cloud
- **Self-service portal** — deploy dan upgrade seluruh cluster dengan satu klik
- **AWS integration** — provision VM dengan konfigurasi optimal
- **Dynamic resizing** — tambah shards dan replica set members
- **Maintenance zero-downtime**: upgrade MongoDB, build index lintas replica sets, resize oplog — dari puluhan/langkah ratusan manual jadi satu klik
- **RESTful API** — integrasi enterprise tools

## Monitoring

**Ops Manager dan Cloud Manager** memberi insight operasional:

- **100+ metrics** — database dan systems health: operation counters, memory/CPU utilization, replication status, open connections, queues, node status
- **Charts, custom dashboards, automated alerting**
- **Real-time dan historic** — baselines operasional dan capacity planning
- **Visual Query Profiler** — analisis performa query; rekomendasi index
- **Integrasi**: RESTful API, APM platforms (New Relic), PagerDuty, HipChat, SMS/email alerts
- **Single pane of glass** — konsolidasi status MongoDB dengan infrastruktur lain

## Disaster Recovery: Backup dan PITR

Strategi backup dan recovery melindungi data mission-critical:

- **Continuous backups** — snapshot berkala
- **Point-in-Time Recovery (PITR)** — restore ke titik waktu spesifik
- **Ops Manager backup** — otomatis, terintegrasi
- Test restore berkala untuk memastikan validitas

## Kesimpulan

MongoDB Data Management menunjukkan arsitektur operasional yang matang: **sharding otomatis** untuk skala horizontal dengan banyak policy (range, hash, zone), **replica sets** untuk availability dengan oplog dan election otomatis, **write concerns** untuk durability yang bisa dikonfigurasi, serta **security berlapis** (authentication, authorization, auditing, encryption).

Ops Manager/Cloud Manager melengkapi dengan provisioning, monitoring, dan backup — menjadikan MongoDB mudah dioperasikan dari skala kecil sampai global.

## Referensi

- MongoDB Inc. (2015). *MongoDB Architecture Guide*. MongoDB.
- MongoDB Documentation. (2024). *Sharding*, *Replication*, *Write Concern*. docs.mongodb.com.
- Chodorow, K. (2013). *MongoDB: The Definitive Guide* (2nd ed.). O'Reilly Media.
- Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly Media.
