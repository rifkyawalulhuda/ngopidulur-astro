---
title: "Mobile Architecture: Rich vs Thin Client, Layers, Design Principles"
description: Panduan arsitektur aplikasi mobile dari Microsoft patterns and
  practices - rich thin RIA client, layered architecture, separation of concerns,
  design principles, performance security, deployment, key patterns.
pubDate: 2026-10-22T08:00:00.000Z
image: /image/mobile-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Mobile
  - Architecture
  - DesignPatterns
  - Microsoft
series: "Mobile Architecture Pocket Guide"
seriesOrder: 1
---

*Mobile Application Architecture Pocket Guide* (Microsoft patterns & practices, v1.1) adalah panduan ringkas untuk **solusi arsitek dan development leads** yang membangun aplikasi mobile di platform .NET. Buku ini fokus pada partitioning fungsionalitas aplikasi ke layers, components, dan services — dengan guidance task-based per chapter.

## Daftar Isi

- [Tujuan dan Audiens](#tujuan-dan-audiens)
- [Tiga Tipe Client Mobile](#tiga-tipe-client-mobile)
- [Rich Client vs Thin Client vs RIA](#rich-client-vs-thin-client-vs-ria)
- [Arsitektur Layered Mobile](#arsitektur-layered-mobile)
- [Key Design Principles](#key-design-principles)
- [Separation of Concerns](#separation-of-concerns)
- [Single Responsibility Principle](#single-responsibility-principle)
- [Design Considerations Mobile](#design-considerations-mobile)
- [Performance Considerations](#performance-considerations)
- [Security Considerations](#security-considerations)
- [Deployment Considerations](#deployment-considerations)
- [Key Patterns](#key-patterns)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Tujuan dan Audiens

Pocket Guide ini bertujuan **meningkatkan efektivitas** saat membangun aplikasi mobile di platform Microsoft. Audiens utama: **solution architects dan development leads**.

Fokusnya:
- **Partitioning** fungsionalitas aplikasi ke layers, components, dan services
- **Design-level guidance** untuk arsitektur aplikasi mobile .NET
- **Task-based** — chapters sesuai major architecture focus points
- Bisa dipakai sebagai **referensi** atau dibaca dari awal sampai akhir

## Tiga Tipe Client Mobile

![Mobile Architecture — Cover](/image/mobile-architecture-cover.svg)

Saat mengembangkan aplikasi mobile, pilih salah satu dari tiga tipe client:

| Tipe | Lokasi Logic | Koneksi | Contoh |
|------|--------------|---------|--------|
| **Rich Client** | Business + data di device | Occasional | Aplikasi native |
| **Thin Client (Web)** | Business + data di server | Selalu online | Mobile web |
| **RIA** (Rich Internet App) | Hybrid | Variabel | Silverlight, Flash |

## Rich Client vs Thin Client vs RIA

### Rich Client

- **Business dan data services layers di device** itu sendiri
- Butuh **local processing** dan bekerja **occasionally connected** (offline)
- **Kelebihan**: responsif, offline-capable, akses resource lokal
- **Kekurangan**: lebih kompleks install dan maintain; update harus dikelola

### Thin Client (Web-based)

- Business dan data layers **di server**
- Bergantung pada **server processing** dan **selalu fully connected**
- **Kelebihan**: mudah deploy, update terpusat
- **Kekurangan**: butuh koneksi; UX terbatas

### Rich Internet Application (RIA)

- Butuh **rich UI**, akses terbatas ke resource lokal, dan **portable lintas platform**
- **Kelebihan**: UX kaya, portability
- **Kekurangan**: plug-in/browser dependency

### Faktor Keputusan

1. **Local processing** dibutuhkan? → rich client
2. **Selalu online**? → thin client
3. **Rich UI + portability**? → RIA
4. **Occasionally connected** (sinkronisasi)? → rich client dengan sync

## Arsitektur Layered Mobile

![Layered Mobile Application Architecture](/image/mobile-layered-architecture.svg)

Aplikasi mobile normalnya terstruktur **multi-layered**:

### Di Device (Rich Client)

1. **Presentation Layer** — UI, user interaction
2. **Business Layer** — business logic, validation
3. **Data Layer** — data access, local storage

### Di Server

4. **Service Layer** — service interfaces, translators
5. **Business Layer (server)** — shared business rules
6. **Data Layer (server)** — repositories, databases

### Cross-cutting Concerns

Berlaku di semua layer:
- **Security** — autentikasi, otorisasi, data protection
- **Caching** — performa
- **Exception management** — error handling konsisten
- **Logging** — audit dan diagnosa
- **Validation** — integritas data

## Key Design Principles

### Separation of Concerns

**Pecah aplikasi ke fitur-fitur distinct** yang overlap fungsionalitasnya seminimal mungkin:

- Setiap layer punya tanggung jawab spesifik
- Perubahan di satu area tidak merembet ke area lain
- Memudahkan testing dan maintenance

### Single Responsibility Principle

**Setiap komponen atau modul bertanggung jawab hanya pada satu fitur spesifik:**

- Komponen fokus dan mudah dipahami
- Perubahan motivasi tunggal
- Mengurangi risiko regresi

### Prinsip Lain dalam Arsitektur

- **DRY (Don't Repeat Yourself)** — hindari duplikasi
- **YAGNI (You Ain't Gonna Need It)** — jangan bangun yang tidak dibutuhkan
- **Loose coupling** — komponen saling tahu seminimal mungkin
- **High cohesion** — komponen terkait dikelompokkan

## Design Considerations Mobile

### Komponen Mobile Application

- **User experience layer** — tampilan dan interaksi
- **Business layer** — logika aplikasi
- **Data layer** — penyimpanan dan akses data
- **Service layer** (jika ada) — komunikasi server

### Scenario Kunci Mobile

- **Deployment** — distribusi aplikasi ke device
- **Power usage** — efisiensi baterai
- **Synchronization** — sinkronisasi data offline/online
- **Connectivity** — jaringan tidak stabil
- **Screen constraints** — ukuran layar terbatas
- **Resource constraints** — memori dan CPU terbatas

## Performance Considerations

Mobile punya **keterbatasan hardware** — performa penting:

- **Minimalkan round-trips** ke server
- **Cache data** lokal (data yang jarang berubah)
- **Compression** data transfer
- **Background processing** untuk tugas berat
- **Efficient data binding** — jangan render berlebihan
- **Monitor memory** — device punya RAM terbatas
- **Lazy loading** — muat data saat dibutuhkan

## Security Considerations

### Autentikasi

- **Device authentication** — perangkat yang dikenal
- **User authentication** — user login
- **Certificate-based** — sertifikat untuk device

### Data Protection

- **Enkripsi data at-rest** — data lokal dienkripsi
- **Enkripsi data in-transit** — TLS untuk komunikasi
- **Secure storage** — key dan secret di protected storage

### Risiko Mobile

- Device hilang/curi → data lokal aman (enkripsi)
- Aplikasi reverse-engineered → jangan simpan secret di client
- Network interception → TLS
- **Mobile device management (MDM)** — kontrol device enterprise

## Deployment Considerations

### Deployment Mobile

- **App store** — distribusi publik
- **Enterprise deployment** — MDM, sideloading
- **Update strategy** — versioning, forced update
- **Backward compatibility** — device lama

### Deployment Server

- **Cloud** — scalable, on-demand
- **On-premises** — kontrol penuh
- **Hybrid** — kombinasi

## Key Patterns

Pocket guide merujuk pola-pola arsitektur:

- **Layered Architecture** — pemisahan per layer
- **Service Locator / DI** — resolusi dependency
- **Repository** — abstraksi data access
- **Unit of Work** — transaksi konsisten
- **Model-View-ViewModel (MVVM)** — pattern UI mobile
- **Observer** — update UI saat data berubah
- **Singleton** — resource bersama (connection, cache)
- **Façade** — antarmuka sederhana ke subsystem kompleks

## Kesimpulan

Chapter 1-2 membangun fondasi: pilih tipe client yang tepat (rich, thin, RIA), pahami arsitektur layered dengan cross-cutting concerns, terapkan design principles (separation of concerns, SRP), dan pertimbangkan faktor mobile spesifik — performa, security, deployment.

Di artikel berikutnya: **Presentation, Business, dan Data Layer Guidelines** (Chapter 3-5).

## Referensi

- Microsoft patterns & practices. (2010). *Mobile Application Architecture Pocket Guide* (v1.1). Microsoft.
- Microsoft Application Architecture Guide. (2009). *Design Principles*. Microsoft patterns & practices.
- Evans, E. (2003). *Domain-Driven Design*. Addison-Wesley.
- Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns*. Addison-Wesley.
