---
title: "Pengantar API: HTTP, Data Format, dan Autentikasi untuk Pemula"
description: Panduan pemula lengkap API dari Zapier - cara kerja client-server,
  HTTP request-response cycle, HTTP methods GET POST PUT DELETE, status codes,
  format data JSON vs XML, Basic Auth, API Key, dan OAuth 1 vs OAuth 2 dijelaskan.
pubDate: 2026-09-23T08:00:00.000Z
image: /image/apigee-apis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - HTTP
  - OAuth
  - WebDevelopment
series: "APIs for Dummies"
seriesOrder: 5
---

Pernahkah kamu bertanya-tanya bagaimana Facebook bisa menampilkan foto Instagram kamu secara otomatis? Atau bagaimana Evernote bisa menyinkronkan catatan antara laptop dan smartphone? Jawabannya: **API**.

*An Introduction to APIs* oleh **Brian Cooksey** (Zapier, 2014) adalah panduan paling ramah pemula untuk memahami API dari nol. Buku ini tersedia gratis di zapier.com/learn/apis dan menjadi referensi wajib bagi siapa saja yang ingin memulai perjalanan di dunia integrasi sistem.

## Daftar Isi

- [Apa itu API?](#apa-itu-api)
- [Client dan Server](#client-dan-server)
- [HTTP dan Protokol Komunikasi](#http-dan-protokol-komunikasi)
- [HTTP Request: URL, Method, Headers, Body](#http-request-url-method-headers-body)
- [HTTP Methods: GET, POST, PUT, DELETE](#http-methods-get-post-put-delete)
- [HTTP Response dan Status Codes](#http-response-dan-status-codes)
- [Format Data: JSON dan XML](#format-data-json-dan-xml)
- [Content-Type dan Accept Headers](#content-type-dan-accept-headers)
- [Autentikasi: Basic Auth](#autentikasi-basic-auth)
- [Autentikasi: API Key](#autentikasi-api-key)
- [Autentikasi: OAuth](#autentikasi-oauth)
- [OAuth 1 vs OAuth 2](#oauth-1-vs-oauth-2)



## Apa itu API?

**API (Application Programming Interface)** adalah tool yang membuat data sebuah website bisa diakses dan diproses oleh komputer — bukan hanya manusia.

Bayangkan: manusia mengakses data dengan membuka website, scrolling, dan klik tombol. Komputer membutuhkan cara yang lebih terstruktur. Itulah fungsi API.

```
TANPA API:
  Human → Browser → Website (HTML/CSS) → Tampilan visual
  Computer: tidak bisa "baca" tampilan visual dengan mudah

DENGAN API:
  Computer → API Request → Server → Data terstruktur (JSON/XML)
  Computer: bisa proses data langsung, otomatis, dalam detik
```

> *"Making data easier to work with is good because it means people can write software to automate tedious and labor-intensive tasks. What might take a human hours to accomplish can take a computer seconds through an API."*

Ketika dua sistem berinteraksi melalui API:
- **Server** — sisi yang menyediakan data dan layanan
- **Client** — sisi yang mengonsumsi data dan layanan



## Client dan Server

Setiap interaksi API melibatkan dua pihak:

```
CLIENT                          SERVER
┌─────────────────────┐        ┌─────────────────────┐
│ Smartphone App      │        │ API Provider         │
│ Web Browser         │◄──────►│ (Website/Service)    │
│ Desktop Program     │        │                      │
│ Script/Bot          │        │                      │
└─────────────────────┘        └─────────────────────┘
    Yang meminta                 Yang merespons
```

**Contoh nyata:**
- Kamu menekan tombol refresh di aplikasi cuaca → **aplikasi = client**, server cuaca = **server**
- Website A menampilkan peta dari Google Maps → website A = **client**, Google Maps = **server**
- Zapier menghubungkan Gmail dengan Slack → Zapier = **client** untuk kedua service

**Prinsip fundamental:** Client yang selalu memulai komunikasi. Server hanya merespons.



## HTTP dan Protokol Komunikasi

Protokol adalah seperangkat aturan yang disepakati untuk komunikasi. Seperti manusia punya etika bicara — komputer punya protokol.

```
ANALOGI KOMUNIKASI:

Manusia:
  "Halo, selamat pagi!"
  "Pagi! Ada yang bisa dibantu?"
  → Ada aturan tidak tertulis: sapaan dulu, tunggu respons

Komputer (HTTP):
  GET /api/users HTTP/1.1
  Host: api.example.com
  → Ada aturan tertulis: format eksak yang harus diikuti

Komputer TIDAK bisa menebak maksud seperti manusia.
Format harus tepat, urutan harus benar.
```

**HTTP (HyperText Transfer Protocol)** adalah protokol yang menjadi fondasi web — dan menjadi dasar sebagian besar API modern.



## HTTP Request: URL, Method, Headers, Body

Setiap HTTP request harus mengandung 4 komponen:

```
STRUKTUR HTTP REQUEST:

┌─────────────────────────────────────────────────┐
│ 1. URL (Uniform Resource Locator)               │
│    https://api.example.com/customers/123        │
│                                                 │
│ 2. METHOD                                       │
│    GET                                          │
│                                                 │
│ 3. HEADERS                                      │
│    Content-Type: application/json               │
│    Authorization: Bearer eyJhbGc...             │
│    Accept: application/json                     │
│                                                 │
│ 4. BODY                                         │
│    {"name": "Rifky", "email": "r@example.com"} │
│    (kosong untuk GET request)                   │
└─────────────────────────────────────────────────┘
```

### URL

URL adalah **alamat unik untuk sebuah hal (noun)**. Dalam API, URL digunakan untuk mengidentifikasi resource:

```
URL STRUCTURE:

https://api.example.com/customers/123/orders

Protocol: https://
Host:      api.example.com
Path:      /customers/123/orders
           ↑ resource type  ↑ specific ID  ↑ sub-resource
```

API memperluas konsep URL untuk mencakup noun bisnis seperti:
- `/customers` — semua pelanggan
- `/customers/123` — pelanggan dengan ID 123
- `/customers/123/orders` — semua order dari pelanggan 123
- `/products/456` — produk dengan ID 456

### Headers

Headers adalah **metadata tentang request** — informasi tambahan yang dikirim bersama request tapi bukan bagian dari data utama.

```
COMMON REQUEST HEADERS:

Content-Type: application/json    ← format data yang dikirim
Accept: application/json          ← format data yang diinginkan
Authorization: Bearer <token>     ← credential autentikasi
User-Agent: MyApp/1.0             ← identitas client
```

### Body

Body adalah **data yang dikirim client ke server**. Untuk request GET (hanya membaca), body biasanya kosong. Untuk POST/PUT (membuat/mengubah), body berisi data:

```json
{
  "crust": "original",
  "toppings": ["pepperoni", "mushroom"],
  "customer": {
    "name": "Rifky",
    "phone": "08123456789"
  }
}
```



## HTTP Methods: GET, POST, PUT, DELETE

HTTP menyediakan method (verb) yang menunjukkan **aksi apa yang ingin dilakukan** terhadap resource:

```
HTTP METHODS:

GET     → Baca/ambil resource (tidak mengubah apapun)
POST    → Buat resource baru
PUT     → Update resource yang ada (ganti seluruhnya)
PATCH   → Update sebagian resource (partial update)
DELETE  → Hapus resource
```

### Contoh: Pizza Parlor API

Brian Cooksey menggunakan contoh restoran pizza yang sangat mudah dipahami:

```
SKENARIO MEMESAN PIZZA:

1. Pesan pizza:
   POST /orders
   Body: {"crust": "thin", "toppings": ["cheese"]}
   → Pizza baru dibuat

2. Ups, salah pilih crust! Update:
   PUT /orders/456
   Body: {"crust": "original", "toppings": ["cheese"]}
   → Order diperbarui

3. Cek status pesanan:
   GET /orders/456
   → Ambil info pesanan saat ini

4. Tunggu 1 jam... batalkan saja:
   DELETE /orders/456
   → Pesanan dihapus
```

### Sifat-Sifat Method

```
SIFAT HTTP METHODS:

SAFE (tidak mengubah data):
  GET    ✓ safe
  HEAD   ✓ safe

IDEMPOTENT (aman dipanggil berkali-kali):
  GET    ✓ idempotent — 5x GET = hasil sama
  PUT    ✓ idempotent — 5x PUT = state sama
  DELETE ✓ idempotent — 5x DELETE = hasil sama (resource sudah hilang)
  POST   ✗ NOT idempotent — 5x POST = 5 record baru!
```



## HTTP Response dan Status Codes

Setelah menerima request, server mengirim response. Struktur response mirip dengan request, tapi mengandung **status code** sebagai pengganti method dan URL.

```
HTTP STATUS CODES:

1xx — Informational (jarang digunakan)

2xx — SUCCESS:
  200 OK           ← Request berhasil
  201 Created      ← Resource baru berhasil dibuat
  204 No Content   ← Berhasil, tidak ada data untuk dikembalikan

3xx — REDIRECTION:
  301 Moved Permanently  ← URL telah berubah permanen
  302 Found              ← URL sementara di tempat lain

4xx — CLIENT ERROR (kesalahan dari client):
  400 Bad Request    ← Request tidak valid/format salah
  401 Unauthorized   ← Belum terautentikasi
  403 Forbidden      ← Tidak punya izin
  404 Not Found      ← Resource tidak ditemukan
  429 Too Many Requests ← Rate limit terlampaui

5xx — SERVER ERROR (kesalahan dari server):
  500 Internal Server Error ← Server crash/bug
  503 Service Unavailable   ← Server sedang down
```

Status code 404 yang terkenal berarti "Not Found" — resource yang diminta tidak ada di server.

### Contoh Response Lengkap

```
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 31 Jul 2026 08:00:00 GMT

{
  "id": 456,
  "crust": "original",
  "toppings": ["cheese", "pepperoni"],
  "status": "baking",
  "estimated_minutes": 20
}
```



## Format Data: JSON dan XML

Untuk dua komputer bisa saling memahami, mereka harus menyepakati **format data** yang digunakan. Dua format paling umum di API modern:

### JSON (JavaScript Object Notation)

JSON adalah format berbasis **key-value pairs** yang terinspirasi dari JavaScript:

```json
{
  "crust": "original",
  "toppings": ["cheese", "pepperoni", "mushroom"],
  "customer": {
    "name": "Rifky Awalul",
    "phone": "081234567890",
    "address": "Jakarta Selatan"
  },
  "total_price": 85000,
  "is_delivery": true
}
```

**Membaca JSON secara natural:**
- `"crust": "original"` → *"crust untuk pizza ini adalah original"*
- `"toppings": [...]` → *"toppings pizza ini adalah: cheese, pepperoni, mushroom"*
- Object di dalam object = **nested object** / **associative array**

**Keunggulan JSON:**
- Lebih ringkas dari XML
- Mudah dibaca manusia
- Native di JavaScript (frontend friendly)
- Default format untuk API modern

### XML (Extensible Markup Language)

XML menggunakan **tags** seperti HTML — sudah ada sejak 1996:

```xml
<order>
  <crust>original</crust>
  <toppings>
    <topping>cheese</topping>
    <topping>pepperoni</topping>
    <topping>mushroom</topping>
  </toppings>
  <customer>
    <name>Rifky Awalul</name>
    <phone>081234567890</phone>
  </customer>
  <total_price>85000</total_price>
  <is_delivery>true</is_delivery>
</order>
```

**Membaca XML secara natural:**
- `<crust>original</crust>` → *"crust adalah original"*
- Tags selalu berpasangan: `<open>` dan `</close>`

**Keunggulan XML:**
- Lebih verbose, tapi juga lebih eksplisit
- Mendukung atribut: `<order id="456" status="baking">`
- Masih umum di legacy systems dan enterprise (SOAP)

### JSON vs XML

| Aspek | JSON | XML |
|-------|------|-----|
| Verbosity | Ringkas | Verbose |
| Readability | Mudah | Sedang |
| Data types | String, Number, Boolean, Array, Object, null | Semua sebagai string |
| Native support | JavaScript | N/A |
| Adoption | API modern | Legacy/SOAP |



## Content-Type dan Accept Headers

Bagaimana client dan server menyepakati format data? Melalui dua HTTP headers khusus:

```
CONTENT-TYPE vs ACCEPT:

Content-Type (request):
  "Format data yang AKU KIRIMKAN ke kamu"
  Content-Type: application/json

Accept (request):
  "Format data yang AKU INGINKAN dari kamu"
  Accept: application/json

Content-Type (response):
  "Format data yang AKU KIRIMKAN balik ke kamu"
  Content-Type: application/xml

Workflow:
  1. Client kirim request dengan Content-Type: application/json
  2. Server terima, cek apakah bisa baca JSON → ya
  3. Server proses, kirim response dengan Content-Type: application/json
  4. Client terima, tahu harus parse sebagai JSON
```

Jika server tidak mendukung format yang diminta → server kirim `415 Unsupported Media Type`.



## Autentikasi: Basic Auth

Setelah memahami **cara berbicara** (HTTP + format data), pertanyaan berikutnya: **bagaimana server tahu siapa yang berbicara?**

Itulah **autentikasi** — proses membuktikan identitas.

### Basic Authentication

Basic Auth adalah skema autentikasi paling sederhana: **username + password** yang di-encode base64.

```
BASIC AUTH FLOW:

1. Client gabungkan: username + ":" + password
   → "rifky:secretpassword"

2. Encode dengan Base64:
   → "cmlla3k6c2VjcmV0cGFzc3dvcmQ="

3. Kirim dalam Authorization header:
   Authorization: Basic cmlla3k6c2VjcmV0cGFzc3dvcmQ=

4. Server decode, cek di database user
   → Match? → 200 OK + data
   → No match? → 401 Unauthorized
```

**Penting:** Base64 bukan enkripsi — siapapun bisa decode. Basic Auth HARUS selalu digunakan melalui **HTTPS** untuk keamanan.

### Kapan Basic Auth Digunakan?

- Internal/private APIs
- Server-to-server communication yang terpercaya
- Development dan testing
- API sederhana dengan keamanan minimal



## Autentikasi: API Key

Masalah dengan Basic Auth: **mengekspos password asli akun**. Bayangkan kamu hire kontraktor untuk mengakses API bisnismu — kamu tidak mau kasih password akun utama, kan?

**API Key** adalah solusinya — sebuah kunci unik terpisah dari password akun:

```
API KEY FLOW:

1. User daftar/login ke layanan
2. Layanan generate API Key unik:
   → "sk-7f4a2b9c3d8e1f6a0b5c4d2e7f8a9b0c"

3. User sertakan API Key di setiap request:
   → Via header: X-API-Key: sk-7f4a2b9c3d8e1f6a0b5c4d2e7f8a9b0c
   → Via query param: ?api_key=sk-7f4a2b9c3d8e1f...
   → Via body (jarang)

4. Server validasi API Key, proses request jika valid
```

**Keunggulan API Key vs Basic Auth:**

```
BASIC AUTH:                    API KEY:
Pakai password asli            Pakai key terpisah
Key bocor = akun compromised   Key bocor = revoke & buat baru
Satu credential saja           Bisa buat banyak key
Sulit revoke (ganti password)  Mudah revoke (hapus key saja)
```

**Kelemahan:** Lokasi API key tidak terstandarisasi — berbeda-beda tiap API (header, query param, dll). Berbeda dengan Basic Auth yang memiliki header `Authorization` yang sudah standar.



## Autentikasi: OAuth

Basic Auth dan API Key cocok untuk **machine-to-machine** access. Tapi bagaimana jika kamu ingin **aplikasi pihak ketiga** mengakses data kamu di layanan lain **atas namamu**?

Contoh: kamu ingin Zapier mengakses Gmail kamu. Tapi kamu **tidak mau kasih password Gmail ke Zapier**.

Solusinya: **OAuth (Open Authorization)**.

```
ANALOGIKAN SEPERTI INI:

Tanpa OAuth:
  Kamu → kasih password Gmail ke Zapier
  Zapier akses Gmail dengan password kamu
  Risiko: Zapier bisa baca, hapus, kirim email sesukanya

Dengan OAuth:
  Kamu → login ke Google langsung
  Google → kasih "access token" terbatas ke Zapier
  Zapier → pakai token (bukan password) untuk akses terbatas
  Kamu bisa revoke token kapan saja tanpa ganti password Gmail
```

### Alur OAuth (6 Langkah)

```
OAUTH FLOW:

Step 1: User klik "Connect to Server" di Client App
        ↓
Step 2: Client redirect User ke halaman login Server
        (dengan callback URL)
        ↓
Step 3: User login ke Server dengan username/password ASLI
        User grant permission ke Client
        ↓
Step 4: Server redirect User kembali ke Client
        (bawa authorization code tersembunyi)
        ↓
Step 5: Client kirim authorization code + secret key ke Server
        Server validasi, kirim Access Token ke Client
        ↓
Step 6: Client gunakan Access Token untuk akses data
        (seperti password sementara, tapi terbatas)

Optional: Client refresh token sebelum expired (OAuth 2 only)
```

### Visualisasi Alur OAuth

```
USER ←──────────────────────────────────────────────────────────────────►
 │                                                                         │
 │ 1. Klik "Connect"                                                       │
 ▼                                                                         │
CLIENT ──────────── 2. Redirect ─────────────────────────────────────────►│
                                                                      SERVER
 3. User login ───────────────────────────────────────────────────────────►
                                                                           │
 ◄───────────────────── 4. Redirect + Auth Code ─────────────────────────
 │
 ├──── 5. Auth Code + Secret ────────────────────────────────────────────►
 │                                                                    SERVER
 ◄──────────────────────── 5. Access Token ──────────────────────────────
 │
 ├──── 6. Request + Access Token ────────────────────────────────────────►
 │                                                                    SERVER
 ◄──────────────────────── 6. Data Response ─────────────────────────────
```



## OAuth 1 vs OAuth 2

Ada dua versi OAuth yang perlu dipahami:

```
OAUTH 1 vs OAUTH 2:

OAUTH 1:
  - Request harus di-sign secara digital (kriptografi)
  - Ada langkah tambahan: Request Token sebelum Auth Code
  - Lebih aman untuk non-HTTPS (karena signing)
  - Lebih kompleks untuk implementasikan
  - Contoh yang masih pakai: Twitter (legacy)

OAUTH 2:
  - Tidak perlu digital signing
  - Alur lebih sederhana (tidak ada Request Token)
  - Wajib pakai HTTPS (karena tidak ada signing)
  - Lebih mudah implementasikan
  - Ada fitur refresh token untuk perpanjang akses
  - Standar modern: Google, GitHub, Facebook, semua pakai OAuth 2

PERBEDAAN UTAMA:
  OAuth 1: Auth Code langsung ditukar ke Access Token
  OAuth 2: Ada langkah Request Token tambahan sebelumnya
```

### Kapan Pakai OAuth?

OAuth digunakan ketika:
1. **Third-party app** perlu akses data user
2. User tidak mau kasih password ke third-party
3. Perlu akses **terbatas** (bukan akses penuh)
4. Perlu kemampuan **revoke akses** kapan saja



## Ringkasan Chapter 1-5

| Chapter | Topik | Key Concept |
|---------|-------|-------------|
| 1 | Pengantar API | Server-client, data otomasi |
| 2 | HTTP Protocol | Request-Response Cycle, 4 komponen request |
| 3 | Data Formats | JSON (key-value), XML (tags), Content-Type |
| 4 | Authentication I | Basic Auth (username:password base64) |
| 5 | Authentication II | API Key (unique token), OAuth (delegated auth) |

**Sumber:** Brian Cooksey, *An Introduction to APIs* (2014), Zapier. Tersedia gratis di [zapier.com/learn/apis](https://zapier.com/learn/apis)
