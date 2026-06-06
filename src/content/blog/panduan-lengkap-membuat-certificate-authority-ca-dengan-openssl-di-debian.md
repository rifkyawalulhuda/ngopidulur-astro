---
title: Panduan Lengkap Membuat Certificate Authority (CA) dengan OpenSSL di Debian
description: Certificate Authority (CA) adalah entitas yang bertanggung jawab
  untuk menerbitkan dan mengelola sertifikat digital. Sertifikat ini digunakan
  untuk mengamankan komunikasi melalui protokol seperti HTTPS, SMTPS, IMAPS,
  VPN, dan lainnya.
pubDate: 2026-06-06T19:23:00.000Z
image: /image/update-debian-openssl.webp
draft: false
categories:
  - Teknologi
tags:
  - debian
  - server
  - open-ssl
  - system-admin
  - linux
---
Di artikel ini, kita akan membahas cara **membuat Certificate Authority sendiri** menggunakan OpenSSL di Debian. Ini sangat berguna untuk:
- Lingkungan internal/perusahaan
- Testing dan development
- Membuat sertifikat untuk server internal
- Memahami cara kerja Public Key Infrastructure (PKI)

---

## 1. Apa itu Certificate Authority?

Certificate Authority berfungsi sebagai "pihak ketiga yang dipercaya" yang menandatangani sertifikat digital. Ketika browser atau aplikasi mempercayai CA tersebut, maka sertifikat yang diterbitkan oleh CA tersebut juga akan dipercaya.

Ada dua jenis CA:

| Jenis CA              | Keterangan                                      | Contoh |
|-----------------------|--------------------------------------------------|--------|
| **Public CA**         | Dipercaya secara global oleh browser dan OS     | Let's Encrypt, DigiCert, Sectigo |
| **Private / Internal CA** | Hanya dipercaya di lingkungan internal        | CA yang kita buat sendiri |

Dalam artikel ini, kita akan membuat **Private CA** untuk keperluan internal.

---

## 2. Persiapan

Pastikan OpenSSL sudah terinstal:

```bash
sudo apt update
sudo apt install openssl
```

Buat direktori untuk menyimpan CA:

```bash
sudo mkdir -p /etc/ssl/CA/{certs,crl,newcerts,private}
sudo chmod 700 /etc/ssl/CA/private
```

Buat file database dan serial number:

```bash
sudo touch /etc/ssl/CA/index.txt
echo 1000 | sudo tee /etc/ssl/CA/serial
```

---

## 3. Membuat CA Private Key dan Certificate

### Langkah 1: Buat Private Key CA

```bash
sudo openssl genrsa -aes256 -out /etc/ssl/CA/private/ca.key.pem 4096
```

Perintah di atas akan meminta passphrase. **Ingat passphrase ini** karena akan digunakan setiap kali menandatangani sertifikat.

### Langkah 2: Buat Certificate CA (Self-Signed)

```bash
sudo openssl req -x509 -new -nodes -key /etc/ssl/CA/private/ca.key.pem \
  -sha256 -days 3650 -out /etc/ssl/CA/certs/ca.cert.pem
```

Isi informasi yang diminta:
- Country Name (2 letter code)
- State or Province Name
- Locality Name
- Organization Name
- Common Name → **isi dengan nama CA** (contoh: `Internal CA`)

Sertifikat CA akan berlaku selama 10 tahun (3650 hari).

---

## 4. Membuat Certificate Signing Request (CSR)

Untuk membuat sertifikat untuk server atau client, langkah pertama adalah membuat CSR.

Contoh untuk membuat sertifikat web server:

```bash
sudo openssl req -new -nodes \
  -keyout /etc/ssl/CA/private/server.key.pem \
  -out /etc/ssl/CA/certs/server.csr.pem
```

Isi informasi yang diminta. Pastikan **Common Name** sesuai dengan hostname atau domain server (contoh: `web.contoh.local`).

---

## 5. Menandatangani CSR dengan CA

Setelah CSR dibuat, kita tandatangani menggunakan CA:

```bash
sudo openssl ca -in /etc/ssl/CA/certs/server.csr.pem \
  -out /etc/ssl/CA/certs/server.cert.pem \
  -days 365 -notext
```

Masukkan passphrase CA ketika diminta.

Sertifikat server sekarang sudah dibuat dan ditandatangani oleh CA kita.

---

## 6. Verifikasi Sertifikat

Cek apakah sertifikat valid:

```bash
sudo openssl x509 -noout -text -in /etc/ssl/CA/certs/server.cert.pem
```

Cek apakah sertifikat ditandatangani oleh CA kita:

```bash
sudo openssl verify -CAfile /etc/ssl/CA/certs/ca.cert.pem \
  /etc/ssl/CA/certs/server.cert.pem
```

Jika muncul `OK`, berarti sertifikat valid.

---

## 7. Distribusi Certificate Authority

Agar client dan browser mempercayai sertifikat yang kita buat, kita harus mendistribusikan **CA certificate** (`ca.cert.pem`) ke semua perangkat yang akan mengakses layanan tersebut.

### Cara Menambahkan CA ke Sistem Debian/Ubuntu:

```bash
sudo cp /etc/ssl/CA/certs/ca.cert.pem /usr/local/share/ca-certificates/internal-ca.crt
sudo update-ca-certificates
```

### Untuk Browser (Chrome/Firefox/Edge):

- Buka pengaturan sertifikat
- Import CA certificate ke **Trusted Root Certification Authorities**

---

## 8. Best Practices Membuat CA

Berikut praktik terbaik yang sangat direkomendasikan:

| Praktik                          | Alasan |
|----------------------------------|--------|
| Gunakan passphrase yang kuat     | Melindungi private key CA |
| Simpan private key CA di tempat aman | Sangat sensitif |
| Gunakan key ukuran minimal 4096 bit | Keamanan lebih baik |
| Batasi masa berlaku sertifikat   | Mengurangi risiko jika ada kompromi |
| Buat backup CA secara berkala    | Untuk pemulihan jika terjadi masalah |
| Nonaktifkan akses langsung ke private key | Hanya root yang boleh mengakses |
| Gunakan nama yang jelas          | Mudah dikenali saat import |

---

## 9. Contoh Penggunaan Sertifikat

Setelah memiliki sertifikat yang ditandatangani CA, Anda bisa menggunakannya untuk:

- Web Server (Apache/Nginx HTTPS)
- Mail Server (Postfix + Dovecot)
- VPN Server (OpenVPN / WireGuard)
- Internal API
- Remote Desktop / VNC

Contoh konfigurasi Nginx:

```nginx
ssl_certificate     /etc/ssl/CA/certs/server.cert.pem;
ssl_certificate_key /etc/ssl/CA/private/server.key.pem;
```

---

## 10. Alternatif yang Lebih Modern

Membuat CA manual dengan OpenSSL memang bagus untuk belajar, namun untuk keperluan produksi, banyak orang sekarang menggunakan tools yang lebih mudah seperti:

- **step-ca** (dari Smallstep)
- **HashiCorp Vault**
- **cert-manager** (di Kubernetes)
- **Let's Encrypt** (untuk public domain)

Tools ini lebih aman dan lebih mudah dikelola dalam jangka panjang.

---

## Kesimpulan

Membuat **Certificate Authority** sendiri menggunakan OpenSSL memberikan pemahaman mendalam tentang cara kerja Public Key Infrastructure (PKI). Meskipun prosesnya cukup teknis, hasilnya sangat bermanfaat untuk mengamankan komunikasi di lingkungan internal.

Kunci keberhasilan membuat CA adalah:
- Keamanan private key
- Dokumentasi yang baik
- Distribusi CA certificate ke semua client
- Pembaruan sertifikat secara berkala

Dengan CA sendiri, Anda bisa membuat sertifikat untuk berbagai layanan tanpa harus membayar atau bergantung pada pihak ketiga.
