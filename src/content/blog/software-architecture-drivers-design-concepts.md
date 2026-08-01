---
title: "Desain Arsitektur Software: Panduan Architectural Drivers dan Design Patterns"
description: Pelajari desain arsitektur software dari buku Cervantes dan Kazman
  (SEI) - pentingnya arsitektur, peran arsitek, architectural drivers, quality
  attributes, design patterns, tactics, dan reference architectures untuk
  arsitektur aplikasi yang scalable dan maintainable.
pubDate: 2026-10-25T08:00:00.000Z
image: /image/designing-software-architectures-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - ADD
  - SEI
series: "Designing Software Architectures"
seriesOrder: 1
---

*Designing Software Architectures: A Practical Approach* karya **Humberto Cervantes dan Rick Kazman** (SEI Series, Addison-Wesley) adalah buku praktis tentang **desain arsitektur software**: dengan fokus pada **Attribute-Driven Design (ADD) 3.0**, metode yang sudah teruji di industri. Buku ini menjawab pertanyaan: *bagaimana caranya merancang arsitektur yang baik secara sistematis?* Jika Anda sedang mencari panduan lengkap soal architecture drivers, quality attributes, dan design patterns untuk membangun sistem yang scalable: artikel ini merangkum inti buku tersebut dalam bahasa Indonesia.

## Daftar Isi

- [Motivasi: Mengapa Buku Ini Ditulis?](#motivasi-mengapa-buku-ini-ditulis)
- [Software Architecture](#software-architecture)
- [Pentingnya Arsitektur Software](#pentingnya-arsitektur-software)
- [Life-Cycle Activities](#life-cycle-activities)
- [Peran Arsitek](#peran-arsitek)
- [Sejarah Singkat ADD](#sejarah-singkat-add)
- [Desain secara Umum](#desain-secara-umum)
- [Tiga Tingkat Desain](#tiga-tingkat-desain)
- [Architectural Drivers](#architectural-drivers)
- [Design Purpose](#design-purpose)
- [Quality Attributes](#quality-attributes)
- [Primary Functionality](#primary-functionality)
- [Architectural Concerns](#architectural-concerns)
- [Constraints](#constraints)
- [Design Concepts](#design-concepts)
- [Reference Architectures](#reference-architectures)
- [Architectural Design Patterns](#architectural-design-patterns)
- [Tactics](#tactics)
- [Deployment Patterns](#deployment-patterns)
- [Architecture Design Decisions](#architecture-design-decisions)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Motivasi: Mengapa Buku Ini Ditulis?

Banyak buku arsitektur menjelaskan *apa* itu arsitektur: tapi sedikit yang menjelaskan *bagaimana cara merancangnya*. Buku ini hadir untuk mengisi celah itu: **proses desain yang prinsipial dan dapat diulang** (principled method), bukan intuisi semata.

## Software Architecture

**Software architecture** adalah struktur sistem: kumpulan komponen yang bekerja sama untuk mencapai fungsi tertentu. Arsitektur berfokus pada **pengorganisasian komponen** ke dalam "areas of concern".

Definisi praktis: arsitektur terdiri dari **structures** (module, component-connector, allocation) yang memungkinkan sistem mencapai kualitas dan kebutuhan bisnisnya.

## Pentingnya Arsitektur Software

Arsitektur penting karena:

1. **Basis komunikasi**: arsitektur menjadi bahasa bersama stakeholder
2. **Keputusan awal yang mahal**: sulit diubah setelah dibangun
3. **Transferable abstraction**: bisa dipakai di sistem serupa
4. **Menentukan kualitas**: performa, keamanan, modifiability ditentukan arsitektur
5. **Mengelola kompleksitas**: sistem besar butuh struktur
6. **Mendukung evolusi**: perubahan bisnis butuh fondasi yang fleksibel

## Life-Cycle Activities

Arsitektur terlibat di seluruh siklus hidup:

- **Analysis**: memahami kebutuhan
- **Design**: merancang struktur (fokus buku ini)
- **Documentation**: merekam keputusan dan struktur
- **Evaluation**: menilai apakah arsitektur memenuhi kebutuhan
- **Implementation**: membangun sesuai arsitektur
- **Maintenance/evolution**: mengubah arsitektur seiring kebutuhan

## Peran Arsitek

Arsitek punya tanggung jawab:

- **Membuat keputusan teknis** tingkat tinggi
- **Menyeimbangkan kebutuhan stakeholder** yang konflik
- **Berkomunikasi** dengan semua pihak (bisnis, dev, ops)
- **Memimpin tim** dalam implementasi arsitektur
- **Memahami teknologi dan domain**
- **Mengelola risiko teknis** sejak awal

## Sejarah Singkat ADD

**Attribute-Driven Design (ADD)** lahir di **SEI (Software Engineering Institute, CMU)**:

- **ADD 1.0**: awal 2000-an, fokus quality attributes
- **ADD 2.0**: penyempurnaan, penambahan design concepts
- **ADD 3.0**: versi terkini (buku ini): 7 langkah, berfokus pada **design purpose** dan iterasi

Evolusi ADD: dari metode kaku menjadi **proses iteratif adaptif** yang bisa disesuaikan tipe sistem (greenfield, brownfield, mature/novel domain).

## Desain secara Umum

Desain adalah **proses pengambilan keputusan** dengan trade-offs. Dalam software, desain melibatkan:

- Memahami problem
- Menentukan alternatif solusi
- Mengevaluasi trade-offs
- Memilih solusi terbaik untuk konteks

## Tiga Tingkat Desain

### 1. Architectural Design

- Struktur keseluruhan sistem
- Komponen besar dan hubungannya
- Fokus buku ini

### 2. Element Interaction Design

- Bagaimana elemen berinteraksi
- Protocol, data exchange, timing

### 3. Element Internals Design

- Detail internal setiap elemen
- Algoritma, data structures

Ketiga tingkat saling terkait. Arsitektur (tingkat 1) menjadi konteks untuk desain tingkat bawah.

## Architectural Drivers

**Architectural drivers** adalah input utama desain arsitektur, yang menentukan keputusan arsitek. Ada lima jenis:

![Designing Software Architectures: Cover](/image/designing-software-architectures-cover.svg)

## Design Purpose

**Design purpose** menjawab *mengapa* sistem dirancang:

- Tujuan bisnis dan stakeholder
- Misi sistem (misal: "sistem harus berjalan 24/7 untuk jutaan user")
- Menjadi **kompas**: semua keputusan desain harus berkontribusi pada design purpose
- Berbeda dari requirements fungsional; ini konteks yang lebih luas

## Quality Attributes

**Quality attributes (QAs)** adalah karakteristik kualitas sistem:

| QA | Pertanyaan Kunci |
|----|------------------|
| **Availability** | Seberapa sering sistem tersedia? |
| **Performance** | Seberapa cepat respons? |
| **Security** | Seberapa aman dari serangan? |
| **Modifiability** | Seberapa mudah diubah? |
| **Testability** | Seberapa mudah ditest? |
| **Usability** | Seberapa mudah dipakai? |
| **Interoperability** | Seberapa baik integrasi? |

### Quality Attribute Scenarios

QA didefinisikan sebagai **scenario** yang terukur:

- **Source**: siapa memicu (user, sistem)
- **Stimulus**: apa yang terjadi
- **Artifact**: bagian sistem mana
- **Environment**: kondisi saat itu
- **Response**: bagaimana sistem merespons
- **Response measure**: ukuran terukur

Contoh: *"Saat 10.000 user mengakses bersamaan (source), sistem harus merespons dalam 2 detik (response measure) pada 95% request (environment normal)."*

## Primary Functionality

**Primary functionality** adalah fungsionalitas inti sistem:

- Use cases utama
- Aliran data utama
- Memengaruhi struktur: fungsionalitas utama membentuk struktur dasar
- Diseleksi sebagai drivers saat fungsionalitas itu penting secara arsitektural

## Architectural Concerns

**Architectural concerns** adalah perhatian lintas-fungsi yang memengaruhi desain:

- **Organizational**: struktur tim, lokasi
- **Legal/regulatory**: compliance, data residency
- **Market**: time-to-market, kompetisi
- **Operational**: deployment, monitoring
- **Evolution**: perubahan yang diperkirakan

## Constraints

**Constraints**: batasan yang tidak bisa diubah:

- **Technical**: platform, bahasa, teknologi wajib
- **Business**: budget, timeline
- **Legal**: regulasi, standar
- **Organizational**: skill tim, struktur

Constraints **membatasi ruang solusi**: bukan pilihan, tapi keharusan.

## Design Concepts

**Design concepts** adalah **building blocks** untuk membuat struktur: pilihan desain yang tersedia bagi arsitek:

![ADD 3.0: Proses 7 Langkah](/image/add-3.0-process.svg)

## Reference Architectures

**Reference architecture** adalah template arsitektur untuk tipe sistem tertentu: proven patterns untuk domain:

- **Web applications**: browser + server + database
- **Rich client applications**: logic di client
- **Rich Internet Applications**: hybrid
- **Mobile applications**: device + server
- **Service applications**: service-oriented

Menggunakan reference architecture **mempercepat desain**: tidak mulai dari nol.

## Architectural Design Patterns

Pola desain arsitektural: solusi proven untuk masalah umum:

### Structural Patterns

- **Layered**: pemisahan layer (presentation, business, data)
- **Pipes and Filters**: aliran data melalui proses
- **Shared Repository**: data bersama
- **Client-Server**: client meminta, server melayani

### Interface Partitioning

- **Model-View-Controller (MVC)**: pisah model, view, controller
- **Model-View-ViewModel (MVVM)**: varian untuk UI modern
- **Publish-Subscribe**: decoupled communication

### Concurrency

- **Locking**: sinkronisasi akses
- **Scheduling**: pengaturan eksekusi
- **Pipelining**: paralelisme

### Database Access

- **Repository**: abstraksi data access
- **Data Mapper**: mapping objek-database
- **Unit of Work**: transaksi konsisten

## Tactics

**Tactics** adalah teknik desain paling dasar untuk memenuhi **satu quality attribute spesifik**:

| QA | Contoh Tactics |
|----|----------------|
| **Availability** | Redundancy, heartbeat, recovery, graceful degradation |
| **Performance** | Caching, concurrency, scheduling, resource pooling |
| **Security** | Authentication, authorization, encryption, intrusion detection |
| **Modifiability** | Separation of concerns, generalization, runtime registration |
| **Testability** | Recording, separation of concerns, control points |
| **Usability** | Cancel, undo, progress feedback |

Tactics adalah **atom desain**: lebih spesifik dari patterns, satu per satu memenuhi satu QA.

## Deployment Patterns

**Deployment patterns**: bagaimana komponen ditempatkan di hardware:

### Nondistributed Deployment

- Semua di satu proses/mesin
- Sederhana, tanpa network overhead

### Distributed Deployment

- **Client-Server**: client dan server terpisah
- **Multi-tier**: beberapa tier di mesin berbeda
- Komponen tersebar: butuh komunikasi

### Performance Patterns

- **Load-Balanced Cluster**: banyak instance di belakang load balancer
- **Replicated**: salinan data/instance
- **Partitioned**: data dipecah per node

## Architecture Design Decisions

Keputusan desain arsitektur memiliki karakteristik:

- **Consequences**: setiap keputusan punya konsekuensi (positif/negatif)
- **Trade-offs**: harus menyeimbangkan QA yang konflik
- **Dependencies**: keputusan saling memengaruhi
- **Cost**: keputusan awal mahal untuk diubah
- **Records**: keputusan harus didokumentasikan (ADR)

## Kesimpulan

Chapter 1-2 membangun kerangka: **architectural drivers** (design purpose, QAs, functionality, concerns, constraints) menjadi input, dan **design concepts** (reference architectures, patterns, tactics, deployment) menjadi building blocks. Arsitek menyeimbangkan keduanya untuk membuat keputusan desain.

Di artikel berikutnya: **[proses desain arsitektur: ADD 3.0 langkah demi langkah](/blog/attribute-driven-design-3.0-process-7-langkah)** (Chapter 3). Lihat juga **[contoh desain arsitektur dari tiga case study](/blog/case-studies-arsitektur-fcaps-bigdata-banking)** dan **[perbandingan metode desain serta teknik analisis](/blog/metode-desain-analisis-add-organisasi)**.

## FAQ

### Apa itu arsitektur software?

Arsitektur software adalah struktur sistem yang terdiri dari komponen-komponen dan hubungannya, diorganisir dalam "areas of concern". Arsitektur menentukan kualitas penting seperti performa, keamanan, dan kemudahan modifikasi: keputusan arsitektural adalah keputusan paling mahal untuk diubah setelah sistem dibangun.

### Apa itu architectural drivers dalam desain arsitektur?

Architectural drivers adalah input utama yang menentukan keputusan arsitek: design purpose (tujuan sistem), quality attributes (availability, performance, security, modifiability), primary functionality (use case inti), architectural concerns (perhatian organisasional/regulasi), dan constraints (batasan teknis/bisnis). Drivers dipilih sebagai fokus per iterasi desain.

### Apa perbedaan design patterns dan tactics dalam arsitektur?

Design patterns adalah solusi proven untuk masalah struktural umum (layered, MVC, repository) yang memengaruhi beberapa aspek. Tactics adalah teknik paling dasar yang memenuhi satu quality attribute spesifik (redundancy untuk availability, caching untuk performance). Patterns bisa terdiri dari kombinasi tactics.

### Kapan sebaiknya menggunakan reference architecture?

Gunakan reference architecture saat membangun sistem di domain yang sudah matang (e-commerce, ERP, mobile apps). Reference architecture menyediakan template teruji yang mempercepat desain dan mengurangi risiko: seperti arsitektur berlapis untuk aplikasi web atau pola client-server untuk aplikasi terdistribusi.

## Referensi

- Cervantes, H., & Kazman, R. (2016). *Designing Software Architectures: A Practical Approach*. Addison-Wesley.
- Bass, L., Clements, P., & Kazman, R. (2012). *Software Architecture in Practice* (3rd ed.). Addison-Wesley.
- Clements, P., et al. (2010). *Documenting Software Architectures* (2nd ed.). Addison-Wesley.
- Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns*. Addison-Wesley.
