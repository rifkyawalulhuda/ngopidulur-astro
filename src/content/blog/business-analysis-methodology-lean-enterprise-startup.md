---
title: "Business Analysis Methodology: Panduan Lengkap BA di Lean Enterprise dan Lean Startup"
description: "Panduan lengkap metodologi Business Analysis dari Emrah Yayici - lean principles, enterprise architecture, strategic analysis, waterfall vs agile, requirements gathering, dokumentasi, lean UX, DevOps, QA, dan project management dengan studi kasus proyek mobile app."
pubDate: 2026-11-05T08:00:00.000Z
image: /image/business-analysis-methodology-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - BusinessAnalysis
  - LeanStartup
  - Requirements
  - UXDesign
  - ProjectManagement
series: "Business Analysis"
seriesOrder: 0
---

Perusahaan harus mengembangkan produk inovatif dan berkualitas lebih cepat dari kompetitor untuk menciptakan periode monopoli sementara dengan profitabilitas maksimal. Namun mereka biasanya punya tenggat ketat dan budget terbatas. C-suite executives dan manajer selalu ingin hasil cepat dan jarang mau menunda peluncuran produk.

*Business Analysis Methodology Book* karya **Emrah Yayici** (2015) menjawab tantangan ini dengan pendekatan **lean** di setiap tahap Product Development Life Cycle (PDLC). Buku 99 halaman ini memadukan teori dan studi kasus nyata proyek mobile application CEC (Consumer Electronics Company).

Artikel ini merangkum seluruh 10 chapter buku dengan diagram SVG pendukung.

## Daftar Isi

- [Pendahuluan: Mengapa Pendekatan Lean?](#pendahuluan-mengapa-pendekatan-lean)
- [Chapter 1: Lean Principles untuk Inovasi dan Time to Market](#chapter-1-lean-principles-untuk-inovasi-dan-time-to-market)
- [Chapter 2: Lean Enterprise Architecture Management](#chapter-2-lean-enterprise-architecture-management)
- [Chapter 3: Lean Strategic Analysis dan Product Scope Definition](#chapter-3-lean-strategic-analysis-dan-product-scope-definition)
- [Chapter 4: Waterfall atau Agile?](#chapter-4-waterfall-atau-agile)
- [Chapter 5: Lean Requirements Gathering](#chapter-5-lean-requirements-gathering)
- [Chapter 6: Lean Requirements Documentation](#chapter-6-lean-requirements-documentation)
- [Chapter 7: Lean UX Design dan Usability](#chapter-7-lean-ux-design-dan-usability)
- [Chapter 8: Lean Technical Design dan DevOps](#chapter-8-lean-technical-design-dan-devops)
- [Chapter 9: Lean Quality Assurance dan Testing](#chapter-9-lean-quality-assurance-dan-testing)
- [Chapter 10: Lean Project Management](#chapter-10-lean-project-management)
- [Studi Kasus: CEC Mobile Application](#studi-kasus-cec-mobile-application)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Pendahuluan: Mengapa Pendekatan Lean?

High-performing companies menerapkan pendekatan **lean** di setiap tahap PDLC:

```
Enterprise Architecture Management
   ↓
Strategic Analysis & Product Scope Definition
   ↓
Requirements Gathering & Documentation
   ↓
UX Design & Usability
   ↓
Technical Design & DevOps
   ↓
Quality Assurance & Testing
   ↓
Project Management
```

**Lean** dalam konteks ini bukan sekadar "murah" atau "cepat". Lean berarti **menghilangkan waste** (pemborosan) di setiap tahap, sehingga sumber daya perusahaan hanya dipakai untuk hal yang benar-benar memberi nilai.

![Lean PDLC](/image/business-analysis-pdlc.svg)

## Chapter 1: Lean Principles untuk Inovasi dan Time to Market

Buku ini membuka dengan 6 prinsip lean utama:

### 1. Customer Value

Fokus pada nilai yang benar-benar diinginkan customer, bukan apa yang menurut tim internal penting.

### 2. Value Stream

Petakan seluruh alur dari ide hingga customer menerima nilai. Identifikasi aktivitas yang menambah nilai dan yang hanya membuang waktu.

### 3. Flow

Pastikan alur kerja berjalan lancar tanpa hambatan, penundaan, atau antrian yang menumpuk.

### 4. Pull

Produksi berdasarkan permintaan nyata (just in time), bukan prediksi yang bisa salah.

### 5. Don't Be Afraid of Early Failure

> "Good judgment comes from experience. Experience comes from bad judgment." Begitu kata Dr. James Jay Horning.

Adaptif, belajar dari kegagalan di iterasi awal, dan pakai pengalaman itu untuk iterasi berikutnya. Fokus pada **kaizen** (perbaikan berkelanjutan) di semua level PDLC.

### 6. Optimize the Work Flow

Bertindak "just in time" sepanjang PDLC. Requirements analysis dan design artifacts adalah **WIP (work in process) inventories**. Buat dokumen di waktu yang tepat dengan detail yang cukup untuk mencegah **WIP-level waste**.

## Chapter 2: Lean Enterprise Architecture Management

Menurut pendekatan lean, setiap proyek di perusahaan harus mendukung strategi korporat. Objektif proyek (business requirements) harus selaras dengan strategi korporat. Jika tidak, sumber daya perusahaan mengarah ke arah yang salah, menghasilkan **project portfolio-level waste**.

### Enterprise Architecture Team

Di perusahaan besar yang membuat produk berteknologi software, grup khusus ini bekerja sama dengan eksekutif untuk:

| Tugas | Deskripsi |
|-------|-----------|
| **Memahami business strategies** | Menyelaraskan dengan visi perusahaan |
| **Evaluate business unit requests** | Menilai permintaan terhadap strategi |
| **Steer technical teams** | Mengarahkan tim membangun produk yang tepat |
| **Create flexible architecture** | Arsitektur yang melayani kebutuhan hari ini dan esok |

Enterprise architect butuh **business knowledge**, **technical skills**, dan kemampuan melihat **big picture** dengan sudut pandang bird's-eye.

### Demand Management dan Technical Debt

Antrian request yang menumpuk di **demand management pipeline** menciptakan **technical debt** yang tinggi. Meskipun sudah bekerja keras, departemen teknis sering disalahkan karena tidak bisa memenuhi ekspektasi unit bisnis. Unit bisnis mengeluh produk tidak dikirim cukup cepat.

Menariknya, **durasi proyek bersifat relatif**. Menurut teori relativitas Einstein, pengamatan tentang waktu berbeda bagi pengamat yang bergerak dengan kecepatan berbeda. Bagi tim teknis, enam bulan adalah timeframe yang menantang. Bagi unit bisnis, enam bulan terasa lama.

Jika terlambat, proyek pengembangan produk kehilangan kepentingan bagi bisnis karena kondisi pasar berubah cepat dan kompetisi ketat.

### Type-A Project

Buku ini memperkenalkan klasifikasi proyek berdasarkan dampak:

| Type | Dampak | Kebutuhan |
|------|--------|-----------|
| **Type-A** | Enterprise-level impact | Business case lengkap |
| **Type-B** | Unit-level impact | Analisis terbatas |
| **Type-C** | Minor impact | Penanganan sederhana |

Untuk **Type-A project**, business analyst bekerja dengan unit bisnis menyiapkan **business case** yang mencakup context, cost vs. benefit analysis (NPV, payback period), dan risk assessment dengan mitigation strategy.

## Chapter 3: Lean Strategic Analysis dan Product Scope Definition

Chapter ini membahas bagaimana mencegah **scope-level waste**. Unit bisnis cenderung memperbesar scope dengan meminta fitur "nice-to-have" berprioritas rendah.

> "Perfect is the enemy of good." Begitu tulis Voltaire dalam *La Begueule*.

Frasa ini mengingatkan bahwa memaksakan kesempurnaan sering berujung pada tidak ada perbaikan sama sekali. Business analyst dan project manager harus mengingatkan unit bisnis soal ini.

### Benchmarking dan Reverse Engineering

Unit bisnis juga cenderung memperbesar scope dengan **benchmarking produk kompetitor** dan meminta semua fiturnya. Meski benchmarking adalah cara cepat menentukan fitur, ini tidak selalu tepat di setiap fase lean product development.

Dalam pendekatan lean, stakeholder harus bertanya **"masalah apa dari target customer yang harus dipecahkan produk saya"** alih-alih **"apa yang sedang dilakukan kompetitor"**.

## Chapter 4: Waterfall atau Agile?

**Law of Entropy**: Segala sesuatu di alam semesta punya kecenderungan berpindah dari keadaan teratur ke tidak teratur. Ini juga berlaku untuk proyek pengembangan produk. Untuk mencegah kekacauan, tim proyek harus menerapkan metodologi.

Namun, beberapa manajer terjebak dalam **overstandardization** dan mencoba menerapkan metodologi standar yang sama ke semua proyek. Mereka bahkan memberi nama seperti "Xagile", "Waterscrum", dan "Scrumfall".

![Waterfall vs Agile](/image/business-analysis-waterfall-agile.svg)

### Kapan Waterfall Lebih Tepat?

Meski agile populer, waterfall masih lebih tepat ketika:

| Kondisi | Alasan |
|---------|--------|
| **Integrasi intensif antar komponen** | Butuh desain menyeluruh di awal |
| **Kolokasi tim tidak memungkinkan** | Komunikasi async lebih sulit |
| **Tim tidak bisa fokus satu proyek** | Perlu perencanaan ketat |
| **High employee turnover** | Risiko kehilangan know-how |

### Membuat Waterfall Lebih Iteratif

Waterfall bisa lebih iteratif dengan:

- Meningkatkan jumlah release
- Memanfaatkan prototyping dan review meeting untuk feedback awal
- Meminimalkan detail requirement document dengan diagram yang efektif
- Mendekomposisi requirements ke granularitas yang tepat

### Quantum vs. Deterministic Models

Einstein tidak percaya pada randomness (indeterminism), dengan kutipan terkenalnya: *"God doesn't play dice with the world."* Sebaliknya, model quantum Heisenberg berbasis **uncertainty principle**.

| Model | Metodologi | Cocok untuk |
|-------|-----------|-------------|
| **Deterministic (Einstein)** | Waterfall | Lingkungan bisnis relatif statis |
| **Indeterminism (Quantum)** | Agile | Lingkungan bisnis dinamis |

**Jangan jatuh ke "either/or fallacy"**. Untuk proyek dengan kondisi statis dan dinamis sekaligus, **hybrid strategy** bisa diformulasikan. Waterfall untuk fase awal merilis core features, agile untuk fase berikutnya merilis fitur medium dan low priority.

## Chapter 5: Lean Requirements Gathering

Chapter ini membahas teknik mengumpulkan requirements dengan pendekatan lean. Fokusnya pada **pemahaman masalah** sebelum melompat ke solusi.

### Teknik Analisis Masalah

> "There are no big problems; there are just a lot of little problems." Begitu kata Henry Ford.

Gunakan teknik **functional decomposition** untuk membagi masalah menjadi bagian kecil dan menyelesaikannya satu per satu. Saat perlu, manfaatkan teknik **five whys**, yaitu bertanya berulang "mengapa" untuk menemukan akar masalah.

**Five Whys** bekerja dengan mengulang pertanyaan mengapa secara iteratif sampai akar penyebab sebenarnya ditemukan. Ini teknik sederhana tapi ampuh untuk menghindari solusi yang hanya menangani gejala.

## Chapter 6: Lean Requirements Documentation

Fitur yang tidak dipakai customer setelah release adalah sumber waste yang besar. Penyebab utamanya adalah kurangnya **customer centricity** selama analisis dan desain yang berorientasi produk.

Mendefinisikan detail user requirements membantu tim lebih customer centric, dengan:

- **Use case** technique di waterfall
- **User story** technique di agile

![Use Case vs User Story](/image/business-analysis-usecase-story.svg)

### Use Case Technique

Di waterfall, use case-driven analysis mendefinisikan user requirements dalam tiga langkah:

| Langkah | Pertanyaan | Hasil |
|---------|-----------|-------|
| **1** | Who are the actors? | Target actors didefinisikan |
| **2** | What are the goals (use cases) of actors? | Use case diagram (high-level scope) |
| **3** | How will the actors achieve their goals? | Use case documents |

### Use Case vs Functional Requirement

Sering ada kebingungan membedakan keduanya. Sebenarnya sederhana:

> **Setiap use case merepresentasikan tujuan (goal) tertentu dari actor, sedangkan aktivitas untuk mencapai tujuan itu adalah functional requirements.**

**Analogi botol air**:
- Jika botol dianggap produk, **"minum air"** adalah use case (tujuan actor)
- **"Membuka tutup botol"** bukan use case, karena bukan tujuan actor
- Orang tidak membeli botol untuk membuka-menutup tutupnya. Membuka tutup hanya functional requirement untuk mencapai tujuan "minum air"

### Business Use Case vs System Use Case

Buku ini membedakan dua level use case:

| Jenis | Fokus | Audiens |
|-------|-------|---------|
| **Business use case** | Proses bisnis tingkat tinggi | Stakeholder bisnis |
| **System use case** | Interaksi dengan sistem | Tim teknis |

### Best Practice Use Case Documentation

- Scenario pada use case document menjelaskan aktivitas actor saat mencapai tujuan
- Setiap scenario step (aktivitas) berkorespondensi dengan satu functional requirement
- Dokumentasi harus jelas, ringkas, dan bebas ambiguitas

## Chapter 7: Lean UX Design dan Usability

Pendekatan **lean UX design** harus berpusat pada user (user centered) dan iteratif untuk memastikan usability produk baru.

### Sejarah Human-Centered Design

Buku ini memberi contoh historis yang menarik:

| Tokoh | Kontribusi |
|-------|-----------|
| **Frank Lloyd Wright** | "Organic style" dalam arsitektur, menyatukan bangunan dengan lingkungannya |
| **Steve Jobs** | Menempatkan user di pusat analisis dan desain, menciptakan produk consumer electronics paling usable |

Jobs berhasil menciptakan **natural-born users**. Bahkan anak-anak bisa memakai perangkat mobile dengan gesture yang mirip gerakan alami mereka.

### Langkah Lean UX Design

![Lean UX Process](/image/business-analysis-ux.svg)

#### A. Identify User Profiles

*"Designing for everybody"* bukan strategi yang efektif untuk usability. Interface produk usable jika cocok dengan usernya. Profiling bisa dilakukan berdasarkan karakteristik:

| Karakteristik | Contoh |
|---------------|--------|
| **Age** | Anak, remaja, dewasa, lansia |
| **Gender** | Perbedaan preferensi |
| **Education** | Tingkat literasi |
| **Technical expertise** | Beginner, intermediate, expert |

#### B. Persona dan Empathy Map

**Persona** adalah representasi fiktif dari target user berdasarkan riset. **Empathy map** membantu memahami apa yang user pikirkan, rasakan, lihat, dan dengar.

#### C. Card Sorting

Card sorting digunakan untuk mengategorikan konten. Item konten ditulis di kartu, lalu user yang merepresentasikan persona diminta mengelompokkannya. Teknik ini membantu menentukan struktur kategori produk.

#### D. Interaction Design

Interaction design mendefinisikan bagaimana user berinteraksi dengan produk untuk mencapai tujuannya. Berbasis pada use case dan flow chart yang sudah dibuat.

#### E. User Interface Design

UX designer mengonversi interaction design dan information architecture menjadi user interface dengan menerapkan prinsip UX design dan usability.

> **Bahkan designer paling berpengalaman tidak bisa menghasilkan desain optimal pada percobaan pertama. Desain yang baik adalah hasil dari beberapa iterasi.**

Iterasi adalah siklus: melakukan sesuatu, mengujinya, memperbaikinya, dan menguji ulang. Melakukan iterasi pada produk final sangat mahal. Setiap iterasi memaksa komponen teknis diubah dan diuji ulang, sedangkan mengubah **prototype** jauh lebih mudah dan cepat.

#### Prototype sebagai WIP

Dalam pendekatan lean, prototype juga dianggap **work-in-process inventory**. Jadi alih-alih membuat mockup setiap user interface dan menciptakan waste, UX designer sebaiknya hanya membuat prototype untuk fitur **high-priority yang paling sering digunakan**.

### Konten User Interface: Concise dan Useful

Konten di user interface harus punya dua atribut utama:

**1. Concise**
- Statement yang singkat dan to the point
- Tidak menyisakan ruang untuk misinterpretasi
- Konten sederhana dengan kata sesedikit mungkin

> "I didn't have time to write a short letter, so I wrote a long one instead." Begitu kata Mark Twain.

**2. Useful**
- Konten harus menghilangkan friction antara produk dan user
- User interface harus berbicara dengan bahasa user, bukan bahasa tim teknis

## Chapter 8: Lean Technical Design dan DevOps

Chapter ini membahas sisi teknis: bagaimana technical design dan DevOps mendukung pendekatan lean.

### Technical Design

Technical design menerjemahkan requirements dan UX design menjadi arsitektur teknis. Prinsipnya adalah **flexible architecture** yang bisa melayani kebutuhan hari ini dan esok, sesuai pesan di Chapter 2.

### DevOps dan Continuous Delivery

DevOps memperpendek jarak antara development dan operations, memungkinkan:

| Praktik | Manfaat |
|---------|---------|
| **Continuous Integration** | Deteksi masalah lebih awal |
| **Continuous Delivery** | Release lebih cepat dan sering |
| **Infrastructure as Code** | Lingkungan konsisten dan reproducible |
| **Monitoring & Feedback** | Belajar dari production |

DevOps sejalan dengan prinsip lean: mempercepat flow, mengurangi waste, dan memungkinkan feedback loop yang pendek.

## Chapter 9: Lean Quality Assurance dan Testing

QA dan testing punya peran kritis dalam lean: menemukan defect sedini mungkin agar biaya perbaikan rendah.

### Automation dan Risiko

Otomatisasi testing punya trade-off. Di beberapa proyek yang salah menerapkan automation, hasilnya adalah situasi aneh: **coding around bugs** alih-alih menemukan dan memperbaikinya. Project manager dan QA manager harus mempertimbangkan ini sebagai project risk dan memitigasinya dengan menentukan **level test automation yang tepat**.

Tanpa pengetahuan tentang test methods dan techniques, automation hanya akan membawa masalah tambahan, bukan manfaat.

### Shelfware

Fenomena modern: **shelfware** adalah automation software yang duduk di rak perusahaan tanpa dipakai siapa pun. Ini waste nyata yang harus dihindari.

### UAT sebagai Filter Terakhir

> **UAT (user acceptance test) adalah titik filtering terakhir untuk defects.**

Meskipun ada tim QA terpisah, business analyst harus bertanggung jawab mengoordinasikan dan memandu unit bisnis selama UAT. UAT adalah tahap final untuk memvalidasi requirements dan memastikan pemenuhan kebutuhan bisnis dari produk baru.

Jika UAT tidak dilakukan dengan benar, defect bisa lolos ke production dan merusak nilai produk di mata customer.

## Chapter 10: Lean Project Management

### Product Scope vs Project Scope

Buku ini menegaskan pembagian tanggung jawab yang jelas:

| Peran | Tanggung Jawab |
|-------|----------------|
| **Project manager** | Project scope management |
| **Business analyst** | Product scope management |

**Product scope** = fitur produk untuk memenuhi business dan user requirements
**Project scope** = pekerjaan yang perlu diselesaikan untuk membangun dan merilis produk dengan fitur tersebut

Untuk mendefinisikan project scope dengan benar, project manager harus membantu business analyst mendefinisikan product scope yang jelas dan benar, selaras dengan business dan user requirements. Jika tidak, sumber daya mengarah ke arah salah, menghasilkan **project-level waste**.

### Output Trap

Tekanan memenuhi target waktu dan budget bisa membuat project manager fokus pada **outputs** (deliverables) daripada **outcomes** (value).

> **Jika requirements tidak terpenuhi, proyek tidak akan sukses meski selesai tepat waktu dan sesuai budget.**

Ini adalah **output trap**: terjebak mengejar output dan lupa pada outcome yang bernilai.

Untuk mencegahnya, project manager harus selalu berkolaborasi dengan business analyst untuk memastikan value creation di setiap langkah. Mereka harus menjaga semua stakeholder tetap terhubung sepanjang PDLC.

### Ke Gemba

**Gemba** adalah istilah lean Jepang untuk "tempat sebenarnya". Dalam lean, project manager harus pergi ke gemba dan melakukan **high bandwidth communication** dengan stakeholder dan customer sepanjang PDLC.

Masalahnya, beberapa project manager menghabiskan sebagian besar waktu di **PMO (project management office)** alih-alih menghadiri requirements-gathering meeting, mereview requirement document, dan berpartisipasi di testing session.

### Whole Optimization vs Suboptimization

Lean approach bertujuan menghilangkan checks and balances yang berlebihan antar stakeholder dan memastikan kolaborasi. Meski **segregation of duties** penting untuk akuntabilitas, ini tidak boleh menghasilkan **silos**.

Silos biasanya terbentuk karena micromanagement terhadap tim terpisah seperti business analyst, designer, developer, dan QA specialist. Micromanagement menghasilkan **suboptimization** dari objektif setiap grup dengan KPI berorientasi output, seperti jumlah requirements yang didokumentasikan atau jumlah defect.

Yang dibutuhkan adalah **whole optimization**: mengoptimalkan keseluruhan alur nilai, bukan setiap bagian secara terpisah.

## Studi Kasus: CEC Mobile Application

Buku ini menggunakan studi kasus nyata: **CEC (Consumer Electronics Company)** yang ingin membuat **mobile sales channel**.

### Latar Belakang

Unit bisnis marketing mengajukan request untuk produk mobile. Tim business analyst menandai ini sebagai **Type-A project** (enterprise-level impact pada sales channel). Mereka terkejut karena unit marketing berencana merilisnya hanya dua bulan kemudian.

### Business Case

Karena Type-A, analyst bekerja dengan unit marketing menyiapkan business case:

| Komponen | Isi |
|----------|-----|
| **Context** | Integrasi dengan ERP, CRM, CMS, Dealer Management System |
| **Cost vs Benefit** | NPV positif, payback <3 tahun |
| **Risk Assessment** | Risiko dan strategi mitigasi |

### Pendekatan Hybrid

Tim menerapkan **hybrid methodology**:

| Fase | Durasi | Metodologi | Fokus |
|------|--------|-----------|-------|
| **Fase 1** | 2 bulan | Waterfall | High-priority features, core version |
| **Fase 2** | Setelahnya | Agile | Medium & low-priority features |

Fase 1 hanya mencakup use case **"View and Order a Product"** dan **"Compare Products"**.

### Hasil

Pendekatan lean yang customer-centered dan iteratif membantu CEC memenuhi semua tujuan:

- **Differentiate** dengan mobile channel lebih awal dari kompetitor
- **Innovative** dalam menciptakan mobile sales channel yang digerakkan kebutuhan customer
- **Prevent waste** dengan hanya berinvestasi pada fitur yang benar-benar perlu
- **Improve scale** yang sebelumnya terbatas pada jumlah dan visibilitas dealer
- **Satisfy** marketing business unit dengan rilis produk mobile
- **Aware of risks early** dan memitigasinya cepat

Proyek selesai tepat waktu dengan kepuasan tinggi dari semua stakeholder. Upper management menyadari manfaat pendekatan lean dan memutuskan menerapkannya ke semua proyek lain.

## Kesimpulan

*Business Analysis Methodology Book* merangkum pendekatan lean di seluruh PDLC:

1. **Lean principles**: customer value, value stream, flow, pull, early failure, optimize flow
2. **Enterprise architecture**: selaraskan proyek dengan strategi korporat, kelola demand dan technical debt
3. **Strategic analysis**: cegah scope creep, jangan benchmarking buta
4. **Waterfall vs Agile**: pilih sesuai konteks, jangan either/or fallacy
5. **Requirements gathering**: five whys, functional decomposition
6. **Requirements documentation**: use case (waterfall) dan user story (agile)
7. **Lean UX**: persona, card sorting, prototyping, konten concise dan useful
8. **DevOps**: CI/CD, feedback loop pendek
9. **QA**: automation dengan level tepat, hindari shelfware, UAT sebagai filter terakhir
10. **Project management**: product scope vs project scope, hindari output trap, ke gemba, whole optimization

Kunci utamanya: **business analyst adalah jembatan antara kebutuhan bisnis, user, dan solusi teknis**. Dengan pendekatan lean, waste di setiap tahap bisa dikurangi, dan produk yang benar-benar bernilai bisa dikirim lebih cepat.

## FAQ

### Apa bedanya product scope dan project scope?

**Product scope** adalah fitur produk yang memenuhi business dan user requirements, dikelola oleh business analyst. **Project scope** adalah pekerjaan untuk membangun dan merilis produk dengan fitur tersebut, dikelola oleh project manager. Product scope harus didefinisikan lebih dulu sebagai input project scope.

### Kapan sebaiknya pakai waterfall, kapan agile?

Gunakan **waterfall** ketika produk punya integrasi intensif antar komponen, kolokasi tim tidak memungkinkan, tim tidak bisa fokus satu proyek, atau ada risiko high turnover. Gunakan **agile** untuk lingkungan bisnis dinamis. Untuk kondisi campuran, **hybrid** adalah pilihan paling realistis.

### Apa itu output trap dalam project management?

Output trap adalah jebakan di mana project manager terlalu fokus pada output (deliverables) daripada outcome (value). Jika requirements tidak terpenuhi, proyek tidak sukses meski tepat waktu dan sesuai budget. Solusinya: kolaborasi dengan business analyst dan fokus pada value creation.

### Apa perbedaan use case dan functional requirement?

**Use case** merepresentasikan tujuan (goal) tertentu dari actor. **Functional requirement** adalah aktivitas untuk mencapai tujuan tersebut. Analogi botol: "minum air" adalah use case, "membuka tutup botol" adalah functional requirement.

### Apa itu gemba dan mengapa penting?

**Gemba** adalah istilah lean Jepang untuk "tempat sebenarnya" di mana nilai diciptakan. Project manager harus pergi ke gemba (menghadiri meeting, mereview dokumen, ikut testing) alih-alih hanya duduk di PMO, agar komunikasi dengan stakeholder berkualitas tinggi.

### Bagaimana cara mencegah scope creep?

Fokus pada pertanyaan "masalah apa dari target customer yang harus dipecahkan" alih-alih "apa yang dilakukan kompetitor". Ingat prinsip Voltaire: "perfect is the enemy of good". Untuk Type-A project, gunakan business case dengan cost-benefit analysis dan risk assessment formal.

## Referensi

- Yayici, E. (2015). *Business Analysis Methodology Book: Business Analyst's Guide to Requirements Analysis, Lean UX Design and Project Management at Lean Enterprises and Lean Startups*. Emrah Yayici.
- Yayici, E. *Business Analyst's Mentor Book*.
- Yayici, E. *UX Design and Usability Mentor Book*.
- [IIBA (International Institute of Business Analysis)](https://www.iiba.org/)
- [UXPA (User Experience Professionals Association)](https://uxpa.org/)
