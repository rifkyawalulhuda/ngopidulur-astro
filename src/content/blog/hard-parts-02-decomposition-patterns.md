---
title: "Architectural Decomposition: 6 Pola Memecah Monolit Menjadi Microservices"
description: "Panduan praktis decomposition patterns dari Software Architecture The Hard Parts - Identify and Size, Gather Common Domain, Flatten, Determine Dependencies, Create Domains, dan Create Domain Services dengan fitness functions."
pubDate: 2026-10-30T08:00:00.000Z
image: /image/hard-parts-decomposition.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - Refactoring
series: "Software Architecture: The Hard Parts"
seriesOrder: 2
---

Chapter 3-5 dari *Software Architecture: The Hard Parts* membahas pertanyaan praktis: bagaimana cara memecah monolit menjadi microservices? Artikel ini membahas **6 decomposition patterns** dengan contoh implementasi dan fitness functions untuk governance.

## Daftar Isi

- [Modularity Drivers: Mengapa Memecah?](#modularity-drivers-mengapa-memecah)
- [Kapan Codebase Bisa Dipecah?](#kapan-codebase-bisa-dipecah)
- [Pattern 1: Identify and Size Components](#pattern-1-identify-and-size-components)
- [Pattern 2: Gather Common Domain Components](#pattern-2-gather-common-domain-components)
- [Pattern 3: Flatten Components](#pattern-3-flatten-components)
- [Pattern 4: Determine Component Dependencies](#pattern-4-determine-component-dependencies)
- [Pattern 5: Create Component Domains](#pattern-5-create-component-domains)
- [Pattern 6: Create Domain Services](#pattern-6-create-domain-services)
- [Component-Based vs Tactical Forking](#component-based-vs-tactical-forking)
- [Implementasi: Sysops Squad Decomposition](#implementasi-sysops-squad-decomposition)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Modularity Drivers: Mengapa Memecah?

Sebelum memecah, pahami *mengapa*. Lima driver utama:

| Driver | Monolit | Microservices | Trade-off |
|--------|---------|---------------|-----------|
| **Maintainability** | Perubahan merembet | Perubahan terisolasi | Kompleksitas operasional |
| **Testability** | Test end-to-end sulit | Test per service mudah | Test integration kompleks |
| **Deployability** | Deploy semua atau tidak sama sekali | Deploy independen | Deployment coordination |
| **Scalability** | Scale seluruh app | Scale yang butuh saja | Network overhead |
| **Availability** | Satu down = semua down | Isolasi kegagalan | Partial failure handling |

**Kunci**: Microservices meningkatkan 5 driver di atas, tapi menurunkan **simplicity** dan **consistency**.

## Kapan Codebase Bisa Dipecah?

Tidak semua monolit siap dipecah. Gunakan metrik ini:

### Afferent/Efferent Coupling

```
Modul A: Ca=10, Ce=2 → I = 2/12 = 0.17 (stabil, sulit dipecah)
Modul B: Ca=1, Ce=8  → I = 8/9 = 0.89 (tidak stabil, mudah dipecah)
```

### Abstractness dan Instability

```
Main Sequence: A + I = 1 (ideal)

Modul A: A=0.1, I=0.17 → D = |0.1 + 0.17 - 1| = 0.73 (jauh dari ideal)
Modul B: A=0.7, I=0.89 → D = |0.7 + 0.89 - 1| = 0.59 (juga jauh)
```

**Rule of thumb**: Modul dengan D < 0.3 lebih mudah dipecah.

## Pattern 1: Identify and Size Components

### Tujuan

Tentukan komponen yang akan menjadi service, dengan ukuran yang tepat.

### Langkah

1. **List semua class/function** dalam monolit
2. **Kelompokkan berdasarkan namespace/package**
3. **Hitung metrics per kelompok**: LOC, cyclomatic complexity, coupling
4. **Tentukan ukuran ideal**: tidak terlalu besar (>500 LOC), tidak terlalu kecil (<50 LOC)

### Fitness Function

```java
@ArchTest
static final ArchRule component_size_limit =
    classes().that().resideInAPackage("..component..")
             .should().haveNameMatching(".*Service")
             .andShould().haveOnlyFinalFields()
             .because("Components should be focused and small");
```

## Pattern 2: Gather Common Domain Components

### Tujuan

Kumpulkan komponen yang **sering berubah bersama** ke dalam satu service.

### Contoh

Di Sysops Squad, komponen-komponen ini sering berubah bersama:
- `TicketValidator`
- `TicketAssigner`
- `TicketNotifier`
- `TicketEscalator`

Semua berkaitan dengan **Ticket lifecycle** → kumpulkan ke `TicketService`.

### Fitness Function

```java
@ArchTest
static final ArchRule common_domain_components_together =
    classes().that().haveSimpleNameContaining("Ticket")
             .should().resideInAPackage("..ticket..")
             .because("Ticket-related components should be in same service");
```

## Pattern 3: Flatten Components

### Tujuan

Pecah komponen yang terlalu kompleks menjadi sub-komponen.

### Gejala Perlu Flatten

- Satu class dengan >10 method
- Satu package dengan >20 class
- Satu komponen dengan >3 responsibility

### Contoh

```
Sebelum Flatten:
┌─────────────────────────┐
│    CustomerService      │
│  - create()             │
│  - update()             │
│  - delete()             │
│  - validate()           │
│  - notify()             │
│  - audit()              │
│  - export()             │
│  - import()             │
└─────────────────────────┘

Sesudah Flatten:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ CustomerCRUD│  │CustomerValid│  │CustomerAudit│
│   Service   │  │   Service   │  │   Service   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Fitness Function

```java
@ArchTest
static final ArchRule max_methods_per_class =
    classes().should().haveOnlyPrivateConstructors()
             .orShould().haveSimpleNameEndingWith("Service")
             .andShould().notHaveFullNameMatching(".*Util.*");
```

## Pattern 4: Determine Component Dependencies

### Tujuan

Petakan dependensi antar komponen untuk identifikasi coupling.

### Tools

- **JDepend** (Java): package dependency
- **Dependency-cruiser** (JS): module graph
- **NDepend** (.NET): assembly dependency

### Output: Dependency Matrix

```
          Ticket  Customer  Billing  Notification
Ticket      -        ↓         ↓          ↓
Customer    ↑        -         ↓          ↓
Billing     ↑        ↑         -          ↓
Notification ↑       ↑         ↑          -

↑ = depends on (efferent)
↓ = depended by (afferent)
```

### Fitness Function

```java
@ArchTest
static final ArchRule no_circular_dependencies =
    slices().matching("com.sysops.(*)..")
            .should().beFreeOfCycles();
```

## Pattern 5: Create Component Domains

### Tujuan

Kelompokkan komponen ke **domain** berdasarkan bounded context DDD.

### Domain di Sysops Squad

| Domain | Components | Business Capability |
|--------|-----------|---------------------|
| **Ticketing** | Create, assign, track, close | Manage support tickets |
| **Customer** | Register, profile, preferences | Manage customer data |
| **Billing** | Invoice, payment, refund | Handle financial transactions |
| **Notification** | Email, SMS, push | Communicate with users |
| **Reporting** | Analytics, export, dashboard | Provide business insights |

### Fitness Function

```java
@ArchTest
static final ArchRule domain_boundaries =
    classes().that().resideInAPackage("..ticketing..")
             .should().onlyBeAccessed().byAnyPackage("..ticketing..", "..api..");
```

## Pattern 6: Create Domain Services

### Tujuan

Bangun **service** per domain, dengan API yang jelas.

### Struktur Service

```
ticket-service/
├── src/
│   ├── domain/          # Domain model, business logic
│   ├── application/     # Use cases, services
│   ├── infrastructure/  # Database, external APIs
│   └── interfaces/      # REST/gRPC controllers
├── tests/
└── Dockerfile
```

### API Contract

```yaml
# ticket-service-api.yaml
openapi: 3.0.0
paths:
  /tickets:
    post:
      summary: Create ticket
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTicketRequest'
      responses:
        201:
          description: Ticket created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ticket'
```

### Fitness Function

```java
@ArchTest
static final ArchRule services_expose_only_api =
    classes().that().resideInAPackage("..interfaces..")
             .should().onlyBeAccessed().byAnyPackage("..application..", "..test..");
```

## Component-Based vs Tactical Forking

| Aspek | Component-Based | Tactical Forking |
|-------|-----------------|------------------|
| **Pendekatan** | Refactor bertahap | Fork lalu refactor |
| **Risiko** | Rendah | Tinggi (merge conflict) |
| **Kecepatan** | Lambat | Cepat |
| **Cocok untuk** | Tim besar, codebase kompleks | Tim kecil, deadline ketat |
| **Rollback** | Mudah | Sulit |

**Rekomendasi buku**: Component-based untuk kebanyakan kasus. Tactical forking hanya untuk proof-of-concept atau deadline ekstrem.

## Implementasi: Sysops Squad Decomposition

### Langkah 1: Analisis Awal

- **Total class**: 450
- **Package**: 23
- **Average coupling**: 0.67 (tinggi)

### Langkah 2: Identify and Size

Ditemukan 8 komponen utama:
- TicketManagement (120 class)
- CustomerManagement (80 class)
- BillingProcessing (60 class)
- NotificationEngine (40 class)
- ReportingEngine (50 class)
- UserAuthentication (30 class)
- SystemConfiguration (40 class)
- SharedUtilities (30 class)

### Langkah 3: Gather Common Domain

- TicketManagement + NotificationEngine → **TicketService**
- CustomerManagement + UserAuthentication → **CustomerService**
- BillingProcessing → **BillingService**
- ReportingEngine → **ReportingService**
- SystemConfiguration → **ConfigService**
- SharedUtilities → **CommonLibrary** (shared, bukan service)

### Langkah 4: Determine Dependencies

Dependency graph menunjukkan:
- TicketService → CustomerService (get customer info)
- TicketService → BillingService (create invoice)
- BillingService → NotificationService (send receipt)
- ReportingService → semua (read data)

### Langkah 5: Create Domains

Domain: **Ticketing**, **Customer**, **Billing**, **Reporting**, **Configuration**

### Langkah 6: Create Services

Setiap domain menjadi microservice dengan database sendiri.

## Kesalahan Umum

### 1. Terlalu Banyak Service (Over-decomposition)

**Gejala**: 50+ service, tim tidak bisa maintain
**Solusi**: Konsolidasi berdasarkan cohesion

### 2. Shared Database

**Gejala**: 3 service query tabel yang sama
**Solusi**: Data decomposition (lihat artikel berikutnya)

### 3. Distributed Monolith

**Gejala**: Service harus deploy bersama
**Solusi**: Re-analyze quantum, decouple

### 4. Ignoring Dependencies

**Gejala**: Circular dependency antar service
**Solusi**: Fitness function, architecture review

## FAQ

### Bagaimana menentukan ukuran komponen yang tepat?

Tidak ada aturan baku. Gunakan **Single Responsibility Principle**: satu komponen = satu alasan untuk berubah. Jika komponen punya >3 responsibility, flatten. Jika <1, gabung.

### Apakah setiap komponen harus jadi microservice?

Tidak. Komponen bisa jadi:
- **Microservice**: jika butuh independent deploy/scale
- **Library**: jika shared logic, tidak perlu deploy
- **Module**: dalam modular monolith, jika tidak perlu distribusi

### Bagaimana menangani shared utilities?

Tiga opsi:
1. **Shared library**: untuk kode stabil (logging, security)
2. **Shared service**: untuk fungsi bisnis bersama (jarang)
3. **Code replication**: untuk kode yang sering berubah (hindari)

### Kapan menggunakan tactical forking?

Hanya untuk:
- Proof-of-concept cepat
- Deadline ekstrem dengan tim kecil
- Codebase yang akan di-rewrite total

Tidak untuk production system dengan tim besar.

## Kesimpulan

Decomposition adalah proses bertahap dengan 6 pola:

1. **Identify and Size**: tentukan komponen
2. **Gather Common Domain**: kumpulkan yang berubah bersama
3. **Flatten**: pecah yang terlalu besar
4. **Determine Dependencies**: petakan coupling
5. **Create Domains**: kelompokkan ke bounded context
6. **Create Services**: bangun microservice per domain

Setiap langkah dilengkapi **fitness function** untuk menjaga kualitas arsitektur.

Artikel berikutnya: **Data Decomposition**, bagian tersulit dari microservices.

## Referensi

- Ford, N., et al. (2021). *Software Architecture: The Hard Parts*, Chapter 3-5. O'Reilly Media.
- Vernon, V. (2013). *Implementing Domain-Driven Design*. Addison-Wesley.
- [ArchUnit](https://www.archunit.org/)
- [Dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
