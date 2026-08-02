---
title: "Distributed dan Advanced Architecture Styles: Event-Driven, Space-Based, SOA, dan Microservices"
description: "Panduan lengkap 4 architecture styles kompleks dari Fundamentals of Software Architecture - event-driven, space-based, service-oriented, dan microservices dengan trade-off analysis dan cara memilih."
pubDate: 2026-11-01T08:00:00.000Z
image: /image/fundamentals-05-styles.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - Microservices
  - EventDriven
series: "Software Architecture Fundamentals"
seriesOrder: 5
---

*Fundamentals of Software Architecture* Chapter 14-18 membahas architecture styles yang lebih kompleks: **event-driven**, **space-based**, **service-oriented (SOA)**, dan **microservices**. Ini adalah styles untuk sistem yang butuh scalability tinggi, elasticity, dan fault tolerance.

Artikel ini juga membahas Chapter 18: **bagaimana memilih architecture style yang tepat** berdasarkan trade-off analysis.

## Daftar Isi

- [Event-Driven Architecture](#event-driven-architecture)
- [Space-Based Architecture](#space-based-architecture)
- [Service-Oriented Architecture (SOA)](#service-oriented-architecture-soa)
- [Microservices Architecture](#microservices-architecture)
- [Choosing the Right Style](#choosing-the-right-style)
- [Perbandingan 4 Styles](#perbandingan-4-styles)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Event-Driven Architecture

**Event-driven architecture (EDA)** menggunakan **events** sebagai mekanisme komunikasi utama antar komponen.

![Event-Driven Architecture](/image/fundamentals-05-event-driven.svg)

### Topology: Broker vs Mediator

| Topology | Deskripsi | Kapan |
|----------|-----------|-------|
| **Broker** | No central mediator, events broadcast | Simple workflows, high decoupling |
| **Mediator** | Central mediator controls workflow | Complex workflows, orchestration needed |

### Broker Topology

```
Event Producer → Event Channel → Event Consumer A
                     ↓
               Event Consumer B
                     ↓
               Event Consumer C
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Highly decoupled | No workflow control |
| Scalable | Error handling complex |
| Responsive | Event ordering issues |

### Mediator Topology

```
Event Producer → Event Channel → Mediator → Event Consumer A
                                      ↓
                                Event Consumer B
                                      ↓
                                Event Consumer C
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Workflow control | Mediator bottleneck |
| Error handling | Single point of failure |
| Event ordering | More complex |

### Event Types

| Type | Deskripsi | Contoh |
|------|-----------|--------|
| **Notification** | "Something happened" | `OrderCreated`, `PaymentProcessed` |
| **State transfer** | Full state in event | `OrderUpdated` with full order data |
| **Event sourcing** | Store events, replay state | Event log as source of truth |

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Scalability | ★★★★★ | Async, decoupled |
| Elasticity | ★★★★☆ | Scale consumers independently |
| Fault tolerance | ★★★★☆ | Failed consumer doesn't affect others |
| Complexity | ★★☆☆☆ | Async debugging, event ordering |
| Testability | ★★☆☆☆ | Integration testing complex |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Highly scalable systems
- Real-time processing
- Decoupled services
- Event sourcing

❌ **Hindari untuk**:
- Simple CRUD applications
- Strong consistency requirements
- Complex workflows without orchestration

## Space-Based Architecture

**Space-based architecture** menghilangkan database sebagai bottleneck dengan **in-memory data grids**.

![Space-Based Architecture](/image/fundamentals-05-space-based.svg)

### Topology

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Processing  │  │ Processing  │  │ Processing  │
│    Unit     │  │    Unit     │  │    Unit     │
│             │  │             │  │             │
│  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │
│  │ In-   │  │  │  │ In-   │  │  │  │ In-   │  │
│  │Memory │  │  │  │Memory │  │  │  │Memory │  │
│  │ Data  │  │  │  │ Data  │  │  │  │ Data  │  │
│  │ Grid  │  │  │  │ Grid  │  │  │  │ Grid  │  │
│  └───────┘  │  │  └───────┘  │  │  └───────┘  │
└─────────────┘  └─────────────┘  └─────────────┘
       ↑               ↑               ↑
       └───────────────┴───────────────┘
              Data Grid (replicated)
```

### Components

| Component | Fungsi |
|-----------|--------|
| **Processing unit** | Business logic + in-memory data |
| **Data grid** | Replicated in-memory data |
| **Messaging grid** | Event distribution |
| **Processing grid** | Optional, for complex processing |
| **Deployment manager** | Dynamic scaling |

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Scalability | ★★★★★ | Linear scalability |
| Elasticity | ★★★★★ | Dynamic scaling |
| Performance | ★★★★★ | In-memory, no DB bottleneck |
| Complexity | ★★☆☆☆ | Data grid management |
| Cost | ★★☆☆☆ | Memory expensive |
| Data consistency | ★★☆☆☆ | Eventual consistency |

### Kapan Menggunakan

✅ **Cocok untuk**:
- High-volume, low-latency
- Variable load (spiky)
- Real-time processing
- Gaming, financial trading

❌ **Hindari untuk**:
- Simple applications
- Strong consistency requirements
- Budget constraints

## Service-Oriented Architecture (SOA)

**SOA** adalah style enterprise-level dengan **service taxonomy** dan **enterprise service bus (ESB)**.

![SOA Architecture](/image/fundamentals-05-soa.svg)

### Service Taxonomy

| Layer | Service Type | Contoh |
|-------|-------------|--------|
| **Business services** | Abstract, enterprise-level | `ProcessOrder`, `ManageCustomer` |
| **Enterprise services** | Concrete, shared | `CustomerService`, `OrderService` |
| **Application services** | Specific to application | `OrderValidator`, `PriceCalculator` |
| **Infrastructure services** | Technical | `LoggingService`, `AuthService` |

### ESB (Enterprise Service Bus)

```
Service A ─┐
Service B ─┼── ESB ─── Routing, Transformation, Orchestration
Service C ─┘
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Service reuse | ESB bottleneck |
| Standardization | Complexity |
| Governance | Performance overhead |

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Reusability | ★★★★★ | Service taxonomy |
| Governance | ★★★★★ | Centralized control |
| Complexity | ★☆☆☆☆ | ESB, taxonomy, governance |
| Performance | ★★☆☆☆ | ESB overhead |
| Agility | ★★☆☆☆ | Heavy governance |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Large enterprises
- Heterogeneous systems integration
- Strong governance requirements
- Legacy system integration

❌ **Hindari untuk**:
- Startups, small teams
- Simple applications
- High-performance requirements

## Microservices Architecture

**Microservices** adalah style yang paling granular: small, independently deployable services dengan bounded context.

![Microservices Architecture](/image/fundamentals-05-microservices.svg)

### Characteristics

| Karakteristik | Deskripsi |
|-------------|-----------|
| **Bounded context** | Each service owns its domain |
| **Database per service** | Own data, no shared DB |
| **API gateway** | Single entry point |
| **Service discovery** | Dynamic service location |
| **Circuit breaker** | Fault tolerance |
| **Distributed logging** | Centralized monitoring |

### Topology

```
                    ┌─────────────┐
                    │ API Gateway │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Order     │ │  Customer   │ │   Catalog   │
    │   Service   │ │   Service   │ │   Service   │
    │             │ │             │ │             │
    │  ┌───────┐  │ │  ┌───────┐  │ │  ┌───────┐  │
    │  │  API  │  │ │  │  API  │  │ │  │  API  │  │
    │  │Business│  │ │  │Business│  │ │  │Business│  │
    │  │   DB   │  │ │  │   DB   │  │ │  │   DB   │  │
    │  └───────┘  │ │  └───────┘  │ │  └───────┘  │
    └─────────────┘ └─────────────┘ └─────────────┘
```

### Communication

| Pattern | Deskripsi | Kapan |
|---------|-----------|-------|
| **Synchronous** | REST, gRPC | Simple, immediate response |
| **Asynchronous** | Messaging, events | Decoupled, resilient |
| **Hybrid** | Sync for query, async for command | CQRS pattern |

### Trade-Offs

| Karakteristik | Rating | Catatan |
|-------------|--------|---------|
| Scalability | ★★★★★ | Scale per service |
| Deployability | ★★★★★ | Independent deployment |
| Testability | ★★★★☆ | Service isolation |
| Complexity | ★★☆☆☆ | Distributed system |
| Performance | ★★☆☆☆ | Network latency |
| Data consistency | ★★☆☆☆ | Eventual consistency |

### Kapan Menggunakan

✅ **Cocok untuk**:
- Large, complex domains
- Multiple teams
- High scale requirements
- Frequent deployments

❌ **Hindari untuk**:
- Small teams
- Simple domains
- Strong consistency requirements
- Limited DevOps maturity

## Choosing the Right Style

Chapter 18 membahas **bagaimana memilih architecture style** berdasarkan trade-off analysis.

![Choosing Architecture Style](/image/fundamentals-05-choosing.svg)

### Decision Factors

| Faktor | Pertanyaan |
|--------|-----------|
| **Team size** | Berapa banyak developer? |
| **Domain complexity** | Seberapa kompleks bisnis? |
| **Scale requirements** | Berapa banyak users? |
| **Deployment frequency** | Seberapa sering deploy? |
| **Consistency requirements** | Strong vs eventual? |
| **Budget** | Berapa budget untuk infrastructure? |

### Style Selection Matrix

| Kondisi | Rekomendasi |
|---------|-------------|
| Tim kecil, domain sederhana | **Layered** |
| Data processing, ETL | **Pipeline** |
| Product-based, plugin ecosystem | **Microkernel** |
| Domain-driven, tim besar | **Service-Based** |
| High scale, variable load | **Space-Based** |
| Real-time, event-heavy | **Event-Driven** |
| Enterprise integration | **SOA** |
| Complex domain, multiple teams | **Microservices** |

### Evolution Path

```
Monolith (Layered)
    ↓
Service-Based (Domain partitioning)
    ↓
Microservices (Bounded context, own DB)
    ↓
Event-Driven (Async, event sourcing)
```

## Perbandingan 4 Styles

| Aspek | Event-Driven | Space-Based | SOA | Microservices |
|-------|-------------|-------------|-----|---------------|
| **Complexity** | High | High | Very High | High |
| **Scalability** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| **Elasticity** | ★★★★☆ | ★★★★★ | ★★☆☆☆ | ★★★★☆ |
| **Fault tolerance** | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| **Performance** | ★★★★☆ | ★★★★★ | ★★☆☆☆ | ★★★☆☆ |
| **Simplicity** | ★★☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ | ★★☆☆☆ |
| **Data consistency** | ★★☆☆☆ | ★★☆☆☆ | ★★★★☆ | ★★☆☆☆ |
| **Best for** | Real-time, events | High-volume, low-latency | Enterprise integration | Complex domain, multiple teams |

## Kesimpulan

Chapter 14-18 buku ini membahas:

1. **Event-Driven**: Async, scalable, tapi complex debugging
2. **Space-Based**: In-memory, linear scalability, tapi expensive
3. **SOA**: Enterprise-level, governance, tapi heavy ESB
4. **Microservices**: Granular, independent, tapi distributed complexity
5. **Choosing**: Trade-off analysis berdasarkan team, domain, scale

Artikel berikutnya: **Architecture Decisions, Risk Analysis, dan Diagramming** , soft skills untuk architect.

## FAQ

### Apa bedanya event-driven dan microservices?

Event-driven adalah komunikasi pattern (async via events), microservices adalah deployment pattern (small, independent services). Microservices bisa menggunakan event-driven untuk komunikasi, tapi tidak harus.

### Kapan saya harus menggunakan space-based architecture?

Gunakan space-based jika: high-volume, low-latency, variable load (spiky), dan budget untuk in-memory data grid. Contoh: gaming, financial trading, real-time bidding.

### Apa itu service taxonomy di SOA?

Service taxonomy adalah hierarki service: business services (abstract), enterprise services (shared), application services (specific), infrastructure services (technical). Ini memudahkan reuse dan governance.

### Bagaimana cara memilih antara microservices dan service-based?

Pilih microservices jika: domain kompleks, multiple teams, butuh full independence, DevOps mature. Pilih service-based jika: domain-driven tapi tidak perlu full independence, tim lebih kecil, shared database acceptable.

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 14-18.
- Fowler, M., & Lewis, J. (2014). *Microservices*. martinfowler.com.
- Newman, S. (2015). *Building Microservices*. O'Reilly Media.
- Hohpe, G., & Woolf, B. (2003). *Enterprise Integration Patterns*. Addison-Wesley.
