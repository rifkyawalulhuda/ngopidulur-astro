---
title: "Dropwizard dan WildFly Swarm: Framework Microservices Java"
description: Panduan praktis Dropwizard dan WildFly Swarm dari buku James Cross -
  perbandingan framework microservices Java, Jetty Jersey metrics, fat JAR,
  konfigurasi, health checks, dan calling another service.
pubDate: 2026-10-03T08:00:00.000Z
image: /image/microservices-java-praktis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Java
  - Dropwizard
  - WildFly
  - Microservices
series: "Microservices Java Praktis"
seriesOrder: 2
---

Setelah Spring Boot, buku James Cross mengajak kita melihat dua framework Java lain untuk microservices: **Dropwizard** dan **WildFly Swarm**. Ketiganya punya pendekatan berbeda: Spring Boot dengan auto-configuration, Dropwizard dengan komponen battle-tested yang digabung, dan WildFly Swarm dengan fitur Java EE lengkap dalam Uber JAR.

## Daftar Isi

- [Mengapa Banyak Framework?](#mengapa-banyak-framework)
- [Dropwizard: Getting Started](#dropwizard-getting-started)
- [Dropwizard: Hello World](#dropwizard-hello-world)
- [Dropwizard: Hello World](#dropwizard-hello-world)
- [Dropwizard: Metrics dan Health](#dropwizard-metrics-dan-health)
- [Dropwizard: Calling Another Service](#dropwizard-calling-another-service)
- [WildFly Swarm: Getting Started](#wildfly-swarm-getting-started)
- [WildFly Swarm: Hello World](#wildfly-swarm-hello-world)
- [Perbandingan Spring Boot vs Dropwizard vs WildFly Swarm](#perbandingan-spring-boot-vs-dropwizard-vs-wildfly-swarm)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Mengapa Banyak Framework?

Tiga framework microservices Java yang populer:

- **Spring Boot** — opinionated, auto-configuration, ekosistem Spring terbesar
- **Dropwizard** — komponen teruji (Jetty, Jersey, Jackson) digabung dengan konfigurasi minimal
- **WildFly Swarm** — fitur Java EE lengkap dikemas dalam Uber JAR, jalan tanpa server

Pilihan framework tergantung kebutuhan: ekosistem vs kesederhanaan vs fitur enterprise.

## Dropwizard: Getting Started

Dropwizard menggabungkan library Java terbaik yang sudah teruji production:

- **Jetty** — HTTP server
- **Jersey** — REST framework (JAX-RS)
- **Jackson** — JSON serialization
- **Metrics** — metrik aplikasi (sebelumnya Coda Hale Metrics)
- **Logback** — logging
- **JDBI / Hibernate** — database access

Filosofi Dropwizard: **"bring a lot of good libraries together"** — bukan menciptakan framework baru, tapi menggabungkan yang terbaik.

### Project Structure

```xml
<dependency>
    <groupId>io.dropwizard</groupId>
    <artifactId>dropwizard-core</artifactId>
    <version>2.1.9</version>
</dependency>
```

Main class:

```java
package com.example;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class HelloWorldApplication extends Application<HelloWorldConfiguration> {

    public static void main(String[] args) throws Exception {
        new HelloWorldApplication().run(args);
    }

    @Override
    public String getName() {
        return "hello-world";
    }

    @Override
    public void initialize(Bootstrap<HelloWorldConfiguration> bootstrap) {
        // setup bundles, commands
    }

    @Override
    public void run(HelloWorldConfiguration configuration, Environment environment) {
        // register resources
        environment.jersey().register(new HelloWorldResource());
    }
}
```

### Configuration Class

```java
package com.example;

import io.dropwizard.Configuration;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HelloWorldConfiguration extends Configuration {

    private String appName;
    private int defaultSize;

    @JsonProperty
    public String getAppName() {
        return appName;
    }

    @JsonProperty
    public void setAppName(String appName) {
        this.appName = appName;
    }
}
```

## Dropwizard: Hello World

### Add the HTTP Endpoints

```java
package com.example;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class HelloWorldResource {

    @GET
    @Path("/hello")
    public Response hello() {
        return Response.ok(
            Map.of("message", "Hello from Dropwizard!")
        ).build();
    }

    @GET
    @Path("/hello/{name}")
    public Response helloName(@PathParam("name") String name) {
        return Response.ok(
            Map.of("message", "Hello, " + name + "!")
        ).build();
    }
}
```

### Externalize Configuration

Config di YAML file (default `config.yml`):

```yaml
server:
  applicationConnectors:
    - type: http
      port: 8080

appName: hello-service

logging:
  level: INFO
```

Jalankan dengan:

```bash
java -jar target/hello-service.jar server config.yml
```

## Dropwizard: Metrics dan Health

Dropwizard punya dukungan metrics dan health checks bawaan yang kuat.

### Health Checks

```java
package com.example;

import com.codahale.metrics.health.HealthCheck;

public class DatabaseHealthCheck extends HealthCheck {

    @Override
    protected Result check() throws Exception {
        // contoh: cek koneksi database
        boolean databaseUp = checkDatabaseConnection();
        if (databaseUp) {
            return Result.healthy();
        }
        return Result.unhealthy("Database connection failed");
    }

    private boolean checkDatabaseConnection() {
        return true; // implementasi nyata
    }
}
```

Registrasi di `run()` method:

```java
@Override
public void run(HelloWorldConfiguration configuration, Environment environment) {
    environment.jersey().register(new HelloWorldResource());
    environment.healthChecks().register("database", new DatabaseHealthCheck());
}
```

Health check diakses via `http://localhost:8081/healthcheck`.

### Metrics

```java
package com.example;

import com.codahale.metrics.*;

public class MessageMetrics {

    private final Counter messagesSent;
    private final Timer messageProcessingTime;

    public MessageMetrics(MetricRegistry metrics) {
        this.messagesSent = metrics.counter("messages.sent");
        this.messageProcessingTime = metrics.timer("messages.processing-time");
    }

    public void recordMessage(String message) {
        Timer.Context context = messageProcessingTime.time();
        try {
            // proses pesan
            messagesSent.inc();
        } finally {
            context.stop();
        }
    }
}
```

Metrics diekspos di `http://localhost:8081/metrics` dengan format JSON.

## Dropwizard: Calling Another Service

```java
package com.example;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class UserServiceClient {

    private final Client client = ClientBuilder.newClient();

    public String getUserName(Long userId) {
        WebTarget target = client.target("http://user-service:8081");
        User user = target.path("/api/users/" + userId)
                .request(MediaType.APPLICATION_JSON)
                .get(User.class);
        return user.getName();
    }
}
```

## WildFly Swarm: Getting Started

WildFly Swarm (sekarang berganti nama jadi **Thorntail**) adalah pendekatan berbeda: membawa **fitur Java EE (Jakarta EE) lengkap** ke dalam aplikasi microservice, dikemas sebagai **Uber JAR** — aplikasi yang bisa jalan tanpa application server eksternal.

### Vanilla Java Project

Mulai dengan project Maven biasa, tambahkan dependency WildFly Swarm:

```xml
<properties>
    <version.wildfly.swarm>2018.5.0</version.wildfly.swarm>
</properties>

<dependencies>
    <!-- RESTEasy + JAX-RS -->
    <dependency>
        <groupId>org.wildfly.swarm</groupId>
        <artifactId>jaxrs</artifactId>
        <version>${version.wildfly.swarm}</version>
    </dependency>
</dependencies>

<plugins>
    <plugin>
        <groupId>org.wildfly.swarm</groupId>
        <artifactId>wildfly-swarm-plugin</artifactId>
        <version>${version.wildfly.swarm}</version>
        <executions>
            <execution>
                <goals>
                    <goal>package</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
</plugins>
```

### Using JBoss Forge

JBoss Forge (scaffolding tool) bisa mempercepat setup:

```bash
forge
# Buat project baru
project-new --named hello-service --type war
# Tambah dependency JAX-RS
dependency-add --groupId org.wildfly.swarm --artifactId jaxrs
```

## WildFly Swarm: Hello World

### Main Application Class

```java
package com.example;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/api")
public class HelloApplication extends Application {
    // JAX-RS application tanpa konfigurasi tambahan
}
```

### Add the HTTP Endpoints

```java
package com.example;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/hello")
@Produces(MediaType.APPLICATION_JSON)
public class HelloResource {

    @GET
    public Map<String, String> hello() {
        return Map.of("message", "Hello from WildFly Swarm!");
    }

    @GET
    @Path("/{name}")
    public Map<String, String> helloName(@PathParam("name") String name) {
        return Map.of("message", "Hello, " + name + "!");
    }
}
```

### Externalize Configuration

WildFly Swarm menggunakan project configuration (`project-defaults.yml`):

```yaml
swarm:
  http:
    port: 8080

app:
  name: hello-service
```

### Expose Metrics and Health

```java
package com.example;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {

    @GET
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
```

### Build dan Run

```bash
mvn package
java -jar target/hello-service-swarm.jar
```

Uber JAR berisi seluruh WildFly runtime + aplikasi — jalan di mana saja tanpa server.

## Perbandingan Spring Boot vs Dropwizard vs WildFly Swarm

| Aspek | Spring Boot | Dropwizard | WildFly Swarm |
|-------|-------------|------------|---------------|
| **Filosofi** | Opinionated auto-config | Gabung library terbaik | Java EE lengkap |
| **HTTP Server** | Tomcat/Jetty/Undertow | Jetty | Undertow |
| **REST** | Spring MVC | Jersey (JAX-RS) | RESTEasy (JAX-RS) |
| **JSON** | Jackson | Jackson | Jackson |
| **Config** | application.yml + @Value | config.yml + YAML | project-defaults.yml |
| **Metrics** | Actuator + Micrometer | Metrics (Coda Hale) | MicroProfile Metrics |
| **Health** | Actuator /health | HealthChecks | MicroProfile Health |
| **Packaging** | Self-contained JAR | Fat JAR | Uber JAR |
| **Kelebihan** | Ekosistem terbesar | Ringan & teruji | Fitur enterprise |
| **Kekurangan** | "Magic" abstraksi | Manual wiring | Berat untuk micro kecil |

### Kapan Memilih?

**Spring Boot** jika:
- Butuh ekosistem besar (Spring Cloud, security, data)
- Ingin produktivitas maksimal dengan auto-configuration
- Butuh banyak integration out-of-the-box

**Dropwizard** jika:
- Ingin komponen yang teruji dan predictable
- Butuh metrics/health yang kuat sejak awal
- Lebih suka kontrol eksplisit tanpa "magic"

**WildFly Swarm/Thorntail** jika:
- Sudah berpengalaman dengan Java EE/Jakarta EE
- Butuh fitur enterprise (EJB, JMS, CDI) dalam microservice
- Ingin migrasi dari application server tradisional

## Kesimpulan

Dropwizard dan WildFly Swarm menawarkan alternatif yang valid selain Spring Boot. Dropwizard unggul di kesederhanaan dan library teruji, sementara WildFly Swarm membawa kekuatan Java EE ke dunia microservices.

Ketiganya menghasilkan **self-contained artifact** yang bisa di-deploy ke container — membawa kita ke topik artikel berikutnya: deployment dengan Docker dan Kubernetes.

## Referensi

- Cross, J. (2017). *Microservices for Java Developers*. Red Hat.
- Dropwizard Team. (2023). *Dropwizard Documentation*. dropwizard.io.
- Thorntail Project. (2019). *Thorntail Documentation* (formerly WildFly Swarm). thorntail.io.
- Newman, S. (2015). *Building Microservices*. O'Reilly Media.
