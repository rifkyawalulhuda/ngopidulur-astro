---
title: "Denormalisasi, Data Warehouse, dan Performance Tuning Database"
description: Panduan advanced database modeling dari Beginning Database Design -
  denormalization, object model, data warehouse star snowflake schema, fact
  dimension tables, surrogate keys, OLTP vs OLAP tuning, efficient queries.
pubDate: 2026-10-11T08:00:00.000Z
image: /image/beginning-database-design-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - DataWarehouse
  - Denormalization
  - Performance
series: "Beginning Database Design"
seriesOrder: 3
---

Setelah memahami normalisasi, buku *Beginning Database Design* Gavin Powell membahas kebalikannya — **denormalisasi** — plus **data warehouse modeling** dan **performance tuning** (Chapter 6-8). Ini topik yang menentukan performa database di dunia nyata: kadang normalisasi penuh justru memperlambat query.

## Daftar Isi

- [Apa itu Denormalisasi?](#apa-itu-denormalisasi)
- [Reversing Normal Forms](#reversing-normal-forms)
- [Denormalisasi Menggunakan Specialized Objects](#denormalisasi-menggunakan-specialized-objects)
- [Denormalization Tricks](#denormalization-tricks)
- [Memahami Object Model](#memahami-object-model)
- [Asal Usul Data Warehouse](#asal-usul-data-warehouse)
- [Surrogate Keys dan Referential Integrity di DW](#surrogate-keys-dan-referential-integrity-di-dw)
- [Dimensional Database Model](#dimensional-database-model)
- [Star Schema](#star-schema)
- [Snowflake Schema](#snowflake-schema)
- [Membangun Data Warehouse Model](#membangun-data-warehouse-model)
- [Fact Tables dan Dimension Tables](#fact-tables)
- [Performance Tuning: OLTP vs OLAP](#performance-tuning-oltp-vs-olap)
- [Menulis Query yang Efisien](#menulis-query-yang-efisien)
- [Efficient Indexing](#efficient-indexing-untuk-performa)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Apa itu Denormalisasi?

**Denormalisasi** adalah proses **sengaja memasukkan redundansi** kembali ke database — kebalikan dari normalisasi. Tujuannya: **meningkatkan performa query** dengan mengurangi jumlah join.

### Kapan Denormalisasi?

- Query sangat sering dan kompleks (banyak join)
- Data jarang berubah (read-heavy)
- Kebutuhan performa lebih penting dari storage efficiency
- **Trade-off**: redundancy vs speed

Denormalisasi adalah **seni** — bukan lawan normalisasi, tapi pelengkap yang bijaksana.

## Reversing Normal Forms

### Denormalizing Beyond 3NF

- Menggabungkan tabel yang dipisah di 3NF
- Menambahkan kolom redundan (computed/denormalized column)
- Contoh: menambahkan `customer_name` kembali ke ORDERS untuk menghindari join

### Denormalizing 3NF

Menggabungkan tabel hasil pemisahan 3NF:

```
ORDERS (3NF)
order_id | customer_id
1        | 100

CUSTOMERS
customer_id | name | city
100         | Rifky | Jakarta

→ Denormalized ORDERS
order_id | customer_id | customer_name | customer_city
1        | 100         | Rifky         | Jakarta
```

### Denormalizing 2NF dan 1NF

- Menggabungkan tabel yang dipisah di 2NF (partial dependency)
- Menggabungkan sampai level 1NF (repeating groups)

## Denormalisasi Menggunakan Specialized Objects

Denormalisasi bisa dicapai tanpa merusak struktur normal:

- **Views** — query tersimpan yang menggabungkan tabel; tampak seperti denormalized tapi data tetap normal di belakang
- **Materialized views** — view yang hasilnya disimpan (snapshot); refresh periodik; akses cepat tanpa join
- **Indexes** — mempercepat query tanpa redundansi data
- **Denormalized columns** — kolom ringkasan (total, count) yang dihitung

## Denormalization Tricks

- **Summary tables** — tabel agregat (total per hari) yang diupdate berkala
- **Computed columns** — kolom hasil perhitungan disimpan
- **Snapshot tables** — copy data untuk reporting
- **Duplicate tables** — salinan tabel untuk beban read
- **Common denormalized fields** — gabungkan field yang sering di-query bersama

**Aturan emas:** denormalisasi hanya untuk **read-heavy**, **query yang diketahui**, dan **performa yang terukur** — bukan tebakan.

## Memahami Object Model

**Object model** dalam database:

- Data disimpan sebagai **objek** dengan perilaku (methods)
- **Inheritance** — tabel bisa mewarisi struktur
- **Encapsulation** — data dan behavior bersama
- Contoh: Oracle Object Types, PostgreSQL

Object model berguna untuk domain kompleks (CAD, multimedia, geospasial) — tapi menambah kompleksitas design.

## Asal Usul Data Warehouse

**Data warehouse** adalah database khusus untuk **analisis dan pengambilan keputusan** (decision support):

- Berasal dari kebutuhan **analisis bisnis lintas sistem**
- Menggabungkan data dari **banyak sumber** (OLTP, external)
- Optimized untuk **query besar dan agregasi**
- Data **historis** — bukan hanya kondisi terkini
- Memisahkan beban analisis dari sistem transaksional

### Relational Model dan Data Warehouse

Relational database bisa menjadi dasar DW, tapi model khusus (dimensional) lebih efisien untuk analisis.

## Surrogate Keys dan Referential Integrity di DW

### Surrogate Keys

**Surrogate key** adalah key **buatan (artificial)** — bukan dari data bisnis:

```sql
-- Surrogate key: nilai otomatis tanpa makna bisnis
CREATE TABLE dim_customer (
    cust_sk   SERIAL PRIMARY KEY,  -- surrogate key
    cust_id   VARCHAR(20),         -- natural key (dari sumber)
    name      VARCHAR(100),
    city      VARCHAR(50)
);
```

Keuntungan:
- Tidak berubah saat data sumber berubah
- Join lebih cepat (integer vs string panjang)
- Mendukung historisasi (SCD — Slowly Changing Dimension)

### Referential Integrity di DW

- DW sering **tidak menegakkan** FK antar fact-dimension (performa load)
- Integritas dijaga **saat proses ETL** (extract, transform, load)
- Trade-off: kecepatan load vs guarantee konsistensi

## Dimensional Database Model

**Dimensional model** adalah pendekatan khusus untuk data warehouse:

- **Fact tables** — data pengukuran (measures/angka)
- **Dimension tables** — konteks deskriptif (siapa, kapan, apa, di mana)
- Relasi **star-like** — fact di tengah, dimension di sekitar

## Star Schema

![Star Schema — Data Warehouse Model](/image/database-star-schema.svg)

**Star schema** adalah model paling umum dan sederhana:

- Satu **fact table** di tengah
- Beberapa **dimension tables** di sekeliling (seperti bintang)
- Fact terhubung langsung ke tiap dimension (1:M)
- **Join sederhana dan cepat**

```sql
-- Contoh query star schema
SELECT
    d.product_category,
    t.month,
    SUM(f.revenue) AS total_revenue
FROM fact_sales f
JOIN dim_product d ON f.prod_sk = d.prod_sk
JOIN dim_time t ON f.time_sk = t.time_sk
GROUP BY d.product_category, t.month
ORDER BY total_revenue DESC;
```

**Kelebihan:** simple, cepat, mudah dipahami. **Kekurangan:** denormalized dimensions (redundansi).

## Snowflake Schema

**Snowflake schema** adalah star schema yang **dimension-nya dinormalisasi**:

- Dimension dipecah menjadi sub-dimension
- Mirip kristal salju
- **Kelebihan:** lebih sedikit redundansi, storage hemat
- **Kekurangan:** lebih banyak join, query lebih kompleks

| Aspek | Star | Snowflake |
|-------|------|-----------|
| Dimension | Denormalized | Normalized |
| Join | Sedikit | Banyak |
| Query speed | Cepat | Lebih lambat |
| Storage | Lebih besar | Lebih hemat |
| Kompleksitas | Rendah | Lebih tinggi |

**Rekomendasi:** star schema umumnya lebih baik untuk kebanyakan DW karena kecepatan query.

## Membangun Data Warehouse Model

### Data Warehouse Modeling Step by Step

1. **Identifikasi fakta bisnis** — apa yang diukur? (sales, orders, clicks)
2. **Identifikasi dimensi** — bagaimana fakta dianalisis? (time, product, customer, store)
3. **Desain fact table** — measures + FK ke dimensions
4. **Desain dimension tables** — atribut deskriptif + surrogate keys
5. **Grain (tingkat detail)** — tentukan level detail terkecil fact
6. **Historization** — bagaimana menangani perubahan dimensi (SCD)
7. **ETL design** — bagaimana data masuk dari sumber

### Berapa Lama Menyimpan Data?

- **Detail data** — simpan beberapa tahun (bergantung kebutuhan bisnis)
- **Ringkasan (aggregates)** — simpan lebih lama
- **Purge/archive policy** — hapus atau arsip data tua
- **Rollup** — detail lama di-agregat ke level lebih tinggi

### Types of Dimension Tables

- **Conformed dimensions** — dipakai bersama banyak fact tables (standard)
- **Degenerate dimensions** — atribut fact yang berperilaku dimension (order number)
- **Junk dimensions** — gabungan flag/atribut kecil
- **Slowly Changing Dimensions (SCD)**:
  - **Type 1** — overwrite (tidak simpan sejarah)
  - **Type 2** — tambah row baru (simpan sejarah penuh)
  - **Type 3** — simpan nilai lama di kolom terpisah

### Fact Tables

- **Measures** — angka yang dianalisis (revenue, quantity, profit)
- **Additive** — bisa dijumlahkan lintas semua dimensi (revenue)
- **Semi-additive** — bisa dijumlahkan beberapa dimensi (balance)
- **Non-additive** — tidak bisa dijumlahkan (ratio, price)

## Performance Tuning: OLTP vs OLAP

### Faktor yang Mempengaruhi OLTP Tuning

- **Banyak transaksi kecil** — insert/update/delete cepat
- **Concurrency** — banyak user bersamaan
- **Index untuk lookup cepat** — primary key lookups
- **Normalisasi baik** — hindari update anomaly

### Faktor Client-Server Tuning

- **Network round-trips** — kurangi jumlah query
- **Connection pooling** — reuse koneksi
- **Batch processing** — gabungkan operasi

### Faktor Data Warehouse Tuning

- **Query besar** — full scans dan agregasi
- **Bitmap indexes** — untuk kolom kardinalitas rendah
- **Partitioning** — pecah tabel besar
- **Aggregates/summary tables** — precompute

## Menulis Query yang Efisien

### SELECT Command

- **Pilih kolom yang dibutuhkan** — jangan SELECT * tanpa perlu
- **Filter sedini mungkin** — WHERE sebelum join
- **Batasi hasil** — LIMIT jika hanya butuh beberapa baris

### Filtering dengan WHERE

```sql
-- Efisien: gunakan index
SELECT * FROM orders WHERE order_date >= '2026-01-01';

-- Hindari fungsi pada kolom di WHERE (mati index)
-- Lambat: WHERE YEAR(order_date) = 2026
-- Cepat: WHERE order_date BETWEEN '2026-01-01' AND '2026-12-31'
```

### HAVING vs WHERE

- **WHERE** — filter baris SEBELUM agregasi
- **HAVING** — filter hasil SETELAH agregasi

```sql
SELECT customer_id, COUNT(*) cnt
FROM orders
WHERE status = 'PAID'          -- filter baris dulu
GROUP BY customer_id
HAVING COUNT(*) > 5;           -- filter grup
```

### Joins

- Gunakan **indexed join columns**
- **Equi-join** (ON =) lebih efisien dari non-equi
- Hindari join ke tabel tanpa index

### Auto Counters

- **Serial/auto-increment** keys efisien untuk PK
- Monotonik — insert selalu di akhir, index tetap compact

## Efficient Indexing untuk Performa

### Jenis Index

- **BTree** — default, balanced tree, baik untuk range dan equality
- **Bitmap** — kolom kardinalitas rendah, query warehouse
- **Hash** — equality lookup cepat
- **Composite** — multiple columns dalam satu index

### Cara Menerapkan Index di Dunia Nyata

- Index **kolom yang sering di-WHERE dan JOIN**
- **Composite index** untuk query dengan beberapa filter: `INDEX (city, status)`
- Index **FK columns** untuk join cepat
- **Order kolom composite** — kolom paling selektif dulu

### Kapan TIDAK Menggunakan Index

- Tabel **kecil** (full scan lebih cepat)
- Kolom **jarang di-query**
- Kolom **sering di-update** (index update overhead)
- Data **hampir unik seragam** (semua baris sama)
- **Batch load besar** — drop index dulu, rebuild setelah

## Menggunakan Views

View membantu performa dan kesederhanaan:

- Menyembunyikan kompleksitas join
- **Materialized views** — hasil tersimpan untuk akses cepat
- Keamanan — batasi kolom/baris yang terlihat

## Application Caching

Cache di sisi aplikasi mengurangi beban database:

- **Cache hasil query** yang jarang berubah
- **Redis/Memcached** untuk hot data
- **CDN** untuk konten statis
- Invalidasi cache saat data berubah

## Kesimpulan

Denormalisasi, data warehouse, dan performance tuning melengkapi pemahaman database design: normalisasi untuk **integritas**, denormalisasi dan tuning untuk **kecepatan**. Star schema adalah pola dominan untuk analitik, dengan fact/dimension tables sebagai fondasi.

Di artikel berikutnya: **case study lengkap** — membangun database model dari analisis hingga implementasi (Part III-IV).

## Referensi

- Powell, G. (2006). *Beginning Database Design*. Wiley Publishing.
- Kimball, R., & Ross, M. (2013). *The Data Warehouse Toolkit* (3rd ed.). Wiley.
- Inmon, W. H. (2005). *Building the Data Warehouse* (4th ed.). Wiley.
- Nygard, M. (2018). *Release It!* (2nd ed.). Pragmatic Bookshelf.
