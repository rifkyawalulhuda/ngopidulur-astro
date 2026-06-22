---
title: "Memahami Arsitektur MVC di ASP.NET Core: Controller, Model, dan View untuk Pemula"
description: Pelajari arsitektur MVC (Model-View-Controller) di ASP.NET
  Core secara praktis — dari membuat controller, binding model, rendering view
  dengan Razor, sampai memahami lifecycle HTTP request. Disertai contoh kode
  lengkap yang langsung bisa dicoba.
pubDate: 2026-06-23T09:00:00.000Z
image: /image/aspnet-core-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ASPNETCore
  - MVC
  - DotNet
  - CSharp
  - Razor
  - WebDevelopment
  - ArsitekturSoftware
  - Backend
  - Tutorial
---

MVC (Model-View-Controller) adalah pola arsitektur yang memisahkan aplikasi menjadi tiga komponen utama. Di ASP.NET Core, MVC adalah fondasi untuk membangun aplikasi web yang terstruktur, mudah di-maintain, dan testable.

Artikel ini akan memandu kamu memahami setiap komponen MVC secara mendalam — disertai contoh kode yang bisa langsung kamu praktikkan.

## Apa Itu MVC?

Bayangkan sebuah restoran:

- **Model** = Dapur (data + logika bisnis)
- **View** = Menu & plating (tampilan yang dilihat pelanggan)
- **Controller** = Waiter (menerima pesanan, meneruskan ke dapur, mengembalikan hasil)

Dalam konteks web:

| Komponen | Tugas | Contoh |
|----------|-------|--------|
| **Model** | Menyimpan data & business logic | `TodoItem.cs`, `Product.cs` |
| **View** | Menampilkan data ke user (UI) | `Index.cshtml`, `Details.cshtml` |
| **Controller** | Menangani HTTP request, koordinasi | `TodoController.cs` |

## Bagaimana HTTP Request Diproses?

Setiap kali browser mengirim request ke aplikasi ASP.NET Core, berikut alurnya:

```
Browser
  ↓ HTTP Request (GET /todos)
Middleware Pipeline (Program.cs)
  ↓ Routing
Controller (TodoController.Index)
  ↓ Ambil data dari Model/Service
Model (ITodoService.GetAll())
  ↓ Kembalikan data
Controller (return View(todos))
  ↓ Render View dengan data
View (Index.cshtml)
  ↓ HTML Response
Browser
```

## Membuat Controller

Controller di ASP.NET Core adalah class yang mewarisi (`inherits`) dari `Controller` base class:

```csharp
// Controllers/TodoController.cs
using Microsoft.AspNetCore.Mvc;

public class TodoController : Controller
{
    // GET: /Todo
    public IActionResult Index()
    {
        var items = new List<string>
        {
            "Belajar ASP.NET Core",
            "Membuat Controller",
            "Memahami View"
        };
        return View(items);
    }

    // GET: /Todo/Details/5
    public IActionResult Details(int id)
    {
        ViewData["Id"] = id;
        return View();
    }

    // GET: /Todo/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: /Todo/Create
    [HttpPost]
    public IActionResult Create(string title)
    {
        // Simpan ke database (nanti)
        return RedirectToAction("Index");
    }
}
```

### Atribut Routing Kustom

Kamu bisa kustomisasi URL pakai attribute routing:

```csharp
[Route("api/[controller]")]
public class TodoApiController : Controller
{
    [HttpGet]
    public IActionResult GetAll() { ... }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) { ... }

    [HttpPost]
    public IActionResult Create([FromBody] TodoItem item) { ... }
}
```

## Membuat Model

Model merepresentasikan data aplikasi kamu. Di ASP.NET Core, model biasanya adalah class C# sederhana (POCO — Plain Old CLR Object):

```csharp
// Models/TodoItem.cs
using System.ComponentModel.DataAnnotations;

public class TodoItem
{
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Judul wajib diisi")]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; }

    [Display(Name = "Selesai?")]
    public bool IsDone { get; set; }

    [Display(Name = "Tanggal Dibuat")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Display(Name = "Batas Waktu")]
    public DateTime? DueAt { get; set; }
}
```

### Data Annotations

Attributes seperti `[Required]`, `[StringLength]`, dan `[Display]` digunakan untuk:
- **Validasi**: ASP.NET Core otomatis memvalidasi input user
- **UI hints**: Menentukan label dan format di view
- **Database mapping**: Digunakan Entity Framework Core untuk skema tabel

### Model Binding

ASP.NET Core secara otomatis mengisi parameter action method dari HTTP request:

```csharp
[HttpPost]
public IActionResult Create(TodoItem item)
{
    // item.Title, item.IsDone otomatis terisi dari form POST
    if (ModelState.IsValid)
    {
        // Simpan ke database
        return RedirectToAction("Index");
    }
    return View(item);
}
```

ASP.NET Core bisa bind dari berbagai source:
- **Form data** (POST body)
- **Query string** (`?title=Belajar`)
- **Route data** (`/todo/5`)
- **Request body JSON** (untuk API)

## Membuat View dengan Razor

Views menggunakan **Razor syntax** — mix HTML + C#:

### Layout View (`_Layout.cshtml`)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>@ViewData["Title"] - Todo App</title>
    <link rel="stylesheet" href="~/css/site.css" />
</head>
<body>
    <header>
        <nav>
            <a asp-controller="Home" asp-action="Index">Home</a>
            <a asp-controller="Todo" asp-action="Index">Todos</a>
        </nav>
    </header>

    <main role="main">
        @RenderBody()  @* Konten spesifik halaman *@
    </main>

    <footer>
        <p>&copy; @DateTime.Now.Year - Ngopidulur</p>
    </footer>
</body>
</html>
```

### View Spesifik (`Index.cshtml`)

```html
@model List<string>

@{
    ViewData["Title"] = "Daftar Todo";
}

<h1>@ViewData["Title"]</h1>

@if (Model.Any())
{
    <ul>
        @foreach (var item in Model)
        {
            <li>@item</li>
        }
    </ul>
}
else
{
    <p>Belum ada item. <a asp-action="Create">Buat baru</a></p>
}
```

### Tag Helpers

ASP.NET Core menyediakan **Tag Helpers** — atribut HTML yang di-render server-side:

```html
<!-- Form dengan Tag Helpers -->
<form asp-action="Create" method="post">
    <div class="form-group">
        <label asp-for="Title"></label>
        <input asp-for="Title" class="form-control" />
        <span asp-validation-for="Title" class="text-danger"></span>
    </div>
    <button type="submit" class="btn btn-primary">Simpan</button>
</form>

<!-- Link dengan Tag Helpers -->
<a asp-controller="Todo" asp-action="Edit" asp-route-id="@item.Id">Edit</a>
```

Tag Helpers lebih readable dibanding HTML helpers, dan mendukung IntelliSense di Visual Studio / VS Code.

## Menambahkan Service Class

Jangan taruh semua logic di Controller! Pisahkan ke **Service class**:

```csharp
// Services/TodoService.cs
public class TodoService
{
    private readonly List<TodoItem> _items = new();

    public IEnumerable<TodoItem> GetAll() => _items;

    public TodoItem GetById(Guid id) => _items.FirstOrDefault(x => x.Id == id);

    public void Add(TodoItem item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;
        _items.Add(item);
    }

    public bool MarkComplete(Guid id)
    {
        var item = GetById(id);
        if (item == null) return false;
        item.IsDone = true;
        return true;
    }
}
```

### Dependency Injection

ASP.NET Core punya **built-in DI container**. Daftarkan service di `Program.cs`:

```csharp
// Program.cs
builder.Services.AddSingleton<TodoService>();
// atau
builder.Services.AddScoped<ITodoService, TodoService>();
```

Lalu inject ke controller via constructor:

```csharp
public class TodoController : Controller
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService; // DI inject otomatis
    }

    public IActionResult Index()
    {
        var todos = _todoService.GetAll();
        return View(todos);
    }
}
```

### Service Lifetimes

| Lifetime | Dibuat | Cocok Untuk |
|----------|--------|-------------|
| **Singleton** | Sekali sepanjang aplikasi | Cache, konfigurasi |
| **Scoped** | Sekali per HTTP request | Database context |
| **Transient** | Setiap kali diminta | Service ringan |

## Tips MVC untuk Pemula

1. **"Fat Model, Thin Controller"** — logic di Model/Service, Controller hanya koordinasi
2. **Gunakan ViewModels** — jangan langsung kirim Entity ke View
3. **Validate di Model** — pakai Data Annotations, jangan validasi di Controller
4. **Gunakan `dotnet watch`** — hemat waktu development
5. **Pelajari async/await** — untuk I/O bound operations

## Kesimpulan

Arsitektur MVC di ASP.NET Core memberikan struktur yang jelas dan terorganisir untuk aplikasi web. Dengan memahami interaksi antara Controller, Model, dan View — plus Dependency Injection — kamu bisa membangun aplikasi yang maintainable, testable, dan scalable.

Di artikel selanjutnya, kita akan menghubungkan aplikasi dengan **database menggunakan Entity Framework Core**.

---

*Referensi: The Little ASP.NET Core Book — Nate Barbettini, Microsoft ASP.NET Core Documentation*
