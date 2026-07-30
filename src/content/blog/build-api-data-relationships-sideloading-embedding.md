---
title: "Build API: Data Relationships — Sub-Resource, Sideloading, Embedding"
description: Tiga strategi menangani relasi antar resource dalam REST API —
  sub-resources, foreign key arrays, compound documents (sideloading), dan
  embedded documents. Trade-off, kapan pakai mana, dari "Build APIs You Won't Hate".
pubDate: 2026-08-09T08:00:00.000Z
image: /image/api-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - REST
  - DataRelationships
  - WebDevelopment
---

Salah satu keputusan paling krusial dalam desain API adalah: **bagaimana menangani relasi antar resource?** Apakah checkin milik user, atau milik place? Bagaimana cara client mendapatkan data terkait tanpa terlalu banyak request? Chapter 7 dari *Build APIs You Won't Hate* membahas empat pendekatan dengan trade-off masing-masing.

## Daftar Isi

- [Masalah N+1 di API](#masalah-n1-di-api)
- [Pendekatan 1: Sub-Resources](#pendekatan-1-sub-resources)
- [Pendekatan 2: Foreign Key Arrays](#pendekatan-2-foreign-key-arrays)
- [Pendekatan 3: Compound Documents (Sideloading)](#pendekatan-3-compound-documents-sideloading)
- [Pendekatan 4: Embedded Documents (Nesting)](#pendekatan-4-embedded-documents-nesting)
- [Kapan Pakai Yang Mana?](#kapan-pakai-yang-mana)

---

## Masalah N+1 di API

Bayangkan client ingin menampilkan daftar checkin beserta nama place-nya. Tanpa strategi yang tepat, client terpaksa melakukan:

```
GET /checkins          → dapat 20 checkin
GET /places/abc        → dapat place untuk checkin #1
GET /places/def        → dapat place untuk checkin #2
GET /places/ghi        → dapat place untuk checkin #3
... (20 request tambahan!)
```

Ini **N+1 problem** di level API. Empat pendekatan berikut menyelesaikan masalah ini dengan cara berbeda.

---

## Pendekatan 1: Sub-Resources

Sub-resource adalah endpoint yang mewakili relasi. Resource anak diakses melalui parent-nya.

```
GET /users/{id}/checkins      → semua checkin milik user
GET /places/{id}/checkins     → semua checkin di place ini
GET /users/{id}/favorites     → semua place favorit user
```

### Implementasi

```php
// routes/api.php
Route::get('users/{id}/checkins', [UserController::class, 'checkins']);
Route::get('places/{id}/checkins', [PlaceController::class, 'checkins']);

// UserController.php
public function checkins($userId)
{
    $user = User::find($userId);

    if (!$user) {
        return $this->errorNotFound('User tidak ditemukan');
    }

    $checkins = $user->checkins()
        ->with('place')
        ->paginate(20);

    return $this->respondWithCollection($checkins, new CheckinTransformer);
}
```

### Kelebihan dan Kekurangan

**Kelebihan:**
- URL semantik dan mudah dipahami
- Bisa filter otomatis berdasarkan parent
- Cocok untuk resource yang conceptually "milik" parent

**Kekurangan:**
- Resource yang sama bisa punya banyak URL (`/users/1/checkins` vs `/checkins?user_id=1`)
- Nested terlalu dalam jadi aneh: `/users/1/checkins/2/comments`
- Phil Sturgeon menyarankan: **maksimal satu level nesting**

---

## Pendekatan 2: Foreign Key Arrays

Response resource menyertakan array ID dari resource terkait. Client bertanggung jawab fetch data terkait secara terpisah.

```json
GET /users/1

{
    "data": {
        "id": "user_abc",
        "name": "Ana Bell",
        "place_ids": ["place_xyz", "place_def", "place_ghi"],
        "checkin_ids": ["chk_001", "chk_002", "chk_003"]
    }
}
```

Client bisa fetch multiple resource sekaligus:

```
GET /places/place_xyz,place_def,place_ghi
```

```php
// PlaceController.php
public function showMultiple(Request $request)
{
    $ids = explode(',', $request->route('ids'));

    if (count($ids) > 50) {
        return $this->errorWrongArgs('Maksimal 50 ID per request');
    }

    $places = Place::whereIn('id', $ids)->get();
    return $this->respondWithCollection($places, new PlaceTransformer);
}
```

### Kelebihan dan Kekurangan

**Kelebihan:**
- Response ringan — tidak membawa data yang mungkin tidak dibutuhkan
- Client kontrol penuh apa yang di-fetch
- Caching lebih mudah per resource

**Kekurangan:**
- Minimal 2 request untuk tampilkan data lengkap
- Client harus handle komma-separated request
- Kurang ideal untuk mobile app dengan koneksi terbatas

---

## Pendekatan 3: Compound Documents (Sideloading)

Data terkait disertakan dalam response yang sama, tapi di key terpisah. Ini pendekatan JSON:API spec.

```json
GET /checkins/1

{
    "data": {
        "id": "chk_001",
        "user_id": "user_abc",
        "place_id": "place_xyz",
        "message": "Kopi enak!",
        "created_at": "2024-01-15T10:30:00Z"
    },
    "linked": {
        "users": [
            {
                "id": "user_abc",
                "name": "Ana Bell",
                "email": "ana@example.com"
            }
        ],
        "places": [
            {
                "id": "place_xyz",
                "name": "Warung Kopi Adem",
                "lat": -6.2088,
                "lon": 106.8456
            }
        ]
    }
}
```

### Implementasi dengan Fractal

```php
// CheckinTransformer.php
class CheckinTransformer extends TransformerAbstract
{
    protected array $defaultIncludes = ['user', 'place'];

    public function transform(Checkin $checkin): array
    {
        return [
            'id'         => $checkin->id,
            'message'    => $checkin->message,
            'user_id'    => $checkin->user_id,
            'place_id'   => $checkin->place_id,
            'created_at' => $checkin->created_at->toIso8601String(),
        ];
    }

    public function includeUser(Checkin $checkin)
    {
        return $this->item($checkin->user, new UserTransformer);
    }

    public function includePlace(Checkin $checkin)
    {
        return $this->item($checkin->place, new PlaceTransformer);
    }
}
```

```php
// CheckinController.php
public function show($id)
{
    // Eager load untuk hindari N+1
    $checkin = Checkin::with(['user', 'place'])->find($id);

    if (!$checkin) {
        return $this->errorNotFound();
    }

    return $this->respondWithItem($checkin, new CheckinTransformer);
}
```

### Kelebihan dan Kekurangan

**Kelebihan:**
- Satu request, semua data tersedia
- Tidak ada duplikasi — satu user muncul sekali meski ada di 10 checkin
- Ideal untuk list endpoint: `GET /checkins` sekaligus bawa semua user & place

**Kekurangan:**
- Response lebih besar
- Struktur lebih kompleks untuk diparse di client
- Tidak semua client library support JSON:API format

---

## Pendekatan 4: Embedded Documents (Nesting)

Data terkait langsung di-embed di dalam resource. Paling mudah dipakai, tapi ada trade-off.

```json
GET /checkins/1

{
    "data": {
        "id": "chk_001",
        "message": "Kopi enak!",
        "created_at": "2024-01-15T10:30:00Z",
        "user": {
            "id": "user_abc",
            "name": "Ana Bell"
        },
        "place": {
            "id": "place_xyz",
            "name": "Warung Kopi Adem",
            "lat": -6.2088,
            "lon": 106.8456
        }
    }
}
```

### Masalah Duplikasi

Kalau 10 checkin punya user yang sama:

```json
GET /checkins?user_id=user_abc

{
    "data": [
        {
            "id": "chk_001",
            "user": {"id": "user_abc", "name": "Ana Bell"},  // duplikat
            "place": {...}
        },
        {
            "id": "chk_002",
            "user": {"id": "user_abc", "name": "Ana Bell"},  // duplikat
            "place": {...}
        }
        // ... 8 lagi dengan user yang sama
    ]
}
```

Data user `Ana Bell` muncul 10 kali. Ini pemborosan bandwidth.

### Solusi: Embed Opsional via Query String

```
GET /checkins/1                  → tanpa embed, hanya ID
GET /checkins/1?embed=user,place → dengan embed
```

```php
public function show(Request $request, $id)
{
    $checkin = Checkin::find($id);

    $embeds = explode(',', $request->query('embed', ''));

    if (in_array('user', $embeds)) {
        $checkin->load('user');
    }

    if (in_array('place', $embeds)) {
        $checkin->load('place');
    }

    return $this->respondWithItem($checkin, new CheckinTransformer);
}
```

Phil Sturgeon jujur: *"Ini bukan RESTful sepenuhnya menurut Roy Fielding, tapi manfaat teknisnya jauh lebih besar dari kepatuhan terhadap spec."*

---

## Kapan Pakai Yang Mana?

| Pendekatan | Pakai saat |
|------------|------------|
| Sub-resources | Resource conceptually "milik" parent, perlu filter otomatis |
| Foreign key arrays | Client butuh kontrol penuh, data terkait besar/jarang dipakai |
| Sideloading | List endpoint, banyak item yang mungkin share resource yang sama |
| Embedding | Single-item endpoint, relasi selalu dibutuhkan, atau `?embed=` opsional |

### Rekomendasi Praktis

1. **Default**: sertakan ID saja (`user_id`, `place_id`)
2. **List endpoint** (GET /checkins): gunakan sideloading dengan Fractal
3. **Single item** (GET /checkins/1): embed opsional via `?embed=`
4. **Sub-resource**: hanya untuk relasi yang semantically kuat dan satu level saja

---

## Ringkasan Seri "Build APIs You Won't Hate"

Kita sudah merangkum seluruh isi buku Phil Sturgeon dalam 5 artikel:

| Artikel | Topik | Chapter |
|---------|-------|---------|
| 1 | Database Seeding dengan Faker | 1 |
| 2 | Merencanakan Endpoint RESTful | 2 |
| 3 | HTTP Status Codes & Error Handling | 3–4 |
| 4 | Testing & Output dengan Fractal | 5–6 |
| 5 | Data Relationships | 7 |

Dari database seeding sampai sideloading — fondasi yang cukup untuk membangun API yang tidak akan kamu sesali.

---

**Sumber:** Phil Sturgeon, *Build APIs You Won't Hate* (2013), Leanpub. [leanpub.com/build-apis-you-wont-hate](https://leanpub.com/build-apis-you-wont-hate)
