---
title: "MongoDB Architecture: Nexus, Data Model, dan Query Model"
description: Panduan lengkap arsitektur MongoDB dari Architecture Guide - nexus
  architecture relational dan NoSQL, flexible storage, BSON document model,
  dynamic schema, document validation, query model, indexing, aggregation.
pubDate: 2026-10-16T08:00:00.000Z
image: /image/mongodb-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MongoDB
  - NoSQL
  - Database
  - DocumentDB
series: "MongoDB Architecture"
seriesOrder: 1
---

*MongoDB Architecture Guide* (MongoDB Inc.) menjelaskan mengapa MongoDB dibangun seperti sekarang dan bagaimana arsitekturnya menjawab tantangan aplikasi modern. Filosofi MongoDB dirangkum oleh CTO-nya, **Eliot Horowitz**: *"Jika Anda ambil MySQL dan ubah data modelnya dari relational ke document-based, Anda dapat banyak fitur hebat: embedded docs untuk kecepatan, manageability, agile development dengan dynamic schemas, horizontal scalability yang lebih mudah."*

## Daftar Isi

- [Tantangan Aplikasi Modern](#tantangan-aplikasi-modern)
- [Nexus Architecture](#nexus-architecture)
- [MongoDB Flexible Storage Architecture](#mongodb-flexible-storage-architecture)
- [Data Model: Data as Documents](#data-model-data-as-documents)
- [Contoh: Blogging Application](#contoh-blogging-application)
- [Dynamic Schema tanpa Mengorbankan Governance](#dynamic-schema-tanpa-mengorbankan-governance)
- [Document Validation](#document-validation)
- [Schema Design](#schema-design)
- [Query Model](#query-model)
- [Idiomatic Drivers](#idiomatic-drivers)
- [Tipe-tipe Query MongoDB](#tipe-tipe-query-mongodb)
- [Aggregation Framework](#aggregation-framework)
- [Querying dan Visualizing dengan Compass](#querying-dan-visualizing-dengan-compass)
- [Indexing](#indexing)
- [Query Optimization dan Covered Queries](#query-optimization-dan-covered-queries)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Tantangan Aplikasi Modern

Organisasi semakin mempertimbangkan alternatif dari infrastruktur relational legacy, didorong tantangan membangun aplikasi modern:

- **Volume data masif** — aplikasi menghasilkan data baru yang berubah cepat: structured, semi-structured, unstructured, dan polymorphic
- **Always-on services** — aplikasi yang dulu melayani audiens terbatas kini harus selalu aktif, diakses banyak device, dan di-scale global ke jutaan user
- **Scale-out architecture** — organisasi beralih ke open source, commodity servers, dan cloud computing — bukan lagi monolithic servers

## Nexus Architecture

**Nexus Architecture** adalah filosofi desain MongoDB: **menggabungkan kapabilitas kritis relational database dengan inovasi NoSQL**.

![MongoDB Architecture — Cover](/image/mongodb-architecture-cover.svg)

### Dari Relational (yang dipertahankan)

- **Expressive query language & secondary indexes** — akses data canggih untuk operasional dan analitik; index native di database
- **Strong consistency** — aplikasi bisa langsung membaca apa yang baru ditulis (bukan eventual consistency yang kompleks)
- **Transactions** — dukungan transaksi untuk integritas
- **Dynamic queries dan updates** — cara desain index di MongoDB sama dengan MySQL/Oracle — plus opsi meng-index embedded field

### Dari NoSQL (yang diadopsi)

- **Flexible data model** — dokumen fleksibel
- **Horizontal scalability** — sharding otomatis
- **High availability** — replication otomatis
- **Agile development** — dynamic schema

## MongoDB Flexible Storage Architecture

MongoDB mendukung **beberapa storage engines dalam satu deployment** — pengguna bisa mix and match sesuai kebutuhan aplikasi:

- **WiredTiger** — engine default modern; document-level locking, compression, checkpointing
- **In-Memory** — engine untuk workload paling demanding, latency-sensitive (Enterprise Advanced)
- **MMAPv1** — engine dari pre-3.x releases
- **Encrypted** — enkripsi data at-rest (Enterprise Advanced)

### Mengapa Flexible Storage?

- **Satu database untuk banyak kebutuhan** — tanpa mengelola beberapa database technology
- **Native replication** memindahkan data antar engine otomatis
- **Query language, data model, scaling, security yang sama** — beda storage engine, satu tooling
- **Coexist dalam satu replica set** — mudah evolve kebutuhan aplikasi

## Data Model: Data as Documents

MongoDB menyimpan data sebagai **documents** dalam format biner **BSON (Binary JSON)**:

- BSON mengextend JSON dengan tipe tambahan: int, long, date, floating point
- Dokumen berisi satu atau lebih **fields**; tiap field punya value tipe spesifik (termasuk arrays, binary data, sub-documents)
- Dokumen dengan struktur mirip diorganisir dalam **collections** (analog: table)
- Dokumen ≈ row; fields ≈ columns

### Keuntungan Document Model

- **Data terlokalisasi** — semua data untuk satu record dalam satu dokumen; mengurangi kebutuhan join
- **Sejalan dengan objek bahasa pemrograman** — mapping alami antara object aplikasi dan dokumen database
- **$lookup operator** — tetap bisa join ala relational jika perlu (best of both worlds)

## Contoh: Blogging Application

### Relational Model

```text
TABLES: Categories, Tags, Users, Comments, Articles
(5+ tabel dengan foreign keys dan join)
```

### MongoDB Model

```javascript
// Collection: articles — semua data dalam satu dokumen
{
  "_id": ObjectId("..."),
  "title": "MongoDB Architecture",
  "body": "...",
  "author": {
    "name": "Rifky",
    "email": "rifky@example.com"
  },
  "tags": ["database", "nosql", "mongodb"],
  "categories": ["Teknologi"],
  "comments": [
    { "text": "Artikel bagus!", "by": "user1" },
    { "text": "Sangat membantu", "by": "user2" }
  ]
}
```

Dua collections (users, articles) menggantikan lima tabel relational — comments, tags, dan categories diekspresikan sebagai **embedded arrays**.

## Dynamic Schema tanpa Mengorbankan Governance

MongoDB documents **bisa bervariasi strukturnya**:

- Dokumen **self-describing** — tidak perlu declare struktur ke sistem
- Field baru bisa ditambahkan **tanpa mempengaruhi dokumen lain**, tanpa update central catalog, tanpa downtime
- Developer langsung persist objects yang dibuat
- **Tanpa ALTER TABLE** — tanpa redesign schema dari awal

## Document Validation

Dynamic schema membawa agility — tapi **governance tetap penting**:

- Tidak seperti NoSQL lain yang mendorong enforcement ke application code, MongoDB menyediakan **document validation di dalam database**
- Pengguna bisa **memeriksa struktur dokumen** — field yang wajib ada, tipe data, dan nilai yang diperbolehkan
- Menjaga **data quality** saat database dipakai banyak aplikasi atau terintegrasi platform data

```javascript
db.createCollection("articles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "body", "author"],
      properties: {
        title: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } }
      }
    }
  }
});
```

## Schema Design

Schema design di MongoDB **berbeda dari relational**:

- **Embed** — data yang selalu diakses bersama disimpan dalam satu dokumen (embedded document)
- **Reference** — data besar yang jarang diakses direferensikan (manual reference / DBRef / $lookup)
- Pertimbangan: akses pattern aplikasi, ukuran dokumen, frekuensi update

Panduan praktis: **data yang dibaca bersama → embed; data yang di-share banyak dokumen → reference**.

## Query Model

### Idiomatic Drivers

MongoDB punya **drivers idiomatic untuk semua bahasa populer** — driver menggunakan struktur data asli bahasa tersebut:

- Java, Python, Node.js, C#, Go, Ruby, PHP, dan lainnya
- Query dibangun dari object bahasa asli — bukan string SQL

```javascript
// Node.js driver — query idiomatic
const cursor = db.collection("articles")
  .find({ tags: "mongodb" })
  .sort({ createdAt: -1 })
  .limit(10);
```

### Interacting dengan Database

- CRUD operations standar
- Aggregation pipeline
- Map-Reduce (legacy)
- GridFS untuk file besar

## Tipe-tipe Query MongoDB

Berbeda dari NoSQL yang terbatas Key-Value, MongoDB mendukung **banyak tipe query**:

- **Key-value queries** — hasil berdasarkan field apa pun (sering primary key)
- **Range queries** — berdasarkan inequality (greater than, less than, between)
- **Geospatial queries** — berdasarkan proximity, intersection, inclusion (point, line, circle, polygon)
- **Text search** — hasil diurutkan relevance berdasarkan Boolean operators (AND, OR, NOT)
- **Aggregation queries** — kompleks agregasi lintas banyak dokumen

## Aggregation Framework

Aggregation pipeline memproses dokumen melalui tahapan (stages):

```javascript
db.orders.aggregate([
  { $match: { status: "PAID" } },
  { $group: {
      _id: "$customer_id",
      totalSpent: { $sum: "$total" },
      orderCount: { $count: {} }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);
```

Stages umum: `$match`, `$group`, `$sort`, `$project`, `$lookup`, `$unwind`, `$limit`, `$skip`.

## Querying dan Visualizing dengan Compass

**MongoDB Compass** adalah GUI untuk memvisualisasikan schema dan query:

- **Schema visualization** — jelajahi field, value, dan data types
- **Ad-hoc queries** — bangun query kompleks dengan klik UI (tanpa tahu query language)
- **Index recommendations** — identifikasi index yang tepat
- **Document validation suggestions** — deteksi aturan yang perlu ditambahkan
- Hasil dilihat grafis dan sebagai JSON documents
- Termasuk dengan MongoDB Professional dan Enterprise Advanced

## Indexing

MongoDB mendukung **banyak jenis secondary indexes** — bisa dideklarasikan pada field apa pun, termasuk field dalam arrays:

### Unique Indexes

- Menolak insert/update dokumen dengan nilai duplikat pada field yang di-index
- Default: semua index tidak unique
- Compound unique: kombinasi nilai harus unik

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
```

### Compound Indexes

- Untuk query dengan banyak predikat
- Contoh: index `(lastName, firstName, city)` mempercepat query 3 field itu
- **Leading field** bisa dipakai sendiri — index ini juga optimal untuk query lastName saja
- Mengurangi kebutuhan index single-field

```javascript
db.customers.createIndex({ lastName: 1, firstName: 1, city: 1 });
```

### Array Indexes

- Setiap nilai array disimpan sebagai **index entry terpisah**
- Query pada field array dioptimalkan index ini
- **Tanpa sintaks khusus** — jika field berisi array, otomatis jadi array index

```javascript
db.products.createIndex({ components: 1 });
```

### TTL Indexes (Time to Live)

- Data **kadaluarsa otomatis** setelah waktu tertentu
- Berguna untuk session, logs, temporary data

```javascript
// Hapus dokumen otomatis setelah 3600 detik
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

### Index Lainnya

- Geospatial indexes (2dsphere) untuk geolocation
- Text indexes untuk full-text search
- Hashed indexes untuk hash-based sharding

## Query Optimization dan Covered Queries

### Query Optimization

- MongoDB memilih index terbaik via **query planner**
- **explain()** — analisis rencana eksekusi: stage scan, jumlah dokumen diperiksa
- **Index intersection** — kombinasi beberapa index untuk satu query

```javascript
db.orders.find({ customer_id: 123, status: "PAID" })
  .explain("executionStats");
```

### Covered Queries

**Covered query** — query yang hasilnya hanya berisi **indexed fields**:

- Hasil bisa dikembalikan **tanpa membaca source documents**
- Jauh lebih cepat (hanya baca index)
- Optimalkan workload agar dominan covered queries

```javascript
// Jika index (customer_id, status) ada, query ini covered:
db.orders.find(
  { customer_id: 123 },
  { customer_id: 1, status: 1, _id: 0 }
);
```

## Kesimpulan

MongoDB Architecture Guide menunjukkan: MongoDB menggabungkan **kematangan relational** (query language, secondary indexes, strong consistency, transactions) dengan **inovasi NoSQL** (document model, dynamic schema, horizontal scalability, high availability).

Document data model menyederhanakan development dan mempercepat akses — data terlokalisasi dalam satu dokumen. Flexible storage memungkinkan satu database melayani kebutuhan beragam. Query model yang kaya (range, geospatial, text, aggregation) plus indexing lengkap menjadikan MongoDB pilihan kuat untuk aplikasi modern.

Di artikel berikutnya: **Data Management, Consistency, Availability, dan Security** — sharding, replica sets, oplog, failover, dan enkripsi.

## Referensi

- MongoDB Inc. (2015). *MongoDB Architecture Guide*. MongoDB.
- Horowitz, E. (2015). *MongoDB Stored Procedures* (interview). MongoDB Inc.
- MongoDB Documentation. (2024). *MongoDB Manual*. docs.mongodb.com.
- Banker, K. (2011). *MongoDB in Action*. Manning Publications.
