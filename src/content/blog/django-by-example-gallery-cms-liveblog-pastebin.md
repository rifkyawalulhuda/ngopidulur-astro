---
title: "Django by Example: Gallery, CMS, Liveblog, dan Pastebin"
description: Belajar Django dari proyek nyata - photo gallery dengan upload
  gambar, mini CMS dengan rich text, liveblog Ajax polling, dan pastebin
  dengan syntax highlighting menggunakan Pygments.
pubDate: 2026-08-15T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Python
  - Tutorial
  - ProjectBased
---

Teori tanpa praktik tidak lengkap. Chapter 7–10 dari *Python Web Development with Django* mengajak kita membangun empat aplikasi nyata: photo gallery, mini CMS, liveblog real-time, dan pastebin dengan syntax highlighting. Masing-masing mengajarkan pola Django yang berbeda dan bisa langsung kamu adaptasi.

## Daftar Isi

- [Photo Gallery: Upload dan Resize Gambar](#photo-gallery)
- [Mini CMS: Content Management System](#mini-cms)
- [Liveblog: Real-Time dengan Ajax](#liveblog)
- [Pastebin: Syntax Highlighting dengan Pygments](#pastebin)



## Photo Gallery: Upload dan Resize Gambar {#photo-gallery}

### Model

```python
# gallery/models.py
from django.db import models
from django.contrib.auth.models import User

class Album(models.Model):
    title       = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    owner       = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at  = models.DateTimeField(auto_now_add=True)
    is_public   = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Photo(models.Model):
    album      = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="photos")
    title      = models.CharField(max_length=200, blank=True)
    image      = models.ImageField(upload_to="gallery/%Y/%m/")
    thumbnail  = models.ImageField(upload_to="gallery/thumbs/", blank=True)
    caption    = models.TextField(blank=True)
    order      = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "uploaded_at"]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._generate_thumbnail()

    def _generate_thumbnail(self):
        from PIL import Image
        import os
        from django.core.files.base import ContentFile
        from io import BytesIO

        if not self.image:
            return
        img = Image.open(self.image.path)
        img.thumbnail((300, 300), Image.LANCZOS)

        thumb_io = BytesIO()
        fmt = "JPEG" if img.format != "PNG" else "PNG"
        img.save(thumb_io, format=fmt, quality=85)

        thumb_name = os.path.basename(self.image.name)
        self.thumbnail.save(thumb_name, ContentFile(thumb_io.getvalue()), save=False)
        Photo.objects.filter(pk=self.pk).update(thumbnail=self.thumbnail.name)
```

### View Upload Multi-File

```python
# gallery/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from .models import Album, Photo
from .forms import PhotoUploadForm

def album_list(request):
    albums = Album.objects.filter(is_public=True).prefetch_related("photos")
    return render(request, "gallery/album_list.html", {"albums": albums})

def album_detail(request, slug):
    album  = get_object_or_404(Album, slug=slug, is_public=True)
    photos = album.photos.all()
    # Pagination
    from django.core.paginator import Paginator
    paginator = Paginator(photos, 12)
    page      = request.GET.get("page", 1)
    return render(request, "gallery/album_detail.html", {
        "album": album,
        "photos": paginator.get_page(page),
    })

@login_required
def photo_upload(request, album_slug):
    album = get_object_or_404(Album, slug=album_slug, owner=request.user)
    if request.method == "POST":
        files = request.FILES.getlist("images")   # multi-file
        for f in files:
            Photo.objects.create(album=album, image=f, title=f.name)
        return redirect("gallery:album-detail", slug=album_slug)
    return render(request, "gallery/upload.html", {"album": album})
```

### Template Grid

```html
<!-- gallery/templates/gallery/album_detail.html -->
{% extends "base.html" %}
{% block content %}
<h1>{{ album.title }}</h1>
<div class="photo-grid">
    {% for photo in photos %}
    <div class="photo-card">
        <a href="{{ photo.image.url }}" data-lightbox="album">
            <img src="{{ photo.thumbnail.url }}" alt="{{ photo.title|default:"Photo" }}"
                 loading="lazy">
        </a>
        {% if photo.caption %}<p>{{ photo.caption }}</p>{% endif %}
    </div>
    {% endfor %}
</div>
{% if photos.has_other_pages %}
<nav class="pagination">
    {% if photos.has_previous %}
        <a href="?page={{ photos.previous_page_number }}">&laquo; Prev</a>
    {% endif %}
    Halaman {{ photos.number }} / {{ photos.paginator.num_pages }}
    {% if photos.has_next %}
        <a href="?page={{ photos.next_page_number }}">Next &raquo;</a>
    {% endif %}
</nav>
{% endif %}
{% endblock %}
```



## Mini CMS: Content Management System {#mini-cms}

### Model Hierarki Halaman

```python
# cms/models.py
from django.db import models
from django.utils.text import slugify

class Page(models.Model):
    title       = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True)
    parent      = models.ForeignKey("self", on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name="children")
    content     = models.TextField()  # HTML dari rich text editor
    template    = models.CharField(max_length=100, default="cms/page.html")
    is_published = models.BooleanField(default=False)
    order       = models.PositiveIntegerField(default=0)
    meta_title  = models.CharField(max_length=70, blank=True)
    meta_desc   = models.CharField(max_length=160, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse("cms:page", kwargs={"slug": self.slug})

    def get_breadcrumb(self):
        crumbs = [self]
        p = self.parent
        while p:
            crumbs.insert(0, p)
            p = p.parent
        return crumbs
```

### Custom Admin

```python
# cms/admin.py
from django.contrib import admin
from .models import Page

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display   = ("title", "parent", "is_published", "order", "updated_at")
    list_filter    = ("is_published", "parent")
    search_fields  = ("title", "content")
    prepopulated_fields = {"slug": ("title",)}
    list_editable  = ("is_published", "order")
    fieldsets = (
        ("Konten", {"fields": ("title", "slug", "parent", "content", "template")}),
        ("SEO",    {"fields": ("meta_title", "meta_desc"), "classes": ("collapse",)}),
        ("Status", {"fields": ("is_published", "order")}),
    )
```

### Custom Template Tag untuk Navigasi

```python
# cms/templatetags/cms_tags.py
from django import template
from cms.models import Page

register = template.Library()

@register.inclusion_tag("cms/partials/nav.html", takes_context=True)
def cms_nav(context):
    pages = Page.objects.filter(is_published=True, parent=None).order_by("order")
    return {"pages": pages, "request": context.get("request")}

@register.inclusion_tag("cms/partials/breadcrumb.html")
def breadcrumb(page):
    return {"crumbs": page.get_breadcrumb()}
```

```html
<!-- cms/templates/cms/partials/nav.html -->
<ul class="nav">
{% for page in pages %}
    <li {% if request.path == page.get_absolute_url %}class="active"{% endif %}>
        <a href="{{ page.get_absolute_url }}">{{ page.title }}</a>
        {% if page.children.exists %}
        <ul class="dropdown">
            {% for child in page.children.filter(is_published=True) %}
                <li><a href="{{ child.get_absolute_url }}">{{ child.title }}</a></li>
            {% endfor %}
        </ul>
        {% endif %}
    </li>
{% endfor %}
</ul>
```



## Liveblog: Real-Time dengan Ajax {#liveblog}

### Model

```python
# liveblog/models.py
from django.db import models
from django.contrib.auth.models import User
import uuid

class Event(models.Model):
    title      = models.CharField(max_length=200)
    slug       = models.SlugField(unique=True)
    is_live    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Update(models.Model):
    event     = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="updates")
    author    = models.ForeignKey(User, on_delete=models.CASCADE)
    content   = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_pinned = models.BooleanField(default=False)

    class Meta:
        ordering = ["-timestamp"]
```

### View dengan JsonResponse

```python
# liveblog/views.py
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from .models import Event, Update

def liveblog_view(request, slug):
    event   = get_object_or_404(Event, slug=slug, is_live=True)
    updates = event.updates.select_related("author")[:20]
    return render(request, "liveblog/event.html", {
        "event": event,
        "updates": updates,
    })

@require_GET
def poll_updates(request, slug):
    """
    Ajax polling endpoint — client panggil setiap N detik.
    since = timestamp update terakhir yang sudah diterima client.
    """
    since = request.GET.get("since")
    qs    = Update.objects.filter(event__slug=slug)
    if since:
        qs = qs.filter(timestamp__gt=since)

    updates = list(qs.values(
        "id", "content", "timestamp", "author__username", "is_pinned"
    ))
    return JsonResponse({
        "updates": updates,
        "count": len(updates),
    })

@login_required
@require_POST
def post_update(request, slug):
    """Tambah update baru (hanya staff)."""
    if not request.user.is_staff:
        return JsonResponse({"error": "Forbidden"}, status=403)
    import json
    data    = json.loads(request.body)
    content = data.get("content", "").strip()
    if not content:
        return JsonResponse({"error": "Content kosong"}, status=400)
    event  = get_object_or_404(Event, slug=slug, is_live=True)
    update = Update.objects.create(event=event, author=request.user, content=content)
    return JsonResponse({
        "id": update.id,
        "content": update.content,
        "author": update.author.username,
        "timestamp": update.timestamp.isoformat(),
    }, status=201)
```

### Frontend Polling

```html
<!-- liveblog/templates/liveblog/event.html -->
{% extends "base.html" %}
{% block content %}
<h1>{{ event.title }} <span class="live-badge">LIVE</span></h1>
<div id="updates-feed">
    {% for update in updates %}
    <div class="update" data-id="{{ update.id }}">
        <strong>{{ update.author.username }}</strong>
        <time>{{ update.timestamp|date:"H:i:s" }}</time>
        <p>{{ update.content }}</p>
    </div>
    {% endfor %}
</div>

<script>
let lastTimestamp = "{{ updates.0.timestamp.isoformat|default:"" }}";

async function pollUpdates() {
    const url = "{% url 'liveblog:poll' event.slug %}" +
                (lastTimestamp ? "?since=" + encodeURIComponent(lastTimestamp) : "");
    const res  = await fetch(url);
    const data = await res.json();

    if (data.updates.length > 0) {
        const feed = document.getElementById("updates-feed");
        data.updates.forEach(u => {
            // Cek duplikat
            if (document.querySelector(`[data-id="${u.id}"]`)) return;
            const div = document.createElement("div");
            div.className = "update";
            div.dataset.id = u.id;
            div.innerHTML = `<strong>${u.author__username}</strong>
                             <time>${new Date(u.timestamp).toLocaleTimeString()}</time>
                             <p>${u.content}</p>`;
            feed.prepend(div);
        });
        lastTimestamp = data.updates[0].timestamp;
    }
}

// Poll setiap 5 detik saat event live
setInterval(pollUpdates, 5000);
</script>
{% endblock %}
```



## Pastebin: Syntax Highlighting dengan Pygments {#pastebin}

### Model

```python
# paste/models.py
from django.db import models
from django.utils import timezone
import uuid, hashlib

LANGUAGE_CHOICES = [
    ("python", "Python"),
    ("javascript", "JavaScript"),
    ("html", "HTML"),
    ("css", "CSS"),
    ("java", "Java"),
    ("cpp", "C++"),
    ("sql", "SQL"),
    ("bash", "Bash"),
    ("json", "JSON"),
    ("text", "Plain Text"),
]

EXPIRY_CHOICES = [
    (None, "Never"),
    (1,    "1 Jam"),
    (24,   "1 Hari"),
    (168,  "1 Minggu"),
    (720,  "1 Bulan"),
]

class Paste(models.Model):
    uid        = models.CharField(max_length=10, unique=True, editable=False)
    title      = models.CharField(max_length=200, blank=True, default="Untitled")
    content    = models.TextField()
    language   = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default="text")
    author     = models.ForeignKey("auth.User", on_delete=models.SET_NULL,
                                   null=True, blank=True)
    is_private = models.BooleanField(default=False)
    expiry_hours = models.IntegerField(null=True, blank=True, choices=EXPIRY_CHOICES)
    expires_at = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.uid:
            # Generate short unique ID
            self.uid = hashlib.md5(
                (str(uuid.uuid4()) + self.content[:20]).encode()
            ).hexdigest()[:8]
        if self.expiry_hours and not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=self.expiry_hours)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    def get_highlighted(self):
        from pygments import highlight
        from pygments.lexers import get_lexer_by_name, TextLexer
        from pygments.formatters import HtmlFormatter
        try:
            lexer = get_lexer_by_name(self.language, stripall=True)
        except Exception:
            lexer = TextLexer()
        formatter = HtmlFormatter(
            linenos=True,
            cssclass="highlight",
            style="monokai"
        )
        return highlight(self.content, lexer, formatter)
```

### View

```python
# paste/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.http import Http404
from .models import Paste
from .forms import PasteForm

def paste_create(request):
    if request.method == "POST":
        form = PasteForm(request.POST)
        if form.is_valid():
            paste = form.save(commit=False)
            if request.user.is_authenticated:
                paste.author = request.user
            paste.save()
            return redirect("paste:detail", uid=paste.uid)
    else:
        form = PasteForm()
    return render(request, "paste/create.html", {"form": form})

def paste_detail(request, uid):
    paste = get_object_or_404(Paste, uid=uid)
    if paste.is_expired:
        paste.delete()
        raise Http404("Paste sudah expired")
    if paste.is_private and paste.author != request.user:
        raise Http404("Paste tidak ditemukan")
    # Increment view count
    Paste.objects.filter(pk=paste.pk).update(view_count=models.F("view_count") + 1)
    highlighted = paste.get_highlighted()
    return render(request, "paste/detail.html", {
        "paste": paste,
        "highlighted": highlighted,
    })

def paste_raw(request, uid):
    paste = get_object_or_404(Paste, uid=uid)
    from django.http import HttpResponse
    return HttpResponse(paste.content, content_type="text/plain; charset=utf-8")
```

### Template dengan Pygments CSS

```html
<!-- paste/templates/paste/detail.html -->
{% extends "base.html" %}
{% block extra_css %}
<style>
/* Pygments Monokai theme */
.highlight { background: #272822; border-radius: 8px; padding: 1rem; overflow-x: auto; }
.highlight .ln { color: #75715e; margin-right: 1rem; user-select: none; }
</style>
{% endblock %}

{% block content %}
<div class="paste-header">
    <h1>{{ paste.title }}</h1>
    <div class="meta">
        <span>{{ paste.language }}</span>
        <span>{{ paste.view_count }} views</span>
        <span>{{ paste.created_at|timesince }} lalu</span>
        {% if paste.expires_at %}
            <span>Expires: {{ paste.expires_at|timeuntil }}</span>
        {% endif %}
    </div>
    <div class="actions">
        <a href="{% url 'paste:raw' paste.uid %}">Raw</a>
        <button onclick="navigator.clipboard.writeText(`{{ paste.content|escapejs }}`)">
            Copy
        </button>
    </div>
</div>

<div class="paste-content">
    {{ highlighted|safe }}
</div>
{% endblock %}
```

### Management Command: Cleanup Expired

```python
# paste/management/commands/cleanup_pastes.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from paste.models import Paste

class Command(BaseCommand):
    help = "Hapus paste yang sudah expired"

    def handle(self, *args, **options):
        expired = Paste.objects.filter(expires_at__lt=timezone.now())
        count   = expired.count()
        expired.delete()
        self.stdout.write(self.style.SUCCESS(f"Dihapus {count} paste expired"))
```

Jadwalkan dengan cron:
```bash
# crontab -e
0 */6 * * * cd /var/www/mysite && python manage.py cleanup_pastes
```



## Ringkasan Perbandingan Empat Aplikasi

| Aplikasi | Fitur Utama | Teknik Django |
|----------|-------------|---------------|
| Gallery | Upload + thumbnail | `ImageField`, Pillow resize, pagination |
| CMS | Hierarki halaman | Self-referential FK, custom template tags |
| Liveblog | Real-time updates | `JsonResponse`, Ajax polling, `F()` expression |
| Pastebin | Syntax highlight | Pygments, `uid` auto-generate, expiry |



**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
