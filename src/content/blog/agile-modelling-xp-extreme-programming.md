---
title: "Agile Modeling dan XP: Pemodelan dalam Extreme Programming"
description: Cara menerapkan Agile Modeling dalam Extreme Programming - planning
  game, modeling spike, CRC cards, domain modeling, UI prototyping, database
  modeling, dan integrasi AM dengan siklus iterasi XP secara komprehensif.
pubDate: 2026-08-27T08:00:00.000Z
image: /image/agile-modelling-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - AgileModeling
  - XP
  - ExtremeProgramming
  - SoftwareDevelopment
---

Extreme Programming (XP) adalah salah satu metodologi agile paling berpengaruh — dan Agile Modeling dirancang secara eksplisit untuk melengkapinya. Part 3 dari *Agile Modeling* oleh Scott Ambler membahas secara detail bagaimana modeling yang efektif terintegrasi dengan setiap praktik XP, dari planning game hingga continuous integration.

## Daftar Isi

- [Extreme Programming: Overview Singkat](#extreme-programming-overview-singkat)
- [Peran AM dalam XP Lifecycle](#peran-am-dalam-xp-lifecycle)
- [Planning Game dengan AM](#planning-game-dengan-am)
- [Modeling Spike](#modeling-spike)
- [CRC Cards: Class Responsibility Collaborator](#crc-cards)
- [Domain Modeling dalam XP](#domain-modeling-dalam-xp)
- [UI Prototyping Agile](#ui-prototyping-agile)
- [Database Modeling dalam XP](#database-modeling-dalam-xp)
- [Architecture Modeling dalam XP](#architecture-modeling-dalam-xp)
- [Integrasi dengan XP Practices Lainnya](#integrasi-dengan-xp-practices)



## Extreme Programming: Overview Singkat

XP, dikembangkan oleh Kent Beck, berfokus pada nilai-nilai:
- **Communication** — tim berkomunikasi intensif
- **Simplicity** — solusi paling sederhana yang bisa bekerja
- **Feedback** — dari kode, tes, dan pelanggan secara cepat
- **Courage** — berani refactor, berani ubah desain

Praktik inti XP meliputi: pair programming, test-driven development (TDD), continuous integration, collective code ownership, dan on-site customer.

Ambler menunjukkan bahwa nilai-nilai XP dan AM sangat aligned — keduanya menghargai komunikasi, simplicity, dan feedback cepat. AM memperkuat XP dengan memberikan panduan praktis tentang *cara* melakukan modeling dalam konteks cepat yang dituntut XP.



## Peran AM dalam XP Lifecycle

XP mengorganisasi pekerjaan dalam iteration (biasanya 1-3 minggu). AM berkontribusi di setiap fase:

| Fase XP | Aktivitas AM |
|---|---|
| Release Planning | User story modeling, scope estimation |
| Iteration Planning | Iteration model storming |
| Daily Development | Pair modeling, CRC sessions |
| Testing | Testability review dari model |
| Retrospective | Evaluasi apakah model membantu atau hambat |

Prinsip kunci: **tidak ada "modeling phase" terpisah di XP**. Modeling terjadi just-in-time, sebatas yang diperlukan untuk iteration berikutnya.



## Planning Game dengan AM

Planning Game di XP melibatkan customer dan developer dalam menentukan scope iteration. AM berkontribusi dengan:

### User Story Modeling

User story adalah unit planning di XP: *"As a [user], I want [feature] so that [benefit]."*

AM menambahkan dimensi visual:
- **Story card stack** — deck fisik yang bisa disort dan diprioritaskan
- **Story map** — user journey visual untuk melihat big picture
- **Dependency diagram** — story mana yang harus dikerjakan sebelum yang lain

```
Story Map contoh (e-commerce):
[Browse Products] → [Add to Cart] → [Checkout] → [Payment] → [Confirmation]
     ↓                                  ↓
[Filter/Search]              [Address Management]
```

### Modeling saat Estimation

Saat developer perlu mengestimasi story yang kompleks, model storming singkat sangat membantu:
- Gambar sequence diagram kasar untuk memahami alur
- Buat class diagram minimal untuk melihat impact ke domain
- Sketch UI untuk memahami scope UX

Estimasi yang lebih akurat = planning yang lebih realistis = iteration yang lebih sukses.



## Modeling Spike

Spike di XP adalah time-boxed research untuk menjawab pertanyaan teknis yang tidak bisa diestimasi tanpa investigasi.

### Kapan Perlu Modeling Spike?

- Teknologi baru yang belum pernah digunakan tim
- Integrasi dengan sistem eksternal yang tidak familiar
- Algoritma kompleks yang perlu divalidasi
- Arsitektur yang diperdebatkan — buktikan sebelum commit

### Karakteristik Spike yang Baik

- **Time-boxed:** 1-3 hari, tidak lebih
- **Spesifik:** menjawab pertanyaan yang jelas, bukan eksplorasi umum
- **Throw-away code:** kode spike bukan production code
- **Documented output:** hasil spike didokumentasikan minimal (model + kesimpulan)

### Spike sebagai Prototyping

Spike sering menghasilkan prototype yang membuktikan (atau menyangkal) asumsi arsitektural:
- Prototype performa: apakah database query cukup cepat?
- Prototype integrasi: apakah API eksternal bekerja seperti yang didokumentasikan?
- Prototype UX: apakah interaksi yang dirancang natural bagi pengguna?



## CRC Cards: Class Responsibility Collaborator {#crc-cards}

CRC cards adalah teknik object-oriented modeling yang dikembangkan oleh Ward Cunningham dan Kent Beck — dan sangat sesuai dengan pendekatan AM.

### Format CRC Card

```
+----------------------------------------+
| Class Name: ShoppingCart               |
+----------------------------------------+
| Responsibilities:                      |
| - Add item to cart                     |
| - Remove item from cart                |
| - Calculate total price                |
| - Apply coupon code                    |
| - Check item availability              |
+----------------------------------------+
| Collaborators:                         |
| - CartItem                             |
| - Product (Inventory)                  |
| - PricingEngine                        |
| - CouponService                        |
+----------------------------------------+
```

### CRC Session

CRC sessions adalah aktivitas tim yang powerful:

1. **Setup:** Setiap orang pegang beberapa kartu (bisa index card fisik)
2. **Role-playing:** Fasilitator describe skenario, orang yang pegang kartu "berbicara" sebagai class mereka
3. **Discover responsibilities:** Skenario mengungkap tanggung jawab yang belum terpikirkan
4. **Discover collaborations:** Terlihat siapa memanggil siapa, dan apakah itu masuk akal

**Keunggulan CRC vs UML Class Diagram:**

| | CRC Cards | UML Class Diagram |
|--|---|---|
| Kecepatan pembuatan | Sangat cepat (menit) | Lebih lambat (jam) |
| Keterlibatan non-developer | Mudah dipahami | Membutuhkan pelatihan UML |
| Detail | Tingkat tinggi | Bisa sangat detail |
| Role-playing | Mendukung | Tidak mendukung |
| Tool | Index card fisik | Software diagram |

CRC paling efektif di awal desain untuk eksplorasi. Class diagram lebih berguna ketika detail relasi dan atribut diperlukan.



## Domain Modeling dalam XP

Domain model adalah representasi dari konsep-konsep utama dalam domain bisnis dan relasi antar mereka.

### Lightweight Domain Model

AM menganjurkan domain model yang ringan — hanya class dan relasi yang penting saat ini, bukan model lengkap seluruh sistem.

Contoh domain model untuk sistem e-commerce (versi minimal):

```
Customer ──(places)──> Order ──(contains)──> OrderItem ──(references)──> Product
                         │
                    (billed via)
                         │
                      Invoice
```

### Evolving the Domain Model

Domain model di XP **tidak** dibuat sekali di awal. Ia evolve seiring iteration:
- Iteration 1: model yang cukup untuk user story iteration ini
- Iteration 2: extend model saat story baru memerlukan class/relasi baru
- Refactoring: simplify ketika kompleksitas tidak lagi diperlukan

### Domain Model sebagai Bahasa Bersama

Satu peran terpenting domain model adalah menciptakan **ubiquitous language** (istilah dari Domain-Driven Design) — kosakata bersama antara developer dan domain expert.

Ketika developer dan business analyst berbicara tentang "Order" vs "Transaction" vs "Purchase" — model membantu menyepakati satu istilah yang digunakan konsisten di kode, database, dan komunikasi.



## UI Prototyping Agile

### Paper Prototyping

Sebelum coding UI apapun, gambar sketsa UI di kertas. Keunggulan paper prototype:
- Sangat cepat — 5-10 menit per screen
- Mudah diubah — coret dan gambar ulang
- Tidak menimbulkan false impression "ini sudah jadi"
- Customer lebih nyaman memberikan feedback pada sketsa kasar

### Essential UI (Interface Flow Diagram)

AM menggunakan konsep "essential UI" — model yang menangkap *apa* yang pengguna lakukan dan *informasi* apa yang mereka butuhkan/berikan, tanpa detail visual.

```
[Login Screen]
  user enters: username, password
  system shows: error message (jika gagal)
       ↓ (sukses)
[Dashboard]
  system shows: summary stats, recent orders
  user can: navigate ke Orders, Products, Reports
       ↓ (klik Orders)
[Order List]
  system shows: list orders dengan filter
  user can: filter, sort, klik untuk detail
```

### Lo-Fi vs Hi-Fi Prototype

| | Lo-Fi | Hi-Fi |
|--|---|---|
| Kapan dibuat | Awal eksplorasi | Sebelum final implementation |
| Media | Kertas, whiteboard | Figma, HTML/CSS |
| Detail | Struktur dan flow | Visual yang mendekati final |
| Feedback yang didapat | Struktur, flow, content | Detail visual, interaksi |

AM merekomendasikan lo-fi dulu — hi-fi hanya saat benar-benar diperlukan untuk mengurangi ambiguitas.



## Database Modeling dalam XP

### Evolutionary Database Design

XP dan AM menolak Big Design Up Front (BDUF) untuk database. Pendekatan evolutioner:
- Mulai dengan schema minimal yang mendukung iteration pertama
- Refactor schema seiring kebutuhan berkembang
- Gunakan migration untuk perubahan schema yang terkontrol

### Refactoring Database

Sama seperti kode yang bisa di-refactor, database schema pun bisa:
- Rename column
- Split atau merge table
- Normalisasi atau denormalisasi sesuai kebutuhan performa
- Tambah index setelah profiling menemukan bottleneck

Tools modern seperti Flyway dan Liquibase membantu mengelola evolusi schema ini dengan aman.

### ORM dan Mapping Sederhana

AM menyarankan mapping ORM yang sederhana dan eksplisit — jangan biarkan framework ORM membuat keputusan schema yang penting secara implisit.



## Architecture Modeling dalam XP

### Just Enough Architecture

XP bukan anti-arsitektur — ia anti **Big Upfront Design**. "Just Enough Architecture" berarti:
- Tentukan architectural decision yang akan mahal untuk diubah nanti (early)
- Tunda keputusan yang bisa dibuat nanti (late binding)
- Validasi arsitektur dengan kode (spike) sebelum commit

### Architecture Spike

Sebelum commit ke arsitektur tertentu, buat spike untuk memvalidasi:
- Apakah microservices vs monolith sesuai dengan ukuran tim?
- Apakah event-driven architecture menambah kompleksitas yang tidak perlu?
- Apakah chosen technology stack support semua kebutuhan?



## Integrasi dengan XP Practices Lainnya {#integrasi-dengan-xp-practices}

### Test-Driven Development + Modeling

TDD dan AM saling melengkapi:
- Model membantu *sebelum* menulis test — memahami domain dan interface yang akan ditest
- TDD memvalidasi model — jika sulit ditulis testnya, mungkin model perlu direvisi
- Failing tests = feedback bahwa model mungkin salah

### Pair Programming + Modeling

Pair programming alami mengarah ke pair modeling:
- Saat pair berdiskusi tentang solusi, gambar di whiteboard
- Dua perspektif → model yang lebih robust
- Model yang dibuat bersama = lebih dipahami keduanya

### Continuous Integration + Model Evolution

CI memastikan perubahan code terus diintegrasikan. AM memastikan model juga berevolusi konsisten dengan code:
- Setelah refactoring signifikan, update diagram yang relevan
- Model yang tidak lagi mencerminkan kode adalah misleading



## Tabel: Kapan Model di XP dan Kapan Tidak

| Situasi | Model? | Jenis Model |
|---|---|---|
| Story baru yang sederhana dan familiar | Tidak perlu | N/A |
| Story dengan domain complexity tinggi | Ya | Domain model, CRC |
| Story dengan UI complexity tinggi | Ya | UI sketch, flow |
| Integrasi sistem baru | Ya | Sequence diagram, component |
| Database schema change signifikan | Ya | ER diagram minimal |
| Refactoring dalam scope yang sudah dipahami | Tidak perlu | N/A |
| Architecture decision yang mahal | Ya | Architecture overview |
| Bug fix | Biasanya tidak | N/A |

**Sumber:** Scott Ambler, *Agile Modeling: Effective Practices for eXtreme Programming and the Unified Process* (2002), John Wiley & Sons.
