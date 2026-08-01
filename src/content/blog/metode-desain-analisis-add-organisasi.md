---
title: "Metode Desain Arsitektur dan Analisis: ADD, RUP, ATAM, Tactics"
description: Panduan metode desain arsitektur software dari buku Cervantes dan
  Kazman - perbandingan metode desain, analisis arsitektur tactics-based,
  scenario reviews, ATAM, ADD dalam organisasi dan pre-sales, design concepts
  catalog, tactics questionnaires.
pubDate: 2026-10-28T08:00:00.000Z
image: /image/designing-software-architectures-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Analysis
  - SEI
  - DesignMethods
series: "Designing Software Architectures"
seriesOrder: 4
---

Chapter 7-10 dari *Designing Software Architectures* (Cervantes & Kazman) melengkapi ADD dengan **metode desain arsitektur lain** (Ch7), **analisis dalam proses desain** (Ch8), **ADD dalam organisasi** (Ch9), dan penutup (Ch10). Plus ada dua Appendices: Design Concepts Catalog dan Tactics-Based Questionnaires. Bagi arsitek yang ingin memilih metode atau mengevaluasi desain, artikel ini merangkum perbandingan dan teknik analisisnya.

## Daftar Isi

- [Metode Desain Arsitektur Lain](#metode-desain-arsitektur-lain)
- [General Model of Software Architecture Design](#general-model-of-software-architecture-design)
- [Architecture-Centric Design Method](#architecture-centric-design-method)
- [Arsitektur dalam Rational Unified Process](#arsitektur-dalam-rational-unified-process)
- [The Process of Software Architecting](#the-process-of-software-architecting)
- [A Technique for Architecture and Design](#a-technique-for-architecture-and-design)
- [Viewpoints and Perspectives Method](#viewpoints-and-perspectives-method)
- [Analisis dan Desain](#analisis-dan-desain)
- [Kenapa Menganalisis?](#kenapa-menganalisis)
- [Analysis Techniques](#analysis-techniques)
- [Tactics-Based Analysis](#tactics-based-analysis)
- [Reflective Questions](#reflective-questions)
- [Scenario-Based Design Reviews](#scenario-based-design-reviews)
- [Architecture Description Languages](#architecture-description-languages)
- [ADD dan Development Life Cycle](#add-dan-development-life-cycle)
- [Arsitektur Selama Pre-Sales](#arsitektur-selama-pre-sales)
- [Arsitektur Selama Development dan Operation](#arsitektur-selama-development-dan-operation)
- [Aspek Organisasi](#aspek-organisasi)
- [Design Concepts Catalog](#design-concepts-catalog)
- [Tactics-Based Questionnaires](#tactics-based-questionnaires)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Metode Desain Arsitektur Lain

ADD bukan satu-satunya metode. Buku membandingkannya dengan metode lain yang lebih tua maupun kontemporer:

## General Model of Software Architecture Design

Model umum yang menjadi dasar perbandingan. Aktivitas inti desain:

1. **Analyze**: pahami kebutuhan dan konteks
2. **Synthesize**: ciptakan solusi struktur
3. **Evaluate**: nilai apakah solusi memenuhi kebutuhan
4. **Iterate**: ulangi sampai memuaskan

Semua metode desain (termasuk ADD) adalah variasi dari model umum ini.

## Architecture-Centric Design Method

Metode yang menempatkan arsitektur sebagai **pusat proses pengembangan**:

- **Architecture-driven**: semua aktivitas mengacu arsitektur
- Berasal dari **SEI (Software Engineering Institute)**
- Fokus: arsitektur sebagai produk utama yang dievaluasi sebelum implementasi
- Pengembangan iteratif di sekitar arsitektur yang stabil

## Arsitektur dalam Rational Unified Process

**RUP (Rational Unified Process)** adalah proses pengembangan iteratif dari Rational/IBM:

- **Phases**: Inception, Elaboration, Construction, Transition
- Arsitektur dibangun di **Elaboration phase**
- Menggunakan **use case-driven** dan **architecture-centric**
- **Iterative**: setiap iterasi menghasilkan versi executable
- Arsitektur diekspresikan dalam **4+1 views** (Kruchten): logical, process, development, physical + use case

## The Process of Software Architecting

Metode dari **Paul Clements dan kawan-kawan** (SEI):

- Fokus pada **aktivitas arsitek**: bukan hanya desain
- Aktivitas: architectural analysis, synthesis, evaluation, implementation, post-construction
- Menekankan **documentation** sebagai produk
- Arsitektur dievaluasi dengan **ATAM** (Architecture Tradeoff Analysis Method)

## A Technique for Architecture and Design

**TAD** dari **Coplien dan Bjørnvig**:

- Berbasis **"generic architecture"** untuk domain
- **Responsibilities** sebagai unit utama (bukan komponen)
- Kolaborasi antar responsibilities
- Fokus pada **code dan organisasi**: arsitektur dekat implementasi

## Viewpoints and Perspectives Method

Metode dari **Rozanski dan Woods**:

- **Viewpoints**: sudut pandang stakeholder (context, functional, information, concurrency, development, deployment, operational)
- **Perspectives**: cross-cutting concerns (security, performance, availability, evolvability) yang diterapkan lintas viewpoints
- Setiap perspective punya: prinsip, panduan, checklist, teknik

## Analisis dan Desain

Analisis adalah **aktivitas evaluasi** yang berjalan paralel dengan desain:

- **Desain**: menciptakan solusi
- **Analisis**: menilai apakah solusi benar
- Keduanya bergantian: desain → analisis → perbaiki

## Kenapa Menganalisis?

- **Deteksi masalah lebih awal**: sebelum mahal diperbaiki
- **Validasi keputusan**: apakah memenuhi drivers
- **Mengurangi risiko**: identifikasi kelemahan sejak awal
- **Komunikasi**: hasil analisis membantu stakeholder paham
- **Trade-off explicit**: QA yang dikorbankan menjadi jelas

## Analysis Techniques

- **Tactics-based analysis**: cek penerapan tactics
- **Reflective questions**: pertanyaan kritis
- **Scenario-based reviews**: jalankan QA scenarios terhadap desain
- **Architecture Description Languages**: formal modeling
- **Prototyping/simulation**: validasi empiris
- **ATAM**: evaluasi formal komprehensif

## Tactics-Based Analysis

Analisis berbasis tactics: **menanyakan apakah tactics diterapkan dengan benar**:

Contoh untuk **availability**:

1. Apakah ada **redundancy** pada komponen kritis?
2. Apakah **heartbeat** memonitor komponen?
3. Apakah **recovery** otomatis (restart, failover)?
4. Apakah **graceful degradation** didesain?

Contoh untuk **performance**:

1. Apakah **caching** diterapkan pada data panas?
2. Apakah ada **concurrency** yang cukup?
3. Apakah **resource pooling** digunakan?
4. Apakah **scheduling** prioritas benar?

Jawaban "tidak" → kelemahan yang harus diperbaiki.

## Reflective Questions

Pertanyaan reflektif untuk menilai kualitas desain:

- Apakah desain **sederhana** (tanpa kompleksitas tidak perlu)?
- Apakah setiap elemen punya **responsibility jelas**?
- Apakah **interfaces** konsisten dan minimal?
- Apakah desain **memfasilitasi evolusi** yang diharapkan?
- Apakah **trade-offs** didokumentasikan?
- Apakah **design purpose** tercapai?

## Scenario-Based Design Reviews

Menjalankan **QA scenarios** terhadap desain:

1. Ambil scenario (misal: "1000 user bersamaan, respons < 2 detik")
2. **Walk through** desain: bagaimana sistem merespons?
3. Identifikasi **di mana** sistem bisa gagal
4. Evaluasi: **apakah respons cukup?**
5. Jika tidak → perbaiki desain (tactics baru)

**ATAM** (Architecture Tradeoff Analysis Method) adalah versi formal dan komprehensif dari teknik ini.

## Architecture Description Languages

**ADLs** adalah bahasa formal untuk menggambarkan arsitektur:

- **Notasi tekstual/grafis** yang presisi
- Mendukung **analisis otomatis** (konsistensi, deadlock)
- Contoh: **Architecture Analysis and Design Language (AADL)**, SysML
- Trade-off: formalitas tinggi = lebih sulit dipakai, tapi analisis lebih kuat

## ADD dan Development Life Cycle

## Arsitektur Selama Pre-Sales

Arsitektur berperan penting **sebelum proyek dimulai**:

- **Estimasi**: arsitektur menentukan effort
- **Proposal**: bukti kelayakan teknis
- **Rapid design**: arsitektur awal untuk proposal
- **Risiko diidentifikasi**: technical feasibility
- **Trade-off awal**: biaya vs kualitas

Desain pre-sales: **cukup detail untuk estimasi**, tidak berlebihan.

## Arsitektur Selama Development dan Operation

- **Baseline**: arsitektur menjadi acuan implementasi
- **Guard**: review implementasi terhadap arsitektur
- **Evolusi**: arsitektur berubah seiring kebutuhan
- **Technical debt**: keputusan cepat yang harus dibayar
- **Operasi**: deployment sesuai arsitektur (allocation view)
- **Monitoring**: verifikasi QA di production

## Aspek Organisasi

### Designing sebagai Individual atau Team

- **Individual**: keputusan cepat, konsisten, tapi rentan blind spot
- **Team**: perspektif luas, review lebih baik, tapi butuh koordinasi
- Rekomendasi: **tim kecil** dengan keputusan terdokumentasi

### Design Concepts Catalog dalam Organisasi

Organisasi sebaiknya membangun **katalog concepts sendiri**:

- **Referensi**: pola dan tactics yang terbukti di organisasi
- **Standardisasi**: konsistensi lintas proyek
- **Onboarding**: arsitek baru cepat belajar
- **Evolusi**: katalog diperbarui dari pengalaman
- Sumber: buku ini (Appendix A), literatur, pengalaman internal

## Design Concepts Catalog

**Appendix A** berisi katalog lengkap:

### Reference Architectures

- Web applications, rich client, RIA, mobile, service applications

### Deployment Patterns

- Nondistributed, distributed (client-server, multi-tier), load-balanced cluster

### Architectural Design Patterns

- Structural (layered, pipes-filters, repository, client-server)
- Interface partitioning (MVC, MVVM, publish-subscribe)
- Concurrency (locking, scheduling)
- Database access (repository, data mapper, unit of work)

### Tactics

- Availability, interoperability, modifiability, performance, security, testability, usability

### Externally Developed Components

- Spring, Swing, Hibernate, Java Web Start (dengan panduan kapan memakai)

## Tactics-Based Questionnaires

**Appendix B** berisi questionnaire per QA untuk analisis:

### Availability

- Apakah ada deteksi kegagalan (heartbeat, ping)?
- Apakah ada recovery (restart, failover, redundancy)?
- Apakah ada prevention (transactions, exception handling)?

### Performance

- Apakah ada resource management (pooling, caching)?
- Apakah concurrency cukup?
- Apakah scheduling prioritas benar?

### Security

- Apakah autentikasi kuat?
- Apakah otorisasi granular?
- Apakah enkripsi diterapkan?
- Apakah audit trail ada?

### Modifiability / Testability / Usability / Interoperability / DevOps

Setiap QA punya **serangkaian pertanyaan checklist**: digunakan saat review arsitektur untuk menemukan kelemahan sistematis.

## Kesimpulan

Buku ditutup dengan **kebutuhan akan metode** (Ch10): desain arsitektur yang baik butuh proses prinsipial: bukan intuisi. ADD 3.0 memberikan metode itu, dilengkapi analisis berkelanjutan, kesadaran organisasi, dan katalog concepts serta questionnaires sebagai toolkit praktis.

**Lima takeaways buku:**

1. **Design purpose** adalah kompas semua keputusan: baca [panduan architectural drivers dan design patterns](/blog/software-architecture-drivers-design-concepts)
2. **Drivers** (QA, functionality, concerns, constraints) menentukan desain
3. **Design concepts** (patterns, tactics) adalah building blocks
4. **Iterasi**: desain bertahap, analisis terus-menerus: pelajari [proses ADD 3.0 7 langkah](/blog/attribute-driven-design-3.0-process-7-langkah)
5. **Dokumentasi**: views dan decisions sebagai produk arsitektur

Untuk melihat metode dalam praktik, kunjungi [contoh case study FCAPS, Big Data, dan Banking](/blog/case-studies-arsitektur-fcaps-bigdata-banking).

## FAQ

### Apa itu ATAM dan kapan menggunakannya?

ATAM (Architecture Tradeoff Analysis Method) adalah metode evaluasi arsitektur formal dari SEI. ATAM menjalankan quality attribute scenarios terhadap desain untuk menemukan trade-offs dan risiko: misalnya keputusan yang meningkatkan performa tapi menurunkan modifiability. Gunakan ATAM untuk proyek besar yang membutuhkan evaluasi menyeluruh sebelum implementasi.

### Metode desain arsitektur mana yang terbaik?

Tidak ada yang terbaik universal: semua metode (ADD, RUP, TAD, viewpoints-perspectives) adalah variasi dari model umum: analyze, synthesize, evaluate, iterate. ADD unggul di kesistematisan dan drivers-based; RUP cocok untuk proyek use-case driven; TAD dekat dengan implementasi. Pilih sesuai konteks organisasi dan tipe sistem.

### Apa itu tactics dalam arsitektur software?

Tactics adalah teknik desain paling dasar yang memenuhi satu quality attribute spesifik: redundancy dan heartbeat untuk availability, caching dan concurrency untuk performance, authentication dan encryption untuk security. Tactics adalah atom desain: patterns dibangun dari kombinasi tactics.

### Bagaimana ADD diterapkan dalam proses pre-sales?

Saat pre-sales, desain arsitektur dibuat cepat namun cukup detail untuk estimasi: pilih drivers utama, buat struktur kasar, identifikasi risiko teknis dan trade-offs biaya vs kualitas. Arsitek juga membangun design concepts catalog organisasi agar konsisten lintas proyek dan mempercepat onboarding arsitek baru.

## Referensi

- Cervantes, H., & Kazman, R. (2016). *Designing Software Architectures: A Practical Approach*. Addison-Wesley.
- Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation*. CMU/SEI.
- Kruchten, P. (1995). Architectural Blueprints: The "4+1" View Model. *IEEE Software, 12*(6).
- Rozanski, N., & Woods, E. (2011). *Software Systems Architecture* (2nd ed.). Addison-Wesley.
