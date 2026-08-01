---
title: "Microservices Testing: Unit, Contract, E2E, dan CI/CD Pipeline"
description: Panduan testing microservices dari InfoQ - testing pyramid,
  consumer-driven contract testing dengan Pact, performance testing JMeter
  Gatling k6, security scanning OWASP ZAP, dan CI/CD pipeline GitOps.
pubDate: 2026-09-29T08:00:00.000Z
image: /image/microservices-java-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Microservices
  - Testing
  - CICD
  - Gatling
series: "Microservices for Java Developers"
seriesOrder: 3
---

Testing microservices jauh lebih kompleks dari testing monolit. Dengan puluhan service yang berinteraksi, satu perubahan kecil bisa merusak contract yang tidak disadari. Buku *Microservices for Java Developers* (InfoQ, 2020) membahas strategi testing komprehensif — dari unit test hingga CI/CD pipeline yang production-ready.

## Daftar Isi

- [Testing Pyramid untuk Microservices](#testing-pyramid-untuk-microservices)
- [Unit Testing dengan JUnit5 dan Mockito](#unit-testing-dengan-junit5-dan-mockito)
- [Consumer-Driven Contract Testing dengan Pact](#consumer-driven-contract-testing-dengan-pact)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance dan Load Testing](#performance-dan-load-testing)
- [Security Testing dan Scanning](#security-testing-dan-scanning)
- [CI/CD Pipeline untuk Microservices](#cicd-pipeline-untuk-microservices)
- [Deployment Strategies](#deployment-strategies)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Testing Pyramid untuk Microservices

![Testing Pyramid Microservices](/image/microservices-testing-pyramid.svg)

Testing pyramid adalah model yang menggambarkan distribusi ideal berbagai jenis test. Dari bawah ke atas:

- **Unit Tests** (base, sangat banyak, sangat cepat): test individual function/class secara terisolasi. Ribuan test, berjalan dalam hitungan detik.
- **Integration Tests** (tengah, sedang): test interaksi antara komponen, termasuk database dan external service yang dimock.
- **Contract Tests** (di atas integration): verifikasi bahwa provider memenuhi contract yang diharapkan consumer.
- **End-to-End Tests** (apex, sangat sedikit, lambat): test seluruh system dari ujung ke ujung. Mahal, lambat, dan sering flaky.

Kesalahan umum: *inverted pyramid* — terlalu banyak E2E test dan sedikit unit test. Ini menghasilkan test suite yang lambat, mahal, dan sulit di-maintain.

## Unit Testing dengan JUnit5 dan Mockito

### JUnit5

JUnit5 adalah framework testing standar untuk Java, dengan banyak improvement dari JUnit4:

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Should create order successfully")
    void shouldCreateOrderSuccessfully() {
        // Arrange
        CreateOrderRequest request = new CreateOrderRequest("item-1", 2, "customer-1");
        Order savedOrder = new Order(1L, "item-1", 2, OrderStatus.PENDING);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        Order result = orderService.createOrder(request);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void shouldThrowExceptionWhenItemNotFound() {
        when(orderRepository.save(any())).thenThrow(new ItemNotFoundException("item-999"));
        assertThrows(ItemNotFoundException.class, () -> orderService.createOrder(new CreateOrderRequest("item-999", 1, "customer-1")));
    }
}
```

### TestContainers

TestContainers memungkinkan test menggunakan database atau service nyata yang berjalan di Docker — bukan mock:

```java
@Testcontainers
@SpringBootTest
class OrderRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("orders_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void shouldPersistAndRetrieveOrder() {
        Order order = new Order(null, "item-1", 2, OrderStatus.PENDING);
        Order saved = orderRepository.save(order);
        Order retrieved = orderRepository.findById(saved.getId()).orElseThrow();
        assertThat(retrieved.getStatus()).isEqualTo(OrderStatus.PENDING);
    }
}
```

### AssertJ

AssertJ menyediakan fluent assertion API yang lebih ekspresif dari JUnit assertions standard:

```java
// JUnit standard (kurang ekspresif)
assertEquals("shipped", order.getStatus().name().toLowerCase());
assertTrue(order.getItems().size() > 0);

// AssertJ (lebih ekspresif, error message lebih baik)
assertThat(order.getStatus()).isEqualTo(OrderStatus.SHIPPED);
assertThat(order.getItems()).isNotEmpty().hasSize(3);
assertThat(order.getTotalPrice()).isGreaterThan(BigDecimal.ZERO);
```

### WireMock dan MockServer

Untuk mocking downstream HTTP services:

```java
@AutoConfigureWireMock(port = 0)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class InventoryClientTest {

    @Autowired
    private InventoryClient inventoryClient;

    @Test
    void shouldReturnItemAvailability() {
        stubFor(get(urlEqualTo("/api/items/item-1/availability"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"available\": true, \"quantity\": 50}")));

        ItemAvailability availability = inventoryClient.checkAvailability("item-1");
        assertThat(availability.isAvailable()).isTrue();
        assertThat(availability.getQuantity()).isEqualTo(50);
    }
}
```

## Consumer-Driven Contract Testing dengan Pact

Contract testing adalah kunci untuk memungkinkan independent deployment. Idenya: consumer mendefinisikan contract (apa yang diharapkan dari provider), provider memverifikasi bahwa mereka memenuhi contract tersebut.

### Consumer Side

```java
@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "inventory-service")
class InventoryClientContractTest {

    @Pact(consumer = "order-service")
    public RequestResponsePact checkAvailabilityPact(PactDslWithProvider builder) {
        return builder
            .given("item item-1 exists and is available")
            .uponReceiving("a request to check item-1 availability")
                .path("/api/items/item-1/availability")
                .method("GET")
            .willRespondWith()
                .status(200)
                .headers(Map.of("Content-Type", "application/json"))
                .body(new PactDslJsonBody()
                    .booleanValue("available", true)
                    .numberValue("quantity", 50))
            .toPact();
    }

    @Test
    @PactTestFor(pactMethod = "checkAvailabilityPact")
    void shouldCheckItemAvailability(MockServer mockServer) {
        InventoryClient client = new InventoryClient(mockServer.getUrl());
        ItemAvailability result = client.checkAvailability("item-1");
        assertThat(result.isAvailable()).isTrue();
    }
}
```

Pact file yang dihasilkan dipublish ke Pact Broker. Provider kemudian memverifikasi:

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Provider("inventory-service")
@PactBroker(url = "https://pact-broker.company.com")
class InventoryServiceProviderTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp(PactVerificationContext context) {
        context.setTarget(new HttpTestTarget("localhost", port));
    }

    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void verifyPacts(PactVerificationContext context) {
        context.verifyInteraction();
    }

    @State("item item-1 exists and is available")
    void itemExists() {
        // Setup test state
    }
}
```

## Integration Testing

Integration test memverifikasi bahwa komponen bekerja dengan benar bersama-sama, termasuk database, message queues, dan external APIs.

Strategi yang direkomendasikan:
- Gunakan TestContainers untuk database dan message broker yang nyata
- Mock hanya external third-party APIs (payment gateway, email service)
- Test happy path dan error path

```java
@SpringBootTest
@Testcontainers
class OrderIntegrationTest {

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.4.0"));

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Test
    void shouldPublishOrderCreatedEventWhenOrderPlaced() {
        // Place order via API
        // Verify event published to Kafka
        // Verify database state
    }
}
```

## End-to-End Testing

E2E test di microservices environment sangat kompleks karena membutuhkan semua service berjalan. Tantangan utama:

- **Flakiness**: network latency, timing issues
- **Maintenance cost**: setiap service change bisa break E2E test
- **Slow feedback**: bisa memakan waktu menit hingga jam
- **Environment complexity**: perlu full environment

Best practices:
- Minimalkan E2E test — hanya untuk critical user journeys
- Gunakan dedicated test environment yang stable
- Retry mechanism untuk handle transient failures
- Isolate test data (setiap test run pakai data unik)

## Performance dan Load Testing

### Perbandingan Load Testing Tools

| Tool | Bahasa | Model | Kelebihan | Kekurangan |
|------|--------|-------|-----------|------------|
| **Apache JMeter** | GUI/XML | Thread-based | Mature, GUI, banyak plugin | Resource-heavy, verbose XML |
| **Gatling** | Scala DSL | Async/Actor | High performance, elegant DSL | Scala learning curve |
| **k6** | JavaScript | Coroutine | Developer-friendly, CI-ready | Less enterprise tooling |
| **Locust** | Python | Greenlet | Python, distributed mode | Slower than compiled tools |

### Apache JMeter

JMeter cocok untuk tim yang lebih suka GUI dan membutuhkan banyak plugin:

```xml
<!-- jmeter-test-plan.jmx - simplified -->
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">100</stringProp>
  <stringProp name="ThreadGroup.ramp_time">30</stringProp>
  <stringProp name="ThreadGroup.duration">120</stringProp>
</ThreadGroup>
```

Jalankan headless di CI:

```bash
jmeter -n -t test-plan.jmx -l results.jtl -e -o report/
```

### Gatling

Gatling menggunakan Scala DSL yang ekspresif:

```scala
class OrderLoadSimulation extends Simulation {

  val httpConf = http
    .baseUrl("http://order-service:8080")
    .header("Content-Type", "application/json")

  val createOrderScenario = scenario("Create Order")
    .exec(
      http("POST /orders")
        .post("/api/orders")
        .body(StringBody("""{"itemId": "item-1", "quantity": 1, "customerId": "cust-123"}"""))
        .check(status.is(201))
        .check(jsonPath("$.id").saveAs("orderId"))
    )
    .pause(1)
    .exec(
      http("GET /orders/{id}")
        .get("/api/orders/#{orderId}")
        .check(status.is(200))
    )

  setUp(
    createOrderScenario.inject(
      rampUsers(100).during(30.seconds),
      constantUsersPerSec(50).during(2.minutes)
    )
  ).protocols(httpConf)
   .assertions(
     global.responseTime.percentile(95).lt(500),
     global.successfulRequests.percent.gt(99)
   )
}
```

### k6

k6 sangat cocok untuk developers karena menggunakan JavaScript:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp-up
    { duration: '2m', target: 50 },    // steady state
    { duration: '30s', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95th percentile < 500ms
    http_req_failed: ['rate<0.01'],    // error rate < 1%
  },
};

export default function () {
  const payload = JSON.stringify({
    itemId: 'item-1',
    quantity: 1,
    customerId: 'cust-123',
  });

  const res = http.post('http://order-service:8080/api/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### Load Test Patterns

- **Load Test**: simulasi beban normal untuk baseline performance
- **Stress Test**: tingkatkan beban sampai sistem degradasi untuk mengetahui breaking point
- **Spike Test**: simulasi sudden traffic spike (flash sale, viral content)
- **Soak/Endurance Test**: beban sedang dalam waktu lama (12-24 jam) untuk mendeteksi memory leaks

## Security Testing dan Scanning

### SAST (Static Analysis)

```xml
<!-- pom.xml - SpotBugs + Find Security Bugs -->
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <configuration>
        <plugins>
            <plugin>
                <groupId>com.h3xstream.findsecbugs</groupId>
                <artifactId>findsecbugs-plugin</artifactId>
            </plugin>
        </plugins>
    </configuration>
</plugin>
```

SonarQube untuk analisis comprehensive: code coverage, code smells, security hotspots, dan technical debt.

### DAST (Dynamic Analysis)

OWASP ZAP dapat diintegrasikan ke CI pipeline:

```bash
# Baseline scan (passive)
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py \
    -t http://app:8080 \
    -r report.html \
    -I  # don't fail on warnings

# Full scan (active)
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-full-scan.py \
    -t http://app:8080 \
    -r report.html
```

### Dependency Scanning

```bash
# OWASP Dependency Check
mvn dependency-check:check

# Snyk
snyk test --severity-threshold=high

# Trivy untuk container image
trivy image order-service:latest --severity HIGH,CRITICAL
```

## CI/CD Pipeline untuk Microservices

Pipeline lengkap untuk microservice:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: orders_test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Run Unit Tests
        run: mvn test

      - name: Run Integration Tests
        run: mvn verify -P integration-tests

      - name: Run Contract Tests
        run: mvn verify -P contract-tests

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: SAST with SpotBugs
        run: mvn spotbugs:check

      - name: Dependency Scan
        run: mvn dependency-check:check

      - name: SonarQube Analysis
        run: mvn sonar:sonar

  build-image:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    steps:
      - name: Build Docker Image
        run: docker build -t order-service:${{ github.sha }} .

      - name: Scan Container Image
        run: trivy image order-service:${{ github.sha }} --severity HIGH,CRITICAL --exit-code 1

      - name: Push to Registry
        run: docker push registry.company.com/order-service:${{ github.sha }}

  deploy-staging:
    needs: build-image
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          helm upgrade order-service charts/order-service \
            --set image.tag=${{ github.sha }} \
            --namespace staging

      - name: Run E2E Tests
        run: npm run e2e -- --env staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production (Canary)
        run: |
          helm upgrade order-service charts/order-service \
            --set image.tag=${{ github.sha }} \
            --set canary.enabled=true \
            --set canary.weight=10 \
            --namespace production
```

### GitOps dengan ArgoCD

GitOps menggunakan Git sebagai single source of truth untuk deployment state. ArgoCD secara kontinyu membandingkan desired state (Git) dengan actual state (cluster) dan melakukan reconciliation.

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: order-service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/k8s-configs
    targetRevision: HEAD
    path: services/order-service
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

## Deployment Strategies

### Blue-Green Deployment

Dua environment identik (blue dan green) berjalan bersamaan. Traffic dialihkan dari blue ke green secara atomic — zero downtime, rollback instan:

- **Blue** (live): versi saat ini
- **Green** (idle): versi baru
- Switch: update load balancer untuk mengarahkan 100% traffic ke green
- Rollback: switch kembali ke blue jika ada masalah

### Canary Release

Rollout bertahap — kirim sebagian kecil traffic ke versi baru, monitor, dan tingkatkan secara gradual:

- 1% traffic ke v2, 99% ke v1
- Monitor error rate, latency, business metrics
- Jika bagus, tingkatkan ke 10%, 25%, 50%, 100%
- Jika ada masalah, rollback 0% ke v2

### Feature Flags

Feature flags memungkinkan toggle fitur di runtime tanpa deployment:

```java
@Component
public class OrderController {

    @Autowired
    private FeatureFlagService featureFlags;

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        if (featureFlags.isEnabled("new-pricing-algorithm", request.getCustomerId())) {
            return ResponseEntity.ok(orderService.createOrderWithNewPricing(request));
        }
        return ResponseEntity.ok(orderService.createOrder(request));
    }
}
```

## Kesimpulan

Testing microservices yang efektif membutuhkan strategi berlapis: unit test yang cepat dan banyak, contract test untuk mencegah breaking changes antar service, integration test dengan infrastructure nyata via TestContainers, dan E2E test yang minimal namun kritis. CI/CD pipeline yang solid — dengan security scanning terintegrasi — menjadi fondasi untuk deployment yang aman dan cepat.

## Referensi

- Fowler, M. (2014). *Microservice Testing*. martinfowler.com.
- Richardson, C. (2018). *Microservices Patterns: With Examples in Java*. Manning Publications.
- Humble, J., & Farley, D. (2010). *Continuous Delivery*. Addison-Wesley.
- OWASP Foundation. (2023). *OWASP Top Ten*. owasp.org.
