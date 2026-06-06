---
title: Panduan Lengkap Konfigurasi DNS Server di Debian
description: DNS (Domain Name System) adalah salah satu komponen paling penting
  dalam jaringan komputer. Tanpa DNS, kita harus mengingat alamat IP untuk
  mengakses setiap layanan di internet. DNS berfungsi sebagai "buku telepon"
  yang menerjemahkan nama domain menjadi alamat IP dan sebaliknya.
pubDate: 2026-06-06T19:14:00.000Z
image: /image/12121.webp
draft: false
categories:
  - Teknologi
tags:
  - debian
  - linux
  - dns
  - server
  - system-admin
---
Dalam artikel ini, kita akan membahas secara mendalam cara mengkonfigurasi **DNS Server** di Debian, mulai dari DNS Caching & Forwarding hingga DNS Authoritative. Panduan ini cocok untuk administrator jaringan, sysadmin, dan siapa saja yang ingin memahami cara kerja DNS secara praktis.

---

## 1. Apa itu DNS Server?

DNS Server memiliki dua peran utama:

| Jenis DNS              | Fungsi                                                                 | Kegunaan Umum                     |
|------------------------|------------------------------------------------------------------------|-----------------------------------|
| **DNS Caching / Forwarding** | Menyimpan hasil query DNS dan meneruskan query ke DNS lain           | Mempercepat resolusi nama         |
| **DNS Authoritative**     | Menyimpan record DNS secara resmi untuk sebuah domain                  | Mengelola domain sendiri          |

Kedua jenis ini sering dijalankan dalam satu server yang sama, terutama di lingkungan internal atau jaringan perusahaan.

---

## 2. Instalasi BIND9 di Debian

BIND9 adalah software DNS Server paling populer di Linux. Instalasi sangat mudah:

```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc
```

Setelah instalasi, BIND9 akan berjalan secara default. Periksa statusnya:

```bash
sudo systemctl status bind9
```

---

## 3. Konfigurasi DNS Caching & Forwarding

Konfigurasi ini cocok untuk router atau gateway jaringan. Server akan menyimpan (cache) hasil query DNS dan meneruskan query yang tidak diketahui ke DNS upstream (misalnya Google DNS atau Cloudflare).

### Langkah Konfigurasi

Edit file konfigurasi utama:

```bash
sudo nano /etc/bind/named.conf.options
```

Tambahkan atau ubah bagian `forwarders` dan `dnssec`:

```bash
options {
    directory "/var/cache/bind";

    // Forwarders ke DNS publik
    forwarders {
        8.8.8.8;
        8.8.4.4;
        1.1.1.1;
    };

    // Aktifkan DNSSEC
    dnssec-validation auto;

    // Izinkan query dari jaringan internal
    allow-query { localhost; 192.168.1.0/24; };

    // Cache setting
    max-cache-size 100M;
    max-cache-ttl 86400;
};
```

Simpan file, lalu restart BIND9:

```bash
sudo systemctl restart bind9
```

### Uji DNS Caching

Gunakan perintah `dig` untuk menguji:

```bash
dig google.com @localhost
```

Perhatikan bagian `Query time`. Query pertama biasanya lebih lambat, query berikutnya akan jauh lebih cepat karena sudah di-cache.

---

## 4. Konfigurasi DNS Authoritative

DNS Authoritative adalah server yang menyimpan record DNS secara resmi untuk sebuah domain. Server ini yang akan menjawab ketika orang lain mencari record dari domain yang kita kelola.

### Langkah-langkah Membuat DNS Authoritative

#### 1. Tambahkan Zona Domain

Edit file:

```bash
sudo nano /etc/bind/named.conf.local
```

Tambahkan zona berikut:

```bash
zone "contoh.local" {
    type master;
    file "/etc/bind/zones/db.contoh.local";
    allow-transfer { none; };   // atau IP slave jika ada
};
```

Buat direktori untuk file zona jika belum ada:

```bash
sudo mkdir -p /etc/bind/zones
```

#### 2. Buat File Zona Forward

Buat file zona:

```bash
sudo nano /etc/bind/zones/db.contoh.local
```

Isi dengan contoh berikut:

```bash
$TTL    604800
@       IN      SOA     ns1.contoh.local. admin.contoh.local. (
                              2024060101         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.contoh.local.
@       IN      A       192.168.1.10
ns1     IN      A       192.168.1.10
www     IN      A       192.168.1.20
mail    IN      A       192.168.1.30
```

#### 3. Buat File Zona Reverse (Opsional tapi Direkomendasikan)

Buat file reverse zone:

```bash
sudo nano /etc/bind/zones/db.192.168.1
```

Isi contoh:

```bash
$TTL    604800
@       IN      SOA     ns1.contoh.local. admin.contoh.local. (
                              2024060101
                         604800
                          86400
                        2419200
                         604800 )
;
@       IN      NS      ns1.contoh.local.
10      IN      PTR     ns1.contoh.local.
20      IN      PTR     www.contoh.local.
30      IN      PTR     mail.contoh.local.
```

#### 4. Update Serial Setiap Kali Mengubah Record

Setiap kali Anda mengubah file zona, **naikkan nomor serial** (contoh: dari `2024060101` menjadi `2024060102`).

#### 5. Restart dan Cek Konfigurasi

```bash
sudo systemctl restart bind9
sudo named-checkconf
sudo named-checkzone contoh.local /etc/bind/zones/db.contoh.local
```

Jika tidak ada error, konfigurasi berhasil.

---

## 5. Menguji DNS Authoritative

Dari komputer client di jaringan yang sama, ubah DNS menjadi IP server Debian, lalu uji:

```bash
dig www.contoh.local @192.168.1.10
dig -x 192.168.1.20 @192.168.1.10
```

Jika berhasil, server akan mengembalikan record yang sesuai.

---

## 6. Best Practices Konfigurasi DNS di Debian

Berikut praktik terbaik yang direkomendasikan:

- Selalu gunakan **serial number** yang bertambah saat mengubah zona
- Batasi `allow-query` hanya ke jaringan yang dipercaya
- Aktifkan **DNSSEC** untuk keamanan
- Gunakan **forwarders** yang andal (Cloudflare 1.1.1.1 atau Quad9)
- Buat **backup** file zona secara berkala
- Monitor log BIND9 di `/var/log/syslog` atau `/var/log/named`
- Pertimbangkan menggunakan **unbound** atau **dnsmasq** untuk caching yang lebih ringan jika tidak butuh authoritative

---

## 7. Troubleshooting Umum

| Masalah                        | Penyebab Umum                          | Solusi |
|--------------------------------|----------------------------------------|--------|
| Query time sangat lambat       | Forwarder tidak bisa dijangkau         | Ganti forwarder atau cek koneksi internet |
| Record tidak ditemukan         | Serial belum dinaikkan                 | Naikkan serial dan restart BIND9 |
| Error named-checkzone          | Syntax error di file zona              | Perbaiki syntax (kurung, titik, dll) |
| Client tidak bisa resolve      | Firewall memblokir port 53             | Buka port UDP/TCP 53 di firewall |

---

## Kesimpulan

Konfigurasi DNS Server di Debian memberikan kontrol penuh atas resolusi nama di jaringan Anda. Dengan memahami perbedaan antara **DNS Caching** dan **DNS Authoritative**, serta menguasai cara membuat dan mengelola zona, Anda dapat membangun infrastruktur DNS yang handal, baik untuk keperluan internal perusahaan maupun lingkungan pembelajaran.

DNS adalah fondasi dari hampir semua layanan jaringan. Menguasai konfigurasi DNS akan sangat membantu ketika Anda mengelola layanan lain seperti Mail Server, Web Server, atau VPN.
