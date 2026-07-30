---
title: "Build API: Testing Endpoint dan Output Data dengan Fractal"
description: Cara menulis integration test untuk REST API dengan PHPUnit dan
  memformat output JSON secara konsisten menggunakan library Fractal — transformer,
  serializer, dan eager loading. Dari "Build APIs You Won't Hate" Phil Sturgeon.
pubDate: 2026-08-08T08:00:00.000Z
image: /image/api-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - PHP
  - Testing
  - Fractal
---

API tanpa test adalah API yang menunggu waktu untuk meledak di production. Dan API yang menghasilkan output tidak konsisten adalah API yang membuat developer client frustrasi. Chapter 5 dan 6 dari *Build APIs You Won't Hate* membahas keduanya: cara menulis test untuk endpoint dan cara memformat output secara rapi dengan library **Fractal**.

## Daftar Isi

- [Mengapa Test API Itu Berbeda](#mengapa-test-api-itu-berbeda)
- [Setup PHPUnit untuk Laravel API](#setup-phpunit-untuk-laravel-api)
- [Menulis Integration Test](#menulis-integration-test)
- [Mengenal Fractal](#mengenal-fractal)
- [Membuat Transformer](#membuat-transformer)
- [Serializer dan Envelope](#serializer-dan-envelope)
- [Eager Loading Relasi](#eager-loading-relasi)

---

## Mengapa Test API Itu Berbeda

Test API berbeda dari unit test biasa. Kita tidak hanya tes logika di dalam class — kita tes **kontrak**:

- Apakah endpoint ini mengembalikan status code yang benar?
- Apakah field yang diharapkan ada di response?
- Apakah perubahan schema database tidak merusak response format?
- Apakah autentikasi diterapkan dengan benar?

Jenis test yang paling berguna untuk API adalah **integration test** (atau functional test) — test yang benar-benar membuat HTTP request ke aplikasi.

---

## Setup PHPUnit untuk Laravel API

```bash
# Install jika belum ada
composer require --dev phpunit/phpunit

# Buat file phpunit.xml
cp phpunit.xml.dist phpunit.xml
```

Konfigurasi `phpunit.xml` untuk pakai database test:

```xml
<phpunit>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="CACHE_DRIVER" value="array"/>
    </php>
</phpunit>
```

---

## Menulis Integration Test

### Test Helper: ApiTestCase

Buat base test class dengan helper yang reusable:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class ApiTestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected array $defaultHeaders = [
        'Accept'       => 'application/json',
        'Content-Type' => 'application/json',
    ];

    // Helper: buat user + token untuk auth test
    protected function actingAsUser(): static
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');
        return $this;
    }

    // Helper: assert struktur JSON response
    protected function assertJsonStructureEqual(array $expected, array $actual): void
    {
        $this->assertEquals(
            array_keys($expected),
            array_keys($actual),
            'JSON structure mismatch'
        );
    }
}
```

### Test untuk Place Endpoint

```php
<?php

namespace Tests\Feature\Api;

use App\Models\Place;
use App\Models\User;
use Tests\ApiTestCase;

class PlaceTest extends ApiTestCase
{
    public function test_dapat_list_semua_places()
    {
        Place::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/places');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'lat', 'lon']
                ]
            ])
            ->assertJsonCount(5, 'data');
    }

    public function test_dapat_ambil_satu_place()
    {
        $place = Place::factory()->create(['name' => 'Warung Kopi Adem']);

        $response = $this->getJson("/api/v1/places/{$place->id}");

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.name', 'Warung Kopi Adem');
    }

    public function test_return_404_jika_place_tidak_ada()
    {
        $response = $this->getJson('/api/v1/places/id-yang-tidak-ada');

        $response->assertStatus(404)
            ->assertJsonStructure(['errors']);
    }

    public function test_buat_place_butuh_autentikasi()
    {
        $response = $this->postJson('/api/v1/places', [
            'name' => 'Tempat Baru'
        ]);

        $response->assertStatus(401);
    }

    public function test_user_dapat_buat_place()
    {
        $this->actingAsUser();

        $response = $this->postJson('/api/v1/places', [
            'name' => 'Warung Nasi Padang',
            'lat'  => -6.2088,
            'lon'  => 106.8456,
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'Warung Nasi Padang');

        $this->assertDatabaseHas('places', [
            'name' => 'Warung Nasi Padang'
        ]);
    }

    public function test_validasi_field_wajib()
    {
        $this->actingAsUser();

        $response = $this->postJson('/api/v1/places', []); // tanpa data

        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['name', 'lat', 'lon']]);
    }
}
```

Jalankan:

```bash
php artisan test --filter PlaceTest
# atau
./vendor/bin/phpunit tests/Feature/Api/PlaceTest.php
```

---

## Mengenal Fractal

**Fractal** adalah library PHP oleh The PHP League untuk memformat output API secara konsisten. Masalah yang ia selesaikan:

```php
// Tanpa Fractal — output langsung dari Eloquent, berantakan
return response()->json($user->toArray());
// Output mengandung: password_hash, remember_token, deleted_at, pivot, dll.

// Dengan Fractal — output bersih dan terkontrol
return $this->respondWithItem($user, new UserTransformer);
```

```bash
composer require league/fractal
```

---

## Membuat Transformer

Transformer adalah kelas yang mengontrol field apa yang keluar di response:

```php
<?php

namespace App\Transformers;

use App\Models\User;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{
    // Field relasi yang bisa di-include secara opsional
    protected array $availableIncludes = ['places', 'checkins'];

    // Field relasi yang selalu di-include
    protected array $defaultIncludes = [];

    public function transform(User $user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'active'     => (bool) $user->active,
            'bio'        => $user->bio,
            'created_at' => $user->created_at->toIso8601String(),
            // password, remember_token, dll. tidak ada di sini
        ];
    }

    public function includePlaces(User $user)
    {
        return $this->collection($user->places, new PlaceTransformer);
    }

    public function includeCheckins(User $user)
    {
        return $this->collection($user->checkins, new CheckinTransformer);
    }
}
```

```php
<?php

namespace App\Transformers;

use App\Models\Place;
use League\Fractal\TransformerAbstract;

class PlaceTransformer extends TransformerAbstract
{
    public function transform(Place $place): array
    {
        return [
            'id'      => $place->id,
            'name'    => $place->name,
            'lat'     => (float) $place->lat,
            'lon'     => (float) $place->lon,
            'address' => $place->address,
        ];
    }
}
```

---

## Serializer dan Envelope

Fractal mendukung beberapa format output. Yang paling umum:

### Array Serializer (default — tanpa envelope)

```json
{
    "id": "abc123",
    "name": "Ana Bell"
}
```

### Data Array Serializer (dengan `data` wrapper)

```json
{
    "data": {
        "id": "abc123",
        "name": "Ana Bell"
    }
}
```

### JSON API Serializer (sesuai spec jsonapi.org)

```json
{
    "data": {
        "type": "users",
        "id": "abc123",
        "attributes": {
            "name": "Ana Bell"
        }
    }
}
```

Konfigurasi serializer di base controller:

```php
use League\Fractal\Manager;
use League\Fractal\Serializer\DataArraySerializer;

protected function fractal(): Manager
{
    $manager = new Manager();
    $manager->setSerializer(new DataArraySerializer());

    // Parse includes dari query string: ?include=places,checkins
    if ($include = request()->query('include')) {
        $manager->parseIncludes($include);
    }

    return $manager;
}

protected function respondWithItem($item, $transformer)
{
    $resource = new \League\Fractal\Resource\Item($item, $transformer);
    return $this->respond($this->fractal()->createData($resource)->toArray());
}

protected function respondWithCollection($collection, $transformer)
{
    $resource = new \League\Fractal\Resource\Collection($collection, $transformer);
    return $this->respond($this->fractal()->createData($resource)->toArray());
}
```

---

## Eager Loading Relasi

Gunakan `?include=` di query string untuk minta relasi:

```
GET /users/1?include=places,checkins
```

```php
// Response
{
    "data": {
        "id": "abc123",
        "name": "Ana Bell",
        "places": {
            "data": [
                {"id": "xyz", "name": "Warung Kopi Adem", ...}
            ]
        },
        "checkins": {
            "data": [...]
        }
    }
}
```

Pastikan Eloquent eager load relasi yang diminta agar tidak N+1:

```php
public function show($id)
{
    $includes = explode(',', request()->query('include', ''));
    $with = array_intersect($includes, ['places', 'checkins']);

    $user = User::with($with)->find($id);

    if (!$user) {
        return $this->errorNotFound();
    }

    return $this->respondWithItem($user, new UserTransformer);
}
```

---

## Ringkasan

| Konsep | Tool/Approach |
|--------|--------------|
| Integration test | PHPUnit + `RefreshDatabase` |
| Assert status code | `assertStatus(200)` |
| Assert struktur JSON | `assertJsonStructure([...])` |
| Output formatting | Fractal `TransformerAbstract` |
| Kontrol field output | `transform()` method |
| Include relasi opsional | `$availableIncludes` + `?include=` |
| Format envelope | `DataArraySerializer` |

---

Artikel berikutnya: **Data Relationships — Sub-Resources, Sideloading, dan Embedding** — strategi untuk menangani relasi antar resource dalam API.

---

**Sumber:** Phil Sturgeon, *Build APIs You Won't Hate* (2013), Leanpub.
