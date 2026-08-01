---
title: "Storage Management dan Transactions: Buffer Pool, Locking, ARIES"
description: Panduan storage dan transaksi dari paper Architecture of a Database
  System - spatial temporal control, buffer pool, ACID, serializability, locking
  latching, log manager, WAL, ARIES recovery, memory allocator, replication.
pubDate: 2026-10-15T08:00:00.000Z
image: /image/db-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - Transactions
  - ARIES
  - Recovery
series: "Architecture of a Database System"
seriesOrder: 3
---

Bagian terakhir dari paper *Architecture of a Database System* membahas **storage management** (Section 5), **transactions** — concurrency control dan recovery (Section 6), serta **shared components** (Section 7). Ini fondasi keandalan database: bagaimana data disimpan, dilindungi dari kegagalan, dan dipulihkan setelah crash.

## Daftar Isi

- [Storage Management](#storage-management)
- [Spatial Control](#spatial-control)
- [Temporal Control dan Buffer Pool](#temporal-control-dan-buffer-pool)
- [Buffer Pool Management](#buffer-pool-management)
- [A Note on ACID](#a-note-on-acid)
- [Serializability](#serializability)
- [Locking dan Latching](#locking-dan-latching)
- [Log Manager dan Write-Ahead Logging](#log-manager-dan-write-ahead-logging)
- [ARIES Recovery](#aries-recovery)
- [Locking dan Logging dalam Indexes](#locking-dan-logging-dalam-indexes)
- [Shared Components](#shared-components)
- [Disk Management Subsystems](#disk-management-subsystems)
- [Replication Services](#replication-services)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Storage Management

**Storage manager** mengelola penyimpanan data di disk dan memori. Dua dimensi kontrol:

- **Spatial control** — *di mana* data diletakkan di disk
- **Temporal control** — *kapan* data dipindahkan antara disk dan memori

## Spatial Control

DBMS perlu mengontrol **lokasi fisik** blok data di disk untuk **spatial locality** — data yang diakses bersama diletakkan berdekatan.

### Raw Device Access

Cara terbaik kontrol: menyimpan data langsung ke **raw disk device**, menghindari file system:

- **Kelebihan**: kontrol penuh posisi fisik; performa puncak
- **Kekurangan**: butuh seluruh partisi untuk DBMS; interface OS-spesifik; sulit portable

### Large File in File System

Alternatif: DBMS membuat **satu file besar** di file system, mengelola posisi sebagai offset:

- File diperlakukan sebagai **linear array halaman disk-resident**
- Offset dalam file berkorespondensi dekat dengan kedekatan fisik
- **Kelebihan**: portability lebih baik, tetap performa bagus
- Modern: RAID, SAN, dan logical volume managers membuat "virtual" disk jadi norma

## Temporal Control dan Buffer Pool

**Temporal control** mengatur kapan data dipindah disk ↔ memori. Intinya adalah **buffer pool**:

### Buffer Pool

**Buffer pool** adalah area memori yang men-cache halaman database:

- Halaman dibaca dari disk sekali, dipakai berulang dari memori
- **Hit ratio** — fraksi akses yang dipenuhi dari memori
- Menentukan performa I/O database

### Buffer Pool Management

- **Replacement policy** — halaman mana yang di-evict saat penuh: LRU (Least Recently Used), Clock algorithm
- **Dirty pages** — halaman yang dimodifikasi harus ditulis kembali ke disk
- **Steal/No-Steal** — boleh tidaknya menulis dirty page transaksi aktif ke disk
- **Force/No-Force** — perlu tidaknya menulis semua perubahan saat commit

Kombinasi **No-Steal + Force** menyederhanakan recovery tapi merusak performa; sistem modern pakai **Steal + No-Force** dengan logging.

## A Note on ACID

**ACID** adalah properti transaksi:

- **Atomicity** — semua atau tidak sama sekali
- **Consistency** — data valid sebelum dan sesudah transaksi
- **Isolation** — transaksi tidak saling melihat perubahan yang belum commit
- **Durability** — perubahan commit tetap ada setelah crash

## Serializability

**Serializability** adalah kriteria isolation: eksekusi konkuren setara dengan beberapa eksekusi serial (satu per satu).

- **Conflict** — dua operasi pada data sama, minimal satu menulis
- **Conflict serializability** — tidak ada cycle dalam conflict graph
- **2PL (Two-Phase Locking)** — protokol klasik untuk menjamin serializability: fase growing (acquire locks), fase shrinking (release locks)

## Locking dan Latching

Paper membedakan **locks** dan **latches**:

| Aspek | Lock | Latch |
|-------|------|-------|
| **Durasi** | Panjang (transaksi) | Pendek (operasi) |
| **Deadlock** | Deteksi/resolusi | Tidak ada (hindari) |
| **Tujuan** | Isolation antar transaksi | Proteksi struktur data |
| **Recovery** | Penting (rollback) | Tidak perlu |
| **Isolation level** | Bervariasi | Fixed |

### Lock Manager

- **Lock table** — hash table berisi locks aktif
- **Lock modes** — shared (S), exclusive (X), intention locks (IS, IX, SIX)
- **Lock escalation** — naikkan granularity saat banyak row locks
- **Deadlock detection** — wait-for graph, timeout
- **Two-phase locking** untuk serializability

### Latches

- Melindungi **struktur internal** (buffer pool pages, index nodes)
- Short-lived, tidak ada deadlock detection — desain hindari
- **Latch modes**: shared, exclusive, update

## Log Manager dan Write-Ahead Logging

**Log** adalah urutan record yang mendokumentasikan semua perubahan database:

### Write-Ahead Logging (WAL)

Aturan WAL (diadopsi semua sistem modern):

1. **Sebelum menulis data page ke disk, tulis log record ke disk** (untuk data)
2. **Sebelum commit, tulis log record commit ke disk** (untuk transaksi)

WAL memastikan: recovery bisa meng-undo perubahan yang belum commit dan redo perubahan yang sudah commit tapi belum di-flush.

### Log Manager Details

- **Log records** — LSN (Log Sequence Number), transaksi ID, sebelum/sesudah gambar
- **LSN** — monotonik meningkat, mengurutkan semua perubahan
- **Log buffer** — area memori untuk menulis log batch
- **Group commit** — gabungkan beberapa commit jadi satu flush disk

## ARIES Recovery

**ARIES** (Algorithm for Recovery and Isolation Exploiting Semantics) adalah algoritma recovery paling berpengaruh — dipakai SQL Server, IBM DB2, dan lainnya.

### Tiga Fase ARIES

1. **Analysis** — baca log dari checkpoint terakhir; tentukan dirty pages dan transaksi in-flight
2. **Redo** — ulangi semua perubahan (dari LSN recovery point) untuk mencapai state konsisten
3. **Undo** — batalkan perubahan transaksi yang belum commit (reverse order)

### Checkpoint

**Checkpoint** adalah titik sinkronisasi untuk mempercepat recovery:

- **Fuzzy checkpoint** (ARIES) — log record checkpoint kecil; tidak perlu flush semua dirty pages sinkron
- Recovery LSN dihitung, dirty pages ditulis asinkron
- Mengurangi recovery time drastis

### Rollback

Rollback butuh menulis log records — bisa menyebabkan masalah jika log penuh sementara transaksi in-flight tidak bisa lanjut maupun rollback. Sistem mengatasinya dengan space reservation.

## Locking dan Logging dalam Indexes

Index adalah struktur fisik untuk akses data — **tidak terlihat** oleh aplikasi. Invariant yang harus dijaga: index selalu mengembalikan tuples yang konsisten transaksional.

### Latching dalam B+-Trees

B+-tree punya protokol latching khusus:

- **Crabbing/Coupling** — pegang latch parent, ambil latch child, lepas parent
- **Safe node** — node yang tidak akan split/merge (tidak penuh/tidak hampir kosong)
- Minimalkan latch contention — akses konkuren tinggi

### ARIES untuk Index

- **Logical undo** — batalkan operasi index secara logis (bukan fisik) untuk konsistensi
- **Structure modification operations (SMOs)** — split/merge node dilog secara khusus

## Interdependencies of Transactional Storage

Komponen storage saling tergantung:

- **Locking** butuh log (untuk release locks saat abort)
- **Logging** butuh lock (untuk konsistensi index)
- **Buffer pool** butuh keduanya (dirty page management)
- Recovery memerlukan state dari ketiganya

Kesimpulan: desain transactional storage adalah **keseluruhan yang terintegrasi** — bukan komponen terpisah.

## Shared Components

Bagian akhir paper membahas komponen bersama:

## Memory Allocator

- **Buffer pool** dan log buffer butuh manajemen memori efisien
- **Dynamic allocation** — pool bisa tumbuh/menyusut
- **Memory pressure** — seimbangkan buffer pool vs log buffer vs work areas
- Eviction dan paging policy

## Disk Management Subsystems

- **I/O scheduling** — urutkan request disk untuk mengurangi seek
- **Prefetching** — baca halaman berikutnya yang diprediksi dibutuhkan (sequential scan)
- **Async I/O** — overlap I/O dengan komputasi
- **RAID awareness** — optimalkan untuk striping/mirroring

## Replication Services

**Replication** menyalin data ke beberapa node:

- **Synchronous** — semua replika diupdate sebelum commit (kuat, lambat)
- **Asynchronous** — update replika setelah commit (cepat, eventual consistency)
- **Primary-secondary** — satu primary menulis, banyak secondary baca
- **Multi-master** — beberapa node bisa menulis (butuh conflict resolution)

Replication untuk: **availability** (failover), **read scaling**, **disaster recovery**.

## Administration, Monitoring, dan Utilities

- **Catalog manager** — metadata sistem (tables, indexes, statistics)
- **Backup/restore** — snapshot database
- **Bulk load** — import data massal cepat
- **Monitoring** — status, performa, query progress
- **Admin tools** — konfigurasi, tuning, maintenance

## Kesimpulan

Storage management dan transactions adalah fondasi keandalan DBMS: buffer pool untuk performa, locking untuk isolation, WAL untuk durability, dan ARIES untuk recovery. Paper ini menutup dengan shared components — memory, disk, replication — yang menyatukan semuanya.

**Architecture of a Database System** adalah referensi definitif arsitektur database modern — dari life of a query, process models, parallel architecture, query processor, hingga transactional storage.

## Referensi

- Hellerstein, J. M., Stonebraker, M., & Hamilton, J. (2007). Architecture of a Database System. *Foundations and Trends in Databases, 1*(2), 141-259.
- Mohan, C., Haderle, D., Lindsay, B., Pirahesh, H., & Schwarz, P. (1992). ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks. *ACM TODS, 17*(1), 94-162.
- Gray, J., & Reuter, A. (1993). *Transaction Processing: Concepts and Techniques*. Morgan Kaufmann.
- Bernstein, P. A., Hadzilacos, V., & Goodman, N. (1987). *Concurrency Control and Recovery in Database Systems*. Addison-Wesley.
