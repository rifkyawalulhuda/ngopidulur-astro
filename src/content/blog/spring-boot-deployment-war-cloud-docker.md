---
title: "Spring Boot Deployment: WAR, Cloud Foundry, Heroku, Docker"
description: Panduan deployment Spring Boot ke production - dari executable JAR
  dan WAR ke servlet container, deploy ke Cloud Foundry, Heroku, AWS, Docker
  containerisasi, dan pipeline CI/CD GitHub Actions untuk Spring Boot apps.
pubDate: 2026-08-23T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Deployment
  - Docker
  - CloudFoundry
---

Aplikasi Spring Boot yang sudah selesai dibangun harus bisa sampai ke pengguna. Chapter 8 dari *Spring Boot in Action* membahas berbagai opsi deployment — dari executable JAR sederhana hingga cloud platform dan Docker container.

## Daftar Isi

- [Opsi Deployment Spring Boot](#opsi-deployment-spring-boot)
- [Executable JAR: Deploy Paling Sederhana](#executable-jar-deploy-paling-sederhana)
- [Deploy sebagai WAR ke Servlet Container](#deploy-sebagai-war-ke-servlet-container)
- [Cloud Foundry Deployment](#cloud-foundry-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Docker Containerisasi](#docker-containerisasi)
- [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
- [CI/CD Pipeline dengan GitHub Actions](#cicd-pipeline-dengan-github-actions)
- [Production Checklist](#production-checklist)



## Opsi Deployment Spring Boot

| Opsi | Kelebihan | Kekurangan | Cocok untuk |
|---|---|---|---|
| Executable JAR | Sederhana, self-contained | Butuh JVM di server | VPS, dedicated server |
| WAR | Familiar bagi enterprise | Butuh servlet container | Legacy infrastructure |
| Docker | Portable, consistent | Butuh Docker knowledge | Modern cloud, Kubernetes |
| Cloud Foundry | Zero-config PaaS | Vendor lock-in | Enterprise cloud |
| Heroku | Deploy semudah git push | Mahal untuk production | Startup, prototyping |
| AWS Beanstalk | Full AWS ecosystem | Kompleks | AWS shops |



## Executable JAR: Deploy Paling Sederhana

Spring Boot menghasilkan "fat JAR" yang berisi semua dependencies dan embedded server.

```bash
# Build
mvn clean package -DskipTests
# atau
gradle bootJar

# Hasil: target/myapp-1.0.0.jar (atau build/libs/ untuk Gradle)

# Jalankan
java -jar target/myapp-1.0.0.jar

# Dengan konfigurasi
java -jar app.jar \
  --server.port=8443 \
  --spring.profiles.active=production \
  --spring.datasource.url=jdbc:postgresql://db:5432/myapp

# Via environment variables
export SPRING_PROFILES_ACTIVE=production
export SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp
java -jar app.jar
```

### Jalankan sebagai Systemd Service (Linux)

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=Spring Boot Reading List App
After=network.target

[Service]
Type=simple
User=springboot
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java -jar /opt/myapp/reading-list-1.0.0.jar
EnvironmentFile=/opt/myapp/.env
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
sudo journalctl -u myapp -f  # lihat logs
```



## Deploy sebagai WAR ke Servlet Container

Untuk deploy ke Tomcat, JBoss, WebSphere yang sudah ada:

```xml
<!-- pom.xml: ubah packaging -->
<packaging>war</packaging>

<!-- Exclude embedded Tomcat -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>  <!-- provided = tidak di-bundle ke WAR -->
</dependency>
```

```java
// Main class extend SpringBootServletInitializer
@SpringBootApplication
public class ReadingListApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(ReadingListApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ReadingListApplication.class);
    }
}
```

```bash
# Build WAR
mvn clean package

# Deploy ke Tomcat — copy ke webapps
cp target/reading-list-1.0.0.war /opt/tomcat/webapps/reading-list.war

# Tomcat auto-deploy, akses via:
# http://server:8080/reading-list/
```



## Cloud Foundry Deployment

Cloud Foundry adalah PaaS yang sangat cocok dengan Spring Boot — deteksi otomatis, zero-config deployment.

```bash
# Install CF CLI
brew install cf-cli@8

# Login ke Cloud Foundry
cf login -a https://api.run.pivotal.io
# atau untuk Tanzu Application Service
cf login -a https://api.sys.yourdomain.com

# Deploy langsung (CF detect Spring Boot otomatis)
cf push reading-list -p target/reading-list-1.0.0.jar

# Atau dengan manifest
cf push
```

### manifest.yml

```yaml
applications:
  - name: reading-list
    path: target/reading-list-1.0.0.jar
    memory: 512M
    instances: 2
    buildpacks:
      - java_buildpack
    env:
      SPRING_PROFILES_ACTIVE: cloud
      JAVA_OPTS: "-Xmx400m -Xms200m"
    services:
      - reading-list-db     # PostgreSQL service
      - reading-list-cache  # Redis service
    health-check-type: http
    health-check-http-endpoint: /actuator/health
    routes:
      - route: reading-list.apps.yourdomain.com
```

```bash
# Provision services
cf create-service elephantsql turtle reading-list-db
cf create-service rediscloud 30mb reading-list-cache

# Bind services
cf bind-service reading-list reading-list-db

# Lihat logs
cf logs reading-list --recent
cf logs reading-list  # tail

# Scale
cf scale reading-list -i 3  # 3 instances
cf scale reading-list -m 1G  # 1GB memory

# Environment variables
cf env reading-list
cf set-env reading-list SECRET_KEY "mysecretkey"
cf restart reading-list
```



## Heroku Deployment

```bash
# Install Heroku CLI
# Download dari https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Buat app
heroku create reading-list-app

# Atau pakai existing app
heroku git:remote -a reading-list-app
```

### Procfile

```procfile
web: java -Dserver.port=$PORT -jar target/reading-list-1.0.0.jar
```

```bash
# Deploy via Git
git push heroku main

# Lihat logs
heroku logs --tail

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=production
heroku config:set SECRET_KEY=mysecretkey
heroku config

# Provision PostgreSQL
heroku addons:create heroku-postgresql:mini
heroku config | grep DATABASE_URL

# Scale dynos
heroku ps:scale web=2  # 2 dynos
heroku ps             # status
```

### application-heroku.yml

```yaml
spring:
  datasource:
    url: "${DATABASE_URL}"
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update

server:
  port: "${PORT:8080}"
```



## Docker Containerisasi

### Dockerfile Standar

```dockerfile
# Dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Buat user non-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR
COPY target/reading-list-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget -q -O /dev/null http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Multi-Stage Build (lebih efisien)

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B  # cache dependencies
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime (image jauh lebih kecil)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /build/target/reading-list-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseContainerSupport", \
  "-jar", "app.jar"]
```

```bash
# Build image
docker build -t reading-list:1.0.0 .
docker build -t reading-list:latest .

# Jalankan
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=production \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/mydb \
  reading-list:latest

# Lihat logs
docker logs -f reading-list-container

# Push ke registry
docker tag reading-list:latest registry.example.com/reading-list:latest
docker push registry.example.com/reading-list:latest
```

### Docker Compose dengan Database

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/readinglist
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_REDIS_HOST: redis
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: readinglist
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
# Jalankan semua services
docker-compose up -d

# Scale app instances
docker-compose up -d --scale app=3

# Lihat logs
docker-compose logs -f app

# Stop
docker-compose down

# Stop dan hapus volumes
docker-compose down -v
```

### Spring Boot 3 Buildpack (tanpa Dockerfile)

```bash
# Spring Boot 3.x support Cloud Native Buildpacks
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=reading-list:latest

# Atau Gradle
gradle bootBuildImage --imageName=reading-list:latest

# Hasilnya image yang sudah dioptimalkan tanpa Dockerfile
docker run -p 8080:8080 reading-list:latest
```



## AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Init project
eb init reading-list --platform java --region ap-southeast-1

# Buat environment
eb create reading-list-prod

# Deploy
eb deploy

# Lihat status
eb status
eb logs

# Scale
eb scale 3  # 3 instances

# Environment variables
eb setenv SPRING_PROFILES_ACTIVE=production SECRET_KEY=mysecret
```



## CI/CD Pipeline dengan GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy Spring Boot

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: "temurin"
          cache: maven

      - name: Run tests
        run: mvn test -B

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: target/surefire-reports/

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == "refs/heads/main"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: "temurin"
          cache: maven

      - name: Build JAR
        run: mvn clean package -DskipTests -B

      - name: Build Docker image
        run: docker build -t ${{ secrets.REGISTRY }}/reading-list:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login ${{ secrets.REGISTRY }} -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/reading-list:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ${{ secrets.REGISTRY }}/reading-list:${{ github.sha }}
            docker stop reading-list || true
            docker rm reading-list || true
            docker run -d --name reading-list \
              -p 8080:8080 \
              --env-file /opt/myapp/.env \
              --restart unless-stopped \
              ${{ secrets.REGISTRY }}/reading-list:${{ github.sha }}
            docker ps
```



## Production Checklist

Sebelum go-live Spring Boot app:

```yaml
# application-production.yml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: ${SSL_KEYSTORE_PATH}
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
  tomcat:
    max-threads: 200
    accept-count: 100

spring:
  jpa:
    hibernate:
      ddl-auto: validate  # JANGAN create/update di production!
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    root: WARN
    com.example: INFO
  file:
    name: /var/log/myapp/spring.log
```

| Kategori | Item | Check |
|---|---|---|
| Security | HTTPS enabled | SSL cert terpasang |
| Security | Actuator protected | Basic auth atau role |
| Database | `ddl-auto=validate` | Bukan create/update |
| Database | Connection pool configured | HikariCP max-pool-size |
| Database | Migration tool | Flyway atau Liquibase |
| Performance | Caching enabled | Redis atau Caffeine |
| Monitoring | Health endpoint exposed | `/actuator/health` |
| Monitoring | Metrics to Prometheus | Micrometer configured |
| Logging | Log level WARN/INFO | Bukan DEBUG di prod |
| Logging | Log rotation | Logback config |
| Resilience | Graceful shutdown | `server.shutdown=graceful` |
| Resilience | Health check | Load balancer config |

```yaml
# Graceful shutdown
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```



## Ringkasan Seri Spring Boot in Action

| Artikel | Topik | Chapter |
|---|---|---|
| 1 | Auto-Configuration, Starters, Initializr | Ch1-2 |
| 2 | Properties, Profiles, Security | Ch3 |
| 3 | Testing: MockMvc, Integration, Selenium | Ch4 |
| 4 | CLI, Groovy, Grails | Ch5-6 |
| 5 | Actuator, Monitoring, Metrics | Ch7 |
| 6 | Deployment: JAR, WAR, Cloud, Docker | Ch8 |



**Sumber:** Craig Walls, *Spring Boot in Action* (2016), Manning Publications.
