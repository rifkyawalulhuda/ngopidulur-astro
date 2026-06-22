---
title: "Autentikasi & Otorisasi di ASP.NET Core: Panduan Lengkap Menggunakan Identity"
description: Tutorial komprehensif mengamankan aplikasi ASP.NET Core dengan
  ASP.NET Core Identity — dari setup autentikasi, registrasi & login user,
  manajemen role, proteksi halaman dengan Authorize attribute, sampai custom
  policy authorization. Kode lengkap siap di-copy-paste.
pubDate: 2026-06-23T11:00:00.000Z
image: /image/aspnet-core-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ASPNETCore
  - Identity
  - Authentication
  - Authorization
  - Security
  - DotNet
  - CSharp
  - WebSecurity
  - RoleBasedAccess
  - Tutorial
---

Keamanan adalah aspek kritis setiap aplikasi web. **ASP.NET Core Identity** adalah framework built-in untuk menangani autentikasi (siapa kamu?) dan otorisasi (apa yang boleh kamu lakukan?).

Artikel ini akan memandu kamu mengamankan aplikasi ASP.NET Core dari nol — dari registrasi user sampai role-based authorization.

## Kenapa ASP.NET Core Identity?

- **Built-in**: Gak perlu library tambahan, sudah include di ASP.NET Core
- **Customizable**: Bisa extend model user, ganti password policy, tambah custom claims
- **Security best practices**: Password hashing, CSRF protection, account lockout — semua siap pakai
- **Integrasi dengan EF Core**: Identity pakai Entity Framework untuk menyimpan data user

## Setup Identity

### 1. Install Package (kalau dari template kosong)

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### 2. Buat DbContext dengan Identity

```csharp
// Data/AppDbContext.cs
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext
{
    public DbSet<TodoItem> Todos { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
}
```

> **Penting**: Ganti `DbContext` jadi `IdentityDbContext` — ini menambahkan tabel Users, Roles, dan UserClaims.

### 3. Register Identity Services

```csharp
// Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    // Password policy
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    // Lockout policy
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedAccount = false; // true untuk production
})
.AddEntityFrameworkStores<AppDbContext>();

// Aktifkan autentikasi & otorisasi
app.UseAuthentication();
app.UseAuthorization(); // sudah ada di template default

// Pastikan app.UseAuthorization() SESUDAH app.UseAuthentication()
```

### 4. Jalankan Migration

```bash
dotnet ef migrations add AddIdentity
dotnet ef database update
```

Ini membuat tabel-tabel: `AspNetUsers`, `AspNetRoles`, `AspNetUserClaims`, `AspNetUserLogins`, `AspNetRoleClaims`, `AspNetUserTokens`.

## Scaffold Identity UI

ASP.NET Core Identity menyediakan UI bawaan untuk login, register, dan manajemen akun:

```bash
# Install scaffolding tool
dotnet tool install -g dotnet-aspnet-codegenerator

# Add NuGet package
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.AspNetCore.Identity.UI

# Scaffold halaman login & register
dotnet aspnet-codegenerator identity \
  --files "Account.Register;Account.Login;Account.Logout;Account.AccessDenied"
```

Ini meng-generate Razor Pages ke `Areas/Identity/Pages/Account/` yang bisa kamu kustomisasi.

## Menambahkan Autentikasi ke Controller

### Require Authentication

```csharp
[Authorize] // Seluruh controller butuh login
public class TodoController : Controller
{
    // Semua action di sini butuh autentikasi
}
```

### Allow Anonymous untuk Action Tertentu

```csharp
[Authorize]
public class HomeController : Controller
{
    [AllowAnonymous]
    public IActionResult Index()
    {
        return View(); // Bisa diakses tanpa login
    }

    public IActionResult Dashboard()
    {
        return View(); // Butuh login
    }
}
```

### Redirect ke Halaman Login

Identity secara otomatis redirect ke `/Identity/Account/Login` saat user belum login. Kamu bisa mengubah path default:

```csharp
// Program.cs
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromHours(4);
});
```

## Otorisasi dengan Roles

### Membuat Roles

```csharp
// Services/RoleService.cs
public class RoleService
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;

    public RoleService(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    public async Task InitializeRoles()
    {
        string[] roles = { "Admin", "Editor", "User" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    public async Task AssignRole(string email, string role)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null && !await _userManager.IsInRoleAsync(user, role))
            await _userManager.AddToRoleAsync(user, role);
    }
}
```

### Menggunakan Role di Controller

```csharp
[Authorize(Roles = "Admin")]
public IActionResult AdminPanel()
{
    return View(); // Hanya Admin yang bisa akses
}

[Authorize(Roles = "Admin,Editor")]
public IActionResult EditorPanel()
{
    return View(); // Admin DAN Editor bisa akses
}

[Authorize(Roles = "Admin")]
[Authorize(Roles = "Editor")] // AND logic — harus punya KEDUA role
public IActionResult SuperPanel()
{
    return View();
}
```

### Role di View

```html
@using Microsoft.AspNetCore.Identity
@inject UserManager<IdentityUser> UserManager
@inject SignInManager<IdentityUser> SignInManager

@if (SignInManager.IsSignedIn(User))
{
    <span>Halo, @User.Identity?.Name!</span>

    @if (User.IsInRole("Admin"))
    {
        <a asp-action="AdminPanel">Admin Panel</a>
    }

    <form asp-area="Identity" asp-page="/Account/Logout" method="post">
        <button type="submit">Logout</button>
    </form>
}
else
{
    <a asp-area="Identity" asp-page="/Account/Login">Login</a>
    <a asp-area="Identity" asp-page="/Account/Register">Register</a>
}
```

## Policy-Based Authorization

Untuk aturan yang lebih kompleks, gunakan **Policy**:

```csharp
// Program.cs — definisikan policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOrSeniorEditor", policy =>
        policy.RequireAssertion(context =>
            context.User.IsInRole("Admin") ||
            (context.User.IsInRole("Editor") && context.User.HasClaim("Level", "Senior"))
        ));

    options.AddPolicy("AtLeast18", policy =>
        policy.RequireClaim("Age")
              .RequireAssertion(context =>
                  int.TryParse(context.User.FindFirst("Age")?.Value, out int age) && age >= 18
              ));
});
```

Gunakan di Controller:

```csharp
[Authorize(Policy = "AdminOrSeniorEditor")]
public IActionResult SensitiveData()
{
    return View();
}
```

## Menghubungkan Todo Items dengan User

Agar setiap user hanya melihat todo mereka sendiri:

```csharp
// Models/TodoItem.cs
public class TodoItem
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public bool IsDone { get; set; }

    // Foreign key ke user
    public string UserId { get; set; }
    public IdentityUser User { get; set; }
}
```

Di Service:

```csharp
public class TodoService : ITodoService
{
    private readonly AppDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public TodoService(AppDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    public async Task<List<TodoItem>> GetUserTodosAsync(ClaimsPrincipal user)
    {
        var currentUser = await _userManager.GetUserAsync(user);
        return await _db.Todos
            .Where(t => t.UserId == currentUser.Id)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
```

Di Controller:

```csharp
[Authorize]
public async Task<IActionResult> Index()
{
    var todos = await _todoService.GetUserTodosAsync(User);
    return View(todos);
}
```

## Tips Keamanan ASP.NET Core

1. **HTTPS everywhere** — `app.UseHttpsRedirection()` dan HSTS
2. **Anti-forgery token** — pakai `[ValidateAntiForgeryToken]` di POST actions
3. **Rate limiting** — batasi request per user/endpoint
4. **Sanitize output** — Razor otomatis encode HTML, hindari `@Html.Raw()` untuk user input
5. **Gunakan User Secrets** — jangan commit API key, connection string ke repo
6. **Aktifkan CORS secara selektif** — jangan allow semua origin
7. **Update regular** — pantau security advisory .NET

## Kesimpulan

ASP.NET Core Identity menyediakan fondasi keamanan yang solid untuk aplikasi web kamu — dari autentikasi dasar, role management, sampai custom policy authorization. Dengan memahami konsep-konsep di atas, kamu bisa membangun aplikasi yang aman tanpa mengorbankan user experience.

Di artikel terakhir, kita akan membahas **deploy aplikasi ASP.NET Core ke production** dengan Azure dan Docker.

---

*Referensi: The Little ASP.NET Core Book — Nate Barbettini, Microsoft ASP.NET Core Security Documentation*
