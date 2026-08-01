---
title: "Software Architecture: The Hard Parts - Panduan Lengkap Arsitektur Terdistribusi"
description: Rangkuman lengkap buku Neal Ford, Mark Richards, Pramod Sadalage,
  dan Zhamak Dehghani - trade-off analysis, architecture
  quantum, coupling, decomposition patterns, data mesh, dan transactional sagas
  untuk arsitektur microservices.
pubDate: 2026-10-28T08:00:00.000Z
image: /image/hard-parts-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - Microservices
  - SoftwareDesign
  - DataMesh
series: "Software Architecture: The Hard Parts"
seriesOrder: 1
---

*Software Architecture: The Hard Parts* karya **Neal Ford, Mark Richards, Pramod Sadalage, dan Zhamak Dehghani** (O'Reilly, 2021) adalah buku tentang **modern trade-off analysis untuk arsitektur terdistribusi**. Buku ini menjawab pertanyaan yang tidak bisa dijawab Google: *bagaimana cara memutuskan ketika tidak ada best practice yang jelas?* Jika Anda sedang merancang microservices, memecah monolit, atau memilih antara orchestration dan choreography, buku ini memberikan teknik praktisnya.

Buku ini dibangun di atas *Fundamentals of Software Architecture* (Ford & Richards, 2020). Bedanya, buku sebelumnya mengajarkan konsep dasar, sedangkan buku ini menangani **kasus-kasus sulit** di mana trade-off saling bertabrakan. Tidak ada jawaban benar/salah, hanya analisis yang lebih baik.

Artikel ini adalah **overview komprehensif**. Untuk pembahasan mendalam per topik, baca series 6 artikel:

1. [Architecture Quantum dan Fitness Functions](/blog/hard-parts-01-quantum-fitness-functions)
2. [Architectural Decomposition: 6 Pola Memecah Monolit](/blog/hard-parts-02-decomposition-patterns)
3. [Data Decomposition dan Service Granularity](/blog/hard-parts-03-data-decomposition)
4. [Reuse Patterns dan Data Ownership](/blog/hard-parts-04-reuse-data-ownership)
5. [Orchestration vs Choreography dan 8 Saga Patterns](/blog/hard-parts-05-orchestration-sagas)
6. [Data Mesh dan Trade-Off Analysis](/blog/hard-parts-06-data-mesh-tradeoff)

## Daftar Isi

- [Mengapa Buku Ini Ditulis?](#mengapa-buku-ini-ditulis)
- [Chapter 1: Ketika Tidak Ada Best Practices](#chapter-1-ketika-tidak-ada-best-practices)
- [Part I: Pulling Things Apart](#part-i-pulling-things-apart)
- [Chapter 2: Architecture Quantum dan Coupling](#chapter-2-architecture-quantum-dan-coupling)
- [Chapter 3: Modularity Drivers](#chapter-3-modularity-drivers)
- [Chapter 4: Architectural Decomposition](#chapter-4-architectural-decomposition)
- [Chapter 5: Component-Based Decomposition Patterns](#chapter-5-component-based-decomposition-patterns)
- [Chapter 6: Data Decomposition](#chapter-6-data-decomposition)
- [Chapter 7: Service Granularity](#chapter-7-service-granularity)
- [Part II: Putting Things Back Together](#part-ii-putting-things-back-together)
- [Chapter 8: Reuse Patterns](#chapter-8-reuse-patterns)
- [Chapter 9: Data Ownership dan Distributed Transactions](#chapter-9-data-ownership-dan-distributed-transactions)
- [Chapter 10: Distributed Data Access](#chapter-10-distributed-data-access)
- [Chapter 11: Orchestration vs Choreography](#chapter-11-orchestration-vs-choreography)
- [Chapter 12: Transactional Sagas](#chapter-12-transactional-sagas)
- [Chapter 13: Contracts dan Stamp Coupling](#chapter-13-contracts-dan-stamp-coupling)
- [Chapter 14: Data Mesh](#chapter-14-data-mesh)
- [Chapter 15: Build Your Own Trade-Off Analysis](#chapter-15-build-your-own-trade-off-analysis)
- [FAQ](#faq)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Mengapa Buku Ini Ditulis?

Banyak buku arsitektur menjelaskan *apa* itu microservices, event-driven architecture, atau data mesh. Sedikit yang menjelaskan *kapan* menggunakannya dan *apa trade-offnya*. Buku ini hadir untuk mengisi celah itu: bukan memberi jawaban, tapi **teknik untuk menemukan jawaban sendiri** di konteks spesifik Anda.

Premisnya sederhana: arsitektur adalah serangkaian trade-off. Meningkatkan security bisa menurunkan performance. Menambah scalability bisa mengorbankan elasticity. Tidak ada solusi yang sempurna, hanya solusi yang *lebih cocok* untuk masalah Anda.

Buku ini menggunakan **Sysops Squad Saga** sebagai contoh berkelanjutan: sebuah perusahaan IT support yang harus memecah monolitnya menjadi microservices. Setiap chapter menunjukkan bagaimana tim mereka menerapkan pola dan menghadapi konsekuensinya.

## Chapter 1: Ketika Tidak Ada Best Practices

Chapter pembuka menetapkan fondasi. Di dunia arsitektur, "best practice" sering kali mitos. Yang ada adalah *konteks* dan *trade-off*. Buku ini memperkenalkan tiga alat utama untuk bernalar di ruang yang ambigu:

### Architectural Decision Records (ADRs)

**ADR** adalah dokumen singkat yang mencatat keputusan arsitektur: konteks, keputusan, konsekuensi. ADR menjawab "mengapa kita memilih ini?" di masa depan, saat tim sudah berganti. Buku ini menyediakan template ADR lengkap di Appendix B.

### Architecture Fitness Functions

**Fitness function** memvalidasi karakteristik arsitektur secara otomatis. Jika unit test memvalidasi domain logic, fitness function memvalidasi *architecture characteristics* (scalability, availability, security). Contoh: test yang memastikan response time tidak melebihi 200ms, atau dependency check yang melarang coupling antar bounded context.

Ada tiga jenis fitness function:
- **Atomic**: memvalidasi satu karakteristik (contoh: performance test)
- **Holistic**: memvalidasi kombinasi karakteristik yang saling memengaruhi (contoh: security + performance)
- **Triggered**: berjalan saat event tertentu (contoh: deployment)

### Architecture vs Design

Buku ini membedakan keduanya dengan sederhana:
- **Architecture**: struktur, karakteristik, dan keputusan yang sulit diubah
- **Design**: detail implementasi di dalam struktur itu

Arsitek fokus pada trade-off struktural; developer fokus pada implementasi. Keduanya penting, tapi buku ini tentang yang pertama.

## Part I: Pulling Things Apart

Part pertama membahas cara **memecah** sistem: kapan, mengapa, dan bagaimana. Ini relevan untuk tim yang migrasi dari monolit ke microservices, atau yang ingin memperbaiki modularitas sistem yang sudah ada.

## Chapter 2: Architecture Quantum dan Coupling

### Apa itu Architecture Quantum?

**Architecture quantum**: unit arsitektur yang **independently deployable** dan memiliki **high functional cohesion**. Konsep ini kunci untuk memahami microservices. Satu quantum bisa berupa satu service, satu database, atau satu bounded context.

Kenapa penting? Karena quantum menentukan **scope of change**. Jika Anda mengubah sesuatu di dalam quantum, dampaknya terisolasi. Jika perubahan melintasi quantum, Anda punya coupling yang berbahaya.

![Architecture Quantum](/image/hard-parts-quantum.svg)

### Static vs Dynamic Coupling

Buku ini membedakan dua jenis coupling:

- **Static coupling**: dependensi struktural antar komponen (class A memanggil class B). Terlihat di codebase.
- **Dynamic coupling**: dependensi runtime antar service (service A memanggil service B via network). Terlihat di distributed traces.

Static coupling bisa diukur dengan metrik seperti **afferent coupling** (incoming) dan **efferent coupling** (outgoing). Dynamic coupling lebih sulit diukur dan lebih berbahaya di sistem terdistribusi.

### Quantum Coupling

Ketika dua service berbagi quantum (misal: satu database untuk dua service), mereka **statically coupled**. Ketika mereka berkomunikasi via network, mereka **dynamically coupled**. Buku ini menekankan: **minimalkan quantum coupling** untuk menjaga independensi deployment.

## Chapter 3: Modularity Drivers

Mengapa memecah sistem? Buku ini mengidentifikasi lima driver utama:

| Driver | Penjelasan |
|--------|------------|
| **Maintainability** | Perubahan terisolasi, tidak merusak bagian lain |
| **Testability** | Bisa test komponen secara independen |
| **Deployability** | Deployment independen, tidak perlu deploy semua |
| **Scalability** | Scale komponen yang butuh, bukan seluruh sistem |
| **Availability/Fault Tolerance** | Kegagalan satu komponen tidak meruntuhkan sistem |

Setiap driver adalah trade-off. Microservices meningkatkan semua driver di atas, tapi menurunkan **simplicity** dan **consistency**. Monolit lebih sederhana, tapi sulit di-maintain dan di-scale.

## Chapter 4: Architectural Decomposition

### Kapan Codebase Bisa Dipecah?

Tidak semua monolit bisa dipecah dengan mudah. Buku ini memberikan metrik untuk menilai **decomposability**:

- **Afferent/Efferent Coupling**: berapa banyak dependensi masuk/keluar?
- **Abstractness**: rasio abstract class vs concrete class
- **Instability**: rasio efferent vs total coupling
- **Distance from Main Sequence**: seberapa jauh dari ideal (abstract + stable)

Codebase dengan coupling rendah dan abstraksi tinggi lebih mudah dipecah.

### Component-Based vs Tactical Forking

Ada dua pendekatan decomposition:

1. **Component-Based Decomposition**: identifikasi komponen berdasarkan domain, lalu pisahkan secara bertahap. Lebih lambat, tapi lebih aman.
2. **Tactical Forking**: fork codebase, lalu refactor di branch terpisah. Lebih cepat, tapi berisiko merge conflict besar.

Sysops Squad memilih component-based karena codebase mereka besar dan tim tersebar.

## Chapter 5: Component-Based Decomposition Patterns

Chapter ini memberikan enam pola praktis untuk memecah komponen:

| Pola | Tujuan |
|------|--------|
| **Identify and Size Components** | Tentukan ukuran komponen yang tepat (tidak terlalu besar, tidak terlalu kecil) |
| **Gather Common Domain Components** | Kumpulkan komponen yang sering berubah bersama |
| **Flatten Components** | Pecah komponen yang terlalu kompleks |
| **Determine Component Dependencies** | Petakan dependensi antar komponen |
| **Create Component Domains** | Kelompokkan komponen ke domain |
| **Create Domain Services** | Bangun service per domain |

Setiap pola dilengkapi **fitness function** untuk governance otomatis. Contoh: setelah "Flatten Components", tambahkan test yang memastikan tidak ada komponen dengan lebih dari X class.

## Chapter 6: Data Decomposition

Data adalah bagian tersulit dari decomposition. Kode bisa dipecah, tapi data sering terjebak dalam relational database dengan foreign key dan transaction.

### Data Disintegrators vs Data Integrators

- **Disintegrators**: alasan untuk memecah data (change control, fault tolerance, scalability)
- **Integrators**: alasan untuk menjaga data tetap bersama (consistency, transactions, foreign keys)

Trade-off: semakin Anda memecah data, semakin sulit menjaga consistency. Semakin Anda menjaga consistency, semakin sulit memecah data.

### Langkah Decomposition Data

Buku ini memberikan lima langkah:

1. **Analyze Data Dependencies**: petakan foreign key dan relationship
2. **Assign Data to Services**: tentukan service mana yang "memiliki" data mana
3. **Separate Database Connections**: pisahkan koneksi database per service
4. **Move Schemas to Separate Servers**: pindahkan schema ke server terpisah
5. **Switch Over to Independent Databases**: potong sepenuhnya

### Memilih Tipe Database

Buku ini membahas **polyglot persistence**: menggunakan database berbeda untuk kebutuhan berbeda. Pilihan meliputi relational, key-value, document, column family, graph, NewSQL, cloud native, dan time-series.

Contoh Sysops Squad: ticket data di relational, survey data di document database, expert location di graph database.

## Chapter 7: Service Granularity

Berapa besar seharusnya service? Ini pertanyaan paling sering diajukan di microservices. Buku ini memberikan dua kelompok faktor:

### Granularity Disintegrators (alasan untuk memperkecil)

- **Service scope and function**: satu fungsi bisnis
- **Code volatility**: bagian yang sering berubah
- **Scalability**: bagian yang butuh scale berbeda
- **Fault tolerance**: bagian yang butuh isolasi kegagalan
- **Security**: bagian dengan kebutuhan keamanan khusus
- **Extensibility**: bagian yang akan diperluas

### Granularity Integrators (alasan untuk memperbesar)

- **Database transactions**: butuh ACID
- **Workflow**: butuh orchestrasi kompleks
- **Shared code**: terlalu banyak kode bersama
- **Data relationships**: data terlalu terkait

**Finding the right balance**: tidak ada formula. Anda harus menimbang disintegrators vs integrators untuk setiap kasus.

## Part II: Putting Things Back Together

Setelah memecah, Anda harus **menyatukan kembali** dengan cara yang benar. Part II membahas pola untuk reuse, data access, workflow, dan transactions di sistem terdistribusi.

## Chapter 8: Reuse Patterns

Bagaimana berbagi kode antar service tanpa menciptakan coupling? Empat pola:

| Pola | Mekanisme | Kapan Digunakan |
|------|-----------|-----------------|
| **Code Replication** | Copy-paste kode | Jarang; hanya untuk kode yang sangat stabil |
| **Shared Library** | Library bersama (JAR, npm) | Untuk kode infrastruktur (logging, security) |
| **Shared Service** | Service terpisah untuk fungsi bersama | Untuk fungsi bisnis bersama |
| **Sidecar/Service Mesh** | Deploy bersama service utama | Untuk cross-cutting concerns (monitoring, auth) |

Trade-off utama: **reuse vs independence**. Semakin banyak reuse, semakin tinggi coupling.

## Chapter 9: Data Ownership dan Distributed Transactions

### Siapa Pemilik Data?

Di microservices, setiap service harus memiliki datanya sendiri. Tapi bagaimana jika dua service butuh data yang sama?

Tiga skenario ownership:

1. **Single Ownership**: satu service memiliki data, yang lain akses via API
2. **Common Ownership**: data di shared database (hindari jika bisa)
3. **Joint Ownership**: data dipecah dengan teknik khusus

### Teknik Joint Ownership

- **Table Split**: pecah tabel, masing-masing service punya bagian
- **Data Domain**: kelompokkan data ke domain, service punya domainnya
- **Delegate**: satu service utama, yang lain delegate

### Distributed Transactions

Tidak ada ACID di microservices. Alternatifnya:

- **Eventual Consistency**: data konsisten *akhirnya*, bukan seketika
- **Compensating Transactions**: rollback dengan operasi kebalikan
- **Saga Pattern**: serangkaian local transactions dengan compensations

Tiga pola eventual consistency:

| Pola | Mekanisme |
|------|-----------|
| **Background Synchronization** | Batch job sinkronisasi data |
| **Orchestrated Request-Based** | Orchestrator mengoordinasi update |
| **Event-Based** | Service publish event, yang lain subscribe |

## Chapter 10: Distributed Data Access

Bagaimana service mengakses data yang tidak dimilikinya? Empat pola:

| Pola | Mekanisme | Trade-off |
|------|-----------|-----------|
| **Interservice Communication** | REST/gRPC call ke pemilik data | Latency tinggi, coupling tinggi |
| **Column Schema Replication** | Replicate kolom yang dibutuhkan | Data duplication, consistency risk |
| **Replicated Caching** | Cache data di service konsumen | Stale data, complexity |
| **Data Domain** | Buat domain data bersama | Compromise ownership |

Sysops Squad memilih **Replicated Caching** untuk expert location data karena read-heavy dan toleran terhadap stale data.

## Chapter 11: Orchestration vs Choreography

Dua gaya komunikasi untuk workflow terdistribusi:

### Orchestration

- **Central controller** mengoordinasi semua service
- Service tidak tahu satu sama lain
- Orchestrator tahu seluruh workflow

**Kelebihan**: visibility tinggi, mudah dipahami, mudah debug
**Kekurangan**: single point of failure, orchestrator jadi bottleneck

### Choreography

- **Tidak ada central controller**
- Service publish event, yang lain subscribe
- Workflow muncul dari interaksi

**Kelebihan**: decoupled, scalable, resilient
**Kekurangan**: sulit dipahami, sulit debug, sulit track state

### State Management

Bagaimana melacak state workflow? Tiga pendekatan:

1. **Stateful Orchestrator**: orchestrator menyimpan state
2. **Stateless Choreography**: query semua service untuk build state
3. **Stamp Coupling**: state disimpan di message contract

## Chapter 12: Transactional Sagas

**Saga** mengelola transaksi terdistribusi sebagai serangkaian local transactions, masing-masing dengan **compensating transaction** untuk rollback.

Buku ini mengidentifikasi **8 saga patterns** berdasarkan tiga dimensi:

- **Communication**: synchronous vs asynchronous
- **Consistency**: atomic vs eventual
- **Coordination**: orchestrated vs choreographed

![8 Saga Patterns](/image/hard-parts-sagas.svg)

| Pola | Communication | Consistency | Coordination | Keterangan |
|------|-------------|-------------|--------------|------------|
| **Epic Saga (sao)** | Synchronous | Atomic | Orchestrated | Paling mudah, tapi paling coupled |
| **Phone Tag (sac)** | Synchronous | Atomic | Choreographed | Sulit di-debug |
| **Fairy Tale (seo)** | Synchronous | Eventual | Orchestrated | Good balance |
| **Time Travel (sec)** | Synchronous | Eventual | Choreographed | Complex state |
| **Fantasy Fiction (aao)** | Asynchronous | Atomic | Orchestrated | Jarang dipakai |
| **Horror Story (aac)** | Asynchronous | Atomic | Choreographed | **Paling sulit, hindari** |
| **Parallel Saga (aeo)** | Asynchronous | Eventual | Orchestrated | Good untuk scale |
| **Anthology (aec)** | Asynchronous | Eventual | Choreographed | Paling decoupled |

**Rekomendasi buku**: hindari Horror Story. Pilih Epic untuk simplicity, Anthology untuk decoupling, atau Fairy Tale/Parallel untuk balance.

## Chapter 13: Contracts dan Stamp Coupling

### Strict vs Loose Contracts

- **Strict contract**: schema ketat, validasi ketat. Kelebihan: jelas, type-safe. Kekurangan: brittle, sulit evolve.
- **Loose contract**: schema fleksibel. Kelebihan: mudah evolve. Kekurangan: ambiguous, error di runtime.

Di microservices, **loose contracts** lebih umum karena service evolve independen.

### Stamp Coupling

**Stamp coupling** terjadi ketika service mengirim seluruh object (stamp) padahal hanya butuh sebagian. Ini masalah karena:

- **Bandwidth**: mengirim data tidak perlu
- **Security**: expose data sensitif
- **Coupling**: perubahan di object memengaruhi semua konsumen

Solusi: **data transfer objects (DTOs)** yang hanya berisi field yang dibutuhkan, atau **GraphQL** untuk query spesifik.

## Chapter 14: Data Mesh

**Data mesh** adalah pendekatan baru untuk analytical data, diperkenalkan oleh Zhamak Dehghani (salah satu penulis buku ini).

### Masalah dengan Pendekatan Lama

- **Data Warehouse**: centralized, monolithic, sulit scale
- **Data Lake**: jadi data swamp, tidak ada governance

### Prinsip Data Mesh

1. **Domain Ownership**: tim domain memiliki data mereka
2. **Data as a Product**: data diperlakukan sebagai produk, dengan SLA
3. **Self-Serve Infrastructure**: platform untuk tim domain
4. **Federated Governance**: standar global, implementasi lokal

### Data Product Quantum

**Data product quantum (DPQ)** adalah unit data mesh: independently deployable data product dengan high cohesion. Mirip dengan architecture quantum di microservices.

![Data Mesh](/image/hard-parts-data-mesh.svg)

### Kapan Menggunakan Data Mesh?

Data mesh cocok jika:
- Organisasi besar dengan banyak domain
- Data warehouse/lake sudah tidak scalable
- Tim domain punya kapabilitas data engineering

Tidak cocok untuk startup kecil atau organisasi dengan data sederhana.

## Chapter 15: Build Your Own Trade-Off Analysis

Chapter penutup merangkum teknik untuk melakukan trade-off analysis sendiri:

### Langkah-langkah

1. **Find Entangled Dimensions**: identifikasi karakteristik yang saling memengaruhi (security vs performance)
2. **Analyze Coupling Points**: di mana trade-off terjadi?
3. **Assess Trade-Offs**: timbang pro dan kontra

### Teknik Analisis

- **Qualitative vs Quantitative**: gunakan data jika bisa, tapi jangan abaikan intuisi
- **MECE Lists**: Mutually Exclusive, Collectively Exhaustive; pastikan tidak ada yang terlewat
- **Avoid Out-of-Context Trap**: jangan bandingkan solusi tanpa konteks
- **Model Relevant Domain Cases**: gunakan kasus nyata dari domain Anda
- **Prefer Bottom Line**: fokus pada kesimpulan, bukan overwhelming evidence
- **Avoid Snake Oil**: waspada terhadap vendor dan evangelist yang menjual solusi tanpa trade-off

### Sysops Squad Epilogue

Sysops Squad berhasil memecah monolit mereka. Mereka tidak menggunakan semua pola di buku. Mereka memilih yang cocok untuk konteks mereka. Itulah intinya: **tidak ada solusi universal, hanya analisis yang lebih baik.**

## FAQ

### Apa perbedaan architecture quantum dan bounded context?

Bounded context adalah konsep Domain-Driven Design: batas di mana model domain berlaku. Architecture quantum adalah unit deployment independen. Satu bounded context bisa berisi beberapa quantum (misal: service + database), atau satu quantum bisa mencakup beberapa bounded context kecil.

### Kapan sebaiknya memilih orchestration daripada choreography?

Pilih orchestration jika workflow kompleks dan butuh visibility tinggi (contoh: order fulfillment dengan banyak langkah). Pilih choreography jika service harus decoupled dan scalable (contoh: event notification). Untuk kebanyakan kasus, orchestration lebih mudah dipahami dan di-debug.

### Apa itu stamp coupling dan mengapa berbahaya?

Stamp coupling terjadi ketika service mengirim seluruh object padahal hanya butuh sebagian field. Ini berbahaya karena meningkatkan bandwidth, mengekspos data sensitif, dan menciptakan coupling yang tidak perlu. Solusinya adalah DTOs atau GraphQL untuk query spesifik.

### Kapan data mesh sebaiknya digunakan?

Data mesh cocok untuk organisasi besar dengan banyak domain data, di mana data warehouse atau lake sudah tidak scalable. Tidak cocok untuk startup kecil atau tim tanpa kapabilitas data engineering. Data mesh membutuhkan investasi di platform dan governance.

## Kesimpulan

*Software Architecture: The Hard Parts* adalah buku tentang **seni membuat keputusan di ruang yang ambigu**. Tidak ada best practice, hanya trade-off. Buku ini memberikan:

- **Architecture quantum** untuk memahami scope of change
- **Fitness functions** untuk governance otomatis
- **Decomposition patterns** untuk memecah monolit
- **Saga patterns** untuk transaksi terdistribusi
- **Data mesh** untuk analytical data
- **Trade-off analysis** untuk semua keputusan

Intinya: arsitektur bukan tentang menemukan jawaban yang benar, tapi tentang **membuat keputusan yang lebih baik** dengan analisis yang lebih baik. Buku ini adalah panduan untuk itu. Jika Anda baru memulai arsitektur, baca dulu panduan [architectural drivers dan design patterns](/blog/software-architecture-drivers-design-concepts) atau pelajari [metode ADD 3.0 untuk desain arsitektur](/blog/attribute-driven-design-3.0-process-7-langkah). Keduanya memberi fondasi yang dibutuhkan buku ini.

## Referensi

- Ford, N., Richards, M., Sadalage, P., & Dehghani, Z. (2021). *Software Architecture: The Hard Parts*. O'Reilly Media.
- Ford, N., & Richards, M. (2020). *Fundamentals of Software Architecture*. O'Reilly Media.
- Dehghani, Z. (2022). *Data Mesh*. O'Reilly Media.
- Vernon, V. (2013). *Implementing Domain-Driven Design*. Addison-Wesley.
