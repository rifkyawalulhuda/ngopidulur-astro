---
title: "ASP.NET Core untuk Pemula: Panduan Membangun Aplikasi Web Pertama dari Nol"
description: Panduan lengkap ASP.NET Core untuk pemula — mulai dari instalasi
  SDK, membuat project pertama, memahami struktur file, sampai menjalankan
  Hello World di browser. Cocok untuk developer yang ingin beralih ke .NET
  ecosystem atau pemula yang baru belajar web development.
pubDate: 2026-06-23T08:00:00.000Z
image: /image/aspnet-core-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ASPNETCore
  - DotNet
  - CSharp
  - WebDevelopment
  - Backend
  - Microsoft
  - NET8
  - Pemrograman
  - Tutorial
---

ASP.NET Core adalah framework web modern, cross-platform, dan open-source buatan Microsoft. Framework ini jadi fondasi untuk membangun aplikasi web, API, microservices, dan real-time applications dengan performa tinggi.

Artikel ini adalah **panduan langkah-demi-langkah** untuk kamu yang baru pertama kali menyentuh ASP.NET Core — dari instalasi sampai halaman pertama kamu online.

## Kenapa ASP.NET Core?

Sebelum mulai ngoding, penting untuk tahu kenapa ASP.NET Core layak dipelajari di 2026:

- **Cross-platform**: Jalan di Windows, macOS, dan Linux. Gak perlu server Windows!
- **High performance**: Masuk jajaran framework tercepat di TechEmpower benchmarks
- **Unified**: Satu framework untuk MVC, Web API, Razor Pages, Blazor, dan gRPC
- **Dependency Injection built-in**: Gak perlu library tambahan
- **Open source**: Aktif dikembangkan di GitHub dengan ribuan kontributor
- **Dukungan penuh Microsoft**: Long-term support (LTS) dengan update rutin

## Instalasi .NET SDK

Langkah pertama adalah menginstall **.NET SDK** (Software Development Kit):

### Windows
```bash
# Download installer dari https://dotnet.microsoft.com/download
# Atau pakai winget:
winget install Microsoft.DotNet.SDK.8
```

### macOS
```bash
brew install --cask dotnet-sdk
```

### Linux (Ubuntu/Debian)
```bash
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-8.0
```

### Verifikasi Instalasi

Setelah instalasi, buka terminal dan jalankan:

```bash
dotnet --version
# Output: 8.0.x

dotnet --list-sdks
# Menampilkan semua SDK yang terinstall
```

## Membuat Project Pertama

ASP.NET Core menyediakan berbagai template project. Kita mulai dari yang paling simpel:

```bash
# Buat folder project
mkdir BelajarASPNET
cd BelajarASPNET

# Buat project MVC (Model-View-Controller)
dotnet new mvc -n MyFirstApp

# Masuk ke folder project
cd MyFirstApp

# Jalankan aplikasi
dotnet run
```

Buka browser ke `http://localhost:5000` — selamat! Aplikasi ASP.NET Core pertama kamu sudah jalan.

## Memahami Struktur Project

Begitu project dibuat, ini file dan folder penting yang perlu kamu kenali:

```
MyFirstApp/
├── Program.cs              # Entry point — konfigurasi aplikasi
├── appsettings.json        # Konfigurasi (connection string, logging, dll)
├── Properties/
│   └── launchSettings.json # Setting development server
├── wwwroot/                # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── lib/
├── Controllers/            # MVC Controllers
├── Models/                 # Data models / view models
├── Views/                  # Razor views (UI)
│   ├── Home/
│   └── Shared/
└── MyFirstApp.csproj       # Project file (dependencies, settings)
```

### File Kunci yang Perlu Dipahami

**Program.cs** — Entry point modern ASP.NET Core:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

Baris per baris:
- `WebApplication.CreateBuilder(args)` — inisialisasi aplikasi
- `builder.Services.AddControllersWithViews()` — daftarkan MVC service
- `app.UseHttpsRedirection()` — paksa HTTPS
- `app.UseStaticFiles()` — sajikan file dari `wwwroot`
- `app.MapControllerRoute(...)` — konfigurasi URL routing

## Controller & Routing

ASP.NET Core menggunakan pattern **MVC (Model-View-Controller)**:

- **Model**: Data dan business logic
- **View**: Tampilan (HTML/Razor)
- **Controller**: Menghubungkan Model dan View, menangani HTTP request

### Contoh Controller Sederhana

```csharp
// Controllers/HomeController.cs
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View(); // Tampilkan Views/Home/Index.cshtml
    }

    public IActionResult About()
    {
        ViewData["Message"] = "Aplikasi pertama kamu!";
        return View();
    }

    public IActionResult Hello(string name)
    {
        ViewData["Greeting"] = $"Halo, {name}!";
        return View();
    }
}
```

Routing otomatis memetakan URL ke controller:
- `/` → `HomeController.Index()`
- `/Home/About` → `HomeController.About()`
- `/Home/Hello?name=Ngopidulur` → `HomeController.Hello("Ngopidulur")`

## Razor Views: HTML + C#

Views di ASP.NET Core menggunakan **Razor syntax** — kombinasi HTML dengan C#:

```html
@* Views/Home/Hello.cshtml *@
@{
    ViewData["Title"] = "Halo Page";
}

<div class="text-center">
    <h1 class="display-4">@ViewData["Greeting"]</h1>
    <p>Selamat datang di ASP.NET Core!</p>
    <p>Waktu server: @DateTime.Now</p>
</div>
```

Simbol `@` digunakan untuk menulis kode C# di dalam HTML. Razor sangat powerful untuk rendering dinamis.

## Tips untuk Pemula

1. **Mulai dari template** — jangan bikin dari empty project
2. **Pahami middleware pipeline** — `app.UseXxx()` menentukan urutan eksekusi
3. **Gunakan `dotnet watch`** — auto-reload saat file berubah:
   ```bash
   dotnet watch run
   ```
4. **Pelajari dependency injection** — built-in dan sangat berguna
5. **Baca dokumentasi resmi** — docs.microsoft.com sangat lengkap

## Kesimpulan

ASP.NET Core memberikan fondasi yang solid untuk membangun aplikasi web modern. Dengan dukungan cross-platform, performa tinggi, dan ekosistem yang matang, framework ini cocok untuk project skala kecil sampai enterprise.

Di artikel selanjutnya, kita akan mendalami **arsitektur MVC**, **dependency injection**, dan **bekerja dengan database** menggunakan Entity Framework Core.

---

*Referensi: The Little ASP.NET Core Book — Nate Barbettini, Microsoft .NET Documentation*
