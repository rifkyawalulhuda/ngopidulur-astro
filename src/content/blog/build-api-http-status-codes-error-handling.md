---
title: "Build API: HTTP Status Codes, Input/Output, dan Error Handling"
description: Kuasai konvensi input/output API yang benar — kapan pakai JSON vs
  form data, HTTP status codes yang tepat, format error response yang konsisten,
  dan content negotiation. Dari buku "Build APIs You Won't Hate" Phil Sturgeon.
pubDate: 2026-08-07T08:00:00.000Z
image: /image/api-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - REST
  - HTTP
  - ErrorHandling
---

API yang baik bukan hanya soal endpoint yang lengkap — tapi juga soal bagaimana ia *berbicara* dengan client. HTTP status code yang salah, format error yang tidak konsisten, dan output yang tidak bisa diprediksi adalah sumber frustrasi utama developer yang mengonsumsi API kamu. Artikel ini merangkum Chapter 3 dan 4 dari *Build APIs You Won't Hate*.

## Daftar Isi

- [Input: JSON vs Form Data](#input-json-vs-form-data)
- [Content Negotiation](#content-negotiation)
- [HTTP Status Codes yang Benar](#http-status-codes-yang-benar)
- [Format Error Response yang Konsisten](#format-error-response-yang-konsisten)
- [Implementasi Base ApiController](#implementasi-base-apicontroller)

---

## Input: JSON vs Form Data

Ada dua format utama untuk mengirim data ke API:

### Form Data (`application/x-www-form-urlencoded`)

```
POST /users
Content-Type: application/x-www-form-urlencoded

name=Ana+Bell&email=ana%40example.com&age=25
```

Kelebihan: mudah dikirim dari HTML form dan curl. Tapi ada batasan: tidak mendukung nested data dan array dengan baik.

### JSON (`application/json`)

```http
POST /users
Content-Type: application/json

{
    "name": "Ana Bell",
    "email": "ana@example.com",
    "address": {
        "city": "Jakarta",
        "zip": "10110"
    }
}
```

**Rekomendasi Phil Sturgeon: pakai JSON untuk semua request body.** Alasannya:
- Mendukung nested objects dan array secara natural
- Konsisten antara request dan response format
- Lebih mudah dibaca dan di-debug
- Framework modern semua support JSON out-of-the-box

```php
// Baca JSON body di Laravel
$data = $request->json()->all();
// atau
$data = $request->input(); // Laravel auto-detect JSON jika Content-Type: application/json
```

---

## Content Negotiation

Client bisa memberitahu server format apa yang ia inginkan via header `Accept`:

```http
GET /users/1
Accept: application/json
```

Untuk file upload, gunakan `multipart/form-data`:

```http
POST /users/1/avatar
Content-Type: multipart/form-data; boundary=----FormBoundary
```

Di Laravel, kamu bisa detect ini:

```php
if ($request->expectsJson()) {
    return response()->json($data);
}

return response()->view('users.show', $data);
```

---

## HTTP Status Codes yang Benar

Ini yang paling sering salah. Jangan selalu return `200 OK` dengan `"success": false` di body.

### 2xx — Sukses

```
200 OK          → GET, PUT, PATCH berhasil (ada body response)
201 Created     → POST berhasil membuat resource baru
204 No Content  → DELETE berhasil (tidak ada body)
```

### 4xx — Error dari Client

```
400 Bad Request         → Input tidak valid, field wajib kosong
401 Unauthorized        → Belum login / token tidak ada
403 Forbidden           → Sudah login tapi tidak punya izin
404 Not Found           → Resource tidak ditemukan
405 Method Not Allowed  → Endpoint ada tapi HTTP verb salah
409 Conflict            → Resource sudah ada (duplikat)
410 Gone                → Resource pernah ada tapi sudah dihapus permanen
422 Unprocessable Entity → Validasi gagal (format benar, tapi logika salah)
429 Too Many Requests   → Rate limit terlampaui
```

### 5xx — Error dari Server

```
500 Internal Server Error → Crash tak terduga
503 Service Unavailable   → Server maintenance / overload
```

### Contoh yang Sering Salah

```
# SALAH — resource tidak ditemukan tapi return 200
GET /users/999
200 OK
{"success": false, "message": "User not found"}

# BENAR
GET /users/999
404 Not Found
{"error": "User not found"}

# SALAH — validasi gagal tapi return 200
POST /users (tanpa email)
200 OK
{"success": false, "errors": {"email": "required"}}

# BENAR
POST /users (tanpa email)
422 Unprocessable Entity
{"errors": {"email": ["Email wajib diisi"]}}
```

---

## Format Error Response yang Konsisten

Buat satu format error yang dipakai di seluruh API. Phil Sturgeon merekomendasikan:

```json
{
    "errors": [
        {
            "code": "USER_NOT_FOUND",
            "message": "User dengan ID tersebut tidak ditemukan"
        }
    ]
}
```

Untuk validasi, gunakan format per-field:

```json
{
    "errors": {
        "email": [
            "Email wajib diisi",
            "Format email tidak valid"
        ],
        "password": [
            "Password minimal 8 karakter"
        ]
    }
}
```

---

## Implementasi Base ApiController

Buat satu abstract controller yang menjadi fondasi semua API controller. Ini menjamin konsistensi response di seluruh API:

```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;

abstract class ApiController extends Controller
{
    protected int $statusCode = 200;

    // Getter/setter untuk status code
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function setStatusCode(int $statusCode): static
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    // ─── Success Responses ───────────────────────────────────────

    public function respond(mixed $data, array $headers = [])
    {
        return response()->json($data, $this->statusCode, $headers);
    }

    public function respondWithItem($item, $transformer)
    {
        $data = fractal($item, $transformer)->toArray();
        return $this->respond($data);
    }

    public function respondWithCollection($collection, $transformer)
    {
        $data = fractal($collection, $transformer)->toArray();
        return $this->respond($data);
    }

    public function respondCreated(mixed $data = null)
    {
        return $this->setStatusCode(201)->respond($data ?? ['message' => 'Created']);
    }

    public function respondNoContent()
    {
        return $this->setStatusCode(204)->respond(null);
    }

    // ─── Error Responses ─────────────────────────────────────────

    public function respondWithError(string $message)
    {
        return $this->respond([
            'errors' => [
                ['message' => $message]
            ]
        ]);
    }

    public function errorNotFound(string $message = 'Not Found')
    {
        return $this->setStatusCode(404)->respondWithError($message);
    }

    public function errorForbidden(string $message = 'Forbidden')
    {
        return $this->setStatusCode(403)->respondWithError($message);
    }

    public function errorInternalError(string $message = 'Internal Error')
    {
        return $this->setStatusCode(500)->respondWithError($message);
    }

    public function errorUnauthorized(string $message = 'Unauthorized')
    {
        return $this->setStatusCode(401)->respondWithError($message);
    }

    public function errorWrongArgs(string $message = 'Wrong Arguments')
    {
        return $this->setStatusCode(400)->respondWithError($message);
    }

    public function errorValidation(array $errors)
    {
        return $this->setStatusCode(422)->respond(['errors' => $errors]);
    }
}
```

### Pakai di Controller

```php
class UserController extends ApiController
{
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorNotFound('User tidak ditemukan');
        }

        return $this->respondWithItem($user, new UserTransformer);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        if ($validator->fails()) {
            return $this->errorValidation($validator->errors()->toArray());
        }

        $user = User::create($request->only('name', 'email'));
        return $this->respondCreated(fractal($user, new UserTransformer)->toArray());
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorNotFound('User tidak ditemukan');
        }

        $user->delete();
        return $this->respondNoContent();
    }
}
```

---

## Ringkasan

| Situasi | Status Code |
|---------|-------------|
| GET/PUT berhasil | 200 |
| POST buat resource baru | 201 |
| DELETE berhasil | 204 |
| Input tidak valid | 400 |
| Belum auth | 401 |
| Tidak punya izin | 403 |
| Resource tidak ada | 404 |
| Validasi gagal | 422 |
| Server error | 500 |

---

Artikel berikutnya: **Testing Endpoint & Output Data dengan Fractal** — cara menulis test untuk API dan memformat output secara konsisten.

---

**Sumber:** Phil Sturgeon, *Build APIs You Won't Hate* (2013), Leanpub.
