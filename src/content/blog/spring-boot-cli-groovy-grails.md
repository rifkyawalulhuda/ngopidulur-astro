---
title: "Spring Boot CLI, Groovy, dan Grails - Rapid Development"
description: Eksplorasi Spring Boot CLI dan Groovy untuk prototyping cepat -
  tulis web app dalam satu file Groovy, Grape dependency management, GORM
  dengan Grails, scaffolding, dan GSP template untuk full-stack Java/Groovy.
pubDate: 2026-08-21T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Groovy
  - Grails
  - Java
---

Spring Boot bukan hanya untuk Java. Chapter 5 dan 6 dari *Spring Boot in Action* memperkenalkan dua cara alternatif yang lebih ekspresif: **Spring Boot CLI** dengan Groovy untuk prototyping super cepat, dan **Grails** sebagai full-stack framework yang dibangun di atas Spring Boot.

## Daftar Isi

- [Spring Boot CLI: Install dan Setup](#spring-boot-cli-install-dan-setup)
- [Groovy vs Java: Mengapa Lebih Ringkas](#groovy-vs-java-mengapa-lebih-ringkas)
- [Hello World dengan Groovy CLI](#hello-world-dengan-groovy-cli)
- [Grape: Dependency Management di Groovy](#grape-dependency-management-di-groovy)
- [Aplikasi Reading List dalam Groovy](#aplikasi-reading-list-dalam-groovy)
- [Package dan Jalankan Groovy App](#package-dan-jalankan-groovy-app)
- [Grails: Full-Stack dengan Spring Boot](#grails-full-stack-dengan-spring-boot)
- [GORM: Object Relational Mapping Grails](#gorm-object-relational-mapping-grails)
- [Scaffolding CRUD Otomatis](#scaffolding-crud-otomatis)



## Spring Boot CLI: Install dan Setup

Spring Boot CLI memungkinkan kamu menjalankan aplikasi Spring Boot langsung dari file Groovy — tanpa project structure, tanpa `pom.xml`, tanpa compile manual.

### Instalasi

```bash
# Via SDKMAN (direkomendasikan, Linux/Mac)
sdk install springboot
spring --version

# Via Homebrew (Mac)
brew tap spring-io/tap
brew install spring-boot

# Manual (Windows/Linux)
# Download spring-boot-cli-x.x.x-bin.zip dari spring.io
# Ekstrak dan tambahkan ke PATH
set PATH=%PATH%;C:\spring-x.x.x\bin
spring --version
```

### Perintah Dasar CLI

```bash
# Jalankan file Groovy
spring run app.groovy

# Jalankan dengan dependencies tambahan
spring run app.groovy -- --server.port=9090

# Buat project baru
spring init --dependencies=web,data-jpa,thymeleaf myproject
spring init --build=gradle --dependencies=web myproject.zip

# Package ke JAR
spring jar app.jar app.groovy

# Test Groovy
spring test tests.groovy

# Masuk shell interaktif
spring shell
```



## Groovy vs Java: Mengapa Lebih Ringkas

Groovy menghilangkan banyak boilerplate Java:

```java
// Java: perlu import, tipe eksplisit, semicolon, getter/setter
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {
    @RequestMapping("/")
    public String hello() {
        return "Hello, World!";
    }
}
```

```groovy
// Groovy: tidak perlu import umum, tidak perlu public, tidak perlu semicolon
@RestController
class HelloController {
    @RequestMapping("/")
    String hello() {
        "Hello, World!"  // return implicit
    }
}
```

Spring Boot CLI bahkan lebih jauh — import Spring MVC ditambahkan otomatis:

```groovy
// app.groovy - ini CUKUP untuk web app!
@RestController
class HelloController {
    @RequestMapping("/")
    String hello() {
        "Hello, World!"
    }
}
```

```bash
spring run app.groovy
# → Server start di http://localhost:8080
```



## Hello World dengan Groovy CLI

```groovy
// hello.groovy
@RestController
class HelloController {

    @RequestMapping("/")
    String home() {
        "Hello dari Spring Boot CLI!"
    }

    @RequestMapping("/json")
    Map<String, Object> jsonResponse() {
        [
            message: "Hello JSON",
            timestamp: new Date().toString(),
            status: "ok"
        ]
    }
}
```

```bash
spring run hello.groovy
curl http://localhost:8080/
# Hello dari Spring Boot CLI!
curl http://localhost:8080/json
# {"message":"Hello JSON","timestamp":"...","status":"ok"}
```



## Grape: Dependency Management di Groovy

Grape adalah sistem dependency management Groovy yang bekerja seperti Maven tapi di runtime:

```groovy
// Tambahkan dependency dengan @Grab
@Grab("com.h2database:h2")
@Grab(group="org.springframework.boot", module="spring-boot-starter-data-jpa", version="3.2.0")

// Atau pakai format singkat
@GrabMetadata("io.spring.platform:platform-bom:2.0.8.RELEASE")
```

Spring Boot CLI secara otomatis mendeteksi banyak dependency dari kode — kalau kamu pakai `@Entity`, ia otomatis grab JPA starter.



## Aplikasi Reading List dalam Groovy

Berikut adalah aplikasi reading list lengkap dalam beberapa file Groovy:

```groovy
// Book.groovy
@Entity
class Book {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    Long id
    String reader
    String isbn
    String title
    String author
    String description
}
```

```groovy
// ReadingListRepository.groovy
interface ReadingListRepository extends JpaRepository<Book, Long> {
    List<Book> findByReader(String reader)
}
```

```groovy
// ReadingListController.groovy
@Controller
@RequestMapping("/{reader}")
class ReadingListController {

    @Autowired
    ReadingListRepository readingListRepository

    @RequestMapping(method=RequestMethod.GET)
    def readersBooks(@PathVariable("reader") String reader, Model model) {
        def readingList = readingListRepository.findByReader(reader)
        if (readingList) {
            model["books"] = readingList
        }
        "readingList"
    }

    @RequestMapping(method=RequestMethod.POST)
    def addToReadingList(@PathVariable("reader") String reader, Book book) {
        book.setReader(reader)
        readingListRepository.save(book)
        "redirect:/{reader}"
    }
}
```

```groovy
// SecurityConfig.groovy
@Configuration
@EnableWebSecurity
class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/").permitAll()
                .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user").password("{noop}password").roles("USER")
    }
}
```

```bash
# Jalankan semua file sekaligus
spring run *.groovy
```



## Package dan Jalankan Groovy App

```bash
# Package ke executable JAR
spring jar readinglist.jar *.groovy

# Jalankan JAR
java -jar readinglist.jar

# Dengan environment-specific config
java -jar readinglist.jar --spring.profiles.active=production

# Package dengan exclude
spring jar app.jar --include *.groovy --exclude test_*.groovy *.groovy
```

### Testing dengan Spock

```groovy
// ReadingListControllerSpec.groovy
@SpringBootTest
class ReadingListControllerSpec extends Specification {

    @Autowired
    MockMvc mockMvc

    def "home page shows books"() {
        given:
        def book = new Book(title: "Spring Boot", author: "Craig Walls", reader: "user")
        // setup mock...

        when:
        def result = mockMvc.perform(get("/user"))

        then:
        result.andExpect(status().isOk())
              .andExpect(model().attributeExists("books"))
    }
}
```



## Grails: Full-Stack dengan Spring Boot

Grails adalah framework full-stack berbasis Groovy yang sejak versi 3 dibangun di atas Spring Boot.

### Mengapa Grails?

- **Convention over configuration** — struktur direktori yang jelas
- **GORM** — ORM powerful dengan Groovy DSL
- **GSP** — Groovy Server Pages untuk templating
- **Scaffolding** — generate CRUD otomatis
- **Plugin ecosystem** — ratusan plugin siap pakai

### Instalasi dan Project Baru

```bash
# Install via SDKMAN
sdk install grails
grails --version

# Buat project baru
grails create-app bookstore --profile=web
cd bookstore

# Struktur direktori
# grails-app/
#   controllers/   ← HTTP controllers
#   domain/        ← domain classes (entities)
#   services/      ← business logic
#   views/         ← GSP templates
#   conf/          ← configuration
# src/
#   main/
#   test/
```

### Membuat Domain Class dan Controller

```bash
# Generate domain class
grails create-domain-class Book

# Generate controller untuk Book
grails create-controller Book

# Generate semua sekaligus (CRUD lengkap)
grails generate-all Book
```



## GORM: Object Relational Mapping Grails

```groovy
// grails-app/domain/bookstore/Book.groovy
package bookstore

class Book {
    String title
    String author
    String isbn
    String description
    Date dateAdded = new Date()
    Reader reader

    static constraints = {
        title blank: false, maxSize: 255
        author blank: false
        isbn blank: false, unique: true, matches: /[0-9]{13}/
        description nullable: true, maxSize: 2000
    }

    static mapping = {
        description type: "text"
        table "reading_books"
    }

    static belongsTo = [reader: Reader]
}
```

```groovy
// grails-app/domain/bookstore/Reader.groovy
package bookstore

class Reader {
    String username
    String fullName
    String password

    static hasMany = [books: Book]

    static constraints = {
        username unique: true, blank: false
        fullName blank: false
        password blank: false, password: true
    }
}
```

### GORM Queries

```groovy
// Dynamic finders
def books = Book.findAllByReader(reader)
def book = Book.findByIsbn("9781617292545")
def springBooks = Book.findAllByTitleLike("%Spring%")

// Criteria API
def results = Book.withCriteria {
    ilike "title", "%Spring%"
    order "dateAdded", "desc"
    maxResults 10
}

// HQL
def books = Book.executeQuery(
    "FROM Book b WHERE b.reader.username = :user ORDER BY b.dateAdded DESC",
    [user: "craig"]
)

// GORM 6+ - where queries
def books = Book.where {
    reader.username == "craig" && title =~ "%Spring%"
}.list(max: 10, sort: "dateAdded", order: "desc")
```



## Scaffolding CRUD Otomatis

```bash
# Generate controller + views untuk Book
grails generate-all bookstore.Book
```

Ini menghasilkan:
- `BookController.groovy` — CRUD actions (list, show, create, save, edit, update, delete)
- `views/book/` — GSP views untuk setiap action

```groovy
// Generated BookController.groovy (snippet)
class BookController {
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Book.list(params), model:[bookCount: Book.count()]
    }

    def show(Book book) {
        respond book
    }

    def create() {
        respond new Book(params)
    }

    def save(Book book) {
        if (book == null) {
            notFound()
            return
        }
        if (book.hasErrors()) {
            respond book.errors, view:'create'
            return
        }
        book.save flush:true
        redirect action:"show", id:book.id
    }
}
```

### GSP Template

```html
<!-- grails-app/views/book/list.gsp -->
<!DOCTYPE html>
<html>
<head>
    <title>Reading List</title>
    <asset:stylesheet src="application.css"/>
</head>
<body>
    <h1>My Reading List</h1>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <g:each in="${bookList}" var="book">
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>
                        <g:link action="show" id="${book.id}">Detail</g:link>
                        <g:link action="edit" id="${book.id}">Edit</g:link>
                        <g:form method="DELETE" action="delete" id="${book.id}">
                            <g:submitButton name="delete" value="Hapus"/>
                        </g:form>
                    </td>
                </tr>
            </g:each>
        </tbody>
    </table>
    <g:link action="create">Tambah Buku</g:link>
</body>
</html>
```



## Ringkasan Perbandingan

| | Spring Boot CLI | Grails | Spring Boot Java |
|--|---|---|---|
| Bahasa | Groovy | Groovy | Java/Kotlin |
| Boilerplate | Minimal | Sedang | Sedang |
| Cocok untuk | Prototyping | Full-stack app | Enterprise app |
| ORM | JPA/Hibernate | GORM | Spring Data JPA |
| Template | Thymeleaf/Mustache | GSP | Thymeleaf/Freemarker |
| Learning curve | Rendah | Sedang | Sedang-Tinggi |



**Sumber:** Craig Walls, *Spring Boot in Action* (2016), Manning Publications.
