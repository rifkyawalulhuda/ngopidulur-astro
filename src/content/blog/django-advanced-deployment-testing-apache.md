---
title: "Advanced Django Deployment: Testing, Apache, dan Optimasi"
description: Panduan deployment Django ke production \u2014 unit testing dengan
  Django TestCase, konfigurasi Apache mod_wsgi, virtual environments, utility
  scripts, manajemen settings per-environment, dan optimasi performa production.
pubDate: 2026-08-17T08:00:00.000Z
image: /image/django-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Django
  - Python
  - Deployment
  - Testing
series: "Django Web"
seriesOrder: 8
---

Aplikasi Django yang berjalan di development server bukanlah aplikasi production. Ada jurang besar antara `python manage.py runserver` dan server production yang bisa menangani ribuan request per menit. Chapter 12 dari *Python Web Development with Django* membahas semua yang perlu kamu ketahui untuk menutup jurang itu: testing yang benar, deployment ke Apache, manajemen konfigurasi, utility scripts, dan optimasi.

## Daftar Isi

- [Django Testing Framework](#django-testing-framework)
- [Writing Utility Scripts](#writing-utility-scripts)
- [Manajemen Settings Per-Environment](#manajemen-settings-per-environment)
- [Deployment ke Apache dengan mod_wsgi](#deployment-ke-apache-dengan-mod_wsgi)
- [Virtual Environments dan Dependencies](#virtual-environments-dan-dependencies)
- [Static Files di Production](#static-files-di-production)
- [Database di Production](#database-di-production)
- [Monitoring dan Logging](#monitoring-dan-logging)
- [Checklist Production](#checklist-production)

---

## Django Testing Framework

Django menyediakan testing framework yang powerful berdasarkan Python `unittest`.

### Unit Test Dasar

```python
# tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from .models import Post, Category

class PostModelTest(TestCase):
    
    def setUp(self):
        """Dipanggil sebelum setiap test method."""
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Teknologi',
            slug='teknologi'
        )
    
    def test_post_creation(self):
        """Post bisa dibuat dengan data minimal."""
        post = Post.objects.create(
            title='Test Post',
            slug='test-post',
            body='Ini adalah konten test.',
            author=self.user,
            category=self.category
        )
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(str(post), 'Test Post')
        self.assertFalse(post.is_published)  # default draft
    
    def test_slug_auto_generated(self):
        """Slug otomatis dibuat dari title jika tidak diisi."""
        post = Post(title='Judul Artikel Baru', author=self.user)
        post.save()
        self.assertEqual(post.slug, 'judul-artikel-baru')
    
    def test_post_ordering(self):
        """Post diurutkan dari yang terbaru."""
        Post.objects.create(title='Post 1', author=self.user,
                           slug='post-1', is_published=True)
        Post.objects.create(title='Post 2', author=self.user,
                           slug='post-2', is_published=True)
        posts = Post.objects.filter(is_published=True)
        self.assertEqual(posts[0].title, 'Post 2')  # terbaru duluan
    
    def tearDown(self):
        """Cleanup setelah setiap test (opsional, DB di-reset otomatis)."""
        pass
```

### Test Client: Integration Test

```python
from django.test import TestCase, Client
from django.urls import reverse

class PostViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user('testuser', password='pass')
        self.post = Post.objects.create(
            title='Test Post',
            slug='test-post',
            body='Konten test',
            author=self.user,
            is_published=True
        )
    
    def test_post_list_view(self):
        """Halaman list post bisa diakses."""
        response = self.client.get(reverse('blog:post-list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog/post_list.html')
        self.assertContains(response, 'Test Post')
    
    def test_post_detail_view(self):
        """Halaman detail post menampilkan konten yang benar."""
        url = reverse('blog:post-detail', kwargs={'slug': 'test-post'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Post')
        self.assertContains(response, 'Konten test')
    
    def test_post_detail_404(self):
        """Post yang tidak ada mengembalikan 404."""
        url = reverse('blog:post-detail', kwargs={'slug': 'tidak-ada'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
    
    def test_create_post_requires_login(self):
        """Membuat post butuh login."""
        url = reverse('blog:post-create')
        response = self.client.get(url)
        # Redirect ke login page
        self.assertRedirects(response, f'/accounts/login/?next={url}')
    
    def test_create_post_authenticated(self):
        """User yang login bisa membuat post."""
        self.client.login(username='testuser', password='pass')
        url = reverse('blog:post-create')
        data = {
            'title': 'Post Baru',
            'slug': 'post-baru',
            'body': 'Isi post baru',
            'is_published': True,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)  # redirect setelah sukses
        self.assertTrue(Post.objects.filter(slug='post-baru').exists())
    
    def test_search_functionality(self):
        """Search menemukan post yang relevan."""
        response = self.client.get(
            reverse('blog:post-list') + '?q=Test'
        )
        self.assertContains(response, 'Test Post')
```

### Test Form Validation

```python
from .forms import ContactForm, PostForm

class ContactFormTest(TestCase):
    
    def test_valid_form(self):
        data = {
            'name': 'Ana Bell',
            'email': 'ana@example.com',
            'message': 'Halo, ini pesan test'
        }
        form = ContactForm(data=data)
        self.assertTrue(form.is_valid())
    
    def test_invalid_email(self):
        data = {
            'name': 'Ana Bell',
            'email': 'bukan-email',
            'message': 'Pesan'
        }
        form = ContactForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)
    
    def test_empty_required_field(self):
        data = {'name': '', 'email': 'ana@example.com', 'message': 'Test'}
        form = ContactForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)
```

### Jalankan Test

```bash
# Semua test
python manage.py test

# Test app tertentu
python manage.py test blog

# Test class tertentu
python manage.py test blog.tests.PostViewTest

# Test method tertentu
python manage.py test blog.tests.PostViewTest.test_post_list_view

# Verbose output
python manage.py test --verbosity=2

# Dengan coverage
pip install coverage
coverage run manage.py test
coverage report
coverage html  # buka htmlcov/index.html di browser
```

---

## Writing Utility Scripts

Django bisa digunakan di luar web request — untuk script, cron job, dan task yang berjalan di command line.

### Setup Django Environment di Script

```python
#!/usr/bin/env python
"""
Script untuk cleanup post draft yang lebih dari 30 hari.
Jalankan: python scripts/cleanup_drafts.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, '/var/www/myblog')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myblog.settings.production')
django.setup()

# Setelah setup, baru import model
from django.utils import timezone
from datetime import timedelta
from blog.models import Post

def cleanup_old_drafts():
    cutoff = timezone.now() - timedelta(days=30)
    old_drafts = Post.objects.filter(
        is_published=False,
        created_at__lt=cutoff
    )
    count = old_drafts.count()
    old_drafts.delete()
    print(f"Dihapus {count} draft lama")

if __name__ == '__main__':
    cleanup_old_drafts()
```

### Script dengan Argumen

```python
#!/usr/bin/env python
"""Generate sitemap XML secara manual."""
import argparse
import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ['DJANGO_SETTINGS_MODULE'] = 'myblog.settings.production'
django.setup()

from blog.models import Post

def main():
    parser = argparse.ArgumentParser(description='Generate sitemap')
    parser.add_argument('--output', default='sitemap.xml', help='Output file')
    parser.add_argument('--base-url', default='https://myblog.com')
    args = parser.parse_args()
    
    posts = Post.objects.filter(is_published=True).order_by('-pub_date')
    
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    
    for post in posts:
        lines.append(f'  <url>')
        lines.append(f'    <loc>{args.base_url}/blog/{post.slug}/</loc>')
        lines.append(f'    <lastmod>{post.updated_at.date()}</lastmod>')
        lines.append(f'  </url>')
    
    lines.append('</urlset>')
    
    with open(args.output, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f'Sitemap ditulis ke {args.output} ({posts.count()} URL)')

if __name__ == '__main__':
    main()
```

---

## Manajemen Settings Per-Environment

Jangan pakai satu `settings.py` untuk semua environment. Pisahkan:

```
myblog/
  settings/
    __init__.py
    base.py          ← settings yang sama di semua env
    development.py   ← override untuk dev
    production.py    ← override untuk production
    testing.py       ← override untuk test
```

```python
# settings/base.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',
]

# ... settings lain yang shared
```

```python
# settings/development.py
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

INSTALLED_APPS += ['debug_toolbar']

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

```python
# settings/production.py
from .base import *
import os

DEBUG = False
ALLOWED_HOSTS = ['myblog.com', 'www.myblog.com']

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 60,
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.environ['REDIS_URL'],
    }
}

STATIC_ROOT = '/var/www/myblog/static/'
MEDIA_ROOT = '/var/www/myblog/media/'

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

```bash
# Set environment variable untuk pilih settings
export DJANGO_SETTINGS_MODULE=myblog.settings.production
python manage.py runserver  # atau gunicorn
```

---

## Deployment ke Apache dengan mod_wsgi

### Install Dependencies

```bash
# Ubuntu/Debian
sudo apt install apache2 libapache2-mod-wsgi-py3
sudo a2enmod wsgi

# Install gunicorn (alternatif yang lebih modern)
pip install gunicorn
```

### Konfigurasi Apache Virtual Host

```apache
# /etc/apache2/sites-available/myblog.conf
<VirtualHost *:80>
    ServerName myblog.com
    ServerAlias www.myblog.com
    
    # Redirect HTTP ke HTTPS
    RewriteEngine On
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName myblog.com
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/myblog/cert.pem
    SSLCertificateKeyFile /etc/ssl/myblog/privkey.pem
    
    # WSGI configuration
    WSGIDaemonProcess myblog \
        python-path=/var/www/myblog \
        python-home=/var/www/myblog/venv \
        processes=4 \
        threads=2
    WSGIProcessGroup myblog
    WSGIScriptAlias / /var/www/myblog/myblog/wsgi.py
    
    # Static files — Apache langsung serve, tidak lewat Django
    Alias /static/ /var/www/myblog/static/
    <Directory /var/www/myblog/static>
        Require all granted
    </Directory>
    
    Alias /media/ /var/www/myblog/media/
    <Directory /var/www/myblog/media>
        Require all granted
    </Directory>
    
    <Directory /var/www/myblog/myblog>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/myblog_error.log
    CustomLog ${APACHE_LOG_DIR}/myblog_access.log combined
</VirtualHost>
```

### Gunicorn + Nginx (Alternatif Modern)

```bash
# gunicorn.service
[Unit]
Description=Gunicorn for myblog
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/myblog
Environment="DJANGO_SETTINGS_MODULE=myblog.settings.production"
EnvironmentFile=/var/www/myblog/.env
ExecStart=/var/www/myblog/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/run/gunicorn/myblog.sock \
    myblog.wsgi:application
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```nginx
# /etc/nginx/sites-available/myblog
server {
    listen 443 ssl;
    server_name myblog.com www.myblog.com;
    
    ssl_certificate /etc/ssl/myblog/cert.pem;
    ssl_certificate_key /etc/ssl/myblog/privkey.pem;
    
    location /static/ {
        alias /var/www/myblog/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /media/ {
        alias /var/www/myblog/media/;
    }
    
    location / {
        proxy_pass http://unix:/run/gunicorn/myblog.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Virtual Environments dan Dependencies

```bash
# Buat virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Simpan dependencies
pip freeze > requirements.txt

# requirements.txt yang terstruktur
# requirements/
#   base.txt       ← semua env
#   development.txt
#   production.txt

# base.txt
Django>=4.2,<5.0
Pillow>=10.0
psycopg2-binary>=2.9
redis>=4.6
celery>=5.3

# production.txt
-r base.txt
gunicorn>=21.0
whitenoise>=6.5  # serve static files

# development.txt
-r base.txt
django-debug-toolbar>=4.2
coverage>=7.3

# Install
pip install -r requirements/production.txt
```

---

## Static Files di Production

```python
# settings/production.py
STATIC_URL = '/static/'
STATIC_ROOT = '/var/www/myblog/static/'  # tujuan collectstatic

MEDIA_URL = '/media/'
MEDIA_ROOT = '/var/www/myblog/media/'

# WhiteNoise untuk serve static dari Django (simpler, no separate web server)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # taruh setelah Security
    ...
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

```bash
# Kumpulkan semua static files ke STATIC_ROOT
python manage.py collectstatic --noinput

# Hasilnya:
# /var/www/myblog/static/
#   admin/     ← dari Django admin
#   blog/      ← dari app blog
#   css/
#   js/
#   images/
```

---

## Database di Production

```bash
# Jalankan migration
python manage.py migrate

# Buat superuser
python manage.py createsuperuser

# Backup database (PostgreSQL)
pg_dump -U dbuser myblog > backup_$(date +%Y%m%d).sql

# Restore
psql -U dbuser myblog < backup_20240115.sql

# Cek pending migrations
python manage.py showmigrations
```

---

## Monitoring dan Logging

```python
# settings/production.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/myblog/django.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'WARNING',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'blog': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}

ADMINS = [('Admin', 'admin@myblog.com')]
```

---

## Checklist Production

Sebelum go-live, pastikan semua ini sudah dikerjakan:

| Kategori | Item | Cara Cek |
|----------|------|----------|
| Security | `DEBUG = False` | `settings.py` |
| Security | `SECRET_KEY` dari env var | `os.environ['SECRET_KEY']` |
| Security | `ALLOWED_HOSTS` diisi | bukan `['*']` |
| Security | HTTPS enabled | SSL cert terpasang |
| Security | `SECURE_SSL_REDIRECT = True` | `settings.py` |
| Security | `SESSION_COOKIE_SECURE = True` | `settings.py` |
| Database | Pakai PostgreSQL/MySQL | bukan SQLite |
| Database | Connection pooling | `CONN_MAX_AGE` |
| Static | `collectstatic` dijalankan | folder `static/` ada |
| Cache | Redis atau Memcached | bukan LocMemCache |
| Logging | Log ke file | `/var/log/` |
| Email | SMTP diconfig | bukan console backend |
| Monitoring | Sentry atau similar | error tracking |
| Backup | Backup database otomatis | cron job |
| Performa | `python manage.py check --deploy` | 0 errors |

```bash
# Django deployment check
python manage.py check --deploy

# Output yang diharapkan:
# System check identified no issues (0 silenced).
```

---

## Ringkasan Seri Django

Kita sudah menyelesaikan perjalanan lengkap dari buku *Python Web Development with Django*:

| Artikel | Topik | Chapter |
|---------|-------|---------|
| 1 | Pengantar Django & Filosofi | Intro + Ch1 |
| 2 | Bangun Blog Pertama | Ch2 + Ch3 |
| 3 | ORM & Models | Ch4 |
| 4 | Views, URL, Middleware | Ch5 |
| 5 | Templates & Forms | Ch6 |
| 6 | Gallery, CMS, Liveblog, Pastebin | Ch7–10 |
| 7 | Advanced Programming | Ch11 |
| 8 | Advanced Deployment | Ch12 |

---

**Sumber:** Jeff Forcier, Paul Bissex, Wesley Chun, *Python Web Development with Django* (2008), Addison-Wesley.
