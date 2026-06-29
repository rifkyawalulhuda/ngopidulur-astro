---
title: "Instalasi Software dan Manajemen Service di Linux: APT, Systemctl, Filesystem, dan Monitoring"
description: Panduan lengkap administrasi sistem Linux — manajemen paket dengan
  APT/Dpkg, instalasi dari source, manajemen service dengan systemctl,
  filesystem dan mount, monitoring sistem dengan top/htop/df, serta
  troubleshooting dasar. Praktis untuk sysadmin pemula.
pubDate: 2026-06-29T16:00:00.000Z
image: /image/linux-basic-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Linux
  - APT
  - Systemctl
  - Filesystem
  - Mount
  - Monitoring
  - SysAdmin
  - Debian
  - Terminal
---

Setelah menguasai navigasi terminal, saatnya naik level: mengelola **software, service, filesystem, dan monitoring** — skill wajib seorang system administrator Linux.

## Manajemen Paket (APT)

Debian dan turunannya (Ubuntu, Kali, Mint) menggunakan **APT (Advanced Package Tool)** dengan format paket `.deb`.

### Dasar APT

```bash
# Update daftar paket dari repository
sudo apt update

# Upgrade semua paket ke versi terbaru
sudo apt upgrade -y

# Upgrade + handle dependency change
sudo apt full-upgrade -y

# Install paket
sudo apt install nginx php mariadb-server -y

# Hapus paket (konfigurasi tetap)
sudo apt remove nginx

# Hapus paket + konfigurasi
sudo apt purge nginx

# Hapus dependency yang tidak dipakai
sudo apt autoremove

# Cari paket
apt search web server

# Lihat informasi paket
apt show nginx

# Lihat dependency
apt depends nginx

# File milik paket apa?
dpkg -S /etc/nginx/nginx.conf
```

### Dpkg: Instalasi Offline

```bash
# Install .deb langsung
sudo dpkg -i package.deb

# Lihat paket terinstall
dpkg -l

# Lihat file dalam paket
dpkg -L nginx
```

### Instalasi dari Source

Untuk software yang tidak ada di repository:

```bash
# Download source
wget https://example.com/software.tar.gz
tar -xzf software.tar.gz
cd software

# Compile & install (tiga langkah klasik)
./configure          # cek dependency, generate Makefile
make                 # compile source code
sudo make install    # copy binary ke sistem
```

### Menambah Repository

```bash
# Debian/Ubuntu
sudo add-apt-repository ppa:nginx/stable
sudo apt update

# Manual di /etc/apt/sources.list
echo "deb http://deb.debian.org/debian buster main" | sudo tee -a /etc/apt/sources.list
```

## Manajemen Service dengan Systemd

Hampir semua distro Linux modern menggunakan **systemd** untuk mengelola service.

### Systemctl Commands

```bash
# Melihat status service
sudo systemctl status nginx

# Start/Stop/Restart
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx    # reload config tanpa restart

# Auto-start saat boot
sudo systemctl enable nginx    # enable saat boot
sudo systemctl disable nginx   # disable saat boot

# Cek apakah service aktif
systemctl is-active nginx
systemctl is-enabled nginx

# List semua service
systemctl list-units --type=service --all
systemctl list-units --type=service --state=running
```

### Analisis Boot

```bash
# Waktu boot
systemd-analyze

# Waktu setiap service saat boot
systemd-analyze blame

# Chain dependency
systemd-analyze critical-chain
```

## Filesystem & Mount

Linux menggunakan struktur direktori **hierarkis** — semua mulai dari root `/`.

### Hierarki Filesystem

| Direktori | Isi |
|-----------|-----|
| `/bin` | Binary esensial (ls, cp, mv) |
| `/boot` | Kernel dan bootloader |
| `/dev` | Device files (sda, tty, random) |
| `/etc` | Konfigurasi sistem |
| `/home` | Home direktori user |
| `/lib` | Library bersama |
| `/media` | Mount point removable media |
| `/mnt` | Mount point sementara |
| `/opt` | Paket software tambahan |
| `/proc` | Virtual filesystem — kernel & proses |
| `/root` | Home direktori root |
| `/run` | Runtime data (volatile) |
| `/sbin` | System binary (root-only) |
| `/srv` | Data service (FTP, WWW) |
| `/tmp` | File sementara |
| `/usr` | Aplikasi user |
| `/var` | Data variabel (log, database, mail) |

### Mount & Unmount

```bash
# Mount perangkat
sudo mount /dev/sdb1 /mnt/usb

# Mount dengan tipe filesystem
sudo mount -t ntfs-3g /dev/sdb1 /mnt/usb

# Mount otomatis via /etc/fstab
echo "/dev/sdb1 /mnt/usb ext4 defaults 0 2" | sudo tee -a /etc/fstab

# Unmount
sudo umount /mnt/usb

# Lihat semua mount point
mount
df -h        # lihat disk usage
```

### Disk & Filesystem Management

```bash
# Cek partisi
sudo fdisk -l
sudo lsblk

# Format partisi
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.ntfs /dev/sdb1

# Cek disk health
sudo smartctl -a /dev/sda
```

## Monitoring Sistem

### Resource Usage

```bash
# CPU & proses
top                    # real-time monitor
htop                   # top versi warna (lebih enak!)

# Memory
free -h                # RAM + swap usage
cat /proc/meminfo      # detail memory

# Disk
df -h                  # semua mount point
du -sh /home/*         # ukuran per folder
ncdu                   # interactive disk usage (jika install)

# Network
ip a                   # interface & IP
ip route               # routing table
ss -tuln               # listening ports
netstat -tulpn         # ports + proses (klasik)
```

### Logging

Semua log di Linux berada di `/var/log/`.

```bash
# Cek log sistem
tail -f /var/log/syslog          # Debian/Ubuntu
tail -f /var/log/messages        # RedHat/Fedora

# Log autentikasi
tail -f /var/log/auth.log        # login attempts

# Log service spesifik
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Journalctl (systemd-log)
journalctl -u nginx -f           # log service nginx real-time
journalctl -u sshd --since yesterday
journalctl --list-boots          # riwayat boot
```

## Troubleshooting Dasar

### "Permission denied"

```bash
ls -la file          # cek permission
chmod +x script      # tambah execute
sudo command         # jalankan sebagai root
```

### "Command not found"

```bash
which command        # cek apakah binary ada
apt install command  # install (kalau tahu nama paket)
```

### "Disk full"

```bash
df -h                # cek mana yang penuh
du -sh /var/log/*    # cari folder pemboros
sudo apt autoremove  # bersihkan paket sampah
```

### "Port already in use"

```bash
ss -tulpn | grep :80 # cari proses yang pakai port 80
kill -9 PID          # hentikan proses
```

### "Service failed to start"

```bash
sudo systemctl status nginx        # lihat error
journalctl -u nginx -xe            # detail error
sudo nginx -t                      # test config syntax
```

## Shell Shortcuts Penting

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + A` | Pindah ke awal baris |
| `Ctrl + E` | Pindah ke akhir baris |
| `Ctrl + U` | Hapus dari kursor ke awal |
| `Ctrl + K` | Hapus dari kursor ke akhir |
| `Ctrl + W` | Hapus satu kata ke belakang |
| `Ctrl + R` | Cari command history |
| `!!` | Ulangi perintah terakhir |
| `!$` | Argumen terakhir perintah sebelumnya |
| `Ctrl + Z` | Pause proses |
| `Ctrl + L` | Clear screen |

## Kesimpulan

Seorang sysadmin Linux profesional harus menguasai:
- **Manajemen paket** — install, update, remove, troubleshoot dependency
- **Manajemen service** — start, stop, restart, enable, disable
- **Filesystem** — mount, unmount, partisi, disk management
- **Monitoring** — log, resource usage, port, network
- **Troubleshooting** — debug error, fix permission, free space

Dengan skill ini, kamu siap mengelola server Linux secara mandiri. Latihan terus dan jangan takut error — dari errorlah kita belajar paling banyak.

---

*Referensi: IBTeam Aceh Region. Linux Basic Tutorial Ebook, 2nd Edition. Debian/Ubuntu Documentation.*
