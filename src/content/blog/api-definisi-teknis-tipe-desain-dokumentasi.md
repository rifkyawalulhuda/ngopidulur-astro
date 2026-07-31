---
title: "API: Definisi Teknis, Tipe, Desain, dan Dokumentasi"
description: Panduan teknis lengkap Application Programming Interface - definisi
  API di bahasa prosedural dan OOP, tipe API library dan web service, SOAP vs REST,
  prinsip desain API, release policy, dan standar dokumentasi API yang komprehensif.
pubDate: 2026-09-19T08:00:00.000Z
image: /image/apigee-apis-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - REST
  - SOAP
  - WebDevelopment
series: "APIs for Dummies"
seriesOrder: 4
---

Setelah memahami API dari perspektif bisnis, kini saatnya menyelami aspek teknisnya secara mendalam. Artikel ini diadaptasi dari referensi teknis Wikipedia tentang *Application Programming Interface* — membahas definisi formal, implementasi di berbagai paradigma pemrograman, tipe-tipe API, prinsip desain, hingga standar dokumentasi.

## Daftar Isi

- [Definisi Formal API](#definisi-formal-api)
- [API di Bahasa Prosedural](#api-di-bahasa-prosedural)
- [API di Bahasa Object-Oriented](#api-di-bahasa-object-oriented)
- [API Libraries dan Frameworks](#api-libraries-dan-frameworks)
- [API Web Service dan Protokol](#api-web-service-dan-protokol)
- [Tipe-Tipe API Berdasarkan Penggunaan](#tipe-tipe-api-berdasarkan-penggunaan)
- [API untuk Berbagi Konten Web](#api-untuk-berbagi-konten-web)
- [Prinsip Desain API](#prinsip-desain-api)
- [Release Policy API](#release-policy-api)
- [Dokumentasi API](#dokumentasi-api)
- [Metadata dalam Dokumentasi API](#metadata-dalam-dokumentasi-api)



## Definisi Formal API

Dalam pemrograman komputer, **API (Application Programming Interface)** adalah sekumpulan rutinitas, protokol, dan tools untuk membangun aplikasi perangkat lunak.

API mengekspresikan komponen perangkat lunak dalam hal:
- **Operasi** — apa yang bisa dilakukan
- **Input** — data apa yang diperlukan
- **Output** — data apa yang dihasilkan
- **Underlying types** — tipe data yang digunakan

```
KONSEP DASAR API:

Implementasi A  ──┐
                  │    ┌─────────┐    ┌─────────────┐
Implementasi B  ──┼───►│   API   │───►│  Consumer   │
                  │    │Interface│    │  (Program)  │
Implementasi C  ──┘    └─────────┘    └─────────────┘

API mendefinisikan fungsi secara INDEPENDEN dari implementasinya
→ Implementasi bisa berubah tanpa merusak consumer
```

**Filosofi kunci:** API mendefinisikan fungsionalitas yang **independen** dari implementasinya — memungkinkan definisi dan implementasi berubah tanpa merusak antarmuka.

*"A good API makes it easier to develop a program by providing all the building blocks. A programmer then puts the blocks together."*

### API vs ABI

Sering dicampuradukkan, tapi keduanya berbeda:

| Aspek | API | ABI |
|-------|-----|-----|
| Kepanjangan | Application Programming Interface | Application Binary Interface |
| Level | Source code | Binary/compiled |
| Contoh | POSIX | Linux Standard Base |
| Portabilitas | Antar bahasa (dengan adaptasi) | Antar platform binary |

**Bentuk API:**
- International Standard (POSIX)
- Vendor documentation (Microsoft Windows API)
- Libraries bahasa pemrograman (C++ STL, Java API)
- Remote service specification (REST, SOAP)



## API di Bahasa Prosedural

Dalam bahasa prosedural, API menetapkan sekumpulan **fungsi atau rutinitas** yang menyelesaikan tugas tertentu.

### Contoh: Math API di Unix

Perintah `man 3 sqrt` menampilkan signature fungsi sqrt:

```c
SYNOPSIS
#include <math.h>

double sqrt(double X);
float sqrtf(float X);

DESCRIPTION
sqrt computes the positive square root of the argument.

RETURNS
On success, the square root is returned.
If X is real and positive...
```

Dalam C, API ini diinterpretasikan sebagai **kumpulan include files** yang digunakan program untuk mereferensikan fungsi library, beserta dokumentasi human-readable dari man pages.

### Contoh: Math API di Perl

```perl
$ perldoc -f sqrt

sqrt EXPR
sqrt
  Return the square root of EXPR.
  If EXPR is omitted, returns square root of $_.
  Only works on non-negative operands, unless
  you've loaded the standard Math::Complex module.
```

Setiap bahasa prosedural memiliki library-nya sendiri dengan API yang serupa untuk tugas matematika.



## API di Bahasa Object-Oriented

Dalam OOP, API umumnya mencakup deskripsi **sekumpulan class definitions** dengan perilaku yang terkait.

### Contoh: Scanner API di Java

```java
import java.util.Scanner;

public class Test {
    public static void main(String[] args) {
        System.out.println("Enter your name:");
        Scanner inputScanner = new Scanner(System.in);
        String name = inputScanner.nextLine();
        System.out.println("Your name is " + name + ".");
        inputScanner.close();
    }
}
```

Method `nextLine()` dan `close()` adalah bagian dari API class Scanner. Dokumentasinya:

```
public String nextLine()

Advances this scanner past the current line
and returns the skipped input...

Returns:
  the line that was skipped

Throws:
  NoSuchElementException - if no line found
  IllegalStateException - if this scanner is closed
```

### Konsep Penting dalam Object API

**API sebagai Interface:**
```
Class Stack:
  push()  ← tambah item ke stack (public method)
  pop()   ← ambil item teratas (public method)

API Stack = {push(), pop()} atau lebih tepatnya:
"Objek yang bisa di-push dan di-pop"
```

**Marker Interface:**
Tidak semua API membutuhkan implementasi method. Contoh: `Serializable` di Java adalah marker interface yang hanya mensyaratkan perilaku serializable tanpa method publik.

```java
// Marker interface — tidak ada method
public interface Serializable {
    // kosong — hanya menandai bahwa class bisa diserialisasi
}

// Class yang mengimplementasikan
public class User implements Serializable {
    private String name;
    private int age;
    // ...
}
```

### Kualitas Dokumentasi = Keberhasilan API

> *"The quality of the documentation associated with an API is often a factor determining its success in terms of ease of use."*



## API Libraries dan Frameworks

```
HUBUNGAN API, LIBRARY, DAN FRAMEWORK:

API ─────────────────────────────────────────────
│ Mendefinisikan KONTRAK:                        │
│ - Apa yang tersedia                            │
│ - Bagaimana cara menggunakannya                │
│ - Apa yang akan dikembalikan                   │
└────────────────────────────────────────────────

Library ─────────────────────────────────────────
│ Implementasi NYATA dari API:                   │
│ - Kode yang bisa dipanggil                     │
│ - Disimpan sebagai .jar, .dll, .so, dll        │
└────────────────────────────────────────────────

Framework ───────────────────────────────────────
│ Kerangka aplikasi yang lebih besar:            │
│ - Menyediakan struktur pengembangan            │
│ - API lebih opinionated                        │
│ - Bisa include runtime environment             │
└────────────────────────────────────────────────
```

**Perbedaan kunci:**
- **Library** — kamu yang memanggil kode library (Inversion of Control: tidak ada)
- **Framework** — framework yang memanggil kodemu (Inversion of Control: ada)



## API Web Service dan Protokol

Ketika API berinteraksi melalui jaringan, ia membutuhkan format pesan yang language-neutral.

### SOAP

```xml
<!-- SOAP menggunakan XML sebagai container -->
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <GetUserRequest>
      <UserId>12345</UserId>
    </GetUserRequest>
  </soapenv:Body>
</soapenv:Envelope>
```

### REST

```
REST API bisa menggunakan XML atau JSON:

JSON (lebih umum):
GET /api/users/12345
{
  "id": 12345,
  "name": "Rifky Awalul Huda",
  "email": "rifky@example.com"
}

XML (kurang umum):
<User>
  <Id>12345</Id>
  <Name>Rifky Awalul Huda</Name>
</User>
```

### Object Exchange API

API objek dapat menetapkan **format pertukaran objek spesifik** yang bisa digunakan program secara lokal dalam satu aplikasi, atau diekspos sebagai web service.

```
TIPE MESSAGE FORMAT:

Language-specific:
  Java RMI, Python Pickle
  → Hanya bisa digunakan dalam bahasa yang sama

Language-neutral:
  SOAP (XML), REST (JSON/XML), gRPC (Protobuf)
  → Bisa digunakan lintas bahasa dan platform
```



## Tipe-Tipe API Berdasarkan Penggunaan

```
TAKSONOMI API

API
├── By Access Level
│   ├── Public/Open API
│   │   └── Tersedia untuk semua developer
│   ├── Partner API
│   │   └── Hanya untuk partner terseleksi
│   └── Private/Internal API
│       └── Hanya untuk penggunaan internal
│
├── By Technology
│   ├── REST API
│   ├── SOAP API
│   ├── GraphQL API
│   ├── gRPC API
│   └── WebSocket API
│
└── By Purpose
    ├── Database API (SQL, NoSQL)
    ├── Hardware API (GPU, Disk)
    ├── OS API (Windows API, POSIX)
    ├── Web API (Maps, Payment, Social)
    └── Library/Framework API
```



## API untuk Berbagi Konten Web

Praktik mempublikasikan API telah memungkinkan komunitas web menciptakan **arsitektur terbuka** untuk berbagi konten dan data.

### Contoh Penggunaan API Web

**Berbagi foto:**
- Foto di Flickr atau Photobucket → bisa dibagikan ke Facebook via API
- Instagram API → integrasi ke berbagai platform

**Embedding konten:**
- Presentasi SlideShare → bisa diembed di profil LinkedIn via API
- YouTube video → bisa diembed di mana saja via oEmbed API

**Konten dinamis:**
- Komentar live dari Twitter bisa muncul di berbagai website
- Harga saham real-time via Financial API

**Commerce integration:**
- Amazon Product API → tampilkan produk Amazon di website kamu
- Payment Gateway API (Midtrans, Stripe) → proses pembayaran

### Implementasi Open Architecture Web

```
Open API Ecosystem:

Content Creator ──API──► Platform A
                    └──► Platform B
                    └──► Platform C
                    └──► Mobile App
                    └──► Third-party Developer

Konten dibuat SEKALI → tersedia di BANYAK tempat
```



## Prinsip Desain API

Desain API yang baik membutuhkan keahlian khusus. Beberapa penulis terkenal telah membuat rekomendasi, termasuk **Joshua Bloch** dan **Michi Henning**.

### Prinsip Universal

```
API DESIGN PRINCIPLES:

1. CONSISTENCY
   → API harus konsisten dengan API lain dalam sistem
   → Gunakan konvensi penamaan yang seragam
   → GET untuk read, POST untuk create, dll (REST)

2. SIMPLICITY
   → "If the interface is complex, the API will not be used"
   → Minimal learning curve untuk consumer
   → Sedikit konsep yang harus dipahami

3. COMPLETENESS
   → Menyediakan semua yang consumer butuhkan
   → Tidak memaksa consumer melakukan workaround

4. EVOLUTION SUPPORT
   → Versioning yang jelas (v1, v2, ...)
   → Backward compatibility
   → Deprecation policy yang jelas

5. GOOD DOCUMENTATION
   → Semua behavior terdokumentasi
   → Contoh kode yang bisa langsung dijalankan
   → Error messages yang informatif
```

### Conway's Law dalam API Design

*"Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."*

Implikasinya untuk API: desain API yang baik membutuhkan **kolaborasi lintas tim** yang intensif, dan struktur organisasi sangat penting dalam membentuk kualitas API.

### API Consistency

Karena salah satu prinsip API design adalah **konsistensi dengan API yang sudah ada**, detail desain API sangat bergantung pada:
- Bahasa pemrograman yang digunakan
- Sistem/platform tempat API berjalan
- Konvensi yang sudah ada di organisasi

```
CONTOH KONSISTENSI NAMING:

Java Style (camelCase):
  getUserById()
  createNewOrder()
  deleteProduct()

Python Style (snake_case):
  get_user_by_id()
  create_new_order()
  delete_product()

REST Style:
  GET    /users/{id}
  POST   /orders
  DELETE /products/{id}
```



## Release Policy API

Kebijakan utama untuk merilis API:

### 1. Private/Protected API

Informasi tentang API dilindungi dari publik.

**Contoh:** Sony dulu hanya membuat PlayStation 2 API tersedia untuk developer game berlisensi — tidak untuk publik umum. Ini memberikan kontrol atas ekosistem game yang ketat.

**Kapan digunakan:**
- Competitive advantage
- Kontrol kualitas ekosistem
- Keamanan dan compliance

### 2. Partner API

API tersedia untuk pihak tertentu melalui perjanjian business.

```
Partner API Flow:

Company ──────────────────────────────────
│  Partner API (restricted access)        │
│  - Signed NDA / agreement               │
│  - Custom SLA                           │
│  - Dedicated support                    │
└──────────────────────────────────────────
       │              │
   Partner A      Partner B
(approved access)  (approved access)
```

### 3. Public/Open API

API tersedia untuk semua developer.

**Jenis open API:**

| Jenis | Akses | Contoh |
|-------|-------|--------|
| Completely open | Tanpa autentikasi | beberapa cuaca API publik |
| API Key | Daftar untuk get key | Google Maps, Twitter |
| OAuth | Login dengan akun | GitHub, Facebook |
| Paid tier | Berlangganan | Twilio, SendGrid |

### Implikasi Hukum API

Masalah kepemilikan dan hak cipta API menjadi semakin penting. Kasus **Oracle vs Google** tentang Java API di Android menjadi preseden penting:

- Oracle mengklaim copyright atas Java API
- Google mengimplementasikan Java API di Android
- Implikasi: implementasi API tidak sama dengan memiliki API



## Dokumentasi API

Dokumentasi API yang baik adalah **faktor penentu keberhasilan** sebuah API.

### Elemen Dokumentasi API yang Lengkap

```
DOKUMENTASI API KOMPREHENSIF:

1. DATA STRUCTURES
   └── Semua struktur data yang digunakan

2. FUNCTION SIGNATURES
   ├── Nama fungsi
   ├── Nama parameter (jika berlaku)
   ├── Tipe parameter
   ├── Return type
   └── Apakah parameter bisa dimodifikasi

3. ERROR HANDLING
   └── Semua kondisi error dan cara menanganinya

4. PRE/POST CONDITIONS
   ├── Pre-conditions (apa yang harus benar sebelum panggil)
   ├── Post-conditions (apa yang dijamin setelah panggil)
   └── Invariants

5. STATE CHANGES
   └── Bagaimana state berubah setelah eksekusi fungsi

6. SIDE EFFECTS
   └── Efek samping yang mungkin terjadi

7. ACCESSIBILITY CONSTRAINTS
   └── Batasan akses dan visibilitas
```

### Dokumentasi Object API

Object API harus mendokumentasikan:
- Semua method yang diekspos secara publik
- Behavior dalam lingkungan concurrent (multi-thread)
- Semua konstanta dan nested objects publik

### Dokumentasi Format dan Versi

```
VERSION INFORMATION DALAM DOCS:

Untuk Library:
  └── Language version number yang kompatibel
  └── Library dan resource dependencies
  └── Protocol versions yang diimplementasikan
  └── OS/Platform version yang didukung

Untuk Cross-Language API:
  └── Dokumentasikan batasan penggunaan di bahasa non-native
  └── Contoh adaptasi untuk setiap bahasa yang didukung
```



## Metadata dalam Dokumentasi API

Dokumentasi API bisa diperkaya dengan **metadata** yang bisa diproses secara otomatis.

### Java Annotations

```java
/**
 * Retrieves a user by their unique identifier.
 *
 * @param userId the unique identifier of the user
 * @return the User object if found
 * @throws UserNotFoundException if no user with the given id exists
 * @throws DatabaseException if database connection fails
 * @since 1.0
 * @deprecated Use getUserByEmail() instead (since 2.0)
 */
@Deprecated
public User getUserById(int userId) throws UserNotFoundException {
    // implementation
}
```

### OpenAPI/Swagger (REST API)

```yaml
openapi: 3.0.0
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
```

### Manfaat Metadata API

```
METADATA API DIGUNAKAN OLEH:

Compiler:
  └── Validasi penggunaan API yang sudah deprecated

IDE/Tools:
  └── Auto-complete, type checking, error highlighting

Runtime Environment:
  └── Custom behaviors (caching, logging, security)
  └── Serialization/deserialization otomatis

Documentation Generator:
  └── JavaDoc, Sphinx, Swagger UI
  └── Generate docs dari annotation otomatis
```



## Rangkuman: Ekosistem API Lengkap

```
EKOSISTEM API — PANDANGAN MENYELURUH

DEFINISI & KONTRAK
  API Spec ──► Interface Definition
              (apa yang bisa dilakukan, bagaimana caranya)

IMPLEMENTASI
  Library/Framework ──► Actual Code
                       (yang menjalankan kontrak)

KONSUMSI
  Application ──► Call API
                 (pakai building blocks yang tersedia)

DISTRIBUSI
  ├── Library (JAR, DLL, .so)
  ├── Web Service (REST, SOAP endpoint)
  └── SDK (API + tools + docs + samples)

GOVERNANCE
  ├── Versioning (v1, v2, semantic versioning)
  ├── Deprecation policy
  └── Release policy (public/partner/private)

DOKUMENTASI
  ├── Reference docs (semua method, params, returns)
  ├── Guides & tutorials (cara pakai)
  └── Changelog (apa yang berubah tiap versi)
```



## Ringkasan Seri APIs for Dummies

Empat artikel seri ini memberikan pemahaman komprehensif tentang API:

| Artikel | Sumber | Fokus |
|---------|--------|-------|
| 1 | Apigee (2014) | API sebagai strategi bisnis, customer experience |
| 2 | Apigee (2014) | Agility, REST vs SOAP, KPI, studi kasus |
| 3 | IBM (2018) | API-First, management, governance, hybrid cloud |
| 4 | Wikipedia | Definisi teknis, tipe, desain, dokumentasi |

**Pesan utama:** API adalah jembatan antara implementasi dan konsumsi — antara bisnis dan teknologi, antara sistem dan pengguna, antara masa lalu dan inovasi masa depan.



**Sumber:** Wikipedia, *Application Programming Interface* — [en.wikipedia.org/wiki/Application_programming_interface](https://en.wikipedia.org/wiki/Application_programming_interface)
