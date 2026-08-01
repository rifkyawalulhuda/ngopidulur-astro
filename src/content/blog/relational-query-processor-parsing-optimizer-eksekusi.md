---
title: "Relational Query Processor: Parsing, Optimisasi, dan Eksekusi SQL"
description: Panduan query processor dari paper Architecture of a Database
  System - SQL parser authorization, query rewrite, query optimizer cost-based,
  plan executor operators, access methods, data warehouse, extensibility.
pubDate: 2026-10-14T08:00:00.000Z
image: /image/db-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - SQL
  - QueryOptimizer
  - DBMS
series: "Architecture of a Database System"
seriesOrder: 2
---

Section 4 dari paper *Architecture of a Database System* membedah **Relational Query Processor** — otak dari RDBMS yang mengubah SQL menjadi eksekusi efisien. Dari parsing, rewrite, optimasi biaya (cost-based optimization), hingga eksekusi dengan operator tree.

## Daftar Isi

- [Alur Query Processing](#alur-query-processing)
- [Query Parsing dan Authorization](#query-parsing-dan-authorization)
- [Query Rewrite](#query-rewrite)
- [Query Optimizer](#query-optimizer)
- [Cost-Based Optimization](#cost-based-optimization)
- [Query Executor](#query-executor)
- [Access Methods](#access-methods)
- [Data Warehouses](#data-warehouses)
- [Database Extensibility](#database-extensibility)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Alur Query Processing

Query SQL mengalir melalui empat tahap:

1. **Parsing** — cek sintaks, resolusi nama, authorization
2. **Rewrite** — transformasi query ke bentuk setara yang lebih efisien
3. **Optimization** — pilih plan eksekusi dengan biaya terendah
4. **Execution** — jalankan plan via operator tree

DML (SELECT, INSERT, UPDATE, DELETE) diproses melalui jalur ini. DDL (CREATE TABLE, CREATE INDEX) umumnya **tidak** melalui optimizer — dieksekusi prosedural oleh storage engine dan catalog manager.

## Query Parsing dan Authorization

Tugas utama **SQL Parser**:

1. **Cek query benar** — sintaks valid
2. **Resolusi nama dan referensi** — canonicalize nama tabel
3. **Konversi ke format internal** — untuk optimizer
4. **Verifikasi authorization** — user berhak eksekusi

### Canonicalization

Parser menormalisasi nama tabel menjadi **fully qualified name**:

```
server.database.schema.table   (four-part name, multi-server)
database.schema.table          (single server)
schema.table                   (single database)
```

Table aliases diganti dengan fully qualified name. Setelah itu:

- **Catalog manager** memeriksa tabel terdaftar di system catalog
- **Metadata** tabel di-cache ke internal query data structures
- **Attribute references** diverifikasi benar
- **Data types** dipakai untuk disambiguasi overloaded operators dan expressions

### View Expansion

Referensi ke views di-expand: definisi view digabung ke query — view diperlakukan seperti **macro** yang di-substitusi saat parsing.

## Query Rewrite

Setelah parsing, **query rewrite** mengoptimalkan query:

### View Merging

Menggabungkan query yang mereferensikan view dengan definisi view — memungkinkan optimizer bekerja dengan query penuh.

### Subquery Flattening (Unnesting)

Mengubah subquery menjadi join:

```sql
-- Subquery asli
SELECT * FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE total > 100000);

-- Di-rewrite menjadi join
SELECT DISTINCT c.*
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.total > 100000;
```

Subquery flattening sering menghasilkan plan yang jauh lebih efisien.

### Predicate Move-Around

Mendorong predikat (WHERE conditions) lebih dekat ke data — filter sedini mungkin:

- **Pushdown** — pindahkan predikat ke bawah tree (sebelum join)
- Mengurangi jumlah baris yang diproses join

### Query Rewrite for Optimization

Rewrite lain: constant folding (`WHERE 2+2 = 4` → `WHERE 4 = 4`), simplification, dan transformasi setara.

## Query Optimizer

**Query optimizer** adalah komponen paling kompleks — menemukan **rencana eksekusi terbaik** di antara banyak kemungkinan.

### Tantangan Optimasi

Untuk query sederhana dengan beberapa join, bisa ada **ratusan ribu plan berbeda**. Optimizer mencari plan dengan **estimasi biaya terendah**.

### Space of Plans

Plan dibangun dari operator-operator dasar:

- **Scan**: sequential scan, index scan
- **Join**: nested-loop join, hash join, merge join
- **Aggregation**: hash aggregation, sort-based aggregation
- **Sorting**: external sort

Setiap operator punya beberapa implementasi dengan karakteristik biaya berbeda.

## Cost-Based Optimization

**Cost-based optimizer** mengevaluasi plan berdasarkan model biaya:

### Estimasi Biaya

Biaya dihitung dari:

- **Selectivity** — estimasi fraksi baris yang lolos predikat
- **Cardinality** — estimasi jumlah baris hasil tiap operator
- **I/O cost** — halaman disk yang dibaca/ditulis
- **CPU cost** — operasi per baris

### Statistics dan Catalog

Optimizer menggunakan **statistics** yang disimpan di catalog:

- **Histograms** — distribusi nilai kolom
- **Number of distinct values** — untuk selectivity estimation
- **Table size** — jumlah halaman dan baris
- **Index metadata** — jenis dan struktur index

### Plan Space Search

- **Dynamic programming** — eksplorasi join orders sistematis (System R style)
- **Left-deep vs bushy trees** — struktur tree join
- **Greedy heuristics** — untuk query sangat kompleks

## Query Executor

**Plan executor** mengeksekusi query plan — tree dari operators:

![Query Plan — Operator Tree](/image/db-query-plan-tree.svg)

Contoh plan untuk query join 3 tabel:

```text
HashJoin (customer_id)
  +-- SeqScan (customers)   -- filter: city = 'Jakarta'
  +-- HashJoin (product_id)
        +-- SeqScan (orders)    -- filter: status = 'PAID'
        +-- IndexScan (products, PK)
```

### Iterators (Volcano Style)

Operator diimplementasikan sebagai **iterators** dengan tiga operasi dasar:

- **Open** — inisialisasi, siapkan state
- **Next** — ambil tuple berikutnya
- **Close** — bersihkan resource

Model ini komposisional: tree operator mana pun bisa digabung, tiap operator memperlakukan anaknya sebagai iterator.

### Implementation

- **Materialization** — hasil antara disimpan penuh (untuk pipelining)
- **Pipelining** — hasil dipakai langsung tanpa materialisasi penuh
- **Multi-threaded execution** — operator dijalankan paralel untuk parallelism intra-query

## Access Methods

**Access methods** adalah modul yang mengakses data dari storage:

### Heap Files

- Record disimpan **tanpa urutan tertentu**
- **Full scan** — baca semua halaman
- Cocok untuk full table scan dan insert-heavy

### Index Files

- **B+-tree** — ordered index, mendukung range query dan point lookup
- **Hash** — point lookup cepat, tanpa range
- **Bitmap** — kompresi untuk kolom kardinalitas rendah

### Menentukan Access Method

Optimizer memilih access method berdasarkan:

- Selectivity query (sedikit baris → index; banyak → scan)
- Jenis predikat (equality, range, IN)
- Ordering requirement (B+-tree bisa memberi sorted output)

## Data Warehouses

Section 4.6 membahas query processing untuk **data warehouse**:

- **Star schemas** — fact table + dimension tables
- **Bitmap joins** — index bitmap untuk join cepat di dimensi
- **Aggregation pushdown** — agregasi dilakukan sebelum join besar
- **Materialized views** — precomputed aggregates untuk query berulang
- **OLAP operations** — ROLLUP, CUBE, window functions

### Query Processing Optimization di DW

- **Star join** — optimasi khusus join fact-dimension
- **Bitmap index intersection** — kombinasi beberapa bitmap index
- **Parallel aggregation** — bagi agregasi ke banyak processor

## Database Extensibility

Section 4.7 membahas **ekstensibilitas** — DBMS bisa diperluas:

- **User-defined types (UDTs)** — tipe data custom
- **User-defined functions (UDFs)** — fungsi custom dalam query
- **Extensible indexing** — index custom (GiST di PostgreSQL)
- **Extensible optimizer** — hook untuk aturan optimasi custom
- **Abstract data types (ADTs)** — operasi dan akses method custom

PostgreSQL adalah contoh terkenal sistem extensible — banyak tipe dan index baru bisa ditambahkan tanpa mengubah kernel.

## Kesimpulan

Relational query processor adalah perjalanan kompleks: SQL → parse → rewrite → optimize → execute. Cost-based optimization adalah jantungnya — menyeimbangkan selectivity estimation, statistics, dan space of plans. Executor menjalankan plan sebagai tree operator dengan model iterator.

Di artikel berikutnya: **Storage Management dan Transactions** — buffer pool, locking, logging, recovery (ARIES).

## Referensi

- Hellerstein, J. M., Stonebraker, M., & Hamilton, J. (2007). Architecture of a Database System. *Foundations and Trends in Databases, 1*(2), 141-259.
- Selinger, P. G., Astrahan, M. M., Chamberlin, D. D., Lorie, R. A., & Price, T. G. (1979). Access Path Selection in a Relational Database Management System. *ACM SIGMOD*, 23-34.
- Graefe, G. (1993). Query Evaluation Techniques for Large Databases. *ACM Computing Surveys, 25*(2), 73-169.
- Chaudhuri, S., & Dayal, U. (1997). An Overview of Data Warehousing and OLAP Technology. *ACM SIGMOD Record, 26*(1), 65-74.
