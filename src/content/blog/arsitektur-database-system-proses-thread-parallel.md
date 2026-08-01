---
title: "Arsitektur Database System: Proses, Thread, dan Parallel"
description: Panduan lengkap arsitektur database dari paper klasik Hellerstein
  Stonebraker Hamilton - life of a query, 5 komponen RDBMS, process models,
  threads, parallel architecture shared memory disk nothing, admission control.
pubDate: 2026-10-13T08:00:00.000Z
image: /image/db-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - Architecture
  - DBMS
  - Concurrency
series: "Architecture of a Database System"
seriesOrder: 1
---

*Architecture of a Database System* karya **Joseph M. Hellerstein, Michael Stonebraker, dan James Hamilton** (Foundations and Trends in Databases, 2007) adalah salah satu paper paling berpengaruh tentang arsitektur database — ditulis oleh tiga tokoh yang membangun database sistem nyata (PostgreSQL, Ingres, Microsoft SQL Server/Azure). Paper 119 halaman ini membedah cara kerja DBMS modern dari dalam.

## Daftar Isi

- [Mengapa Arsitektur Database Penting?](#mengapa-arsitektur-database-penting)
- [Lima Komponen Utama RDBMS](#lima-komponen-utama-rdbms)
- [Life of a Query](#life-of-a-query)
- [Process Models](#process-models)
- [Uniprocessor dan Lightweight Threads](#uniprocessor-dan-lightweight-threads)
- [DBMS Threads](#dbms-threads)
- [Admission Control](#admission-control)
- [Parallel Architecture](#parallel-architecture)
- [Shared Memory](#shared-memory)
- [Shared Disk](#shared-disk)
- [Shared Nothing](#shared-nothing)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Mengapa Arsitektur Database Penting?

Database Management Systems (DBMS) adalah **software mission-critical yang kompleks** — hasil dekade riset akademik dan industri. Database system termasuk **server system online pertama yang di-deploy luas** — mereka memelopori solusi desain yang mencakup data management, aplikasi, operating system, dan networked services.

Banyak "conventional wisdom" tentang cara membangun database system tersedia, tapi **sedikit yang ditulis dan dikomunikasikan secara luas**. Paper ini berusaha menangkap aspek arsitektur utama database system modern — berdasarkan pengalaman membangun sistem nyata.

## Lima Komponen Utama RDBMS

![Life of a Query — Alur Eksekusi SQL](/image/db-life-of-query.svg)

Sebuah RDBMS tipikal punya **lima komponen utama**:

1. **Process Manager** — mengelola koneksi client, thread, dan admission control
2. **Relational Query Processor** — parsing, optimasi, dan eksekusi query
3. **Transactional Storage Manager** — locking, logging, buffer pool, recovery
4. **Shared Components and Utilities** — memory allocator, disk management, replication, administration
5. **Client Communication Manager** — protokol komunikasi (ODBC, JDBC)

## Life of a Query

Paper memandu kita **mengikuti satu query** dari client sampai hasilnya kembali — ini juga menjadi overview seluruh paper.

### Step 1: Client Connection

Client terhubung ke database server. Ada dua pola:

- **Two-tier (client-server)** — koneksi langsung client ke DBMS via ODBC/JDBC
- **Three-tier** — client → middle-tier server (web server / transaction monitor) → DBMS

Di web-based scenarios, ada lagi **application server tier** antara web server dan DBMS.

### Step 2: Admission

Query diterima oleh **gate agent** (admission control) yang:
- Memverifikasi user
- Memeriksa lisensi/limit
- Mengalokasikan thread

Setelah diterima dan dialokasikan sebagai thread of control, query bisa mulai dieksekusi.

### Step 3: Query Processing

Query dipanggil ke **Relational Query Processor**:

- **Cek authorization** — user berhak menjalankan query?
- **Compile SQL** — ubah teks query menjadi internal query plan
- **Plan executor** — suite "operators" (implementasi algoritma relasional) untuk mengeksekusi plan

Operators tipikal: sequential scan, index scan, hash join, merge join, aggregation, sorting.

### Step 4: Access Methods

Query mulai mengakses data via **access methods** — modul yang membaca record dari storage:
- **Heap files** — penyimpanan record tidak terurut
- **B+-trees** — index terurut
- **Hash tables** — lookup berdasarkan hash

### Step 5: Buffer Pool dan Transactions

Storage engine menyediakan:
- **Buffer pool** — cache halaman disk di memori
- **Transactions** — isolation dan atomicity via locking dan logging

### Step 6: Return Results

Stack "di-unwind": access methods mengembalikan kontrol ke executor operators, yang menghitung result tuples dari data — hasil ditempatkan di buffer untuk dikirim kembali ke client.

## Process Models

Saat mendesain server multi-user, keputusan awal: **bagaimana request user berjalan** — dipetakan ke OS processes atau threads. Keputusan ini sangat mempengaruhi arsitektur, performa, scalability, dan portability.

### Definisi Dasar

- **OS Process** — unit eksekusi + address space privat + resource handles + security context; dijadwalkan kernel
- **OS Thread (kernel thread)** — unit eksekusi tanpa address space privat; berbagi memori dengan thread lain dalam proses yang sama; dijadwalkan kernel
- **Lightweight Thread Package** — konstruk level aplikasi; beberapa thread dalam satu OS process; **dijadwalkan di user-space** tanpa keterlibatan kernel

## Uniprocessor dan Lightweight Threads

Untuk server database, model **process-per-dbms-worker** klasik punya masalah:

### Proses Per Request

Setiap request user = satu OS process:

- **Kelebihan**: isolasi lengkap, keamanan kuat
- **Kekurangan**: overhead besar (context switch, memori per proses), tidak efisien untuk banyak koneksi

### Threads Per Request

Setiap request = satu OS thread dalam satu proses:

- **Kelebihan**: lebih ringan dari process, berbagi memori
- **Kekurangan**: kernel scheduling overhead; satu thread crash bisa mempengaruhi proses

### Lightweight Threads (Async)

Banyak thread di user-space dalam satu OS process/thread:

- **Kelebihan**: sangat ringan, kontrol scheduling penuh di aplikasi
- **Kekurangan**: butuh event loop; satu blocking call menghambat semua

## DBMS Threads

DBMS modern umumnya menggunakan **proses per server + thread pool**:

- Satu (atau beberapa) DBMS server process
- **Thread pool** — kumpulan worker threads yang menangani request
- Request queue — request masuk, diambil worker yang tersedia
- Worker thread memproses query dan mengembalikan hasil

Model ini menyeimbangkan isolasi (proses) dan efisiensi (thread).

## Admission Control

**Admission control** mencegah overload — server menolak request baru saat sudah sibuk:

- Batasi jumlah request bersamaan (concurrent requests)
- Prioritaskan request penting
- **Queueing** — request yang menunggu di queue
- **Load shedding** — tolak request low-priority saat beban tinggi

Tanpa admission control, server bisa **thrash** — habiskan resource untuk context switching daripada memproses.

## Parallel Architecture

![Tiga Arsitektur Parallel](/image/db-parallel-architectures.svg)

Parallel hardware adalah kenyataan server modern. Paper merangkum tiga arsitektur klasik (terminologi dari Stonebraker):

## Shared Memory

Semua processor mengakses **RAM dan disk yang sama** dengan performa serupa:

- Arsitektur standar — kebanyakan server punya 2-8 processor
- **Multi-core** — beberapa core dalam satu chip, share cache dan memory bus — mirip shared memory
- Hampir semua serious database deployments memakai multiprocessor
- Ketiga process model dari Section 2 berjalan baik di shared-memory

**Contoh:** server SMP, mesin multi-core

## Shared Disk

Setiap node punya **RAM sendiri**, tapi **berbagi disk** (biasanya via SAN):

- Nodes terhubung ke storage area network yang sama
- **Cache koherensi** — node harus sinkronkan buffer pool-nya
- Butuh **distributed lock manager** untuk mengkoordinasikan akses
- Skalabilitas terbatas oleh kontensi pada disk dan locks

**Contoh:** Oracle RAC, cluster SAN

## Shared Nothing

Setiap node punya **CPU, RAM, dan disk sendiri** — tidak ada sharing:

- Node berkomunikasi via **interconnect (network)**
- Data **dipartisi** di antara node
- Query dipecah dan didistribusikan ke node yang punya data
- **Skalabilitas terbaik** — tambah node = tambah kapasitas
- Kompleksitas: query planning terdistribusi, data skew, fault tolerance

**Contoh:** Google Spanner, Hadoop, Grid computing, MySQL Cluster

### Perbandingan Arsitektur Parallel

| Aspek | Shared Memory | Shared Disk | Shared Nothing |
|-------|---------------|-------------|----------------|
| **RAM** | Bersama | Per node | Per node |
| **Disk** | Bersama | Bersama (SAN) | Per node |
| **Komunikasi** | Bus memori | SAN + locks | Network |
| **Skalabilitas** | Terbatas | Sedang | **Terbaik** |
| **Kompleksitas** | Rendah | Sedang | Tinggi |
| **Contoh** | SMP, multi-core | Oracle RAC | Spanner, Hadoop |

## Kesimpulan

Arsitektur database system adalah kombinasi keputusan yang saling terkait: process model (process vs thread vs async), admission control, dan parallel architecture (shared memory/disk/nothing). Keputusan ini menentukan performa, skalabilitas, dan portability DBMS.

Di artikel berikutnya: **Relational Query Processor** — bagaimana SQL di-parse, di-optimize, dan dieksekusi.

## Referensi

- Hellerstein, J. M., Stonebraker, M., & Hamilton, J. (2007). Architecture of a Database System. *Foundations and Trends in Databases, 1*(2), 141-259.
- Stonebraker, M. (1986). The Case for Shared Nothing. *IEEE Database Eng. Bull., 9*(1), 4-9.
- Codd, E. F. (1970). A Relational Model of Data for Large Shared Data Banks. *Communications of the ACM, 13*(6), 377-387.
- Gray, J., & Reuter, A. (1993). *Transaction Processing: Concepts and Techniques*. Morgan Kaufmann.
