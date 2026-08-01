---
title: "Orchestration vs Choreography dan 8 Transactional Saga Patterns"
description: "Panduan lengkap workflow management dan saga patterns dari Software Architecture The Hard Parts - orchestration vs choreography, 8 saga patterns (Epic s/d Anthology), state management, dan stamp coupling."
pubDate: 2026-11-02T08:00:00.000Z
image: /image/hard-parts-sagas.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - SagaPattern
  - Workflow
series: "Software Architecture: The Hard Parts"
seriesOrder: 5
---

Chapter 10-13 dari *Software Architecture: The Hard Parts* membahas **workflow management** dan **transactional sagas**: bagaimana mengoordinasi banyak service untuk menyelesaikan satu proses bisnis. Artikel ini membahas orchestration vs choreography, 8 saga patterns, dan stamp coupling.

## Daftar Isi

- [Masalah Workflow Terdistribusi](#masalah-workflow-terdistribusi)
- [Orchestration Communication Style](#orchestration-communication-style)
- [Choreography Communication Style](#choreography-communication-style)
- [State Management](#state-management)
- [Trade-Off: Orchestration vs Choreography](#trade-off-orchestration-vs-choreography)
- [8 Transactional Saga Patterns](#8-transactional-saga-patterns)
- [State Machines untuk Sagas](#state-machines-untuk-sagas)
- [Stamp Coupling](#stamp-coupling)
- [Implementasi: Sysops Squad](#implementasi-sysops-squad)
- [Kesalahan Umum](#kesalahan-umum)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)

## Masalah Workflow Terdistribusi

Di monolit, workflow sederhana: method A panggil method B, method B panggil method C. Semua dalam satu transaction.

Di microservices, workflow melintasi service. Contoh: order fulfillment melibatkan:
1. OrderService: create order
2. PaymentService: charge payment
3. InventoryService: reserve items
4. ShippingService: schedule delivery
5. NotificationService: notify customer

Bagaimana mengoordinasi ini tanpa distributed transaction?

## Orchestration Communication Style

### Mekanisme

**Central controller** (orchestrator) mengoordinasi semua service.

```
┌─────────────────┐
│  Orchestrator   │
│  (OrderFulfillment)│
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ↓         ↓        ↓        ↓
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Order  │ │Payment│ │Inventory│ │Shipping│
│Service│ │Service│ │Service │ │Service │
└───────┘ └───────┘ └───────┘ └───────┘
```

### Implementasi

```java
public class OrderFulfillmentOrchestrator {
    public OrderResult fulfill(Order order) {
        // Step 1: Create order
        Order created = orderService.create(order);

        // Step 2: Charge payment
        Payment payment = paymentService.charge(created);

        // Step 3: Reserve inventory
        Inventory reservation = inventoryService.reserve(created);

        // Step 4: Schedule shipping
        Shipment shipment = shippingService.schedule(created);

        // Step 5: Notify
        notificationService.send(created, payment, shipment);

        return OrderResult.success(created, payment, shipment);
    }
}
```

### Kelebihan

- **Visibility**: Seluruh workflow di satu tempat
- **Debugging**: Mudah trace execution
- **Error handling**: Centralized compensation
- **Monitoring**: Single point untuk metrics

### Kekurangan

- **Single point of failure**: Orchestrator down = workflow berhenti
- **Bottleneck**: Semua traffic lewat orchestrator
- **Coupling**: Service tahu tentang orchestrator

## Choreography Communication Style

### Mekanisme

**Tidak ada central controller**. Service publish event, yang lain subscribe.

```
┌─────────┐     OrderCreated     ┌─────────┐
│  Order  │─────────────────────►│ Payment │
│ Service │                      │ Service │
└─────────┘                      └────┬────┘
                                      │ PaymentCompleted
                                      ↓
┌─────────┐     InventoryReserved  ┌─────────┐
│ Shipping│◄─────────────────────│ Inventory│
│ Service │                      │ Service  │
└────┬────┘                      └─────────┘
     │ ShipmentScheduled
     ↓
┌─────────┐
│Notification│
│  Service  │
└─────────┘
```

### Implementasi

```java
// OrderService
@Transactional
public Order create(Order order) {
    Order saved = repository.save(order);
    eventPublisher.publish(new OrderCreatedEvent(saved));
    return saved;
}

// PaymentService
@EventListener
public void onOrderCreated(OrderCreatedEvent event) {
    Payment payment = paymentService.charge(event.getOrder());
    eventPublisher.publish(new PaymentCompletedEvent(payment));
}

// InventoryService
@EventListener
public void onPaymentCompleted(PaymentCompletedEvent event) {
    Inventory inv = inventoryService.reserve(event.getOrder());
    eventPublisher.publish(new InventoryReservedEvent(inv));
}
```

### Kelebihan

- **Decoupled**: Service tidak tahu satu sama lain
- **Scalable**: Tidak ada bottleneck
- **Resilient**: Satu service down tidak menghentikan yang lain
- **Flexible**: Tambah service baru tanpa ubah existing

### Kekurangan

- **Sulit dipahami**: Workflow tersebar di banyak service
- **Sulit debug**: Distributed tracing diperlukan
- **Sulit track state**: Tidak ada single source of truth
- **Complexity**: Event schema harus konsisten

## State Management

### Pendekatan 1: Stateful Orchestrator

Orchestrator menyimpan state workflow.

```java
public class OrderOrchestrator {
    private OrderState state;

    public void fulfill(Order order) {
        state = OrderState.CREATED;
        // ... steps ...
        state = OrderState.PAYMENT_COMPLETED;
        // ... steps ...
        state = OrderState.SHIPPED;
    }
}
```

### Pendekatan 2: Stateless Choreography

Query semua service untuk build state.

```java
public OrderStatus getOrderStatus(Long orderId) {
    Order order = orderService.get(orderId);
    Payment payment = paymentService.getByOrder(orderId);
    Inventory inv = inventoryService.getByOrder(orderId);
    Shipment ship = shippingService.getByOrder(orderId);

    return OrderStatus.builder()
        .order(order)
        .payment(payment)
        .inventory(inv)
        .shipment(ship)
        .build();
}
```

### Pendekatan 3: Stamp Coupling

State disimpan di message contract.

```java
public class OrderMessage {
    private Order order;
    private Payment payment;
    private Inventory inventory;
    private Shipment shipment;
    // Setiap service update bagiannya
}
```

## Trade-Off: Orchestration vs Choreography

| Aspek | Orchestration | Choreography |
|-------|-------------|--------------|
| **Visibility** | Tinggi | Rendah |
| **Debugging** | Mudah | Sulit |
| **Coupling** | Tinggi ke orchestrator | Rendah |
| **Scalability** | Terbatas | Tinggi |
| **Resilience** | Rendah (SPOF) | Tinggi |
| **Complexity** | Rendah | Tinggi |
| **State tracking** | Mudah | Sulit |
| **Error handling** | Centralized | Distributed |

**Rekomendasi buku**:
- **Orchestration** untuk workflow kompleks dengan banyak langkah
- **Choreography** untuk event notification sederhana
- **Hybrid** untuk kebanyakan kasus nyata

## 8 Transactional Saga Patterns

Saga adalah pola untuk transaksi terdistribusi: serangkaian local transactions dengan **compensating transactions** untuk rollback.

Tiga dimensi menentukan 8 pola:

| Dimensi | Nilai |
|---------|-------|
| **Communication** | Synchronous (s) vs Asynchronous (a) |
| **Consistency** | Atomic (a) vs Eventual (e) |
| **Coordination** | Orchestrated (o) vs Choreographed (c) |

### Matriks 8 Pola

| Pola | Comm | Consist | Coord | Keterangan |
|------|------|---------|-------|------------|
| **Epic (sao)** | Sync | Atomic | Orch | Paling mudah, paling coupled |
| **Phone Tag (sac)** | Sync | Atomic | Choreo | Sulit debug |
| **Fairy Tale (seo)** | Sync | Eventual | Orch | Good balance |
| **Time Travel (sec)** | Sync | Eventual | Choreo | Complex state |
| **Fantasy Fiction (aao)** | Async | Atomic | Orch | Jarang dipakai |
| **Horror Story (aac)** | Async | Atomic | Choreo | **PALING SULIT, HINDARI** |
| **Parallel (aeo)** | Async | Eventual | Orch | Good untuk scale |
| **Anthology (aec)** | Async | Eventual | Choreo | Paling decoupled |

### Detail Pola Kunci

#### Epic Saga (sao)

```java
// Synchronous, Atomic, Orchestrated
public class EpicSaga {
    @Transactional // Local transaction per service
    public void execute() {
        step1(); // Sync call
        step2(); // Sync call
        step3(); // Sync call
    }
}
```

**Kapan**: Workflow sederhana, tim kecil, butuh simplicity.

#### Horror Story (aac)

```java
// Asynchronous, Atomic, Choreographed
// MENGAPA HORROR?
// - Async: sulit track
// - Atomic: butuh rollback semua
// - Choreographed: tidak ada coordinator
// = Kombinasi terburuk
```

**Kapan**: Jangan. Hindari. Pilih pola lain.

#### Anthology (aec)

```java
// Asynchronous, Eventual, Choreographed
@EventListener
public void onStep1Completed(Step1Event event) {
    // Process
    eventPublisher.publish(new Step2Event());
}

// Compensation
@EventListener
public void onStep1Failed(Step1FailedEvent event) {
    // Compensate
    eventPublisher.publish(new CompensateStep1Event());
}
```

**Kapan**: Butuh decoupling maksimal, bisa tolerate eventual consistency.

## State Machines untuk Sagas

### Saga State Machine

```java
public enum SagaState {
    STARTED,
    ORDER_CREATED,
    PAYMENT_COMPLETED,
    INVENTORY_RESERVED,
    SHIPPED,
    COMPLETED,
    COMPENSATING,
    COMPENSATED
}

public class SagaStateMachine {
    private SagaState currentState;
    private List<SagaStep> steps;
    private int currentStepIndex;

    public void execute() {
        try {
            for (SagaStep step : steps) {
                step.execute();
                currentState = step.getNextState();
                currentStepIndex++;
            }
            currentState = SagaState.COMPLETED;
        } catch (Exception e) {
            compensate();
        }
    }

    private void compensate() {
        currentState = SagaState.COMPENSATING;
        for (int i = currentStepIndex; i >= 0; i--) {
            steps.get(i).compensate();
        }
        currentState = SagaState.COMPENSATED;
    }
}
```

## Stamp Coupling

### Masalah

Service mengirim seluruh object padahal hanya butuh sebagian.

```java
// Buruk: Stamp coupling
public class OrderMessage {
    private Order order;        // 50 fields
    private Customer customer;  // 30 fields
    private Payment payment;    // 20 fields
    // Service hanya butuh order.id dan order.status
}
```

### Solusi: DTO

```java
// Baik: Hanya field yang dibutuhkan
public class OrderNotification {
    private Long orderId;
    private String status;
    private String customerEmail;
}
```

### Solusi: GraphQL

```graphql
query {
    order(id: "123") {
        id
        status
        customer {
            email
        }
    }
}
```

## Implementasi: Sysops Squad

### Workflow: Ticket Resolution

| Step | Service | Action | Compensation |
|------|---------|--------|--------------|
| 1 | TicketService | Close ticket | Reopen ticket |
| 2 | BillingService | Create invoice | Cancel invoice |
| 3 | NotificationService | Notify customer | - (tidak perlu compensate) |
| 4 | ReportingService | Update metrics | - (eventual) |

### Pattern yang Dipilih: Fairy Tale (seo)

- **Sync**: Butuh response cepat untuk user
- **Eventual**: Bisa tolerate billing delay
- **Orchestrated**: Workflow kompleks, butuh visibility

### State Management: Stateful Orchestrator

```java
public class TicketResolutionOrchestrator {
    private TicketResolutionState state;

    public void resolveTicket(Long ticketId) {
        state = TicketResolutionState.CLOSING_TICKET;
        Ticket ticket = ticketService.close(ticketId);

        state = TicketResolutionState.CREATING_INVOICE;
        Invoice invoice = billingService.create(ticket);

        state = TicketResolutionState.NOTIFYING;
        notificationService.notify(ticket, invoice);

        state = TicketResolutionState.COMPLETED;
    }
}
```

## Kesalahan Umum

### 1. Terlalu Banyak Orchestrator

**Gejala**: Setiap service punya orchestrator sendiri
**Solusi**: Satu orchestrator per workflow, bukan per service

### 2. Choreography untuk Workflow Kompleks

**Gejala**: Event chain 10+ service, sulit debug
**Solusi**: Gunakan orchestration untuk workflow >3 langkah

### 3. Tidak Ada Compensation

**Gejala**: Error di tengah workflow, data tidak konsisten
**Solusi**: Setiap step harus punya compensating transaction

### 4. Horror Story Pattern

**Gejala**: Async + Atomic + Choreographed = sulit maintain
**Solusi**: Pilih pola lain, Epic atau Anthology

## FAQ

### Kapan menggunakan orchestration vs choreography?

| Pertanyaan | Orchestration | Choreography |
|-----------|-------------|--------------|
| Workflow >3 langkah? | ✓ | |
| Butuh visibility tinggi? | ✓ | |
| Tim kecil? | ✓ | |
| Butuh decoupling maksimal? | | ✓ |
| Event notification sederhana? | | ✓ |
| Scale sangat tinggi? | | ✓ |

### Bagaimana menangani compensation yang gagal?

1. **Retry**: Coba lagi dengan exponential backoff
2. **Dead letter queue**: Simpan untuk manual intervention
3. **Alert**: Notifikasi tim operations
4. **Reconciliation job**: Periodic check dan fix

### Apakah saga pattern menggantikan ACID?

Tidak. Saga adalah **trade-off**:
- **ACID**: Strong consistency, tidak scalable
- **Saga**: Eventual consistency, scalable

Pilih berdasarkan kebutuhan consistency vs scalability.

### Bagaimana testing saga?

1. **Unit test**: Setiap step dan compensation
2. **Integration test**: Workflow end-to-end
3. **Chaos test**: Simulasi failure di setiap step
4. **Contract test**: API antar service

## Kesimpulan

Workflow terdistribusi membutuhkan koordinasi tanpa distributed transaction:

- **Orchestration**: visibility tinggi, tapi coupling
- **Choreography**: decoupled, tapi kompleks
- **8 saga patterns**: trade-off communication, consistency, coordination
- **State management**: stateful orchestrator, stateless, atau stamp coupling

**Rekomendasi**: Hindari Horror Story (aac). Pilih Epic untuk simplicity, Anthology untuk decoupling, atau Fairy Tale/Parallel untuk balance.

Artikel berikutnya: **Data Mesh dan Trade-Off Analysis**, pendekatan baru untuk analytical data.

## Referensi

- Ford, N., et al. (2021). *Software Architecture: The Hard Parts*, Chapter 10-13. O'Reilly Media.
- Richardson, C. (2018). *Microservices Patterns*, Chapter 4. Manning.
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
