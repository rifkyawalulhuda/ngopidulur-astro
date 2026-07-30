---
title: "Web Server Debian 10: Panduan Lengkap Instalasi LAMP Stack dan LEMP Stack"
description: Tutorial komprehensif setup web server di Debian 10 — LAMP Stack
  (Apache, MariaDB, PHP) dan LEMP Stack (Nginx, MariaDB, PHP-FPM). Dari
  instalasi, konfigurasi virtual host, SSL, optimasi performa, hingga
  perbandingan Apache vs Nginx.
pubDate: 2026-06-25T10:00:00.000Z
image: /image/debian10-server-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Debian
  - LAMP
  - LEMP
  - Apache
  - Nginx
  - MariaDB
  - PHP
  - WebServer
  - Linux
series: "Debian Server"
seriesOrder: 3
---

Web server adalah layanan paling fundamental di internet. Di dunia Linux, ada dua stack dominan: **LAMP** (Apache) dan **LEMP** (Nginx — dibaca "Engine-X").

Artikel ini memandu instalasi dan konfigurasi kedua stack di Debian 10.

## LAMP Stack (Apache + MariaDB + PHP)

### Komponen

| Komponen | Fungsi | Alternatif |
|----------|--------|------------|
| **L**inux | OS | Debian, Ubuntu, CentOS |
| **A**pache | Web server | Nginx, LiteSpeed |
| **M**ariaDB | Database | MySQL, PostgreSQL |
| **P**HP | Bahasa scripting | Python, Perl, Ruby |

### Instalasi LAMP

```bash
# Update sistem
apt update && apt upgrade -y

# Install Apache
apt install apache2 -y

# Install MariaDB
apt install mariadb-server mariadb-client -y

# Install PHP + extensions
apt install php php-mysql php-curl php-gd php-mbstring \
  php-xml php-xmlrpc php-zip php-intl php-bcmath -y

# Install libapache2-mod-php
apt install libapache2-mod-php -y
```

### Konfigurasi Apache

Enable modules:

```bash
a2enmod rewrite
a2enmod ssl
a2enmod headers
systemctl restart apache2
```

**Virtual Host** (`/etc/apache2/sites-available/ngopidulur.conf`):

```apache
<VirtualHost *:80>
    ServerAdmin admin@ngopidulur.local
    ServerName ngopidulur.local
    ServerAlias www.ngopidulur.local
    DocumentRoot /var/www/ngopidulur

    <Directory /var/www/ngopidulur>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${AP..._DIR}/error.log
    CustomLog ${AP..._DIR}/access.log combined
</VirtualHost>
```

Enable site:

```bash
mkdir -p /var/www/ngopidulur
echo "<?php phpinfo(); ?>" > /var/www/ngopidulur/index.php
a2dissite 000-default.conf
a2ensite ngopidulur.conf
systemctl reload apache2
```

### Keamanan MariaDB

```bash
mysql_secure_installation

# Ikuti prompt:
# Enter current password for root: (enter — kosong)
# Set root password? [Y/n] Y
# Remove anonymous users? [Y/n] Y
# Disallow root login remotely? [Y/n] Y
# Remove test database? [Y/n] Y
# Reload privilege tables? [Y/n] Y
```

## LEMP Stack (Nginx + MariaDB + PHP-FPM)

### Kenapa Nginx?

| | Apache | Nginx |
|---|---|---|
| **Arsitektur** | Process-based | Event-driven |
| **Koneksi konkuren** | Limited per process | 10,000+ per worker |
| **Static files** | Cepat | Sangat cepat |
| **Dynamic content** | Native PHP module | Via PHP-FPM (proxy) |
| **Konfigurasi** | `.htaccess` per-folder | Central config only |
| **Module** | Dynamic loading | Compile-time |

### Instalasi LEMP

```bash
# Install Nginx
apt install nginx -y

# Install MariaDB (sama dengan LAMP)
apt install mariadb-server mariadb-client -y

# Install PHP-FPM
apt install php-fpm php-mysql php-curl php-gd \
  php-mbstring php-xml php-zip -y
```

### Konfigurasi Nginx

**Virtual Host** (`/etc/nginx/sites-available/ngopidulur`):

```nginx
server {
    listen 80;
    server_name ngopidulur.local www.ngopidulur.local;
    root /var/www/ngopidulur;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/ngopidulur /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## SSL dengan Let's Encrypt

### Certbot Installation

```bash
apt install certbot python3-certbot-nginx -y   # Untuk Nginx
# atau
apt install certbot python3-certbot-apache -y  # Untuk Apache

# Dapatkan sertifikat
certbot --nginx -d ngopidulur.my.id -d www.ngopidulur.my.id

# Auto-renewal
certbot renew --dry-run
```

## Optimasi Performa

### Apache

```apache
# /etc/apache2/mods-enabled/mpm_prefork.conf
<IfModule mpm_prefork_module>
    StartServers        4
    MinSpareServers     4
    MaxSpareServers     10
    MaxRequestWorkers   150
    MaxConnectionsPerChild 1000
</IfModule>

# Enable caching
a2enmod expires
a2enmod deflate
```

### Nginx

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Cache static files
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### PHP-FPM Tuning

Edit `/etc/php/7.3/fpm/pool.d/www.conf`:

```ini
pm = dynamic
pm.max_children = 20
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
```

## Perbandingan LAMP vs LEMP

| Aspek | LAMP | LEMP |
|-------|------|------|
| **Set up** | Lebih mudah | Sedikit lebih kompleks |
| **Performa static** | Baik | Sangat baik |
| **Performa dynamic** | Setara | Setara |
| **.htaccess** | Didukung | Tidak didukung |
| **Konkurensi tinggi** | Cukup | Sangat baik |
| **Rekomendasi** | Shared hosting, WP | High-traffic, API, microservices |

## Kesimpulan

**LAMP** cocok untuk shared hosting, WordPress, dan setup tradisional. **LEMP** unggul untuk high-traffic sites, API, dan microservices dengan konkurensi tinggi. Keduanya bisa dioptimasi dengan caching, gzip, dan PHP-FPM tuning.

Di artikel selanjutnya: **Mail Server di Debian** — Postfix + Dovecot + Roundcube Webmail.

---

*Referensi: Pramudika, A. Debian 10 Server Administration. Apache/Nginx Documentation.*
