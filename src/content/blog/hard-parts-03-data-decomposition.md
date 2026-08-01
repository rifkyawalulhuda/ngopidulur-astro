---
title: "Data Decomposition dan Service Granularity: Memecah Database Monolit"
description: "Panduan lengkap data decomposition dari Software Architecture The Hard Parts - data disintegrators vs integrators, 5 langkah decomposition, polyglot persistence, dan service granularity dengan contoh praktis."
pubDate: 2026-10-31T08:00:00.000Z
image: /image/hard-parts-data-decomposition.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - Database
  - PolyglotPersistence
series: "Software Architecture: The Hard Parts"
seriesOrder: 3
---

Chapter 6-7 dari *Software Architecture: The Hard Parts* membahas bagian tersulit dari microservices: **data**. Artikel ini membahas data decomposition, pemilihan database polyglot, dan service granularity dengan contoh implementasi.

## Daftar Isi

- [Mengapa Data adalah Bagian Tersulit?](#mengapa-data-adalah-bagian-tersulit)
- [Data Disintegrators vs Data Integrators](#data-disintegrators-vs-data-integrators)
- [5 Langkah Data Decomposition](#5-langkah-data-decomposition)
- [Polyglot Persistence: Memilih Database](#polyglot-persistence-memilih-database)
- [Service Granularity: Disintegrators](#service-granularity-disintegrators)
- [Service Granularity: Integrators](#service-granularity-integrators)
- [Finding the Right Balance](#finding-the-right-balance)
- [Implementasi: Sysops Squad Data](#implementasi-sysops-squad-data)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Mengapa Data adalah Bagian Tersulit?

Kode bisa dipecah dengan refactoring. Data terjebak dalam **relational database** dengan:
- Foreign key constraints
- ACID transactions
- Joins antar tabel
- Shared mutable state

Memecah data berarti melepaskan jaminan-jaminan ini. Tidak ada rollback yang mudah.

## Data Disintegrators vs Data Integrators

### Disintegrators (alasan untuk memecah data)

| Faktor | Penjelasan |
|--------|------------|
| **Change control** | Schema berubah independen |
| **Fault tolerance** | Database down tidak meruntuhkan semua |
| **Scalability** | Scale database yang butuh saja |
| **Security** | Isolasi data sensitif |

### Integrators (alasan untuk menjaga data bersama)

| Faktor | Penjelasan |
|--------|------------|
| **Consistency** | ACID transactions |
| **Transactions** | Multi-table updates |
| **Foreign keys** | Referential integrity |
| **Joins** | Query kompleks |

**Trade-off**: Semakin Anda memecah data, semakin sulit menjaga consistency.

## 5 Langkah Data Decomposition

### Langkah 1: Analyze Data Dependencies

Petakan foreign key dan relationship:

```sql
-- Cari semua foreign key
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Langkah 2: Assign Data to Services

Tentukan **service mana yang memiliki data mana**:

| Tabel | Owner Service | Justifikasi |
|-------|---------------|-------------|
| tickets | TicketService | Core domain |
| customers | CustomerService | Core domain |
| invoices | BillingService | Core domain |
| notifications | NotificationService | Core domain |
| reports | ReportingService | Read replica |

### Langkah 3: Separate Database Connections

```yaml
# application.yml (TicketService)
spring:
  datasource:
    url: jdbc:postgresql://ticket-db:5432/tickets
    username: ticket_user
    password: ${DB_PASSWORD}
  jpa:
    properties:
      hibernate:
        default_schema: ticket_schema
```

### Langkah 4: Move Schemas to Separate Servers

```bash
# Export schema
pg_dump -h old-monolith -U postgres -n ticket_schema > ticket_schema.sql

# Import ke server baru
psql -h ticket-db -U postgres -d tickets < ticket_schema.sql
```

### Langkah 5: Switch Over to Independent Databases

```yaml
# docker-compose.yml
version: '3.8'
services:
  ticket-service:
    image: sysops/ticket-service
    environment:
      - DB_URL=jdbc:postgresql://ticket-db:5432/tickets
    depends_on:
      - ticket-db

  ticket-db:
    image: postgres:14
    environment:
      - POSTGRES_DB=tickets
      - POSTGRES_USER=ticket_user
```

## Polyglot Persistence: Memilih Database

Buku ini membahas 8 tipe database:

| Tipe | Contoh | Kapan Digunakan |
|------|--------|-----------------|
| **Relational** | PostgreSQL, MySQL | ACID, complex queries, transactions |
| **Key-Value** | Redis, DynamoDB | Caching, session, simple lookup |
| **Document** | MongoDB, CouchDB | Semi-structured data, JSON |
| **Column Family** | Cassandra, HBase | Write-heavy, time-series, big data |
| **Graph** | Neo4j, Neptune | Relationships, social network, recommendation |
| **NewSQL** | CockroachDB, Spanner | Distributed SQL, global scale |
| **Cloud Native** | Aurora, CosmosDB | Managed, auto-scaling, serverless |
| **Time-Series** | InfluxDB, TimescaleDB | Metrics, IoT, monitoring |

### Contoh Sysops Squad

| Data | Database | Alasan |
|------|----------|--------|
| Tickets | PostgreSQL | ACID, complex queries |
| Customer sessions | Redis | Fast lookup, TTL |
| Survey responses | MongoDB | Semi-structured |
| Expert locations | Neo4j | Graph traversal |
| Metrics | InfluxDB | Time-series |

## Service Granularity: Disintegrators

Alasan untuk memperkecil service:

### 1. Service Scope and Function

Satu service = satu fungsi bisnis.

```java
// Terlalu besar
class CustomerService {
    void create() {}
    void update() {}
    void delete() {}
    void validate() {}
    void notify() {}
    void audit() {}
    void export() {}
}

// Dipecah
class CustomerCRUDService {}
class CustomerValidationService {}
class CustomerNotificationService {}
```

### 2. Code Volatility

Bagian yang sering berubah → service sendiri.

```java
// Sering berubah (regulasi)
class TaxCalculationService {}

// Stabil
class CustomerRepository {}
```

### 3. Scalability and Throughput

Bagian yang butuh scale berbeda → service sendiri.

```java
// Read-heavy
class ProductCatalogService {}

// Write-heavy
class OrderProcessingService {}
```

### 4. Fault Tolerance

Bagian yang butuh isolasi kegagalan → service sendiri.

```java
// Critical (jangan down)
class PaymentService {}

// Non-critical (boleh down)
class RecommendationService {}
```

### 5. Security

Bagian dengan kebutuhan keamanan khusus → service sendiri.

```java
// PCI-DSS compliant
class PaymentProcessingService {}

// Standard security
class ProductSearchService {}
```

### 6. Extensibility

Bagian yang akan diperluas → service sendiri.

```java
// Akan ada banyak integrasi
class IntegrationService {}

// Stable, tidak berubah
class CoreDomainService {}
```

## Service Granularity: Integrators

Alasan untuk memperbesar service:

### 1. Database Transactions

Butuh ACID → gabung dalam satu service.

```java
// Butuh transaction bersama
class OrderService {
    @Transactional
    void createOrder(Order order) {
        orderRepository.save(order);
        inventoryRepository.decrement(order.getItems());
        paymentRepository.charge(order.getTotal());
    }
}
```

### 2. Workflow and Choreography

Butuh orchestrasi kompleks → gabung.

```java
// Workflow kompleks
class OrderFulfillmentService {
    void fulfill(Order order) {
        validate(order);
        pickItems(order);
        pack(order);
        ship(order);
        notify(order);
    }
}
```

### 3. Shared Code

Terlalu banyak kode bersama → gabung atau library.

```java
// Shared logic
class PricingEngine {}
class DiscountCalculator {}
class TaxCalculator {}
```

### 4. Data Relationships

Data terlalu terkait → gabung.

```java
// Selalu di-query bersama
class Order {}
class OrderItem {}
class OrderStatus {}
```

## Finding the Right Balance

Tidak ada formula. Gunakan **decision matrix**:

| Faktor | Disintegrate | Integrate | Bobot |
|--------|-----------|-----------|-------|
| Transaction needed | | ✓ | High |
| Different scale needs | ✓ | | High |
| High volatility | ✓ | | Medium |
| Complex workflow | | ✓ | Medium |
| Shared data | | ✓ | High |
| Security isolation | ✓ | | Medium |

**Rule**: Jika integrators menang, jangan pecah. Monolit modular lebih baik daripada distributed monolith.

## Implementasi: Sysops Squad Data

### Situasi Awal

- 1 PostgreSQL database
- 50 tabel
- Foreign key antar semua domain
- ACID transactions lintas domain

### Langkah Decomposition

**Langkah 1**: Analisis dependencies
- Ditemukan 15 cross-domain foreign key
- 8 transaction lintas domain

**Langkah 2**: Assign ownership
- tickets → TicketService
- customers → CustomerService
- invoices → BillingService
- notifications → NotificationService
- reports → ReportingService (read replica)

**Langkah 3**: Separate connections
- Setiap service koneksi ke database sendiri
- Hapus cross-schema queries

**Langkah 4**: Move schemas
- ticket_schema → ticket-db
- customer_schema → customer-db
- billing_schema → billing-db

**Langkah 5**: Switch over
- DNS cutover
- Old database jadi read-only
- Event-driven sync untuk data yang masih dibutuhkan lintas service

## Kesalahan Umum

### 1. Shared Database

**Gejala**: 3 service query tabel yang sama
**Solusi**: Data ownership, API untuk akses data

### 2. Distributed Transactions

**Gejala**: 2PC (Two-Phase Commit) antar service
**Solusi**: Saga pattern, eventual consistency

### 3. Too Many Joins

**Gejala**: Service A query data Service B via API, lalu join di memory
**Solusi**: Data denormalization, CQRS, atau gabung service

### 4. Ignoring Data Volatility

**Gejala**: Service dengan data stabil dan volatile digabung
**Solusi**: Pecah berdasarkan volatility

## FAQ

### Bagaimana menangani foreign key antar service?

Hapus foreign key. Gunakan:
- **API calls** untuk validasi
- **Event-driven** untuk sync
- **Periodic reconciliation** untuk consistency

### Apakah perlu satu database per service?

Idealnya ya, tapi tidak absolut. Yang penting: **tidak ada shared mutable state**. Bisa satu database dengan schema terpisah, atau satu schema dengan tabel terpisah, asalkan ownership jelas.

### Bagaimana memilih antara MongoDB dan PostgreSQL?

| Pertanyaan | MongoDB | PostgreSQL |
|-----------|---------|------------|
| Schema fleksibel? | ✓ | |
| ACID transactions? | | ✓ |
| Complex queries? | | ✓ |
| JSON documents? | ✓ | |
| Scale write? | ✓ | |
| Relational data? | | ✓ |

### Kapan menggunakan event sourcing?

Event sourcing cocok untuk:
- Audit trail lengkap
- Temporal queries ("state pada tanggal X")
- Complex event processing

Tidak cocok untuk:
- Simple CRUD
- Tim belum familiar
- Data yang tidak perlu history

## Kesimpulan

Data decomposition adalah proses bertahap:

1. **Analyze** dependencies
2. **Assign** ownership
3. **Separate** connections
4. **Move** schemas
5. **Switch over**

Service granularity ditentukan oleh **disintegrators** (perkecil) vs **integrators** (perbesar). Tidak ada jawaban benar, hanya trade-off yang lebih baik untuk konteks Anda.

Artikel berikutnya: **Reuse Patterns dan Data Ownership**, tentang berbagi kode dan data antar service.

## Referensi

- Ford, N., et al. (2021). *Software Architecture: The Hard Parts*, Chapter 6-7. O'Reilly Media.
- Sadalage, P., & Fowler, M. (2012). *NoSQL Distilled*. Addison-Wesley.
- [Database per Service Pattern](https://microservices.io/patterns/data/database-per-service.html)
- [Polyglot Persistence](https://martinfowler.com/bliki/PolyglotPersistence.html)
