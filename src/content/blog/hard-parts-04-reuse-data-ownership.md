---
title: "Reuse Patterns dan Data Ownership: Berbagi Kode dan Data di Microservices"
description: "Panduan lengkap reuse patterns dan data ownership dari Software Architecture The Hard Parts - code replication, shared library, shared service, sidecar, single/common/joint ownership, dan distributed transactions."
pubDate: 2026-11-01T08:00:00.000Z
image: /image/hard-parts-reuse.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - DataOwnership
  - DistributedTransactions
series: "Software Architecture: The Hard Parts"
seriesOrder: 4
---

Chapter 8-9 dari *Software Architecture: The Hard Parts* membahas dua masalah terkait: bagaimana **berbagi kode** tanpa coupling, dan bagaimana **mengatur kepemilikan data** di sistem terdistribusi. Artikel ini membahas 4 reuse patterns dan 3 skenario data ownership.

## Daftar Isi

- [Masalah Reuse di Microservices](#masalah-reuse-di-microservices)
- [Pattern 1: Code Replication](#pattern-1-code-replication)
- [Pattern 2: Shared Library](#pattern-2-shared-library)
- [Pattern 3: Shared Service](#pattern-3-shared-service)
- [Pattern 4: Sidecar dan Service Mesh](#pattern-4-sidecar-dan-service-mesh)
- [Perbandingan Reuse Patterns](#perbandingan-reuse-patterns)
- [Data Ownership: Tiga Skenario](#data-ownership-tiga-skenario)
- [Teknik Joint Ownership](#teknik-joint-ownership)
- [Distributed Transactions](#distributed-transactions)
- [Eventual Consistency Patterns](#eventual-consistency-patterns)
- [Implementasi: Sysops Squad](#implementasi-sysops-squad)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Masalah Reuse di Microservices

Di monolit, reuse mudah: import class, panggil method. Di microservices, reuse menciptakan **coupling**. Perubahan di shared code memengaruhi semua service yang menggunakannya.

**Trade-off**: Reuse vs Independence. Semakin banyak reuse, semakin tinggi coupling.

## Pattern 1: Code Replication

### Mekanisme

Copy-paste kode ke setiap service yang membutuhkan.

### Kapan Digunakan

- Kode sangat stabil (jarang berubah)
- Perubahan di satu service tidak boleh memengaruhi yang lain
- Kode kecil dan sederhana

### Contoh

```java
// Di Service A dan Service B (identik)
public class StringUtils {
    public static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
```

### Trade-off

| Kelebihan | Kekurangan |
|-----------|------------|
| Tidak ada coupling | Duplikasi kode |
| Perubahan independen | Bug fix harus di semua service |
| Tidak ada dependency | Maintenance overhead |

## Pattern 2: Shared Library

### Mekanisme

Library bersama (JAR, npm package, DLL) yang di-depend oleh banyak service.

### Kapan Digunakan

- Kode infrastruktur (logging, security, monitoring)
- Kode yang sering berubah bersama
- Tim punya governance untuk versioning

### Contoh

```xml
<!-- pom.xml di banyak service -->
<dependency>
    <groupId>com.sysops</groupId>
    <artifactId>common-security</artifactId>
    <version>2.1.0</version>
</dependency>
```

### Trade-off

| Kelebihan | Kekurangan |
|-----------|------------|
| Single source of truth | Versioning complexity |
| Update sekali, semua dapat | Dependency management |
| Standardization | Coupling via version |

### Versioning Strategies

| Strategi | Mekanisme | Kapan |
|----------|-----------|-------|
| **Strict** | Semua service pakai versi sama | Tim kecil, governance kuat |
| **Relaxed** | Service bisa pakai versi beda | Tim besar, independence penting |
| **Hybrid** | Major version strict, minor relaxed | Balance |

## Pattern 3: Shared Service

### Mekanisme

Service terpisah untuk fungsi bersama, diakses via API.

### Kapan Digunakan

- Fungsi bisnis bersama (jarang)
- Data yang memang shared
- Butuh single point of control

### Contoh

```java
// SharedService: NotificationService
@RestController
public class NotificationController {
    @PostMapping("/notify")
    public void notify(@RequestBody NotificationRequest req) {
        // Kirim email/SMS/push
    }
}
```

### Trade-off

| Kelebihan | Kekurangan |
|-----------|------------|
| Single point of control | Single point of failure |
| Consistent behavior | Network latency |
| Centralized data | Bottleneck risk |

### Risiko

- **Change risk**: Perubahan memengaruhi semua konsumen
- **Performance**: Network call overhead
- **Scalability**: Semua traffic lewat satu service
- **Fault tolerance**: Down = semua konsumen terpengaruh

## Pattern 4: Sidecar dan Service Mesh

### Mekanisme

Deploy komponen bersama service utama, tapi terpisah.

### Kapan Digunakan

- Cross-cutting concerns (monitoring, auth, logging)
- Infrastruktur, bukan bisnis logic
- Polyglot environment (beda bahasa)

### Contoh: Service Mesh (Istio)

```yaml
# Istio sidecar injection
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticket-service
spec:
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: ticket-service
        image: ticket-service:1.0
      # Istio proxy otomatis di-inject
```

### Trade-off

| Kelebihan | Kekurangan |
|-----------|------------|
| Tidak ada code change | Operational complexity |
| Polyglot support | Resource overhead |
| Centralized config | Debugging difficulty |

## Perbandingan Reuse Patterns

| Pattern | Coupling | Consistency | Complexity | Kapan |
|---------|----------|-------------|------------|-------|
| **Code Replication** | None | Low | Low | Kode stabil, independence kritis |
| **Shared Library** | Medium | High | Medium | Infrastruktur, governance kuat |
| **Shared Service** | High | High | High | Fungsi bisnis bersama (jarang) |
| **Sidecar** | Low | High | Medium | Cross-cutting, polyglot |

## Data Ownership: Tiga Skenario

### 1. Single Ownership

Satu service memiliki data, yang lain akses via API.

```
┌─────────────┐         ┌─────────────┐
│ TicketService│         │CustomerService│
│  ┌───────┐  │   API   │  ┌───────┐  │
│  │Ticket │  │◄────────│  │Customer│  │
│  │  DB   │  │         │  │  DB   │  │
│  └───────┘  │         │  └───────┘  │
└─────────────┘         └─────────────┘
```

**Kapan**: Data jelas dimiliki satu domain.

### 2. Common Ownership

Data di shared database, diakses banyak service.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│TicketService│     │BillingService│     │ReportingSvc │
│      ↓      │     │      ↓      │     │      ↓      │
│  ┌─────────────┐  │  ┌─────────────┐  │  ┌────────┐ │
│  │             │  │  │             │  │  │        │ │
│  │    SHARED   │  │  │    SHARED   │  │  │ SHARED │ │
│  │   DATABASE  │  │  │   DATABASE  │  │  │   DB   │ │
│  │             │  │  │             │  │  │        │ │
│  └─────────────┘  │  └─────────────┘  │  └────────┘ │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Kapan**: Hindari jika bisa. Gunakan hanya untuk read-only data.

### 3. Joint Ownership

Data dipecah dengan teknik khusus.

## Teknik Joint Ownership

### Table Split Technique

Pecah tabel, masing-masing service punya bagian.

```
Sebelum:
┌─────────────────────────┐
│        tickets          │
│  - id                   │
│  - title                │
│  - customer_id          │
│  - assigned_expert_id   │
│  - status               │
│  - priority             │
│  - created_at           │
│  - resolved_at          │
│  - resolution_notes     │
└─────────────────────────┘

Sesudah:
┌─────────────────┐     ┌─────────────────┐
│ TicketService   │     │ ExpertService   │
│  ┌─────────┐    │     │  ┌─────────┐    │
│  │ tickets │    │     │  │ tickets │    │
│  │  - id   │    │     │  │  - id   │    │
│  │  - title│    │     │  │  - expert_id│ │
│  │  - cust_id│  │     │  │  - status │   │
│  │  - priority│ │     │  │  - resolved_at│
│  │  - created_at│    │  │  - resolution │
│  └─────────┘    │     │  └─────────┘    │
└─────────────────┘     └─────────────────┘
```

### Data Domain Technique

Kelompokkan data ke domain, service punya domainnya.

```
Domain: Ticketing
- tickets (core fields)
- ticket_history
- ticket_attachments

Domain: Expert
- expert_profiles
- expert_skills
- expert_availability

Shared read-only:
- ticket_expert_view (denormalized)
```

### Delegate Technique

Satu service utama, yang lain delegate.

```
┌─────────────┐         ┌─────────────┐
│TicketService│         │BillingService│
│  (delegate) │         │   (owner)   │
│      ↓      │         │      ↑      │
│  ┌───────┐  │  API    │  ┌───────┐  │
│  │tickets│  │────────►│  │invoices│ │
│  │(cache)│  │         │  │   DB   │  │
│  └───────┘  │         │  └───────┘  │
└─────────────┘         └─────────────┘
```

## Distributed Transactions

### Masalah

Tidak ada ACID di microservices. Bagaimana menjaga consistency?

### Solusi: Eventual Consistency

Data konsisten **akhirnya**, bukan seketika.

### Solusi: Compensating Transactions

Rollback dengan operasi kebalikan.

```java
// Create order
void createOrder(Order order) {
    orderRepository.save(order);
    try {
        paymentService.charge(order);
        inventoryService.reserve(order);
    } catch (Exception e) {
        // Compensating transactions
        orderRepository.delete(order);
        paymentService.refund(order);
        inventoryService.release(order);
    }
}
```

## Eventual Consistency Patterns

### Background Synchronization Pattern

Batch job sinkronisasi data.

```java
@Scheduled(fixedRate = 300000) // 5 menit
public void syncTicketData() {
    List<Ticket> tickets = ticketRepository.findUnsynced();
    for (Ticket t : tickets) {
        billingService.sync(t);
        reportingService.sync(t);
        t.setSynced(true);
    }
}
```

**Kapan**: Data tidak time-critical, volume tinggi.

### Orchestrated Request-Based Pattern

Orchestrator mengoordinasi update.

```java
public class TicketOrchestrator {
    public void closeTicket(Long id) {
        Ticket ticket = ticketService.close(id);
        billingService.createInvoice(ticket);
        notificationService.notifyCustomer(ticket);
        reportingService.updateMetrics(ticket);
    }
}
```

**Kapan**: Workflow kompleks, butuh visibility.

### Event-Based Pattern

Service publish event, yang lain subscribe.

```java
// TicketService
@Transactional
public void closeTicket(Long id) {
    Ticket ticket = repository.findById(id);
    ticket.close();
    repository.save(ticket);
    eventPublisher.publish(new TicketClosedEvent(ticket));
}

// BillingService
@EventListener
public void onTicketClosed(TicketClosedEvent event) {
    createInvoice(event.getTicket());
}
```

**Kapan**: Decoupling penting, bisa tolerate latency.

## Implementasi: Sysops Squad

### Reuse Pattern yang Dipilih

| Kebutuhan | Pattern | Justifikasi |
|-----------|---------|-------------|
| Logging | Shared Library | Stabil, semua service butuh |
| Security | Sidecar (Istio) | Cross-cutting, polyglot |
| Notification | Shared Service | Fungsi bisnis, tapi jarang berubah |
| String utils | Code Replication | Sangat stabil, kecil |

### Data Ownership

| Data | Skenario | Teknik |
|------|----------|--------|
| Tickets | Single | TicketService own |
| Customers | Single | CustomerService own |
| Invoices | Single | BillingService own |
| Ticket-Expert | Joint | Table split |
| Reporting | Common | Read replica |

### Eventual Consistency

- **Ticket → Billing**: Event-based (TicketClosedEvent)
- **Ticket → Reporting**: Background sync (5 menit)
- **Customer → All**: Event-based (CustomerUpdatedEvent)

## Kesalahan Umum

### 1. Over-reuse

**Gejala**: Semua service depend pada common library v1.0, tidak bisa upgrade
**Solusi**: Relaxed versioning, atau code replication untuk yang stabil

### 2. Shared Database

**Gejala**: 3 service query tabel yang sama
**Solusi**: Data ownership, API untuk akses

### 3. Distributed Monolith

**Gejala**: Service harus deploy bersama karena shared library
**Solusi**: Decouple, gunakan sidecar atau code replication

### 4. Ignoring Eventual Consistency

**Gejala**: User lihat data tidak konsisten, komplain
**Solusi**: Set ekspektasi, UI handle inconsistency

## FAQ

### Kapan menggunakan shared service vs shared library?

| Pertanyaan | Shared Library | Shared Service |
|-----------|---------------|----------------|
| Kode infrastruktur? | ✓ | |
| Fungsi bisnis? | | ✓ |
| Butuh runtime isolation? | | ✓ |
| Tim berbeda maintain? | | ✓ |
| Versioning sulit? | | ✓ |

### Bagaimana menangani perubahan di shared library?

1. **Semantic versioning**: Major.Minor.Patch
2. **Deprecation policy**: 2 versi minor sebelum hapus
3. **Migration guide**: Dokumentasi upgrade
4. **Fitness function**: Test compatibility di CI

### Apakah eventual consistency bisa diterima user?

Tergantung domain:
- **Social media**: OK (feed update lambat tidak masalah)
- **Banking**: Tidak OK (saldo harus real-time)
- **E-commerce**: Mixed (inventory bisa eventual, payment harus strong)

### Bagaimana testing distributed transactions?

1. **Contract testing**: Pact untuk API
2. **Chaos engineering**: Simulasi failure
3. **End-to-end test**: Environment mirip production
4. **Monitoring**: Distributed tracing

## Kesimpulan

Reuse dan data ownership adalah trade-off antara **consistency** dan **independence**:

- **Code replication**: independence tinggi, consistency rendah
- **Shared library**: balance, tapi versioning complexity
- **Shared service**: consistency tinggi, independence rendah
- **Sidecar**: untuk cross-cutting concerns

Data ownership:
- **Single**: ideal, gunakan jika bisa
- **Common**: hindari, hanya untuk read-only
- **Joint**: gunakan teknik split/domain/delegate

Artikel berikutnya: **Orchestration vs Choreography dan Transactional Sagas**, tentang mengelola workflow dan transaksi terdistribusi.

## Referensi

- Ford, N., et al. (2021). *Software Architecture: The Hard Parts*, Chapter 8-9. O'Reilly Media.
- [Microservices Patterns](https://microservices.io/patterns/index.html) by Chris Richardson
- [Istio Service Mesh](https://istio.io/)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
