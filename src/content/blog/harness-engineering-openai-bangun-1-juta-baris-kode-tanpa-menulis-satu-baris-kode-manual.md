---
title: "Harness Engineering: OpenAI Bangun 1 Juta Baris Kode Tanpa Menulis Satu
  Baris Kode Manual"
description: Bagaimana tim OpenAI mengubah peran engineer menjadi “pengarah
  agen” dan membangun produk besar hanya dengan Codex dalam waktu 1/10 normal.
pubDate: 2026-05-21T22:17:00.000Z
image: /image/0b98da10-d663-4e14-a2ff-6ffc6168a0e1.webp
draft: false
categories:
  - Teknologi
tags:
  - ai-engineering
  - ai
  - codex
  - open-ai
  - gpt
---
### Era Baru Rekayasa Perangkat Lunak Telah Tiba

Bayangkan ini: sebuah tim kecil hanya **7 orang** berhasil membangun produk software berukuran **1 juta baris kode** dalam waktu lima bulan — **tanpa menulis satu baris kode pun secara manual**.

Semua kode, mulai dari logika aplikasi, tes otomatis, konfigurasi CI/CD, dokumentasi, hingga tooling internal, ditulis sepenuhnya oleh **Codex**, agen coding AI dari OpenAI.

Ini bukan sekadar eksperimen kecil. Produk tersebut sudah digunakan ratusan pengguna internal setiap hari dan telah melewati tahap alpha testing eksternal. Ia dirilis, di-deploy, rusak, diperbaiki, dan terus berkembang.

OpenAI menyebut pendekatan ini sebagai **“Harness Engineering”** — seni merancang sistem, aturan, dan infrastruktur agar agen AI bisa bekerja secara mandiri dan andal dalam skala besar.

Artikel ini akan membahas secara lengkap apa yang mereka pelajari, tantangan yang dihadapi, dan pelajaran penting bagi developer Indonesia yang ingin mengikuti jejak ini.

* * *

### 1\. Dimulai dari Repositori Git yang Benar-Benar Kosong

Pada akhir Agustus 2025, tim memulai dengan repositori kosong.

Scaffold awal (struktur folder, konfigurasi CI, aturan formatting, package manager, dan framework aplikasi) dibuat oleh Codex CLI menggunakan GPT-5. Bahkan file AGENTS.md yang menjadi “panduan kerja” bagi agen juga ditulis oleh Codex sendiri.

Tidak ada kode manusia sama sekali sejak commit pertama.

Lima bulan kemudian, repositori telah berisi sekitar **1 juta baris kode** dan lebih dari **1.500 pull request** berhasil digabungkan. Rata-rata throughput mencapai **3,5 PR per engineer per hari** — dan angka ini justru meningkat seiring bertambahnya tim.

**Filosofi inti tim:** **“No manually-written code.”** Manusia tidak boleh menulis kode. Titik.

* * *

### 2\. Peran Engineer Berubah Total

Dengan tidak adanya coding manual, peran engineer berubah drastis.

Tugas utama bukan lagi menulis kode, melainkan:

*   Merancang lingkungan kerja yang memungkinkan agen bekerja efektif

*   Menentukan tujuan tingkat tinggi (intent)

*   Membangun sistem umpan balik (feedback loop)

*   Membuat segala sesuatu **terbaca dan dapat ditegakkan** oleh agen

Ketika ada masalah, engineer tidak langsung “memperbaiki kode”. Mereka bertanya: **“Kapabilitas apa yang kurang? Bagaimana kita membuatnya jelas bagi agen?”**

Manusia bekerja hampir 100% melalui **prompt**. Mereka mendeskripsikan tugas, menjalankan agen, lalu membiarkan agen membuka pull request, mereview sendiri, dan mengulang hingga selesai.

* * *

### 3\. Meningkatkan “Keterbacaan” Aplikasi untuk Agen

Salah satu bottleneck terbesar adalah kapasitas QA manusia. Karena waktu manusia terbatas, tim OpenAI membuat aplikasi, log, dan metrik **langsung bisa dibaca dan dipahami oleh Codex**.

Beberapa langkah yang dilakukan:

*   Aplikasi bisa dijalankan per git worktree (isolasi sempurna)

*   Integrasi Chrome DevTools Protocol → agen bisa mengambil screenshot, snapshot DOM, dan menavigasi UI

*   Observabilitas penuh (log + metrik) diekspos ke agen melalui LogQL dan PromQL

*   Agen bisa bekerja sendirian hingga **6 jam** tanpa intervensi manusia

Hasilnya: agen tidak hanya menulis kode, tetapi juga bisa **mereproduksi bug, memvalidasi perbaikan, dan bahkan merekam video demonstrasi**.

* * *

### 4\. Pengetahuan Repositori Jadi “Sistem Catatan Utama”

Salah satu pelajaran paling penting:

> **“Berikan Codex peta, bukan buku panduan 1.000 halaman.”**

Mereka pernah mencoba file AGENTS.md yang sangat besar. Gagal total. File itu justru membingungkan agen, cepat usang, dan sulit diverifikasi.

**Solusi yang mereka terapkan:**

*   AGENTS.md hanya berisi ~100 baris sebagai **daftar isi**

*   Semua pengetahuan mendalam disimpan di folder docs/ yang terstruktur rapi

*   Ada dokumen arsitektur, core beliefs, quality score, reliability, security, dan execution plans

*   Semua rencana (plans) diperlakukan sebagai artefak resmi yang versi-controlled

Mereka juga menjalankan agen “doc-gardening” secara rutin untuk membersihkan dokumentasi usang.

* * *

### 5\. Arsitektur yang Ketat = Kecepatan Tanpa Kekacauan

Karena codebase 100% dihasilkan agen, mereka membangun **arsitektur yang sangat ketat** sejak awal:

*   Setiap domain bisnis dibagi menjadi lapisan tetap (Types → Config → Repo → Service → Runtime → UI)

*   Dependensi hanya boleh mengalir ke satu arah

*   Cross-cutting concerns (auth, telemetry, feature flags) masuk melalui interface tunggal

*   Semua aturan ditegakkan oleh **linter custom** yang dibuat Codex sendiri

Mereka menyebutnya **“taste invariants”** — aturan rasa dan kualitas yang ditegakkan secara otomatis.

Dengan agen, aturan ketat justru menjadi **pengganda kekuatan**, bukan penghambat.

* * *

### 6\. Otonomi Agen yang Semakin Tinggi

Baru-baru ini, Codex di repositori ini mencapai level otonomi yang mengesankan. Hanya dengan **satu prompt**, agen sekarang bisa:

3.  Memvalidasi kondisi codebase

6.  Mereproduksi bug + merekam video

9.  Menulis perbaikan

12.  Memvalidasi perbaikan dengan menjalankan aplikasi

15.  Merekam video hasil perbaikan

18.  Membuka pull request

21.  Merespons feedback

24.  Memperbaiki build failure

27.  Menggabungkan perubahan sendiri

Hanya ketika butuh judgment manusia, agen akan mengeskalasi.

* * *

### 7\. Masalah Baru: “AI Slop” dan Garbage Collection

Otonomi tinggi membawa masalah baru: agen cenderung mereplikasi pola yang sudah ada — termasuk pola buruk.

Awalnya tim menghabiskan setiap Jumat untuk membersihkan “AI slop”. Tidak sustainable.

**Solusi:** Mereka membuat **“Golden Principles”** dan proses garbage collection otomatis. Agen latar belakang secara rutin memindai penyimpangan, memperbarui kualitas kode, dan membuka PR refactoring yang ditargetkan.

Technical debt dibayar secara terus-menerus dalam jumlah kecil, bukan ditumpuk lalu dibersihkan sekaligus.

* * *

### Kesimpulan & Pelajaran Utama

OpenAI sudah membuktikan bahwa **masa depan software engineering bukan tentang menulis kode lebih cepat**, melainkan tentang **merancang sistem yang membuat agen AI bisa bekerja secara mandiri dan berkualitas tinggi**.

**Beberapa takeaways penting:**

*   **Manusia bukan lagi penulis kode**, melainkan **perancang lingkungan dan aturan**.

*   **Keterbacaan untuk agen** sama pentingnya dengan keterbacaan untuk manusia.

*   **Arsitektur ketat + dokumentasi terstruktur** adalah prasyarat kecepatan, bukan penghalang.

*   **Garbage collection otomatis** untuk AI-generated code menjadi kebutuhan wajib.

*   Disiplin tetap diperlukan — hanya saja sekarang disiplin itu diterapkan di **scaffolding**, bukan di setiap baris kode.

* * *

### Apa Artinya Ini untuk Developer Indonesia?

Bagi developer, startup, dan perusahaan teknologi di Indonesia, pesan ini sangat relevan:

3.  **Mulai sekarang**, biasakan menulis kode yang “agent-friendly” (terstruktur, terdokumentasi, dan memiliki batas yang jelas).

6.  **Investasikan waktu** untuk membangun harness (tools, linter, dokumentasi, dan feedback loop) — ini akan memberikan leverage jauh lebih besar di masa depan.

9.  **Jangan takut** dengan aturan ketat. Justru aturan yang jelas memungkinkan agen (dan tim) bergerak lebih cepat.

Siapa tahu, dalam 1–2 tahun ke depan, banyak produk Indonesia juga akan dibangun dengan pendekatan serupa.

* * *

**Sumber Asli:** [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) Oleh Ryan Lopopolo (OpenAI) – 11 Februari 2026
