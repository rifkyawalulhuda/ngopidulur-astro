---
title: "Database Design untuk Pemula: Model Relasional, ERD, dan Keys"
description: Panduan lengkap Beginning Database Design Gavin Powell (Wiley 2006) -
  konsep database, evolusi model database, file system hierarchical network
  relational object, ERD crow's foot, primary foreign unique keys, referential
  integrity, indexes, business rules.
pubDate: 2026-10-09T08:00:00.000Z
image: /image/beginning-database-design-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - SQL
  - ERD
  - DataModeling
series: "Beginning Database Design"
seriesOrder: 1
---

*Beginning Database Design* karya **Gavin Powell** (Wiley, 2006) adalah buku klasik untuk memahami **relational database modeling** dari perspektif pemula. Buku 496 halaman ini membangun fondasi: apa itu database, evolusi model database, komponen-komponen modeling, hingga praktik normalisasi dan design.

## Daftar Isi

- [Memahami Konsep Database](#memahami-konsep-database)
- [Evolusi Database Modeling](#evolusi-database-modeling)
- [File Systems dan Database Hierarchy](#file-systems)
- [Relational Database Model](#relational-database-model)
- [Object dan Object-Relational Model](#object-dan-object-relational-model)
- [Tipe-tipe Database](#tipe-tipe-database)
- [Business Rules dan Objektif](#business-rules-dan-objektif)
- [Faktor Manusia dalam Database Design](#faktor-manusia-dalam-database-design)
- [Building Blocks: Tables, Rows, Fields](#building-blocks-tables-rows-fields)
- [Datatypes](#datatypes)
- [Hubungan antar Tabel dalam ERD](#hubungan-antara-tabel-dalam-erd)
- [Primary Key, Foreign Key, Unique Key](#primary-key-foreign-key-unique-key)
- [Referential Integrity](#referential-integrity)
- [Indexes](#indexes)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Memahami Konsep Database

**Database** adalah repository untuk data — tempat menyimpan banyak informasi. **Relational database** adalah tipe khusus yang menggunakan struktur bernama **tables**. Tabel-tabel dihubungkan menggunakan **relationships** — tidak hanya untuk mengorganisir data, tapi juga memungkinkan pengambilan informasi nanti.

**Database model** adalah metode yang digunakan untuk membuat struktur penyimpanan data. **Aplikasi** adalah software yang digunakan untuk mengakses dan memanipulasi data dalam database.

## Evolusi Database Modeling

Model database berevolusi seiring waktu:

### File Systems

Tahap paling awal — data disimpan dalam file flat (teks/binary):

- Sederhana tapi tidak terstruktur
- Tidak ada hubungan antar data
- Duplikasi data tinggi
- Tidak ada query language

### Hierarchical Database Model

Data diorganisir dalam struktur **pohon (tree)**:

- **Parent-child** — satu parent punya banyak children
- Contoh: IMS (IBM Information Management System)
- **Kelebihan**: navigasi cepat dari root
- **Kekurangan**: tidak fleksibel — mengubah struktur sulit; child hanya punya satu parent

### Network Database Model

Evolusi dari hierarchical — mengizinkan **banyak parent**:

- Setiap record bisa punya banyak parent dan children (graph)
- Contoh: IDMS, CODASYL
- **Kelebihan**: lebih fleksibel dari hierarchical
- **Kekurangan**: kompleksitas navigasi tinggi

### Relational Database Model

Model yang mendominasi dunia database modern:

- Data dalam **tables** (relations) dengan baris dan kolom
- Tabel dihubungkan dengan **keys** (primary/foreign)
- **Query** dengan bahasa standar (SQL)
- **Kelebihan**: fleksibel, mudah dipahami, standar
- **Kekurangan**: performa bisa menurun untuk hubungan sangat kompleks

## Relational Database Management System

**RDBMS** adalah software yang mengelola relational database. Sejarahnya dimulai dengan penelitian **E.F. Codd** di IBM (1970) yang memperkenalkan model relasional. Implementasi awal termasuk System R (IBM), kemudian Oracle, DB2, SQL Server, MySQL, PostgreSQL, dan lainnya.

## Object dan Object-Relational Model

**Object database model** menyimpan data sebagai objek (seperti OOP):

- Encapsulation, inheritance, polymorphism
- Contoh: ObjectStore, GemStone
- Kurang populer karena kurang standar

**Object-relational model** menggabungkan keduanya:

- Relational tables + object extensions (custom datatypes, methods)
- Contoh: Oracle Objects, PostgreSQL
- **Best of both worlds**: SQL + object-oriented features

## Tipe-tipe Database

### Transactional Databases (OLTP)

- Menangani transaksi bisnis sehari-hari (order, payment)
- Banyak insert/update/delete kecil
- Optimized untuk **concurrency** dan **kecepatan tulis**
- Contoh: sistem POS, e-commerce checkout

### Decision Support Databases (OLAP)

- Untuk analisis dan pengambilan keputusan
- Banyak read, agregasi besar
- Optimized untuk **query kompleks** dan **read speed**
- Contoh: data warehouse, reporting

### Hybrid Databases

- Gabungan OLTP dan OLAP dalam satu database
- Menyeimbangkan kebutuhan tulis dan baca
- Kompromi performa di kedua sisi

## Business Rules dan Objektif

### Apa itu Business Rules?

**Business rules** adalah pernyataan tentang bagaimana bisnis beroperasi — yang harus dipatuhi database. Contoh: *"Setiap order harus memiliki minimal satu item"* atau *"Pelanggan harus berusia minimal 17 tahun"*.

### Pentingnya Business Rules

- Menjaga **integritas data** — data yang salah tidak bisa masuk
- Menjaga **konsistensi** — aturan sama di semua aplikasi
- **Dokumentasi** — aturan bisnis terdokumentasi jelas
- Basis untuk **constraints dan validasi** di database

### Objektif Database Design

Sebelum memodelkan, definisikan tujuan:
- Apa yang ingin dicapai sistem?
- Data apa yang harus disimpan?
- Siapa pengguna dan kebutuhan mereka?
- Bagaimana data digunakan dan diakses?

## Faktor Manusia dalam Database Design

### People as a Resource

Manusia adalah sumber daya penting dalam design:

- **User** — orang yang menggunakan sistem; pahami kebutuhan mereka
- **Manajemen** — pemangku kepentingan yang mendanai dan menentukan arah
- **Developer** — yang membangun sistem
- **DBA** — yang mengelola database

### Talking to the Right People

- Wawancara **user langsung** — bukan hanya manajemen
- Tanyakan **apa yang mereka kerjakan** sehari-hari
- Pahami **proses bisnis aktual** — bukan yang tertulis
- Konfirmasi kebutuhan dengan **semua stakeholder**

### Getting the Right Information

- Kumpulkan **dokumen dan form** yang dipakai
- Amati **workflow aktual**
- Identifikasi **data yang dikumpulkan** dan bagaimana mengalir

### Dealing with Unfavorable Scenarios

**Computerizing a pile of papers** — komputerisasi kertas: pahami form dan alur kertas yang ada

**Converting legacy databases** — migrasi database lama: pahami struktur lama, mapping ke baru

**Homogenous integration of heterogeneous databases** — integrasi database berbeda

**Converting from spreadsheets** — migrasi Excel: identifikasi data, normalisasi

**Sorting out a messed-up database** — database berantakan: audit, perbaiki, normalisasi

## Building Blocks: Tables, Rows, Fields

### Tables

Tabel adalah struktur dasar penyimpanan — kumpulan data terkait dalam format baris-kolom. Nama tabel biasanya **plural** (CUSTOMERS, ORDERS).

### Records, Rows, dan Tuples

- **Record** — satu entri data lengkap dalam tabel
- **Row** — istilah lain untuk record
- **Tuple** — istilah akademik untuk baris dalam relasi

### Fields, Columns, dan Attributes

- **Field** — satu unit data dalam record
- **Column** — istilah lain untuk field
- **Attribute** — istilah akademik; properti dari entitas

## Datatypes

### Simple Datatypes

- **Numeric** — INTEGER, DECIMAL, FLOAT
- **Character** — CHAR, VARCHAR, TEXT
- **Date/Time** — DATE, TIME, TIMESTAMP
- **Boolean** — TRUE/FALSE
- **Binary** — BLOB, BYTEA

### Complex Datatypes

- **Composite** — kombinasi beberapa tipe
- **Array** — koleksi nilai
- **Spatial** — koordinat, geometri
- **User-defined** — tipe custom

### Specialized Datatypes

- **Serial/auto-increment** — nilai otomatis
- **UUID** — identitas unik global
- **JSON/XML** — semi-structured data

## Hubungan antar Tabel dalam ERD

![Hubungan antar Tabel — Crow's Foot Notation](/image/database-erd-relationships.svg)

**ERD (Entity-Relationship Diagram)** memvisualisasikan tabel dan hubungannya. **Crow's foot** adalah notasi populer:

### One-to-One (1:1)

Satu record tabel A berhubungan dengan **tepat satu** record tabel B. Contoh: Customer ↔ Profile.

### One-to-Many (1:M)

Satu record tabel A berhubungan dengan **banyak** record tabel B. Contoh: Customer (1) → Orders (M). Ini hubungan paling umum.

### Many-to-Many (M:N)

Banyak record A berhubungan dengan banyak record B — butuh **junction table**. Contoh: Orders ↔ Products via Order_Items.

### Zero, One, atau Many

Hubungan bisa opsional:
- **Zero or many** (0..M) — parent boleh tanpa child
- **One or many** (1..M) — parent minimal satu child

### Identifying dan Non-Identifying Relationships

- **Identifying** — child tidak bisa ada tanpa parent (FK bagian dari PK child)
- **Non-identifying** — child bisa ada tanpa parent (FK biasa)

## Primary Key, Foreign Key, Unique Key

### Primary Key (PK)

- **Identitas unik** setiap baris dalam tabel
- Tidak boleh NULL, tidak boleh duplikat
- Contoh: `customer_id` di CUSTOMERS

### Foreign Key (FK)

- Kolom yang **mereferensikan PK tabel lain**
- Menghubungkan tabel (relasi)
- Contoh: `customer_id` di ORDERS → CUSTOMERS.customer_id

### Unique Key

- Nilai unik tapi **bukan identitas utama**
- Contoh: `email` di CUSTOMERS (dua customer tidak boleh email sama)

## Referential Integrity

**Referential integrity** menjamin bahwa FK selalu mereferensikan record yang valid:

- **Tidak boleh orphan** — FK harus mengarah ke record yang ada
- **Deletion rules**:
  - **RESTRICT/NO ACTION** — tolak hapus parent jika ada child
  - **CASCADE** — hapus child otomatis saat parent dihapus
  - **SET NULL** — set FK child jadi NULL saat parent dihapus
- Menjaga konsistensi data antar tabel

## Indexes

### Apa itu Index?

**Index** adalah struktur yang mempercepat pencarian data — seperti indeks di belakang buku. Tanpa index, database harus scan seluruh tabel (full table scan).

### Alternate Indexing

- Index pada kolom non-primary untuk mempercepat query spesifik
- Contoh: index pada `email`, index pada `order_date`

### Foreign Key Indexing

- Index pada kolom FK mempercepat join
- Umumnya wajib untuk performa join

### Types of Indexes

- **BTree** — default, balanced tree, baik untuk range query
- **Bitmap** — baik untuk kolom dengan nilai sedikit (gender, status)
- **Hash** — lookup titik cepat, tidak untuk range
- **Clustered** — data diurutkan sesuai index

### Different Ways to Build Indexes

- Single-column index
- Composite (multi-column) index
- Unique index
- Partial index (hanya subset baris)

## Views dan Specialized Objects

**View** adalah query tersimpan yang diperlakukan seperti tabel:

- Menyembunyikan kompleksitas
- Keamanan (bisa batasi kolom yang terlihat)
- Konsistensi definisi query

Objek lain: stored procedures, triggers, functions — dibahas detail di artikel lanjutan.

## Kesimpulan

Part I buku ini membangun fondasi lengkap database modeling: dari sejarah model database (file → hierarchical → network → relational → object), komponen dasar (tables, rows, fields, keys), hingga tools visual (ERD dengan crow's foot) dan penegakan integritas (referential integrity, indexes).

Di artikel berikutnya: **normalization** — proses paling penting dalam database design (Part II, Chapter 4-5).

## Referensi

- Powell, G. (2006). *Beginning Database Design*. Wiley Publishing.
- Codd, E. F. (1970). A Relational Model of Data for Large Shared Data Banks. *Communications of the ACM, 13*(6), 377-387.
- Date, C. J. (2003). *An Introduction to Database Systems* (8th ed.). Addison-Wesley.
- Silberschatz, A., Korth, H. F., & Sudarshan, S. (2010). *Database System Concepts* (6th ed.). McGraw-Hill.
