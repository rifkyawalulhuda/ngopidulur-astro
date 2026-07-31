---
title: "Spring Boot Testing: MockMvc, Integration Test, dan Selenium"
description: Panduan lengkap testing aplikasi Spring Boot - unit test dengan
  @SpringBootTest, MockMvc untuk web layer, integration test dengan embedded
  server, Selenium end-to-end, test slice annotations, dan mock dengan @MockBean.
pubDate: 2026-08-20T08:00:00.000Z
image: /image/springboot-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - SpringBoot
  - Testing
  - Java
  - MockMvc
---

Testing adalah bagian yang tidak terpisahkan dari pengembangan aplikasi Spring Boot yang baik. Chapter 4 dari *Spring Boot in Action* membahas berbagai strategi testing — dari unit test sederhana hingga integration test penuh dengan embedded server dan Selenium untuk end-to-end testing.

## Daftar Isi

- [Kenapa Testing di Spring Boot Berbeda](#kenapa-testing-di-spring-boot-berbeda)
- [@SpringBootTest: Full Context Loading](#springboottest-full-context-loading)
- [MockMvc: Testing Web Layer](#mockmvc-testing-web-layer)
- [Integration Test dengan Embedded Server](#integration-test-dengan-embedded-server)
- [Mock Dependencies dengan @MockBean](#mock-dependencies-dengan-mockbean)
- [Test Slices: WebMvcTest, DataJpaTest, JsonTest](#test-slices)
- [Testing Spring Security](#testing-spring-security)
- [Selenium End-to-End Testing](#selenium-end-to-end-testing)



## Kenapa Testing di Spring Boot Berbeda

Spring Boot mengubah cara kita menulis test. Dulu, untuk test Spring MVC butuh setup `DispatcherServlet` secara manual. Sekarang, dengan beberapa annotation, kamu bisa test seluruh stack.

```xml
<!-- pom.xml: spring-boot-starter-test sudah include semua yang dibutuhkan -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- Sudah include: JUnit 5, Mockito, MockMvc, AssertJ, Hamcrest, JsonPath -->
```



## @SpringBootTest: Full Context Loading

`@SpringBootTest` memuat seluruh ApplicationContext — cocok untuk integration test.

```java
@SpringBootTest
@AutoConfigureMockMvc
class ReadingListApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
    }

    @Test
    void contextLoads() {
        // Membuktikan context bisa start tanpa error
    }

    @Test
    void homePageRequiresLogin() throws Exception {
        mockMvc.perform(get("/"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrlPattern("**/login"));
    }

    @Test
    @WithMockUser(username = "user", roles = "READER")
    void homePageShowsBooks() throws Exception {
        Book book = new Book();
        book.setTitle("Spring Boot in Action");
        book.setAuthor("Craig Walls");
        book.setIsbn("9781617292545");
        book.setReader("user");
        bookRepository.save(book);

        mockMvc.perform(get("/"))
            .andExpect(status().isOk())
            .andExpect(view().name("readingList"))
            .andExpect(model().attributeExists("books"))
            .andExpect(model().attribute("books", hasSize(1)));
    }
}
```



## MockMvc: Testing Web Layer

MockMvc memungkinkan testing HTTP request dan response tanpa server sungguhan.

```java
@WebMvcTest(ReadingListController.class)
class ReadingListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReadingListRepository readingListRepository;

    @MockBean
    private AmazonProperties amazonProperties;

    @Test
    @WithMockUser(username = "craig", roles = "READER")
    void shouldShowReadingList() throws Exception {
        Reader expectedReader = new Reader();
        expectedReader.setUsername("craig");

        Book book = new Book();
        book.setId(1L);
        book.setReader("craig");
        book.setIsbn("9781617292545");
        book.setTitle("Spring Boot in Action");
        book.setAuthor("Craig Walls");
        book.setDescription("Learn Spring Boot");

        given(readingListRepository.findByReader("craig"))
            .willReturn(singletonList(book));

        mockMvc.perform(get("/craig"))
            .andExpect(status().isOk())
            .andExpect(view().name("readingList"))
            .andExpect(model().attributeExists("books"))
            .andExpect(model().attribute("books", hasSize(1)))
            .andExpect(model().attribute("books",
                contains(samePropertyValuesAs(book))));
    }

    @Test
    @WithMockUser(username = "craig", roles = "READER")
    void shouldSaveBook() throws Exception {
        mockMvc.perform(post("/craig")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("title", "Spring Boot in Action")
            .param("author", "Craig Walls")
            .param("isbn", "9781617292545")
            .param("description", "Hands-on guide to Spring Boot"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/craig"));

        verify(readingListRepository).save(any(Book.class));
    }

    @Test
    @WithMockUser(username = "craig", roles = "READER")
    void shouldReturn400ForInvalidBook() throws Exception {
        mockMvc.perform(post("/craig")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("title", "")  // title kosong
            .param("author", "Craig Walls"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRedirectToLoginWhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/craig"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrlPattern("**/login"));
    }
}
```

### Request Matchers Lengkap

```java
// HTTP Methods
perform(get("/api/books"))
perform(post("/api/books").content(json).contentType(APPLICATION_JSON))
perform(put("/api/books/1").content(json))
perform(delete("/api/books/1"))
perform(patch("/api/books/1").content(json))

// Headers
perform(get("/api").header("Authorization", "Bearer token"))
perform(get("/api").accept(APPLICATION_JSON))

// Parameters
perform(get("/api/books").param("page", "1").param("size", "10"))
perform(get("/api/books/{id}", 1L))

// Result Matchers
.andExpect(status().isOk())              // 200
.andExpect(status().isCreated())         // 201
.andExpect(status().isNotFound())        // 404
.andExpect(content().contentType(APPLICATION_JSON))
.andExpect(content().json("{...}"))
.andExpect(jsonPath("$.title").value("Spring Boot in Action"))
.andExpect(jsonPath("$.books").isArray())
.andExpect(jsonPath("$.books", hasSize(3)))
.andExpect(header().string("Location", containsString("/api/books/")))
.andDo(print())  // print request/response untuk debugging
```



## Integration Test dengan Embedded Server

Untuk test yang lebih realistis, gunakan embedded server dengan random port:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ReadingListIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @LocalServerPort
    private int port;

    @Autowired
    private BookRepository bookRepository;

    private String baseUrl() {
        return "http://localhost:" + port;
    }

    @Test
    void homePageRedirectsToLogin() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl() + "/", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(response.getHeaders().getLocation().toString())
            .contains("/login");
    }

    @Test
    void apiReturnsBooksList() {
        Book book = bookRepository.save(new Book("Spring Boot", "Craig Walls", "user1"));

        ResponseEntity<String> response = restTemplate
            .withBasicAuth("user1", "password")
            .getForEntity(baseUrl() + "/api/books", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("Spring Boot");
    }

    @Test
    void createBook() {
        Map<String, String> bookData = new HashMap<>();
        bookData.put("title", "Clean Code");
        bookData.put("author", "Robert Martin");
        bookData.put("isbn", "9780132350884");

        ResponseEntity<Book> response = restTemplate
            .withBasicAuth("user1", "password")
            .postForEntity(baseUrl() + "/api/books", bookData, Book.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getTitle()).isEqualTo("Clean Code");
        assertThat(response.getHeaders().getLocation()).isNotNull();
    }
}
```



## Mock Dependencies dengan @MockBean

`@MockBean` mengganti bean Spring dengan Mockito mock:

```java
@SpringBootTest
class BookServiceTest {

    @Autowired
    private BookService bookService;

    @MockBean
    private BookRepository bookRepository;

    @MockBean
    private AmazonBookCoverService coverService;

    @Test
    void shouldReturnBooksWithCovers() {
        // Arrange
        Book book = new Book("Spring Boot", "Craig Walls", "user1");
        given(bookRepository.findByReader("user1"))
            .willReturn(singletonList(book));
        given(coverService.getCoverUrl("9781617292545"))
            .willReturn("https://cover.example.com/9781617292545.jpg");

        // Act
        List<BookWithCover> result = bookService.getBooksWithCovers("user1");

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCoverUrl())
            .isEqualTo("https://cover.example.com/9781617292545.jpg");

        // Verify interactions
        verify(bookRepository).findByReader("user1");
        verify(coverService).getCoverUrl("9781617292545");
    }

    @Test
    void shouldHandleMissingCover() {
        given(bookRepository.findByReader("user1"))
            .willReturn(singletonList(new Book()));
        given(coverService.getCoverUrl(any()))
            .willThrow(new RuntimeException("Cover not found"));

        List<BookWithCover> result = bookService.getBooksWithCovers("user1");

        assertThat(result.get(0).getCoverUrl()).isNull();
    }
}
```



## Test Slices

Test slices memuat hanya subset dari ApplicationContext — lebih cepat dari `@SpringBootTest` penuh.

### @WebMvcTest: Hanya Web Layer

```java
@WebMvcTest(BookController.class)
// Hanya load: Controller, ControllerAdvice, Filter, WebMvcConfigurer
// TIDAK load: Service, Repository, DataSource
class BookControllerSliceTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;  // wajib mock karena tidak di-load
}
```

### @DataJpaTest: Hanya JPA Layer

```java
@DataJpaTest
// Load: @Entity, JpaRepository, H2 in-memory database
// TIDAK load: @Service, @Controller, @Component lain
class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findByReader() {
        entityManager.persistAndFlush(
            new Book("Spring Boot", "Craig Walls", "user1"));
        entityManager.persistAndFlush(
            new Book("Clean Code", "Robert Martin", "user2"));

        List<Book> books = bookRepository.findByReader("user1");
        assertThat(books).hasSize(1);
        assertThat(books.get(0).getTitle()).isEqualTo("Spring Boot");
    }
}
```

### @JsonTest: JSON Serialization

```java
@JsonTest
class BookJsonTest {
    @Autowired
    private JacksonTester<Book> json;

    @Test
    void serializeBook() throws Exception {
        Book book = new Book("Spring Boot in Action", "Craig Walls", "user1");
        book.setIsbn("9781617292545");

        assertThat(json.write(book)).isEqualToJson("expected-book.json");
        assertThat(json.write(book)).hasJsonPathStringValue("@.title");
        assertThat(json.write(book))
            .extractingJsonPathStringValue("@.title")
            .isEqualTo("Spring Boot in Action");
    }

    @Test
    void deserializeBook() throws Exception {
        String content = """
            {
                "title": "Spring Boot in Action",
                "author": "Craig Walls",
                "isbn": "9781617292545"
            }
            """;
        assertThat(json.parse(content))
            .isEqualTo(new Book("Spring Boot in Action", "Craig Walls", null));
    }
}
```



## Testing Spring Security

```java
@WebMvcTest(ReadingListController.class)
class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReadingListRepository repo;

    // @WithMockUser - user sederhana
    @Test
    @WithMockUser(username = "user", roles = {"READER"})
    void authenticatedUserCanAccess() throws Exception {
        given(repo.findByReader("user")).willReturn(emptyList());
        mockMvc.perform(get("/user"))
            .andExpect(status().isOk());
    }

    // @WithUserDetails - load dari UserDetailsService
    @Test
    @WithUserDetails("craig")  // craig harus ada di test UserDetailsService
    void userDetailsFromService() throws Exception {
        mockMvc.perform(get("/craig"))
            .andExpect(status().isOk());
    }

    // Test CSRF
    @Test
    @WithMockUser
    void postWithoutCsrfShouldFail() throws Exception {
        mockMvc.perform(post("/user")
            .contentType(APPLICATION_FORM_URLENCODED)
            .param("title", "Test"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void postWithCsrfShouldSucceed() throws Exception {
        mockMvc.perform(post("/user")
            .with(csrf())
            .contentType(APPLICATION_FORM_URLENCODED)
            .param("title", "Test")
            .param("author", "Author")
            .param("isbn", "123"))
            .andExpect(status().is3xxRedirection());
    }
}
```



## Selenium End-to-End Testing

Untuk test yang berjalan di browser sungguhan:

```xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@TestMethodOrder(OrderAnnotation.class)
class ReadingListBrowserTest {

    private static WebDriver driver;

    @LocalServerPort
    private int port;

    @BeforeAll
    static void setupBrowser() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless", "--no-sandbox");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @AfterAll
    static void closeBrowser() {
        if (driver != null) driver.quit();
    }

    @Test
    @Order(1)
    void loginPage() {
        driver.get("http://localhost:" + port + "/");
        assertThat(driver.getTitle()).contains("Login");
        assertThat(driver.getCurrentUrl()).contains("/login");
    }

    @Test
    @Order(2)
    void loginAndSeeReadingList() {
        driver.get("http://localhost:" + port + "/login");
        driver.findElement(By.name("username")).sendKeys("craig");
        driver.findElement(By.name("password")).sendKeys("password");
        driver.findElement(By.cssSelector("[type=submit]")).click();

        assertThat(driver.getTitle()).contains("Reading List");
        assertThat(driver.getCurrentUrl()).endsWith("/craig");
    }

    @Test
    @Order(3)
    void addBook() {
        driver.get("http://localhost:" + port + "/craig");
        driver.findElement(By.name("title")).sendKeys("Spring Boot in Action");
        driver.findElement(By.name("author")).sendKeys("Craig Walls");
        driver.findElement(By.name("isbn")).sendKeys("9781617292545");
        driver.findElement(By.cssSelector("[type=submit]")).click();

        assertThat(driver.getPageSource()).contains("Spring Boot in Action");
    }
}
```



## Ringkasan

| Annotation | Scope | Kecepatan | Kapan Pakai |
|---|---|---|---|
| `@SpringBootTest` | Full context | Lambat | Integration test penuh |
| `@WebMvcTest` | Web layer only | Cepat | Controller + Security |
| `@DataJpaTest` | JPA + H2 | Cepat | Repository queries |
| `@JsonTest` | JSON serialization | Sangat cepat | Jackson mapping |
| `@MockBean` | N/A | N/A | Mock dependency di Spring context |
| `RANDOM_PORT` + TestRestTemplate | Full + real server | Lambat | HTTP-level integration |



**Sumber:** Craig Walls, *Spring Boot in Action* (2016), Manning Publications.
