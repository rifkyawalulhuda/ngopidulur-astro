---
title: "Build API: Database Seeding dengan Faker di PHP Laravel"
description: Pelajari cara mengisi database development dengan data dummy
  berkualitas menggunakan library Faker — teknik database seeding yang wajib
  dikuasai sebelum membangun API, dari Phil Sturgeon "Build APIs You Won't Hate".
pubDate: 2026-08-05T08:00:00.000Z
image: /image/api-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - PHP
  - Laravel
  - DatabaseSeeding
---

Sebelum membangun satu endpoint pun, kamu butuh data. Bukan data produksi — data sampah yang bisa kamu buang kapan saja tanpa rasa bersalah. Inilah yang disebut **database seeding**, dan ini adalah langkah pertama yang dibahas Phil Sturgeon dalam bukunya *Build APIs You Won't Hate*.

## Daftar Isi

- [Kenapa Perlu Data Dummy?](#kenapa-perlu-data-dummy)
- [Kenalkan: Faker](#kenalkan-faker)
- [Membangun Seeder](#membangun-seeder)
- [Secondary Data: Relasi Antar Tabel](#secondary-data-relasi-antar-tabel)
- [Kapan Jalankan Seeder?](#kapan-jalankan-seeder)

---

## Kenapa Perlu Data Dummy?

Kamu punya schema database yang baru selesai dirancang. Sekarang apa? Jangan langsung masukkan data nyata. Data dummy jauh lebih aman untuk fase development karena:

- Bisa dihapus dan dibuat ulang kapan saja tanpa risiko
- Memungkinkan kamu tes apakah schema cocok untuk kebutuhan API
- Bisa dibagikan ke anggota tim baru, freelancer, atau developer mobile dengan satu perintah

> "Use absolute nonsense for your development database, but nonsense of the correct data type, size, and format." — Phil Sturgeon

---

## Kenalkan: Faker

**Faker** adalah library PHP karya François Zaninotto yang bisa menghasilkan data palsu tapi realistis: nama, email, nomor telepon, tanggal lahir, alamat, kalimat, paragraf — semuanya otomatis.

```bash
composer require fakerphp/faker
```

Contoh penggunaan dasar:

```php
$faker = Faker\Factory::create();

echo $faker->name;        // "Ana Bell"
echo $faker->email;       // "john.doe@example.com"
echo $faker->city;        // "Jakarta"
echo $faker->sentence(5); // "The quick brown fox jumps."
echo $faker->boolean;     // true atau false
```

---

## Membangun Seeder

### User Seeder

Di Laravel, seeder ditulis dalam class yang mewarisi `Seeder`. Ini contoh seeder untuk tabel users:

```php
<?php

class UserTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker\Factory::create();

        for ($i = 0; $i < Config::get('seeding.users'); $i++) {
            User::create([
                'name'     => $faker->name,
                'email'    => $faker->email,
                'active'   => $i === 0 ? true : rand(0, 1), // user pertama selalu aktif
                'gender'   => $faker->randomElement(['male', 'female']),
                'birthday' => rand(0, 1)
                    ? $faker->dateTimeBetween('-40 years', '-18 years')
                    : null,
                'location' => rand(0, 1)
                    ? "{$faker->city}, {$faker->state}"
                    : null,
                'bio'      => $faker->sentence(100),
            ]);
        }
    }
}
```

### Master Seeder

Buat satu seeder utama yang mengatur urutan eksekusi dan truncate semua tabel:

```php
<?php

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Proteksi production — satu baris ini bisa menyelamatkan karir kamu
        if (App::environment() === 'production') {
            exit('I just stopped you getting fired. Love Phil');
        }

        Eloquent::unguard();

        // Truncate dulu, baru isi — jangan truncate di dalam masing-masing seeder
        $tables = [
            'locations', 'merchants', 'opps', 'moments',
            'users', 'oauth_sessions', 'notifications',
            'favorites', 'settings', 'friendships',
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        // Jalankan seeder per resource
        $this->call('MerchantTableSeeder');
        $this->call('PlaceTableSeeder');
        $this->call('UserTableSeeder');
        $this->call('OppTableSeeder');
    }
}
```

> **Penting:** Truncate semua tabel di awal secara global, bukan di dalam masing-masing seeder. Kalau kamu truncate di dalam seeder, kamu bisa menghapus data yang baru saja diisi seeder sebelumnya.

Jalankan dengan:

```bash
php artisan db:seed
```

---

## Secondary Data: Relasi Antar Tabel

Seeder jadi lebih kompleks saat ada relasi. Strategi yang tepat: buat data primer dulu (merchant), lalu loop untuk buat data sekunder (opportunities per merchant):

```php
<?php

class OppTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker\Factory::create();

        foreach (Merchant::all() as $merchant) {

            // Buat antara 2-4 peluang per merchant
            foreach (range(1, rand(2, 4)) as $i) {

                $image = Image::create([
                    'name' => "{$merchant->name} Image #{$i}",
                    'url'  => $faker->randomElement($this->imageArray),
                ]);

                // Pastikan setidaknya satu yang akan segera berakhir
                if ($i === 1) {
                    $ends   = Carbon::now()->addDays(2);
                    $teaser = 'Something about cheese';
                } else {
                    $ends   = Carbon::now()->addDays(60);
                    $teaser = $faker->sentence(rand(3, 5));
                }

                $opp = Opp::create([
                    'name'        => $faker->sentence(rand(3, 5)),
                    'teaser'      => $teaser,
                    'details'     => $faker->paragraph(3),
                    'starts'      => Carbon::now()->format('Y-m-d H:i:s'),
                    'ends'        => $ends->format('Y-m-d H:i:s'),
                    'merchant_id' => $merchant->id,
                    'published'   => true,
                ]);

                $opp->images()->attach($image, ['published' => true]);
            }

            echo "Created opportunities for {$merchant->name}\n";
        }
    }
}
```

---

## Kapan Jalankan Seeder?

| Situasi | Aksi |
|---------|------|
| Endpoint baru dengan data baru | Beritahu tim untuk pull, migrate, dan seed ulang |
| Developer/freelancer baru join | Jalankan seed sekali di mesin mereka |
| Developer mobile butuh data | Seed di staging/local |
| CI server (Jenkins, GitHub Actions) | Seed otomatis saat deploy build baru |

---

## Ringkasan

Database seeding adalah fondasi workflow API development yang solid. Dengan Faker, kamu bisa mengisi ribuan baris data realistis dalam hitungan detik. Kunci utamanya:

- Pakai data "sampah" yang benar tipe dan formatnya
- Truncate global di awal, bukan per seeder
- Lindungi production dengan cek environment
- Bangun seeder yang relasional dengan loop nested

---

Artikel berikutnya: **Merencanakan dan Membuat Endpoint API** — cara mengubah daftar kebutuhan bisnis menjadi endpoint RESTful yang terstruktur.

---

**Sumber:** Phil Sturgeon, *Build APIs You Won't Hate* (2013), Leanpub. [github.com/philsturgeon/build-apis-you-wont-hate](https://github.com/philsturgeon/build-apis-you-wont-hate)
