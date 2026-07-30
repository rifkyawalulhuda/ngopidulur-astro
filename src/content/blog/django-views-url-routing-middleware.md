---
title: "Django Views, URL Routing, dan Middleware Explained"
description: Panduan lengkap Django views dan URL routing — function-based vs
  class-based views, URLconf patterns, named URL, include(), generic views,
  request/response objects, dekorator, dan cara kerja middleware Django.
pubDate: 2026-08-13T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Python
  - URLRouting
  - Middleware
---

Views adalah jantung dari logika Django — di sinilah request HTTP masuk, diproses, dan response dikembalikan. Chapter 5 dari *Python Web Development with Django* membahas URLconf, HTTP mechanisms, dan berbagai jenis view secara lengkap.

## Daftar Isi

- [URLconf: Peta URL Django](#urlconf-peta-url-django)
- [HttpRequest dan HttpResponse](#httprequest-dan-httpresponse)
- [Function-Based Views](#function-based-views)
- [Class-Based Views](#class-based-views)
- [Generic Views untuk CRUD Cepat](#generic-views-untuk-crud-cepat)
- [Dekorator View](#dekorator-view)
- [Shortcuts Django](#shortcuts-django)
- [Middleware](#middleware)
- [Django Request/Response Lifecycle](#django-requestresponse-lifecycle)

---

## URLconf: Peta URL Django

URLconf adalah file `urls.py` yang memetakan pola URL ke fungsi view. Django membaca dari atas ke bawah dan menggunakan pola pertama yang cocok.

```python
# myproject/urls.py (root URLconf)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),      # delegate ke app
    path('api/', include('api.urls')),
    path('', include('pages.urls')),          # root URL
]
```

```python
# blog/urls.py
from django.urls import path, re_path
from . import views

app_name = 'blog'  # namespace untuk reverse URL

urlpatterns = [
    # path() — simple, literal matching
    path('', views.post_list, name='post-list'),
    path('post/<slug:slug>/', views.post_detail, name='post-detail'),
    path('post/<int:pk>/edit/', views.post_edit, name='post-edit'),
    path('category/<slug:slug>/', views.category_view, name='category'),
    path('archive/<int:year>/<int:month>/', views.archive, name='archive'),
    
    # re_path() — regex, lebih fleksibel
    re_path(r'^tag/(?P<slug>[\w-]+)/$', views.tag_view, name='tag'),
]
```

### Path Converters

```
<int:pk>      → integer, e.g. 42
<str:slug>    → non-empty string tanpa '/'
<slug:slug>   → ASCII letters, numbers, hyphens, underscores
<uuid:id>     → UUID format
<path:rest>   → string termasuk '/'
```

### Named URL dan reverse()

```python
# Di template
{% url 'blog:post-detail' slug=post.slug %}
{% url 'blog:archive' year=2024 month=6 %}

# Di Python
from django.urls import reverse
url = reverse('blog:post-detail', kwargs={'slug': 'judul-post'})
# '/blog/post/judul-post/'

# redirect ke named URL
from django.shortcuts import redirect
return redirect('blog:post-list')
return redirect('blog:post-detail', slug='judul-post')
```

---

## HttpRequest dan HttpResponse

### HttpRequest Object

```python
def my_view(request):
    # Method HTTP
    request.method          # 'GET', 'POST', 'PUT', 'DELETE', dll.
    
    # Data dari client
    request.GET             # QueryDict dari query string
    request.POST            # QueryDict dari form POST
    request.FILES           # MultiValueDict dari file upload
    request.COOKIES         # dict cookies
    request.META            # dict HTTP headers dan server vars
    
    # Session dan auth
    request.session         # session dict
    request.user            # user object (AnonymousUser jika belum login)
    request.user.is_authenticated  # True/False
    
    # Info request
    request.path            # '/blog/post/judul-post/'
    request.get_full_path() # '/blog/post/judul-post/?page=2'
    request.is_secure()     # True jika HTTPS
    request.is_ajax()       # True jika XMLHttpRequest (deprecated di Django 4)
    
    # Contoh akses
    page = request.GET.get('page', 1)
    email = request.POST.get('email', '')
    ip = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
```

### HttpResponse dan Variannya

```python
from django.http import (
    HttpResponse, JsonResponse, HttpResponseRedirect,
    HttpResponseNotFound, HttpResponseForbidden,
    Http404, HttpResponseBadRequest
)

# Basic response
return HttpResponse("Hello, World!", content_type="text/plain", status=200)

# HTML response
return HttpResponse("<h1>Judul</h1>", content_type="text/html")

# JSON response
return JsonResponse({'status': 'ok', 'data': [1, 2, 3]})
return JsonResponse({'items': list}, safe=False)  # safe=False untuk non-dict

# Redirect
return HttpResponseRedirect('/blog/')
return redirect('blog:post-list')  # shortcut

# Error responses
return HttpResponseNotFound('<h1>404 Not Found</h1>')
return HttpResponseForbidden('403 Forbidden')
return HttpResponseBadRequest('400 Bad Request')
raise Http404("Post tidak ditemukan")

# Download file
with open('/path/to/file.pdf', 'rb') as f:
    response = HttpResponse(f.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="dokumen.pdf"'
    return response
```

---

## Function-Based Views

FBV adalah cara paling eksplisit dan fleksibel menulis view.

```python
# blog/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Post, Category
from .forms import PostForm

def post_list(request):
    """Daftar semua post yang dipublikasikan."""
    category_slug = request.GET.get('category')
    posts = Post.objects.filter(is_published=True).select_related('author', 'category')
    
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    
    q = request.GET.get('q')
    if q:
        from django.db.models import Q
        posts = posts.filter(Q(title__icontains=q) | Q(body__icontains=q))
    
    # Pagination
    from django.core.paginator import Paginator
    paginator = Paginator(posts, 10)  # 10 per halaman
    page = request.GET.get('page', 1)
    posts_page = paginator.get_page(page)
    
    context = {
        'posts': posts_page,
        'categories': Category.objects.all(),
        'query': q or '',
    }
    return render(request, 'blog/post_list.html', context)

def post_detail(request, slug):
    """Detail satu post."""
    post = get_object_or_404(Post, slug=slug, is_published=True)
    # Increment view count tanpa load seluruh objek
    Post.objects.filter(pk=post.pk).update(view_count=models.F('view_count') + 1)
    return render(request, 'blog/post_detail.html', {'post': post})

@login_required
def post_create(request):
    """Buat post baru — hanya untuk user yang login."""
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            form.save_m2m()  # simpan ManyToMany fields
            return redirect('blog:post-detail', slug=post.slug)
    else:
        form = PostForm()
    return render(request, 'blog/post_form.html', {'form': form, 'action': 'Buat'})

@login_required
def post_edit(request, pk):
    """Edit post — hanya pemilik yang bisa."""
    post = get_object_or_404(Post, pk=pk, author=request.user)
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            return redirect('blog:post-detail', slug=post.slug)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_form.html', {'form': form, 'action': 'Edit'})
```

---

## Class-Based Views

CBV menggunakan inheritance untuk mengurangi boilerplate.

```python
from django.views import View
from django.views.generic import (
    TemplateView, ListView, DetailView,
    CreateView, UpdateView, DeleteView
)
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse_lazy

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10
    
    def get_queryset(self):
        qs = Post.objects.filter(is_published=True).select_related('author', 'category')
        q = self.request.GET.get('q')
        if q:
            from django.db.models import Q
            qs = qs.filter(Q(title__icontains=q) | Q(body__icontains=q))
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
    slug_field = 'slug'
    
    def get_queryset(self):
        return Post.objects.filter(is_published=True)

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'
    success_url = reverse_lazy('blog:post-list')
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
    
    def get_success_url(self):
        return reverse_lazy('blog:post-detail', kwargs={'slug': self.object.slug})

class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = reverse_lazy('blog:post-list')
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

# urls.py untuk CBV
urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('post/<slug:slug>/', PostDetailView.as_view(), name='post-detail'),
    path('post/baru/', PostCreateView.as_view(), name='post-create'),
    path('post/<int:pk>/edit/', PostUpdateView.as_view(), name='post-edit'),
    path('post/<int:pk>/hapus/', PostDeleteView.as_view(), name='post-delete'),
]
```

---

## Generic Views untuk CRUD Cepat

```python
# Untuk app sederhana — bisa pakai ModelViewSet (DRF) atau CBV generik
# Contoh: halaman statis
from django.views.generic import TemplateView

urlpatterns = [
    path('tentang/', TemplateView.as_view(template_name='pages/about.html'), name='about'),
    path('kontak/', TemplateView.as_view(template_name='pages/contact.html'), name='contact'),
]

# Redirect view
from django.views.generic import RedirectView
path('blog/', RedirectView.as_view(url='/posts/', permanent=True)),
```

---

## Dekorator View

```python
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods, require_POST, require_GET
from django.views.decorators.cache import cache_page, never_cache
from django.views.decorators.csrf import csrf_exempt

# Butuh login
@login_required(login_url='/masuk/')
def dashboard(request): ...

# Butuh permission
@permission_required('blog.add_post', raise_exception=True)
def post_create(request): ...

# Hanya POST
@require_POST
def delete_comment(request, pk): ...

# Hanya GET atau POST
@require_http_methods(['GET', 'POST'])
def contact(request): ...

# Cache 15 menit
@cache_page(60 * 15)
def post_list(request): ...

# Jangan cache
@never_cache
def api_realtime(request): ...

# Skip CSRF (hati-hati — hanya untuk API yang sudah punya auth sendiri)
@csrf_exempt
def webhook(request): ...

# Kombinasi dekorator
@login_required
@require_POST
def like_post(request, pk): ...
```

---

## Shortcuts Django

```python
from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404

# render — shortcut untuk render template
return render(request, 'template.html', context_dict)
# setara dengan: HttpResponse(loader.render_to_string('template.html', context, request))

# redirect — shortcut untuk HttpResponseRedirect
return redirect('/blog/')
return redirect('blog:post-list')
return redirect('blog:post-detail', slug='judul')
return redirect(post)  # pakai get_absolute_url()

# get_object_or_404 — ambil atau raise 404
post = get_object_or_404(Post, slug=slug, is_published=True)
# setara dengan:
try:
    post = Post.objects.get(slug=slug, is_published=True)
except Post.DoesNotExist:
    raise Http404

# get_list_or_404 — list atau raise 404 jika kosong
posts = get_list_or_404(Post, category__slug=slug, is_published=True)
```

---

## Middleware

Middleware adalah lapisan yang memproses request sebelum masuk ke view, dan response sebelum dikirim ke client.

### Cara Kerja Middleware

```
Request → Middleware1 → Middleware2 → ... → View
Response ← Middleware1 ← Middleware2 ← ... ← View
```

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',        # HTTPS, headers keamanan
    'django.contrib.sessions.middleware.SessionMiddleware', # session
    'django.middleware.common.CommonMiddleware',            # URL normalisasi
    'django.middleware.csrf.CsrfViewMiddleware',            # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # request.user
    'django.contrib.messages.middleware.MessageMiddleware', # flash messages
    'django.middleware.clickjacking.XFrameOptionsMiddleware',   # X-Frame-Options
]
```

### Custom Middleware

```python
# myapp/middleware.py
import time
import logging

logger = logging.getLogger(__name__)

class RequestTimingMiddleware:
    """Log berapa lama setiap request diproses."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start = time.time()
        
        response = self.get_response(request)  # ← view dieksekusi di sini
        
        duration = time.time() - start
        logger.info(f"{request.method} {request.path} — {duration:.3f}s — {response.status_code}")
        
        # Tambahkan header ke response
        response['X-Response-Time'] = f"{duration:.3f}s"
        return response
    
    def process_exception(self, request, exception):
        """Dipanggil jika view melempar exception."""
        logger.error(f"Exception di {request.path}: {exception}")
        return None  # None = biarkan Django handle

class MaintenanceModeMiddleware:
    """Redirect semua request ke halaman maintenance."""
    
    MAINTENANCE_MODE = False  # toggle ini saat maintenance
    EXEMPT_PATHS = ['/admin/', '/api/health/']
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if self.MAINTENANCE_MODE:
            if not any(request.path.startswith(p) for p in self.EXEMPT_PATHS):
                from django.shortcuts import render
                return render(request, 'maintenance.html', status=503)
        return self.get_response(request)
```

Daftarkan di `settings.py`:
```python
MIDDLEWARE = [
    ...
    'myapp.middleware.RequestTimingMiddleware',
    'myapp.middleware.MaintenanceModeMiddleware',
]
```

---

## Django Request/Response Lifecycle

```
Browser
  │
  ▼ HTTP Request
WSGI Server (Gunicorn/uWSGI)
  │
  ▼
Django WSGI Application
  │
  ▼
SecurityMiddleware.process_request()
SessionMiddleware.process_request()
AuthenticationMiddleware.process_request()
  │
  ▼
URL Router (urls.py)
  │ Cari pola yang cocok
  ▼
View Function / Class
  │ Eksekusi logika
  │ Akses Model/DB
  │ Render Template
  ▼
HttpResponse
  │
  ▼
MessageMiddleware.process_response()
SessionMiddleware.process_response()
SecurityMiddleware.process_response()
  │
  ▼ HTTP Response
Browser
```

---

## Ringkasan

| Konsep | Syntax |
|--------|--------|
| URLconf dasar | `path('url/', view, name='name')` |
| Named URL di template | `{% url 'app:name' kwarg=val %}` |
| reverse() | `reverse('app:name', kwargs={...})` |
| FBV | `def view(request): return render(...)` |
| CBV list | `class View(ListView): model = M` |
| CBV CRUD | `CreateView`, `UpdateView`, `DeleteView` |
| Login required | `@login_required` / `LoginRequiredMixin` |
| Hanya POST | `@require_POST` |
| Custom middleware | Class dengan `__init__` + `__call__` |

---

**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
