---
title: "Microservices at Scale: Resilience, Circuit Breaker, dan CAP"
description: Panduan microservices at scale dari Sam Newman - failure handling
  dan resilience patterns, circuit breaker timeout bulkhead, caching strategies,
  CAP theorem, service discovery, load balancing, dan API documentation tools.
pubDate: 2026-09-22T08:00:00.000Z
image: /image/microservices-nginx-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - CircuitBreaker
  - DistributedSystems
  - Resilience
series: "Building Microservices"
seriesOrder: 3
---

Chapter 3 dari *Building Microservices* oleh Sam Newman adalah chapter yang paling "battle-hardened" — penuh dengan pelajaran dari produksi nyata tentang apa yang terjadi ketika arsitektur microservices bertumbuh dari sistem kecil menjadi sistem besar yang menangani jutaan request per hari.

## Daftar Isi

- [Filosofi Failure dalam Microservices](#filosofi-failure-dalam-microservices)
- [Memahami Requirements Scaling](#memahami-requirements-scaling)
- [Degrading Gracefully](#degrading-gracefully)
- [Timeout Pattern](#timeout-pattern)
- [Circuit Breaker Pattern](#circuit-breaker-pattern)
- [Bulkhead Pattern](#bulkhead-pattern)
- [Caching di Microservices](#caching-di-microservices)
- [CAP Theorem](#cap-theorem)
- [Service Discovery](#service-discovery)
- [Load Balancing](#load-balancing)
- [API Documentation Tools](#api-documentation-tools)



## Filosofi Failure dalam Microservices

Sam Newman membuka chapter ini dengan cerita yang sangat terkenal dari Google:

> *"In the reception area of one of the buildings in Mountain View was an old rack of machines, there as a sort of exhibit. These servers weren't in server enclosures, they were just bare motherboards slotted into the rack — and many of them had components missing. One of the engineers explained to me that when a component failed, Google would just replace the whole machine rather than try to fix it."*

Ini mencerminkan filosofi fundamental dalam distributed systems:

```
FILOSOFI GOOGLE/NETFLIX/AMAZON:

BUKAN:
"Bagaimana mencegah hardware gagal?"
(Impossible at scale)

MELAINKAN:
"Bagaimana sistem tetap berjalan MESKIPUN hardware gagal?"
(Design for failure)

Implikasi:
  - Assume everything will fail
  - Build for resilience, not perfection
  - Degrade gracefully, not catastrophically
```



## Memahami Requirements Scaling

Sebelum mulai scale, pahami dulu apa yang sebenarnya dibutuhkan:

### Response Time / Latency

```
LATENCY REQUIREMENTS:

Pertanyaan kunci:
  - Berapa lama operasi yang berbeda boleh berlangsung?
  - Bagaimana pengaruh increasing load terhadap response time?

Pengukuran:
  Percentile latency lebih bermakna dari rata-rata:

  Avg: 100ms ← bisa menyesatkan
  P50: 80ms  ← 50% request lebih cepat dari ini
  P95: 200ms ← 95% request lebih cepat dari ini
  P99: 800ms ← 99% request lebih cepat dari ini
       ↑ Ini yang users rasakan (worst case biasa)
```

### Availability

```
AVAILABILITY REQUIREMENTS:

99.9%   = 8.7 jam downtime/tahun
99.99%  = 52 menit downtime/tahun
99.999% = 5 menit downtime/tahun

Setiap service tambahan yang dipanggil = risiko availability berkurang
4 services masing-masing 99.9% = 99.9^4 = 99.6% total
```

### Data Durability

Jika data hilang, seberapa buruk? Ini mempengaruhi keputusan replikasi, backup, dan consistency model.



## Degrading Gracefully

Prinsip paling penting dalam sistem terdistribusi: **ketika bagian gagal, sistem harus tetap bisa berfungsi secara terbatas**, bukan crash total.

```
CONTOH NYATA: E-Commerce Platform

TANPA GRACEFUL DEGRADATION:
  Recommendation Service DOWN
  → Seluruh website DOWN
  ← Customer tidak bisa berbelanja sama sekali

DENGAN GRACEFUL DEGRADATION:
  Recommendation Service DOWN
  → Homepage: tampilkan produk bestseller statik (cached)
  → Product page: tampilkan tanpa "Customers also bought"
  → Cart: tetap berfungsi normal
  ← Customer tetap bisa berbelanja!

Shopping Cart DOWN (critical):
  → Ini memang masalah serius
  → Tapi product browsing masih bisa berjalan
  → Minimal damage, bukan total blackout
```

**Langkah implementasi graceful degradation:**
1. Identifikasi setiap downstream dependency
2. Tentukan dampak tiap dependency jika tidak tersedia
3. Rancang fallback untuk setiap dependency
4. Test failure scenario secara reguler (Chaos Engineering)



## Timeout Pattern

Tidak pernah membiarkan request menunggu tanpa batas adalah keharusan.

### Kasus Nyata dari Sam Newman

Sam Newman menceritakan kasus di mana classified ads website hampir down:

> *"Our application normally had 40 concurrent connections at any given time. In the space of five minutes, this situation caused us to peak at around 800 connections, bringing the system down."*

Penyebabnya? Satu downstream service yang lambat, dan timeout yang **tidak diset** (disabled by default!).

```
TANPA TIMEOUT:

Request 1: menunggu Service B (lambat)... masih menunggu...
Request 2: menunggu Service B (lambat)... masih menunggu...
Request N: menunggu Service B (lambat)... masih menunggu...
     ↓
Thread pool exhausted
     ↓
Service A tidak bisa melayani request baru
     ↓
Cascade failure ke seluruh sistem

DENGAN TIMEOUT:

Request → Service B
  - timeout: 500ms
  - jika tidak ada response dalam 500ms → throw TimeoutException
  - caller handles exception: gunakan fallback
  - thread bebas kembali ke pool
```

### Timeout Best Practices

```
TIMEOUT CONFIGURATION:

Per-dependency timeout:
  userService.timeout = 200ms   (fast, critical)
  reportService.timeout = 5000ms (slow, non-critical)
  recommendService.timeout = 100ms (fast, optional)

Timeout harus:
  - Set secara eksplisit untuk setiap external call
  - Dikalibrasi berdasarkan P99 latency normal
  - Dikombinasikan dengan retry logic
  - Dikombinasikan dengan circuit breaker
```



## Circuit Breaker Pattern

Circuit Breaker adalah salah satu pattern paling penting dalam microservices — terinspirasi dari circuit breaker listrik.

```
CIRCUIT BREAKER STATE MACHINE:

         CLOSED (normal)
         ┌──────────────────────────────────────────┐
         │ Semua request diteruskan ke service       │
         │ Error counter: track failure rate         │
         └──────────────────────────────────────────┘
                           │
              failure threshold terlampaui
              (misal: 50% error dalam 10 detik)
                           │
                           ▼
         OPEN (tripped)
         ┌──────────────────────────────────────────┐
         │ SEMUA request langsung gagal (fast fail)  │
         │ Tidak ada request ke service yang gagal   │
         │ Timer dimulai (misal: 30 detik)           │
         └──────────────────────────────────────────┘
                           │
                     timer expired
                           │
                           ▼
         HALF-OPEN (testing)
         ┌──────────────────────────────────────────┐
         │ Izinkan SATU request ke service           │
         │ Jika berhasil → kembali ke CLOSED         │
         │ Jika gagal → kembali ke OPEN              │
         └──────────────────────────────────────────┘
```

### Implementasi Circuit Breaker (Python-style pseudocode)

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=30):
        self.state = "CLOSED"
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.last_failure_time = None
        self.timeout = timeout

    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            # Fast fail — cek apakah sudah waktunya test
            if time.now() - self.last_failure_time > self.timeout:
                self.state = "HALF-OPEN"
            else:
                raise CircuitOpenError("Circuit is open")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _on_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.now()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

### Library Circuit Breaker yang Populer

| Bahasa | Library |
|--------|---------|
| Java | Hystrix (Netflix), Resilience4j |
| Python | pybreaker, circuitbreaker |
| Go | gobreaker, sony/gobreaker |
| Node.js | opossum |
| .NET | Polly |



## Bulkhead Pattern

Bulkhead terinspirasi dari kapal — dinding pemisah yang membagi kapal ke bagian-bagian sehingga jika satu bocor, yang lain tetap aman.

```
TANPA BULKHEAD:
  Shared Thread Pool (200 threads)
  ├── Service A calls
  ├── Service B calls (SLOW!)
  ├── Service B calls (SLOW!)
  ├── Service B calls (SLOW!)
  └── ...
  
  Service B memakan semua thread → Service A tidak dapat thread

DENGAN BULKHEAD:
  Thread Pool Service A (100 threads):
    ├── Service A call 1
    ├── Service A call 2
    └── ...

  Thread Pool Service B (100 threads):
    ├── Service B call 1 (SLOW)
    ├── Service B call 2 (SLOW)
    └── ...
  
  Service B lambat → hanya Thread Pool B yang terpengaruh
  Service A tetap berjalan normal!
```

### Bulkhead Configuration

```
BULKHEAD STRATEGY:

Separate connection pools per downstream service:
  userService: pool=20, queue=10
  orderService: pool=30, queue=20
  reportService: pool=5, queue=5 (non-critical, small pool)

Jika reportService overloaded → hanya 5 threads terdampak
User dan Order service tidak terpengaruh
```



## Caching di Microservices

Caching adalah salah satu cara paling efektif untuk meningkatkan performa dan resilience.

```
CACHING LAYERS:

Client-side caching:
  Browser cache, mobile app cache
  → Mengurangi round-trip ke server

CDN/Reverse Proxy caching:
  NGINX, Cloudflare, Varnish
  → Cache di edge, dekat user
  → Mengurangi load pada origin

Application-level caching:
  Redis, Memcached
  → Cache hasil komputasi mahal
  → Cache hasil database query

Database caching:
  Query cache, connection pool
  → Mengurangi beban database
```

### Caching dan Microservices Resilience

```
CACHING UNTUK RESILIENCE:

Normal operation:
  Request → Service → DB → Cache data → Response

Service/DB down:
  Request → Service (DOWN!) → Stale cache → Response
  
  Taktik: serve dari stale cache daripada error
  "Stale is better than nothing"
```

### Cache Invalidation Strategies

```
STRATEGI INVALIDASI:

1. TTL (Time To Live):
   Set expiry time pada setiap cache entry
   Pro: sederhana
   Con: data bisa stale sebelum TTL expired

2. Cache Aside:
   Read: cek cache dulu, jika miss → query DB → store cache
   Write: update DB, invalidate cache
   Pro: flexible, familiar
   Con: thundering herd problem

3. Write Through:
   Write ke DB DAN cache secara bersamaan
   Pro: data selalu konsisten
   Con: write lebih lambat

4. Event-driven invalidation:
   Service publish "DataUpdated" event
   Cache consumer invalidate entry yang relevan
   Pro: konsisten, decoupled
   Con: eventual consistency
```



## CAP Theorem

Salah satu konsep paling fundamental dalam distributed systems yang wajib dipahami setiap engineer yang bekerja dengan microservices.

```
CAP THEOREM (Brewer's Theorem):

Dalam distributed system, kamu hanya bisa menjamin 2 dari 3:

C = CONSISTENCY
    Setiap node melihat data yang sama pada waktu yang sama
    
A = AVAILABILITY  
    Setiap request mendapat response (bisa stale)
    
P = PARTITION TOLERANCE
    Sistem tetap berjalan meskipun ada network partition

PILIHAN:
  CP: Konsisten + Partition Tolerant
      Korbankan availability (sistem bisa error saat partition)
      Contoh: HBase, MongoDB (default config), etcd, Zookeeper

  AP: Available + Partition Tolerant
      Korbankan consistency (data mungkin stale sementara)
      Contoh: CouchDB, Cassandra, DynamoDB

  CA: Consistent + Available
      Tidak partition tolerant
      Hanya feasible di single-node atau LAN tanpa partitions
      Contoh: Traditional RDBMS (PostgreSQL, MySQL)
```

### Implikasi untuk Microservices

```
PRACTICAL IMPLICATIONS:

"Di production, network partition AKAN terjadi"
→ P (Partition Tolerance) hampir selalu required
→ Pilihan nyata: CP atau AP

BANKING/FINANCIAL (CP preferred):
  "Saldo harus akurat" > "Selalu tersedia"
  Boleh error jika tidak bisa consistent

SOCIAL MEDIA (AP preferred):
  "Like count mungkin tidak real-time" < "Selalu bisa diakses"
  Stale data lebih baik dari error

TRADING SYSTEM (depends):
  Order placement → CP (must be consistent)
  Market data → AP (staleness acceptable)
```

### PACELC Extension

PACELC memperluas CAP dengan mempertimbangkan latency:

```
PACELC:

P: Partition
A: Availability
C: Consistency
E: Else (saat tidak ada partition)
L: Latency
C: Consistency

Ketika ada partition: pilih antara A dan C (seperti CAP)
Ketika tidak ada partition: pilih antara L (latency) dan C (consistency)

Contoh:
  MySQL (master-slave): PA/EL → available saat partition, low latency saat normal
  PostgreSQL (sync): PC/EC → consistent saat partition, consistent saat normal
  Cassandra: PA/EL → available dan low latency
```



## Service Discovery

Dalam microservices, service bisa di-deploy ke mana saja dan bisa berpindah-pindah. Bagaimana service A tahu alamat service B?

```
MASALAH SERVICE DISCOVERY:

Environment lama (monolith):
  Database ada di db.internal.company.com (static)
  Konfigurasi di hardcode atau config file

Environment microservices:
  Payment Service Instance 1: 10.0.1.5:8080
  Payment Service Instance 2: 10.0.1.8:8080
  Payment Service Instance 3: 10.0.2.3:8080
  ...Instance bisa naik/turun kapan saja...

  Bagaimana Order Service tahu endpoint Payment Service?
```

### Service Discovery Patterns

**Client-Side Discovery:**

```
CLIENT-SIDE DISCOVERY:

Order Service
  → Query Service Registry: "Di mana Payment Service?"
  → Registry jawab: [10.0.1.5:8080, 10.0.1.8:8080, 10.0.2.3:8080]
  → Order Service pilih salah satu (load balancing client-side)
  → Order Service call langsung ke instance

Tools: Netflix Eureka, Consul, etcd
```

**Server-Side Discovery:**

```
SERVER-SIDE DISCOVERY:

Order Service
  → Kirim request ke Load Balancer: "Butuh Payment Service"
  → Load Balancer query registry
  → Load Balancer forward ke instance yang tepat

Tools: AWS ALB, NGINX Plus, HAProxy + Consul
```



## Load Balancing

Load balancing mendistribusikan traffic ke multiple instances service.

```
LOAD BALANCING ALGORITHMS:

1. ROUND ROBIN:
   Request 1 → Instance 1
   Request 2 → Instance 2
   Request 3 → Instance 3
   Request 4 → Instance 1 (kembali dari awal)
   Pro: sederhana, merata
   Con: tidak mempertimbangkan beban aktual

2. LEAST CONNECTIONS:
   Kirim ke instance dengan jumlah connection aktif paling sedikit
   Pro: lebih cerdas dari round robin
   Con: sedikit overhead untuk tracking

3. WEIGHTED ROUND ROBIN:
   Instance 1 (kuat): weight 3 → dapat 3 request
   Instance 2 (lemah): weight 1 → dapat 1 request
   Pro: sesuai kapasitas server

4. IP HASH:
   Hash IP client → instance tertentu
   Sama client selalu ke instance yang sama
   Pro: session affinity
   Con: tidak balance jika sedikit client besar

5. RANDOM:
   Pilih instance secara random
   Pro: sederhana, tidak perlu state
   Con: bisa tidak merata
```



## API Documentation Tools

Dokumentasi API yang baik adalah faktor penentu adoption. Sam Newman membahas dua tools:

### Swagger / OpenAPI

```
SWAGGER/OPENAPI WORKFLOW:

1. Tulis API definition (YAML/JSON):
   openapi: 3.0.0
   paths:
     /customers/{id}:
       get:
         summary: Get customer by ID
         parameters:
           - name: id
             in: path
             required: true
             schema:
               type: integer
         responses:
           '200':
             description: Customer found
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/Customer'

2. Generate interactive UI:
   → Swagger UI: beautiful web interface
   → Execute requests langsung dari browser
   → API explorer untuk developer

3. Generate client code:
   → Swagger Codegen → client SDK otomatis
   → Tersedia untuk 40+ bahasa
```

### HAL (Hypertext Application Language)

```
HAL FORMAT:

GET /customers/123
{
  "id": 123,
  "name": "Rifky Awalul",
  "email": "rifky@example.com",
  "_links": {
    "self": {
      "href": "/customers/123"
    },
    "orders": {
      "href": "/customers/123/orders"
    },
    "curies": [{
      "name": "ea",
      "href": "http://example.com/docs/rels/{rel}",
      "templated": true
    }]
  },
  "_embedded": {
    "ea:address": {
      "city": "Jakarta",
      "_links": {"self": {"href": "/customers/123/address"}}
    }
  }
}
```

**Rekomendasi Sam Newman:**

> *"If you're already using hypermedia controls, my recommendation is to go with HAL over Swagger. But if you're not using hypermedia, Swagger provides a great way to document your APIs."*



## Ringkasan Seri Building Microservices

Tiga artikel seri ini merangkum buku Sam Newman (Preview Edition NGINX):

| Artikel | Chapter | Topik |
|---------|---------|-------|
| 1 | Ch. 1 | Definisi, manfaat, SOA vs MS, Conway's Law, migration |
| 2 | Ch. 2 | Integrasi: REST, RPC, event, versioning, strangler |
| 3 | Ch. 3 | Scale: failure, circuit breaker, caching, CAP, discovery |

### 10 Prinsip Utama Building Microservices

```
1. Small & focused: satu service, satu domain bisnis
2. Autonomous: deploy, scale, develop secara independen
3. Database per service: tidak berbagi database
4. Smart endpoints, dumb pipes: logic di service bukan middleware
5. Design for failure: assume everything will fail
6. Degrade gracefully: partial function > total failure
7. Circuit breaker: fast fail, prevent cascade failure
8. Choreography over orchestration: loose coupling
9. Semantic versioning: backward compatibility
10. Strangler pattern: incremental migration
```



**Sumber:** Sam Newman, *Building Microservices* (2015), O'Reilly Media. Preview Edition sponsored by NGINX. [nginx.com](https://nginx.com) | [samNewman.net](https://samnewman.io)
