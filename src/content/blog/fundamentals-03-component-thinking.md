---
title: "Component-Based Thinking: Mengidentifikasi dan Merancang Komponen Arsitektur"
description: "Panduan lengkap component-based thinking dari Fundamentals of Software Architecture - component scope, architect vs developer role, partitioning, dan component identification flow."
pubDate: 2026-10-30T08:00:00.000Z
image: /image/fundamentals-03-components.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - Components
series: "Software Architecture Fundamentals"
seriesOrder: 3
---

*Fundamentals of Software Architecture* Chapter 8 membahas **component-based thinking**: bagaimana mengidentifikasi, merancang, dan mengatur komponen sebagai building block arsitektur. Ini adalah jembatan antara modularity (Ch3) dan architecture styles (Ch9-18).

Artikel ini mencakup component scope, perbedaan architect vs developer role, architecture partitioning, dan component identification flow dengan case study Silicon Sandwiches.

## Daftar Isi

- [Apa itu Component?](#apa-itu-component)
- [Component Scope](#component-scope)
- [Architect Role vs Developer Role](#architect-role-vs-developer-role)
- [Architecture Partitioning](#architecture-partitioning)
- [Case Study: Silicon Sandwiches Partitioning](#case-study-silicon-sandwiches-partitioning)
- [Component Identification Flow](#component-identification-flow)
- [Component Granularity](#component-granularity)
- [Component Design Principles](#component-design-principles)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Apa itu Component?

**Component** adalah unit deployment yang mengkapsulasi fungsionalitas tertentu. Component adalah **modul yang bisa di-deploy independen**.

| Aspek | Module | Component |
|-------|--------|-----------|
| **Scope** | Code organization | Deployable unit |
| **Granularity** | Class, package | Service, library |
| **Deployment** | Part of monolith | Independent |
| **Interface** | Method signature | API contract |
| **Example** | `utils.js` | `user-service` |

## Component Scope

Buku ini membagi component menjadi 4 scope:

![Component Scope](/image/fundamentals-03-components.svg)

### 1. Simplest: Library/Utility

| Aspek | Deskripsi |
|-------|-----------|
| **Deployment** | Bagian dari aplikasi lain |
| **Interface** | Function/method call |
| **Example** | `lodash`, `StringUtils` |
| **Reuse** | High, tapi coupling tinggi |

### 2. Wrapper: Adapter/Facade

| Aspek | Deskripsi |
|-------|-----------|
| **Deployment** | Bagian dari aplikasi |
| **Interface** | Simplified API |
| **Example** | `PaymentGatewayAdapter` |
| **Reuse** | Medium, encapsulate complexity |

### 3. Service: Business Capability

| Aspek | Deskripsi |
|-------|-----------|
| **Deployment** | Independent process |
| **Interface** | REST, gRPC, messaging |
| **Example** | `OrderService`, `UserService` |
| **Reuse** | High, loose coupling |

### 4. Microservice: Independent Deployment

| Aspek | Deskripsi |
|-------|-----------|
| **Deployment** | Independent, own database |
| **Interface** | API contract, events |
| **Example** | `order-service` dengan own DB |
| **Reuse** | High, bounded context |

## Architect Role vs Developer Role

| Tugas | Architect | Developer |
|-------|-----------|-----------|
| **Identifikasi** | Identifikasi komponen dari domain | - |
| **Interface** | Definisikan API contract | Implementasi interface |
| **Granularity** | Tentukan ukuran komponen | - |
| **Governance** | Pastikan konsistensi | Ikuti standar |
| **Implementation** | - | Tulis kode |
| **Testing** | - | Unit, integration test |
| **Refactoring** | - | Improve code quality |

**Kunci**: Architect fokus pada **what** dan **why**, developer fokus pada **how**.

## Architecture Partitioning

Partitioning adalah membagi sistem menjadi komponen-komponen. Buku ini membahas 3 pendekatan:

### 1. Technical Partitioning

Berdasarkan **technical concern**:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Presentation │  │   Business   │  │ Persistence │
│    Layer     │  │    Layer     │  │    Layer    │
└─────────────┘  └─────────────┘  └─────────────┘
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Familiar, mudah dipahami | Business capability tersebar |
| Separation of concerns | Perubahan bisnis affect semua layer |
| Team bisa specialize | Sulit scale per capability |

### 2. Domain Partitioning

Berdasarkan **business capability**:

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Order   │  │ Customer │  │  Catalog │
│  Service │  │  Service │  │  Service │
│┌───────┐│  │┌───────┐│  │┌───────┐│
││  API  ││  ││  API  ││  ││  API  ││
││Business││  ││Business││  ││Business││
││  DB   ││  ││  DB   ││  ││  DB   ││
│└───────┘│  │└───────┘│  │└───────┘│
└─────────┘  └─────────┘  └─────────┘
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Business capability terisolasi | Duplikasi technical concern |
| Perubahan terlokalisasi | Cross-cutting concern sulit |
| Scale per capability | Infrastructure lebih kompleks |

### 3. Hybrid: Domain + Technical

Kombinasi domain partitioning dengan shared technical services:

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Order   │  │ Customer │  │  Catalog │
│  Service │  │  Service │  │  Service │
└────┬────┘  └────┬────┘  └────┬────┘
     └─────────────┴─────────────┘
              Shared Services
         ┌─────────┐  ┌─────────┐
         │  Auth   │  │ Logging │
         │ Service │  │ Service │
         └─────────┘  └─────────┘
```

## Case Study: Silicon Sandwiches Partitioning

Buku ini menggunakan **Silicon Sandwiches** (online sandwich shop) untuk ilustrasi partitioning.

### Domain Analysis

| Capability | Deskripsi | Complexity |
|------------|-----------|------------|
| **Order** | Place, track, cancel order | High |
| **Menu** | Browse, search, customize | Medium |
| **Customer** | Register, profile, history | Medium |
| **Inventory** | Track ingredients, alert low | Medium |
| **Payment** | Process payment, refund | High |
| **Notification** | Email, SMS, push | Low |

### Partitioning Decision

Silicon Sandwiches memilih **domain partitioning** dengan shared technical services:

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Order   │  │  Menu   │  │ Customer │
│  Service │  │ Service │  │ Service  │
└────┬────┘  └────┬────┘  └────┬────┘
     └─────────────┴─────────────┘
              Shared Services
         ┌─────────┐  ┌─────────┐
         │Payment  │  │Notification│
         │Gateway  │  │  Service   │
         └─────────┘  └─────────┘
```

**Alasan**:
- Order dan Payment complex → service terpisah
- Notification simple → shared service
- Team kecil → tidak perlu microservices penuh

## Component Identification Flow

Buku ini memberikan alur untuk mengidentifikasi komponen:

```
1. Domain Analysis
   ↓
2. Identify Core Capabilities
   ↓
3. Group into Candidate Components
   ↓
4. Analyze Dependencies
   ↓
5. Refine Granularity
   ↓
6. Define Interfaces
   ↓
7. Validate with Fitness Functions
```

### Step 1: Domain Analysis

Pahami domain bisnis:
- Apa bisnis utama?
- Apa core capabilities?
- Apa supporting capabilities?

### Step 2: Identify Core Capabilities

Untuk Silicon Sandwiches:
- **Core**: Order, Menu, Customer
- **Supporting**: Payment, Notification, Inventory

### Step 3: Group into Candidate Components

| Capability | Candidate Component | Rationale |
|------------|---------------------|-----------|
| Order | Order Service | Core, complex |
| Menu | Menu Service | Core, read-heavy |
| Customer | Customer Service | Core, auth |
| Payment | Payment Gateway | Supporting, external integration |
| Notification | Notification Service | Supporting, shared |

### Step 4: Analyze Dependencies

```
Order Service → Payment Gateway (process payment)
Order Service → Notification Service (send confirmation)
Menu Service → Inventory Service (check availability)
Customer Service → Notification Service (send welcome)
```

### Step 5: Refine Granularity

Pertimbangan:
- **Too coarse**: Sulit scale, big deployments
- **Too fine**: Distributed complexity, latency

Untuk Silicon Sandwiches: **6 services** adalah balance yang baik.

### Step 6: Define Interfaces

| Service | Interface |
|---------|-----------|
| Order Service | POST /orders, GET /orders/{id} |
| Menu Service | GET /menu, GET /menu/{item} |
| Customer Service | POST /customers, GET /customers/{id} |
| Payment Gateway | POST /payments, POST /refunds |
| Notification Service | POST /notifications |

### Step 7: Validate with Fitness Functions

```java
// Contoh: Order Service tidak boleh akses Customer DB langsung
@Test
void order_service_should_not_access_customer_db() {
    noClasses()
        .that().resideInAPackage("..order..")
        .should().accessClassesThat()
        .resideInAPackage("..customer.repository..")
        .check(importedClasses);
}
```

## Component Granularity

**Granularity** = ukuran komponen. Ini adalah trade-off:

| Faktor | Coarse (Besar) | Fine (Kecil) |
|--------|---------------|--------------|
| **Deployment** | Jarang, besar | Sering, kecil |
| **Communication** | Internal, cepat | Network, lambat |
| **Data consistency** | Mudah (single DB) | Sulit (distributed) |
| **Team autonomy** | Rendah | Tinggi |
| **Complexity** | Per component tinggi | System complexity tinggi |

**Aturan praktis**:
- Mulai **coarse**, refine ke **fine** jika perlu
- Pertimbangkan **team size**: satu tim = satu service
- Pertimbangkan **change frequency**: yang sering berubah = service terpisah

## Component Design Principles

### 1. Single Responsibility

Setiap komponen punya **satu alasan untuk berubah**.

```
✅ Good: OrderService hanya handle order lifecycle
❌ Bad: OrderService juga handle payment dan notification
```

### 2. High Cohesion

Elemen dalam komponen **terkait erat**.

```
✅ Good: OrderService punya Order, OrderItem, OrderStatus
❌ Bad: OrderService punya Order, Customer, Menu, Payment
```

### 3. Loose Coupling

Komponen **tidak terlalu bergantung** satu sama lain.

```
✅ Good: OrderService pakai PaymentGateway interface
❌ Bad: OrderService langsung panggil PaymentDB
```

### 4. Encapsulation

Komponen **menyembunyikan** implementasi detail.

```
✅ Good: API contract tanpa expose internal structure
❌ Bad: Direct database access dari service lain
```

## Kesimpulan

Chapter 8 buku ini membahas:

1. **Component** = modul yang bisa di-deploy independen
2. **4 scope**: library, wrapper, service, microservice
3. **Architect vs developer**: what vs how
4. **Partitioning**: technical, domain, hybrid
5. **Identification flow**: domain analysis → candidate → dependencies → granularity → interface → validate

Artikel berikutnya: **Monolithic dan Simple Architecture Styles** , layered, pipeline, microkernel, dan service-based.

## FAQ

### Apa bedanya module dan component?

Module adalah unit code organization (class, package). Component adalah unit deployment yang bisa di-deploy independen (service, library). Semua component adalah module, tapi tidak semua module adalah component.

### Bagaimana cara menentukan granularity yang tepat?

Pertimbangkan: team size (satu tim = satu service), change frequency (yang sering berubah terpisah), scale requirements (yang perlu scale berbeda terpisah), dan complexity (jangan terlalu fine sampai sulit manage).

### Apa itu architecture partitioning?

Partitioning adalah membagi sistem menjadi komponen. Technical partitioning berdasarkan layer (presentation, business, persistence). Domain partitioning berdasarkan business capability (order, customer, catalog). Hybrid mengkombinasikan keduanya.

### Bagaimana memvalidasi component boundaries?

Gunakan fitness functions seperti ArchUnit untuk memastikan tidak ada dependency yang melanggar boundaries. Contoh: Order Service tidak boleh akses Customer database langsung.

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 8.
- Evans, E. (2003). *Domain-Driven Design*. Addison-Wesley.
- Newman, S. (2015). *Building Microservices*. O'Reilly Media.
