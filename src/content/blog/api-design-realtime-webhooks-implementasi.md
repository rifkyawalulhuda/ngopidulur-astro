---
title: "API Design, Real-Time Communication, dan Implementasi API"
description: Panduan lanjutan API dari Zapier - desain REST API dengan resources
  endpoints query params, polling vs long polling vs webhooks subscription,
  dokumentasi API, HTTP client, SDK library, dan cara implementasi API pertama.
pubDate: 2026-09-24T08:00:00.000Z
image: /image/apigee-apis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - REST
  - Webhooks
  - WebDevelopment
series: "APIs for Dummies"
seriesOrder: 6
---

Di artikel sebelumnya, kita sudah memahami fondasi API: HTTP, format data, dan autentikasi. Kini saatnya melihat bagaimana semua konsep itu **bergabung menjadi API yang nyata** — mulai dari cara mendesain API, cara menerima update secara real-time, hingga cara mulai menggunakannya dalam kode.

## Daftar Isi


- [Mendesain API dari Nol](#mendesain-api-dari-nol)
- [SOAP vs REST](#soap-vs-rest)
- [4 Langkah Mendesain REST API](#4-langkah-mendesain-rest-api)
- [Resources dan Endpoints](#resources-dan-endpoints)
- [Menghubungkan Resources](#menghubungkan-resources)
- [Query Parameters untuk Pencarian](#query-parameters-untuk-pencarian)
- [Real-Time Communication](#real-time-communication)
- [Polling](#polling)
- [Long Polling](#long-polling)
- [Webhooks](#webhooks)
- [Subscription Webhooks](#subscription-webhooks)
- [Perbandingan Metode Real-Time](#perbandingan-metode-real-time)
- [Implementasi API Pertamamu](#implementasi-api-pertamamu)
- [Dokumentasi API](#dokumentasi-api)
- [HTTP Client](#http-client)
- [SDK dan Library](#sdk-dan-library)

## Mendesain API dari Nol


Di chapter 6, Brian Cooksey mengajak kita **membangun API pizza parlor dari awal** — cara belajar terbaik adalah dengan melakukan.

### Mengorganisir Data


Bayangkan kamu memiliki restoran pizza dan ingin membuat API. Pertama: **data apa yang perlu diorganisir?**

**DATA DALAM PIZZA PARLOR:**

Bisnis entity (nouns):
- Orders (pesanan)
- Customers (pelanggan)
- Menu items (menu)
- Ingredients (bahan)

API harus mengekspos nouns ini sebagai RESOURCES
setiap dengan URL-nya sendiri

## SOAP vs REST


Sebelum mulai desain, pilih arsitektur terlebih dahulu:

**DUA ARSITEKTUR API WEB POPULER:**

SOAP (Simple Object Access Protocol):
- XML-based, format request-response sangat ketat
- Digunakan di enterprise, banking, legacy systems
- Verbose tapi sangat formal dan terstandarisasi
- Contoh: Payment Gateway lama, BPJS, perbankan

REST (Representational State Transfer):
- Fleksibel, bisa JSON/XML/dll
- Digunakan oleh hampir semua API modern
- Lebih mudah dipelajari dan diimplementasikan
- Contoh: Twitter, GitHub, Google Maps, semua startup

STATISTIK ADOPSI (2014, tren masih berlanjut):
- REST: ~70% API baru menggunakan REST
- SOAP: ~15% (menurun)
- Lainnya: ~15%

> *"When discussing APIs, you might hear talk of 'soap' and 'rest' and wonder whether the software developers are doing work or planning a vacation."* — Brian Cooksey

Untuk API modern baru: **pilih REST**.

## 4 Langkah Mendesain REST API


**LANGKAH DESAIN REST API:**

1. Tentukan resource apa yang perlu tersedia
- Apa "nouns" dalam bisnis kamu?
- Order, Customer, Product, Invoice?

2. Assign URL untuk setiap resource
- /orders
- /orders/{id}
- /customers
- /customers/{id}

3. Tentukan aksi apa yang boleh dilakukan client
- GET /orders (list semua)
- POST /orders (buat baru)
- GET /orders/{id} (detail satu)
- PUT /orders/{id} (update)
- DELETE /orders/{id} (hapus)

4. Tentukan data yang diperlukan tiap aksi
- Format apa? (JSON rekomended)
- Field apa yang required vs optional?
- Validasi apa yang diperlukan?

## Resources dan Endpoints


**Resource** adalah "noun" bisnis dalam API — entitas yang bisa diakses dan dimanipulasi.

**Endpoint** adalah URL spesifik yang merepresentasikan resource tersebut.

### Pizza Parlor API — Endpoint Design


**PIZZA PARLOR REST API:**

Collection endpoints:
GET    /orders          ← list semua order
POST   /orders          ← buat order baru

Item endpoints:
GET    /orders/{id}     ← detail satu order
PUT    /orders/{id}     ← update satu order
DELETE /orders/{id}     ← hapus satu order

Sub-resource endpoints:
GET    /customers/{id}/orders ← semua order dari customer tertentu

### Contoh Lengkap Desain Order Endpoint


```http
POST /orders

Request Body:
{
  "crust": "original",
  "toppings": ["cheese", "pepperoni"],
  "size": "large",
  "notes": "extra crispy"
}

Response 201 Created:
{
  "id": 456,
  "crust": "original",
  "toppings": ["cheese", "pepperoni"],
  "size": "large",
  "notes": "extra crispy",
  "status": "received",
  "created_at": "2026-07-31T08:00:00Z",
  "estimated_minutes": 25
}
```

## Menghubungkan Resources


Ketika bisnis berkembang, kita perlu **menghubungkan resources satu sama lain**. Pizza parlor kita makin ramai — saatnya track pelanggan!

Ada dua pendekatan untuk menangani associated data:

### Pendekatan 1: Nested Resource


**NESTED RESOURCE:**

GET /customers/123/orders
- Kembalikan semua order dari customer 123

Respons:
[
- {"id": 456, "crust": "original", ...},
- {"id": 457, "crust": "thin", ...}
]

COCOK untuk:
- Relationship yang erat (order selalu milik customer)
- Query yang sering dilakukan bersamaan

### Pendekatan 2: Include di Response


**INCLUDE DALAM RESPONSE:**

GET /orders/456?include=customer

Respons:
{
- "id": 456,
- "crust": "original",
- "customer": {
- "id": 123,
- "name": "Rifky Awalul",
- "phone": "081234"
- }
}

COCOK untuk:
- Mengurangi multiple round trips
- Data yang sering dibutuhkan bersamaan

## Query Parameters untuk Pencarian


Ketika data bertambah, list endpoint yang mengembalikan semua record menjadi tidak praktis.

**MASALAH:**

- GET /orders
- Mengembalikan 3 JUTA record sekaligus!
- Tidak berguna, lambat, membebani server

SOLUSI: Query Parameters
- GET /orders?topping=pepperoni
- Hanya kembalikan order dengan pepperoni

**CONTOH QUERY PARAMETERS:**

- /orders?topping=pepperoni
- /orders?status=baking
- /orders?customer_id=123
/orders?limit=20&offset=40      ← pagination
- /orders?sort=created_at&order=desc
- /orders?from=2026-01-01&to=2026-12-31

### Multiple Parameters


**KOMBINASI QUERY PARAMETERS:**

GET /orders?topping=pepperoni&status=completed&limit=10

URL anatomy:
/orders              ← base endpoint
?                    ← mulai query string
topping=pepperoni    ← parameter 1
&                    ← pemisah parameter
status=completed     ← parameter 2
- &
limit=10             ← parameter 3

API menentukan parameter apa yang didukung — nama parameter harus persis sama dengan yang didokumentasikan.

## Real-Time Communication


Chapter 7 membahas tantangan yang sering dilupakan: **bagaimana client tahu jika data di server berubah?**

### Dua Arah Integrasi


CLIENT-DRIVEN INTEGRATION (mudah):
User klik tombol → Client tahu persis kapan data berubah
- Client langsung kirim update ke server via API
- Real-time tanpa masalah

Contoh: User submit form → POST ke API

SERVER-DRIVEN INTEGRATION (sulit):
- Data berubah di server, client tidak tahu kapan
- Server tidak bisa "push" ke client begitu saja
- Client harus cari cara untuk tahu perubahan ini

- Contoh: Status pizza berubah dari "baking" ke "ready"
- Bagaimana customer app tahu ini?

## Polling


Solusi paling sederhana: **client terus bertanya**!

**POLLING:**

Client: "Sudah siap?" → Server: "Belum"
(tunggu 5 menit)
Client: "Sudah siap?" → Server: "Belum"
(tunggu 5 menit)
Client: "Sudah siap?" → Server: "SUDAH! Nomor 456 siap diambil!"

**IMPLEMENTASI:**

Setiap N detik/menit:
- response = GET /orders/456
if response.status == "ready":
- notify_customer()
else:
- wait(interval)
- repeat

**Keunggulan:** Sangat sederhana, tidak butuh setup khusus.

**Kelemahan yang besar:**

**MASALAH POLLING:**

Jika poll setiap 1 jam:
- Worst case: customer menunggu 59 menit untuk tahu pizzanya siap
- Not real-time

Jika poll setiap 1 menit:
- 60 request/jam PER ORDER yang berjalan
- Dengan 1000 order aktif = 60,000 request/jam
- Sebagian besar request = sia-sia (tidak ada perubahan)
- Membebani server!

DILEMMA: Lebih sering = lebih real-time, tapi lebih boros

## Long Polling


Peningkatan dari polling biasa — server **menahan respons** sampai ada data baru:

**LONG POLLING:**

Client: "Apakah ada update untuk order 456?"
Server: [tidak jawab dulu... menunggu...]
[15 menit berlalu]
Server: "Sekarang ada! Status berubah ke ready!"
Client: "Terima kasih!" → langsung kirim request baru

**VS POLLING BIASA:**

Polling: "Ada update?" → "Tidak" → tunggu → "Ada update?" → "Tidak"
Long Polling: "Ada update?" → [server tunggu 15 menit] → "Ada!"

**KEUNGGULAN:**

- Lebih sedikit request yang sia-sia
- Lebih mendekati real-time

**KELEMAHAN:**

- Connection tetap terbuka lama (resource server)
- Masih tidak seefisien webhooks
- Bisa timeout jika tidak ada update terlalu lama

## Webhooks


Webhooks membalik paradigma: **bukan client yang bertanya, tapi server yang memberitahu**.

**WEBHOOKS:**

Setup sekali:
- Client: "Server, kalau ada update order,
tolong kirimi aku ke URL ini:
- https://myapp.com/order-updates"
- Server: "OK, aku catat!"

Ketika ada update:
- Server: [POST] https://myapp.com/order-updates
- {"order_id": 456, "status": "ready"}
- Client: "Diterima! Aku proses..."

TIDAK ADA YANG BERTANYA — SERVER YANG MEMBERITAHU

### Mengapa Webhooks Bekerja?


**KUNCI WEBHOOKS:**

- Client yang biasanya hanya "consumer" sekarang juga
- berperan sebagai "server" — bisa menerima request!

Traditional: Client → Server (one-way)
Webhooks: Client ←→ Server (two-way via callback URL)

### Contoh: Zapier dan Webhooks


**ZAPIER WEBHOOK EXAMPLE:**

1. Zapier registrasikan Callback URL ke layanan sumber
- (misal: Stripe payment webhook)

2. Ketika ada pembayaran baru:
Stripe → POST → https://hooks.zapier.com/hooks/catch/...
- {"payment_id": "pay_123", "amount": 50000, "status": "succeeded"}

3. Zapier terima webhook, trigger automation:
- Kirim email konfirmasi ke customer
- Update Google Sheets
- Kirim notifikasi Slack ke tim

**Keunggulan webhooks:**
- True real-time (tidak ada delay)
- Efisien (hanya 1 request per event)
- Tidak membebani server dengan polling

**Kelemahan webhooks:**
- Client harus memiliki server yang bisa menerima request
- Perlu setup di kedua sisi
- Perlu handling jika webhook gagal diterima

## Subscription Webhooks


Evolusi dari webhooks — membuat setup lebih otomatis:

BASIC WEBHOOKS (manual):
1. User pergi ke dashboard layanan
2. Copy-paste Callback URL ke form
3. Pilih events yang ingin disubscribe
4. Simpan

SUBSCRIPTION WEBHOOKS (otomatis):
1. Client call API endpoint: POST /webhooks/subscriptions
- {"callback_url": "https://myapp.com/events",
- "events": ["order.completed", "payment.received"]}
2. Server confirm subscription
3. Done! Events akan dikirim ke callback URL

Subscription webhooks sangat powerful karena **bisa dikonfigurasi via API** — tidak perlu intervensi manual.

## Perbandingan Metode Real-Time


**PERBANDINGAN LENGKAP:**

- Polling   Long Poll  Webhooks  Sub.Webhooks
Real-time?        ✗ (delay) ~ (semi)   ✓ (true)  ✓ (true)
Efisiensi         ✗ (boros)  ~ (sedang) ✓ (hemat) ✓ (hemat)
Setup complexity  ✓ (mudah)  ~ (sedang) ~ (sedang) ✓ (mudah)
Butuh server?     ✗ (tidak)  ✗ (tidak)  ✓ (ya!)   ✓ (ya!)
Standard?         ✓          ✓           ~ (varies) ~ (varies)

**KAPAN PAKAI APA:**

Polling:
- Client tidak bisa menerima request (mobile/browser sederhana)
- Update tidak kritis (bisa delay beberapa menit)
- Development/prototyping cepat

Long Polling:
- Ingin lebih real-time dari polling tapi tidak bisa setup server
- Legacy system yang tidak support webhooks

Webhooks:
- True real-time dibutuhkan
- Client punya server sendiri
- Events harus diproses secara otomatis

Subscription Webhooks:
- Semuanya di atas, ditambah butuh konfigurasi dinamis
- Multiple event types berbeda

## Implementasi API Pertamamu


Chapter 8 menjawab pertanyaan praktis: **"Oke, aku sudah paham teorinya. Sekarang bagaimana cara mulai?"**

### Dari Plan ke Product


Setiap interaksi API melibatkan dua sisi. Kamu bisa jadi:
1. **API Provider** — yang membuat dan menyediakan API
2. **API Consumer** — yang menggunakan API yang sudah ada

Untuk memulai, **mengonsumsi API yang sudah ada** jauh lebih mudah dari membuat API baru.

## Dokumentasi API


Sebelum menggunakan API apapun, baca dokumentasinya dulu. Dokumentasi API yang baik mencakup:

**KOMPONEN DOKUMENTASI API YANG BAIK:**

1. AUTHENTICATION:
- Metode apa yang digunakan? (Basic, API Key, OAuth)
- Cara mendapatkan credentials
- Cara menyertakan credentials di request

2. ENDPOINTS:
- URL dasar (base URL)
- Semua endpoint yang tersedia
- HTTP method untuk setiap endpoint

3. DATA FORMAT:
- Format request (JSON? XML?)
- Format response (apa saja field yang dikembalikan)
- Required vs optional fields

4. CONTOH:
- Contoh request lengkap
- Contoh response
- Code snippets dalam berbagai bahasa

5. ERROR HANDLING:
- Status code yang mungkin
- Format pesan error
- Cara menangani setiap error

6. RATE LIMITING:
- Berapa banyak request yang diizinkan
- Apa yang terjadi jika melewati batas

## HTTP Client


Cara paling sederhana untuk berinteraksi dengan API **tanpa perlu coding**:

**HTTP CLIENT TOOLS:**

GUI Tools (no coding):
Postman    ← paling populer, feature lengkap
Insomnia   ← ringan, open source
Thunder Client ← extension VS Code

Command Line:
curl ← tersedia di semua OS, sangat powerful
httpie ← lebih user-friendly dari curl

Browser Extensions:
- REST Client (VS Code extension)
- Bruno

**CONTOH CURL:**

- curl -X GET "https://api.github.com/users/rifkyawalulhuda" \
-H "Accept: application/json"

**CONTOH CURL DENGAN AUTH:**

- curl -X POST "https://api.example.com/orders" \
-H "Authorization: Bearer YOUR-API-KEY" \
-H "Content-Type: application/json" \
-d '{"crust": "original", "toppings": ["cheese"]}'

## SDK dan Library


Untuk penggunaan berulang dalam kode, gunakan **SDK atau Library**:

**HIERARKI TOOLS:**

HTTP Client (Postman, curl):
- Eksplorasi, testing, one-off requests
- Tidak perlu coding

Generic HTTP Library (requests, axios, fetch):
- Membuat HTTP request dari kode
- Lebih kontrol, tapi harus parse response sendiri
- Tersedia di semua bahasa

API-Specific SDK/Library:
- Library khusus untuk satu API
- Abstraksi lebih tinggi — tidak perlu tahu detail HTTP
- Lebih cepat untuk mulai
- Contoh: stripe-python, google-cloud-python, boto3 (AWS)

**Contoh perbandingan Generic HTTP vs SDK:**

Generic HTTP (Python requests):

```python
response = requests.post(
    "https://api.stripe.com/v1/charges",
    auth=("sk_test_...", ""),
    data={"amount": 50000, "currency": "idr"}
)
charge = response.json()
```

API-Specific SDK (stripe-python):

```python
import stripe
stripe.api_key = "sk_test_..."
charge = stripe.Charge.create(amount=50000, currency="idr")
# Jauh lebih bersih!
```

### Memilih Tool yang Tepat


**DECISION TREE:**

Apakah ada SDK resmi?
YES → Gunakan SDK jika ekosistem bahasa cocok
NO  → Gunakan generic HTTP library

Seberapa sering menggunakan API?
SEKALI/JARANG → Generic HTTP client (Postman/curl)
BERULANG      → Library/SDK dalam kode

Di mana kode berjalan?
BROWSER/FRONTEND → JavaScript fetch() atau axios
SERVER/BACKEND   → Sesuai bahasa: Python requests,
- Node.js axios/got, Java OkHttp, dll.

## Ringkasan Seri Introduction to APIs


Dua artikel ini merangkum buku *An Introduction to APIs* oleh Brian Cooksey:

| Chapter | Topik | Key Concept |
|---------|-------|-------------|
| 1 | Pengantar | Client-server, API sebagai jembatan data |
| 2 | Protokol | HTTP request-response, methods, status codes |
| 3 | Data Format | JSON (key-value), XML (tags), Content-Type |
| 4 | Auth I | Basic Auth (base64 username:password) |
| 5 | Auth II | API Key, OAuth 1 vs 2 flow |
| 6 | API Design | REST resources, endpoints, query params |
| 7 | Real-Time | Polling, long polling, webhooks |
| 8 | Implementasi | Docs, HTTP client, SDK, next steps |

### 10 Hal yang Harus Kamu Ingat tentang API


1. API = jembatan antara komputer dengan data
2. Client selalu memulai komunikasi, server merespons
3. HTTP adalah protokol komunikasi dasar
4. GET (baca), POST (buat), PUT (update), DELETE (hapus)
5. Status 2xx = sukses, 4xx = error client, 5xx = error server
6. JSON lebih populer dari XML untuk API modern
7. Content-Type header menentukan format data
8. Basic Auth < API Key < OAuth (dalam hal keamanan & fleksibilitas)
9. Webhooks jauh lebih efisien dari polling
10. Baca dokumentasi API sebelum mulai coding!

**Sumber:** Brian Cooksey, *An Introduction to APIs* (2014), Zapier. Tersedia gratis di [zapier.com/learn/apis](https://zapier.com/learn/apis)

## Referensi

- Cooksey, B. (2014). *An Introduction to APIs*. Zapier.
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine.
- Webber, J., Parastatidis, S., & Robinson, I. (2010). *REST in Practice*. O'Reilly Media.
- Richardson, L., Amundsen, M., & Ruby, S. (2013). *RESTful Web APIs*. O'Reilly Media.
