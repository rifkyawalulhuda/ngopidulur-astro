---
title: "DNS Server di Debian 10: Panduan Lengkap Caching DNS, Forwarding, dan Authoritative DNS dengan BIND9"
description: Tutorial lengkap membangun DNS server di Debian 10 menggunakan
  BIND9 — dari DNS caching untuk mempercepat akses, DNS forwarding, hingga
  authoritative DNS untuk domain sendiri. Disertai konfigurasi zone file,
  reverse DNS, dan troubleshooting.
pubDate: 2026-06-25T09:00:00.000Z
image: /image/debian10-server-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Debian
  - DNS
  - BIND9
  - Server
  - Linux
  - Networking
  - SysAdmin
---

**DNS (Domain Name System)** adalah "buku telepon internet" — menerjemahkan nama domain seperti `ngopidulur.my.id` ke alamat IP yang bisa dipahami komputer.

Artikel ini memandu kamu membangun DNS server lengkap di Debian 10 menggunakan **BIND9** (Berkeley Internet Name Domain).

## Konsep DNS

### Bagaimana DNS Bekerja?

```
Browser → Resolver → Root DNS → TLD DNS → Authoritative DNS → IP Address
  │                                                              │
  └──────────────────── Response: 192.168.x.x ←─────────────────┘
```

### Jenis DNS Server

| Jenis | Fungsi | Contoh |
|-------|--------|--------|
| **Caching** | Menyimpan hasil query sementara | Mempercepat akses |
| **Forwarding** | Meneruskan query ke DNS upstream | Google DNS (8.8.8.8) |
| **Authoritative** | Menyimpan data zone untuk domain | ns1.ngopidulur.my.id |
| **Recursive** | Mencari jawaban dari root ke authoritative | ISP DNS |

## Instalasi BIND9

```bash
apt update
apt install bind9 bind9utils bind9-doc -y
```

### Struktur Konfigurasi BIND

```
/etc/bind/
├── named.conf           # Konfigurasi utama
├── named.conf.options   # Opsi global
├── named.conf.local     # Zone definitions
├── named.conf.default-zones
├── db.root              # Root hints
├── db.local             # Localhost zone
└── zones/               # File zone (custom)
```

## DNS Caching Server

### Konfigurasi

Edit `/etc/bind/named.conf.options`:

```
options {
    directory "/var/cache/bind";

    // Allow queries dari network internal
    allow-query { localhost; 192.168.10.0/24; };

    // Enable recursion (caching)
    recursion yes;

    // Forwarders (DNS upstream)
    forwarders {
        8.8.8.8;       // Google DNS
        1.1.1.1;       // Cloudflare DNS
    };

    // DNSSEC validation
    dnssec-validation auto;

    // Listen on all interfaces
    listen-on { any; };
    listen-on-v6 { any; };
};
```

### Test Caching

```bash
systemctl restart bind9

# Test query (pertama kali — lambat)
dig @localhost google.com

# Query kedua — cached (cepat!)
dig @localhost google.com | grep "Query time"
# Query time: 0 msec  ← cached!
```

## DNS Forwarding Server

Meneruskan query ke server upstream tanpa caching:

```
options {
    forward only;        // Jangan resolve sendiri
    forwarders {
        8.8.8.8;
        8.8.4.4;
    };
};
```

## Authoritative DNS Server

Untuk domain sendiri, misalnya `ngopidulur.local`.

### 1. Definisikan Zone

Edit `/etc/bind/named.conf.local`:

```
zone "ngopidulur.local" {
    type master;
    file "/etc/bind/zones/db.ngopidulur.local";
};

zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/zones/db.192.168.10";
};
```

### 2. Buat Forward Zone File

`/etc/bind/zones/db.ngopidulur.local`:

```
$TTL    604800
@       IN      SOA     ns1.ngopidulur.local. admin.ngopidulur.local. (
                  2024062401   ; Serial (YYYYMMDDXX)
                  3600         ; Refresh
                  1800         ; Retry
                  604800       ; Expire
                  86400 )      ; Minimum TTL

; Name servers
@       IN      NS      ns1.ngopidulur.local.
@       IN      NS      ns2.ngopidulur.local.

; A records
ns1     IN      A       192.168.10.1
ns2     IN      A       192.168.10.2
www     IN      A       192.168.10.10
mail    IN      A       192.168.10.20
ftp     IN      A       192.168.10.30

; CNAME records
blog    IN      CNAME   www

; MX record (mail)
@       IN      MX      10 mail.ngopidulur.local.
```

### 3. Buat Reverse Zone File

`/etc/bind/zones/db.192.168.10`:

```
$TTL    604800
@       IN      SOA     ns1.ngopidulur.local. admin.ngopidulur.local. (
                  2024062401
                  3600
                  1800
                  604800
                  86400 )

@       IN      NS      ns1.ngopidulur.local.

1       IN      PTR     ns1.ngopidulur.local.
10      IN      PTR     www.ngopidulur.local.
20      IN      PTR     mail.ngopidulur.local.
```

### 4. Set Permission & Test

```bash
chown -R bind:bind /etc/bind/zones/
chmod 644 /etc/bind/zones/*

# Check config
named-checkconf

# Check zone files
named-checkzone ngopidulur.local /etc/bind/zones/db.ngopidulur.local
named-checkzone 10.168.192.in-addr.arpa /etc/bind/zones/db.192.168.10

# Restart
systemctl restart bind9
```

### 5. Test dari Client

```bash
# Setting DNS client
echo "nameserver 192.168.10.1" >> /etc/resolv.conf

# Test
nslookup www.ngopidulur.local
# Server:  192.168.10.1
# Address: 192.168.10.10

# Reverse lookup
nslookup 192.168.10.10
# 10.10.168.192.in-addr.arpa  name = www.ngopidulur.local

# Test MX record
dig @192.168.10.1 ngopidulur.local MX
```

## Troubleshooting DNS

### Log BIND

```bash
tail -f /var/log/syslog | grep named
journalctl -u bind9 -f
```

### Masalah Umum

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| `SERVFAIL` | Zone file corrupt | `named-checkzone` |
| `REFUSED` | Query tidak diizinkan | `allow-query` |
| `NXDOMAIN` | Record tidak ditemukan | Cek nama record |
| Timeout | Firewall blok port 53 | `ufw allow 53` |
| Serial tidak update | Lupa increment serial | Ganti serial number |

## Keamanan DNS

```bash
# Batasi akses
allow-query { 192.168.10.0/24; };
allow-transfer { 192.168.10.2; };  # Hanya secondary DNS

# DNSSEC
dnssec-enable yes;
dnssec-validation yes;

# Hide version
version "Not disclosed";
```

## Kesimpulan

DNS server adalah fondasi infrastruktur jaringan. Dengan BIND9 di Debian 10, kamu bisa membangun:
- **Caching server** — mempercepat akses internet
- **Authoritative server** — mengelola domain sendiri
- **Combined setup** — caching + authoritative

Di artikel selanjutnya: **LAMP vs LEMP Stack** — web server dengan Apache/Nginx + MariaDB + PHP.

---

*Referensi: Pramudika, A. Debian 10 Server Administration. ISC BIND Documentation.*
