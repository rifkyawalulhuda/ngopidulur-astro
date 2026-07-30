---
title: "Advanced Django Programming: Admin, RSS, Sitemap, Cache"
description: Teknik lanjutan Django \u2014 kustomisasi Django Admin mendalam, feed
  RSS/Atom dengan syndication framework, sitemap otomatis, caching per-view dan
  per-site, signal, custom management commands, dan generic views tingkat lanjut.
pubDate: 2026-08-16T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Python
  - AdvancedDjango
  - WebDevelopment
---

Setelah menguasai dasar-dasar Django, saatnya naik level. Chapter 11 dari *Python Web Development with Django* membahas fitur-fitur yang membuat Django benar-benar bersinar di production: Admin yang bisa dikustomisasi sepenuhnya, RSS/Atom feed bawaan, sitemap otomatis, sistem caching berlapis, signal untuk event-driven programming, dan management commands kustom.

## Daftar Isi

- [Mengustomisasi Django Admin](#mengustomisasi-django-admin)
- [Syndication Framework: RSS dan Atom](#syndication-framework-rss-dan-atom)
- [Sitemap Framework](#sitemap-framework)
- [Sistem Caching Django](#sistem-caching-django)
- [Django Signals](#django-signals)
- [Custom Management Commands](#custom-management-commands)
- [Generic Views Tingkat Lanjut](#generic-views-tingkat-lanjut)
- [Sessions dan Cookies](#sessions-dan-cookies)

---

## Mengustomisasi Django Admin

Django Admin adalah salah satu fitur paling powerful yang membedakan Django dari framework lain. Di luar penggunaan dasar `admin.site.register()`, Admin bisa dikustomisasi sangat dalam.

### ModelAdmin Dasar

```python
# admin.py
from django.contrib import admin
from .models import Post, Category, Tag

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # Kolom yang ditampilkan di list view
    list_display = ('title', 'author', 'category', 'pub_date', 'is_published')
    
    # Field yang bisa diklik untuk masuk detail
    list_display_links = ('title',)
    
    # Filter di sidebar kanan
    list_filter = ('is_published', 'category', 'pub_date')
    
    # Search box
    search_fields = ('title', 'body', 'author__username')
    
    # Ordering default
    ordering = ('-pub_date',)
    
    # Jumlah item per halaman
    list_per_page = 25
    
    # Auto-isi slug dari title
    prepopulated_fields = {'slug': ('title',)}
    
    # Date hierarchy navigation
    date_hierarchy = 'pub_date'
    
    # Field yang bisa diedit langsung di list
    list_editable = ('is_published',)
```

### Fieldsets: Atur Layout Form

```python
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Informasi Utama', {
            'fields': ('title', 'slug', 'author', 'category')
        }),
        ('Konten', {
            'fields': ('body', 'excerpt'),
            'classes': ('wide',),
        }),
        ('Publikasi', {
            'fields': ('is_published', 'pub_date', 'tags'),
            'classes': ('collapse',),  # collapsed by default
            'description': 'Atur jadwal dan status publikasi',
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
    )
```

### Inline Admin: Edit Relasi dalam Satu Halaman

```python
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0  # tidak tampilkan form kosong
    fields = ('author', 'body', 'created_at', 'is_approved')
    readonly_fields = ('created_at',)
    can_delete = True

class PhotoInline(admin.StackedInline):
    model = Photo
    extra = 1
    fields = ('image', 'caption', 'order')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = [PhotoInline, CommentInline]
```

### Custom Actions

```python
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    actions = ['publish_posts', 'unpublish_posts', 'export_as_csv']
    
    @admin.action(description='Publikasikan post terpilih')
    def publish_posts(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} post berhasil dipublikasikan.')
    
    @admin.action(description='Sembunyikan post terpilih')
    def unpublish_posts(self, request, queryset):
        queryset.update(is_published=False)
    
    @admin.action(description='Export ke CSV')
    def export_as_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="posts.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Title', 'Author', 'Published', 'Date'])
        for post in queryset:
            writer.writerow([
                post.id, post.title, post.author.username,
                post.is_published, post.pub_date
            ])
        return response
```

### Custom List Display dengan Method

```python
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'colored_status', 'comment_count', 'thumbnail_preview')
    
    @admin.display(description='Status', ordering='is_published')
    def colored_status(self, obj):
        from django.utils.html import format_html
        color = 'green' if obj.is_published else 'red'
        label = 'Published' if obj.is_published else 'Draft'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, label
        )
    
    @admin.display(description='Komentar')
    def comment_count(self, obj):
        return obj.comments.count()
    
    @admin.display(description='Thumbnail')
    def thumbnail_preview(self, obj):
        from django.utils.html import format_html
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="height: 50px; width: auto;" />',
                obj.cover_image.url
            )
        return '-'
```

### Override Template Admin

```
# Buat direktori: templates/admin/myapp/post/
# change_list.html       — override list view
# change_form.html       — override form edit
# templates/admin/base_site.html — override branding
```

```html
<!-- templates/admin/base_site.html -->
{% extends "admin/base.html" %}
{% block branding %}
<h1 id="site-name">
    <a href="{% url 'admin:index' %}">
        🌟 My Blog Admin
    </a>
</h1>
{% endblock %}
```

---

## Syndication Framework: RSS dan Atom

Django punya framework bawaan untuk membuat feed RSS dan Atom tanpa library eksternal.

```python
# feeds.py
from django.contrib.syndication.views import Feed
from django.urls import reverse
from .models import Post

class LatestPostsFeed(Feed):
    title = "Ngopidulur — Artikel Terbaru"
    link = "/feeds/latest/"
    description = "Update artikel terbaru dari blog Ngopidulur"
    
    def items(self):
        return Post.objects.filter(is_published=True).order_by('-pub_date')[:20]
    
    def item_title(self, item):
        return item.title
    
    def item_description(self, item):
        return item.excerpt or item.body[:200]
    
    def item_link(self, item):
        return reverse('blog:post-detail', args=[item.slug])
    
    def item_pubdate(self, item):
        return item.pub_date
    
    def item_author_name(self, item):
        return item.author.get_full_name()
    
    def item_categories(self, item):
        return [item.category.name] if item.category else []

# urls.py
from .feeds import LatestPostsFeed

urlpatterns = [
    path('feeds/latest/', LatestPostsFeed(), name='feed-latest'),
]
```

### Atom Feed

```python
from django.utils.feedgenerator import Atom1Feed

class LatestPostsAtomFeed(LatestPostsFeed):
    feed_type = Atom1Feed
    subtitle = LatestPostsFeed.description
    link = "/feeds/atom/"
```

---

## Sitemap Framework

```python
# INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'django.contrib.sitemaps',
]

# sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Post, Category

class PostSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8
    protocol = 'https'
    
    def items(self):
        return Post.objects.filter(is_published=True)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('blog:post-detail', args=[obj.slug])

class CategorySitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.6
    
    def items(self):
        return Category.objects.all()
    
    def location(self, obj):
        return reverse('blog:category', args=[obj.slug])

class StaticViewSitemap(Sitemap):
    priority = 0.9
    changefreq = 'monthly'
    
    def items(self):
        return ['home', 'about', 'contact']
    
    def location(self, item):
        return reverse(item)

# urls.py
from django.contrib.sitemaps.views import sitemap
from .sitemaps import PostSitemap, CategorySitemap, StaticViewSitemap

sitemaps = {
    'posts': PostSitemap,
    'categories': CategorySitemap,
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]
```

---

## Sistem Caching Django

Django mendukung berbagai backend cache. Caching yang tepat bisa mempercepat halaman 10-100x.

### Konfigurasi Cache Backend

```python
# settings.py

# Memory cache (development)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Redis (production — direkomendasikan)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT': 300,  # 5 menit default
    }
}

# Memcached
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

# File-based (sederhana, tidak perlu service tambahan)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/var/tmp/django_cache',
        'TIMEOUT': 600,
    }
}
```

### Per-View Cache

```python
from django.views.decorators.cache import cache_page, never_cache

# Cache view selama 15 menit
@cache_page(60 * 15)
def post_list(request):
    posts = Post.objects.filter(is_published=True)
    return render(request, 'blog/post_list.html', {'posts': posts})

# Cache di URLconf (lebih fleksibel)
from django.views.decorators.cache import cache_page
urlpatterns = [
    path('', cache_page(60 * 15)(views.post_list), name='post-list'),
]

# Jangan cache (untuk halaman yang selalu fresh)
@never_cache
def dashboard(request):
    ...
```

### Low-Level Cache API

```python
from django.core.cache import cache

# Set dengan timeout
cache.set('popular_posts', posts_queryset, timeout=60 * 30)

# Get dengan default
posts = cache.get('popular_posts', default=None)

# Get-or-set pattern
def get_popular_posts():
    posts = cache.get('popular_posts')
    if posts is None:
        posts = Post.objects.annotate(
            view_count=Count('views')
        ).order_by('-view_count')[:10]
        cache.set('popular_posts', posts, 60 * 30)
    return posts

# Delete
cache.delete('popular_posts')

# Delete many
cache.delete_many(['popular_posts', 'recent_posts', 'categories'])

# Increment/Decrement (untuk counter)
cache.set('page_views', 0)
cache.incr('page_views')
views = cache.get('page_views')
```

### Template Fragment Caching

```html
{% load cache %}

{# Cache bagian ini selama 600 detik #}
{% cache 600 sidebar %}
    <aside>
        {% for category in categories %}
            <a href="{{ category.get_absolute_url }}">{{ category.name }}</a>
        {% endfor %}
    </aside>
{% endcache %}

{# Cache per-user (berbeda untuk setiap user) #}
{% cache 300 user_widget request.user.id %}
    <div>Halo, {{ request.user.username }}!</div>
{% endcache %}
```

---

## Django Signals

Signals memungkinkan komponen yang berbeda untuk berkomunikasi tanpa coupling langsung — event-driven programming di Django.

```python
# signals.py
from django.db.models.signals import post_save, pre_delete, m2m_changed
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import Post, UserProfile

# Signal: setelah Post disimpan
@receiver(post_save, sender=Post)
def post_saved_handler(sender, instance, created, **kwargs):
    if created:
        # Post baru — kirim notifikasi subscriber
        notify_subscribers.delay(instance.id)  # Celery task
        print(f"Post baru dibuat: {instance.title}")
    else:
        # Post diupdate — invalidate cache
        cache.delete(f'post_{instance.slug}')
        cache.delete('recent_posts')

# Signal: otomatis buat UserProfile saat User dibuat
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

# Signal: sebelum delete
@receiver(pre_delete, sender=Post)
def post_pre_delete(sender, instance, **kwargs):
    # Backup atau cleanup sebelum dihapus
    if instance.cover_image:
        instance.cover_image.delete(save=False)

# Custom signal
from django.dispatch import Signal

post_published = Signal()  # custom signal

# Kirim signal
def publish_post(self):
    self.is_published = True
    self.save()
    post_published.send(sender=self.__class__, post=self)

# Terima signal
@receiver(post_published)
def on_post_published(sender, post, **kwargs):
    send_newsletter.delay(post.id)
```

### Daftarkan Signal di apps.py

```python
# apps.py
class BlogConfig(AppConfig):
    name = 'blog'
    
    def ready(self):
        import blog.signals  # import untuk mendaftarkan receivers
```

---

## Custom Management Commands

Management commands memungkinkan kamu menjalankan task arbitrary via `python manage.py`.

```python
# management/commands/send_newsletter.py
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from blog.models import Post, Subscriber

class Command(BaseCommand):
    help = 'Kirim newsletter ke semua subscriber aktif'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulasi tanpa benar-benar kirim email',
        )
        parser.add_argument(
            '--since',
            type=str,
            help='Kirim post sejak tanggal (format: YYYY-MM-DD)',
        )
        parser.add_argument(
            'post_ids',
            nargs='*',
            type=int,
            help='ID post spesifik yang akan dikirim',
        )
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Ambil post yang belum dikirim
        posts = Post.objects.filter(
            is_published=True,
            newsletter_sent=False
        )
        
        if options['post_ids']:
            posts = posts.filter(id__in=options['post_ids'])
        
        subscribers = Subscriber.objects.filter(is_active=True)
        
        self.stdout.write(
            self.style.SUCCESS(f'Ditemukan {posts.count()} post, {subscribers.count()} subscriber')
        )
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN — tidak ada email dikirim'))
            return
        
        sent = 0
        errors = 0
        for subscriber in subscribers:
            try:
                send_newsletter_email(subscriber, posts)
                sent += 1
            except Exception as e:
                self.stderr.write(f'Error untuk {subscriber.email}: {e}')
                errors += 1
        
        posts.update(newsletter_sent=True, newsletter_sent_at=timezone.now())
        
        self.stdout.write(
            self.style.SUCCESS(f'Selesai: {sent} berhasil, {errors} gagal')
        )
```

```python
# management/commands/cleanup_expired.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from paste.models import Paste

class Command(BaseCommand):
    help = 'Hapus paste yang sudah expired'
    
    def handle(self, *args, **options):
        expired = Paste.objects.filter(
            expires_at__lt=timezone.now()
        )
        count = expired.count()
        expired.delete()
        self.stdout.write(
            self.style.SUCCESS(f'Berhasil menghapus {count} paste expired')
        )
```

Jalankan:
```bash
python manage.py send_newsletter --dry-run
python manage.py send_newsletter --since 2024-01-01
python manage.py cleanup_expired
```

---

## Generic Views Tingkat Lanjut

```python
# views.py
from django.views.generic import (
    ListView, DetailView, CreateView, UpdateView, DeleteView
)
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse_lazy

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10
    ordering = ['-pub_date']
    
    def get_queryset(self):
        qs = super().get_queryset().filter(is_published=True)
        category = self.kwargs.get('category_slug')
        if category:
            qs = qs.filter(category__slug=category)
        q = self.request.GET.get('q')
        if q:
            qs = qs.filter(title__icontains=q)
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        context['current_category'] = self.kwargs.get('category_slug')
        return context

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'
    
    def get_object(self):
        obj = super().get_object()
        # Increment view count
        Post.objects.filter(pk=obj.pk).update(view_count=F('view_count') + 1)
        return obj

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['title', 'slug', 'body', 'category', 'cover_image', 'is_published']
    template_name = 'blog/post_form.html'
    success_url = reverse_lazy('blog:post-list')
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    fields = ['title', 'body', 'category', 'cover_image', 'is_published']
    template_name = 'blog/post_form.html'
    
    def get_success_url(self):
        return reverse_lazy('blog:post-detail', kwargs={'slug': self.object.slug})
    
    def get_queryset(self):
        # User hanya bisa edit post miliknya sendiri
        return super().get_queryset().filter(author=self.request.user)

class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = reverse_lazy('blog:post-list')
    
    def get_queryset(self):
        return super().get_queryset().filter(author=self.request.user)
```

---

## Sessions dan Cookies

```python
# Menyimpan data di session
def add_to_cart(request, product_id):
    cart = request.session.get('cart', {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + 1
    request.session['cart'] = cart
    request.session.modified = True  # force save
    return JsonResponse({'cart_count': sum(cart.values())})

# Membaca session
def cart_view(request):
    cart = request.session.get('cart', {})
    return render(request, 'cart.html', {'cart': cart})

# Hapus session key
def clear_cart(request):
    if 'cart' in request.session:
        del request.session['cart']
    return redirect('cart')

# Cookie
def set_preference(request):
    response = HttpResponse('Preferensi disimpan')
    response.set_cookie(
        'theme',
        'dark',
        max_age=365 * 24 * 60 * 60,  # 1 tahun
        httponly=True,
        samesite='Lax'
    )
    return response

def get_preference(request):
    theme = request.COOKIES.get('theme', 'light')
    return render(request, 'base.html', {'theme': theme})
```

---

## Ringkasan

| Fitur | Lokasi | Keterangan |
|-------|--------|------------|
| Admin kustom | `admin.py` | `list_display`, `fieldsets`, `inlines`, `actions` |
| RSS/Atom | `feeds.py` | Extend `Feed`, daftarkan di `urls.py` |
| Sitemap | `sitemaps.py` | `django.contrib.sitemaps` |
| Cache per-view | `@cache_page(detik)` | Decorator atau URLconf |
| Cache low-level | `cache.get/set/delete` | `from django.core.cache import cache` |
| Signals | `signals.py` + `apps.ready()` | `@receiver(post_save, sender=Model)` |
| Management cmd | `management/commands/` | Extend `BaseCommand` |
| Generic views | `django.views.generic` | `ListView`, `DetailView`, `CreateView`, dll. |

---

**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
