---
title: "Django Templates dan Forms: Rendering dan Validasi Data"
description: Kuasai Django Template Language dan Forms API — sintaks tag dan
  filter, template inheritance, form class, ModelForm, validasi field, widget
  kustom, CSRF protection, dan penanganan file upload di Django.
pubDate: 2026-08-14T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Templates
  - Forms
  - Python
series: "Django Web"
seriesOrder: 5
---

Dua komponen yang paling sering berinteraksi dengan pengguna di aplikasi Django adalah **template** (tampilan HTML) dan **form** (input data). Chapter 6 dari *Python Web Development with Django* membahas keduanya secara mendalam — dari sintaks Django Template Language hingga validasi form yang robust.

## Daftar Isi

- [Django Template Language (DTL)](#django-template-language-dtl)
- [Template Inheritance](#template-inheritance)
- [Tag Bawaan](#tag-bawaan)
- [Filter Bawaan](#filter-bawaan)
- [Custom Template Tags dan Filters](#custom-template-tags-dan-filters)
- [Django Forms API](#django-forms-api)
- [ModelForm](#modelform)
- [Validasi Form](#validasi-form)
- [Widget Kustom](#widget-kustom)
- [CSRF Protection](#csrf-protection)
- [File Upload](#file-upload)
- [Formset](#formset)

---

## Django Template Language (DTL)

DTL adalah bahasa template yang sengaja dibuat sederhana — logika bisnis tidak boleh ada di template.

```python
# settings.py — konfigurasi template
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # direktori template global
        'APP_DIRS': True,                   # cari di app/templates/
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

### Variabel

```html
<!-- Akses variabel dari context -->
{{ post.title }}
{{ post.author.username }}
{{ post.pub_date }}

<!-- Akses item list/dict -->
{{ posts.0 }}           <!-- item pertama list -->
{{ user.profile.bio }}  <!-- chained attribute -->
```

---

## Template Inheritance

Cara terbaik menghindari duplikasi HTML adalah template inheritance.

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Ngopidulur{% endblock %}</title>
    {% block extra_css %}{% endblock %}
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">Home</a>
        <a href="{% url 'blog:post-list' %}">Blog</a>
        {% if user.is_authenticated %}
            <a href="{% url 'dashboard' %}">Dashboard</a>
            <a href="{% url 'logout' %}">Logout</a>
        {% else %}
            <a href="{% url 'login' %}">Login</a>
        {% endif %}
    </nav>

    <main>
        {% if messages %}
            {% for message in messages %}
                <div class="alert alert-{{ message.tags }}">{{ message }}</div>
            {% endfor %}
        {% endif %}

        {% block content %}{% endblock %}
    </main>

    <footer>
        <p>&copy; {% now "Y" %} Ngopidulur</p>
    </footer>

    {% block extra_js %}{% endblock %}
</body>
</html>
```

```html
<!-- templates/blog/post_list.html -->
{% extends 'base.html' %}
{% load static %}

{% block title %}Artikel — Ngopidulur{% endblock %}

{% block content %}
<h1>Artikel Terbaru</h1>

{% for post in posts %}
    <article>
        <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>
        <p>Oleh {{ post.author.get_full_name }} · {{ post.pub_date|date:"d M Y" }}</p>
        <p>{{ post.excerpt|default:post.body|truncatewords:30 }}</p>
    </article>
{% empty %}
    <p>Belum ada artikel.</p>
{% endfor %}

<!-- Pagination -->
{% if posts.has_other_pages %}
<nav>
    {% if posts.has_previous %}
        <a href="?page={{ posts.previous_page_number }}">← Sebelumnya</a>
    {% endif %}
    <span>{{ posts.number }} / {{ posts.paginator.num_pages }}</span>
    {% if posts.has_next %}
        <a href="?page={{ posts.next_page_number }}">Selanjutnya →</a>
    {% endif %}
</nav>
{% endif %}
{% endblock %}
```

---

## Tag Bawaan

```html
<!-- if/elif/else -->
{% if user.is_superuser %}
    <a href="{% url 'admin:index' %}">Admin Panel</a>
{% elif user.is_staff %}
    <a href="{% url 'dashboard' %}">Dashboard</a>
{% else %}
    <a href="{% url 'login' %}">Login</a>
{% endif %}

<!-- if dengan operator -->
{% if posts|length > 5 %}
{% if user.age >= 18 and user.is_active %}
{% if tag == 'python' or tag == 'django' %}
{% if not user.is_anonymous %}

<!-- for loop -->
{% for post in posts %}
    <li>{{ forloop.counter }}. {{ post.title }}</li>
    <!-- forloop.counter    → 1, 2, 3...
         forloop.counter0   → 0, 1, 2...
         forloop.revcounter → n, n-1, n-2...
         forloop.first      → True untuk item pertama
         forloop.last       → True untuk item terakhir -->
{% endfor %}

<!-- for dengan empty -->
{% for comment in post.comments.all %}
    <p>{{ comment.body }}</p>
{% empty %}
    <p>Belum ada komentar.</p>
{% endfor %}

<!-- block dan extends sudah dibahas di atas -->

<!-- include — sisipkan template lain -->
{% include 'partials/sidebar.html' %}
{% include 'partials/post_card.html' with post=featured_post %}

<!-- url — generate URL dari name -->
{% url 'blog:post-detail' slug=post.slug %}
{% url 'blog:archive' year=2024 month=6 %}

<!-- static — URL ke static file -->
{% load static %}
<img src="{% static 'images/logo.png' %}" alt="Logo">
<link rel="stylesheet" href="{% static 'css/style.css' %}">

<!-- csrf_token — wajib di form POST -->
<form method="post">
    {% csrf_token %}
    ...
</form>

<!-- with — assign variabel sementara -->
{% with total=business.employees.count %}
    Jumlah karyawan: {{ total }}
{% endwith %}

<!-- comment — komentar yang tidak dirender -->
{% comment "Ini tidak akan tampil" %}
    Kode lama yang dikomentari
{% endcomment %}

<!-- now — tanggal/waktu saat ini -->
{% now "d F Y, H:i" %}
```

---

## Filter Bawaan

```html
<!-- String -->
{{ name|upper }}                       <!-- HURUF KAPITAL -->
{{ name|lower }}                       <!-- huruf kecil -->
{{ name|title }}                       <!-- Setiap Kata Kapital -->
{{ body|truncatewords:50 }}            <!-- potong 50 kata -->
{{ body|truncatechars:200 }}           <!-- potong 200 karakter -->
{{ body|wordcount }}                   <!-- hitung kata -->
{{ bio|linebreaks }}                   <!-- \n → <p> -->
{{ bio|linebreaksbr }}                 <!-- \n → <br> -->
{{ name|slugify }}                     <!-- "Judul Post" → "judul-post" -->
{{ html_content|safe }}                <!-- disable auto-escaping -->
{{ user_input|escape }}                <!-- force escaping -->
{{ text|striptags }}                   <!-- hapus tag HTML -->

<!-- Number -->
{{ price|floatformat:2 }}              <!-- 12345.6789 → 12345.68 -->
{{ count|default:0 }}                  <!-- nilai default jika falsy -->
{{ number|divisibleby:3 }}             <!-- True jika habis dibagi 3 -->

<!-- Date -->
{{ pub_date|date:"d M Y" }}            <!-- 15 Agustus 2024 -->
{{ pub_date|date:"D, d N Y H:i" }}     <!-- Rab, 15 Ags 2024 10:30 -->
{{ pub_date|timesince }}               <!-- "3 hari yang lalu" -->
{{ pub_date|timeuntil }}               <!-- "2 jam lagi" -->

<!-- List -->
{{ tags|join:", " }}                   <!-- gabung dengan separator -->
{{ posts|length }}                     <!-- panjang list -->
{{ posts|first }}                      <!-- item pertama -->
{{ posts|last }}                       <!-- item terakhir -->
{{ posts|slice:":5" }}                 <!-- 5 item pertama -->
{{ items|dictsort:"name" }}            <!-- sort list of dicts -->

<!-- Misc -->
{{ value|default:"Tidak ada" }}        <!-- jika None/False/'' -->
{{ value|default_if_none:"N/A" }}      <!-- hanya jika None -->
{{ image.url|filesizeformat }}         <!-- "1.2 MB" -->
{{ text|add:"!" }}                     <!-- tambah string -->
```

---

## Custom Template Tags dan Filters

```python
# blog/templatetags/blog_tags.py
from django import template
from django.utils.html import format_html
from blog.models import Post, Category

register = template.Library()

# Simple tag — mengembalikan nilai
@register.simple_tag
def total_posts():
    return Post.objects.filter(is_published=True).count()

@register.simple_tag(takes_context=True)
def active_link(context, url_name):
    request = context['request']
    from django.urls import resolve
    try:
        current = resolve(request.path_info).url_name
        if current == url_name:
            return 'active'
    except:
        pass
    return ''

# Inclusion tag — render template lain
@register.inclusion_tag('blog/partials/recent_posts.html')
def recent_posts(count=5):
    posts = Post.objects.filter(is_published=True).order_by('-pub_date')[:count]
    return {'posts': posts}

@register.inclusion_tag('blog/partials/categories.html', takes_context=True)
def show_categories(context):
    return {
        'categories': Category.objects.all(),
        'current': context.get('current_category'),
    }

# Custom filter
@register.filter(name='reading_time')
def reading_time(text):
    """Estimasi waktu baca dalam menit."""
    word_count = len(text.split())
    minutes = max(1, round(word_count / 200))
    return f"{minutes} menit"

@register.filter
def highlight(text, query):
    """Highlight kata pencarian dalam teks."""
    if not query:
        return text
    import re
    highlighted = re.sub(
        f'({re.escape(query)})',
        r'<mark>\1</mark>',
        text,
        flags=re.IGNORECASE
    )
    return format_html(highlighted)
```

```html
<!-- Pakai di template -->
{% load blog_tags %}

<p>Total: {% total_posts %} artikel</p>
<a href="{% url 'home' %}" class="{% active_link 'home' %}">Home</a>

{% recent_posts count=3 %}
{% show_categories %}

{{ post.body|reading_time }}
{{ post.excerpt|highlight:query }}
```

---

## Django Forms API

```python
# blog/forms.py
from django import forms
from django.core.validators import MinLengthValidator

class ContactForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        label='Nama Lengkap',
        widget=forms.TextInput(attrs={'placeholder': 'Masukkan nama...', 'class': 'form-control'}),
        validators=[MinLengthValidator(3, 'Nama minimal 3 karakter')],
    )
    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
    )
    subject = forms.ChoiceField(
        choices=[
            ('', '— Pilih topik —'),
            ('feedback', 'Feedback'),
            ('kerjasama', 'Kerjasama'),
            ('lainnya', 'Lainnya'),
        ],
        widget=forms.Select(attrs={'class': 'form-select'}),
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5, 'class': 'form-control'}),
        label='Pesan',
    )
    subscribe = forms.BooleanField(required=False, label='Subscribe newsletter')
```

```python
# views.py
def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name    = form.cleaned_data['name']
            email   = form.cleaned_data['email']
            message = form.cleaned_data['message']
            # kirim email, simpan ke DB, dll.
            from django.contrib import messages
            messages.success(request, 'Pesan berhasil dikirim!')
            return redirect('contact')
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})
```

```html
<!-- contact.html -->
<form method="post" novalidate>
    {% csrf_token %}
    
    <!-- Cara 1: auto render -->
    {{ form.as_p }}
    
    <!-- Cara 2: manual per field (lebih kontrol) -->
    {% for field in form %}
        <div class="mb-3">
            {{ field.label_tag }}
            {{ field }}
            {% if field.errors %}
                {% for error in field.errors %}
                    <div class="invalid-feedback d-block">{{ error }}</div>
                {% endfor %}
            {% endif %}
            {% if field.help_text %}
                <small class="form-text">{{ field.help_text }}</small>
            {% endif %}
        </div>
    {% endfor %}
    
    <button type="submit">Kirim</button>
</form>
```

---

## ModelForm

```python
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'slug', 'body', 'excerpt', 'category', 'tags',
                  'cover_image', 'is_published']
        # atau: exclude = ['author', 'created_at', 'updated_at', 'view_count']
        
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'autofocus': True}),
            'slug': forms.TextInput(attrs={'class': 'form-control'}),
            'body': forms.Textarea(attrs={'class': 'form-control', 'rows': 15}),
            'excerpt': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'is_published': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'title': 'Judul Artikel',
            'body': 'Konten',
            'is_published': 'Publikasikan sekarang',
        }
        help_texts = {
            'slug': 'URL-friendly identifier (auto-generated dari judul)',
        }

# Pakai di view
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)  # FILES untuk ImageField
        if form.is_valid():
            post = form.save(commit=False)  # belum save ke DB
            post.author = request.user      # set author
            post.save()                     # save ke DB
            form.save_m2m()                 # save ManyToMany (tags)
            return redirect(post)
    else:
        # Pre-fill slug dari judul via JavaScript
        form = PostForm()
    return render(request, 'blog/post_form.html', {'form': form})
```

---

## Validasi Form

```python
class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=50)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    
    # Validasi per-field: validate_<fieldname>
    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('Username sudah dipakai.')
        if not username.isalnum():
            raise forms.ValidationError('Username hanya boleh huruf dan angka.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Email sudah terdaftar.')
        return email.lower()  # normalized
    
    # Validasi cross-field: clean()
    def clean(self):
        cleaned = super().clean()
        password = cleaned.get('password')
        confirm = cleaned.get('confirm_password')
        
        if password and confirm and password != confirm:
            raise forms.ValidationError('Password tidak cocok.')
        
        if password and len(password) < 8:
            self.add_error('password', 'Password minimal 8 karakter.')
        
        return cleaned
```

---

## Widget Kustom

```python
class DatePickerInput(forms.DateInput):
    input_type = 'date'
    
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('attrs', {}).update({'class': 'form-control'})
        super().__init__(*args, **kwargs)

class ColorPickerWidget(forms.TextInput):
    input_type = 'color'

class StarRatingWidget(forms.RadioSelect):
    template_name = 'widgets/star_rating.html'

# Pakai di form
class EventForm(forms.Form):
    start_date = forms.DateField(widget=DatePickerInput)
    color = forms.CharField(widget=ColorPickerWidget)
    rating = forms.ChoiceField(
        choices=[(i, i) for i in range(1, 6)],
        widget=StarRatingWidget
    )
```

---

## CSRF Protection

```html
<!-- Wajib di setiap form POST -->
<form method="post">
    {% csrf_token %}
    ...
</form>

<!-- AJAX: kirim CSRF token di header -->
<script>
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

fetch('/api/like/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({post_id: 1}),
});
</script>
```

---

## File Upload

```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# urls.py (development only)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# models.py
class Post(models.Model):
    cover_image = models.ImageField(
        upload_to='posts/%Y/%m/',  # media/posts/2024/08/
        blank=True
    )
    attachment = models.FileField(
        upload_to='attachments/',
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'docx', 'xlsx'])]
    )

# views.py — handle file upload
def upload_view(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)  # wajib request.FILES
        if form.is_valid():
            uploaded_file = request.FILES['file']
            # Validasi ukuran
            if uploaded_file.size > 5 * 1024 * 1024:  # 5 MB
                form.add_error('file', 'File maksimal 5 MB')
            else:
                form.save()
```

```html
<!-- form harus enctype="multipart/form-data" -->
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Upload</button>
</form>
```

---

## Formset

Formset memungkinkan edit banyak form sekaligus.

```python
from django.forms import modelformset_factory, inlineformset_factory

# ModelFormset — banyak instance model sekaligus
PostFormSet = modelformset_factory(Post, fields=['title', 'is_published'], extra=2)

def bulk_edit(request):
    if request.method == 'POST':
        formset = PostFormSet(request.POST, queryset=Post.objects.filter(author=request.user))
        if formset.is_valid():
            formset.save()
            return redirect('blog:post-list')
    else:
        formset = PostFormSet(queryset=Post.objects.filter(author=request.user))
    return render(request, 'blog/bulk_edit.html', {'formset': formset})

# InlineFormset — edit relasi dalam satu halaman
PhotoFormSet = inlineformset_factory(Post, Photo, fields=['image', 'caption'], extra=3, can_delete=True)
```

---

## Ringkasan

| Konsep | Sintaks |
|--------|---------|
| Variable | `{{ var }}` |
| Tag | `{% tag %}` |
| Filter | `{{ var\|filter:arg }}` |
| Inheritance | `{% extends 'base.html' %}` + `{% block name %}` |
| Include | `{% include 'partial.html' with key=val %}` |
| Form render | `{{ form.as_p }}` atau manual per field |
| ModelForm | `class F(ModelForm): class Meta: model = M` |
| Validasi | `clean_field()` + `clean()` |
| CSRF | `{% csrf_token %}` wajib di setiap POST |
| File upload | `enctype="multipart/form-data"` + `request.FILES` |

---

**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
