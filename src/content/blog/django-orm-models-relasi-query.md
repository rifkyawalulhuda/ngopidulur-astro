---
title: "Django ORM: Models, Relasi, dan Query API Lengkap"
description: Kuasai Django ORM dari nol — mendefinisikan model dengan field types
  yang kaya, relasi ForeignKey/ManyToMany/OneToOne, model inheritance, Meta class,
  QuerySet API, select_related, aggregasi, dan raw SQL di Django.
pubDate: 2026-08-12T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - ORM
  - Python
  - Database
series: "Django Web"
seriesOrder: 3
---

Database adalah jantung dari hampir semua aplikasi web. Django ORM (Object-Relational Mapper) memungkinkan kamu berinteraksi dengan database menggunakan Python murni — tanpa menulis SQL secara manual. Chapter 4 dari *Python Web Development with Django* membahas ORM secara mendalam, dari mendefinisikan model hingga query kompleks dengan optimasi.

## Daftar Isi

- [Kenapa Pakai ORM?](#kenapa-pakai-orm)
- [Mendefinisikan Model](#mendefinisikan-model)
- [Field Types Lengkap](#field-types-lengkap)
- [Relasi Antar Model](#relasi-antar-model)
- [Model Inheritance](#model-inheritance)
- [Meta Inner Class](#meta-inner-class)
- [Django Admin Registration](#django-admin-registration)
- [Query API: CRUD dan Filtering](#query-api-crud-dan-filtering)
- [Optimasi Query: select_related dan prefetch_related](#optimasi-query-select_related-dan-prefetch_related)
- [Aggregasi dan Anotasi](#aggregasi-dan-anotasi)
- [Raw SQL](#raw-sql)
- [manage.py untuk Database](#managepy-untuk-database)

---

## Kenapa Pakai ORM?

ORM memberikan beberapa keuntungan krusial:

- **Abstraksi database** — kode yang sama berjalan di SQLite, PostgreSQL, MySQL, Oracle
- **Keamanan** — parameter di-escape otomatis, mencegah SQL injection
- **Produktivitas** — query ditulis dalam Python, bukan string SQL yang rentan typo
- **Portabilitas** — ganti database hanya dengan ubah `settings.py`

```python
# Tanpa ORM — raw SQL, rentan SQL injection
cursor.execute("SELECT * FROM blog_post WHERE author = '%s'" % username)  # ⚠️ BAHAYA

# Dengan ORM — aman dan readable
posts = Post.objects.filter(author__username=username)
```

---

## Mendefinisikan Model

Model adalah class Python yang merepresentasikan tabel database. Setiap atribut class menjadi kolom.

```python
# blog/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Post(models.Model):
    title       = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True, max_length=200)
    author      = models.ForeignKey(User, on_delete=models.CASCADE,
                                    related_name='posts')
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                    null=True, blank=True)
    body        = models.TextField()
    excerpt     = models.CharField(max_length=300, blank=True)
    cover_image = models.ImageField(upload_to='posts/%Y/%m/', blank=True)
    is_published = models.BooleanField(default=False)
    pub_date    = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    view_count  = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('blog:post-detail', kwargs={'slug': self.slug})
```

---

## Field Types Lengkap

| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| `CharField(max_length=n)` | VARCHAR | Teks pendek, wajib `max_length` |
| `TextField()` | TEXT | Teks panjang tanpa batas |
| `IntegerField()` | INT | Bilangan bulat |
| `PositiveIntegerField()` | INT UNSIGNED | Hanya positif |
| `FloatField()` | FLOAT | Desimal (floating point) |
| `DecimalField(max_digits, decimal_places)` | DECIMAL | Uang/presisi tinggi |
| `BooleanField()` | TINYINT(1) | True/False |
| `DateField()` | DATE | Tanggal saja |
| `DateTimeField()` | DATETIME | Tanggal + waktu |
| `TimeField()` | TIME | Waktu saja |
| `EmailField()` | VARCHAR(254) | Validasi email otomatis |
| `URLField()` | VARCHAR(200) | Validasi URL |
| `SlugField()` | VARCHAR(50) | URL-safe string |
| `UUIDField()` | CHAR(32) | UUID |
| `FileField(upload_to=)` | VARCHAR | Path ke file |
| `ImageField(upload_to=)` | VARCHAR | Path ke image, butuh Pillow |
| `JSONField()` | JSON | Objek JSON (PostgreSQL/MySQL 5.7+) |

### Field Options Umum

```python
class Product(models.Model):
    name = models.CharField(
        max_length=200,
        verbose_name='Nama Produk',   # label di Admin
        help_text='Nama lengkap produk',
        unique=True,                   # UNIQUE constraint
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,                     # nilai default
    )
    description = models.TextField(
        blank=True,                    # boleh kosong di form
        null=True,                     # boleh NULL di database
    )
    category = models.CharField(
        max_length=50,
        choices=[                      # dropdown di Admin/form
            ('electronics', 'Elektronik'),
            ('clothing', 'Pakaian'),
            ('food', 'Makanan'),
        ],
        default='electronics',
    )
    created_at = models.DateTimeField(auto_now_add=True)  # isi otomatis saat create
    updated_at = models.DateTimeField(auto_now=True)       # update otomatis setiap save
```

---

## Relasi Antar Model

### ForeignKey (One-to-Many)

```python
class Post(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,    # hapus post jika user dihapus
        related_name='posts'         # User.posts.all() ← reverse relation
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,   # set null jika category dihapus
        null=True,
        blank=True,
        related_name='posts'
    )

# Opsi on_delete:
# CASCADE    — hapus juga (default)
# SET_NULL   — set ke NULL (butuh null=True)
# SET_DEFAULT — set ke default value
# PROTECT    — cegah hapus, raise ProtectedError
# DO_NOTHING — tidak lakukan apa-apa (berbahaya)
```

### ManyToManyField

```python
class Post(models.Model):
    tags = models.ManyToManyField('Tag', blank=True, related_name='posts')

class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

# Penggunaan
post = Post.objects.get(id=1)
post.tags.add(tag1, tag2)          # tambah tag
post.tags.remove(tag1)             # hapus tag
post.tags.set([tag2, tag3])        # replace semua
post.tags.clear()                  # hapus semua
post.tags.all()                    # ambil semua tag

# Dengan through model (extra fields pada relasi)
class PostTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    added_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    tags = models.ManyToManyField(Tag, through='PostTag')
```

### OneToOneField

```python
# Pattern umum: extend User model dengan profil tambahan
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                 related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    
# Akses
user = User.objects.get(username='ana')
user.profile.bio        # akses profil
user.profile.avatar.url # akses avatar URL
```

---

## Model Inheritance

### Abstract Base Class (paling umum)

```python
class TimestampMixin(models.Model):
    """Mixin yang ditambahkan ke semua model yang butuh timestamps."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True  # tidak membuat tabel sendiri

class Post(TimestampMixin):
    title = models.CharField(max_length=200)
    # Otomatis punya created_at dan updated_at

class Comment(TimestampMixin):
    body = models.TextField()
    # Otomatis punya created_at dan updated_at
```

### Multi-table Inheritance

```python
class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    # → tabel: blog_article

class FeaturedArticle(Article):
    is_featured = models.BooleanField(default=True)
    featured_image = models.ImageField()
    # → tabel: blog_featuredarticle (JOIN dengan blog_article)
```

### Proxy Model

```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    is_published = models.BooleanField(default=False)

class PublishedPostManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)

class PublishedPost(Post):
    """Proxy model — pakai tabel Post yang sama, behaviour berbeda."""
    objects = PublishedPostManager()
    
    class Meta:
        proxy = True
        ordering = ['-id']

# Penggunaan
PublishedPost.objects.all()  # hanya yang published
```

---

## Meta Inner Class

```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    pub_date = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-pub_date']         # urutan default
        verbose_name = 'Artikel'         # nama di Admin (singular)
        verbose_name_plural = 'Artikel'  # nama di Admin (plural)
        db_table = 'blog_articles'       # nama tabel custom
        unique_together = [['author', 'title']]  # unique constraint gabungan
        indexes = [
            models.Index(fields=['pub_date']),
            models.Index(fields=['author', 'is_published']),
        ]
        permissions = [
            ('can_publish', 'Bisa mempublikasikan artikel'),
            ('can_feature', 'Bisa memfeatured artikel'),
        ]
```

---

## Django Admin Registration

```python
# blog/admin.py
from django.contrib import admin
from .models import Post, Category, Tag

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display   = ('title', 'author', 'category', 'is_published', 'pub_date')
    list_filter    = ('is_published', 'category', 'pub_date')
    search_fields  = ('title', 'body', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'pub_date'
    ordering       = ('-pub_date',)
    list_per_page  = 25
    
    fieldsets = (
        ('Konten', {'fields': ('title', 'slug', 'body', 'excerpt')}),
        ('Meta', {'fields': ('author', 'category', 'tags', 'cover_image')}),
        ('Publikasi', {'fields': ('is_published', 'pub_date'), 'classes': ('collapse',)}),
    )

admin.site.register(Category)
admin.site.register(Tag)
```

---

## Query API: CRUD dan Filtering

### Create

```python
# Cara 1: create() — langsung save
post = Post.objects.create(
    title='Judul Post',
    slug='judul-post',
    author=user,
    body='Isi artikel'
)

# Cara 2: konstruktor + save()
post = Post(title='Judul Post', slug='judul-post', author=user)
post.body = 'Isi artikel'
post.save()

# get_or_create — hindari duplikat
category, created = Category.objects.get_or_create(
    slug='teknologi',
    defaults={'name': 'Teknologi'}
)
```

### Read

```python
# Ambil semua
posts = Post.objects.all()

# Filter
published = Post.objects.filter(is_published=True)
by_author = Post.objects.filter(author__username='ana')

# Exclude
drafts = Post.objects.exclude(is_published=True)

# Get satu objek (raise exception jika tidak ada / lebih dari satu)
post = Post.objects.get(slug='judul-post')
post = Post.objects.get(id=1)

# get_or_none (Django 6+) / custom
try:
    post = Post.objects.get(slug='tidak-ada')
except Post.DoesNotExist:
    post = None

# Shortcuts di views
from django.shortcuts import get_object_or_404
post = get_object_or_404(Post, slug='judul-post', is_published=True)
```

### Lookup Operators

```python
Post.objects.filter(title__exact='Django')         # = 'Django'
Post.objects.filter(title__iexact='django')        # case-insensitive
Post.objects.filter(title__contains='Django')      # LIKE '%Django%'
Post.objects.filter(title__icontains='django')     # case-insensitive LIKE
Post.objects.filter(title__startswith='Django')    # LIKE 'Django%'
Post.objects.filter(title__endswith='Guide')       # LIKE '%Guide'
Post.objects.filter(pub_date__year=2024)           # WHERE YEAR(pub_date) = 2024
Post.objects.filter(pub_date__gte='2024-01-01')    # >= tanggal
Post.objects.filter(pub_date__lt='2024-06-01')     # < tanggal
Post.objects.filter(view_count__gt=100)            # > 100
Post.objects.filter(author__in=[user1, user2])     # IN (...)
Post.objects.filter(cover_image__isnull=True)      # IS NULL
Post.objects.filter(tags__name='Python')           # JOIN ke tags
```

### Update dan Delete

```python
# Update satu objek
post = Post.objects.get(id=1)
post.title = 'Judul Baru'
post.save()

# Bulk update (lebih efisien)
Post.objects.filter(author=user).update(is_published=True)

# Delete satu
post.delete()

# Bulk delete
Post.objects.filter(is_published=False, created_at__lt='2023-01-01').delete()
```

### Chaining dan Ordering

```python
posts = (Post.objects
    .filter(is_published=True)
    .filter(category__slug='teknologi')
    .exclude(author__username='spam')
    .order_by('-pub_date', 'title')
    .select_related('author', 'category')
    [:10]  # limit
)

# Q objects: OR query
from django.db.models import Q

results = Post.objects.filter(
    Q(title__icontains='django') | Q(body__icontains='django')
)

# Kompleks: (A AND B) OR (C AND D)
Post.objects.filter(
    (Q(is_published=True) & Q(category__slug='tech')) |
    (Q(is_featured=True) & Q(view_count__gt=1000))
)
```

---

## Optimasi Query: select_related dan prefetch_related

```python
# N+1 problem — BAD
posts = Post.objects.filter(is_published=True)
for post in posts:
    print(post.author.username)  # query baru setiap iterasi!
    print(post.category.name)    # query lagi!

# select_related — GOOD (JOIN untuk ForeignKey/OneToOne)
posts = Post.objects.select_related('author', 'category').filter(is_published=True)
for post in posts:
    print(post.author.username)  # tidak ada query tambahan
    print(post.category.name)    # tidak ada query tambahan

# prefetch_related — untuk ManyToMany dan reverse ForeignKey
posts = Post.objects.prefetch_related('tags', 'comments').filter(is_published=True)
for post in posts:
    for tag in post.tags.all():    # tidak ada query tambahan
        print(tag.name)
```

---

## Aggregasi dan Anotasi

```python
from django.db.models import Count, Sum, Avg, Max, Min, F

# Aggregate — satu nilai untuk seluruh queryset
from blog.models import Post
stats = Post.objects.aggregate(
    total=Count('id'),
    avg_views=Avg('view_count'),
    max_views=Max('view_count'),
)
# {'total': 150, 'avg_views': 234.5, 'max_views': 10250}

# Annotate — tambah kolom ke setiap baris
categories = Category.objects.annotate(
    post_count=Count('posts'),
    total_views=Sum('posts__view_count'),
).order_by('-post_count')

for cat in categories:
    print(f"{cat.name}: {cat.post_count} post, {cat.total_views} views")

# F expression — referensi ke kolom lain (tidak load ke Python)
Post.objects.filter(view_count__gt=F('like_count') * 10)
Post.objects.update(view_count=F('view_count') + 1)
```

---

## Raw SQL

Ketika QuerySet tidak cukup:

```python
# objects.raw() — masih menghasilkan model instances
posts = Post.objects.raw(
    'SELECT * FROM blog_post WHERE view_count > %s ORDER BY pub_date DESC',
    [1000]
)
for post in posts:
    print(post.title)

# cursor — full SQL freedom
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT c.name, COUNT(p.id) as cnt
        FROM blog_category c
        LEFT JOIN blog_post p ON p.category_id = c.id
        GROUP BY c.id, c.name
        ORDER BY cnt DESC
    """)
    rows = cursor.fetchall()
    
for name, count in rows:
    print(f"{name}: {count} post")
```

---

## manage.py untuk Database

```bash
# Buat file migrasi dari perubahan model
python manage.py makemigrations
python manage.py makemigrations blog  # untuk app tertentu

# Terapkan migrasi ke database
python manage.py migrate
python manage.py migrate blog         # migrate app tertentu
python manage.py migrate blog 0003    # rollback ke migrasi tertentu

# Lihat status migrasi
python manage.py showmigrations

# Generate migrasi kosong (untuk data migration)
python manage.py makemigrations --empty blog

# Masuk ke shell database
python manage.py dbshell

# Generate model dari database yang sudah ada
python manage.py inspectdb
python manage.py inspectdb > models_generated.py

# Django interactive shell
python manage.py shell
```

---

## Ringkasan

| Konsep | Syntax |
|--------|--------|
| Buat record | `Model.objects.create(...)` |
| Ambil semua | `Model.objects.all()` |
| Filter | `Model.objects.filter(field__lookup=value)` |
| Get satu | `Model.objects.get(pk=1)` |
| Update bulk | `Model.objects.filter(...).update(field=value)` |
| Delete bulk | `Model.objects.filter(...).delete()` |
| OR query | `Q(a=1) \| Q(b=2)` |
| Optimasi FK | `select_related('author')` |
| Optimasi M2M | `prefetch_related('tags')` |
| Count | `Model.objects.aggregate(n=Count('id'))` |
| Anotasi | `Category.objects.annotate(n=Count('posts'))` |

---

**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
