---
title: "Microservice API Patterns (MAP): Panduan Desain API Service"
description: Paper akademik Microservice API Patterns oleh Zimmermann et al -
  bahasa pola untuk desain API microservices, kategori pattern, Embedded Entity
  vs Linked Information Holder, representasi data bersarang, evolusi API.
pubDate: 2026-10-05T08:00:00.000Z
image: /image/map-patterns-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - API
  - Patterns
  - Microservices
  - REST
series: "Microservices for Java Developers"
seriesOrder: 6
---

Bagaimana cara mendesain API microservices yang baik? Pertanyaan ini dijawab secara sistematis oleh paper akademik **"Introduction to Microservice API Patterns (MAP)"** — karya **Olaf Zimmermann, Mirko Stocker, Daniel Lübke, Cesare Pautasso, dan Uwe Zdun** yang dipresentasikan di konferensi Microservices 2019. MAP adalah bahasa pola (pattern language) yang mendistilasi solusi proven untuk masalah desain service yang berulang.

## Daftar Isi

- [Apa itu Microservice API Patterns (MAP)?](#apa-itu-microservice-api-patterns-map)
- [Definisi Microservices yang Terkonsolidasi](#definisi-microservices-yang-terkonsolidasi)
- [Mengapa Desain API Microservices Sulit?](#mengapa-desain-api-microservices-sulit)
- [Scope dan Organisasi MAP](#scope-dan-organisasi-map)
- [Pola sebagai Kendaraan Berbagi Pengetahuan](#pola-sebagai-kendaraan-berbagi-pengetahuan)
- [Template Dokumentasi Pola](#template-dokumentasi-pola)
- [Pattern: Embedded Entity](#pattern-embedded-entity)
- [Pattern: Linked Information Holder](#pattern-linked-information-holder)
- [Embedded Entity vs Linked Information Holder](#embedded-entity-vs-linked-information-holder)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Apa itu Microservice API Patterns (MAP)?

MAP adalah **bahasa pola** (pattern language) untuk desain API microservices. Ia menyediakan solusi proven, platform-independent, dan technology-independent untuk masalah desain yang berulang seperti:

- Menemukan **granularity service** yang tepat
- **Menyaring ukuran representasi pesan** (message representations)
- **Mengelola evolusi API** dan implementasinya

Website resmi: **www.microservice-api-patterns.org** — berisi pattern index interaktif yang terus diperbarui.

## Definisi Microservices yang Terkonsolidasi

Paper ini merangkum definisi microservices yang telah berevolusi dari Service-Oriented Architectures (SOA). Karakteristik utama:

- **Independently deployable** — bisa di-deploy sendiri-sendiri
- **Scalable dan changeable** — bisa di-scale dan diubah secara independen
- **Single responsibility** — setiap service punya satu tanggung jawab
- **Memodelkan business capabilities** — tanggung jawab ini memodelkan kapabilitas bisnis
- **Deployed di lightweight containers** — virtualisasi ringan
- **Encapsulate own state** — service mengelola state-nya sendiri
- **Komunikasi via message-based remote APIs** — loosely coupled
- **Polyglot programming dan persistence** — teknologi bisa berbeda per service
- **DevOps practices** — termasuk decentralized continuous delivery

Microservices berkomunikasi melalui **request dan response message representations** via port platform-independent dan adapters technology-specific. Struktur internal service digambarkan seperti *onion* — setiap ring adalah lapisan logis lokal (logic, data).

## Mengapa Desain API Microservices Sulit?

Paper mengidentifikasi konflik mendasar yang harus diseimbangkan desainer API:

### Requirements Diversity

Kebutuhan dan keinginan API clients **berbeda satu sama lain dan terus berubah**. Provider harus memutuskan: menawarkan kompromi "good-enough" dalam satu unified API, atau mencoba memenuhi kebutuhan setiap client secara individual?

### Design Mismatches

Apa yang bisa dilakukan backend systems (scope fungsional dan kualitas) dan bagaimana strukturnya (endpoint dan data definitions) **mungkin berbeda dari yang client harapkan**. Perbedaan ini harus diatasi.

### Open vs Closed Systems

Client dan provider sering punya **tujuan yang konflik**:
- Keinginan berinovasi dan dinamika pasar menyebabkan **lebih banyak perubahan** dari yang client terima
- Publishing API berarti **membuka sistem dan melepas kendali**
- Client mungkin menggunakan data dengan **cara tak terduga**

### Stability vs Flexibility

- Microservices memungkinkan **release sering** (DevOps, continuous delivery)
- Tapi API harus **stabil** untuk menghindari breaking client code
- **Konflik konstan** ini harus diselesaikan oleh desainer microservice API

## Scope dan Organisasi MAP

MAP mengambil pandangan luas pada desain dan evolusi API microservices — dari perspektif **"data on the outside"**: message representations dan payloads yang dipertukarkan saat API dipanggil.

Pesan-pesan ini terstruktur sebagai **representation elements** yang berbeda makna dan strukturnya sesuai peran arsitektural endpoint dan operasinya.

![Microservice API Patterns — Organisasi Bahasa Pola](/image/map-patterns-cover.svg)

MAP terorganisasi ke dalam beberapa **kategori**, tiga di antaranya punya subkategori:

| Kategori | Fokus | Status |
|----------|-------|--------|
| **Representation** | Struktur message representations | Tersedia online |
| **Quality** | Kualitas API (data, evolusi, security) | Tersedia online |
| **Foundation** | Fondasi API design | Tersedia online |
| **Identification** | Identifikasi resource | Belum tersedia |

Pola dalam bold/black sudah tersedia online; yang grayed out sedang di-mining (dikembangkan). Pattern index interaktif bisa dilihat di www.microservice-api-patterns.org.

## Pola sebagai Kendaraan Berbagi Pengetahuan

Mengapa memilih format pola untuk berbagi saran desain API? Paper memberi dua alasan:

### 1. Membentuk Domain Vocabulary (Ubiquitous Language)

Nama pola bertujuan membentuk **vocabulary domain** — ubiquitous language. Contoh sukses: **Enterprise Integration Patterns (EIP)** oleh Hohpe dan Woolf telah menjadi *lingua franca* untuk queue-based messaging, diimplementasikan di banyak framework dan tools. **Ubiquitous language untuk API design masih kurang** — MAP berusaha mengisinya.

### 2. Mendukung Informed Decision Making

Bagian **forces dan consequences** dalam pola mendukung pengambilan keputusan yang terinformasi — tentang karakteristik kualitas yang diinginkan dan bisa dicapai, termasuk kelemahan dari pilihan desain tertentu.

## Template Dokumentasi Pola

Setiap pola di MAP didokumentasikan dengan template konsisten:

| Bagian | Isi |
|--------|-----|
| **Context** | Prasyarat untuk kelayakan/applicability pola |
| **Problem** | Masalah desain yang harus diselesaikan (biasanya dalam bentuk pertanyaan) |
| **Forces** | Mengapa masalah sulit — isu desain arsitektural dan konflik quality attributes |
| **Solution** | Jawaban atas pertanyaan desain + variant + contoh + hints implementasi |
| **Consequences** | Sejauh mana solusi menyelesaikan forces + pros/cons + masalah baru |
| **Known Uses** | Contoh penerapan pola di dunia nyata |

## Pattern: Embedded Entity

![Embedded Entity Pattern — Data disertakan dalam response](/image/map-embedded-entity.svg)

**Context:** API mengekspos data terstruktur. Data ini berisi elemen yang saling berhubungan (master information element bisa berisi elemen detail, performance report bisa mengagregasi raw data). Clients ingin bekerja dengan beberapa elemen terkait saat memproses response atau memproduksi request.

**Problem:** Ketika mengekspos elemen informasi yang terstruktur, mungkin sangat nested, **bagaimana merepresentasikan hubungan antar elemen dalam pesan**?

### Non-solution

Definisi satu endpoint per elemen informasi — diakses saat client butuh data dari elemen itu. Masalahnya: jika client menggunakan data tersebut di banyak situasi, solusi ini menghasilkan **banyak request berurutan** untuk mengikuti referensi. Ini bisa memaksa koordinasi eksekusi request dan conversation state — yang **merusak scalability dan availability**; data terdistribusi juga lebih sulit dijaga konsisten.

### Solution

Untuk setiap relationship yang dibutuhkan client dalam cukup banyak kasus, **embed (sertakan) elemen terkait langsung di dalam pesan**:

1. Definisikan **Parameter Tree** atau **Atomic Parameter List** yang mencakup **Entity Element** untuk relationship yang direferensikan
2. Tambahkan **Metadata Element** untuk menandai tipe relationship jika perlu
3. **Analisis outgoing relationships** di Entity Element — pertimbangkan embed juga, tapi hanya jika data tambahan memang dipakai client dalam cukup banyak kasus
4. Ulangi analisis sampai mencapai **"transitive closure"** — semua entitas reachable sudah di-include atau di-exclude
5. Review setiap source-target relationship: apakah target entity benar-benar dibutuhkan client? Ya → Embedded Entities; tidak → cukup referensi ke Linked Information Holder
6. **Dokumentasikan** keberadaan dan makna embedded entity relationships di API Description

### Contoh

**Lakeside Mutual** (aplikasi contoh microservices) punya service **Customer Core** yang mengagregasi beberapa item informasi dalam operation signatures-nya. Referenced information items semuanya **terkandung penuh di response message** (customerProfile, customerInteractionLog) — tidak ada URI/links ke resource lain.

```json
{
  "customer": {
    "id": "a51a-433f-979b-24e8f0",
    "name": "R. D."
  },
  "customerProfile": {
    "currentAddress": "...",
    "moveHistory": []
  },
  "customerInteractionLog": {
    "contactHistory": [],
    "classification": "??"
  }
}
```

Catatan: `customerProfile` meng-embed data nested (currentAddress, moveHistory), sementara `customerInteractionLog` kosong dalam contoh ini.

### Implementation Hints

- **Dokumentasikan karakteristik data** — owner, provenance, lifetime, last update di API Description
- **Distinguish transactional data dari master data** dan reference data lain (life cycle, evolusi, validity timeframe berbeda)
- **Secure pesan** — content part dengan kebutuhan proteksi tertinggi harus dicover (bisa jadi Embedded Entity-nya)

### Consequences

**Keuntungan:**
- Client dapat memproses data terkait dalam satu round-trip
- Tidak perlu banyak request untuk mengikuti referensi
- Konsistensi lebih mudah (data lokal, tidak terdistribusi)

**Kerugian:**
- **Sulit mengantisipasi** informasi apa yang dibutuhkan client berbeda — kecenderungan memasukkan data berlebih → **message sizes lebih besar**
- Large messages dengan unused data **memakan bandwidth** (tapi jika kebanyakan data dipakai, satu pesan besar bisa lebih hemat dari banyak pesan kecil — header/metadata dikirim berulang)
- Jika embedded entities berubah dengan **kecepatan berbeda** (transactional yang cepat berubah vs master data immutable), retransmit semua entity = overhead — pertimbangkan switch ke Linked Information Holder
- **Sulit menghapus** Embedded Entity yang sudah diekspos secara backward-compatible

### Related Patterns

- **Linked Information Holder** — solusi komplementer/alternatif
- **Wish List / Wish Template** — fine-tune konten dalam Embedded Entity

## Pattern: Linked Information Holder

![Linked Information Holder Pattern — Data direferensikan via link](/image/map-linked-holder.svg)

**a.k.a.** Linked Entity, Data Reference, Compound Document (Sideloading)

**Context:** API mengekspos data terstruktur. Data berisi elemen yang saling berhubungan — client ingin bekerja dengan beberapa elemen terkait saat memproses pesan.

**Problem:** Ketika mengekspos elemen informasi terstruktur yang mungkin sangat nested, **bagaimana merepresentasikan hubungan antar elemen** — tanpa harus selalu menyertakan semua data?

### Non-solution

Selalu (transitively) meng-include semua elemen terkait di setiap pesan (pendekatan Embedded Entity). Masalahnya: **merusak performa call individu** dan menghasilkan pesan besar yang wasteful — berisi data yang tidak dibutuhkan sebagian client.

### Solution

**Tambahkan Link Element** ke pesan yang mereferensikan API endpoint. Perkenalkan endpoint yang merepresentasikan linked entity — misalnya **Information Holder Resource** untuk elemen informasi yang direferensikan.

1. Sertakan **location information** (host dan port), diekspresikan dalam logical naming/addressing scheme API, saat mereferensikan endpoint via Link Elements
2. Client bisa **mengikuti link** untuk mendapatkan data yang dibutuhkan on demand

### Contoh

**Customer Information Holder** (REST controller di Spring Boot) mengimplementasikan Linked Information Holder untuk customerProfile. Response message:

```json
GET http://localhost:8080/customers/a51a-433f-979b-24e8f0

{
  "customer": {
    "id": "a51a-433f-979b-24e8f0"
  },
  "links": [
    {
      "rel": "customerProfile",
      "href": "http://localhost:8080/customers/a51a-433f-979b-24e8f0/profile"
    },
    {
      "rel": "moveHistory",
      "href": "http://localhost:8080/customers/a51a-433f-979b-24e8f0/moveHistory"
    }
  ],
  "email": "rdavenhall0@example.com",
  "phoneNumber": "491 103 8336",
  "customerInteractionLog": {
    "contactHistory": [],
    "classification": "??"
  }
}
```

customerProfile diambil dengan **request lanjutan** ke URI link. moveHistory telah di-factored out menjadi resource terpisah yang bisa diakses on demand.

### Implementation Hints

- **Monitor performance berkelanjutan** — jika sebagian besar client mengikuti link, pertimbangkan embed target element (Embedded Entity) untuk mengurangi traffic
- **Patuhi REST constraints** — linked reference data adalah cornerstone dari **HATEOAS** (Hypertext as the Engine of Application State), diperlukan untuk mencapai **REST maturity level 3**

### Consequences

Pola ini sering diterapkan saat mereferensikan **rich information holders** yang melayani banyak use case: tidak semua penerima pesan butuh full set data. Contoh: **Master Data Holders** seperti customer profiles atau product records.

- Dengan mengikuti link, penerima pesan bisa mendapatkan subset data yang dibutuhkan **on demand**
- Saat memperkenalkan link elements, ada **janji implisit** bahwa link bisa diikuti sukses — provider mungkin tidak mau menepati janji ini selamanya; **broken links** harus ditangani (misalnya dengan Lookup Resource pattern)
- Mengikuti REST maturity level 3 membantu evolusi API

### Known Uses

- **Microsoft Graph API** — user resource representations berisi scalar/complex attributes sebagai "Properties", tapi juga link ke resource lain seperti Calendar (di "Relationships")
- **Spring Restbucks** — RESTful HTTP API level 3 dengan links merepresentasikan application state transfer

### Related Patterns

- **Embedded Entity** — alternatif, mentransmisikan data daripada mereferensikan
- **Information Holder Resources** — yang direferensikan Linked Information Holder
- **Lookup Resource** — menangani broken links
- **Linked Service** (Daigneau) — pola serupa, kurang fokus data
- **Partial DTO Population** (Web Service Patterns) — memecahkan masalah serupa

## Embedded Entity vs Linked Information Holder

| Aspek | Embedded Entity | Linked Information Holder |
|-------|-----------------|---------------------------|
| **Strategi** | Include (nesting) data | Link (referencing) data |
| **Jumlah request** | Satu request, semua data | Request + follow link |
| **Ukuran pesan** | Besar (berisi semua data) | Kecil (hanya referensi) |
| **Bandwidth** | Boros jika data jarang dipakai | Hemat — data on demand |
| **Consistency** | Lebih mudah (data lokal) | Data terdistribusi |
| **Cache** | Sulit jika sebagian data berubah | Lebih cacheable |
| **Evolusi** | Sulit hapus backward-compatible | Lebih fleksibel |
| **Cocok untuk** | Data yang hampir selalu dipakai | Master data, rich information holders |
| **REST** | Representasi penuh | HATEOAS, maturity level 3 |

**Panduan praktis:**
- Jika **hampir semua client selalu butuh** data terkait → **Embedded Entity**
- Jika **beberapa client kadang butuh** data detail → **Linked Information Holder**
- Kombinasi keduanya dimungkinkan — embed data inti, link data detail

## Kesimpulan

Microservice API Patterns (MAP) menyediakan **bahasa pola yang sistematis** untuk desain API microservices — menjawab kebutuhan akan ubiquitous language untuk API design yang selama ini kurang, setelah Enterprise Integration Patterns sukses untuk messaging.

Dua pola contoh — **Embedded Entity** dan **Linked Information Holder** — menunjukkan bagaimana MAP membantu desainer memilih antara *inclusion* (nesting) dan *linkage* (referencing) untuk representasi data terkait, dengan pertimbangan forces yang eksplisit: ukuran pesan, bandwidth, konsistensi, cacheability, dan evolvability.

MAP terus berkembang — pattern index interaktif di www.microservice-api-patterns.org, dan kategori identification sedang dalam pengembangan.

## Referensi

- Zimmermann, O., Stocker, M., Lübke, D., Pautasso, C., & Zdun, U. (2019). Introduction to Microservice API Patterns (MAP). In *Microservices 2017/2019* (OASIcs). Schloss Dagstuhl.
- Hohpe, G., & Woolf, B. (2003). *Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions*. Addison-Wesley.
- Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.
- Zimmermann, O. (2017). Microservices Tenets. *Computer Science, 32*(3-4), 301-310.
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine.
