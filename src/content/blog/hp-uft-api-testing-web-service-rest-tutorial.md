---
title: "HP UFT API Testing: Panduan Lengkap Web Service dan REST"
description: Tutorial lengkap HP Unified Functional Testing untuk API testing -
  automated testing GUI-less apps, standard dan custom activities, Web Service
  SOAP testing dengan WSDL, REST Service testing, data driving, checkpoints, dan
  resolve conflicts untuk perubahan REST service.
pubDate: 2026-09-25T08:00:00.000Z
image: /image/apigee-apis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - APITesting
  - UFT
  - WebService
  - REST
series: "APIs for Dummies"
seriesOrder: 7
---

Di dunia pengembangan software modern, **automated testing** adalah tulang punggung kualitas. HP Unified Functional Testing (UFT) adalah tool enterprise dari HP yang memungkinkan tim QA melakukan testing secara menyeluruh — termasuk testing **GUI-less applications** seperti Web Services dan REST APIs.

Tutorial ini diadaptasi dari **HP UFT 11.53 API Testing Tutorial** (Oktober 2013) — panduan resmi HP yang memandu tester dari nol hingga membuat test suite lengkap untuk SOAP Web Services dan REST Services.

## Daftar Isi


- [Mengapa Automated API Testing?](#mengapa-automated-api-testing)
- [Manfaat Automated API Testing](#manfaat-automated-api-testing)
- [Proses Testing UFT API](#proses-testing-uft-api)
- [UFT Window: Mengenal Interface](#uft-window-mengenal-interface)
- [Menganalisis Aplikasi: Flight API](#menganalisis-aplikasi-flight-api)
- [Membangun Simple Test](#membangun-simple-test)
- [Membuat Test Steps](#membuat-test-steps)
- [Checkpoint: Validasi Test Steps](#checkpoint-validasi-test-steps)
- [Linking Test Steps](#linking-test-steps)
- [Data Driving: Test dengan Multiple Data](#data-driving-test-dengan-multiple-data)
- [Membangun Web Service Test (SOAP)](#membangun-web-service-test-soap)
- [Import Web Service via WSDL](#import-web-service-via-wsdl)
- [Menjalankan Web Service Test](#menjalankan-web-service-test)
- [Multiple Data Sources dan Custom Code](#multiple-data-sources-dan-custom-code)
- [Membangun REST Service Test](#membangun-rest-service-test)
- [Membuat REST Service Activity](#membuat-rest-service-activity)
- [Menjalankan REST Service Test](#menjalankan-rest-service-test)
- [Checkpoint untuk REST Service](#checkpoint-untuk-rest-service)
- [Resolve Conflicts dalam REST Service](#resolve-conflicts-dalam-rest-service)

## Mengapa Automated API Testing?


Automated API Testing adalah disiplin yang memanfaatkan produk dan proses untuk **mengurangi risiko** dari upgrade aplikasi atau deployment service baru.

Intinya, automated testing adalah tentang menerapkan **production workloads ke pre-deployment systems** sambil mengukur performa sistem dan pengalaman end-user secara bersamaan.

Test performa yang baik menjawab pertanyaan-pertanyaan kritis:
- Apakah service/aplikasi merespons cukup cepat untuk pengguna yang dituju?
- Apakah aplikasi bisa menangani beban yang diharapkan?
- Apakah fungsionalitas berubah secara tak terduga setelah upgrade?
- Apakah perilaku sistem konsisten di berbagai kondisi?

## Manfaat Automated API Testing


**MANFAAT AUTOMATED API TESTING:**

![Manual vs Automated Testing](/image/uft-manual-vs-automated.svg)

- **Manual Testing**: waktu lama, error-prone, tidak konsisten
- **Automated Testing (UFT)**: cepat, konsisten, reproducible

**MANFAAT UTAMA:**

1. Reusability
- Test yang sama bisa dijalankan berkali-kali
- Tidak perlu buat ulang tiap kali perubahan kecil

2. Coverage yang lebih luas
- Test bisa berjalan 24/7 tanpa manusia
- Lebih banyak test case yang bisa dicover

3. Early bug detection
- Jalankan setiap build → Bug terdeteksi lebih awal
- Biaya perbaikan jauh lebih murah

4. Regression testing
- Pastikan fitur lama tidak rusak saat fitur baru ditambah

5. Data-driven testing
- Test yang sama dengan ratusan kombinasi data
- Tidak mungkin dilakukan manual

## Proses Testing UFT API


UFT API testing terdiri dari **4 fase utama**:

**UFT API TESTING PROCESS:**

FASE 1: ANALYZING YOUR APPLICATION
- Tentukan apa yang perlu ditest
- Identifikasi teknologi yang digunakan (Web Service? REST? Custom?)
- Pelajari alur bisnis aplikasi

FASE 2: PLANNING YOUR TEST
- Tentukan test scenarios
- Siapkan test data
- Rencanakan validasi (checkpoints)

FASE 3: BUILDING YOUR TEST
- Buat test steps dari activities
- Link test steps satu sama lain
- Set checkpoint values
- Configure data sources

FASE 4: RUNNING AND ANALYZING
- Jalankan test
- Review Run Results Viewer
- Analisis failures
- Fix dan iterate

## UFT Window: Mengenal Interface


Sebelum mulai testing, penting untuk familiar dengan komponen-komponen UFT:

**UFT WINDOW LAYOUT:**

![Layout Window HP UFT — Solution Explorer, Canvas Test Flow, dan Properties Pane](/image/uft-window-layout.svg)

### Komponen Utama UFT


| Komponen | Fungsi | Lokasi |
|----------|--------|--------|
| **Canvas** | Visual editor untuk test flow — drag-drop steps | Tengah |
| **Toolbox** | Semua activities yang tersedia untuk test | Kiri |
| **Properties** | Properties dari step yang dipilih | Kanan |
| **Data** | Parameterisasi test dengan multiple data | Bawah |
| **Solution Explorer** | Semua tests dalam solution | Tab kiri |
| **Debug** | Breakpoints, Call Stack, Variables | Tab bawah |

### Dua Tipe Activities


**Standard API Activities:**
- Built-in activities yang sudah ada di UFT
- Contoh: Replace String, Concatenate String, HTTP activities
- Langsung tersedia di Toolbox tanpa import

**Custom Activities:**
- Import Web Service methods (via WSDL file)
- REST Service methods (dibuat di REST Service editor)
- Custom code activities (C# code)

## Menganalisis Aplikasi: Flight API


Untuk tutorial ini, HP menggunakan **Flight API Application** sebagai contoh — aplikasi sample yang disertakan dengan UFT.

**FLIGHT API APPLICATION:**

Fungsi: Simulasi sistem pemesanan tiket pesawat
Protocol: SOAP (Web Service) + REST

Endpoint yang tersedia:
Web Service (SOAP):
- GetFlights(DepartureCity, ArrivalCity) → daftar penerbangan
- CreateFlightOrder(FlightNumber, ...) → buat pesanan baru

REST Service:
- POST /FlightOrders → ReserveOrder (buat pesanan)
- GET /FlightOrders/{id} → cek status pesanan

Test yang akan dibuat:
1. Basic Test (standard activities)
2. Web Service Test (SOAP via WSDL)
3. REST Service Test

### Memulai Sample Application


Untuk menjalankan tutorial ini:
1. Buka dengan hak admin (diperlukan oleh Windows)
2. Start → Programs → HP Software → HP UFT → Sample Applications → Flight API
3. Command window muncul — ini adalah service yang harus tetap berjalan
4. Minimize (jangan close) command window

## Membangun Simple Test


Chapter 3 mengajarkan dasar-dasar membuat test menggunakan **Standard API Activities**.

### Membuat Solution dan Test Baru


**LANGKAH MEMBUAT SOLUTION:**

1. Start UFT
2. File → New → Solution
3. Isi Solution Name → "FlightAPITests"
4. File → New → Test
5. Pilih API Test
6. Isi Test Name → "BasicTest"
7. Klik Create

Hasilnya:
- FlightAPITests (Solution)
- BasicTest (Test)
- Test Flow (Canvas — kosong)

## Membuat Test Steps


**Test Steps** dibuat dengan **drag-and-drop** dari Toolbox ke Canvas.

### Contoh: Replace String Activity


**LANGKAH MEMBUAT TEST STEP:**

1. Di Toolbox, expand "String" category
2. Temukan "Replace String" activity
3. Drag ke Canvas → step muncul di Test Flow

4. Ubah nama step:
- Properties pane → General tab
- Name: "Change Text"
- ENTER

5. Set input properties:
- Properties pane → Input/Checkpoints tab
- Source String: "Hello World."
- Old Value: "Hello"
- New Value: "Goodbye"
- Match Case: FALSE

6. Run test (F5 atau klik Run button)
- Run dialog → pilih "Temporary run results folder"
- Klik Run

7. View results:
- Run Results Viewer terbuka otomatis
- View → Expand All
- Lihat output: "Goodbye World."

## Checkpoint: Validasi Test Steps


Checkpoint adalah cara UFT **memvalidasi test secara otomatis** — membandingkan actual output dengan expected value.

**TANPA CHECKPOINT:**

Run test → Lihat output manual → "Apakah benar?"
- Tidak scalable, bisa miss errors

**DENGAN CHECKPOINT:**

Set expected value → Run test
- UFT bandingkan actual vs expected
- Hijau ✓: Passed (sesuai ekspektasi)
- Merah ✗: Failed (tidak sesuai)
- Report otomatis menunjukkan di mana failure terjadi

**CARA SET CHECKPOINT:**

1. Pilih step di canvas (Change Text)
2. Properties → Input/Checkpoints tab
3. Di bagian Checkpoints, pilih property "Result"
4. Isi Expected Value: "Goodbye World."
5. Jalankan test → report menunjukkan pass/fail

## Linking Test Steps


Ketika aplikasi berjalan, sering ada **output dari satu proses yang menjadi input proses berikutnya**. UFT mendukung ini dengan fitur linking.

**LINKING TEST STEPS:**

Change Text Step:
Input:  "Hello World." → process → Output: "Goodbye World."
- ↓ link
Concatenate String Step:
- Input: {output dari Change Text} + " How are you?"
- Output: "Goodbye World. How are you?"

**CARA LINK STEP:**

1. Tambah Concatenate String ke canvas
2. Pilih Concatenate String step
3. Properties → Input/Checkpoints
4. Klik tombol Link untuk property "Prefix"
5. Select Link Source dialog:
- Pilih "Available steps"
- Expand "Change Text"
- Pilih "Result"
- Double-click
6. Canvas menampilkan garis koneksi antara kedua step

### Mapping ke Multiple Sources


UFT juga memungkinkan linking ke **multiple data sources** sekaligus:

- **Available steps** — output dari step lain
- **Data source column** — kolom dari Excel/XML/Database
- **Test variables** — variabel yang didefinisikan di test

## Data Driving: Test dengan Multiple Data


**Data Driving** adalah teknik menjalankan test yang sama dengan berbagai set data — tanpa duplikasi test steps.

**DATA DRIVING CONCEPT:**

**TANPA DATA DRIVING:**

Test 1: Source="Hello World." → Expected="Goodbye world."
Test 2: Source="I like apples." → Expected="I like ice cream."
Test 3: Source="The product version" → Expected="The product version!"
- 3 test berbeda untuk logika yang sama

**DENGAN DATA DRIVING:**

1 test + 3 baris data:
| Source String (Input) | Result (Expected) |
|---|---|
| Hello World. | Goodbye world. |
| I like apples. | I like eating ice cream. |
| The product version | The product version! |

Test berjalan 3x, sekali per baris data

### Cara Mengimplementasikan Data Driving


**LANGKAH DATA DRIVING:**

1. Klik kanan step di canvas → "Data Drive Step"
2. Data pane terbuka dengan kolom untuk setiap property
3. Edit nilai di tabel:
- Ganti nilai di kolom Source_String
- Ganti nilai di kolom Result (untuk checkpoint)

4. Set navigation settings (berapa iterasi):
- Click dalam Test Flow frame
- Properties → Input/Checkpoints
- Set "For Loop" → Number of Iterations: 3

5. Run test → Berjalan 3x dengan data berbeda
- Run Results menampilkan setiap iterasi
- Rows dengan X merah = checkpoint failed

## Membangun Web Service Test (SOAP)


Chapter 4 mengajarkan cara test **Web Services berbasis SOAP** menggunakan WSDL file.

### Konsep Web Service Testing


**WEB SERVICE (SOAP) TESTING:**

WSDL File:
- Mendefinisikan semua operations/methods Web Service
- Format: XML schema yang mendeskripsikan interface
- UFT membaca WSDL → otomatis buat activities di Toolbox

**WORKFLOW:**

Import WSDL → UFT parsing methods
Drag method ke canvas → buat test step
Set input properties → run test
- View SOAP request/response di hasil

## Import Web Service via WSDL


**LANGKAH IMPORT WSDL:**

1. Di Toolbox, klik "Add Web Service" atau klik kanan
2. Import via WSDL dialog terbuka
3. Isi URL WSDL Flight API:
- http://localhost:24240/HPFlights_SOAP/FlightSearch.svc?wsdl
4. Klik Import
5. UFT parse WSDL → methods muncul di Toolbox
- Toolbox → Web Services → HPFlights_SOAP
- GetFlights
- CreateFlightOrder

## Menjalankan Web Service Test


Setelah import, buat test flow untuk scenario "Pesan Tiket Pesawat":

TEST SCENARIO: CREATE FLIGHT ORDER

Step 1: GetFlights
Input:
- DepartureCity: "Denver"
- ArrivalCity: "Los Angeles"
Output:
- FlightNumber (dari daftar penerbangan yang tersedia)

Step 2: CreateFlightOrder (linked ke GetFlights)
Input:
- Class: "Business"
- CustomerName: "John Doe"
- DepartureDate: "2026-12-25"
- FlightNumber: {output dari GetFlights.FlightNumber}  ← LINKED
- NumberofTickets: 2
Output:
- OrderNumber
- TotalPrice

**CANVAS VIEW:**

![Test Flow: GetFlights → CreateFlightOrder dengan linking parameter](/image/uft-test-flow-linking.svg)

### Set Checkpoint untuk Web Service


**CHECKPOINT SETUP:**

1. Pilih CreateFlightOrder step
2. Properties → Input/Checkpoints → Checkpoints section
3. Klik "Add Checkpoint"
4. Pilih property "TotalPrice"
5. Masukkan expected value (salin dari run sebelumnya)
6. Run test → checkpoint verify TotalPrice

Run Results menampilkan:
- ✓ CreateFlightOrder — Passed
- Expected: 500
- Actual:   500

## Multiple Data Sources dan Custom Code


Untuk skenario lebih kompleks, UFT mendukung **kombinasi data sources** dan **C# custom code**:

**MULTIPLE DATA SOURCES:**

Test WebServicesCustom:
CreateFlightOrder step dengan data dari:
- Class: hardcoded "Economy"
- CustomerName: dari Excel file (WS_Flights!Input)
- FlightNumber: linked ke output GetFlights
- DepartureDate: dari Excel file

Ekspresi kompleks:
- {DataSource.WS_Flights!Input.CustomerName}_
- OrderNumber_
- {Step.OutputProperties.StServiceCallActivity.Body.
- CreateFlightOrderResponse.OrderNumber}

CUSTOM CODE (C#):
Event handler di test step:
- CodeActivity12.Report(
- "Customer and Order Number",
- CodeActivity12.Input.FlightInfo
- );

- Menampilkan data custom di Run Results Viewer
- Berguna untuk logging dan debugging

## Membangun REST Service Test


Chapter 5 beralih ke testing **REST Services** — pendekatan berbeda dari SOAP.

PERBEDAAN WEB SERVICE vs REST SERVICE TESTING:

**WEB SERVICE (SOAP):**

- Import WSDL file
- UFT otomatis buat methods
- Request/response dalam format XML (SOAP envelope)

**REST SERVICE:**

- Tidak ada WSDL
- Harus definisikan method secara manual di REST editor
- Request/response bisa JSON atau XML
- Lebih fleksibel, lebih modern

## Membuat REST Service Activity


Sebelum bisa test REST service, kita harus **mendefinisikan prototype**-nya di UFT:

**LANGKAH MEMBUAT REST SERVICE:**

1. Toolbox → klik "Add REST Service" button
2. Add REST Service dialog terbuka

3. Rename service:
- Klik "New Service" di left pane
- Rename: "SamplesRESTService"

4. Tambah Resource:
- Klik "Add Resource" button
- Rename: "FlightOrders"

5. Tambah Method:
- Klik "Add Method" button
- Rename: "ReserveOrder"
- HTTP Method: POST

6. Configure URL:
- Pilih SamplesRESTService node
- General tab
- URL: "http://localhost:24240"

Pilih FlightOrders node:
- URL: "/FlightOrders"

7. Configure ReserveOrder method:
- HTTP tab
- Request Body Type: XML
- Load body.xml file (template XML untuk request)
- Request Headers: Content-Type: text/xml

8. Tambah Input Properties:
- SamplesRESTService → Input/Checkpoints tab
- Add > Add Input Property
- Contoh: "Customer_Name" (String type)

9. Tambah Output Properties:
- Add > Add Output Property
- "Total_Price" (Int type)
- "Order_Number" (Int type)

10. Klik OK → REST service ditambahkan ke Toolbox
- Local Activities → SamplesRESTService
- FlightOrders
- ReserveOrder

### Berbagi REST Activity


**SHARING REST ACTIVITY:**

Agar REST method bisa digunakan di semua test (bukan hanya test saat ini):

1. Toolbox → klik kanan SamplesRESTService
2. Pilih "Share REST Service"
3. Method kini tersedia di semua test dalam solution

## Menjalankan REST Service Test


**LANGKAH RUN REST TEST:**

1. Drag ReserveOrder ke canvas
2. Set input properties:
- Customer_Name: "John Freeman"
- Flight_Number: 1001
- Class: "Business"
- Departure_Date: "2026-12-25"
- Number_of_Tickets: 2

3. Run test (F5)

4. View results:
- Run Results Viewer → expand all
- Pilih ReserveOrder node
- Captured Data pane:
- Klik "ResponseBody" link
- Browser menampilkan XML response

Contoh response:
- <FlightOrderConfirmation>
- <OrderNumber>ORD-12345</OrderNumber>
- <TotalPrice>850000</TotalPrice>
- <Status>Confirmed</Status>
- </FlightOrderConfirmation>

### Assign Data dari Excel ke REST Test


**DATA DRIVING REST TEST:**

1. Data pane → Data Source button → Excel
2. Import REST_FlightsInput.xlsx
3. Link properties ke kolom Excel:
- Class: linked ke "Class" kolom
- Customer_Name: linked ke "CustomerName" kolom
- Departure_Date: linked ke "DepartureDate" kolom
- Flight_Number: linked ke "FlightNumber" kolom
- Number_of_Tickets: hardcoded 2

4. Set iterations:
- Canvas → Test Flow frame
- Properties → Input/Checkpoints
- For Loop: 3 iterations

5. Run → test berjalan 3x dengan data dari Excel
Captured Data tab menampilkan:
- <Class>Business</Class>
- <CustomerName>John Freeman</CustomerName>
- <DepartureDate>2012-12-12</DepartureDate>

## Checkpoint untuk REST Service


**CHECKPOINT REST SERVICE:**

1. Pilih ReserveOrder step
2. Properties → HTTP tab
3. Set expected values untuk:
- Status Code: 200
- Order_Number: bisa berupa range/pattern
- Total_Price: expected value

4. Run test
5. Run Results menampilkan:
- ✓ Checkpoint: Status Code = 200 (Passed)
- ✗ Checkpoint: Total_Price = 850000 (Failed)
- Expected: 850000
- Actual:   900000

**ANALISIS FAILURES:**

- Di Run Results tree, pilih failed checkpoint node
- Captured Data pane menampilkan:
- Actual Results: nilai yang dikembalikan server
- Expected Values: nilai yang kita set
- Gunakan untuk debugging dan mendokumentasikan issues

## Resolve Conflicts dalam REST Service


Ketika REST service yang ditest **berubah** (URL, property names), test steps yang ada bisa menjadi tidak valid. UFT memiliki **Resolve Conflicts wizard** untuk menangani ini.

**SKENARIO CONFLICT:**

REST Service Prototype (sebelum perubahan):
- Input: Customer_Name, Flight_Number, Class, Departure_Date

REST Service (setelah perubahan):
- Input: CustomerName (bukan Customer_Name — underscore hilang)
- FlightID (bukan Flight_Number)
- Class, DepartureDate

UFT deteksi: test step tidak match prototype
- Resolve Conflict wizard terbuka

### Menggunakan Resolve Conflicts Wizard


**LANGKAH RESOLVE CONFLICTS:**

1. UFT mendeteksi perubahan → notifikasi muncul
2. Klik "Resolve Conflicts"
3. Wizard menampilkan Before/After:

Input Properties:
Before (lama):        After (baru):
| Field Lama | Field Baru | Status |
|---|---|---|
| Customer_Name | CustomerName | renamed |
| Flight_Number | FlightID | renamed |
| Class | Class | sama |
| Departure_Date | DepartureDate | renamed |


4. Untuk setiap properti yang berubah, pilih:
- "Keep" — pertahankan properti di test step
- "Remove" — hapus dari test step
- "Map" — mapping properti lama ke properti baru

5. Contoh keputusan:
Number_of_Tickets (dihapus dari prototype):
- Klik "Keep" → step tetap pakai properti ini

Flight_Number (tidak ada lagi):
- Klik "Remove" → properti dihapus dari step

6. Klik Finish → test step diperbarui

## Ringkasan: UFT API Testing Workflow


**COMPLETE UFT API TESTING WORKFLOW:**

FASE 1: ANALISIS (Chapter 2)
- ✓ Pelajari aplikasi yang akan ditest
- ✓ Identifikasi teknologi (SOAP/REST/custom)
- ✓ Tentukan test scenarios
- ✓ Buat Solution dan Test baru

FASE 2: STANDARD ACTIVITIES (Chapter 3)
- ✓ Drag activities dari Toolbox ke Canvas
- ✓ Set input properties di Properties pane
- ✓ Set checkpoints untuk validasi
- ✓ Link output step ke input step berikutnya
- ✓ Data driving dari Excel/XML/DB

FASE 3: WEB SERVICE TESTING (Chapter 4)
✓ Import WSDL file → methods auto-generated
- ✓ Drag methods ke test flow
✓ Link output GetFlights → input CreateOrder
- ✓ Set checkpoints untuk response validation
- ✓ Multiple data sources + custom C# code

FASE 4: REST SERVICE TESTING (Chapter 5)
- ✓ Buat REST Service prototype di REST editor
- ✓ Define URL, methods, input/output properties
- ✓ Import request body XML template
- ✓ Share activity ke semua tests
- ✓ Data driving dari Excel
- ✓ Checkpoints untuk HTTP status + response values
- ✓ Resolve conflicts saat REST service berubah

### Perbandingan SOAP vs REST Testing di UFT


| Aspek | SOAP (Web Service) | REST Service |
|-------|-------------------|--------------|
| Setup | Import WSDL file | Manual di REST editor |
| Auto-generate | Ya (dari WSDL) | Tidak |
| Request format | XML (SOAP envelope) | XML atau JSON |
| Kompleksitas setup | Rendah | Sedang |
| Fleksibilitas | Terbatas ke WSDL | Tinggi |
| Detect changes | Manual | Resolve Conflicts wizard |

**Sumber:** HP Software, *HP Unified Functional Testing 11.53 — API Testing Tutorial* (Oktober 2013). [hp.com/go/hpsoftwaresupport](https://www.hp.com/go/hpsoftwaresupport)

## Referensi

- HP Software. (2014). *HP Unified Functional Testing 11.53 Tutorial*. Hewlett-Packard Development Company.
- W3C. (2001). *Web Services Description Language (WSDL) 1.1*. World Wide Web Consortium.
- W3C. (2000). *Simple Object Access Protocol (SOAP) 1.1*. World Wide Web Consortium.
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine.
