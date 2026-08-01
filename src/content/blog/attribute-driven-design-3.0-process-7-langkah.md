---
title: "Attribute-Driven Design (ADD) 3.0: Metode Desain Arsitektur 7 Langkah"
description: Panduan lengkap Attribute-Driven Design 3.0 dari buku Designing
  Software Architectures - review inputs, iteration goal, design concepts,
  instantiate elements, sketch views, analyze, roadmap greenfield dan
  brownfield, serta definisi interfaces arsitektur.
pubDate: 2026-10-26T08:00:00.000Z
image: /image/designing-software-architectures-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - ADD
  - DesignProcess
  - SEI
series: "Designing Software Architectures"
seriesOrder: 2
---

Chapter 3 dari *Designing Software Architectures* (Cervantes & Kazman) adalah inti buku: **Attribute-Driven Design (ADD) 3.0**: metode 7 langkah untuk **merancang arsitektur software** secara sistematis. ADD mengubah desain dari "seni" menjadi **proses yang dapat diulang**. Panduan ini cocok untuk arsitek dan developer yang ingin belajar desain arsitektur dengan pendekatan terstruktur dan terukur.

## Daftar Isi

- [Kebutuhan Metode yang Prinsipial](#kebutuhan-metode-yang-prinsipial)
- [Step 1: Review Inputs](#step-1-review-inputs)
- [Step 2: Establish Iteration Goal](#step-2-establish-iteration-goal)
- [Step 3: Pilih Elements untuk Refine](#step-3-pilih-elements-untuk-refine)
- [Step 4: Pilih Design Concepts](#step-4-pilih-design-concepts)
- [Step 5: Instantiate dan Alokasikan Responsibilities](#step-5-instantiate-dan-alokasikan-responsibilities)
- [Step 6: Sketch Views dan Record Decisions](#step-6-sketch-views-dan-record-decisions)
- [Step 7: Analisis dan Review](#step-7-analisis-dan-review)
- [Iterasi dalam ADD](#iterasi-dalam-add)
- [Design Roadmap: Greenfield Mature Domain](#design-roadmap-greenfield-mature-domain)
- [Design Roadmap: Greenfield Novel Domain](#design-roadmap-greenfield-novel-domain)
- [Design Roadmap: Brownfield](#design-roadmap-brownfield)
- [Mengidentifikasi dan Memilih Design Concepts](#mengidentifikasi-dan-memilih-design-concepts)
- [Memproduksi Structures](#memproduksi-structures)
- [Mendefinisikan Interfaces](#mendefinisikan-interfaces)
- [Dokumentasi Selama Desain](#dokumentasi-selama-desain)
- [Melacak Progress Desain](#melacak-progress-desain)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Kebutuhan Metode yang Prinsipial

Mengapa ADD? Karena desain arsitektur tanpa metode menghasilkan:

- Keputusan **ad-hoc** dan tidak konsisten
- Ketergantungan pada intuisi individu
- Sulit direview dan diulang
- Kualitas tidak dapat diprediksi

ADD 3.0 menyediakan langkah eksplisit, input/output jelas, dan iterasi terstruktur. Yang terpenting, **design purpose** menjadi kompasnya.

![ADD 3.0: Proses 7 Langkah](/image/add-3.0-process.svg)

## Step 1: Review Inputs

Tinjau semua input desain:

- **Design purpose**: mengapa sistem dibangun
- **Primary functionality**: use cases inti
- **Quality attribute scenarios**: QA terukur
- **Architectural concerns**: perhatian lintas-fungsi
- **Constraints**: batasan tak terelakkan

Step 1 dilakukan **sekali di awal**: bukan per iterasi. Hasilnya menjadi referensi untuk semua iterasi berikutnya.

## Step 2: Establish Iteration Goal

Tentukan **drivers untuk iterasi ini**: pilih dari input:

- **Quality attribute scenarios** yang paling penting
- **Use cases** yang signifikan arsitektural
- **Architectural concerns** yang harus ditangani
- **Constraints** yang membatasi iterasi

**Jangan semua sekaligus**: pilih sedikit drivers (1-3) per iterasi agar fokus. Driver yang tidak terpilih ditangani iterasi berikutnya.

## Step 3: Pilih Elements untuk Refine

Pilih **element sistem** yang akan di-refine pada iterasi ini:

- Iterasi 1: biasanya root element: seluruh sistem
- Iterasi berikutnya: elemen hasil iterasi sebelumnya
- Elemen dipilih berdasarkan: drivers yang dipilih, prioritas, kompleksitas

## Step 4: Pilih Design Concepts

Pilih **design concepts** yang memenuhi drivers terpilih:

1. **Identifikasi** concepts yang relevan (dari catalog, pengalaman, literatur)
2. **Evaluasi** kecocokan dengan drivers
3. **Seleksi** concept terbaik: pertimbangkan trade-offs

Contoh: driver *availability tinggi* → pilih tactics redundancy + heartbeat; driver *modifiability* → pilih pattern layered.

### Selection Heuristics

- **Reference architecture** dulu: jika domain mature
- **Architectural patterns** untuk struktur umum
- **Tactics** untuk QA spesifik
- **Externally developed components** untuk fungsionalitas siap pakai
- Pertimbangkan **constraints** saat memilih

## Step 5: Instantiate dan Alokasikan Responsibilities

Dengan concepts terpilih:

1. **Instantiate architectural elements**: buat elemen konkret dari concept
2. **Alokasikan responsibilities** ke tiap elemen
3. **Identifikasi properties**: atribut elemen
4. **Tetapkan relationships** antar elemen

Contoh: pattern *layered* → instantiate Presentation Layer, Business Layer, Data Layer: alokasikan responsibilities (handle UI, business rules, data access).

## Step 6: Sketch Views dan Record Decisions

### Sketch Views

Gambar struktur dalam **views**:

- **Module view**: kode diorganisir bagaimana
- **Component-and-connector view**: elemen runtime dan komunikasi
- **Allocation view**: elemen dipetakan ke hardware

### Record Design Decisions

Dokumentasikan **keputusan desain** (Architecture Decision Records):

- Konteks keputusan
- Alternatif yang dipertimbangkan
- Keputusan yang diambil
- Konsekuensi (positif/negatif)
- Alternatif yang ditolak dan alasannya

## Step 7: Analisis dan Review

Evaluasi hasil iterasi:

- **Apakah drivers terpenuhi?**: QA scenarios tercapai?
- **Apakah design purpose tercapai?**: sistem mendekati tujuan?
- **Apakah ada masalah baru?**: konsekuensi negatif
- **Tactics-based analysis**: cek apakah tactics diterapkan benar
- **Reflective questions**: pertanyaan kritis tentang desain

### Iterate Jika Perlu

Jika belum puas → **kembali ke Step 2** dengan drivers berbeda, atau refine elemen lain. Proses berlanjut sampai design purpose tercapai.

## Iterasi dalam ADD

ADD adalah **proses iteratif**:

```
Iterasi 1: struktur keseluruhan (root elements)
  ↓
Iterasi 2: refine elemen fungsional utama
  ↓
Iterasi 3: tangani QA scenario penting
  ↓
Iterasi N: refine sampai design purpose tercapai
```

Setiap iterasi: **drivers baru → elemen baru → concepts → instantiate → analisis**.

## Design Roadmap: Greenfield Mature Domain

Untuk sistem baru di **domain yang sudah matang** (misal: e-commerce, ERP):

1. **Iterasi 1**: pilih reference architecture yang sesuai (misal: web application)
2. **Iterasi berikutnya**: refine berdasarkan reference architecture
3. Gunakan **patterns dan tactics proven** dari domain

Keuntungan: reference architecture memberi **template yang sudah teruji**: desain cepat dan rendah risiko.

## Design Roadmap: Greenfield Novel Domain

Untuk sistem baru di **domain baru** (misal: AI, IoT baru):

1. **Iterasi 1**: mulai dari struktur fungsional dasar (tanpa reference architecture jelas)
2. **Iterasi berikutnya**: eksplorasi dan refine bertahap
3. **Prototyping** untuk memvalidasi konsep
4. Lebih banyak **risiko dan iterasi**: kumpulkan pengalaman

## Design Roadmap: Brownfield

Untuk **sistem yang sudah ada**:

1. **Step 1**: review existing architecture (dokumentasi, code, runtime)
2. **Identifikasi gaps**: di mana arsitektur tidak memenuhi kebutuhan baru
3. **Iterasi**: tambahkan drivers baru, refine elemen yang bermasalah
4. **Minimalkan dampak**: perubahan bertahap, backward compatible

## Mengidentifikasi dan Memilih Design Concepts

### Identifikasi

Sumber design concepts:

- **Design Concepts Catalog** (Appendix A buku ini)
- Pengalaman pribadi
- Pola literatur (POSA, GoF)
- Reference architectures industri
- Externally developed components yang tersedia

### Seleksi

Kriteria pemilihan:

- **Kecocokan drivers**: concept menyelesaikan masalah QA?
- **Kesesuaian constraints**: technology stack, budget
- **Trade-offs**: apa konsekuensi memilih concept
- **Maturity**: seberapa teruji concept
- **Kombinasi**: concepts bekerja bersama?

## Memproduksi Structures

### Instantiating Elements

- Elemen konkret dibuat dari design concepts
- Nama elemen jelas dan bermakna
- Identifikasi elemen yang sudah ada (reuse)

### Associating Responsibilities

Setiap elemen diberi **responsibilities**:

- Tanggung jawab fungsional
- Tanggung jawab kualitas (monitoring, fault handling)
- Dari use cases dan QA scenarios

### Establishing Relationships

Hubungan antar elemen:

- **Module dependency**: siapa bergantung pada siapa
- **Runtime connector**: komunikasi (calls, events, data flow)
- **Allocation**: pemetaan ke hardware

## Mendefinisikan Interfaces

### External Interfaces

- Interface yang **diekspos ke luar sistem**: API publik
- Kontrak stabil, versioned
- Consumed oleh pihak eksternal

### Internal Interfaces

- Interface antar elemen internal
- Bisa lebih fleksibel (berubah lebih mudah)
- Tetap harus terdokumentasi

### Elemen Interface

- **Sintaks**: signature operasi
- **Semantik**: makna dan behavior
- **Prasyarat/postkondisi**: kontrak pemakaian
- **Kualitas layanan**: performa, keamanan

## Dokumentasi Selama Desain

### Recording Sketches of Views

- **Sketch kasar** dulu: tidak perlu sempurna
- Tiga views dasar: module, C&C, allocation
- Diperhalus di iterasi berikutnya

### Recording Design Decisions

Gunakan format **ADR**:

```
# ADR-001: Memilih Arsitektur Layered

## Konteks
Sistem e-commerce butuh pemisahan concern...

## Keputusan
Mengadopsi layered architecture dengan 3 layer...

## Konsekuensi
Positif: pemisahan concern, testability
Negatif: overhead komunikasi antar layer
```

## Melacak Progress Desain

### Architectural Backlog

Daftar **pekerjaan desain yang tersisa**:

- Drivers yang belum ditangani
- Elemen yang belum di-refine
- Keputusan yang belum dibuat
- Prioritaskan backlog

### Design Kanban Board

Visualisasi **alur desain**:

- Kolom: Backlog → In Design → Designed → Reviewed
- Tracking progress per elemen/iterasi
- Transparan untuk tim

## Kesimpulan

ADD 3.0 menyediakan proses desain yang **sistematis dan iteratif**: review inputs, pilih drivers, refine elemen, pilih concepts, instantiate, sketch views, analisis. Roadmap berbeda untuk greenfield (mature/novel) dan brownfield. Interfaces, dokumentasi, dan tracking progress melengkapi proses.

Di artikel berikutnya: **[tiga case studies lengkap](/blog/case-studies-arsitektur-fcaps-bigdata-banking)**: FCAPS, Big Data, dan Banking (Chapter 4-6). Sebelumnya, pelajari **[architectural drivers dan design concepts](/blog/software-architecture-drivers-design-concepts)** sebagai fondasi ADD.

## FAQ

### Apa itu Attribute-Driven Design (ADD)?

Attribute-Driven Design (ADD) adalah metode desain arsitektur software yang dikembangkan oleh SEI (Software Engineering Institute). ADD menggunakan quality attributes (availability, performance, security) sebagai penggerak utama keputusan desain: bukan hanya fungsionalitas. ADD 3.0 adalah versi terkini dengan proses 7 langkah yang iteratif.

### Berapa iterasi yang dibutuhkan dalam ADD 3.0?

Jumlah iterasi tidak ditentukan: desain berlanjut sampai design purpose tercapai. Tiap iterasi memilih 1-3 drivers fokus: iterasi awal membangun struktur keseluruhan, iterasi berikutnya me-refine elemen fungsional utama, lalu menangani quality attribute scenarios penting. Roadmap bergantung tipe sistem: greenfield mature, greenfield novel, atau brownfield.

### Apa perbedaan desain greenfield dan brownfield dalam ADD?

Greenfield berarti membangun sistem baru dari nol: bisa memakai reference architecture (domain matang) atau eksplorasi bertahap (domain baru). Brownfield berarti memodifikasi sistem yang sudah ada: review arsitektur existing, identifikasi gaps terhadap kebutuhan baru, lalu perubahan incremental yang backward-compatible.

### Bagaimana mendokumentasikan keputusan desain arsitektur?

Gunakan Architecture Decision Records (ADR): catat konteks keputusan, alternatif yang dipertimbangkan, keputusan yang diambil, dan konsekuensinya. Selain itu, gambar views (module, component-connector, allocation) sebagai sketch yang diperhalus tiap iterasi, dan kelola progress dengan architectural backlog atau design kanban board.

## Referensi

- Cervantes, H., & Kazman, R. (2016). *Designing Software Architectures: A Practical Approach*. Addison-Wesley.
- Bass, L., Clements, P., & Kazman, R. (2012). *Software Architecture in Practice* (3rd ed.). Addison-Wesley.
- Cervantes, H., & Kazman, R. (2016). Attribute-Driven Design 3.0. *SEI Webinar Series*.
- Nygard, M. (2011). *Documenting Architecture Decisions*. cognitect.com.
