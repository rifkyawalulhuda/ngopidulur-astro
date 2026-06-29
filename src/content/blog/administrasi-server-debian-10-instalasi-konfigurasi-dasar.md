---
title: "Administrasi Server Debian 10: Instalasi, Konfigurasi Dasar, dan Perintah Linux Esensial"
description: Panduan praktis administrasi server Debian 10 — dari instalasi di
  VirtualBox, konfigurasi network, perintah dasar Linux, manajemen hostname,
  repository apt, sudo, remote SSH, hingga setup router Debian. Cocok untuk
  pemula yang ingin belajar sysadmin Linux.
pubDate: 2026-06-25T08:00:00.000Z
image: /image/debian10-server-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Debian
  - Linux
  - Server
  - SysAdmin
  - VirtualBox
  - SSH
  - Buster
  - AdministrasiServer
---

**Debian** adalah salah satu distro Linux paling stabil dan banyak digunakan untuk server production. Dengan repositori paket yang luas dan komunitas yang solid, Debian menjadi pilihan utama para system administrator.

Artikel ini adalah panduan langkah-demi-langkah administrasi server Debian 10 (Buster).

## Struktur Direktori Linux

Sebelum mulai konfigurasi, pahami struktur direktori:

| Direktori | Fungsi |
|-----------|--------|
| `/` | Root — direktori paling atas |
| `/bin` | Binary executable esensial |
| `/boot` | File bootloader dan kernel |
| `/dev` | Device files (hardware) |
| `/etc` | File konfigurasi sistem |
| `/home` | Direktori home user |
| `/var` | Data variabel (log, mail, database) |
| `/tmp` | File sementara (terhapus saat reboot) |
| `/usr` | Aplikasi dan library user |
| `/sbin` | System binaries (untuk root) |
| `/root` | Home direktori user root |

## Instalasi Debian 10 di VirtualBox

### Topologi Praktik

```
[Debian-Router]────[Switch Virtual]────[Server1]
     │                                      │
     └──────────────────────────────────────┘
              Network: 192.168.10.0/24
```

### Langkah Instalasi

1. **Buat VM baru** di VirtualBox:
   - RAM: 512 MB - 1 GB
   - Harddisk: 8 GB (VDI, dynamic allocated)
   - Attach ISO Debian 10

2. **Instalasi Debian**:
   - Pilih bahasa dan lokasi
   - Konfigurasi network (hostname, domain)
   - Partisi disk (guided — use entire disk)
   - Pilih software: **SSH server**, **standard system utilities**

3. **Cloning VM** (untuk multiple server):
   - Klik kanan VM → Clone → Full clone
   - Konfigurasi Network Adapter untuk setiap clone

## Perintah Linux Dasar

### Navigasi & File

```bash
pwd                     # Print working directory
ls -la                  # List semua file (detail)
cd /etc                 # Pindah ke /etc
mkdir /home/data        # Buat direktori
touch file.txt          # Buat file kosong
cp source dest          # Copy
mv old new              # Move/rename
rm file.txt             # Hapus file
rm -rf folder/          # Hapus folder rekursif
```

### Informasi Sistem

```bash
uname -a                # Info kernel
hostnamectl             # Info hostname
df -h                   # Disk usage
free -h                 # Memory usage
top                     # Proses real-time
ps aux                  # Semua proses
ip a                    # Info network interfaces
```

### Manajemen Paket (APT)

```bash
apt update              # Update daftar paket
apt upgrade             # Upgrade semua paket
apt install nginx       # Install paket
apt remove nginx        # Hapus paket
apt search keyword      # Cari paket
apt show nginx          # Detail paket
```

### Permission & Ownership

```bash
chmod 755 script.sh     # rwxr-xr-x
chmod 644 file.txt      # rw-r--r--
chown user:group file   # Ganti pemilik
```

| Digit | Permission |
|-------|-----------|
| 7 | rwx (read, write, execute) |
| 6 | rw- |
| 5 | r-x |
| 4 | r-- |

## Konfigurasi Dasar Debian

### Hostname dan Hosts

```bash
# Set hostname
hostnamectl set-hostname debian-server

# Edit /etc/hosts
nano /etc/hosts

# Tambahkan:
127.0.0.1   localhost
192.168.10.1  debian-router
192.168.10.2  server1
192.168.10.3  server2
```

### Repository APT

Edit `/etc/apt/sources.list`:

```bash
# Debian 10 Buster
deb http://deb.debian.org/debian buster main contrib non-free
deb http://deb.debian.org/debian buster-updates main contrib non-free
deb http://security.debian.org/debian-security buster/updates main contrib non-free
```

```bash
apt update && apt upgrade -y
```

### Konfigurasi Sudo

```bash
# Install sudo
apt install sudo -y

# Tambah user ke grup sudo
usermod -aG sudo username

# Atau edit /etc/sudoers dengan visudo
visudo

# Tambahkan:
username ALL=(ALL:ALL) ALL
```

### Remote Access dengan SSH

```bash
# Install OpenSSH Server
apt install openssh-server -y

# Cek status
systemctl status sshd

# Enable auto-start
systemctl enable sshd

# Konfigurasi (opsional)
nano /etc/ssh/sshd_config

# Ubah port default (keamanan)
Port 2222

# Disable root login
PermitRootLogin no

# Restart SSH
systemctl restart sshd
```

Dari client:

```bash
ssh username@192.168.10.1 -p 2222
```

## Konfigurasi Debian sebagai Router

### Enable IP Forwarding

```bash
# Edit sysctl
nano /etc/sysctl.conf

# Uncomment:
net.ipv4.ip_forward=1

# Apply
sysctl -p
```

### Konfigurasi NAT dengan iptables

```bash
# Install iptables-persistent
apt install iptables-persistent -y

# NAT rule
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Save rules
iptables-save > /etc/iptables/rules.v4
```

### Konfigurasi Interface Network

Edit `/etc/network/interfaces`:

```bash
# WAN (ke internet)
auto eth0
iface eth0 inet dhcp

# LAN (ke server internal)
auto eth1
iface eth1 inet static
    address 192.168.10.1
    netmask 255.255.255.0
    network 192.168.10.0
    broadcast 192.168.10.255
```

Restart networking:

```bash
systemctl restart networking
```

## Tips SysAdmin Debian

1. **Selalu update sebelum install**: `apt update && apt upgrade`
2. **Gunakan `tmux` atau `screen`**: Session persistent untuk remote work
3. **Backup konfigurasi**: Copy file config sebelum edit
4. **Monitor log**: `tail -f /var/log/syslog`
5. **Gunakan SSH key, bukan password**
6. **Firewall**: `ufw enable && ufw allow 22/tcp`

## Kesimpulan

Administrasi server Debian adalah fondasi untuk semua layanan yang akan kita bangun — DNS, web server, mail server, dan monitoring. Dengan memahami perintah dasar, manajemen paket, dan konfigurasi jaringan, kamu siap mengelola server Linux secara profesional.

Di artikel selanjutnya: **Konfigurasi DNS Server di Debian** — caching, forwarding, dan authoritative DNS.

---

*Referensi: Pramudika, A. Debian 10 Server Administration. Debian Documentation.*
