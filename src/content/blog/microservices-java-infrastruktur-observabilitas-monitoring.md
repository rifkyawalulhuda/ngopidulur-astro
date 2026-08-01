---
title: "Microservices Infrastruktur: Config, Deploy, Observabilitas"
description: Panduan infrastruktur microservices dari InfoQ - service discovery
  Consul Eureka, API Gateway patterns, Kubernetes deployment, log management
  ELK stack, metrics Prometheus Grafana, distributed tracing Jaeger, monitoring.
pubDate: 2026-09-30T08:00:00.000Z
image: /image/microservices-java-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - Kubernetes
  - Prometheus
  - Observability
series: "Microservices for Java Developers"
seriesOrder: 4
---

Ketika microservices berjalan di production, tantangan sesungguhnya bukan lagi soal kode — tapi infrastruktur. Bagaimana service menemukan satu sama lain? Bagaimana kita tahu kalau sistem bermasalah sebelum user mengeluh? Buku *Microservices for Java Developers* (InfoQ, 2020) membahas topik-topik kritis ini dari konfigurasi, deployment, hingga tiga pilar observabilitas.

## Daftar Isi

- [Konfigurasi, Service Discovery, dan Load Balancing](#konfigurasi-service-discovery-dan-load-balancing)
- [API Gateway dan Aggregator](#api-gateway-dan-aggregator)
- [Deployment dan Orkestrasi dengan Kubernetes](#deployment-dan-orkestrasi-dengan-kubernetes)
- [Log Management](#log-management)
- [Metrics dengan Prometheus dan Grafana](#metrics-dengan-prometheus-dan-grafana)
- [Distributed Tracing](#distributed-tracing)
- [Monitoring dan Alerting](#monitoring-dan-alerting)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Konfigurasi, Service Discovery, dan Load Balancing

### Externalized Configuration

Sesuai prinsip 12-Factor App, konfigurasi harus disimpan di environment — bukan di kode. Ini memungkinkan satu artifact berjalan di semua environment (dev, staging, production) dengan konfigurasi yang berbeda.

**Spring Cloud Config Server** adalah solusi populer untuk Java:

```yaml
# application.yml di config repository
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/orders}
    username: ${DB_USERNAME:orders_user}
    password: ${DB_PASSWORD}
  kafka:
    bootstrap-servers: ${KAFKA_SERVERS:localhost:9092}
```

**Kubernetes ConfigMaps dan Secrets** untuk container-native config:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: order-service-config
data:
  KAFKA_SERVERS: "kafka-service:9092"
  LOG_LEVEL: "INFO"
---
apiVersion: v1
kind: Secret
metadata:
  name: order-service-secrets
type: Opaque
stringData:
  DB_PASSWORD: "secure-password"
  JWT_SECRET: "very-long-jwt-secret"
```

**Consul KV** dan **etcd** adalah opsi distributed key-value store yang mendukung dynamic configuration reload tanpa restart service.

### Service Discovery

Microservices bersifat dynamic — instance naik dan turun kapan saja. Service discovery memungkinkan service menemukan satu sama lain secara otomatis.

**Client-side discovery** (Eureka, Consul):
- Service registrasi ke registry saat startup
- Consumer query registry untuk mendapatkan list instance
- Consumer memilih instance (biasanya round-robin)

```java
// Spring Cloud dengan Eureka
@SpringBootApplication
@EnableEurekaClient
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}

// application.yml
eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka-server:8761/eureka/
  instance:
    preferIpAddress: true
```

**Server-side discovery** (Kubernetes DNS, AWS ALB):
- Service hanya tahu nama service, bukan IP
- Infrastructure yang melakukan routing
- Kubernetes DNS: `order-service.production.svc.cluster.local`

### Load Balancing

- **Envoy** (L7 proxy): advanced load balancing, circuit breaking, observability — komponen inti service mesh Istio
- **NGINX** dan **HAProxy**: battle-tested, high performance, reverse proxy
- **Ribbon** (deprecated): client-side load balancing untuk Spring Cloud, digantikan Spring Cloud LoadBalancer

### Health Checks di Kubernetes

```yaml
# Kubernetes Deployment dengan health probes
spec:
  containers:
    - name: order-service
      image: order-service:1.2.0
      livenessProbe:
        httpGet:
          path: /actuator/health/liveness
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /actuator/health/readiness
          port: 8080
        initialDelaySeconds: 20
        periodSeconds: 5
      startupProbe:
        httpGet:
          path: /actuator/health
          port: 8080
        failureThreshold: 30
        periodSeconds: 10
```

- **Liveness probe**: apakah container masih hidup? Jika gagal, Kubernetes restart container
- **Readiness probe**: apakah container siap terima traffic? Jika gagal, dihapus dari load balancer
- **Startup probe**: untuk aplikasi dengan startup lambat — mencegah liveness probe kill container sebelum siap

## API Gateway dan Aggregator

API Gateway adalah single entry point untuk semua external traffic. Ia menangani cross-cutting concerns yang tidak perlu diimplementasikan di setiap service.

**Tanggung jawab API Gateway:**
- Routing requests ke service yang tepat
- Authentication dan authorization
- Rate limiting dan throttling
- SSL termination
- Request/response transformation
- Caching
- Observability (logging, metrics, tracing)

### Perbandingan API Gateway Tools

| Tool | Kelebihan | Kekurangan | Use Case |
|------|-----------|------------|----------|
| **Kong** | Plugin ekosistem kaya, Lua extensible | Kompleks, resource-heavy | Enterprise, butuh banyak plugin |
| **Traefik** | Cloud-native, auto-discover K8s services | Learning curve | Kubernetes-first environment |
| **NGINX** | Sangat performa, battle-tested | Manual config, tidak dynamic | High-performance needs |
| **AWS API Gateway** | Fully managed, serverless | Vendor lock-in, cost | AWS ecosystem |
| **Azure APIM** | Enterprise features, developer portal | Expensive, complex | Microsoft ecosystem |

### Backend for Frontend (BFF) Pattern

BFF adalah API Gateway khusus per client type. Daripada satu generic API, buat API yang dioptimalkan untuk kebutuhan spesifik:

- **Mobile BFF**: response lebih compact, batch request untuk menghemat bandwidth
- **Web BFF**: rich response dengan aggregasi data
- **Third-party BFF**: API publik dengan versioning ketat

### GraphQL sebagai Aggregator

GraphQL Federation memungkinkan multiple GraphQL service digabungkan menjadi satu supergraph:

```graphql
# Order service schema
type Order @key(fields: "id") {
  id: ID!
  status: OrderStatus!
  customerId: ID!
}

# User service schema
type User @key(fields: "id") {
  id: ID!
  name: String!
  orders: [Order!]! @requires(fields: "id")
}
```

Apollo Federation atau GraphQL Mesh menyatukan semua subgraph menjadi satu endpoint yang consumer dapat query secara unified.

## Deployment dan Orkestrasi dengan Kubernetes

### Docker Best Practices

```dockerfile
# Multi-stage build untuk image yang lebih kecil
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies terlebih dahulu (cache layer)
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Runtime image yang minimal
FROM eclipse-temurin:21-jre-alpine
# Non-root user untuk security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Kubernetes Core Objects

```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
        version: "1.2.0"
    spec:
      containers:
        - name: order-service
          image: registry.company.com/order-service:1.2.0
          ports:
            - containerPort: 8080
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: order-service-secrets
                  key: DB_PASSWORD
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
---
# Service (internal DNS)
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
    - port: 80
      targetPort: 8080
---
# HPA - Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Helm Charts

Helm adalah package manager untuk Kubernetes. Chart structure:

```
order-service/
  Chart.yaml          # metadata chart
  values.yaml         # default values
  templates/
    deployment.yaml   # template menggunakan values
    service.yaml
    ingress.yaml
    hpa.yaml
```

```bash
# Install/upgrade dengan custom values
helm upgrade --install order-service ./charts/order-service \
  --namespace production \
  --set image.tag=1.2.0 \
  --set replicaCount=3 \
  --values production-values.yaml
```

### Service Mesh: Istio vs Linkerd

**Istio** — feature-rich tapi kompleks:
- mTLS antar semua service secara otomatis
- Advanced traffic management (weighted routing, fault injection, circuit breaking)
- Detailed observability metrics
- Butuh resources signifikan

**Linkerd** — lightweight dan simple:
- Minimal resource overhead
- mTLS out-of-the-box
- Lebih mudah dioperasikan
- Fitur lebih sedikit dari Istio

## Log Management

### Structured Logging

JSON logging memungkinkan log di-index dan di-query secara efisien:

```java
@Slf4j
@RestController
public class OrderController {

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestHeader("X-Trace-Id") String traceId) {

        MDC.put("traceId", traceId);
        MDC.put("customerId", request.getCustomerId());

        log.info("Creating order",
            kv("itemId", request.getItemId()),
            kv("quantity", request.getQuantity()),
            kv("operation", "create_order"));

        // ... business logic

        log.info("Order created successfully",
            kv("orderId", order.getId()),
            kv("operation", "create_order"),
            kv("durationMs", stopwatch.elapsed(TimeUnit.MILLISECONDS)));

        MDC.clear();
        return ResponseEntity.status(201).body(order);
    }
}
```

Output JSON log yang dihasilkan:
```json
{
  "timestamp": "2026-09-30T08:15:30.123Z",
  "level": "INFO",
  "service": "order-service",
  "traceId": "abc123def456",
  "customerId": "cust-789",
  "message": "Order created successfully",
  "orderId": 1234,
  "operation": "create_order",
  "durationMs": 45
}
```

### ELK Stack

**Elasticsearch + Logstash + Kibana** adalah solusi log management yang paling populer:

- **Elasticsearch**: distributed search engine, menyimpan dan mengindex log
- **Logstash**: pipeline untuk parse, transform, dan kirim log ke Elasticsearch
- **Kibana**: visualisasi dan exploration log
- **Filebeat/Fluent Bit**: lightweight log shipper di setiap node

```yaml
# Fluent Bit DaemonSet di Kubernetes
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    spec:
      containers:
        - name: fluent-bit
          image: fluent/fluent-bit:2.2
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: config
              mountPath: /fluent-bit/etc/
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
```

### Loki + Grafana

Loki adalah alternatif yang lebih ringan dari Elasticsearch — tidak mengindex konten log, hanya label. Sangat cost-efficient untuk volume log tinggi. Integrasi native dengan Grafana untuk unified observability.

## Metrics dengan Prometheus dan Grafana

![Tiga Pilar Observabilitas: Logs, Metrics, Traces](/image/microservices-observability.svg)

### RED dan USE Methods

**RED Method** (untuk services):
- **R**ate: berapa request per second?
- **E**rrors: berapa error rate?
- **D**uration: berapa latency?

**USE Method** (untuk infrastructure/resources):
- **U**tilization: seberapa busy resource tersebut?
- **S**aturation: seberapa banyak work yang antri?
- **E**rrors: ada error di resource tersebut?

### Prometheus

Prometheus menggunakan model pull-based: ia scrape `/metrics` endpoint dari setiap service secara berkala.

**Metric types:**
- **Counter**: nilai yang hanya naik (total requests, total errors)
- **Gauge**: nilai yang bisa naik/turun (memory usage, active connections)
- **Histogram**: distribusi nilai (request duration, payload size)
- **Summary**: mirip histogram tapi pre-calculated quantiles

```java
// Spring Boot dengan Micrometer
@RestController
public class OrderController {

    private final Counter ordersCreated;
    private final Timer orderCreationTimer;

    public OrderController(MeterRegistry registry) {
        this.ordersCreated = Counter.builder("orders.created")
            .tag("service", "order-service")
            .description("Total orders created")
            .register(registry);

        this.orderCreationTimer = Timer.builder("orders.creation.duration")
            .tag("service", "order-service")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        return orderCreationTimer.record(() -> {
            Order order = orderService.createOrder(request);
            ordersCreated.increment();
            return ResponseEntity.status(201).body(order);
        });
    }
}
```

### PromQL Queries

```promql
# Request rate per service (per minute)
rate(http_requests_total{job="order-service"}[5m]) * 60

# 95th percentile latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))

# Error rate percentage
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# Available memory per pod
(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

### Grafana Dashboard

Grafana menyediakan visualisasi rich untuk metrics Prometheus. Best practices:
- Gunakan variabel untuk filter per service, namespace, environment
- Row per RED/USE component
- Alert threshold yang visible di panel
- Annotations untuk deployment events

## Distributed Tracing

### Mengapa Tracing Penting?

Dalam microservices, single user request bisa melewati 10+ service. Ketika ada latency atau error, tanpa tracing sulit mengetahui di mana masalahnya. Distributed tracing memvisualisasikan perjalanan request dari ujung ke ujung.

Konsep utama:
- **Trace**: satu request dari awal sampai akhir
- **Span**: satu unit kerja dalam trace (HTTP call, database query)
- **Context Propagation**: trace ID yang dibawa di setiap request header

### OpenTelemetry

OpenTelemetry (OTel) adalah standard terbuka untuk observability signals — traces, metrics, dan logs. Vendor-neutral:

```java
// Auto-instrumentation dengan Spring Boot
@SpringBootApplication
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

```bash
# Jalankan dengan OTel Java agent
java -javaagent:opentelemetry-javaagent.jar \
     -Dotel.service.name=order-service \
     -Dotel.exporter.otlp.endpoint=http://otel-collector:4317 \
     -jar app.jar
```

W3C Trace Context standard menggunakan header `traceparent`:
```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^^ version  ^^ trace-id (128-bit)         ^^ span-id    ^^ flags
```

### Perbandingan Distributed Tracing Tools

| Tool | Kelebihan | Kekurangan | Best For |
|------|-----------|------------|----------|
| **Jaeger** | Native OTel support, great UI, sampling flexible | Resource-intensive di scale | Kubernetes-native, OTel first |
| **Zipkin** | Ringan, simple, B3 propagation | UI lebih sederhana | Simple deployments |
| **Apache SkyWalking** | APM lengkap, topology visualization | Kompleks setup | Java-heavy shops, APM needs |

### Sampling Strategies

Menyimpan 100% trace sangat mahal di scale tinggi:

- **Head-based sampling**: keputusan sampling di awal request (probabilistic: 10%)
- **Tail-based sampling**: keputusan setelah request selesai — prioritaskan traces yang lambat atau error
- **Adaptive sampling**: rate sampling otomatis berdasarkan volume

## Monitoring dan Alerting

### Monitoring Philosophy

Aturan utama: **monitor symptoms, bukan causes**.

Symptom (user impact): "checkout page error rate 5%" — ini yang harus trigger alert.

Cause (internal): "database CPU 90%" — ini hanya relevan jika menyebabkan symptom. Terlalu banyak infrastructure alerts menyebabkan alert fatigue.

### SLI, SLO, dan SLA

- **SLI (Service Level Indicator)**: metric yang mengukur service behavior. Contoh: availability %, request latency p99, error rate
- **SLO (Service Level Objective)**: target nilai SLI yang disepakati internal. Contoh: availability 99.9%, latency p99 < 500ms
- **SLA (Service Level Agreement)**: kontrak legal dengan customer — pelanggaran SLA ada konsekuensi finansial

**Error Budget** = 100% - SLO target. Jika SLO 99.9% availability, error budget = 0.1% = ~43 menit downtime per bulan.

Error budget digunakan untuk menimbang risk: jika budget masih banyak, tim bebas eksperimen fitur baru. Jika budget hampir habis, fokus ke reliability.

### Prometheus Alertmanager

```yaml
# Alerting rules
groups:
  - name: order-service
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
          service: order-service
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for order-service"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High p95 latency"

      - alert: ServiceDown
        expr: up{job="order-service"} == 0
        for: 1m
        labels:
          severity: critical
```

```yaml
# Alertmanager routing
route:
  receiver: 'slack-critical'
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-warning'

receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<pagerduty-key>'
  - name: 'slack-critical'
    slack_configs:
      - api_url: '<slack-webhook>'
        channel: '#alerts-critical'
```

### Adaptive Alerting

Static threshold sering menghasilkan false positives (traffic pattern berubah seasonally). Adaptive alerting menggunakan machine learning untuk mendeteksi anomali:

- Netflix Atlas: time-series monitoring dengan anomaly detection
- Uber Pyflux: Bayesian time series analysis
- Modern observability platforms (Datadog, New Relic) memiliki built-in ML alerting

## Kesimpulan

Infrastruktur dan observabilitas adalah investasi jangka panjang yang menentukan keberhasilan microservices di production. Tanpa service discovery yang solid, konfigurasi terpusat, deployment yang otomatis, dan tiga pilar observabilitas (logs, metrics, traces) — microservices hanya menjadi distributed monolith yang lebih sulit di-debug.

Kunci sukses: mulai dari yang sederhana (structured logging + basic Prometheus metrics), lalu evolusi sesuai kebutuhan. Jangan over-engineer di awal.

## Referensi

- Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (2016). *Site Reliability Engineering*. O'Reilly Media.
- Burns, B., Grant, B., Oppenheimer, D., Brewer, E., & Wilkes, J. (2016). Borg, Omega, and Kubernetes. *ACM Queue, 14*(1), 70-93.
- Sridharan, C. (2018). *Distributed Systems Observability*. O'Reilly Media.
- OpenTelemetry Authors. (2023). *OpenTelemetry Specification*. opentelemetry.io.
