---
title: "Microservices: Resiliensi, Fallacies of Distributed, Security"
description: Panduan resiliensi microservices dari InfoQ - 8 fallacies of
  distributed computing, circuit breaker, bulkhead, retry, timeout,
  managing secrets, OAuth2, JWT, mTLS, Zero Trust Architecture.
pubDate: 2026-09-28T08:00:00.000Z
image: /image/microservices-java-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - Security
  - Resilience
  - CircuitBreaker
series: "Microservices for Java Developers"
seriesOrder: 2
---

Artikel ini adalah bagian kedua dari seri **Microservices for Java Developers**, berdasarkan InfoQ eMag edisi 2020. Setelah membahas fondasi arsitektur di [bagian pertama](/blog/microservices-java-arsitektur-spring-boot), kali ini kita masuk ke dua tantangan terbesar dalam sistem terdistribusi: **resiliensi** dan **keamanan**.

Menjalankan puluhan microservices berarti menerima kenyataan bahwa kegagalan bukan lagi pengecualian — ia adalah kenormalan. Jaringan bisa putus, layanan tetangga bisa lambat, dan secrets bisa bocor jika tidak dikelola dengan benar. Bagian ini membahas strategi praktis untuk menghadapi semuanya.



## 8 Fallacies of Distributed Computing

Sebelum membahas pola resiliensi, penting untuk memahami mengapa sistem terdistribusi lebih sulit dari yang terlihat. Peter Deutsch dan kolega-koleganya di Sun Microsystems merumuskan delapan asumsi keliru yang sering dibuat developer saat pertama kali membangun sistem terdistribusi.

### Fallacy 1: Jaringan Selalu Dapat Diandalkan

Kenyataannya, packet loss, koneksi terputus, dan timeout adalah kejadian biasa. Kode yang bekerja sempurna di lokal bisa gagal di produksi karena koneksi antar-layanan tidak stabil. Solusinya adalah selalu coding secara defensif: retry logic, circuit breaker, dan idempotency.

### Fallacy 2: Latency Adalah Nol

HTTP call ke layanan lain di jaringan yang sama masih membutuhkan beberapa milidetik. Kalikan ini dengan puluhan hop dalam sebuah request chain, dan hasilnya bisa ratusan milidetik. Desain API yang chatty — banyak panggilan kecil — menjadi musuh performa di microservices.

### Fallacy 3: Bandwidth Tidak Terbatas

Serialisasi payload JSON besar, streaming log, atau transfer data antar-region semua mengonsumsi bandwidth. Pilihan format serialisasi (JSON vs Protobuf vs Avro) dan desain payload yang lean menjadi keputusan arsitektur yang penting.

### Fallacy 4: Jaringan Aman

Komunikasi antar-layanan di dalam cluster bukan berarti aman secara otomatis. Tanpa enkripsi in-transit dan autentikasi mutual, layanan internal bisa disadap atau dipalsukan. Ini adalah alasan utama di balik adopsi mTLS dan Zero Trust Architecture.

### Fallacy 5: Topologi Jaringan Tidak Berubah

Di dunia cloud-native, instance baru di-spin up dan down setiap saat. IP berubah, pod di-reschedule, dan region failover bisa terjadi kapan saja. Service discovery dinamis (Consul, Kubernetes DNS) menjadi kebutuhan, bukan opsional.

### Fallacy 6: Hanya Ada Satu Administrator

Microservices sering dimiliki oleh tim yang berbeda dengan kebijakan deployment dan maintenance yang berbeda. Koordinasi menjadi tantangan, dan dependency antar-tim harus dikelola secara eksplisit melalui contract testing dan API versioning.

### Fallacy 7: Biaya Transport Adalah Nol

Setiap panggilan jaringan memiliki biaya: CPU untuk serialisasi, memori untuk buffering, dan biaya finansial nyata untuk transfer data antar-availability zone atau region di cloud. Desain yang meminimalkan chattiness dan memaksimalkan data locality adalah praktik baik.

### Fallacy 8: Jaringan Homogen

Dalam enterprise nyata, microservices berjalan di berbagai platform: bare metal, VM, container, serverless, bahkan on-premise yang terhubung ke cloud. Protokol, MTU, dan kapabilitas jaringan bervariasi. Abstraksi seperti service mesh (Istio, Linkerd) membantu menyeragamkan behavior.



## Pola Resiliensi Microservices

Memahami fallacies adalah langkah pertama. Langkah berikutnya adalah mengimplementasikan pola-pola resiliensi yang telah terbukti menangani kegagalan dengan elegan.

### Circuit Breaker

Circuit Breaker adalah pola paling ikonik dalam resiliensi microservices, dipopulerkan oleh Michael Nygard dalam bukunya *Release It!*. Idenya sederhana: jika sebuah layanan terus-menerus gagal, hentikan sementara permintaan ke layanan tersebut daripada membiarkan kegagalan menyebar ke seluruh sistem.

Circuit Breaker memiliki tiga state:

**CLOSED** — State normal. Semua request diteruskan ke layanan downstream. Circuit Breaker memantau error rate. Jika error rate melewati threshold yang dikonfigurasi (misalnya 50% dari 10 request terakhir), circuit beralih ke state OPEN.

**OPEN** — Request langsung gagal tanpa menyentuh layanan downstream (fail fast). Ini mencegah cascade failure dan memberi waktu bagi layanan yang bermasalah untuk pulih. Setelah durasi timeout tertentu (misalnya 30 detik), circuit beralih ke HALF-OPEN.

**HALF-OPEN** — Sejumlah kecil request probe dikirim ke layanan downstream untuk mengecek apakah sudah pulih. Jika probe berhasil, circuit kembali ke CLOSED. Jika probe gagal, circuit kembali ke OPEN.

Ilustrasi state machine Circuit Breaker:

![Circuit Breaker State Machine](/image/microservices-circuit-breaker.svg)

Implementasi dengan **Resilience4j** (pengganti Hystrix yang sudah deprecated):

```java
// Konfigurasi Circuit Breaker
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)              // buka circuit jika 50% request gagal
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .permittedNumberOfCallsInHalfOpenState(5)
    .slidingWindowSize(10)
    .build();

CircuitBreakerRegistry registry = CircuitBreakerRegistry.of(config);
CircuitBreaker circuitBreaker = registry.circuitBreaker("paymentService");

// Membungkus pemanggilan layanan
Supplier<Order> decoratedSupplier = CircuitBreaker
    .decorateSupplier(circuitBreaker, () -> paymentServiceClient.processPayment(order));

Try<Order> result = Try.ofSupplier(decoratedSupplier)
    .recover(CallNotPermittedException.class, ex -> fallbackPayment(order));
```

Dengan Spring Boot, konfigurasi bisa dilakukan via `application.yml`:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 30s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
```

### Bulkhead

Pola Bulkhead terinspirasi dari sekat-sekat kapal laut yang mencegah kebocoran di satu kompartemen menyebabkan kapal tenggelam. Dalam microservices, Bulkhead mengisolasi resource (thread pool atau semaphore) untuk setiap dependensi.

Tanpa Bulkhead, jika layanan inventaris lambat dan menghabiskan semua thread, layanan lain seperti katalog produk ikut terpengaruh — padahal tidak ada hubungannya. Dengan Bulkhead, setiap dependensi mendapat jatah thread sendiri.

```java
// Thread pool bulkhead untuk payment service
BulkheadConfig bulkheadConfig = BulkheadConfig.custom()
    .maxConcurrentCalls(10)
    .maxWaitDuration(Duration.ofMillis(100))
    .build();

ThreadPoolBulkheadConfig threadPoolConfig = ThreadPoolBulkheadConfig.custom()
    .maxThreadPoolSize(10)
    .coreThreadPoolSize(5)
    .queueCapacity(100)
    .build();
```

### Retry dengan Exponential Backoff

Beberapa kegagalan bersifat transient — koneksi sesaat terputus, database momentarily unavailable. Retry dengan backoff memberikan kesempatan layanan downstream untuk pulih:

```java
RetryConfig retryConfig = RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofMillis(500))
    .intervalFunction(IntervalFunction.ofExponentialBackoff(500, 2))  // 500ms, 1s, 2s
    .retryExceptions(ConnectException.class, SocketTimeoutException.class)
    .ignoreExceptions(BusinessException.class)  // jangan retry untuk error bisnis
    .build();
```

Catatan penting: retry harus dikombinasikan dengan **idempotency**. Jika request `POST /orders` di-retry, pastikan tidak ada duplikasi order. Gunakan idempotency key di header request.

### Timeout

Timeout adalah pola paling sederhana tapi sering dilupakan. Setiap panggilan ke layanan eksternal harus memiliki timeout yang eksplisit:

```java
// Dengan WebClient Spring
WebClient.builder()
    .baseUrl("http://inventory-service")
    .clientConnector(new ReactorClientHttpConnector(
        HttpClient.create()
            .responseTimeout(Duration.ofSeconds(3))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 1000)
    ))
    .build();
```

Panduan umum: connection timeout lebih pendek dari read timeout. Connection timeout sekitar 1-3 detik, read timeout sesuaikan dengan SLA layanan target (umumnya 3-10 detik).

### Fallback

Fallback mendefinisikan behavior alternatif saat layanan utama gagal. Bisa berupa data dari cache, nilai default, atau response degraded yang masih berguna bagi pengguna:

```java
@CircuitBreaker(name = "recommendationService", fallbackMethod = "getDefaultRecommendations")
public List<Product> getRecommendations(String userId) {
    return recommendationClient.getPersonalized(userId);
}

public List<Product> getDefaultRecommendations(String userId, Exception ex) {
    log.warn("Recommendation service down, returning bestsellers. Cause: {}", ex.getMessage());
    return productRepository.findTop10ByOrderBySalesDesc();
}
```

### Chaos Engineering

Resiliensi tidak bisa hanya diklaim — ia harus diuji. Chaos Engineering adalah praktik menyuntikkan kegagalan secara terkontrol ke sistem produksi untuk menemukan kelemahan sebelum insiden nyata terjadi.

**Chaos Monkey** dari Netflix adalah tool paling terkenal. Ia secara acak mematikan instance di production untuk memastikan sistem tetap beroperasi. Netflix Simian Army mencakup tools lain seperti Latency Monkey (inject latency), Conformity Monkey, dan Security Monkey.

Untuk ekosistem Java/Kubernetes, **Chaos Mesh** dan **Litmus Chaos** adalah alternatif yang lebih modern dengan dukungan Kubernetes-native.

Prinsip chaos engineering:
1. Definisikan *steady state* — metrik yang menunjukkan sistem sehat.
2. Buat hipotesis bahwa steady state akan bertahan saat chaos diinjeksi.
3. Injeksi chaos (latency, error, resource exhaustion).
4. Cari perbedaan antara kondisi kontrol dan eksperimen.
5. Perluas blast radius secara bertahap: mulai dari staging, baru production.



## Hystrix, Resilience4j, dan Sentinel

### Netflix Hystrix

Hystrix adalah library circuit breaker pertama yang dipopulerkan secara luas di ekosistem Java. Dikembangkan oleh Netflix, ia menjadi standar de facto untuk resiliensi Spring Cloud. Namun, **Hystrix resmi masuk maintenance mode sejak 2018** dan tidak lagi aktif dikembangkan.

### Resilience4j

Resilience4j adalah penerus Hystrix yang didesain untuk Java 8+ dengan pendekatan functional programming. Ia modular — kamu hanya menggunakan modul yang dibutuhkan:

- `resilience4j-circuitbreaker` — Circuit Breaker
- `resilience4j-ratelimiter` — Rate Limiter
- `resilience4j-retry` — Retry
- `resilience4j-bulkhead` — Bulkhead (thread pool dan semaphore)
- `resilience4j-timelimiter` — Timeout
- `resilience4j-cache` — Response caching

Integrasi Spring Boot tersedia via `resilience4j-spring-boot3` starter. Semua pola dapat dikombinasikan (compose) menggunakan decorator pattern.

### Alibaba Sentinel

Sentinel adalah alternatif dari Alibaba yang berfokus pada traffic control, circuit breaking, dan system adaptive protection. Populer di ekosistem Spring Cloud Alibaba. Sentinel menyediakan dashboard real-time untuk memonitor dan mengatur rules secara dinamis — keunggulan dibanding Resilience4j yang lebih code-centric.



## Keamanan Microservices

Arsitektur microservices mengubah threat model secara fundamental. Dalam aplikasi monolitik, batas keamanan ada di perimeter (load balancer/API gateway). Dalam microservices, setiap komunikasi antar-layanan adalah permukaan serangan potensial.

### Threat Modeling

Sebelum mengimplementasikan keamanan, lakukan threat modeling menggunakan framework **STRIDE**:

- **S**poofing — berpura-pura menjadi layanan lain
- **T**ampering — memodifikasi data in-transit
- **R**epudiation — menyangkal telah melakukan aksi tertentu
- **I**nformation Disclosure — bocornya data sensitif
- **D**enial of Service — membuat layanan tidak tersedia
- **E**levation of Privilege — mendapatkan akses melebihi yang semestinya

Untuk setiap microservice, identifikasi aset yang dilindungi, entry points, dan trust boundaries.

### Autentikasi: Dari Basic Auth ke OAuth2

#### Basic Authentication

Basic Auth (username:password di-encode Base64 di header `Authorization`) adalah pendekatan paling sederhana, namun tidak cocok untuk microservices karena credentials harus ada di setiap layanan.

#### API Keys

API Keys cocok untuk autentikasi service-to-service yang sederhana. Setiap layanan mendapat key unik. Kelemahannya: key adalah *long-lived secret* yang sulit di-rotate dan rentan bocor.

#### OAuth2

OAuth2 adalah framework otorisasi standar industri. Untuk microservices, dua grant type paling relevan:

**Authorization Code (dengan PKCE)** — Untuk user-facing flows. PKCE (Proof Key for Code Exchange) menggantikan client secret untuk public clients (mobile app, SPA). Flow:

1. Client mengirim authorization request dengan `code_challenge`.
2. Authorization Server mengembalikan `authorization_code`.
3. Client menukar code dengan token, mengirim `code_verifier`.
4. AS memverifikasi hash `code_verifier` cocok dengan `code_challenge`.

**Client Credentials** — Untuk machine-to-machine (M2M). Service A meminta token langsung ke Authorization Server menggunakan `client_id` dan `client_secret`, tanpa user involvement.

```java
// Konfigurasi OAuth2 Client Credentials di Spring Boot
@Configuration
public class OAuth2Config {

    @Bean
    public WebClient inventoryWebClient(OAuth2AuthorizedClientManager authorizedClientManager) {
        ServletOAuth2AuthorizedClientExchangeFilterFunction oauth2Client =
            new ServletOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        oauth2Client.setDefaultClientRegistrationId("inventory-service");

        return WebClient.builder()
            .baseUrl("http://inventory-service")
            .apply(oauth2Client.oauth2Configuration())
            .build();
    }
}
```

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          inventory-service:
            provider: keycloak
            client-id: order-service
            client-secret: ${INVENTORY_CLIENT_SECRET}
            authorization-grant-type: client_credentials
            scope: inventory:read
        provider:
          keycloak:
            token-uri: http://keycloak:8080/realms/myapp/protocol/openid-connect/token
```

#### OpenID Connect (OIDC)

OIDC adalah lapisan identitas di atas OAuth2. Ia menambahkan `id_token` (JWT yang berisi informasi user) ke OAuth2 flow. OIDC adalah standar untuk SSO (Single Sign-On) di microservices.

### JWT: Struktur dan Validasi

JSON Web Token (JWT) adalah format token yang paling umum digunakan dalam microservices. Ia terdiri dari tiga bagian yang dipisahkan titik:

**Header** — Algorithm dan type token:
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload** — Claims (informasi):
```json
{
  "sub": "user-123",
  "iss": "https://auth.myapp.com",
  "aud": "order-service",
  "exp": 1756393600,
  "iat": 1756390000,
  "scope": "orders:write",
  "roles": ["ROLE_USER"]
}
```

**Signature** — HMAC atau RSA signature untuk memverifikasi integritas.

Validasi JWT yang benar harus memeriksa:
1. Signature valid (gunakan public key dari JWKS endpoint)
2. Token belum expired (`exp`)
3. `iss` (issuer) sesuai yang diharapkan
4. `aud` (audience) mencakup service ini
5. `iat` (issued at) masuk akal (tidak dari masa depan)

```java
// Validasi JWT dengan Spring Security Resource Server
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthConverter())
                )
            );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            .withJwkSetUri("http://keycloak:8080/realms/myapp/protocol/openid-connect/certs")
            .build();
    }
}
```

**Hindari menyimpan secrets di JWT payload** — JWT hanya di-sign, bukan di-encrypt (kecuali menggunakan JWE). Siapa saja yang memiliki token dapat membaca payload-nya dengan decode Base64.

### Mutual TLS (mTLS)

TLS standar memvalidasi identitas server ke client. Mutual TLS (mTLS) menambahkan validasi sebaliknya: client juga harus membuktikan identitasnya ke server menggunakan client certificate.

Dalam microservices, ini berarti setiap layanan memiliki sertifikat unik, dan komunikasi antar-layanan hanya diterima jika sertifikat valid dan dipercaya. Ini adalah fondasi dari service mesh security.

Implementasi manual mTLS kompleks, namun service mesh seperti **Istio** dapat mengotomatisasi seluruh lifecycle sertifikat:

```yaml
# Istio PeerAuthentication - wajibkan mTLS di namespace
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
```

### Managing Secrets

Secrets (database passwords, API keys, private keys) adalah salah satu risiko keamanan terbesar dalam microservices. Menyimpannya di environment variables atau file konfigurasi di-commit ke Git adalah praktik buruk.

#### HashiCorp Vault

Vault adalah solusi paling komprehensif untuk secrets management. Fitur utamanya:

- **Dynamic secrets** — Vault men-generate database credentials on-demand dengan TTL pendek. Credentials ini unik per request dan di-revoke otomatis saat expire.
- **Secret leasing** — Setiap secret memiliki lease time, mendorong rotation otomatis.
- **Audit logging** — Semua akses ke secrets dicatat.
- **Multiple auth methods** — Kubernetes Service Account, AWS IAM, AppRole, dan lainnya.

```java
// Integrasi Spring Cloud Vault
@SpringBootApplication
@EnableConfigurationProperties
public class OrderServiceApplication {
    // Spring Cloud Vault otomatis inject secrets dari Vault ke environment
}
```

```yaml
# bootstrap.yml
spring:
  cloud:
    vault:
      host: vault.internal
      port: 8200
      scheme: https
      authentication: KUBERNETES
      kubernetes:
        role: order-service
      kv:
        enabled: true
        backend: secret
        default-context: order-service
```

#### Kubernetes Secrets

Kubernetes Secrets menyimpan data sensitif sebagai Base64-encoded values di etcd. Penting: Base64 bukan enkripsi. Untuk keamanan nyata, aktifkan **encryption at rest** untuk etcd dan integrasikan dengan KMS (AWS KMS, GCP KMS, atau Vault).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:  # gunakan stringData, bukan data, untuk menghindari encode manual
  username: order_user
  password: ${DB_PASSWORD}  # inject dari CI/CD pipeline
```

#### AWS Secrets Manager

Untuk aplikasi yang berjalan di AWS, Secrets Manager menawarkan:
- Rotation otomatis untuk RDS credentials
- Integrasi native dengan IAM
- Versioning dan staging labels

```java
// Mengakses secret dari AWS Secrets Manager
SecretsManagerClient client = SecretsManagerClient.builder()
    .region(Region.AP_SOUTHEAST_1)
    .build();

GetSecretValueRequest request = GetSecretValueRequest.builder()
    .secretId("prod/order-service/db-credentials")
    .build();

GetSecretValueResponse response = client.getSecretValue(request);
```

### Zero Trust Architecture

Zero Trust bukan produk — ini adalah filosofi keamanan: **"never trust, always verify"**. Prinsip utamanya:

1. **Verify explicitly** — Otentikasi dan otorisasi setiap request berdasarkan semua data yang tersedia: identitas, lokasi, perangkat, service, workload.
2. **Use least privilege access** — Batasi akses ke minimum yang dibutuhkan. Service A hanya boleh memanggil endpoint spesifik di Service B, bukan seluruh API.
3. **Assume breach** — Desain seolah-olah sudah ada penyerang di dalam jaringan. Enkripsi semua komunikasi, segmentasi network, minimal lateral movement.

Dalam konteks microservices, Zero Trust diimplementasikan melalui kombinasi:
- mTLS untuk autentikasi service identity
- JWT/OIDC untuk autentikasi user identity
- RBAC/ABAC untuk otorisasi granular
- Network policies di Kubernetes untuk isolasi network
- Service mesh (Istio/Linkerd) untuk policy enforcement otomatis

### OWASP Top 10 untuk Microservices

OWASP Top 10 yang asli difokuskan untuk aplikasi web monolitik. Untuk microservices, beberapa risiko menjadi lebih relevan:

**A01 — Broken Access Control**: Dalam microservices, setiap layanan harus memvalidasi otorisasi sendiri. Jangan berasumsi bahwa karena request sudah melewati API Gateway, ia sudah terotorisasi.

**A02 — Cryptographic Failures**: Gunakan TLS 1.2+ untuk semua komunikasi. Jangan simpan secrets dalam plaintext. Rotate secrets secara berkala.

**A03 — Injection**: Setiap layanan yang menerima input eksternal berpotensi rentan terhadap SQL injection, command injection, atau SSRF. Validasi dan sanitasi semua input.

**A07 — Identification and Authentication Failures**: Implementasikan token expiry yang pendek, validasi semua JWT claims, dan jangan terima token expired.

**A09 — Security Logging and Monitoring Failures**: Setiap layanan harus menghasilkan audit log yang terstruktur. Gunakan correlation ID untuk menghubungkan events lintas-layanan.



## Referensi

- Indrasiri, K., & Siriwardena, P. (2020). *Microservices for Java Developers*. InfoQ eMag.
- Nygard, M. (2018). *Release It! Design and Deploy Production-Ready Software* (2nd ed.). Pragmatic Bookshelf.
- Resilience4j Documentation. [resilience4j.readme.io](https://resilience4j.readme.io)
- HashiCorp Vault Documentation. [developer.hashicorp.com/vault](https://developer.hashicorp.com/vault/docs)
- NIST SP 800-207: Zero Trust Architecture. National Institute of Standards and Technology, 2020.
- OWASP Top 10. [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/)
- Netflix Tech Blog: Introducing Hystrix for Resilience Engineering. [netflixtechblog.com](https://netflixtechblog.com)
- Principles of Chaos Engineering. [principlesofchaos.org](https://principlesofchaos.org)
