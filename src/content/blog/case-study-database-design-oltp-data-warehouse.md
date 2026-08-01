---
title: "Case Study Database Design: OLTP, Data Warehouse, dan Advanced Topics"
description: Panduan lengkap case study database design dari Beginning Database
  Design - analisis perencanaan, OLTP dan data warehouse model, membuat tabel,
  referential integrity, business rules, stored procedures, advanced structures,
  hardware RAID replication.
pubDate: 2026-10-12T08:00:00.000Z
image: /image/beginning-database-design-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - CaseStudy
  - OLTP
  - BusinessRules
series: "Beginning Database Design"
seriesOrder: 4
---

Bagian III dan IV dari *Beginning Database Design* karya Gavin Powell membawa semuanya ke praktik: **case study lengkap** membangun database model — dari analisis kebutuhan bisnis, desain tabel, normalisasi, hingga business rules — ditambah **advanced topics** seperti advanced database structures dan hardware resources.

## Daftar Isi

- [Langkah-langkah Membuat Database Model](#langkah-langkah-membuat-database-model)
- [Memahami Analysis](#memahami-analysis)
- [Potensi Masalah dan Misconceptions](#potensi-masalah-dan-misconceptions)
- [Case Study: OLTP Database Model](#case-study-oltp-database-model)
- [Case Study: Data Warehouse Model](#case-study-data-warehouse-model)
- [Project Management](#project-management)
- [Membuat dan Menyempurnakan Tabel](#membuat-dan-menyempurnakan-tabel)
- [Menegakkan Table Relationships](#menegakkan-table-relationships)
- [Normalisasi dan Denormalisasi dalam Case Study](#normalisasi-dan-denormalisasi-dalam-case-study)
- [Memperbaiki Field Structure](#memperbaiki-field-structure)
- [Business Rules dan Field Settings](#business-rules-dan-field-settings)
- [Stored Code dalam Database](#stored-code-dalam-database)
- [Advanced Database Structures](#advanced-database-structures)
- [Hardware Resources](#hardware-resources)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Langkah-langkah Membuat Database Model

### Step 1: Analysis

Memahami kebutuhan bisnis dan data:

- Wawancara stakeholder
- Identifikasi entitas dan data
- Pahami business rules
- Dokumentasikan requirement

### Step 2: Design

Membuat model konseptual dan logis:

- ERD (Entity-Relationship Diagram)
- Normalisasi
- Tabel, keys, relationships

### Step 3: Construction

Membangun database fisik:

- DDL (CREATE TABLE, INDEX)
- Constraints dan keys
- View, stored procedures

### Step 4: Implementation

- Load data
- Testing
- Deployment
- Training user

## Memahami Analysis

### Analysis Considerations

- **Tujuan bisnis** — apa yang ingin dicapai sistem?
- **Data yang dibutuhkan** — data apa yang harus disimpan?
- **Proses bisnis** — bagaimana data dihasilkan dan digunakan?
- **Stakeholder** — siapa yang terlibat dan butuh apa?
- **Batasan** — budget, waktu, regulasi

### Potensi Masalah dan Misconceptions

- **Normalization dan data integrity** — normalisasi bukan jaminan integritas; constraint tetap perlu
- **"Lebih banyak normalisasi = query lebih baik"** — salah; terlalu ternormalisasi justru memperlambat query (banyak join)
- **Performance** — normalisasi vs denormalisasi harus seimbang
- **Generic dan standardized models** — model generik bisa mengorbankan kejelasan

## Case Study: OLTP Database Model

Buku menggunakan **case study perusahaan** yang menjalankan operasi bisnis nyata.

### Establishing Company Operations

Perusahaan contoh (misal distributor/retail) dengan operasi:

- **Customers** — pelanggan yang membeli
- **Products** — produk yang dijual
- **Orders** — pesanan pelanggan
- **Order items** — detail isi pesanan
- **Inventory** — stok produk
- **Shipments** — pengiriman
- **Invoices** — tagihan

### Discovering Business Rules

Business rules dari operasi:

- Setiap order harus punya minimal satu item
- Harga produk mengikuti price list saat order
- Stok tidak boleh negatif
- Customer harus punya alamat valid
- Order status berubah: NEW → PAID → SHIPPED → DELIVERED

### Membuat Tabel

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE,
    phone       VARCHAR(30),
    city        VARCHAR(50),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    order_id    SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    order_date  DATE NOT NULL,
    status      VARCHAR(20) DEFAULT 'NEW',
    total       NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE order_items (
    order_id   INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    price      NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
```

## Case Study: Data Warehouse Model

### Establishing Company Operations

Data warehouse menganalisis operasi perusahaan:

- **Fakta**: penjualan (revenue, quantity)
- **Dimensi**: waktu, produk, customer, store, region
- Analisis: tren penjualan, produk terlaris, segmentasi customer

### Discovering Business Rules

- Revenue = quantity × price
- Analisis per bulan, per kategori, per region
- Data historis 5 tahun
- Dimuat dari OLTP via ETL

## Project Management

### Project Planning dan Timelines

- **Milestones** — analisis, desain, konstruksi, implementasi
- **Estimasi** — waktu per fase
- **Dependencies** — urutan kerja
- **Risiko** — identifikasi dan mitigasi

### Budgeting

- Sumber daya (tim, tools)
- Infrastruktur (server, software)
- Pelatihan
- Maintenance

## Membuat dan Menyempurnakan Tabel

### Case Study: Creating Tables

Proses iteratif: draft tabel → review → refine:

**OLTP model**: customers, products, orders, order_items, inventory

**DW model**: dim_time, dim_product, dim_customer, fact_sales

### Iterasi Refinement

- Tabel terlalu luas → pecah
- Tabel terlalu sempit → gabung
- Kolom berlebihan → hapus
- Naming konsisten

## Menegakkan Table Relationships

### Referential Integrity

```sql
-- FK dengan deletion rules
CREATE TABLE orders (
    order_id    SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id)
        ON DELETE RESTRICT   -- tolak hapus customer dengan order
);
```

### Primary dan Foreign Keys

- PK unik dan not null
- FK mereferensikan PK
- Index otomatis pada PK; buat index manual pada FK

### Menggunakan Surrogate Keys

- OLTP: surrogate key menambah stabilitas
- DW: **wajib** untuk SCD (historization)

### Identifying vs Non-Identifying Relationships

- Identifying: FK bagian dari PK child (order_items)
- Non-identifying: FK biasa (orders.customer_id)

### Parent Records tanpa Children

- `LEFT JOIN` untuk menemukan
- Keputusan bisnis: apakah parent wajib punya child?

### Child Records dengan Optional Parents

- FK nullable
- `OUTER JOIN` untuk mengambil data

## Normalisasi dan Denormalisasi dalam Case Study

Case study menunjukkan iterasi nyata:

1. **Normalize OLTP** — terapkan 1NF, 2NF, 3NF
2. **Denormalize 2NF** — gabung kembali untuk query sering
3. **Denormalize 3NF** — tambah kolom redundan yang di-query
4. **Deeper normalization layers** — 4NF/5NF jika diperlukan

Contoh denormalisasi praktis: menambahkan `customer_name` ke ORDERS untuk report yang sering — menghindari join, tapi menjaga data via aplikasi/trigger.

## Memperbaiki Field Structure

### Refining Field Structure

- Pilih datatype yang tepat per field
- Tetapkan panjang dan presisi
- Default values
- Nullability — kapan boleh NULL?

### Memahami Datatypes

- **ANSI datatypes** — standar lintas database: INTEGER, DECIMAL, CHAR, VARCHAR, DATE, TIMESTAMP
- **Microsoft Access datatypes** — AutoNumber, Memo, Currency, OLE Object
- **Specialized** — BLOB, XML, spatial, JSON

### Keys dan Indexes dalam Praktik

- Index pada kolom yang sering WHERE/JOIN
- **Composite index** untuk filter kombinasi
- Kapan tidak: tabel kecil, kolom jarang di-query, update berat

## Business Rules dan Field Settings

### Mengklasifikasikan Business Rules

Business rules diklasifikasikan:

- **Table/relation level** — antar tabel (FK, uniqueness)
- **Field level** — per kolom (NOT NULL, CHECK, DEFAULT)
- **Application level** — di aplikasi (validasi form)

### Explicitly Declared Field Settings

```sql
CREATE TABLE products (
    product_id  SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    price       NUMERIC(12,2) CHECK (price >= 0),
    stock_qty   INTEGER DEFAULT 0 CHECK (stock_qty >= 0),
    is_active   BOOLEAN DEFAULT TRUE
);
```

## Stored Code dalam Database

### Stored Procedure

Blok kode yang disimpan dan dieksekusi di server:

```sql
CREATE OR REPLACE FUNCTION ship_order(p_order_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE orders SET status = 'SHIPPED'
    WHERE order_id = p_order_id;
    -- log activity
END;
$$ LANGUAGE plpgsql;
```

### Stored Function

Mengembalikan nilai; bisa dipakai dalam query:

```sql
CREATE FUNCTION total_spent(p_customer_id INTEGER)
RETURNS NUMERIC AS $$
    SELECT COALESCE(SUM(total), 0) FROM orders
    WHERE customer_id = p_customer_id;
$$ LANGUAGE SQL;
```

### Event Trigger

Eksekusi otomatis saat event database (INSERT/UPDATE/DELETE):

```sql
CREATE TRIGGER update_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION decrement_stock();
```

### External Procedure dan Macro

- External procedure — panggil kode luar (C, Java)
- Macro — serangkaian operasi otomatis (Access)

### Encoding Business Rules

Business rules di-encode di lapisan yang tepat: constraints di database untuk integrity inti, validation di aplikasi untuk UX, stored procedures untuk proses kompleks.

## Advanced Database Structures

### Views dan Materialized Views

- **View** — query tersimpan, data live
- **Materialized view** — hasil tersimpan, refresh manual/periodik; cepat untuk report

### Indexes Advanced

- **BTree** — default, range query
- **Bitmap** — kolom kardinalitas rendah, warehouse
- **Hash keys** — lookup titik
- **ISAM keys** — index file-based (legacy)

### Clusters

- Data fisik dikelompokkan berdasar key yang sama
- **Index Organized Tables (IOT)** — data diurutkan dalam index
- Akses berurutan cepat

### Auto Counters

- Kolom auto-increment (SERIAL, IDENTITY)
- Efisien untuk PK dan index

### Partitioning dan Parallel Processing

**Partitioning** — pecah tabel besar menjadi partisi:

- **Range** — per rentang nilai (bulanan, tahunan)
- **Hash** — distribusi merata
- **List** — per kategori
- Keuntungan: scan lebih cepat, maintenance per partisi

**Parallel processing** — query dipecah dan dijalankan paralel:

- Parallel scan
- Parallel join
- Parallel DML

## Hardware Resources

### Berapa Banyak Hardware?

- **CPU** — proses query dan transaksi
- **Memory** — cache data dan buffer
- **Disk** — penyimpanan dan I/O
- **Network** — komunikasi client-server

### Berapa Banyak Memory?

- Buffer cache untuk data panas (hot data)
- Work area untuk sort/hash
- Rule of thumb: semakin besar data panas, semakin besar cache

### Specialized Hardware Architectures

**RAID Arrays** — redundancy dan performa disk:

| RAID Level | Deskripsi | Kelebihan |
|-----------|-----------|-----------|
| **RAID 0** | Striping | Performa, tanpa redundancy |
| **RAID 1** | Mirroring | Redundansi penuh |
| **RAID 5** | Striping + parity | Performa + redundancy |
| **RAID 10** | Mirror + stripe | Terbaik, mahal |

**Standby Databases** — database cadangan:

- **Cold standby** — restore manual
- **Warm standby** — backup periodik, apply perubahan
- **Hot standby** — terus sinkron, failover cepat

**Replication** — data disalin ke lokasi lain:

- Master-slave — satu master, banyak slave read
- Multi-master — beberapa master
- Snapshot — copy periodik

**Grids dan Computer Clustering**:

- **Cluster** — beberapa server bekerja bersama, failover
- **Grid** — resource sharing lintas node
- **Load balancing** — distribusi beban
- **High availability** — minim downtime

## Kesimpulan

Case study buku ini menunjukkan bahwa database design adalah **proses iteratif**: analisis → desain → konstruksi → implementasi → refine. Business rules diterjemahkan menjadi constraints dan stored code. Advanced structures (partitioning, materialized views) dan hardware planning (RAID, replication, clustering) melengkapi desain untuk performa dan availability.

**Beginning Database Design** adalah fondasi lengkap: dari konsep relasional, normalisasi, SQL, data warehouse, hingga implementasi nyata.

## Referensi

- Powell, G. (2006). *Beginning Database Design*. Wiley Publishing.
- Kimball, R., & Ross, M. (2013). *The Data Warehouse Toolkit* (3rd ed.). Wiley.
- Celko, J. (2005). *Joe Celko's SQL for Smarties* (4th ed.). Morgan Kaufmann.
- Date, C. J. (2003). *An Introduction to Database Systems* (8th ed.). Addison-Wesley.
