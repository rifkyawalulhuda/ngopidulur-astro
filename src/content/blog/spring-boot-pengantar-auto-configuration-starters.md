---
title: "Spring Boot: Auto-Configuration, Starters, dan Spring Initializr"
description: Kenali Spring Boot dari nol - filosofi convention over configuration,
  cara kerja auto-configuration, Spring Boot Starters, Spring Initializr, dan
  membangun aplikasi web pertama dengan embedded Tomcat tanpa XML config.
pubDate: 2026-08-18T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Java
  - WebDevelopment
  - Framework
---

Kalau kamu pernah membangun aplikasi Java dengan Spring Framework versi klasik, kamu pasti tahu rasanya: file XML konfigurasi yang panjangnya bisa ratusan baris, dependency yang bentrok satu sama lain, dan boilerplate code yang harus ditulis berulang-ulang sebelum bisa melihat satu halaman "Hello World". Spring Boot hadir untuk mengatasi semua itu — dengan prinsip sederhana tapi powerful: **convention over configuration**.

Artikel ini merangkum esensi dari buku *Spring Boot in Action* karya Craig Walls (Manning, 2016), khususnya Chapter 1 dan 2, yang membahas fondasi Spring Boot dan cara membangun aplikasi pertama dari nol.

## Masalah Spring Klasik yang Membuat Frustasi

Spring Framework adalah salah satu ekosistem Java paling populer. Tapi versi klasiknya punya banyak gesekan yang membuat developer baru merasa kewalahan.

### 1. Konfigurasi XML yang Membengkak

Di Spring tradisional, hampir semua konfigurasi ditulis dalam file XML. Berikut contoh konfigurasi minimal untuk aplikasi web dengan database:

```xml
<!-- applicationContext.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="...">

  <context:component-scan base-package="com.example" />

  <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="org.h2.Driver" />
    <property name="url" value="jdbc:h2:~/test" />
    <property name="username" value="sa" />
    <property name="password" value="" />
  </bean>

  <bean id="entityManagerFactory"
        class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
    <property name="dataSource" ref="dataSource" />
    <property name="packagesToScan" value="com.example.domain" />
    <property name="jpaVendorAdapter">
      <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
        <property name="showSql" value="true" />
      </bean>
    </property>
  </bean>

  <bean id="transactionManager"
        class="org.springframework.orm.jpa.JpaTransactionManager">
    <property name="entityManagerFactory" ref="entityManagerFactory" />
  </bean>

  <tx:annotation-driven transaction-manager="transactionManager" />

</beans>
```

Belum termasuk konfigurasi Spring MVC, security, dan lainnya. Ini hanya untuk database saja.

### 2. Dependency Hell

File `pom.xml` di proyek Spring klasik bisa memuat puluhan dependency yang harus dikelola versinya secara manual. Salah satu versi tidak cocok, aplikasi gagal berjalan dengan error yang membingungkan:

```xml
<!-- Ini menyakitkan untuk dikelola secara manual -->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-core</artifactId>
  <version>4.3.12.RELEASE</version>
</dependency>
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-webmvc</artifactId>
  <version>4.3.12.RELEASE</version>
</dependency>
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-data-jpa</artifactId>
  <version>1.11.8.RELEASE</version>
</dependency>
<!-- ... dan seterusnya, belum termasuk Hibernate, Jackson, dll -->
```

### 3. Boilerplate Tanpa Nilai Tambah

Kode-kode seperti inisialisasi `DispatcherServlet`, konfigurasi `ViewResolver`, dan setup `TransactionManager` harus ditulis di setiap proyek baru, meski logikanya selalu sama. Developer membuang waktu berjam-jam hanya untuk infrastruktur, bukan logika bisnis.

## Spring Boot Hadir: Convention Over Configuration

Spring Boot, yang diperkenalkan oleh Pivotal pada 2014 dan matang di versi 1.x era 2015-2016, mengambil pendekatan yang berbeda. Alih-alih memaksa developer mendefinisikan semuanya, Spring Boot **membuat asumsi yang masuk akal** berdasarkan apa yang ada di classpath.

Craig Walls dalam bukunya merangkum ini dengan elegan: *"Spring Boot does this by offering four principal features: automatic configuration, starter dependencies, the Spring Boot CLI, and the Actuator."*

Spring Boot **bukan** framework baru yang menggantikan Spring. Ia adalah lapisan di atas Spring yang mengurangi boilerplate sambil tetap memberikan akses penuh ke semua fitur Spring.

## 4 Fitur Inti Spring Boot

### 1. Auto-Configuration

Auto-configuration adalah jantung Spring Boot. Ketika Spring Boot mendeteksi library tertentu di classpath, ia secara otomatis mengkonfigurasi bean yang relevan.

Misalnya, kalau `spring-webmvc` dan `Tomcat` ada di classpath, Spring Boot otomatis:
- Membuat dan mendaftarkan `DispatcherServlet`
- Mengkonfigurasi `InternalResourceViewResolver` default
- Menjalankan embedded Tomcat di port 8080

Semua ini dipicu oleh satu anotasi: `@SpringBootApplication`.

```java
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

`@SpringBootApplication` adalah meta-anotasi yang menggabungkan tiga anotasi sekaligus:
- `@Configuration` — menandai kelas sebagai sumber bean definition
- `@ComponentScan` — mengaktifkan component scanning
- `@EnableAutoConfiguration` — mengaktifkan mekanisme auto-configuration

### 2. Starter Dependencies

Spring Boot Starters adalah kumpulan dependency yang sudah dikurasi dan sudah terbukti bekerja bersama-sama. Alih-alih menambahkan puluhan dependency secara manual, kamu cukup menambahkan satu starter:

```xml
<!-- Untuk aplikasi web -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Untuk JPA + database -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Untuk Spring Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Untuk testing -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

Setiap starter menarik semua dependency yang dibutuhkan dengan versi yang sudah teruji kompatibilitasnya. Tidak ada lagi versi conflicts.

### 3. Spring Initializr

Spring Initializr di [start.spring.io](https://start.spring.io) adalah generator proyek berbasis web. Pilih build tool (Maven/Gradle), bahasa (Java/Kotlin/Groovy), versi Spring Boot, metadata proyek, dan dependency yang diinginkan — klik Generate, dan kamu mendapat proyek siap pakai dalam hitungan detik.

Tersedia dalam beberapa cara:
- **Web UI** di start.spring.io
- **REST API** via curl
- **IDE plugin** (IntelliJ IDEA, Eclipse, VS Code)
- **Spring Boot CLI**

### 4. Actuator

Spring Boot Actuator menambahkan endpoint monitoring yang siap production: `/actuator/health`, `/actuator/metrics`, `/actuator/info`, dan banyak lagi. Sangat berguna untuk observability tanpa kode tambahan.

```yaml
# application.yml - mengekspos semua endpoint actuator
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

## Apa yang Spring Boot Bukan

Penting untuk memahami batas Spring Boot agar tidak salah ekspektasi:

- **Bukan kode baru** — Spring Boot tidak menulis ulang Spring Core, Spring MVC, atau Spring Data. Ia menggunakan library yang sama persis.
- **Bukan framework baru** — Ini masih Spring. Semua yang kamu pelajari tentang Spring tetap berlaku.
- **Bukan magic** — Auto-configuration bekerja secara deterministik berdasarkan kondisi yang jelas. Kamu bisa melihat apa yang dikonfigurasi dan meng-override semuanya.
- **Bukan pembatasan** — Kamu tetap bisa melakukan konfigurasi manual jika diperlukan. Spring Boot hanya memberikan default yang masuk akal.

## Cara Kerja Auto-Configuration secara Mendalam

Auto-configuration Spring Boot diimplementasikan menggunakan `@Conditional` annotations dari Spring Framework. Mekanisme intinya ada di `spring.factories` (atau `AutoConfiguration.imports` di Boot 3.x):

```
# spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
  org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
  org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,\
  ...
```

Setiap kelas auto-configuration menggunakan kondisi untuk memutuskan apakah harus aktif:

```java
@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
@Import({ DataSourcePoolMetadataProvidersConfiguration.class,
          DataSourceInitializationConfiguration.class })
public class DataSourceAutoConfiguration {

    @Configuration
    @Conditional(EmbeddedDatabaseCondition.class)
    @ConditionalOnMissingBean({ DataSource.class, XADataSource.class })
    @Import(EmbeddedDataSourceConfiguration.class)
    protected static class EmbeddedDatabaseConfiguration {
    }

    @Configuration
    @ConditionalOnMissingBean({ DataSource.class, XADataSource.class })
    @ConditionalOnProperty(prefix = "spring.datasource", name = "url")
    protected static class PooledDataSourceConfiguration {
        // konfigurasi DataSource dari properties
    }
}
```

Anotasi conditional utama yang sering digunakan:

| Anotasi | Kondisi Aktif |
|---|---|
| `@ConditionalOnClass` | Kelas tertentu ada di classpath |
| `@ConditionalOnMissingBean` | Bean tertentu belum didefinisikan |
| `@ConditionalOnProperty` | Property tertentu memiliki nilai tertentu |
| `@ConditionalOnMissingClass` | Kelas tertentu tidak ada di classpath |
| `@ConditionalOnWebApplication` | Aplikasi adalah web application |
| `@ConditionalOnBean` | Bean tertentu sudah didefinisikan |

Artinya, auto-configuration Spring Boot **selalu kalah** dengan konfigurasi eksplisit yang kamu buat. Kalau kamu mendefinisikan `DataSource` bean sendiri, `DataSourceAutoConfiguration` akan mundur secara otomatis.

## Spring Initializr: Memulai Proyek dalam Hitungan Detik

### Via Web UI

Buka [start.spring.io](https://start.spring.io), isi form:
- **Project**: Maven Project
- **Language**: Java
- **Spring Boot**: 1.5.x (atau versi terbaru)
- **Group**: com.example
- **Artifact**: readinglist
- **Dependencies**: Web, JPA, H2, Thymeleaf, Security

Klik "Generate Project", ekstrak ZIP, dan buka di IDE.

### Via curl

```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,jpa,h2,thymeleaf,security \
  -d name=readinglist \
  -d artifactId=readinglist \
  -d groupId=com.example \
  -o readinglist.zip

unzip readinglist.zip
```

### Via Spring Boot CLI

```bash
spring init --dependencies=web,jpa,h2,thymeleaf,security readinglist
```

## Membangun Aplikasi Reading List

Sebagai demonstrasi, kita akan membangun aplikasi reading list sederhana — pengguna bisa menyimpan daftar buku yang ingin dibaca. Ini adalah contoh langsung dari buku Craig Walls.

### Struktur Proyek

```
readinglist/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/readinglist/
│   │   │       ├── ReadingListApplication.java
│   │   │       ├── ReadingListController.java
│   │   │       ├── Book.java
│   │   │       └── ReadingListRepository.java
│   │   └── resources/
│   │       ├── templates/
│   │       │   └── readingList.html
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/example/readinglist/
│               └── ReadingListApplicationTests.java
├── pom.xml
└── build.gradle
```

### Entry Point: ReadingListApplication.java

```java
package com.example.readinglist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReadingListApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReadingListApplication.class, args);
    }
}
```

Satu kelas, satu anotasi, satu method. Inilah entry point seluruh aplikasi. `@SpringBootApplication` mengaktifkan auto-configuration, component scanning, dan konfigurasi berbasis Java sekaligus.

### Model: Book.java

```java
package com.example.readinglist;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String reader;
    private String isbn;
    private String title;
    private String author;
    private String description;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReader() { return reader; }
    public void setReader(String reader) { this.reader = reader; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
```

Anotasi `@Entity` memberi tahu JPA bahwa kelas ini adalah tabel database. `@Id` dan `@GeneratedValue` mengkonfigurasi primary key dengan auto-increment. Tidak ada XML sama sekali.

### Repository: ReadingListRepository.java

```java
package com.example.readinglist;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingListRepository extends JpaRepository<Book, Long> {

    List<Book> findByReader(String reader);
}
```

Cukup interface yang extends `JpaRepository` — Spring Data JPA otomatis mengimplementasikan semua operasi CRUD plus method `findByReader` berdasarkan konvensi penamaan. Tidak ada query SQL, tidak ada implementasi manual.

### Controller: ReadingListController.java

```java
package com.example.readinglist;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/readingList")
public class ReadingListController {

    private ReadingListRepository readingListRepository;

    @Autowired
    public ReadingListController(ReadingListRepository readingListRepository) {
        this.readingListRepository = readingListRepository;
    }

    @RequestMapping(value = "/{reader}", method = RequestMethod.GET)
    public String readersBooks(
            @PathVariable("reader") String reader,
            Model model) {

        List<Book> readingList = readingListRepository.findByReader(reader);

        if (readingList != null) {
            model.addAttribute("books", readingList);
        }

        return "readingList";
    }

    @RequestMapping(value = "/{reader}", method = RequestMethod.POST)
    public String addToReadingList(
            @PathVariable("reader") String reader,
            Book book) {

        book.setReader(reader);
        readingListRepository.save(book);

        return "redirect:/readingList/{reader}";
    }
}
```

Controller ini menangani dua request: GET untuk menampilkan daftar buku, dan POST untuk menambahkan buku baru. Spring MVC secara otomatis menginject `ReadingListRepository` dan mengelola routing.

### Template Thymeleaf: readingList.html

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <title>Reading List</title>
  <link rel="stylesheet"
        th:href="@{/style.css}"
        href="style.css" />
</head>
<body>
  <h2>Your Reading List</h2>

  <div th:unless="${#lists.isEmpty(books)}">
    <dl th:each="book : ${books}">
      <dt class="bookHeadline">
        <span th:text="${book.title}">Title</span> by
        <span th:text="${book.author}">Author</span>
        (ISBN: <span th:text="${book.isbn}">ISBN</span>)
      </dt>
      <dd class="bookDescription">
        <span th:if="${book.description}"
              th:text="${book.description}">Description</span>
        <span th:if="${book.description == null}">No description available</span>
      </dd>
    </dl>
  </div>

  <div th:if="${#lists.isEmpty(books)}">
    <p>You have no books in your book list</p>
  </div>

  <hr />

  <h3>Add a book</h3>
  <form method="POST">
    <label for="title">Title:</label>
    <input type="text" name="title" size="50" /><br />
    <label for="author">Author:</label>
    <input type="text" name="author" size="50" /><br />
    <label for="isbn">ISBN:</label>
    <input type="text" name="isbn" size="15" /><br />
    <label for="description">Description:</label><br />
    <textarea name="description" cols="80" rows="5"></textarea><br />
    <input type="submit" value="Add Book" />
  </form>
</body>
</html>
```

### Konfigurasi Aplikasi: application.yml

```yaml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop

  thymeleaf:
    cache: false

  h2:
    console:
      enabled: true
      path: /h2-console

server:
  port: 8080

logging:
  level:
    com.example: DEBUG
```

H2 adalah database in-memory yang otomatis dikonfigurasi Spring Boot ketika ada di classpath. Cocok untuk development dan testing. `ddl-auto: create-drop` membuat schema otomatis dari entitas JPA saat startup dan menghapusnya saat shutdown.

### Konfigurasi Security

Dengan `spring-boot-starter-security` di classpath, Spring Boot otomatis mengaktifkan Basic Auth untuk semua endpoint. Untuk kustomisasi, buat kelas konfigurasi:

```java
package com.example.readinglist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/**").hasRole("USER")
                .and()
            .formLogin()
                .loginPage("/login")
                .failureUrl("/login?error=true");
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user").password("password").roles("USER");
    }
}
```

## pom.xml vs build.gradle

### Maven: pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
           http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>readinglist</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <!-- Spring Boot parent mengatur semua versi dependency -->
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.3.2.RELEASE</version>
    <relativePath/>
  </parent>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Plugin untuk membuat executable JAR -->
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

Perhatikan tidak ada versi di setiap dependency — semuanya dikelola oleh `spring-boot-starter-parent`.

### Gradle: build.gradle

```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.3.2.RELEASE")
    }
}

apply plugin: 'java'
apply plugin: 'spring-boot'

repositories {
    jcenter()
}

dependencies {
    compile("org.springframework.boot:spring-boot-starter-web")
    compile("org.springframework.boot:spring-boot-starter-data-jpa")
    compile("org.springframework.boot:spring-boot-starter-thymeleaf")
    compile("org.springframework.boot:spring-boot-starter-security")
    runtime("com.h2database:h2")
    testCompile("org.springframework.boot:spring-boot-starter-test")
}
```

Gradle versi ini lebih ringkas. Plugin `spring-boot` menangani manajemen versi dependency secara otomatis.

### Menjalankan Aplikasi

```bash
# Dengan Maven
mvn spring-boot:run

# Atau build dulu, lalu jalankan
mvn package
java -jar target/readinglist-0.0.1-SNAPSHOT.jar

# Dengan Gradle
gradle bootRun

# Atau
gradle build
java -jar build/libs/readinglist-0.0.1-SNAPSHOT.jar
```

Aplikasi akan berjalan di `http://localhost:8080`. Embedded Tomcat sudah di-bundle ke dalam JAR — tidak perlu deploy ke server eksternal.

## Perbandingan: Spring Tradisional vs Spring Boot

| Aspek | Spring Tradisional | Spring Boot |
|---|---|---|
| Konfigurasi | XML atau Java config manual | Auto-configuration berdasarkan classpath |
| Dependency management | Manual, rawan versi konflik | Dikelola via starter parent/BOM |
| Web server | Deploy WAR ke Tomcat/Jetty eksternal | Embedded Tomcat/Jetty/Undertow |
| Entry point | web.xml + ContextLoaderListener | `main()` method biasa |
| Startup time setup | Berjam-jam untuk proyek baru | Menit via Spring Initializr |
| Database config | XML DataSource + persistence.xml | application.properties/yml saja |
| Production monitoring | Perlu library tambahan | Built-in via Actuator |
| Override konfigurasi | Ubah XML atau Java config | Override bean atau property |
| Testing | Perlu setup ApplicationContext manual | `@SpringBootTest` siap pakai |
| Packaging | WAR file | Executable fat JAR |

## Rangkuman

Spring Boot tidak merevolusi cara kerja Spring — ia menyingkirkan rintangan yang selama ini menghambat produktivitas. Dengan auto-configuration, kamu bisa fokus pada business logic. Dengan starter dependencies, kamu tidak perlu lagi menghabiskan waktu menyelaraskan versi library. Dengan Spring Initializr, proyek baru bisa siap dalam hitungan menit.

Yang terpenting: Spring Boot tetap transparan. Kamu bisa melihat apa yang dikonfigurasi secara otomatis (`--debug` flag atau endpoint `/actuator/conditions`), dan kamu bisa meng-override apa pun yang tidak sesuai kebutuhan. Ini bukan magic — ini adalah pendekatan yang pragmatis dan terstruktur terhadap masalah konfigurasi yang sudah lama menghantui ekosistem Java enterprise.

Untuk eksplorasi lebih dalam, buku Craig Walls memberikan panduan lengkap mulai dari testing, Actuator, deployment, hingga customization lanjutan yang sangat direkomendasikan bagi developer Java yang serius dengan Spring Boot.

**Sumber:** Craig Walls, *Spring Boot in Action* (2016), Manning Publications.
