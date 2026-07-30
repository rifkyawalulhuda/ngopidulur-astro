---
title: "Django Pertama Kali: Bangun Blog dari Nol dalam 30 Menit"
description: Panduan step-by-step membangun blog pertama dengan Django — dari
  startproject, startapp, konfigurasi database, Django Admin, membuat model,
  view, template, hingga URL routing yang benar.
pubDate: 2026-08-11T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Python
  - Tutorial
  - WebDevelopment
---

Django adalah salah satu framework web Python paling populer di dunia. Dikenal dengan slogan *"The web framework for perfectionists with deadlines"*, Django menawarkan pendekatan *batteries included* — hampir semua yang kamu butuhkan sudah tersedia tanpa perlu install banyak library tambahan. Dalam artikel ini, kita akan membangun blog sederhana dari nol menggunakan Django, mulai dari membuat project, mendefinisikan model, hingga menampilkan post di browser — semuanya dalam waktu sekitar 30 menit.

Sumber utama artikel ini adalah buku **Python Web Development with Django** karya Jeff Forcier, Paul Bissex, dan Wesley Chun (Addison-Wesley, 2008), yang masih sangat relevan untuk memahami fondasi Django.

---

## Prasyarat

Sebelum mulai, pastikan kamu sudah menginstal Python 3.10+ dan pip. Kemudian install Django:

```bash
pip install django
```

Verifikasi instalasi:

```bash
python -m django --version
# 4.2.x atau versi terbaru
```

---

## 1. Membuat Project Django

Django membedakan antara **project** dan **application (app)**. Project adalah keseluruhan konfigurasi dan pengaturan web aplikasimu, sementara app adalah modul fungsional di dalamnya — misalnya `blog`, `accounts`, atau `shop`.

Untuk membuat project baru, gunakan perintah `django-admin startproject`:

```bash
django-admin startproject myblog
cd myblog
```

### Struktur Direktori Project

Setelah menjalankan perintah di atas, kamu akan mendapatkan struktur direktori seperti ini:

```
myblog/
├── manage.py
└── myblog/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
```

Mari kita pahami fungsi masing-masing file:

- **`manage.py`** — Command-line utility untuk berinteraksi dengan project Django. Kamu akan sering menggunakan file ini untuk menjalankan server, membuat migrasi, membuat superuser, dan banyak lagi.
- **`settings.py`** — File konfigurasi utama project. Di sini kamu mengatur database, installed apps, middleware, template engine, static files, dan berbagai pengaturan lainnya.
- **`urls.py`** — URLconf utama project. File ini mendefinisikan peta URL ke view yang akan menangani request.
- **`wsgi.py`** — Entry point untuk web server yang kompatibel dengan WSGI (Web Server Gateway Interface), digunakan saat deploy ke production.
- **`asgi.py`** — Entry point untuk server yang mendukung ASGI (Asynchronous Server Gateway Interface), untuk aplikasi async.

---

## 2. Menjalankan Development Server

Django menyertakan development server built-in yang memudahkan kita saat pengembangan:

```bash
python manage.py runserver
```

Output-nya akan tampak seperti ini:

```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until
you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.

July 30, 2026 - 08:00:00
Django version 4.2.x, using settings 'myblog.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

Buka `http://127.0.0.1:8000/` di browser — kamu akan melihat halaman selamat datang Django dengan roket hijau. Development server secara otomatis me-reload ketika kamu mengubah kode, jadi kamu tidak perlu restart manual setiap saat.

> **Catatan:** Development server hanya untuk pengembangan lokal. Jangan gunakan di production karena tidak dioptimasi untuk keamanan dan performa.

---

## 3. Membuat Aplikasi Blog

Sekarang kita buat aplikasi `blog` di dalam project:

```bash
python manage.py startapp blog
```

Ini menghasilkan direktori baru:

```
blog/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
│   └── __init__.py
├── models.py
├── tests.py
└── views.py
```

Setelah membuat app, kamu **wajib mendaftarkannya** di `settings.py` agar Django mengenalinya:

```python
# myblog/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',  # tambahkan ini
]
```

---

## 4. Mendesain Model BlogPost

Model adalah representasi Python dari tabel database. Django menggunakan ORM (Object-Relational Mapping) yang memungkinkan kita bekerja dengan database menggunakan objek Python tanpa perlu menulis SQL secara langsung.

Buka `blog/models.py` dan definisikan model `Post`:

```python
# blog/models.py

from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-pub_date']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title
```

Penjelasan setiap field:

- **`CharField`** — Field teks dengan panjang maksimum. Cocok untuk judul, nama, dan teks pendek lainnya.
- **`TextField`** — Field teks panjang tanpa batasan karakter. Cocok untuk isi artikel.
- **`DateTimeField(auto_now_add=True)`** — Otomatis menyimpan tanggal dan waktu saat record pertama kali dibuat.
- **`ForeignKey`** — Relasi many-to-one ke model `User` bawaan Django. Parameter `on_delete=models.CASCADE` berarti jika user dihapus, semua postnya juga ikut terhapus.
- **`BooleanField`** — Field boolean (True/False), berguna untuk fitur draft/published.

Method `__str__` menentukan representasi string objek — akan ditampilkan di Django Admin dan shell.

---

## 5. Konfigurasi Database

### SQLite untuk Development

Secara default, Django sudah mengkonfigurasi SQLite sebagai database. Ini ideal untuk development karena tidak memerlukan instalasi server database terpisah:

```python
# myblog/settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

File `db.sqlite3` akan dibuat otomatis di root project saat pertama kali kamu menjalankan migrate.

### PostgreSQL untuk Production

Untuk production, disarankan menggunakan PostgreSQL atau MySQL yang lebih robust:

```python
# settings.py (production)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'myblog_db',
        'USER': 'myblog_user',
        'PASSWORD': 'password_rahasia',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Untuk menggunakan PostgreSQL, install adapter-nya terlebih dahulu:

```bash
pip install psycopg2-binary
```

### MySQL untuk Production (Alternatif)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'myblog_db',
        'USER': 'root',
        'PASSWORD': 'password_rahasia',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

```bash
pip install mysqlclient
```

---

## 6. Membuat dan Menerapkan Migrasi

Migrasi adalah cara Django mengelola perubahan skema database. Setiap kali kamu mengubah model, kamu perlu membuat file migrasi dan menerapkannya ke database.

**Langkah 1: Buat file migrasi**

```bash
python manage.py makemigrations blog
```

Output:

```
Migrations for 'blog':
  blog/migrations/0001_initial.py
    - Create model Post
```

**Langkah 2: Terapkan migrasi ke database**

```bash
python manage.py migrate
```

Output:

```
Operations to perform:
  Apply all migrations: admin, auth, blog, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying blog.0001_initial... OK
```

Perintah `migrate` juga menerapkan migrasi bawaan Django untuk app `admin`, `auth`, `contenttypes`, dan `sessions`.

> **Tentang `syncdb`:** Di versi Django lama (sebelum 1.7), digunakan perintah `python manage.py syncdb`. Perintah ini sudah digantikan oleh `makemigrations` + `migrate` yang jauh lebih powerful dan mendukung schema evolution.

---

## 7. Django Admin: Panel Administrasi Otomatis

Salah satu fitur Django yang paling mengesankan adalah **Django Admin** — panel administrasi yang dihasilkan secara otomatis. Dengan beberapa baris kode, kamu sudah punya UI lengkap untuk mengelola data.

### Mendaftarkan Model ke Admin

Buka `blog/admin.py`:

```python
# blog/admin.py

from django.contrib import admin
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'pub_date', 'is_published']
    list_filter = ['is_published', 'pub_date']
    search_fields = ['title', 'body']
    date_hierarchy = 'pub_date'
    ordering = ['-pub_date']
```

Atau cara yang lebih sederhana (tanpa kustomisasi):

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

### Membuat Superuser

Untuk login ke Django Admin, kamu perlu akun superuser:

```bash
python manage.py createsuperuser
```

Ikuti promptnya:

```
Username: admin
Email address: admin@example.com
Password: ********
Password (again): ********
Superuser created successfully.
```

### Menggunakan Django Admin

1. Jalankan server: `python manage.py runserver`
2. Buka `http://127.0.0.1:8000/admin/`
3. Login dengan kredensial superuser yang baru dibuat

Di panel admin, kamu bisa:
- **Create** — Tambah post baru melalui form yang dihasilkan otomatis dari model
- **Read** — Lihat daftar semua post dengan filter dan pencarian
- **Update** — Edit post yang sudah ada
- **Delete** — Hapus post (dengan konfirmasi)

Semua ini tanpa menulis satu baris HTML atau form handling code pun!

---

## 8. Membuat View Function

View adalah fungsi Python yang menerima HTTP request dan mengembalikan HTTP response. Ini adalah inti dari logika aplikasi Django.

Buka `blog/views.py`:

```python
# blog/views.py

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Post


def index(request):
    """View sederhana yang mengembalikan teks biasa."""
    return HttpResponse("Selamat datang di blog Django!")


def post_list(request):
    """Menampilkan daftar semua post yang sudah dipublish."""
    posts = Post.objects.filter(is_published=True).order_by('-pub_date')
    context = {
        'posts': posts,
        'title': 'Blog Posts',
    }
    return render(request, 'blog/post_list.html', context)


def post_detail(request, pk):
    """Menampilkan detail satu post berdasarkan primary key."""
    post = get_object_or_404(Post, pk=pk, is_published=True)
    context = {
        'post': post,
    }
    return render(request, 'blog/post_detail.html', context)
```

Penjelasan:

- **`HttpResponse`** — Cara paling dasar mengembalikan response. Cukup untuk testing, tapi jarang digunakan langsung dalam production.
- **`render(request, template_name, context)`** — Shortcut untuk merender template dengan context dictionary dan mengembalikannya sebagai `HttpResponse`.
- **`get_object_or_404`** — Mencari object berdasarkan kondisi. Jika tidak ditemukan, otomatis mengembalikan response 404 (Not Found).
- **Context** — Dictionary Python yang berisi data yang ingin dikirim ke template.

---

## 9. URLconf: Routing URL ke View

URLconf adalah peta yang menghubungkan URL dengan view function. Django membaca file `urls.py` untuk menentukan view mana yang harus menangani sebuah request.

### URL Project Utama

Edit `myblog/urls.py`:

```python
# myblog/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),  # delegate ke blog/urls.py
]
```

### URL Aplikasi Blog

Buat file baru `blog/urls.py`:

```python
# blog/urls.py

from django.urls import path
from . import views

app_name = 'blog'  # namespace untuk URL reversing

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
]
```

Penjelasan:

- **`path(route, view, name)`** — Fungsi untuk mendefinisikan URL pattern.
- **`<int:pk>`** — URL parameter dengan tipe integer. Django akan mengekstrak nilai ini dan meneruskannya sebagai argument `pk` ke view function.
- **`include('blog.urls')`** — Mendelegasikan URL handling ke URLconf di `blog/urls.py`. Ini praktik terbaik untuk menjaga URLconf tetap terorganisir.
- **`name`** — Nama URL yang bisa digunakan untuk URL reversing di template: `{% url 'blog:post_list' %}`.

---

## 10. Membuat Template HTML

Django menggunakan **Django Template Language (DTL)** untuk merender HTML dinamis. Template adalah file HTML dengan sintaks khusus Django di dalamnya.

### Konfigurasi Template Directory

Buat direktori `templates/blog/` di dalam app:

```
blog/
└── templates/
    └── blog/
        ├── base.html
        ├── post_list.html
        └── post_detail.html
```

### Template Inheritance: base.html

Salah satu fitur terkuat DTL adalah **template inheritance**. Kita buat satu template dasar (`base.html`) yang berisi layout umum, lalu template lain bisa "mewarisi" dan mengisi bagian tertentu.

```html
<!-- blog/templates/blog/base.html -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}MyBlog{% endblock %}</title>
    <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        nav a { margin-right: 15px; text-decoration: none; color: #333; }
        .post-meta { color: #666; font-size: 0.9em; }
        footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; color: #999; }
    </style>
</head>
<body>
    <header>
        <h1><a href="{% url 'blog:post_list' %}">📝 MyBlog</a></h1>
        <nav>
            <a href="{% url 'blog:post_list' %}">Beranda</a>
        </nav>
    </header>

    <main>
        {% block content %}
        <!-- Konten halaman akan diisi di sini -->
        {% endblock %}
    </main>

    <footer>
        <p>Dibangun dengan Django &hearts;</p>
    </footer>
</body>
</html>
```

Tag `{% block nama_block %}...{% endblock %}` mendefinisikan area yang bisa di-override oleh template turunan.

### Template Daftar Post

```html
<!-- blog/templates/blog/post_list.html -->
{% extends 'blog/base.html' %}

{% block title %}Beranda — MyBlog{% endblock %}

{% block content %}
<h2>Artikel Terbaru</h2>

{% if posts %}
    {% for post in posts %}
    <article>
        <h3>
            <a href="{% url 'blog:post_detail' pk=post.pk %}">
                {{ post.title }}
            </a>
        </h3>
        <p class="post-meta">
            Oleh <strong>{{ post.author.username }}</strong>
            pada {{ post.pub_date|date:'d M Y' }}
        </p>
        <p>{{ post.body|truncatewords:30 }}</p>
        <a href="{% url 'blog:post_detail' pk=post.pk %}">Baca selengkapnya →</a>
    </article>
    <hr>
    {% endfor %}
{% else %}
    <p>Belum ada artikel. <a href="/admin/">Tambah sekarang</a>.</p>
{% endif %}
{% endblock %}
```

### Template Detail Post

```html
<!-- blog/templates/blog/post_detail.html -->
{% extends 'blog/base.html' %}

{% block title %}{{ post.title }} — MyBlog{% endblock %}

{% block content %}
<article>
    <h2>{{ post.title }}</h2>
    <p class="post-meta">
        Oleh <strong>{{ post.author.get_full_name|default:post.author.username }}</strong>
        — {{ post.pub_date|date:'l, d F Y' }}
        — {{ post.pub_date|timesince }} yang lalu
    </p>
    <div class="post-body">
        {{ post.body|linebreaks }}
    </div>
</article>

<p><a href="{% url 'blog:post_list' %}">← Kembali ke daftar artikel</a></p>
{% endblock %}
```

---

## 11. Filter Template Django

Django Template Language menyediakan banyak **filter** bawaan yang memformat atau memodifikasi variabel sebelum ditampilkan. Sintaksnya: `{{ variabel|filter_name:argument }}`.

Beberapa filter yang sering digunakan:

```html
<!-- Format tanggal -->
{{ post.pub_date|date:'d M Y' }}
<!-- Output: 11 Aug 2026 -->

{{ post.pub_date|date:'l, d F Y' }}
<!-- Output: Tuesday, 11 August 2026 -->

{{ post.pub_date|time:'H:i' }}
<!-- Output: 08:00 -->

<!-- Teks -->
{{ post.body|truncatewords:50 }}
<!-- Potong teks menjadi 50 kata -->

{{ post.title|upper }}
<!-- JUDUL DALAM HURUF BESAR -->

{{ post.title|lower }}
<!-- judul dalam huruf kecil -->

{{ post.body|linebreaks }}
<!-- Ubah newline menjadi tag <p> dan <br> -->

{{ post.body|striptags }}
<!-- Hapus semua tag HTML -->

{{ post.body|wordcount }}
<!-- Hitung jumlah kata -->

<!-- Nilai default jika kosong -->
{{ post.author.get_full_name|default:"Anonim" }}

<!-- Waktu relatif -->
{{ post.pub_date|timesince }}
<!-- Output: 3 days, 4 hours -->

<!-- Kode aman (tidak di-escape) -->
{{ post.body|safe }}
<!-- Hati-hati: hanya gunakan untuk konten terpercaya -->
```

---

## 12. Arsitektur Django: MVT dan Alur Request

Django mengikuti pola arsitektur **MVT (Model-View-Template)**, yang merupakan variasi dari MVC (Model-View-Controller) yang lebih umum.

### Alur HTTP Request ke Response

```
HTTP Request
     │
     ▼
  URLconf (urls.py)
  ┌─────────────────────────────┐
  │  path('', views.post_list)  │
  └─────────────────────────────┘
     │
     ▼
  View Function (views.py)
  ┌─────────────────────────────────────┐
  │  def post_list(request):            │
  │      posts = Post.objects.all()     │  ──→  Model (models.py)
  │      return render(req, tmpl, ctx)  │         │
  └─────────────────────────────────────┘         │
     │                                            ▼
     │                                       Database
     │                                    (SQLite/PostgreSQL)
     ▼
  Template Engine
  ┌────────────────────────────────┐
  │  post_list.html                │
  │  {% for post in posts %}       │
  │    {{ post.title }}            │
  │  {% endfor %}                  │
  └────────────────────────────────┘
     │
     ▼
  HTTP Response (HTML)
     │
     ▼
  Browser User
```

### Komponen MVT

**Model (M)**
- Mendefinisikan struktur data dan logika bisnis
- Berinteraksi dengan database melalui ORM
- Tidak mengetahui bagaimana data akan ditampilkan

**View (V)**
- Menerima request dan mengembalikan response
- Mengambil data dari model
- Memilih template yang tepat
- Meneruskan data ke template melalui context
- Dalam MVC tradisional, View Django berperan sebagai *Controller*

**Template (T)**
- Mendefinisikan presentasi/tampilan (HTML)
- Menerima data dari view melalui context
- Menggunakan DTL untuk logika presentasi sederhana
- Dalam MVC tradisional, Template Django berperan sebagai *View*

### Filosofi Separation of Concerns

Django mendorong pemisahan yang jelas antara:

1. **Data** → Model mengelola data dan hubungannya
2. **Logika** → View mengelola business logic dan alur aplikasi
3. **Presentasi** → Template mengelola tampilan kepada pengguna

Keuntungan pemisahan ini:
- **Maintainability** — Perubahan di satu layer tidak merusak layer lain
- **Reusability** — Template bisa dipakai oleh beberapa view
- **Testability** — Setiap komponen bisa diuji secara independen
- **Collaboration** — Developer backend dan frontend bisa bekerja paralel

---

## 13. Menjalankan dan Testing Blog

Setelah semua komponen selesai, mari verifikasi semuanya berjalan:

```bash
# Pastikan semua migrasi sudah diterapkan
python manage.py migrate

# Buat superuser untuk Django Admin
python manage.py createsuperuser

# Jalankan development server
python manage.py runserver
```

Buka browser dan coba URL berikut:
- `http://127.0.0.1:8000/` — Daftar post (kosong jika belum ada post)
- `http://127.0.0.1:8000/admin/` — Login ke Django Admin dan buat beberapa post
- `http://127.0.0.1:8000/post/1/` — Detail post pertama

### Django Shell untuk Debugging

Django menyertakan interactive shell yang sudah terkonfigurasi dengan environment Django:

```bash
python manage.py shell
```

```python
>>> from blog.models import Post
>>> from django.contrib.auth.models import User

# Buat post melalui shell
>>> user = User.objects.get(username='admin')
>>> post = Post.objects.create(
...     title='Post Pertama dari Shell',
...     body='Ini adalah konten post pertama yang dibuat melalui Django shell.',
...     author=user
... )
>>> print(post)
Post Pertama dari Shell

# Query semua post
>>> Post.objects.all()
<QuerySet [<Post: Post Pertama dari Shell>]>

# Filter post
>>> Post.objects.filter(author=user).count()
1
```

---

## Struktur Akhir Project

Berikut adalah struktur direktori project yang sudah lengkap:

```
myblog/
├── manage.py
├── db.sqlite3
├── myblog/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── blog/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── views.py
    ├── urls.py
    ├── migrations/
    │   ├── __init__.py
    │   └── 0001_initial.py
    └── templates/
        └── blog/
            ├── base.html
            ├── post_list.html
            └── post_detail.html
```

---

## Penutup

Dalam waktu 30 menit, kita telah membangun blog fungsional dengan Django yang mencakup:

- **Project dan App** — Memahami perbedaan dan cara membuatnya
- **Model** — Mendefinisikan struktur data dengan ORM Django
- **Database** — Konfigurasi SQLite untuk development dan PostgreSQL/MySQL untuk production
- **Migrasi** — Mengelola perubahan skema database dengan `makemigrations` dan `migrate`
- **Django Admin** — Panel administrasi yang dihasilkan otomatis
- **View** — Logika aplikasi yang menghubungkan model dan template
- **URLconf** — Routing URL yang bersih dengan `path()` dan `include()`
- **Template** — HTML dinamis dengan Django Template Language dan filter bawaan
- **Template Inheritance** — Struktur DRY dengan `{% block %}` dan `{% extends %}`
- **Arsitektur MVT** — Filosofi separation of concerns Django

Django memang memiliki kurva pembelajaran, tapi begitu kamu memahami pola MVT dan cara ketiga komponen tersebut berinteraksi, segalanya menjadi jauh lebih jelas. Ini baru permulaan — Django masih memiliki banyak fitur luar biasa seperti class-based views, forms, authentication, signals, caching, dan masih banyak lagi yang bisa kamu eksplorasi.

> **Referensi:** Jeff Forcier, Paul Bissex, Wesley Chun. *Python Web Development with Django*. Addison-Wesley Professional, 2008.
