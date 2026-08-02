---
title: "Architectural Thinking dan Modularity: Fondasi Software Architecture"
description: "Panduan mendalam architectural thinking, modularity, cohesion, coupling, dan connascence dari buku Fundamentals of Software Architecture - fondasi untuk semua keputusan arsitektur."
pubDate: 2026-10-28T08:00:00.000Z
image: /image/fundamentals-01-thinking.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - Modularity
series: "Software Architecture Fundamentals"
seriesOrder: 1
---

*Fundamentals of Software Architecture* karya Mark Richards dan Neal Ford membuka dengan fondasi: **bagaimana berpikir seperti architect** dan **memahami modularity**. Dua konsep ini adalah prasyarat untuk semua keputusan arsitektur selanjutnya.

Artikel ini mencakup Chapter 1-3 buku: definisi software architecture, 8 ekspektasi architect, architectural thinking vs design thinking, dan modularity dengan 7 tingkatan cohesion serta coupling metrics.

## Daftar Isi

- [Apa itu Software Architecture?](#apa-itu-software-architecture)
- [8 Ekspektasi terhadap Architect](#8-ekspektasi-terhadap-architect)
- [Architectural Thinking vs Design Thinking](#architectural-thinking-vs-design-thinking)
- [Technical Breadth vs Depth](#technical-breadth-vs-depth)
- [Analyzing Trade-Offs](#analyzing-trade-offs)
- [Modularity: Fondasi Arsitektur](#modularity-fondasi-arsitektur)
- [Cohesion: 7 Tingkatan](#cohesion-7-tingkatan)
- [Coupling: Afferent dan Efferent](#coupling-afferent-dan-efferent)
- [Abstractness, Instability, dan Main Sequence](#abstractness-instability-dan-main-sequence)
- [Connascence: Hidden Coupling](#connascence-hidden-coupling)
- [From Modules to Components](#from-modules-to-components)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Apa itu Software Architecture?

Buku ini mendefinisikan software architecture sebagai:

> **Struktur sistem yang terdiri dari komponen, hubungan antar komponen, dan prinsip-prinsip yang mengatur desain dan evolusinya.**

Architecture berbeda dari **design**. Perbedaan ini kritis:

| Aspek | Architecture | Design |
|-------|-----------|--------|
| **Scope** | Struktur sistem | Detail implementasi |
| **Change cost** | Sulit dan mahal | Mudah dan murah |
| **Example** | Database, framework, protocol | Class, method, algorithm |
| **Decision maker** | Architect | Developer |
| **Lifespan** | Bertahun-tahun | Minggu/bulan |

Architecture adalah **keputusan yang sulit diubah**. Jika Anda bisa mengganti library dalam sehari, itu design. Jika mengganti database butuh migrasi data selama berminggu-minggu, itu architecture.

## 8 Ekspektasi terhadap Architect

Buku ini merinci 8 ekspektasi yang harus dipenuhi software architect:

| Ekspektasi | Deskripsi | Contoh Praktis |
|-----------|-----------|----------------|
| **Make architecture decisions** | Membuat keputusan sulit diubah | Pilih PostgreSQL vs MongoDB |
| **Continually analyze** | Evaluasi arsitektur berkelanjutan | Review tech debt quarterly |
| **Keep current** | Ikuti tren terbaru | Baca radar, ikuti conference |
| **Ensure compliance** | Pastikan keputusan diikuti | Code review, fitness functions |
| **Diverse exposure** | Pengalaman lintas teknologi | Java, Python, cloud, mobile |
| **Business domain knowledge** | Pahami bisnis, bukan hanya teknologi | Mengerti alur order-to-cash |
| **Interpersonal skills** | Komunikasi dan kolaborasi | Presentasi ke stakeholder |
| **Navigate politics** | Kelola stakeholder dan konflik | Mediasi dev vs ops |

**Kunci**: Architect adalah **technical leader**, bukan ivory tower decision maker. Anda harus hands-on, tapi tidak micro-manage.

## Architectural Thinking vs Design Thinking

Chapter 2 memperkenalkan konsep kunci: **architectural thinking**.

![Architectural Thinking vs Design Thinking](/image/fundamentals-01-thinking.svg)

| Dimensi | Architectural Thinking | Design Thinking |
|---------|----------------------|-----------------|
| **Focus** | Struktur dan hubungan | Fungsi dan fitur |
| **Time horizon** | Tahun | Minggu/bulan |
| **Change cost** | Tinggi | Rendah |
| **Decision impact** | Seluruh sistem | Modul tunggal |
| **Primary concern** | Quality attributes | Functional requirements |

**Contoh**: 
- Design thinking: "Bagaimana implementasi login?"
- Architectural thinking: "Bagaimana autentikasi bekerja lintas service, dengan single sign-on, dan audit trail?"

## Technical Breadth vs Depth

Architect butuh **balance** antara breadth dan depth:

```
Developer:      ██████████░░  (depth 90%, breadth 10%)
Architect:      ████████░░░░  (depth 60%, breadth 40%)
```

| Tipe | Depth | Breadth | Kapan |
|------|-------|---------|-------|
| **Developer** | Tinggi | Rendah | Implementasi detail |
| **Architect** | Cukup | Tinggi | Lihat big picture |
| **CTO** | Rendah | Sangat tinggi | Strategy dan portfolio |

Architect tidak perlu tahu setiap detail framework, tapi harus tahu **kapan dan mengapa** menggunakannya.

## Analyzing Trade-Offs

Architectural thinking = **trade-off analysis**. Buku ini menekankan:

> **Everything in software architecture is a trade-off.**

Tidak ada solusi sempurna. Setiap keputusan memiliki konsekuensi positif dan negatif.

**Contoh trade-off**:

| Pilihan | Positive | Negative |
|---------|----------|----------|
| Microservices | Independent deploy, scale per service | Distributed complexity, latency |
| Monolith | Simple, fast local calls | Hard to scale, big deployments |
| Synchronous | Simple, immediate response | Tight coupling, cascading failure |
| Asynchronous | Decoupled, resilient | Eventual consistency, complex debugging |

**Kunci**: Pilih trade-off yang **paling sesuai** dengan konteks, bukan yang "terbaik" secara absolut.

## Modularity: Fondasi Arsitektur

Chapter 3 membahas **modularity** sebagai fondasi semua arsitektur.

**Modularity** adalah praktik membagi sistem menjadi bagian-bagian yang:
- **Independently changeable** (bisa diubah tanpa mempengaruhi bagian lain)
- **Independently deployable** (bisa di-deploy terpisah)
- **High cohesive** (elemen dalam modul terkait erat)
- **Low coupled** (modul tidak terlalu bergantung satu sama lain)

## Cohesion: 7 Tingkatan

Cohesion mengukur **seberapa terkait** elemen dalam satu modul. Semakin tinggi, semakin baik.

![Cohesion Levels](/image/fundamentals-01-cohesion.svg)

| Tingkat | Deskripsi | Contoh | Kualitas |
|---------|-----------|--------|----------|
| **Functional** | Semua elemen untuk satu tujuan | `OrderCalculator` | ★★★★★ |
| **Sequential** | Output satu jadi input lain | `FileParser` → `DataValidator` | ★★★★☆ |
| **Communicational** | Operasi pada data yang sama | `CustomerDAO` | ★★★★☆ |
| **Procedural** | Urutan eksekusi tertentu | `StartupInitializer` | ★★★☆☆ |
| **Temporal** | Terkait waktu | `BatchJobScheduler` | ★★☆☆☆ |
| **Logical** | Terkait logis, bukan fungsional | `StringUtils` | ★★☆☆☆ |
| **Coincidental** | Tidak terkait sama sekali | `Utilities` (acak) | ★☆☆☆☆ |

**Aturan praktis**: Target **functional cohesion**. Jika modul Anda punya lebih dari satu "alasan untuk berubah", pertimbangkan untuk memecahnya.

## Coupling: Afferent dan Efferent

Coupling mengukur **seberapa bergantung** modul pada modul lain.

| Metrik | Definisi | Interpretasi |
|--------|----------|--------------|
| **Afferent (Ca)** | Berapa banyak modul yang bergantung pada modul ini | Incoming dependencies |
| **Efferent (Ce)** | Berapa banyak modul yang diandalkan modul ini | Outgoing dependencies |
| **Instability (I)** | I = Ce / (Ca + Ce) | 0 = stabil, 1 = tidak stabil |

**Contoh**:
```
Module A: Ca=5, Ce=1, I=0.17 (stabil, banyak yang depend)
Module B: Ca=1, Ce=5, I=0.83 (tidak stabil, depend banyak)
```

**Aturan praktis**: Modul yang **stabil** (I rendah) seharusnya **abstract** (interface, abstract class). Modul yang **tidak stabil** (I tinggi) bisa concrete.

## Abstractness, Instability, dan Main Sequence

Buku ini memperkenalkan metrik dari Robert C. Martin:

| Metrik | Formula | Arti |
|--------|---------|------|
| **Abstractness (A)** | A = Na / Nc | Rasio abstract class vs total class |
| **Instability (I)** | I = Ce / (Ca + Ce) | Rasio efferent vs total coupling |
| **Distance (D)** | D = |A + I - 1| | Jarak dari main sequence |

**Main Sequence** adalah garis ideal A + I = 1:
- **Zone of Pain** (A=0, I=0): Concrete, stabil , sulit diubah, banyak yang depend
- **Zone of Uselessness** (A=1, I=1): Abstract, tidak stabil , tidak ada yang pakai

![Main Sequence](/image/fundamentals-01-main-sequence.svg)

**Aturan praktis**: Target modul di dekat **main sequence** (D mendekati 0).

## Connascence: Hidden Coupling

Connascence (dari Meilir Page-Jones) adalah bentuk coupling yang lebih halus:

| Jenis | Deskripsi | Contoh |
|-------|-----------|--------|
| **Name** | Method name harus sama | Interface method naming |
| **Type** | Tipe data harus cocok | Parameter type matching |
| **Meaning** | Nilai harus diinterpretasi sama | Magic number 1=active, 2=inactive |
| **Position** | Urutan parameter harus sama | Method signature order |
| **Algorithm** | Algoritma harus sinkron | Distributed consensus |

**Aturan praktis**: 
- **Static connascence** (name, type) = compile-time, lebih baik
- **Dynamic connascence** (meaning, algorithm) = runtime, lebih berbahaya

## From Modules to Components

Chapter 3 mengakhiri dengan transisi dari **module** ke **component**:

| Aspek | Module | Component |
|-------|--------|-----------|
| **Scope** | Code organization | Deployable unit |
| **Granularity** | Class, package | Service, library |
| **Deployment** | Part of monolith | Independent |
| **Example** | `utils.js` | `user-service` |

Component adalah **modul yang bisa di-deploy independen**. Ini adalah building block untuk architecture styles di Part II.

## Kesimpulan

Chapter 1-3 buku ini membangun fondasi:

1. **Architecture** adalah keputusan yang sulit diubah
2. **Architect** adalah technical leader dengan 8 ekspektasi
3. **Architectural thinking** fokus pada struktur dan trade-off
4. **Modularity** dengan high cohesion dan low coupling adalah fondasi
5. **Metrics** (Ca, Ce, I, A, D) membantu mengukur kualitas arsitektur

Artikel berikutnya: **Architecture Characteristics** , bagaimana mendefinisikan, mengukur, dan mengatur quality attributes.

## FAQ

### Apa bedanya software architecture dan software design?

Architecture adalah keputusan yang sulit diubah (database, framework, protocol), design adalah keputusan yang mudah diubah (class structure, method signature). Architecture berdampak sistem-wide, design berdampak local.

### Apa itu cohesion dan mengapa penting?

Cohesion mengukur seberapa terkait elemen dalam satu modul. Functional cohesion (semua elemen untuk satu tujuan) adalah yang terbaik. High cohesion membuat modul lebih mudah dipahami, ditest, dan diubah.

### Apa itu coupling dan bagaimana mengukurnya?

Coupling mengukur dependensi antar modul. Afferent (Ca) = incoming, Efferent (Ce) = outgoing. Instability I = Ce/(Ca+Ce). Modul stabil (I rendah) seharusnya abstract, modul tidak stabil bisa concrete.

### Apa itu connascence?

Connascence adalah coupling halus di mana perubahan satu komponen memaksa perubahan lain. Jenisnya: name, type, meaning, position, algorithm. Dynamic connascence (runtime) lebih berbahaya dari static (compile-time).

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 1-3.
- Page-Jones, M. (1980). *The Practical Guide to Structured Systems Design*. Yourdon Press.
- Martin, R. C. (2000). *Design Principles and Design Patterns*. Object Mentor.
