---
title: Panduan Lengkap Konfigurasi LAMP dan LEMP Stack di Debian
description: LAMP dan LEMP adalah dua stack web development paling populer di
  dunia. Keduanya digunakan untuk menjalankan aplikasi web dinamis berbasis PHP.
pubDate: 2026-06-06T19:27:00.000Z
image: /image/lamp-server.webp
draft: false
categories:
  - Teknologi
tags:
  - lamp
  - debian
  - linux
  - server
  - system-admin
---
Di artikel ini, kita akan membahas secara lengkap cara menginstal dan mengkonfigurasi:

- **LAMP Stack** → Linux + **Apache** + MariaDB + PHP
- **LEMP Stack** → Linux + **Nginx** + MariaDB + PHP

Panduan ini menggunakan **Debian** sebagai sistem operasi dan **MariaDB** sebagai database (pengganti MySQL yang lebih modern).

---

## 1. Apa itu LAMP dan LEMP?

| Stack | Komponen                          | Kelebihan                              | Kekurangan                          | Cocok Untuk |
|-------|-----------------------------------|----------------------------------------|-------------------------------------|-------------|
| **LAMP**  | Linux + Apache + MariaDB + PHP   | Mudah dikonfigurasi, dokumentasi banyak | Lebih berat dibanding Nginx        | Pemula, shared hosting, WordPress |
| **LEMP**  | Linux + Nginx + MariaDB + PHP    | Performa tinggi, ringan, skalabel     | Konfigurasi sedikit lebih rumit    | Production, traffic tinggi, API   |

**Rekomendasi**:
- Gunakan **Apache** jika Anda pemula atau butuh banyak fitur `.htaccess`
- Gunakan **Nginx** jika performa dan efisiensi resource menjadi prioritas utama

---

## 2. Persiapan Sistem

Pastikan sistem Debian sudah up to date:

```bash
sudo apt update && sudo apt upgrade -y
```

Instal beberapa tools pendukung:

```bash
sudo apt install curl wget unzip -y
```

---

## 3. Konfigurasi LAMP Stack (Apache + MariaDB + PHP)

### Langkah 1: Instalasi Apache

```bash
sudo apt install apache2 -y
```

Aktifkan dan jalankan Apache:

```bash
sudo systemctl enable apache2
sudo systemctl start apache2
```

Cek status:

```bash
sudo systemctl status apache2
```

### Langkah 2: Instalasi MariaDB

```bash
sudo apt install mariadb-server mariadb-client -y
```

Jalankan script keamanan:

```bash
sudo mysql_secure_installation
```

Ikuti langkah-langkahnya:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database
- Reload privilege tables

### Langkah 3: Instalasi PHP dan Modul Apache

```bash
sudo apt install php libapache2-mod-php php-mysql php-cli php-curl php-gd php-mbstring php-xml php-zip -y
```

Restart Apache:

```bash
sudo systemctl restart apache2
```

### Langkah 4: Uji Instalasi LAMP

Buat file test:

```bash
sudo nano /var/www/html/info.php
```

Isi dengan:

```php
<?php
phpinfo();
?>
```

Akses dari browser: `http://IP-SERVER/info.php`

Jika muncul halaman PHP info, maka LAMP berhasil diinstal.

---

## 4. Konfigurasi LEMP Stack (Nginx + MariaDB + PHP)

### Langkah 1: Instalasi Nginx

```bash
sudo apt install nginx -y
```

Aktifkan dan jalankan:

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Langkah 2: Instalasi PHP-FPM

```bash
sudo apt install php-fpm php-mysql php-cli php-curl php-gd php-mbstring php-xml php-zip -y
```

Cek versi PHP-FPM:

```bash
php -v
```

### Langkah 3: Konfigurasi Nginx + PHP-FPM

Edit konfigurasi default Nginx:

```bash
sudo nano /etc/nginx/sites-available/default
```

Ganti bagian `location ~ \.php$` menjadi:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
}
```

Simpan, lalu test konfigurasi:

```bash
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

### Langkah 4: Uji Instalasi LEMP

Buat file test di `/var/www/html/info.php` sama seperti sebelumnya, lalu akses melalui browser.

---

## 5. Konfigurasi Virtual Host

### Untuk Apache

Buat direktori website:

```bash
sudo mkdir -p /var/www/contoh.com/public_html
```

Buat Virtual Host:

```bash
sudo nano /etc/apache2/sites-available/contoh.com.conf
```

Isi dengan:

```apache
<VirtualHost *:80>
    ServerName contoh.com
    ServerAlias www.contoh.com
    DocumentRoot /var/www/contoh.com/public_html

    <Directory /var/www/contoh.com/public_html>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/contoh.com-error.log
    CustomLog ${APACHE_LOG_DIR}/contoh.com-access.log combined
</VirtualHost>
```

Aktifkan site:

```bash
sudo a2ensite contoh.com.conf
sudo systemctl reload apache2
```

### Untuk Nginx

Buat file konfigurasi:

```bash
sudo nano /etc/nginx/sites-available/contoh.com
```

Isi dengan konfigurasi server block yang sesuai.

---

## 6. Keamanan LAMP / LEMP Stack

Beberapa praktik keamanan penting:

### 1. Nonaktifkan `info.php` di Production
Jangan biarkan file `info.php` tetap ada di production.

### 2. Gunakan HTTPS (Let's Encrypt)
Instal Certbot untuk mendapatkan sertifikat gratis:

```bash
sudo apt install certbot python3-certbot-apache   # Untuk Apache
sudo apt install certbot python3-certbot-nginx    # Untuk Nginx
```

### 3. Batasi Akses Direktori
Gunakan `.htaccess` (Apache) atau konfigurasi `location` (Nginx) untuk melindungi file sensitif.

### 4. Update Sistem Secara Berkala
```bash
sudo apt update && sudo apt upgrade -y
```

### 5. Firewall
```bash
sudo ufw allow 'Apache Full'     # Untuk Apache
sudo ufw allow 'Nginx Full'      # Untuk Nginx
sudo ufw enable
```

---

## 7. Perbandingan Singkat LAMP vs LEMP

| Aspek              | LAMP (Apache)                  | LEMP (Nginx)                     | Pemenang          |
|--------------------|--------------------------------|----------------------------------|-------------------|
| Performa           | Sedang                         | Sangat Baik                      | Nginx             |
| Konsumsi RAM       | Lebih tinggi                   | Lebih rendah                     | Nginx             |
| Kemudahan Config   | Sangat mudah                   | Sedang                           | Apache            |
| `.htaccess` Support| Ya                             | Tidak (perlu konversi)           | Apache            |
| Cocok untuk        | Shared hosting, WordPress      | High traffic, API, Production    | Tergantung kebutuhan |

---

## Kesimpulan

Baik **LAMP** maupun **LEMP** Stack adalah fondasi yang sangat kuat untuk menjalankan aplikasi web berbasis PHP. Pilihan antara Apache dan Nginx sangat bergantung pada kebutuhan performa dan kemudahan konfigurasi.

**Rekomendasi akhir**:
- Gunakan **LAMP** jika Anda baru belajar atau menggunakan CMS seperti WordPress.
- Gunakan **LEMP** jika Anda membutuhkan performa tinggi dan efisiensi resource.

Dengan mengikuti panduan ini, Anda sudah memiliki web server yang siap digunakan untuk development maupun production (dengan tambahan konfigurasi keamanan yang lebih ketat).
