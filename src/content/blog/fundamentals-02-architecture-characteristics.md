---
title: "Architecture Characteristics: Mendefinisikan, Mengukur, dan Mengatur Quality Attributes"
description: "Panduan lengkap architecture characteristics dari Fundamentals of Software Architecture - operational, structural, cross-cutting characteristics, measuring, governance, dan architecture quantum."
pubDate: 2026-10-29T08:00:00.000Z
image: /image/fundamentals-02-characteristics.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - QualityAttributes
series: "Software Architecture Fundamentals"
seriesOrder: 2
---

*Fundamentals of Software Architecture* Chapter 4-7 membahas **architecture characteristics** (juga disebut quality attributes atau "-ilities"). Ini adalah kriteria non-fungsional yang menentukan kualitas sistem: seberapa available, scalable, secure, dan maintainable.

Artikel ini mencakup definisi characteristics, cara mengekstrak dari domain concerns dan requirements, mengukur dengan fitness functions, dan konsep architecture quantum.

## Daftar Isi

- [Apa itu Architecture Characteristics?](#apa-itu-architecture-characteristics)
- [Tiga Kategori Characteristics](#tiga-kategori-characteristics)
- [Mengekstrak Characteristics](#mengekstrak-characteristics)
- [Case Study: Silicon Sandwiches](#case-study-silicon-sandwiches)
- [Mengukur Characteristics](#mengukur-characteristics)
- [Governance dan Fitness Functions](#governance-dan-fitness-functions)
- [Architecture Quantum](#architecture-quantum)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Apa itu Architecture Characteristics?

**Architecture characteristics** adalah kriteria non-fungsional yang menentukan kualitas sistem. Buku ini menggunakan istilah "characteristics" daripada "quality attributes" karena lebih deskriptif.

Characteristics berbeda dari **requirements**:

| Aspek | Requirements | Characteristics |
|-------|-------------|-----------------|
| **Focus** | Apa yang sistem lakukan | Seberapa baik sistem melakukannya |
| **Example** | "User bisa checkout" | "Checkout <3 detik" |
| **Testing** | Functional test | Performance, security, load test |
| **Stakeholder** | Business users | Users, ops, security, developers |

## Tiga Kategori Characteristics

Buku ini mengkategorikan characteristics menjadi tiga:

![Architecture Characteristics](/image/fundamentals-02-characteristics.svg)

### Operational Characteristics

| Characteristic | Deskripsi | Contoh Target |
|--------------|-----------|---------------|
| **Availability** | Uptime sistem | 99.9% (8.76 jam downtime/tahun) |
| **Performance** | Response time | <200ms untuk 95% requests |
| **Scalability** | Handle load increase | 10x users tanpa degradasi |
| **Fault tolerance** | Recover dari failure | Failover <30 detik |
| **Elasticity** | Auto-scale sesuai load | Scale out dalam 1 menit |

### Structural Characteristics

| Characteristic | Deskripsi | Contoh Target |
|--------------|-----------|---------------|
| **Maintainability** | Kemudahan perbaikan | Cyclomatic complexity <10 |
| **Extensibility** | Kemudahan tambah fitur | New feature <2 minggu |
| **Testability** | Kemudahan testing | Code coverage >80% |
| **Portability** | Pindah platform | Support Linux + Windows |
| **Configurability** | Ubah behavior tanpa deploy | Feature flags |

### Cross-Cutting Characteristics

| Characteristic | Deskripsi | Contoh Target |
|--------------|-----------|---------------|
| **Security** | Proteksi data | OAuth2, encryption at rest |
| **Privacy** | Perlindungan user data | GDPR compliance |
| **Usability** | User experience | <3 klik untuk aksi utama |
| **Accessibility** | Support disabilitas | WCAG 2.1 AA |
| **Legal** | Compliance regulasi | PCI-DSS untuk payment |

## Mengekstrak Characteristics

### Dari Domain Concerns

Domain concern → Architecture characteristic:

```
"Kita butuh sistem yang selalu available"
→ Availability (99.9% uptime)

"User harus bisa checkout cepat"
→ Performance (response <3 detik)

"Data harus aman dari hacker"
→ Security (encryption, authentication)

"Kita akan scale ke 1 juta user"
→ Scalability (horizontal scaling)
```

### Dari Requirements

| Requirement | Characteristic |
|-------------|---------------|
| "User bisa login dengan Google" | Interoperability, Security |
| "System harus handle Black Friday" | Scalability, Elasticity |
| "Admin bisa tambah produk tanpa deploy" | Configurability, Extensibility |
| "Mobile app harus offline-capable" | Availability, Performance |

## Case Study: Silicon Sandwiches

Buku ini menggunakan case study **Silicon Sandwiches** (online sandwich ordering) untuk ilustrasi.

### Explicit Characteristics (dari requirements)

| Requirement | Characteristic |
|-------------|---------------|
| "User order sandwich online" | Usability, Performance |
| "Payment via credit card" | Security, Interoperability |
| "Admin manage menu" | Configurability |
| "Daily sales report" | Reporting, Performance |

### Implicit Characteristics (dari domain)

| Domain Concern | Characteristic |
|----------------|---------------|
| Sandwich shop (small business) | Simplicity, Cost |
| Peak lunch hours | Scalability, Elasticity |
| Food safety regulations | Auditability, Legal |
| Multiple locations | Distributed, Interoperability |

## Mengukur Characteristics

### Operational Measures

| Measure | Tool | Target |
|---------|------|--------|
| Uptime | Pingdom, UptimeRobot | >99.9% |
| Response time | APM (New Relic, Datadog) | <200ms p95 |
| Error rate | Error tracking (Sentry) | <0.1% |
| Throughput | Load testing (JMeter, k6) | >1000 req/s |

### Structural Measures

| Measure | Tool | Target |
|---------|------|--------|
| Cyclomatic complexity | SonarQube, CodeClimate | <10 per method |
| Coupling | ArchUnit, NDepend | Low afferent coupling |
| Code coverage | JaCoCo, Istanbul | >80% |
| Technical debt | SonarQube | <5% debt ratio |

### Process Measures

| Measure | Tool | Target |
|---------|------|--------|
| Deployment frequency | CI/CD metrics | >1 per day |
| Lead time | Jira, Azure DevOps | <1 week |
| MTTR | Incident tracking | <1 hour |
| Change failure rate | CI/CD metrics | <15% |

## Governance dan Fitness Functions

### Apa itu Fitness Function?

**Fitness function** adalah automated mechanism untuk memvalidasi architecture characteristics.

```java
// Contoh: Fitness function untuk layering
@Test
void services_should_not_depend_on_presentation() {
    noClasses()
        .that().resideInAPackage("..service..")
        .should().dependOnClassesThat()
        .resideInAPackage("..presentation..")
        .check(importedClasses);
}
```

### Jenis Fitness Functions

| Jenis | Deskripsi | Contoh |
|-------|-----------|--------|
| **Atomic** | Single characteristic | Response time <200ms |
| **Holistic** | Kombinasi characteristics | Security + Performance |
| **Triggered** | Run on event | On deploy, on commit |
| **Continual** | Run periodically | Daily, weekly |
| **Static** | Analyze code/structure | ArchUnit, SonarQube |
| **Dynamic** | Monitor runtime | APM, chaos engineering |

### Governance Process

1. **Identify** characteristics yang relevan
2. **Define** fitness functions untuk setiap characteristic
3. **Automate** dalam CI/CD pipeline
4. **Monitor** dan alert pada violation
5. **Review** dan update secara berkala

## Architecture Quantum

Chapter 7 memperkenalkan **architecture quantum**: unit arsitektur yang **independently deployable** dengan **high functional cohesion**.

![Architecture Quantum](/image/fundamentals-02-quantum.svg)

### Quantum vs Architecture Style

| Style | Quantum Count | Contoh |
|-------|-------------|--------|
| **Monolith** | 1 | Single WAR file |
| **Microservices** | N | User, Order, Payment services |
| **Serverless** | M | Individual functions |
| **Microkernel** | 2 | Core + plugins |

### Static vs Dynamic Coupling

| Jenis | Deskripsi | Contoh |
|-------|-----------|--------|
| **Static** | Coupling saat compile/deploy | Shared library, database |
| **Dynamic** | Coupling saat runtime | Synchronous call, shared cache |

**Rule**: Minimize static coupling, manage dynamic coupling.

### Quantum dan Deployment

```
Quantum 1: User Service     Quantum 2: Order Service
┌─────────────┐            ┌─────────────┐
│  User API   │            │  Order API  │
│  User DB    │            │  Order DB   │
│  User Auth  │            │  Payment GW │
└─────────────┘            └─────────────┘
     Independently deployable
```

## Kesimpulan

Chapter 4-7 buku ini membahas:

1. **Architecture characteristics** = kriteria non-fungsional (operational, structural, cross-cutting)
2. **Extract** dari domain concerns dan requirements
3. **Measure** dengan operational, structural, dan process metrics
4. **Govern** dengan fitness functions dalam CI/CD
5. **Architecture quantum** = unit yang independently deployable

Artikel berikutnya: **Component-Based Thinking** , bagaimana mengidentifikasi dan merancang komponen.

## FAQ

### Apa bedanya architecture characteristics dan requirements?

Requirements = apa yang sistem lakukan (fungsional). Characteristics = seberapa baik sistem melakukannya (non-fungsional). Requirements divalidasi dengan functional test, characteristics dengan performance/security/load test.

### Bagaimana cara memilih characteristics yang relevan?

Ekstrak dari domain concerns dan requirements. Tanyakan: "Apa yang paling penting untuk bisnis ini?" Untuk e-commerce: availability, performance, security. Untuk internal tool: simplicity, cost, maintainability.

### Apa itu fitness function?

Fitness function adalah automated test untuk architecture characteristics. Contoh: ArchUnit test untuk memastikan layering tidak dilanggar, atau performance test untuk memastikan response time <200ms.

### Apa itu architecture quantum?

Architecture quantum adalah unit yang independently deployable dengan high functional cohesion. Monolith = 1 quantum, microservices = N quantum. Quantum menentukan batas deployment dan coupling.

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 4-7.
- Bass, L., et al. (2012). *Software Architecture in Practice*. Addison-Wesley.
- [ArchUnit](https://www.archunit.org/) - Java architecture testing
- [Fitness Function Driven Development](https://www.thoughtworks.com/radar/techniques/fitness-function-driven-development)
