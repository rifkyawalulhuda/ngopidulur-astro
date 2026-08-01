---
title: "Mobile Layers: Presentation, Business, dan Data Access Guidelines"
description: Panduan layer aplikasi mobile dari Microsoft patterns and practices -
  presentation layer components, business layer application facade, data access
  logic, service agents, security caching validation, common issues.
pubDate: 2026-10-23T08:00:00.000Z
image: /image/mobile-architecture-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Mobile
  - Architecture
  - Layered
  - DataAccess
series: "Mobile Architecture Pocket Guide"
seriesOrder: 2
---

Chapter 3-5 dari *Mobile Application Architecture Pocket Guide* (Microsoft patterns & practices) memberikan guidelines detail untuk tiga layer utama: **Presentation** (Ch3), **Business** (Ch4), dan **Data Access** (Ch5) — termasuk komponen, langkah desain, masalah umum, dan pola.

## Daftar Isi

- [Presentation Layer Overview](#presentation-layer-overview)
- [Komponen Presentation Layer](#komponen-presentation-layer)
- [Desain Presentation Layer](#desain-presentation-layer)
- [Masalah Umum Presentation](#masalah-umum-presentation)
- [Pola Presentation: MVVM dan Observer](#pola-presentation-mvvm-dan-observer)
- [Business Layer Overview](#business-layer-overview)
- [Komponen Business Layer](#komponen-business-layer)
- [Application Facade](#application-facade)
- [Desain Business Layer](#desain-business-layer)
- [Masalah Umum Business Layer](#masalah-umum-business-layer)
- [Security dan Caching di Business Layer](#security-dan-caching-di-business-layer)
- [Exception Management dan Logging](#exception-management-dan-logging)
- [Data Access Layer Overview](#data-access-layer-overview)
- [Komponen Data Layer](#komponen-data-layer)
- [Data Access Logic Components](#data-access-logic-components)
- [Data Helpers dan Service Agents](#data-helpers-dan-service-agents)
- [Masalah Umum Data Layer](#masalah-umum-data-layer)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Presentation Layer Overview

**Presentation layer** berisi komponen yang mengimplementasikan dan menampilkan **user interface** serta mengelola interaksi user:

- Kontrol untuk input dan display user
- Komponen yang mengorganisir interaksi user
- Menampilkan dan memformat data untuk user
- Memvalidasi data input user

## Komponen Presentation Layer

### UI Components

Komponen yang menyediakan cara user berinteraksi dengan aplikasi:

- **Render dan format data** untuk ditampilkan
- **Mengakuisisi dan memvalidasi** input user
- Kontrol UI: forms, lists, buttons, dialogs

### User Process Components

Komponen yang **mensinkronkan dan mengorkestrasi interaksi user**:

- Berguna jika UI kompleks
- Menerapkan **common user interaction patterns** sebagai komponen terpisah — bisa di-reuse di banyak UI
- Contoh: wizard flow, multi-step form, navigation logic

## Desain Presentation Layer

### Langkah-langkah

1. **Identifikasi user requirements** — apa yang user butuhkan dan lihat
2. **Pilih tipe UI** — native controls, custom controls, data-bound controls
3. **Desain user interaction flow** — bagaimana user menavigasi
4. **Desain data binding** — bagaimana UI terhubung data
5. **Handle validation** — client-side dan server-side
6. **Test UX** — usability dan performa

### Pertimbangan Mobile

- **Small screen** — desain kompak, prioritas konten
- **Touch targets** — ukuran elemen cukup besar
- **Offline states** — UI harus informatif saat offline
- **Performance** — render cepat, smooth scrolling

## Masalah Umum Presentation

- **Tight coupling** antara UI dan business logic → gunakan MVVM
- **Code-behind berlebihan** — logika menumpuk di event handlers
- **Validasi hanya di client** — harus ada juga di server/business
- **Data binding tidak efisien** — render ulang berlebihan
- **Ignoring state** — aplikasi mobile harus handle state lifecycle (background, resume)
- **Resource leaks** — listener dan timer tidak di-cleanup

## Pola Presentation: MVVM dan Observer

### Model-View-ViewModel (MVVM)

Pola dominan untuk aplikasi mobile:

```
View (UI) ←→ ViewModel (state + commands) ←→ Model (data)
```

- **View** — UI markup, binding ke ViewModel
- **ViewModel** — state UI, commands, logika presentasi; tidak tahu View
- **Model** — data dan business logic

```csharp
public class TaskViewModel : INotifyPropertyChanged
{
    private string _text;
    public string Text
    {
        get { return _text; }
        set
        {
            _text = value;
            OnPropertyChanged("Text");
        }
    }

    public ICommand SaveCommand { get; private set; }
}
```

### Observer Pattern

- ViewModel mengimplementasikan **INotifyPropertyChanged**
- View **subscribe** perubahan — update otomatis
- Decoupled: View dan ViewModel tidak saling referensikan langsung

## Business Layer Overview

**Business layer** mengimplementasikan logika bisnis aplikasi:

- **Business rules** dan validasi
- **Workflow** dan orchestrasi
- Security, caching, exception management, logging, validation

![Layered Mobile Application Architecture](/image/mobile-layered-architecture.svg)

## Komponen Business Layer

### Application Facade (opsional)

**Application facade** menggabungkan **banyak business operations** menjadi satu message-based operation:

- Menyederhanakan client — satu panggilan, banyak operasi
- Mengurangi round-trips
- Menyembunyikan kompleksitas internal
- Cocok untuk operasi yang selalu berjalan bersama

### Business Components

- Implementasi **business rules** spesifik domain
- Validasi business data
- Orchestrasi akses data
- Unit kerja yang kohesif

### Business Entities

- Objek yang mewakili **data domain**
- DTO (Data Transfer Objects) untuk transfer antar layer
- POCO (Plain Old CLR Objects) — tanpa dependency framework

### Service Interfaces (jika business layer di server)

- Kontrak service yang diekspos
- Memisahkan implementasi dari kontrak

## Application Facade

```csharp
public class OrderFacade
{
    public OrderResult PlaceOrder(OrderRequest request)
    {
        // Satu panggilan = beberapa operasi bisnis
        ValidateOrder(request);
        CreateOrder(request);
        UpdateInventory(request);
        NotifyCustomer(request);
        return BuildResult(request);
    }
}
```

### Keuntungan

- **Reduced round-trips** — client sekali panggil
- **Atomic operation** — konsisten secara logical
- **Simpler client** — client tidak tahu detail

## Desain Business Layer

### Langkah-langkah

1. **Identifikasi business requirements** dan aturan
2. **Identifikasi business entities** — objek domain
3. **Desain business components** — layanan per domain
4. **Desain workflow** — urutan operasi
5. **Terapkan cross-cutting concerns** — security, caching, exceptions

### Key Guidelines

- **Jangan expose internal entities** ke layer lain — gunakan DTOs
- **Validasi di business layer** — bukan hanya UI
- **Business rules terpusat** — jangan tersebar di UI
- **Transaction boundaries** yang jelas
- **Testability** — business logic tanpa dependency UI

## Masalah Umum Business Layer

- **Business logic bocor ke UI** — code-behind berisi aturan
- **God objects** — komponen terlalu besar
- **Tight coupling** antar business components
- **Validasi tidak konsisten** di semua entry points
- **Transaction terlalu besar/kecil**
- **Exception di-swallow** — tanpa log dan rethrow

## Security dan Caching di Business Layer

### Security

- **Authorization checks** di business layer — bukan hanya UI
- **Data filtering** per role — user hanya melihat data yang diizinkan
- **Input validation** — cegah injection
- **Sensitive data protection** — jangan log password/secret

### Caching

- Cache **data jarang berubah** dan **sering dibaca**
- **Cache invalidation** — kapan data dianggap stale
- **Cache per-user vs shared** — data pribadi vs umum
- Pertimbangkan memory terbatas di device

## Exception Management dan Logging

### Exception Management

- **Catch di boundary** — jangan tangkap di mana-mana
- **Log sebelum rethrow** — konteks error tersimpan
- **Jangan expose internal errors** ke user — pesan aman
- **Exception hierarchy** — business exceptions vs technical

```csharp
try
{
    // operasi bisnis
}
catch (BusinessValidationException ex)
{
    // tampilkan pesan ke user, log
}
catch (Exception ex)
{
    _logger.Log(ex);
    throw new SafeException("Terjadi kesalahan internal");
}
```

### Logging

- Log **semua critical operations** — audit
- **Structured logs** — mudah di-query
- **Jangan log sensitive data** — password, token
- Level: DEBUG, INFO, WARN, ERROR

## Data Access Layer Overview

**Data layer** mengelola akses ke penyimpanan data — di device (SQLite, Isolated Storage) atau server (database).

## Komponen Data Layer

### Data Access Logic Components

Komponen yang **mengabstraksi logika akses data**:

- **Centralize data access** — mudah dikonfigurasi dan di-maintain
- Menyembunyikan detail penyimpanan dari business layer
- Implementasi **Repository pattern**

### Data Helpers / Utilities

Fungsi helper untuk manipulasi, transformasi, dan akses data:

- **Specialized libraries** — koneksi, command, reader
- Custom routines untuk performa
- Mengurangi development requirements

### Service Agents

Komponen yang mengelola komunikasi ke **external services**:

- Menerapkan **Service Agent pattern**
- Handle serialization/deserialization
- Manage connection lifecycle
- Abstraksi lokasi service (URL/endpoint)

## Data Access Logic Components

### Repository Pattern

```csharp
public interface ITaskRepository
{
    Task GetTask(int id);
    IEnumerable<Task> GetTasksByStatus(string status);
    void Save(Task task);
    void Delete(int id);
}

public class SqlTaskRepository : ITaskRepository
{
    private readonly IDbConnection _connection;

    public IEnumerable<Task> GetTasksByStatus(string status)
    {
        using (var cmd = _connection.CreateCommand())
        {
            cmd.CommandText =
                "SELECT * FROM Tasks WHERE Status = @status";
            cmd.AddParameter("@status", status);
            // eksekusi dan mapping
        }
    }
}
```

### Keuntungan Repository

- **Abstraksi storage** — business layer tidak tahu SQL
- **Testable** — bisa di-mock
- **Centralized query logic**
- **Consistent data access**

## Data Helpers dan Service Agents

### Data Helpers

```csharp
public static class DataHelper
{
    public static IDbConnection CreateConnection()
    {
        return new SqlConnection(
            Configuration.ConnectionString);
    }

    public static byte[] Serialize<T>(T obj)
    {
        // serialisasi untuk penyimpanan
    }
}
```

### Service Agents

```csharp
public class WeatherServiceAgent
{
    public WeatherData GetWeather(string city)
    {
        using (var client = new HttpClient())
        {
            var response = client.GetAsync(
                $"http://api.weather.com/{city}").Result;
            return Deserialize<WeatherData>(response);
        }
    }
}
```

## Masalah Umum Data Layer

- **SQL tersebar di aplikasi** — duplikasi dan tidak konsisten
- **Connection tidak di-dispose** — resource leak
- **Data access coupling** — business layer tahu detail storage
- **No abstraction** — sulit test dan maintain
- **Mapping manual** — boilerplate antara data dan objek
- **Offline data sync** tidak didesain — aplikasi mobile butuh strategi sync

### Offline-First Data Access

Untuk mobile, pertimbangkan:
- **Local cache** — SQLite/Isolated Storage
- **Sync framework** — sinkronisasi dua arah
- **Conflict resolution** — saat edit offline vs online
- **Queue of operations** — simpan perubahan offline, kirim saat online

## Kesimpulan

Tiga layer utama punya peran dan guidelines spesifik: **Presentation** (UI, MVVM, user process), **Business** (facade, business components, cross-cutting concerns), dan **Data Access** (repository, helpers, service agents). Kunci: abstraksi dan separation — tiap layer hanya tahu interface layer di bawahnya.

Di artikel berikutnya: **Service Layer, Communication, dan Deployment Patterns** (Chapter 6-8).

## Referensi

- Microsoft patterns & practices. (2010). *Mobile Application Architecture Pocket Guide* (v1.1). Microsoft.
- Microsoft Application Architecture Guide. (2009). *Layered Architecture*, *Repository*, *MVVM*. Microsoft patterns & practices.
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
- Evans, E. (2003). *Domain-Driven Design*. Addison-Wesley.
