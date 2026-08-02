---
title: "Monolithic dan Simple Architecture Styles: Layered, Pipeline, Microkernel, dan Service-Based"
description: "Panduan lengkap 4 architecture styles sederhana dari Fundamentals of Software Architecture - layered, pipeline, microkernel, dan service-based architecture dengan trade-off analysis."
pubDate: 2026-10-31T08:00:00.000Z
image: /image/fundamentals-04-styles.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - ArchitectureStyles
series: "Software Architecture Fundamentals"
seriesOrder: 4
---

*Fundamentals of Software Architecture* Part II (Chapter 9-13) membahas architecture styles dari yang paling sederhana (monolithic) hingga yang kompleks (distributed). Artikel ini fokus pada 4 styles yang cocok untuk aplikasi kecil-menengah: **layered**, **pipeline**, **microkernel**, dan **service-based**.

Setiap style memiliki karakteristik, kelebihan, kekurangan, dan use case yang berbeda. Memilih style yang tepat adalah keputusan arsitektur yang sulit diubah.

## Daftar Isi

- [Architecture Styles Overview](#architecture-styles-overview)
- [Layered Architecture (N-Tier)](#layered-architecture-n-tier)
- [Pipeline Architecture](#pipeline-architecture)
- [Microkernel Architecture](#microkernel-architecture)
- [Service-Based Architecture](#service-based-architecture)
- [Perbandingan 4 Styles](#perbandingan-4-styles)
- [Kapan Memilih Style Mana?](#kapan-memilih-style-mana)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Architecture Styles Overview

**Architecture style** adalah pola yang mendefinisikan struktur sistem: komponen apa yang ada, bagaimana mereka berinteraksi, dan constraints apa yang berlaku.

Buku ini membahas 8 styles. Artikel ini fokus pada 4 yang paling sederhana:

| Style | Complexity | Quantum | Best For |
|-------|-----------|---------|----------|
| **Layered** | Low | 1 | Small teams, simple domain |
| **Pipeline** | Low | 1 | Data processing, ETL |
| **Microkernel** | Medium | 2 | Product-based, plugin ecosystem |
| **Service-Based** | Medium | N | Domain-driven, large teams |

## Layered Architecture (N-Tier)

**Layered architecture** adalah style yang paling umum: sistem dibagi menjadi layer horizontal berdasarkan technical concern.

![Layered Architecture](/image/fundamentals-04-layered.svg)

### Topology

```
┌─────────────────┐
│  Presentation   │  UI, controllers, views
├─────────────────┤
│    Business     │  Business logic, rules, validation
├─────────────────┤
│   Persistence   │  Data access, repositories, ORM
├─────────────────┤
│    Database     │  Tables, indexes, stored procedures
└─────────────────┘
```

### Layers of Isolation

| Layer | Isolation | Contoh Perubahan |
|-------|-----------|------------------|
| **Closed** | Hanya layer di atas yang bisa akses | Ganti UI framework tanpa affect business |
| **Open** | Bisa di-skip layer | Direct DB access dari presentation (avoid) |

**Rule**: Gunakan **closed layers** untuk isolation yang lebih baik.

### Adding Layers

Tambahkan layer jika diperlukan:

```
┌─────────────────┐
│  Presentation   │
├─────────────────┤
│    Service      │  ← Tambahan: API layer
├─────────────────┤
│    Business     │
├─────────────────┤
│   Persistence   │
├─────────────────┤
│    Database     │
└─────────────────┘
```

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Simplicity | ★★★★★ | Mudah dipahami dan implementasi |
| Cost | ★★★★★ | Tidak perlu infrastructure kompleks |
| Deployability | ★☆☆☆☆ | Big bang deployment |
| Testability | ★★☆☆☆ | Integration test sulit |
| Scalability | ★☆☆☆☆ | Scale seluruh aplikasi |
| Fault tolerance | ★★☆☆☆ | Single point of failure |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Tim kecil (<10 orang)
- Domain sederhana
- Budget terbatas
- Time-to-market cepat

❌ **Hindari untuk**:
- Domain kompleks
- Butuh scale per capability
- Deployment frequency tinggi

## Pipeline Architecture

**Pipeline architecture** (juga disebut pipes and filters) memproses data melalui serangkaian transformasi.

![Pipeline Architecture](/image/fundamentals-04-pipeline.svg)

### Topology

```
Input → Filter1 → Filter2 → Filter3 → Output
         (transform) (transform) (transform)
```

**Filter** = komponen yang memproses data
**Pipe** = konektor yang mengalirkan data

### Filter Types

| Type | Deskripsi | Contoh |
|------|-----------|--------|
| **Producer** | Sumber data | File reader, API call |
| **Transformer** | Ubah data | Parser, validator, enricher |
| **Tester** | Filter data | Filter, router |
| **Consumer** | Tujuan akhir | Database writer, file writer |

### Contoh: ETL Pipeline

```
CSV File → Parser → Validator → Enricher → Transformer → DB Writer
  (read)   (parse)  (validate)  (enrich)   (transform)   (write)
```

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Simplicity | ★★★★☆ | Mudah dipahami |
| Testability | ★★★★☆ | Setiap filter bisa ditest terpisah |
| Performance | ★★★☆☆ | Overhead per filter |
| Scalability | ★★☆☆☆ | Scale seluruh pipeline |
| Modularity | ★★★★★ | Filter bisa direuse |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Data processing
- ETL (Extract, Transform, Load)
- Batch jobs
- Compiler, interpreter

❌ **Hindari untuk**:
- Interactive applications
- Real-time processing
- Complex business logic

## Microkernel Architecture

**Microkernel architecture** memisahkan **core system** dari **plugin components**.

![Microkernel Architecture](/image/fundamentals-04-microkernel.svg)

### Topology

```
┌─────────────────────────────┐
│        Core System          │
│  ┌─────────────────────┐    │
│  │   Minimal business  │    │
│  │      logic          │    │
│  └─────────────────────┘    │
│         Plugin API          │
├─────────────────────────────┤
│  ┌─────────┐ ┌─────────┐    │
│  │Plugin A │ │Plugin B │    │
│  └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐    │
│  │Plugin C │ │Plugin D │    │
│  └─────────┘ └─────────┘    │
└─────────────────────────────┘
```

### Core System vs Plugins

| Aspek | Core System | Plugins |
|-------|-------------|---------|
| **Fungsi** | Minimal business logic | Extend functionality |
| **Deployment** | Selalu ada | Optional, dynamic |
| **Update** | Jarang | Sering |
| **Example** | VS Code editor | VS Code extensions |

### Registry dan Contracts

**Registry**: Mengetahui plugin apa yang tersedia
**Contract**: Interface yang harus diimplementasi plugin

```java
// Plugin contract
public interface Plugin {
    void initialize();
    void execute();
    void shutdown();
}

// Plugin implementation
public class ReportPlugin implements Plugin {
    public void initialize() { /* ... */ }
    public void execute() { /* generate report */ }
    public void shutdown() { /* ... */ }
}
```

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Extensibility | ★★★★★ | Tambah plugin tanpa ubah core |
| Testability | ★★★★☆ | Core dan plugin terpisah |
| Deployability | ★★★★☆ | Plugin bisa di-deploy terpisah |
| Performance | ★★★☆☆ | Plugin communication overhead |
| Scalability | ★★☆☆☆ | Scale core dan plugins bersama |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Product-based applications
- Plugin ecosystem (IDE, browser)
- Rule engines
- Applications dengan custom workflows

❌ **Hindari untuk**:
- Simple applications
- Tidak perlu extensibility
- High-performance requirements

## Service-Based Architecture

**Service-based architecture** adalah hybrid antara monolith dan microservices: domain services terpisah, tapi shared database.

![Service-Based Architecture](/image/fundamentals-04-service-based.svg)

### Topology

```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Order   │ │Customer │ │ Catalog │
│ Service │ │ Service │ │ Service │
│         │ │         │ │         │
│ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │
│ │ API │ │ │ │ API │ │ │ │ API │ │
│ │Business│ │ │ │Business│ │ │ │Business│ │
│ └─────┘ │ │ └─────┘ │ │ └─────┘ │
└────┬────┘ └────┬────┘ └────┬────┘
     └─────────────┴─────────────┘
              Shared Database
```

### Service Design

| Aspek | Deskripsi |
|-------|-----------|
| **Granularity** | Coarser than microservices |
| **Database** | Shared (single schema) |
| **Communication** | REST, messaging |
| **Deployment** | Independent |

### Database Partitioning

| Pendekatan | Deskripsi | Trade-off |
|------------|-----------|-----------|
| **Shared schema** | Semua service akses schema yang sama | Simple, tapi coupling |
| **Schema per service** | Setiap service punya schema sendiri | Better isolation, tapi kompleks |
| **Database per service** | Setiap service punya DB sendiri | Best isolation, tapi distributed transactions |

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Deployability | ★★★★☆ | Service bisa di-deploy terpisah |
| Testability | ★★★★☆ | Service bisa ditest terpisah |
| Scalability | ★★★☆☆ | Scale per service, tapi shared DB |
| Fault tolerance | ★★★☆☆ | Service failure tidak affect lainnya |
| Simplicity | ★★★☆☆ | Lebih kompleks dari monolith |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Domain-driven design
- Tim besar (20+ orang)
- Butuh flexibility tanpa microservices complexity
- Migration path dari monolith ke microservices

❌ **Hindari untuk**:
- Tim kecil
- Domain sederhana
- Butuh full independence per service

## Perbandingan 4 Styles

| Aspek | Layered | Pipeline | Microkernel | Service-Based |
|-------|---------|----------|-------------|---------------|
| **Complexity** | Low | Low | Medium | Medium |
| **Quantum** | 1 | 1 | 2 | N |
| **Deployment** | Single | Single | Core + plugins | Per service |
| **Database** | Shared | N/A | Shared | Shared/partitioned |
| **Scalability** | Low | Low | Medium | Medium |
| **Testability** | Low | High | High | High |
| **Best for** | Small apps | Data processing | Product-based | Domain-driven |

## Kapan Memilih Style Mana?

| Kondisi | Pilihan |
|---------|---------|
| Tim kecil, domain sederhana | **Layered** |
| Data processing, ETL | **Pipeline** |
| Product-based, plugin ecosystem | **Microkernel** |
| Domain-driven, tim besar | **Service-Based** |
| Butuh scale per capability | **Service-Based** atau **Microservices** |

## Kesimpulan

Chapter 9-13 buku ini membahas 4 architecture styles sederhana:

1. **Layered**: Paling umum, mudah dipahami, cocok untuk tim kecil
2. **Pipeline**: Untuk data processing, ETL, batch jobs
3. **Microkernel**: Untuk product-based, plugin ecosystem
4. **Service-Based**: Hybrid monolith-microservices, untuk domain-driven

Artikel berikutnya: **Distributed dan Advanced Architecture Styles** , event-driven, space-based, SOA, dan microservices.

## FAQ

### Apa bedanya layered dan service-based architecture?

Layered membagi berdasarkan technical concern (presentation, business, persistence). Service-based membagi berdasarkan business capability (order, customer, catalog). Layered = 1 deployment unit, service-based = N deployment units dengan shared database.

### Kapan saya harus menggunakan microkernel?

Gunakan microkernel jika Anda butuh extensibility: tambah fitur tanpa ubah core system. Contoh: IDE (VS Code dengan extensions), browser (Chrome dengan extensions), rule engine dengan custom rules.

### Apa keuntungan pipeline architecture?

Pipeline sangat modular: setiap filter bisa ditest terpisah, direuse, dan di-compose. Cocok untuk data processing di mana input → transform → output. Tidak cocok untuk interactive applications.

### Bagaimana cara migrate dari layered ke service-based?

1. Identifikasi domain capabilities
2. Extract service satu per satu (strangler fig pattern)
3. Mulai dengan shared database
4. Pertimbangkan schema per service untuk isolation lebih baik
5. Gunakan API gateway untuk routing

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 9-13.
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
- Hohpe, G., & Woolf, B. (2003). *Enterprise Integration Patterns*. Addison-Wesley.
