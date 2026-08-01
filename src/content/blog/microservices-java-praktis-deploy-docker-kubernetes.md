---
title: "Deploy Microservices Java: Docker, Kubernetes, Failover, Load Balancing"
description: Panduan deploy microservices Java dari buku James Cross - immutable
  delivery, Docker container, Kubernetes pods services replication, OpenShift,
  cluster management, self-healing, circuit breaker, bulkhead, load balancing.
pubDate: 2026-10-04T08:00:00.000Z
image: /image/microservices-java-praktis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Docker
  - Kubernetes
  - DevOps
  - Microservices
series: "Microservices Java Praktis"
seriesOrder: 3
---

Membangun microservices dengan Spring Boot, Dropwizard, atau WildFly Swarm hanyalah langkah awal. Tantangan sebenarnya ada di **deployment**: bagaimana menjalankan puluhan service secara konsisten, mengelola kegagalan, dan menyeimbangkan beban. Buku James Cross membahas ini melalui Docker, Kubernetes, dan pola cluster management.

## Daftar Isi

- [Immutable Delivery](#immutable-delivery)
- [Docker, Docker, Docker](#docker-docker-docker)
- [Kubernetes: Orkestrasi Container](#kubernetes-orkestrasi-container)
- [Pods, Labels, Replication Controllers, Services](#pods-labels-replication-controllers-services)
- [Microservices dan Linux Containers](#microservices-dan-linux-containers)
- [OpenShift dan Container Development Kit](#openshift-dan-container-development-kit)
- [Fault Tolerance: Self-Healing Cluster](#fault-tolerance-self-healing-cluster)
- [Circuit Breaker Pattern](#circuit-breaker-pattern)
- [Bulkhead Pattern](#bulkhead-pattern)
- [Load Balancing](#load-balancing)
- [Where Do We Go from Here?](#where-do-we-go-from-here)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Immutable Delivery

**Immutable delivery** adalah prinsip bahwa artifact yang di-deploy **tidak boleh diubah setelah dibuat**. Jika perlu perubahan, build artifact baru dan deploy ulang — bukan patch di tempat.

```dockerfile
# Dockerfile — immutable image
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Keuntungan immutable delivery:
- **Reproducible** — artifact yang sama selalu berperilaku sama
- **Rollback mudah** — deploy versi lama = rollback
- **No configuration drift** — environment tidak bisa "berubah" diam-diam
- **Testing lebih reliable** — apa yang ditest adalah apa yang di-deploy

## Docker, Docker, Docker

Docker menyediakan **container** — lingkungan terisolasi untuk menjalankan aplikasi:

- **Image** — blueprint aplikasi (read-only template)
- **Container** — instance berjalan dari image
- **Dockerfile** — recipe untuk membangun image
- **Registry** — tempat menyimpan image (Docker Hub, Quay, dll.)

```bash
# Build image
docker build -t hello-service:1.0.0 .

# Run container
docker run -p 8080:8080 hello-service:1.0.0

# Push ke registry
docker tag hello-service:1.0.0 registry.example.com/hello-service:1.0.0
docker push registry.example.com/hello-service:1.0.0
```

### Kenapa Container untuk Microservices?

- **Isolasi** — setiap service berjalan mandiri, library tidak bentrok
- **Portability** — jalan sama di laptop developer dan production
- **Efisiensi** — lebih ringan dari VM (share OS kernel)
- **Scaling cepat** — start container dalam detik
- **Consistency** — dev, staging, production identik

## Kubernetes: Orkestrasi Container

Kubernetes (K8s) adalah **container orchestrator** — platform untuk mengelola container di banyak host:

- **Cluster** — kumpulan node (worker machines)
- **Master** — kontrol plane yang mengelola cluster
- **Node** — worker yang menjalankan container
- **kubectl** — CLI untuk berinteraksi dengan cluster

```bash
# Apply manifest
kubectl apply -f deployment.yaml

# Lihat status
kubectl get pods
kubectl get services

# Scale
kubectl scale deployment hello-service --replicas=5

# Logs
kubectl logs -f deployment/hello-service
```

## Pods, Labels, Replication Controllers, Services

### Pods

**Pod** adalah unit deployment terkecil di Kubernetes — satu atau lebih container yang berbagi network namespace dan storage:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-service-pod
spec:
  containers:
    - name: hello-service
      image: registry.example.com/hello-service:1.0.0
      ports:
        - containerPort: 8080
```

### Labels

**Labels** adalah key-value pairs untuk mengorganisir dan memilih resources:

```yaml
metadata:
  labels:
    app: hello-service
    version: "1.0.0"
    tier: backend
```

Selector memungkinkan operasi pada group resources:

```bash
kubectl get pods -l app=hello-service
```

### Replication Controllers

**Replication Controller (RC)** memastikan jumlah pod tertentu selalu berjalan. Jika pod mati, RC membuat yang baru:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: hello-service-rc
spec:
  replicas: 3
  selector:
    app: hello-service
  template:
    metadata:
      labels:
        app: hello-service
    spec:
      containers:
        - name: hello-service
          image: registry.example.com/hello-service:1.0.0
          ports:
            - containerPort: 8080
```

> **Catatan:** ReplicationController kini digantikan oleh **ReplicaSet + Deployment** yang lebih powerful (rolling updates, rollback).

### Services

**Service** adalah abstraksi yang menyediakan akses stabil ke sekelompok pods — load balancer internal:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-service
spec:
  selector:
    app: hello-service
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP  # default — internal access
```

Tipe service:
- **ClusterIP** — akses internal cluster
- **NodePort** — expose ke luar via node port
- **LoadBalancer** — cloud load balancer (AWS ELB, GCP LB)

## Microservices dan Linux Containers

Linux containers adalah teknologi dasar Docker dan Kubernetes:

- **Namespaces** — isolasi proses (PID, network, mount, user)
- **cgroups** — kontrol resource (CPU, memory, I/O)
- **OverlayFS** — layered filesystem untuk image sharing

```yaml
# Resource limits di Kubernetes
spec:
  containers:
    - name: hello-service
      image: registry.example.com/hello-service:1.0.0
      resources:
        requests:
          memory: "256Mi"
          cpu: "250m"
        limits:
          memory: "512Mi"
          cpu: "500m"
```

## OpenShift dan Container Development Kit

**OpenShift** adalah Kubernetes enterprise dari Red Hat:

- **Kubernetes +** tambahan enterprise: build automation, image registry, route (Ingress), web console
- **S2I (Source-to-Image)** — build image langsung dari source code
- **RBAC** — role-based access control untuk multi-tenant
- **Integrated CI/CD** — pipeline, webhooks

**CDK (Container Development Kit)** adalah tool untuk menjalankan OpenShift lokal di developer machine (via Minishift/Vagrant) — memungkinkan development dan testing cluster lokal.

## Fault Tolerance: Self-Healing Cluster

### Cluster Self-Healing

Kubernetes menyediakan self-healing bawaan:

- **Restart** — container crash otomatis di-restart
- **Reschedule** — pod di node yang gagal dipindah ke node sehat
- **Replace** — replika yang mati diganti otomatis
- **Health checks** — probe menentukan pod sehat atau tidak

```yaml
spec:
  containers:
    - name: hello-service
      image: registry.example.com/hello-service:1.0.0
      livenessProbe:
        httpGet:
          path: /actuator/health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /actuator/health/readiness
          port: 8080
        periodSeconds: 5
```

- **Liveness probe** — jika gagal, container di-restart
- **Readiness probe** — jika gagal, pod dihapus dari Service (tidak terima traffic)

## Circuit Breaker Pattern

**Circuit breaker** melindungi service dari kegagalan berantai (cascading failures). Mirip saklar listrik: jika arus bermasalah, putuskan sirkuit.

### Tiga State

1. **CLOSED** — request diteruskan normal. Error counter di-track
2. **OPEN** — jika failure rate melebihi threshold, sirkuit terbuka. Request langsung gagal (fail fast), timer dimulai
3. **HALF-OPEN** — setelah cooldown, izinkan sejumlah kecil request untuk menguji apakah service pulih. Sukses → CLOSED, gagal → OPEN lagi

### Implementasi dengan Netflix Hystrix

```java
@HystrixCommand(fallbackMethod = "getUserFallback")
public User getUser(Long userId) {
    return userServiceClient.getUser(userId);
}

public User getUserFallback(Long userId) {
    return new User(userId, "Unknown", "fallback@example.com");
}
```

### Implementasi dengan Resilience4j

```java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .slidingWindowSize(10)
    .build();

CircuitBreaker circuitBreaker = CircuitBreaker.of("userService", config);

Supplier<User> decorated = CircuitBreaker.decorateSupplier(
    circuitBreaker, () -> userServiceClient.getUser(1L)
);

User user = Try.ofSupplier(decorated)
    .recover(ex -> new User(1L, "Fallback", "unknown@example.com"))
    .get();
```

## Bulkhead Pattern

**Bulkhead** (sekat kapal) mengisolasi kegagalan per dependency — seperti kompartemen kapal: jika satu bocor, kapal tidak tenggelam.

### Tanpa Bulkhead

Semua service call berbagi satu thread pool. Jika satu service lambat, threads habis dan semua service call ikut terblokir.

### Dengan Bulkhead

Setiap service call punya thread pool terpisah:

```java
// ExecutorService per dependency
ExecutorService userServicePool = Executors.newFixedThreadPool(10);
ExecutorService orderServicePool = Executors.newFixedThreadPool(10);
```

Dengan Hystrix:

```java
@HystrixCommand(
    groupKey = "UserGroup",
    commandKey = "GetUser",
    threadPoolKey = "UserPool",
    threadPoolProperties = {
        @HystrixProperty(name = "coreSize", value = "10"),
        @HystrixProperty(name = "maxQueueSize", value = "100")
    }
)
public User getUser(Long userId) {
    return userServiceClient.getUser(userId);
}
```

Dengan Resilience4j:

```java
BulkheadConfig bulkheadConfig = BulkheadConfig.custom()
    .maxConcurrentCalls(10)
    .maxWaitDuration(Duration.ofMillis(500))
    .build();

Bulkhead bulkhead = Bulkhead.of("userService", bulkheadConfig);
```

Manfaat: service yang lambat hanya menghabiskan pool-nya sendiri — service lain tetap responsif.

## Load Balancing

### Kubernetes Load Balancing

Kubernetes Service secara otomatis menyeimbangkan beban antar pods:

```bash
# 3 replika service
kubectl scale deployment hello-service --replicas=3

# Service mendistribusikan traffic ke ketiga pods
kubectl get endpoints hello-service
```

Kubernetes melakukan **round-robin** di level kube-proxy — request dibagi merata antar pods.

### Client-Side Load Balancing

Di sisi aplikasi, client-side load balancing (Netflix Ribbon / Spring Cloud LoadBalancer) memberi kontrol lebih:

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// Panggil service by name — bukan IP
String url = "http://user-service/api/users/" + userId;
User user = restTemplate.getForObject(url, User.class);
```

Keuntungan client-side LB:
- Load balancing + service discovery dalam satu library
- Custom rules (weighted, availability-based)
- Retry per instance

Kapan butuh client-side LB? Saat traffic internal sangat tinggi dan membutuhkan kontrol granular, atau saat belum pakai Kubernetes (service discovery manual dengan Eureka/Consul).

## Where Do We Go from Here?

Buku diakhiri dengan topik penting yang tidak tercakup detail:

### Configuration

- Externalized configuration — config di luar kode
- **Spring Cloud Config Server** / **etcd** / **Consul KV** — config terpusat
- **Kubernetes ConfigMaps + Secrets** — config native K8s
- Dynamic configuration — reload tanpa restart

### Logging, Metrics, and Tracing

- **Structured logging** — JSON logs dengan correlation ID
- **ELK Stack** (Elasticsearch, Logstash, Kibana) — central log management
- **Prometheus + Grafana** — metrics collection dan dashboard
- **Distributed tracing** — Jaeger, Zipkin, OpenTelemetry
- **Micrometer** — metrics facade untuk Java

### Continuous Delivery

- **CI/CD pipeline** per service — build, test, scan, deploy otomatis
- **Blue-Green deployment** — zero downtime switch
- **Canary release** — rollout bertahap
- **GitOps** — ArgoCD, Flux (Git sebagai source of truth)
- **Feature flags** — toggle fitur di runtime

### Summary

Microservices Java bukan hanya tentang framework — tapi seluruh siklus: develop dengan framework yang tepat, package sebagai container, orchestrate dengan Kubernetes, lindungi dengan circuit breaker dan bulkhead, seimbangkan dengan load balancing, dan kelola dengan observability serta CI/CD.

## Kesimpulan

Deployment microservices di scale membutuhkan kombinasi: **Docker** untuk packaging konsisten, **Kubernetes** untuk orkestrasi dan self-healing, **circuit breaker** dan **bulkhead** untuk fault tolerance, serta **load balancing** untuk distribusi beban.

Kunci keberhasilan: mulai dari **immutable delivery** — build sekali, deploy identik di mana pun, dan percaya pada orkestrator untuk menjaga service tetap hidup.

## Referensi

- Cross, J. (2017). *Microservices for Java Developers*. Red Hat.
- Burns, B., Grant, B., Oppenheimer, D., Brewer, E., & Wilkes, J. (2016). Borg, Omega, and Kubernetes. *ACM Queue, 14*(1), 70-93.
- Nygard, M. (2018). *Release It! Design and Deploy Production-Ready Software* (2nd ed.). Pragmatic Bookshelf.
- Fowler, M. (2014). *Circuit Breaker Pattern*. martinfowler.com.
