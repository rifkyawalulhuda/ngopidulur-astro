---
title: "Spring Boot Konfigurasi: Properties, Profiles, dan Security"
description: Kuasai konfigurasi Spring Boot - application.properties vs YAML,
  environment-specific profiles, override hierarchy, Spring Security auto-config,
  custom UserDetailsService, dan fine-tuning 300+ properties bawaan.
pubDate: 2026-08-19T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Java
  - Security
  - Configuration
---

Spring Boot terkenal dengan filosofi *convention over configuration* -- kamu bisa menjalankan aplikasi web lengkap tanpa menulis satu baris XML pun. Tapi di balik kemudahan itu, ada mesin konfigurasi yang sangat fleksibel. Artikel ini membedah habis sistem konfigurasi Spring Boot: dari `application.properties` vs YAML, hierarki override 16 level, Spring Security, hingga custom auto-configuration -- semuanya berdasarkan **Spring Boot in Action** karya Craig Walls (Manning Publications, 2016).

## Auto-Configuration dan Override

Saat kamu menambahkan `spring-boot-starter-web` ke `pom.xml`, Spring Boot secara otomatis mengonfigurasi Tomcat, Jackson, Spring MVC, dan puluhan komponen lain. Ini terjadi berkat mekanisme `@EnableAutoConfiguration` yang memindai file `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.

Setiap auto-configuration class menggunakan anotasi kondisional seperti `@ConditionalOnClass`, `@ConditionalOnMissingBean`, dan `@ConditionalOnProperty`. Artinya, konfigurasi otomatis hanya aktif jika kondisi tertentu terpenuhi -- dan kamu bisa meng-override kapan saja.

### Kapan dan Bagaimana Override

Override diperlukan ketika perilaku default tidak sesuai, kamu ingin menambahkan bean kustom, konfigurasi berbeda per environment, atau security requirements lebih ketat. Ada tiga cara utama:

```java
// Cara 1: Set properties (untuk tweak kecil)
// application.properties
// server.port=8443

// Cara 2: Declare bean sendiri -- auto-config mundur otomatis
@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource() {
        // Spring Boot tidak akan auto-configure DataSource
        // karena kamu sudah declare bean ini sendiri
        return new HikariDataSource(hikariConfig());
    }
}

// Cara 3: Exclude auto-configuration secara eksplisit
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    SecurityAutoConfiguration.class
})
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

## application.properties vs application.yml

Spring Boot mendukung dua format konfigurasi utama. Keduanya ekuivalen secara fungsional, tapi memiliki karakteristik berbeda.

### application.properties -- Format Klasik

Format flat dengan notasi titik. Cocok untuk konfigurasi sederhana dan tim yang terbiasa dengan Java properties.

```properties
# Server configuration
server.port=8443
server.servlet.context-path=/myapp

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=dbuser
spring.datasource.password=secret
spring.datasource.hikari.maximum-pool-size=10

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Security
spring.security.user.name=admin
spring.security.user.password=adminpass

# Logging
logging.level.root=WARN
logging.level.com.example=INFO
logging.file.name=/var/log/app/myapp.log
```

### application.yml -- Format Modern

Format hierarkis berbasis YAML. Lebih readable untuk konfigurasi kompleks dan mendukung multi-document dalam satu file.

```yaml
server:
  port: 8443
  servlet:
    context-path: /myapp

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: dbuser
    password: secret
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  security:
    user:
      name: admin
      password: adminpass

logging:
  level:
    root: WARN
    com.example: INFO
  file:
    name: /var/log/app/myapp.log
```

Kelebihan YAML: struktur hierarkis lebih jelas, tidak ada pengulangan prefix, mendukung list dan map lebih natural, dan bisa menampung multiple profiles dalam satu file dengan `---` sebagai pemisah dokumen.

## Hierarki Property Override (16 Level)

Spring Boot menerapkan hierarki override yang sangat detail. Sumber dengan nomor lebih kecil memiliki prioritas lebih tinggi:

1. Devtools global settings (`~/.spring-boot-devtools.properties`)
2. `@TestPropertySource` pada test class
3. `@SpringBootTest` properties attribute pada test
4. Command-line arguments (`--server.port=9090`)
5. `SPRING_APPLICATION_JSON` (inline JSON di env var)
6. `ServletConfig` init parameters
7. `ServletContext` init parameters
8. JNDI attributes dari `java:comp/env`
9. Java System properties (`System.getProperties()`)
10. OS environment variables
11. `RandomValuePropertySource` (hanya untuk `random.*`)
12. Profile-specific properties di luar jar
13. Profile-specific properties di dalam jar
14. Application properties di luar jar (`application.properties`)
15. Application properties di dalam jar
16. Default properties (`SpringApplication.setDefaultProperties`)

### Contoh Praktis Override

```bash
# Override via command line -- prioritas tertinggi setelah test
java -jar myapp.jar --server.port=9090 --spring.profiles.active=prod

# Override via environment variable (dots diganti underscore, uppercase)
export SERVER_PORT=9090
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/mydb
java -jar myapp.jar

# Override via system property
java -Dserver.port=9090 -Dspring.profiles.active=prod -jar myapp.jar
```

## @ConfigurationProperties -- Binding ke POJO

Untuk konfigurasi yang lebih kompleks, `@ConfigurationProperties` memungkinkan binding ke POJO dengan type safety penuh dan validasi terintegrasi.

### Mendefinisikan Properties Class

```java
package com.example.readinglist.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {

    @NotBlank
    private String name = "Reading List";

    @NotNull
    @Min(1)
    @Max(100)
    private Integer maxBooksPerReader = 10;

    @NotBlank
    private String adminEmail;

    private Security security = new Security();

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getMaxBooksPerReader() { return maxBooksPerReader; }
    public void setMaxBooksPerReader(Integer v) { this.maxBooksPerReader = v; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public Security getSecurity() { return security; }
    public void setSecurity(Security security) { this.security = security; }

    public static class Security {
        private boolean requireHttps = false;
        private int sessionTimeout = 3600;

        public boolean isRequireHttps() { return requireHttps; }
        public void setRequireHttps(boolean v) { this.requireHttps = v; }

        public int getSessionTimeout() { return sessionTimeout; }
        public void setSessionTimeout(int v) { this.sessionTimeout = v; }
    }
}
```

### YAML yang Sesuai

```yaml
app:
  name: "My Reading List App"
  max-books-per-reader: 25
  admin-email: admin@example.com
  security:
    require-https: true
    session-timeout: 1800
```

Spring Boot secara otomatis mengonversi `max-books-per-reader` (kebab-case) ke `maxBooksPerReader` (camelCase). Tambahkan `spring-boot-configuration-processor` ke `pom.xml` untuk mendapatkan IDE autocomplete.

## Spring Profiles

Profiles memungkinkan konfigurasi berbeda per environment tanpa mengubah kode.

### Struktur File Profile

```
src/main/resources/
  application.yml          # Base -- berlaku semua env
  application-dev.yml      # Override development
  application-staging.yml  # Override staging
  application-prod.yml     # Override production
```

### application-dev.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:devdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    username: sa
    password:
    driver-class-name: org.h2.Driver
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

logging:
  level:
    com.example: DEBUG
    org.springframework.security: DEBUG
```

### application-prod.yml

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: myapp

spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    root: WARN
    com.example: INFO
  file:
    name: /var/log/readinglist/app.log
```

### Anotasi @Profile pada Bean

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .addScript("schema.sql")
            .addScript("data.sql")
            .build();
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(System.getenv("DATABASE_URL"));
        config.setUsername(System.getenv("DATABASE_USERNAME"));
        config.setPassword(System.getenv("DATABASE_PASSWORD"));
        config.setMaximumPoolSize(20);
        return new HikariDataSource(config);
    }
}
```

### Cara Mengaktifkan Profile

```bash
# Via application.properties (default)
spring.profiles.active=dev

# Via environment variable
export SPRING_PROFILES_ACTIVE=prod
java -jar myapp.jar

# Via JVM system property
java -Dspring.profiles.active=prod -jar myapp.jar

# Via command line argument
java -jar myapp.jar --spring.profiles.active=prod

# Multiple profiles sekaligus
java -jar myapp.jar --spring.profiles.active=prod,metrics
```

## Kustomisasi Spring Security

Spring Boot auto-configuration Spring Security dengan default yang ketat: semua endpoint diamankan, satu user `user` dengan password random. Untuk production, kamu perlu kustomisasi penuh.

### SecurityConfig.java

```java
package com.example.readinglist.security;

import com.example.readinglist.repository.ReaderRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ReaderRepository readerRepository;

    public SecurityConfig(ReaderRepository readerRepository) {
        this.readerRepository = readerRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register", "/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/readingList", true)
                .failureUrl("/login?error")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .httpBasic(basic -> basic
                .realmName("Reading List API")
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**")
            )
            .sessionManagement(session -> session
                .maximumSessions(1)
                .expiredUrl("/login?expired")
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Reader reader = readerRepository.findByUsername(username);
            if (reader == null) {
                throw new UsernameNotFoundException(
                    "User '" + username + "' tidak ditemukan"
                );
            }
            return reader;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

### Reader.java -- Entity Implements UserDetails

```java
package com.example.readinglist.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "reader")
public class Reader implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Override
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    @Override
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
```

### ReaderRepository.java

```java
package com.example.readinglist.repository;

import com.example.readinglist.model.Reader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Long> {
    Reader findByUsername(String username);
    boolean existsByUsername(String username);
}
```

### Registrasi User dengan BCrypt

```java
@Service
public class ReaderService {

    private final ReaderRepository readerRepository;
    private final PasswordEncoder passwordEncoder;

    public ReaderService(ReaderRepository readerRepository,
                         PasswordEncoder passwordEncoder) {
        this.readerRepository = readerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Reader registerReader(String username, String password, String fullName) {
        if (readerRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username sudah digunakan");
        }
        Reader reader = new Reader();
        reader.setUsername(username);
        reader.setPassword(passwordEncoder.encode(password)); // BCrypt hash
        reader.setFullName(fullName);
        return readerRepository.save(reader);
    }
}
```

## Konfigurasi Embedded Server

### Port, Context Path, dan SSL

```yaml
server:
  port: 8443
  servlet:
    context-path: /api/v1
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
    key-alias: tomcat
  tomcat:
    max-threads: 200
    min-spare-threads: 20
    connection-timeout: 20000
    accept-count: 100
```

Generate self-signed keystore untuk development:

```bash
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore keystore.p12 -validity 3650 \
  -storepass changeit \
  -dname "CN=localhost, OU=Dev, O=Example, L=Jakarta, ST=DKI, C=ID"
```

Redirect HTTP ke HTTPS secara programatik:

```java
@Bean
public ServletWebServerFactory servletContainer() {
    TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
        @Override
        protected void postProcessContext(Context context) {
            SecurityConstraint constraint = new SecurityConstraint();
            constraint.setUserConstraint("CONFIDENTIAL");
            SecurityCollection collection = new SecurityCollection();
            collection.addPattern("/*");
            constraint.addCollection(collection);
            context.addConstraint(constraint);
        }
    };
    tomcat.addAdditionalTomcatConnectors(createHttpConnector());
    return tomcat;
}

private Connector createHttpConnector() {
    Connector connector =
        new Connector("org.apache.coyote.http11.Http11NioProtocol");
    connector.setScheme("http");
    connector.setPort(8080);
    connector.setSecure(false);
    connector.setRedirectPort(8443);
    return connector;
}
```

## DataSource dan HikariCP Connection Pool

HikariCP adalah connection pool default Spring Boot sejak versi 2.x -- sangat cepat dan ringan dibanding DBCP maupun c3p0.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://db-host:5432/mydb
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      pool-name: MainPool
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 30000
      max-lifetime: 1800000
      connection-test-query: SELECT 1
      auto-commit: true
```

Override programatik jika perlu logika kondisional:

```java
@Bean
@ConfigurationProperties("spring.datasource.hikari")
public HikariDataSource dataSource(DataSourceProperties properties) {
    return properties.initializeDataSourceBuilder()
                     .type(HikariDataSource.class)
                     .build();
}
```

## Logging Konfigurasi

Spring Boot menggunakan SLF4J dengan Logback sebagai implementasi default.

```yaml
logging:
  level:
    root: WARN
    com.example: DEBUG
    org.springframework.web: INFO
    org.springframework.security: INFO
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30
    total-size-cap: 1GB
```

Untuk kustomisasi lebih lanjut, buat file `logback-spring.xml` di `src/main/resources`:

```xml
<configuration>
    <springProfile name="dev">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="DEBUG">
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>

    <springProfile name="prod">
        <appender name="FILE"
            class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>logs/app.log</file>
            <rollingPolicy
                class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log</fileNamePattern>
                <maxHistory>30</maxHistory>
            </rollingPolicy>
            <encoder>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="WARN">
            <appender-ref ref="FILE" />
        </root>
    </springProfile>
</configuration>
```

## Custom Auto-Configuration

Kamu bisa membuat auto-configuration sendiri -- berguna saat membangun library internal yang dibagikan ke beberapa project.

```java
package com.example.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass(ReadingListService.class)
@ConditionalOnProperty(
    prefix = "readinglist",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(AppProperties.class)
public class ReadingListAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public ReadingListService readingListService(
            ReaderRepository readerRepository,
            AppProperties properties) {
        return new ReadingListService(readerRepository, properties);
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "readinglist.cache", name = "enabled",
                           havingValue = "true")
    public ReadingListCacheService cacheService() {
        return new ReadingListCacheService();
    }
}
```

Daftarkan di `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`:

```
com.example.autoconfigure.ReadingListAutoConfiguration
```

## application.yml Lengkap Multi-Profile

Satu file YAML bisa memuat semua profile sekaligus menggunakan `---` sebagai pemisah dokumen YAML (ini adalah pemisah dokumen YAML, bukan frontmatter Markdown):

```yaml
spring:
  application:
    name: reading-list-app

app:
  name: "Reading List"
  max-books-per-reader: 10

logging:
  level:
    root: INFO
```

File `application-dev.yml` terpisah untuk development:

```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:h2:mem:devdb
    username: sa
    password: ""
  h2:
    console:
      enabled: true
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop
logging:
  level:
    com.example: DEBUG
```

File `application-prod.yml` untuk production:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_PASSWORD}

spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 20

app:
  name: "Reading List Production"
  max-books-per-reader: 50
  admin-email: ${ADMIN_EMAIL}
  security:
    require-https: true
    session-timeout: 1800

logging:
  level:
    root: WARN
    com.example: INFO
  file:
    name: /var/log/app/readinglist.log
```

## Ringkasan

Sistem konfigurasi Spring Boot sangat powerful sekaligus pragmatis. Poin-poin kunci yang perlu diingat:

- **Auto-configuration** bekerja dengan kondisi -- override cukup dengan mendefinisikan bean sendiri atau exclude secara eksplisit
- **YAML** lebih readable untuk konfigurasi hierarkis; `application.properties` cocok untuk konfigurasi flat sederhana
- **Hierarki 16 level** memastikan command-line argument selalu menang, memudahkan override saat deployment tanpa rebuild
- **`@ConfigurationProperties`** memberikan type-safety, validasi `@NotNull`/`@Min`/`@Max`, dan IDE autocomplete untuk konfigurasi kustom
- **Spring Profiles** memisahkan konfigurasi per environment dengan bersih -- satu artifact, banyak konfigurasi
- **Spring Security** bisa dikustomisasi penuh -- dari `formLogin()`, `httpBasic()`, `authorizeRequests()`, hingga custom `UserDetailsService` dengan BCrypt
- **HikariCP** adalah default connection pool di Spring Boot 2.x+ dan bisa di-tune langsung via YAML
- **Custom auto-configuration** dengan `@ConditionalOnXxx` memungkinkan library internal berperilaku seperti starter resmi Spring Boot

Referensi utama: Craig Walls, *Spring Boot in Action* (Manning Publications, 2016), Chapter 3 -- Customizing Configuration.
