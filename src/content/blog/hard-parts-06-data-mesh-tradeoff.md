---
title: "Data Mesh dan Trade-Off Analysis: Panduan Membuat Keputusan Arsitektur"
description: "Panduan lengkap data mesh dan trade-off analysis dari Software Architecture The Hard Parts - domain ownership, data as product, self-serve infrastructure, federated governance, dan teknik analisis keputusan arsitektur."
pubDate: 2026-11-03T08:00:00.000Z
image: /image/hard-parts-data-mesh.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - DataMesh
  - TradeOff
  - DecisionMaking
series: "Software Architecture: The Hard Parts"
seriesOrder: 6
---

Chapter 14-15 dari *Software Architecture: The Hard Parts* membahas dua topik penutup: **data mesh** untuk analytical data, dan **trade-off analysis** sebagai teknik membuat keputusan arsitektur. Artikel ini membahas keduanya dengan contoh praktis.

## Daftar Isi

- [Masalah Analytical Data](#masalah-analytical-data)
- [Pendekatan Lama: Warehouse dan Lake](#pendekatan-lama-warehouse-dan-lake)
- [Data Mesh: Empat Prinsip](#data-mesh-empat-prinsip)
- [Data Product Quantum](#data-product-quantum)
- [Kapan Menggunakan Data Mesh](#kapan-menggunakan-data-mesh)
- [Trade-Off Analysis: Teknik Membuat Keputusan](#trade-off-analysis-teknik-membuat-keputusan)
- [Teknik-Teknik Analisis](#teknik-teknik-analisis)
- [Implementasi: Sysops Squad](#implementasi-sysops-squad)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Masalah Analytical Data

Operational data (untuk transaksi) sudah dibahas di artikel sebelumnya. **Analytical data** (untuk reporting, ML, BI) punya tantangan berbeda:

- Volume besar (TB-PB)
- Query kompleks (joins, aggregations)
- Latency tidak kritis (batch OK)
- Skema sering berubah

## Pendekatan Lama: Warehouse dan Lake

### Data Warehouse

```
┌─────────────────────────────────────┐
│         Data Warehouse              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Sales│ │Mktg │ │Fin  │ │HR   │  │
│  │Data │ │Data │ │Data │ │Data │  │
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘  │
│     └───────┴───────┴───────┘      │
│           Central Team              │
└─────────────────────────────────────┘
```

**Masalah**:
- Centralized team jadi bottleneck
- Schema perubahan lambat
- Tidak scale untuk banyak domain
- "Data swamp" jika tidak dikelola

### Data Lake

```
┌─────────────────────────────────────┐
│            Data Lake                │
│  Raw data dari semua sumber         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │JSON │ │CSV  │ │Parquet│ │Avro│  │
│  │     │ │     │ │      │ │    │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│     Tidak ada governance            │
└─────────────────────────────────────┘
```

**Masalah**:
- Jadi "data swamp" tanpa governance
- Data quality buruk
- Sulit menemukan data yang relevan
- Tidak ada ownership

## Data Mesh: Empat Prinsip

Data mesh, diperkenalkan oleh Zhamak Dehghani (salah satu penulis buku ini), adalah pendekatan **domain-oriented** untuk analytical data.

### Prinsip 1: Domain Ownership

Tim domain memiliki data mereka, bukan tim data terpusat.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Sales     │  │  Marketing  │  │   Finance   │
│   Team      │  │   Team      │  │   Team      │
│  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │
│  │Sales  │  │  │  │Mktg   │  │  │  │Fin    │  │
│  │Data   │  │  │  │Data   │  │  │  │Data   │  │
│  │Product│  │  │  │Product│  │  │  │Product│  │
│  └───────┘  │  │  └───────┘  │  │  └───────┘  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Prinsip 2: Data as a Product

Data diperlakukan sebagai produk dengan SLA:

| Karakteristik | Deskripsi |
|---------------|-----------|
| **Discoverable** | Bisa ditemukan via catalog |
| **Addressable** | Punya unique address (URI) |
| **Trustworthy** | Data quality terjamin |
| **Self-describing** | Schema dan dokumentasi jelas |
| **Interoperable** | Bisa digabung dengan data lain |
| **Secure** | Access control yang tepat |

### Prinsip 3: Self-Serve Infrastructure

Platform tim menyediakan tools untuk domain team.

```
┌─────────────────────────────────────┐
│      Self-Serve Data Platform       │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │Storage  │ │Compute  │ │Catalog│ │
│  │(S3/GCS) │ │(Spark)  │ │(Glue) │ │
│  └─────────┘ └─────────┘ └───────┘ │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │Pipeline │ │Quality  │ │Access │ │
│  │(Airflow)│ │(Great   │ │Control│ │
│  │         │ │Expectations│ │     │ │
│  └─────────┘ └─────────┘ └───────┘ │
└─────────────────────────────────────┘
         ↑               ↑
    ┌────┘               └────┐
    │                         │
┌───┴───┐                 ┌───┴───┐
│Sales  │                 │Mktg   │
│Team   │                 │Team   │
└───────┘                 └───────┘
```

### Prinsip 4: Federated Governance

Standar global, implementasi lokal.

| Level | Tanggung Jawab |
|-------|---------------|
| **Global** | Standar format, security, compliance |
| **Domain** | Schema, quality, SLA |
| **Local** | Implementasi spesifik |

## Data Product Quantum

**Data Product Quantum (DPQ)** adalah unit data mesh: independently deployable data product dengan high cohesion.

```
┌─────────────────────────┐
│   Data Product Quantum  │
│  ┌─────────────────┐    │
│  │  Input Ports    │    │
│  │  (CDC, Events)  │    │
│  └────────┬────────┘    │
│           ↓             │
│  ┌─────────────────┐    │
│  │  Data Product   │    │
│  │  (Tables, Views)│    │
│  └────────┬────────┘    │
│           ↓             │
│  ┌─────────────────┐    │
│  │  Output Ports   │    │
│  │  (API, Files)   │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

**Mirip dengan architecture quantum** di microservices, tapi untuk data.

## Kapan Menggunakan Data Mesh

### Cocok untuk:

- Organisasi besar dengan banyak domain (>10)
- Data warehouse/lake sudah tidak scalable
- Tim domain punya kapabilitas data engineering
- Butuh data produk yang discoverable dan trustworthy

### Tidak cocok untuk:

- Startup kecil (<5 domain)
- Tim tanpa data engineering capability
- Data sederhana, tidak kompleks
- Butuh solusi cepat (data mesh butuh investasi)

## Trade-Off Analysis: Teknik Membuat Keputusan

### Langkah 1: Find Entangled Dimensions

Identifikasi karakteristik yang saling memengaruhi:

```
Security ────────► Performance
    │                  ↑
    └──────────────────┘
    Meningkatkan security
    bisa menurunkan performance

Scalability ─────► Simplicity
    │                  ↑
    └──────────────────┘
    Menambah scale
    menambah kompleksitas
```

### Langkah 2: Analyze Coupling Points

Di mana trade-off terjadi?

| Coupling Point | Trade-off |
|---------------|-----------|
| Shared database | Consistency vs Independence |
| Synchronous call | Simplicity vs Resilience |
| Shared library | Standardization vs Flexibility |
| Centralized team | Governance vs Speed |

### Langkah 3: Assess Trade-Offs

Timbang pro dan kontra untuk setiap opsi.

## Teknik-Teknik Analisis

### 1. Qualitative vs Quantitative

| Jenis | Kapan | Contoh |
|-------|-------|--------|
| **Qualitative** | Tidak ada data, eksplorasi | "Microservices lebih kompleks" |
| **Quantitative** | Ada data, butuh presisi | "Latency p99 naik 50ms" |

**Rule**: Gunakan quantitative jika bisa, tapi jangan abaikan qualitative.

### 2. MECE Lists

**Mutually Exclusive, Collectively Exhaustive**: pastikan tidak ada yang terlewat.

```
Buruk (tidak MECE):
- Performance
- Scalability
- Speed  ← tumpang tindih dengan Performance

Baik (MECE):
- Performance (latency, throughput)
- Scalability (horizontal, vertical)
- Availability (uptime, fault tolerance)
```

### 3. Avoid "Out-of-Context" Trap

Jangan bandingkan solusi tanpa konteks.

```
Buruk:
"Microservices lebih baik dari monolit"

Baik:
"Microservices lebih baik untuk tim besar dengan
kebutuhan scale berbeda per domain, tapi lebih
buruk untuk startup kecil dengan tim <5 orang"
```

### 4. Model Relevant Domain Cases

Gunakan kasus nyata dari domain Anda.

```
Buruk (generic):
"Bagaimana jika traffic naik 10x?"

Baik (domain-specific):
"Bagaimana jika ticket volume naik 10x saat
product launch? Bagaimana billing handle?"
```

### 5. Prefer Bottom Line over Overwhelming Evidence

Fokus pada kesimpulan, bukan data yang berlebihan.

```
Buruk:
"Berdasarkan 50 metrik, 20 grafik, dan 10 studi..."

Baik:
"Latency naik 30% dengan microservices.
Untuk use case kita, ini acceptable karena
availability lebih penting."
```

### 6. Avoid Snake Oil dan Evangelism

Waspada terhadap:
- Vendor yang menjual solusi tanpa trade-off
- Evangelist yang fanatik pada satu teknologi
- "Best practice" tanpa konteks

**Rule**: Selalu tanya "apa trade-offnya?"

## Implementasi: Sysops Squad

### Data Mesh Implementation

| Domain | Data Product | Owner | SLA |
|--------|-----------|-------|-----|
| **Ticketing** | ticket_analytics | TicketTeam | 99.9% uptime, <1h latency |
| **Customer** | customer_360 | CustomerTeam | 99.9% uptime, <15m latency |
| **Billing** | revenue_report | BillingTeam | 99.5% uptime, <1h latency |
| **Expert** | expert_performance | ExpertTeam | 99.9% uptime, <30m latency |

### Platform yang Dipilih

| Komponen | Tool | Justifikasi |
|----------|------|-------------|
| Storage | S3 + Parquet | Standard, murah |
| Compute | dbt + Spark | SQL-based, familiar |
| Catalog | DataHub | Open source, active |
| Pipeline | Airflow | Mature, banyak plugin |
| Quality | Great Expectations | Python-based, flexible |

### Trade-Off Analysis Example

**Keputusan**: Apakah menggunakan shared data platform atau federated?

| Opsi | Pro | Kontra | Skor |
|------|-----|--------|------|
| **Centralized** | Governance mudah, standard | Bottleneck, lambat | 3/10 |
| **Federated** | Scalable, domain ownership | Governance kompleks | 7/10 |
| **Hybrid** | Balance | Setup kompleks | 8/10 |

**Keputusan**: Hybrid dengan federated governance.

## Kesalahan Umum

### 1. Data Mesh Tanpa Platform

**Gejala**: Setiap domain bangun sendiri, duplikasi infrastruktur
**Solusi**: Bangun self-serve platform dulu

### 2. Data Product Tanpa SLA

**Gejala**: Data tidak reliable, user tidak percaya
**Solusi**: Definisikan dan monitor SLA

### 3. Trade-Off Analysis Setelah Implementasi

**Gejala**: "Kita pakai microservices karena trend"
**Solusi**: Analisis sebelum implementasi, dokumentasikan di ADR

### 4. Mengabaikan Context

**Gejala**: Copy arsitektur Netflix/Google tanpa penyesuaian
**Solusi**: Sesuaikan dengan ukuran tim, domain, dan constraint

## FAQ

### Kapan data mesh lebih baik dari data warehouse?

| Data Mesh | Data Warehouse |
|-----------|---------------|
| Banyak domain (>10) | Sedikit domain |
| Tim domain punya data engineer | Tim data terpusat |
| Butuh scalability | Butuh simplicity |
| Governance federated | Governance centralized |

### Bagaimana memulai trade-off analysis?

1. **Identifikasi** karakteristik yang penting
2. **Temukan** coupling points
3. **List** opsi yang tersedia
4. **Timbang** pro dan kontra
5. **Dokumentasikan** di ADR

### Apakah data mesh menggantikan data warehouse?

Tidak selalu. Data mesh adalah **pendekatan organisasi**, bukan teknologi. Bisa implementasi data mesh di atas data warehouse yang sudah ada.

### Bagaimana mengukur kualitas keputusan arsitektur?

- **Fitness functions**: Automated validation
- **ADR review**: Peer review keputusan
- **Post-mortem**: Analisis setelah incident
- **Feedback loop**: Continuous improvement

## Kesimpulan

Data mesh dan trade-off analysis adalah alat untuk **navigasi kompleksitas**:

- **Data mesh**: Domain ownership, data as product, self-serve platform, federated governance
- **Trade-off analysis**: MECE, avoid out-of-context, model domain cases, prefer bottom line

Intinya: **tidak ada solusi universal**. Yang ada adalah analisis yang lebih baik untuk konteks spesifik Anda.

Series ini selesai. Kembali ke [artikel overview](/blog/software-architecture-hard-parts-trade-off-analysis) atau mulai dari [artikel pertama](/blog/hard-parts-01-quantum-fitness-functions).

## Referensi

- Ford, N., et al. (2021). *Software Architecture: The Hard Parts*, Chapter 14-15. O'Reilly Media.
- Dehghani, Z. (2022). *Data Mesh*. O'Reilly Media.
- [Data Mesh Principles](https://martinfowler.com/articles/data-mesh-principles.html)
- [Architecture Decision Records](https://adr.github.io/)
