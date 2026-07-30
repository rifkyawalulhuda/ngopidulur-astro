---
title: "Spring Boot Actuator: Monitoring dan Manajemen Production"
description: Kuasai Spring Boot Actuator untuk production readiness - endpoints
  health, metrics, info, trace, dump, env, beans, Actuator security, kustomisasi
  health indicator, dan integrasi dengan Micrometer serta Spring Boot Admin.
pubDate: 2026-08-22T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Actuator
  - Monitoring
  - Java
---

Aplikasi di production adalah kotak hitam — tanpa visibility yang tepat, kamu tidak akan tahu ada masalah sampai pengguna komplain. Spring Boot Actuator menyediakan "jendela" ke dalam aplikasi yang sedang berjalan: health checks, metrics, log levels, thread dumps, dan masih banyak lagi. Chapter 7 dari *Spring Boot in Action* membahas Actuator secara mendalam.

## Daftar Isi

- [Menambahkan Actuator ke Project](#menambahkan-actuator-ke-project)
- [Endpoint Actuator Lengkap](#endpoint-actuator-lengkap)
- [Health Endpoint](#health-endpoint)
- [Metrics Endpoint](#metrics-endpoint)
- [Konfigurasi dan Security Actuator](#konfigurasi-dan-security-actuator)
- [Custom Health Indicator](#custom-health-indicator)
- [Custom Metrics dengan MeterRegistry](#custom-metrics-dengan-meterregistry)
- [Custom Info Contributor](#custom-info-contributor)
- [Integrasi Monitoring Eksternal](#integrasi-monitoring-eksternal)
- [Spring Boot Admin](#spring-boot-admin)



## Menambahkan Actuator ke Project

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```groovy
// build.gradle
implementation "org.springframework.boot:spring-boot-starter-actuator"
```

Setelah ditambahkan, akses: `http://localhost:8080/actuator`



## Endpoint Actuator Lengkap

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/actuator/health` | GET | Status health aplikasi dan dependencies |
| `/actuator/info` | GET | Info aplikasi (versi, build, git) |
| `/actuator/metrics` | GET | List semua metric yang tersedia |
| `/actuator/metrics/{name}` | GET | Detail metric tertentu |
| `/actuator/env` | GET | Semua environment properties |
| `/actuator/env/{key}` | GET | Value property tertentu |
| `/actuator/beans` | GET | Semua Spring beans yang terdaftar |
| `/actuator/mappings` | GET | Semua URL mappings (@RequestMapping) |
| `/actuator/loggers` | GET | Log level semua logger |
| `/actuator/loggers/{name}` | POST | Ubah log level saat runtime |
| `/actuator/httptrace` | GET | 100 HTTP request/response terakhir |
| `/actuator/threaddump` | GET | Thread dump JVM |
| `/actuator/heapdump` | GET | Heap dump (download file) |
| `/actuator/scheduledtasks` | GET | Scheduled tasks yang terdaftar |
| `/actuator/caches` | GET | Cache yang tersedia |
| `/actuator/shutdown` | POST | Shutdown aplikasi (disabled by default) |



## Health Endpoint

```bash
# Basic health check
curl http://localhost:8080/actuator/health
# {"status":"UP"}

# Dengan detail (butuh konfigurasi)
curl http://localhost:8080/actuator/health
# {
#   "status": "UP",
#   "components": {
#     "db": {"status": "UP", "details": {"database": "PostgreSQL", "validationQuery": "isValid()"}},
#     "diskSpace": {"status": "UP", "details": {"total": 500GB, "free": 250GB}},
#     "redis": {"status": "UP"},
#     "externalApi": {"status": "UP"}
#   }
# }
```

```yaml
# application.yml - tampilkan detail health
management:
  endpoint:
    health:
      show-details: always       # always | when-authorized | never
      show-components: always
  health:
    defaults:
      enabled: true
    diskspace:
      enabled: true
      threshold: 10485760  # 10 MB minimum free
```

### Status Health

| Status | Kode HTTP | Arti |
|---|---|---|
| `UP` | 200 | Semua komponen normal |
| `DOWN` | 503 | Ada komponen gagal |
| `OUT_OF_SERVICE` | 503 | Sengaja dinonaktifkan |
| `UNKNOWN` | 200 | Status tidak dapat ditentukan |



## Metrics Endpoint

```bash
# List semua metrics
curl http://localhost:8080/actuator/metrics
# {"names":["jvm.memory.used","jvm.gc.pause","http.server.requests",...]}

# Detail metric tertentu
curl http://localhost:8080/actuator/metrics/http.server.requests
# {
#   "name": "http.server.requests",
#   "measurements": [
#     {"statistic": "COUNT", "value": 150},
#     {"statistic": "TOTAL_TIME", "value": 12.5},
#     {"statistic": "MAX", "value": 0.85}
#   ],
#   "availableTags": [
#     {"tag": "uri", "values": ["/api/books", "/actuator/health"]},
#     {"tag": "method", "values": ["GET", "POST"]},
#     {"tag": "status", "values": ["200", "404"]}
#   ]
# }

# Filter dengan tag
curl "http://localhost:8080/actuator/metrics/http.server.requests?tag=uri:/api/books&tag=status:200"
```

### Metrics Penting

```bash
# JVM Memory
curl .../metrics/jvm.memory.used?tag=area:heap
curl .../metrics/jvm.memory.max?tag=area:heap

# CPU
curl .../metrics/system.cpu.usage
curl .../metrics/process.cpu.usage

# Database connection pool (HikariCP)
curl .../metrics/hikaricp.connections.active
curl .../metrics/hikaricp.connections.pending

# HTTP
curl .../metrics/http.server.requests?tag=status:500
curl .../metrics/http.server.requests?tag=uri:/api/books

# Garbage Collection
curl .../metrics/jvm.gc.pause?tag=action:end\ of\ minor\ GC
```



## Konfigurasi dan Security Actuator

### Expose Endpoints

```yaml
# application.yml
management:
  server:
    port: 8081        # port terpisah untuk actuator
    address: 127.0.0.1  # hanya akses lokal
  endpoints:
    web:
      exposure:
        include: "health,info,metrics,loggers"  # whitelist
        # include: "*"  # semua (tidak untuk production!)
        exclude: "shutdown,heapdump"
      base-path: /management  # ganti dari /actuator
    jmx:
      exposure:
        include: "*"
  endpoint:
    shutdown:
      enabled: true   # enable shutdown endpoint (hati-hati!)
    health:
      show-details: when-authorized
      roles: ACTUATOR_ADMIN
```

### Amankan Actuator dengan Spring Security

```java
@Configuration
public class ActuatorSecurityConfig {

    @Bean
    @Order(1)  // prioritas lebih tinggi dari app security
    public SecurityFilterChain actuatorSecurityChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/actuator/**").hasRole("ACTUATOR_ADMIN")
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
```

```yaml
# application.yml - credentials actuator
spring:
  security:
    user:
      name: actuator
      password: "${ACTUATOR_PASSWORD}"
      roles: ACTUATOR_ADMIN
```

### Ubah Log Level Saat Runtime

```bash
# Lihat log level saat ini
curl http://localhost:8080/actuator/loggers/com.example

# Ubah ke DEBUG tanpa restart!
curl -X POST http://localhost:8080/actuator/loggers/com.example   -H "Content-Type: application/json"   -d '{"configuredLevel": "DEBUG"}'

# Reset ke default
curl -X POST http://localhost:8080/actuator/loggers/com.example   -H "Content-Type: application/json"   -d '{"configuredLevel": null}'
```



## Custom Health Indicator

```java
@Component
public class BookApiHealthIndicator implements HealthIndicator {

    private final BookApiClient bookApiClient;

    public BookApiHealthIndicator(BookApiClient bookApiClient) {
        this.bookApiClient = bookApiClient;
    }

    @Override
    public Health health() {
        try {
            // Coba koneksi ke external API
            ResponseEntity<String> response = bookApiClient.ping();

            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                    .withDetail("api", "Book API")
                    .withDetail("status", "reachable")
                    .withDetail("responseTime", "< 500ms")
                    .build();
            } else {
                return Health.down()
                    .withDetail("api", "Book API")
                    .withDetail("statusCode", response.getStatusCodeValue())
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("api", "Book API")
                .withDetail("error", e.getMessage())
                .withException(e)
                .build();
        }
    }
}

// Composite Health Indicator
@Component
public class DatabaseHealthIndicator extends AbstractHealthIndicator {

    private final DataSource dataSource;

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement("SELECT 1");
            stmt.executeQuery();
            builder.up()
                .withDetail("database", "Connected")
                .withDetail("product", conn.getMetaData().getDatabaseProductName())
                .withDetail("version", conn.getMetaData().getDatabaseProductVersion());
        }
    }
}
```



## Custom Metrics dengan MeterRegistry

```java
@Service
public class BookService {

    private final BookRepository bookRepository;
    private final MeterRegistry meterRegistry;
    private final Counter bookAddedCounter;
    private final Timer bookSearchTimer;

    public BookService(BookRepository bookRepository, MeterRegistry meterRegistry) {
        this.bookRepository = bookRepository;
        this.meterRegistry = meterRegistry;

        // Counter: increment saat buku ditambahkan
        this.bookAddedCounter = Counter.builder("books.added")
            .description("Jumlah buku yang ditambahkan")
            .tag("source", "web")
            .register(meterRegistry);

        // Timer: ukur berapa lama operasi search
        this.bookSearchTimer = Timer.builder("books.search.duration")
            .description("Durasi pencarian buku")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(meterRegistry);
    }

    public Book addBook(Book book) {
        Book saved = bookRepository.save(book);
        bookAddedCounter.increment();  // tambah counter
        return saved;
    }

    public List<Book> searchBooks(String query) {
        return bookSearchTimer.record(() ->  // ukur waktu eksekusi
            bookRepository.findByTitleContaining(query)
        );
    }

    // Gauge: value yang berubah-ubah (seperti queue size)
    @PostConstruct
    public void registerGauges() {
        Gauge.builder("books.total.count", bookRepository, r -> r.count())
            .description("Total buku di database")
            .register(meterRegistry);
    }
}
```



## Custom Info Contributor

```java
@Component
public class AppInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("app", Map.of(
            "name", "Reading List",
            "description", "Manage your reading list",
            "version", "1.0.0"
        ));

        builder.withDetail("author", Map.of(
            "name", "Craig Walls",
            "email", "craig@example.com"
        ));
    }
}
```

```yaml
# application.yml - info dari properties
info:
  app:
    name: "@project.name@"
    version: "@project.version@"
    build-time: "@maven.build.timestamp@"
  java:
    version: "@java.version@"
```



## Integrasi Monitoring Eksternal

### Prometheus + Grafana

```xml
<!-- Tambahkan Micrometer Prometheus registry -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus,health,info
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: reading-list
      environment: production
```

```yaml
# prometheus.yml - konfigurasi scraping
scrape_configs:
  - job_name: "spring-boot-app"
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ["localhost:8080"]
    scrape_interval: 15s
```

### Grafana Dashboard

Import dashboard ID **4701** dari grafana.com — ini adalah Spring Boot Statistics dashboard yang sudah include JVM metrics, HTTP metrics, database metrics, dan custom metrics.



## Spring Boot Admin

Spring Boot Admin adalah UI berbasis web untuk monitoring banyak aplikasi Spring Boot sekaligus.

```xml
<!-- Server (aplikasi admin terpisah) -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
    <version>3.2.0</version>
</dependency>
```

```java
@SpringBootApplication
@EnableAdminServer
public class AdminServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminServerApplication.class, args);
    }
}
```

```xml
<!-- Client (tambahkan ke setiap app yang ingin dimonitor) -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>3.2.0</version>
</dependency>
```

```yaml
# application.yml di app client
spring:
  boot:
    admin:
      client:
        url: http://admin-server:8090
        username: admin
        password: adminpass
management:
  endpoints:
    web:
      exposure:
        include: "*"
```



## Ringkasan

| Kebutuhan | Endpoint/Tool |
|---|---|
| Cek app UP/DOWN | `/actuator/health` |
| Lihat JVM memory | `/actuator/metrics/jvm.memory.used` |
| Debug log level | `POST /actuator/loggers/{name}` |
| Lihat semua beans | `/actuator/beans` |
| HTTP request stats | `/actuator/metrics/http.server.requests` |
| Prometheus metrics | `/actuator/prometheus` |
| Visual monitoring | Spring Boot Admin |
| Grafana dashboard | Dashboard ID 4701 |



**Sumber:** Craig Walls, *Spring Boot in Action* (2016), Manning Publications.
