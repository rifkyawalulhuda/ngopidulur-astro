---
title: "Architecture Quantum dan Fitness Functions: Trade-Off Analysis dalam Arsitektur Software"
description: "Panduan mendalam tentang architecture quantum, coupling analysis, ADR, dan fitness functions dari buku Software Architecture: The Hard Parts - fondasi untuk semua keputusan arsitektur terdistribusi."
pubDate: 2026-10-29T08:00:00.000Z
image: /image/hard-parts-quantum.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - SoftwareDesign
series: "Software Architecture: The Hard Parts"
seriesOrder: 1
---

*Software Architecture: The Hard Parts* membuka dengan pertanyaan mendasar: mengapa tidak ada "best practices" dalam arsitektur software? Chapter 1-2 menjawabnya dengan memperkenalkan dua konsep kunci yang menjadi fondasi seluruh buku: **architecture quantum** untuk memahami scope perubahan, dan **fitness functions** untuk governance otomatis. Artikel ini membahas keduanya secara mendalam.

## Daftar Isi

- [Mengapa Best Practices Adalah Mitos?](#mengapa-best-practices-adalah-mitos)
- [Architecture Quantum: Unit Independen Deployable](#architecture-quantum-unit-independen-deployable)
- [Static vs Dynamic Coupling](#static-vs-dynamic-coupling)
- [Measuring Coupling: Metrik Praktis](#measuring-coupling-metrik-praktis)
- [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
- [Architecture Fitness Functions](#architecture-fitness-functions)
- [Implementasi Praktis: Sysops Squad](#implementasi-praktis-sysops-squad)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Mengapa Best Practices Adalah Mitos?

Chapter 1 buku ini menantang asumsi umum: bahwa ada "cara benar" untuk membangun software. Kenyataannya, setiap keputusan arsitektur adalah **trade-off**. Meningkatkan security bisa menurunkan performance. Menambah scalability bisa mengorbankan simplicity.

Buku ini menggunakan **Sysops Squad Saga** sebagai contoh berkelanjutan: perusahaan IT support dengan monolit yang harus dipecah menjadi microservices. Setiap keputusan mereka melibatkan trade-off yang harus dianalisis, bukan dihafal.

## Architecture Quantum: Unit Independen Deployable

### Definisi Formal

**Architecture quantum** adalah unit arsitektur dengan dua karakteristik:

1. **Independently deployable**: bisa di-deploy tanpa memengaruhi bagian lain
2. **High functional cohesion**: elemen di dalamnya saling terkait secara fungsional

Quantum bisa berupa:
- Satu microservice + database-nya
- Satu bounded context DDD
- Satu modul dalam modular monolith

### Mengapa Quantum Penting?

Quantum menentukan **scope of change**. Perubahan di dalam quantum terisolasi; perubahan yang melintasi quantum menciptakan **quantum coupling**.

```
Quantum A (Service A + DB A)     Quantum B (Service B + DB B)
┌─────────────────────┐         ┌─────────────────────┐
│  Service A          │         │  Service B          │
│  ┌─────────────┐    │         │  ┌─────────────┐    │
│  │ Database A  │    │         │  │ Database B  │    │
│  └─────────────┘    │         │  └─────────────┘    │
└─────────────────────┘         └─────────────────────┘
        ↑                                 ↑
   Independently                     Independently
   deployable                        deployable
```

Jika Service A dan Service B berbagi database, mereka menjadi **satu quantum**: perubahan schema memengaruhi keduanya, deployment harus sinkron.

## Static vs Dynamic Coupling

Buku ini membedakan dua jenis coupling dengan implikasi berbeda:

### Static Coupling

Dependensi struktural dalam code: class A memanggil class B, modul X import modul Y.

**Metrik:**
- **Afferent coupling (Ca)**: berapa banyak komponen lain bergantung pada komponen ini?
- **Efferent coupling (Ce)**: berapa banyak komponen lain yang diandalkan komponen ini?
- **Instability (I)**: Ce / (Ca + Ce). 0 = stabil, 1 = tidak stabil
- **Abstractness (A)**: rasio abstract class vs total class
- **Distance from Main Sequence (D)**: |A + I - 1|. 0 = ideal

### Dynamic Coupling

Dependensi runtime antar service: Service A memanggil Service B via network.

**Karakteristik:**
- Tidak terlihat di static analysis
- Muncul di distributed traces
- Lebih berbahaya karena sulit diprediksi

**Contoh dynamic coupling:**
```javascript
// Service A memanggil Service B
const user = await fetch(`http://service-b/users/${id}`);
// Service B down = Service A gagal
```

## Measuring Coupling: Metrik Praktis

### Tools untuk Static Coupling

| Tool | Bahasa | Fungsi |
|------|--------|--------|
| JDepend | Java | Package coupling metrics |
| NDepend | .NET | Dependency analysis |
| ArchUnit | Java | Architecture testing |
| Dependency-cruiser | JavaScript | Module dependency |

### Contoh ArchUnit Test

```java
@ArchTest
static final ArchRule no_cyclic_dependencies =
    slices().matching("com.sysops.(*)..")
            .should().beFreeOfCycles();

@ArchTest
static final ArchRule services_should_not_access_other_databases =
    noClasses().that().resideInAPackage("..service..")
               .should().accessClassesThat().resideInAPackage("..otherdb..");
```

## Architecture Decision Records (ADRs)

### Format ADR

ADR adalah dokumen singkat (1-2 halaman) yang mencatat keputusan arsitektur:

```markdown
# ADR-001: Menggunakan PostgreSQL untuk Ticket Service

## Status
Accepted (2026-01-15)

## Context
Ticket service butuh ACID transactions untuk payment processing.
Tim sudah familiar dengan PostgreSQL.

## Decision
Gunakan PostgreSQL 14 dengan RDS Multi-AZ.

## Consequences
- Positive: ACID compliance, familiar tooling, managed backup
- Negative: Scaling write terbatas, perlu read replica untuk scale
- Risks: Connection pool exhaustion pada load tinggi
```

### Kapan Menulis ADR?

- Setiap keputusan yang "sulit diubah" (database, framework, protocol)
- Setiap trade-off yang signifikan
- Setiap deviation dari standar tim

## Architecture Fitness Functions

### Jenis-Jenis Fitness Function

| Jenis | Fungsi | Contoh |
|-------|--------|--------|
| **Atomic** | Validasi satu karakteristik | Performance test < 200ms |
| **Holistic** | Validasi kombinasi karakteristik | Security + Performance |
| **Triggered** | Berjalan saat event | Pre-deployment check |
| **Continuous** | Monitoring terus-menerus | Real-time latency monitor |

### Implementasi dengan Tools

**Performance fitness function (JMeter + CI):**
```yaml
# .github/workflows/fitness.yml
- name: Performance Test
  run: |
    jmeter -n -t performance-test.jmx -l results.jtl
    # Fail jika p99 > 200ms
    python check_performance.py results.jtl --threshold 200
```

**Coupling fitness function (ArchUnit):**
```java
@ArchTest
static final ArchRule max_efferent_coupling =
    classes().that().resideInAPackage("..service..")
             .should().onlyDependOnClassesThat()
             .resideInAnyPackage("..domain..", "java..", "..common..");
```

## Implementasi Praktis: Sysops Squad

### Situasi Awal

Sysops Squad punya monolit dengan:
- 1 database shared untuk semua modul
- Coupling tinggi antar modul
- Deployment butuh koordinasi seluruh tim

### Analisis Quantum

Tim mengidentifikasi 5 quantum:

| Quantum | Services | Database | Justifikasi |
|---------|----------|----------|-------------|
| **Ticketing** | Ticket creation, assignment | TicketDB | Core business, high change |
| **Customer** | Registration, profile | CustomerDB | Stable, low change |
| **Billing** | Invoicing, payment | BillingDB | ACID critical |
| **Reporting** | Analytics, reports | ReportDB (read replica) | Read-heavy |
| **Notification** | Email, SMS | NotificationDB | Independent scale |

### Fitness Functions yang Diterapkan

1. **Quantum isolation test**: Tidak ada service yang query database quantum lain
2. **Deployment independence test**: Setiap quantum bisa deploy tanpa downtime
3. **Data consistency monitor**: Eventual consistency < 5 detik untuk non-critical data

## Kesalahan Umum

### 1. Terlalu Banyak Quantum

**Gejala**: 50+ microservices, tim overwhelmed
**Solusi**: Konsolidasi berdasarkan cohesion, bukan size

### 2. Quantum Terlalu Besar

**Gejala**: "Microservice" dengan 100+ class
**Solusi**: Flatten, identifikasi sub-domain

### 3. Mengabaikan Dynamic Coupling

**Gejala**: Service sering timeout, cascading failure
**Solusi**: Circuit breaker, bulkhead, async communication

### 4. ADR sebagai Birokrasi

**Gejala**: ADR ditulis setelah implementasi, tidak dibaca
**Solusi**: ADR ringkas, review di PR, arsip di wiki

## FAQ

### Bagaimana menentukan ukuran quantum yang tepat?

Tidak ada formula. Gunakan **granularity disintegrators** (alasan untuk memperkecil: volatility, scalability, fault tolerance) dan **granularity integrators** (alasan untuk memperbesar: transactions, workflow, shared data). Timbang keduanya untuk setiap kasus.

### Apakah setiap service harus punya database sendiri?

Idealnya ya, tapi tidak absolut. Yang penting: **tidak ada shared mutable state**. Bisa satu database dengan schema terpisah, atau satu schema dengan tabel terpisah, asalkan ownership jelas.

### Bagaimana memulai fitness functions di tim yang belum familiar?

Mulai dari yang sederhana:
1. **Performance test** di CI (paling mudah)
2. **Dependency check** (tidak ada cyclic dependency)
3. **API contract test** (OpenAPI validation)

Jangan langsung implementasi semua jenis.

### Kapan ADR tidak perlu ditulis?

Untuk keputusan yang mudah diubah (library internal, coding style) atau yang sudah jelas dari konteks (framework standard perusahaan). ADR untuk keputusan yang "sulit dan mahal untuk diubah".

## Kesimpulan

Architecture quantum dan fitness functions adalah fondasi untuk semua keputusan di buku ini. Quantum memberikan bahasa untuk berbicara tentang scope perubahan; fitness functions memberikan mekanisme untuk menjaga integritas arsitektur secara otomatis.

Kunci praktisnya:
- **Identifikasi quantum** berdasarkan cohesion, bukan size
- **Minimalkan coupling** antar quantum, terutama dynamic coupling
- **Dokumentasikan trade-off** dengan ADR
- **Otomatisasi governance** dengan fitness functions

Artikel berikutnya akan membahas **decomposition patterns**: bagaimana memecah monolit menjadi quantum-quantum ini secara praktis.

## Referensi

- Ford, N., Richards, M., Sadalage, P., & Dehghani, Z. (2021). *Software Architecture: The Hard Parts*, Chapter 1-2. O'Reilly Media.
- Ford, N., & Richards, M. (2020). *Fundamentals of Software Architecture*, Chapter 8. O'Reilly Media.
- [Architecture Decision Records](https://adr.github.io/)
- [ArchUnit User Guide](https://www.archunit.org/)
