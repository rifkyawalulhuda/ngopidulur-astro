---
title: "Build API: Merencanakan Endpoint RESTful yang Benar"
description: Cara mengubah kebutuhan bisnis menjadi endpoint RESTful yang
  terstruktur — dari action plan, konvensi penamaan URL, HTTP verbs, hingga
  penanganan input. Panduan praktis dari "Build APIs You Won't Hate".
pubDate: 2026-08-06T08:00:00.000Z
image: /image/api-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - REST
  - PHP
  - WebDevelopment
---

Database sudah penuh data dummy. Sekarang saatnya merencanakan endpoint. Banyak developer langsung coding tanpa perencanaan dan hasilnya: endpoint yang inkonsisten, tidak intuitif, dan sulit di-maintain. Bab ini dari *Build APIs You Won't Hate* mengajarkan cara berpikir terstruktur sebelum menulis satu baris kode pun.

## Daftar Isi

- [Mulai dari Action Plan](#mulai-dari-action-plan)
- [Teori Endpoint RESTful](#teori-endpoint-restful)
- [Auto-Increment ID adalah Masalah](#auto-increment-id-adalah-masalah)
- [HTTP Verbs yang Benar](#http-verbs-yang-benar)
- [Menerima Input di API](#menerima-input-di-api)
- [Contoh Implementasi di Laravel](#contoh-implementasi-di-laravel)

---

## Mulai dari Action Plan

Sebelum mendefinisikan URL, buat daftar **aksi** yang dibutuhkan API. Diskusikan dengan developer mobile, frontend, atau diri sendiri kalau kamu solo developer.

Contoh action plan untuk sistem check-in:

```
Categories
  - Create
  - List

Places
  - Create, Read, Update, Delete
  - List (lat, lon, distance)
  - Image

Users
  - Create, Read, Update, Delete
  - List (active, suspended)
  - Image, Favorites, Checkins, Followers

Checkins
  - Create, Read, Update, Delete
  - List, Image
```

> Ingat: tidak setiap aksi butuh endpoint sendiri. Misalnya "favorite a place" bisa dilakukan dengan mengirim `is_favorite: true` ke endpoint PUT `/places/{id}`.

---

## Teori Endpoint RESTful

### GET Resources

```
GET /resources          → List semua (paginated, urutan logis)
GET /resources/X        → Satu resource (X bisa ID, slug, username)
GET /resources/X,Y,Z    → Multiple resources sekaligus
```

### Sub-Resources

```
GET /places/X/checkins        → Semua checkin untuk place tertentu
GET /users/X/checkins         → Semua checkin untuk user tertentu
GET /users/X/checkins/Y       → (Dipertanyakan) — lebih baik: GET /checkins/Y
```

### POST, PUT, DELETE

```
POST   /resources           → Buat resource baru
PUT    /resources/X         → Update resource X (full update)
PATCH  /resources/X         → Update sebagian field resource X
DELETE /resources/X         → Hapus resource X
```

---

## Auto-Increment ID adalah Masalah

Mengekspos auto-increment integer sebagai ID di URL punya banyak risiko:

- **Enumerasi**: user bisa iterasi `/users/1`, `/users/2`, dst untuk harvest data
- **Bocor info bisnis**: dari ID kamu bisa tebak jumlah total record
- **Konflik saat merge database**: ID 1 di database A beda dengan ID 1 di database B

**Solusi yang disarankan: UUID atau hash**

```php
// Gunakan UUID sebagai primary key
use Illuminate\Support\Str;

protected static function boot()
{
    parent::boot();
    static::creating(function ($model) {
        $model->id = Str::uuid();
    });
}
```

Atau gunakan Hashids untuk mengobfuscate integer ID:

```php
// composer require hashids/hashids
$hashids = new Hashids\Hashids('your-salt', 8);
$encoded = $hashids->encode(1234);  // "VolejRejNm"
$decoded = $hashids->decode('VolejRejNm'); // [1234]
```

---

## HTTP Verbs yang Benar

Banyak developer salah menggunakan HTTP verbs. Panduan singkat:

| Verb | Idempoten? | Gunakan untuk |
|------|-----------|---------------|
| GET | ✓ | Baca data — JANGAN ada side effect |
| POST | ✗ | Buat resource baru |
| PUT | ✓ | Update penuh (replace seluruh resource) |
| PATCH | ✗ | Update sebagian field |
| DELETE | ✓ | Hapus resource |

### Contoh yang Sering Salah

```
# SALAH — GET tidak boleh mengubah data
GET /users/1/activate

# BENAR — gunakan PUT/PATCH
PUT /users/1
Body: { "active": true }

# SALAH — aksi tidak boleh di URL
POST /places/1/delete

# BENAR
DELETE /places/1
```

---

## Menerima Input di API

Ada beberapa cara mengirim data ke API. Pilih yang tepat berdasarkan konteks:

### Query String (GET)

Untuk filter, sort, pagination — data yang tidak sensitif:

```
GET /places?lat=40.768&lon=-73.994&distance=5&page=2
GET /users?status=active&sort=created_at&order=desc
```

### Request Body (POST/PUT/PATCH)

Untuk data yang akan disimpan. Gunakan `Content-Type: application/json`:

```json
POST /users
{
    "name": "Ana Bell",
    "email": "ana@example.com",
    "password": "secret123"
}
```

### Route Parameter

Untuk identifikasi resource spesifik:

```
GET  /users/{id}
PUT  /users/{id}
DELETE /users/{id}
```

---

## Contoh Implementasi di Laravel

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    // Places
    Route::get('places', [PlaceController::class, 'index']);
    Route::post('places', [PlaceController::class, 'store']);
    Route::get('places/{id}', [PlaceController::class, 'show']);
    Route::put('places/{id}', [PlaceController::class, 'update']);
    Route::delete('places/{id}', [PlaceController::class, 'destroy']);

    // Sub-resources
    Route::get('places/{id}/checkins', [PlaceController::class, 'checkins']);

    // Users
    Route::apiResource('users', UserController::class);
    Route::get('users/{id}/favorites', [UserController::class, 'favorites']);
});
```

```php
// app/Http/Controllers/PlaceController.php
class PlaceController extends ApiController
{
    public function index(Request $request)
    {
        $lat      = $request->query('lat');
        $lon      = $request->query('lon');
        $distance = $request->query('distance', 10); // default 10 km

        if (!$lat || !$lon) {
            return $this->errorWrongArgs('lat dan lon wajib diisi');
        }

        $places = Place::nearby($lat, $lon, $distance)
            ->paginate(20);

        return $this->respondWithCollection($places, new PlaceTransformer);
    }

    public function show($id)
    {
        $place = Place::find($id);

        if (!$place) {
            return $this->errorNotFound('Place tidak ditemukan');
        }

        return $this->respondWithItem($place, new PlaceTransformer);
    }
}
```

---

## Ringkasan

| Konsep | Best Practice |
|--------|---------------|
| Perencanaan | Buat action plan sebelum coding |
| ID | Gunakan UUID atau hash, bukan auto-increment |
| URL | Noun bukan verb: `/places` bukan `/getPlaces` |
| HTTP Verbs | GET=baca, POST=buat, PUT=update full, DELETE=hapus |
| Input | Query string untuk filter, body untuk data, params untuk ID |

---

Artikel berikutnya: **Input/Output API, HTTP Status Codes, dan Error Handling** — cara memastikan API kamu berbicara dengan bahasa yang benar.

---

**Sumber:** Phil Sturgeon, *Build APIs You Won't Hate* (2013), Leanpub.
