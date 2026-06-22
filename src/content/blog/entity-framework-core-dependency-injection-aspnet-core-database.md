---
title: "Entity Framework Core & Dependency Injection di ASP.NET Core: Panduan Bekerja dengan Database"
description: Tutorial lengkap menghubungkan ASP.NET Core dengan database
  menggunakan Entity Framework Core — dari instalasi package, membuat DbContext,
  migration, seeding data, sampai operasi CRUD dengan dependency injection.
  Dijelaskan step-by-step dengan kode siap pakai.
pubDate: 2026-06-23T10:00:00.000Z
image: /image/aspnet-core-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ASPNETCore
  - EntityFrameworkCore
  - EFCore
  - Database
  - SQLServer
  - SQLite
  - ORM
  - DependencyInjection
  - DotNet
  - CSharp
---

Entity Framework Core (EF Core) adalah **ORM (Object-Relational Mapper)** modern untuk .NET. Ia memungkinkan kamu bekerja dengan database menggunakan C# objects — tanpa menulis SQL mentah.

Artikel ini akan memandu kamu mengintegrasikan database ke aplikasi ASP.NET Core menggunakan EF Core, lengkap dengan dependency injection, migration, dan operasi CRUD.

## Kenapa Entity Framework Core?

- **No SQL**: Kerja dengan C# objects, EF Core generate SQL otomatis
- **Cross-database**: Support SQL Server, PostgreSQL, SQLite, MySQL, Cosmos DB
- **Migration**: Version control untuk skema database
- **LINQ**: Query database pakai C# syntax yang familiar
- **Change tracking**: Otomatis deteksi perubahan dan generate UPDATE/INSERT

## Instalasi EF Core

Tambahkan package NuGet ke project:

```bash
# Untuk SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# Untuk SQLite (development / testing)
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# Tools untuk migration
dotnet add package Microsoft.EntityFrameworkCore.Design
```

Atau edit `.csproj`:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.*" />
```

## Membuat Model Entity

Model mewakili tabel di database. Contoh model Todo:

```csharp
// Models/TodoItem.cs
using System.ComponentModel.DataAnnotations;

public class TodoItem
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; }

    public bool IsDone { get; set; }

    [Display(Name = "Dibuat")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Display(Name = "Batas Waktu")]
    public DateTime? DueAt { get; set; }
}
```

EF Core secara default:
- `Id` atau `{ClassName}Id` → Primary Key
- `Guid` → auto-generate value
- `string` → nvarchar(max), bisa dibatasi dengan `[MaxLength]`
- `bool` → bit
- `DateTime` → datetime2
- `DateTime?` → nullable datetime2

## Membuat DbContext

`DbContext` adalah jembatan antara C# dan database:

```csharp
// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<TodoItem> Todos { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Konfigurasi tambahan
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.IsDone);
        });
    }
}
```

### Register DbContext dengan Dependency Injection

Di `Program.cs`:

```csharp
// Untuk SQLite (development)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Untuk SQL Server (production)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Connection String di `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  }
}
```

Untuk SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TodoApp;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

## Database Migration

Migration adalah version control untuk skema database. Setiap perubahan model dibuat sebagai migration file:

```bash
# Install EF Core tools (kalau belum)
dotnet tool install --global dotnet-ef

# Buat migration pertama
dotnet ef migrations add InitialCreate

# Terapkan migration ke database
dotnet ef database update

# Rollback ke migration sebelumnya
dotnet ef database update PreviousMigration
```

### Apa yang Terjadi Saat Migration?

EF Core membuat dua file:
- `{timestamp}_InitialCreate.cs` — kode C# yang mendefinisikan perubahan
- `{timestamp}_InitialCreate.Designer.cs` — snapshot schema
- `AppDbContextModelSnapshot.cs` — snapshot terbaru

Saat `database update` dijalankan, EF Core:
1. Cek database apakah ada tabel `__EFMigrationsHistory`
2. Bandingkan migration yang sudah diterapkan dengan yang tersedia
3. Jalankan migration yang belum diterapkan
4. Update tabel history

## Membuat Service dengan EF Core

Pisahkan akses database ke service class:

```csharp
// Services/TodoService.cs
using Microsoft.EntityFrameworkCore;

public interface ITodoService
{
    Task<List<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task<TodoItem> CreateAsync(TodoItem item);
    Task<bool> UpdateAsync(TodoItem item);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleCompleteAsync(Guid id);
}

public class TodoService : ITodoService
{
    private readonly AppDbContext _db;

    public TodoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TodoItem>> GetAllAsync()
    {
        return await _db.Todos
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(Guid id)
    {
        return await _db.Todos.FindAsync(id);
    }

    public async Task<TodoItem> CreateAsync(TodoItem item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;

        _db.Todos.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }

    public async Task<bool> UpdateAsync(TodoItem item)
    {
        var existing = await _db.Todos.FindAsync(item.Id);
        if (existing == null) return false;

        existing.Title = item.Title;
        existing.DueAt = item.DueAt;
        existing.IsDone = item.IsDone;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await _db.Todos.FindAsync(id);
        if (item == null) return false;

        _db.Todos.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleCompleteAsync(Guid id)
    {
        var item = await _db.Todos.FindAsync(id);
        if (item == null) return false;

        item.IsDone = !item.IsDone;
        await _db.SaveChangesAsync();
        return true;
    }
}
```

### Register Service

```csharp
// Program.cs
builder.Services.AddScoped<ITodoService, TodoService>();
```

## Seeding Data Awal

Tambahkan data awal ke database saat aplikasi startup:

```csharp
// Data/SeedData.cs
public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext db)
    {
        if (await db.Todos.AnyAsync())
            return; // DB sudah ada data

        var todos = new List<TodoItem>
        {
            new() { Title = "Belajar ASP.NET Core", IsDone = true },
            new() { Title = "Memahami EF Core", IsDone = false },
            new() { Title = "Membuat aplikasi Todo", IsDone = false },
            new() { Title = "Deploy ke production", IsDone = false },
        };

        await db.Todos.AddRangeAsync(todos);
        await db.SaveChangesAsync();
    }
}
```

Di `Program.cs`:

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await SeedData.InitializeAsync(db);
}
```

## Controller dengan EF Core

```csharp
// Controllers/TodoController.cs
public class TodoController : Controller
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    // GET: /Todo
    public async Task<IActionResult> Index()
    {
        var todos = await _todoService.GetAllAsync();
        return View(todos);
    }

    // GET: /Todo/Create
    public IActionResult Create() => View();

    // POST: /Todo/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(TodoItem item)
    {
        if (!ModelState.IsValid)
            return View(item);

        await _todoService.CreateAsync(item);
        return RedirectToAction(nameof(Index));
    }

    // POST: /Todo/Toggle/5
    [HttpPost]
    public async Task<IActionResult> Toggle(Guid id)
    {
        await _todoService.ToggleCompleteAsync(id);
        return RedirectToAction(nameof(Index));
    }

    // POST: /Todo/Delete/5
    [HttpPost]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _todoService.DeleteAsync(id);
        return RedirectToAction(nameof(Index));
    }
}
```

## Tips Bekerja dengan Database

1. **Gunakan async/await** — semua I/O database harus async
2. **Gunakan `AsNoTracking()`** — untuk query read-only agar lebih cepat
3. **Pilih tipe ID yang tepat** — `Guid` untuk distributed system, `int` untuk simplisitas
4. **Eager loading dengan `.Include()`** — untuk memuat relasi sekaligus
5. **Gunakan SQLite untuk development** — ringan, file-based, tidak perlu install server
6. **Connection string di User Secrets** — jangan commit ke repo!

## Kesimpulan

Entity Framework Core + Dependency Injection adalah kombinasi powerful untuk bekerja dengan database di ASP.NET Core. Dengan pattern Service-Repository, kode kamu tetap testable dan maintainable meskipun aplikasi makin kompleks.

Di artikel selanjutnya, kita akan membahas **keamanan aplikasi dengan ASP.NET Core Identity**.

---

*Referensi: The Little ASP.NET Core Book — Nate Barbettini, Microsoft EF Core Documentation*
