---
title: "File Sharing, FTP, dan Monitoring Server Debian 10: Samba, NFS, vsFTPd, dan Netdata"
description: Panduan lengkap layanan tambahan server Debian — file sharing dengan
  Samba (Windows) dan NFS (Linux), FTP server dengan vsFTPd, dan monitoring
  real-time dengan Netdata. Konfigurasi step-by-step untuk production server.
pubDate: 2026-06-25T12:00:00.000Z
image: /image/debian10-server-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Debian
  - Samba
  - NFS
  - FTP
  - vsFTPd
  - Netdata
  - Monitoring
  - Linux
  - SysAdmin
series: "Debian Server"
seriesOrder: 5
---

Setelah DNS, web server, dan mail server berjalan, server kamu butuh **file sharing** dan **monitoring**. Artikel ini melengkapi setup server Debian 10 dengan Samba, NFS, FTP, dan Netdata.

## Samba: File Sharing untuk Windows

**Samba** memungkinkan Linux berbagi file dengan Windows melalui protokol SMB/CIFS.

### Instalasi

```bash
apt update
apt install samba samba-common-bin -y
```

### Konfigurasi

Edit `/etc/samba/smb.conf`:

```ini
[global]
   workgroup = NGROUP
   server string = Debian File Server
   security = user
   map to guest = bad user
   dns proxy = no

[shared]
   comment = Shared Folder
   path = /home/shared
   browseable = yes
   read only = no
   guest ok = yes
   create mask = 0755
   directory mask = 0755

[private]
   comment = Private Files
   path = /home/private
   browseable = yes
   read only = no
   valid users = @smbgroup
   create mask = 0700
```

### Setup User & Folder

```bash
# Buat folder
mkdir -p /home/shared /home/private
chmod 777 /home/shared

# Buat grup Samba
groupadd smbgroup
useradd -m -G smbgroup johndoe

# Set password Samba (beda dengan password Linux!)
smbpasswd -a johndoe

# Restart Samba
systemctl restart smbd
systemctl enable smbd
```

### Akses dari Windows

```
\\192.168.10.10\shared
\\192.168.10.10\private
```

## NFS: File Sharing untuk Linux

**NFS (Network File System)** adalah protokol native Linux untuk berbagi direktori melalui network.

### Server NFS

```bash
apt install nfs-kernel-server -y

# Buat direktori share
mkdir -p /srv/nfs/shared
chown nobody:nogroup /srv/nfs/shared

# Konfigurasi exports
nano /etc/exports

# Tambahkan:
/srv/nfs/shared  192.168.10.0/24(rw,sync,no_subtree_check,no_root_squash)

# Apply
exportfs -a
systemctl restart nfs-kernel-server
```

### Opsi Export

| Opsi | Arti |
|------|------|
| `rw` | Read-write |
| `ro` | Read-only |
| `sync` | Tulis ke disk sebelum response |
| `async` | Response langsung (lebih cepat, risiko data loss) |
| `no_root_squash` | Root client = root server |
| `root_squash` | Root client dipetakan ke nobody |
| `no_subtree_check` | Skip subtree verification |

### Client NFS

```bash
# Di client Linux
apt install nfs-common -y

# Mount
mount -t nfs 192.168.10.10:/srv/nfs/shared /mnt/nfs

# Auto-mount via /etc/fstab
192.168.10.10:/srv/nfs/shared  /mnt/nfs  nfs  defaults  0  0
```

## FTP Server dengan vsFTPd

**vsFTPd** (Very Secure FTP Daemon) adalah FTP server yang ringan dan aman.

### Instalasi

```bash
apt install vsftpd -y
```

### Konfigurasi

Edit `/etc/vsftpd.conf`:

```ini
# Basic settings
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES

# Chroot (isolasi user ke home direktori)
chroot_local_user=YES
allow_writeable_chroot=YES

# Passive mode
pasv_enable=YES
pasv_min_port=30000
pasv_max_port=31000

# Security
ssl_enable=YES
rsa_cert_file=/etc/ssl/certs/ftp.crt
rsa_private_key_file=/etc/ssl/private/ftp.key
require_ssl_reuse=NO

# Upload settings
local_umask=022
file_open_mode=0644
```

### Buat User FTP

```bash
useradd -m ftpuser
passwd ftpuser

# Batasi hanya FTP
usermod -s /usr/sbin/nologin ftpuser

# Restart
systemctl restart vsftpd
```

### Test FTP

```bash
# Install client
apt install ftp -y

# Connect
ftp localhost
# Name: ftpuser
# Password: *****
ftp> ls
ftp> put test.txt
ftp> get test.txt
ftp> quit
```

### Firewall untuk Passive FTP

```bash
ufw allow 21/tcp
ufw allow 30000:31000/tcp
```

## Monitoring Server dengan Netdata

**Netdata** adalah monitoring real-time yang powerful dengan dashboard interaktif.

### Instalasi

```bash
# Install dependencies
apt install curl -y

# Install Netdata via kickstart script
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Atau via apt (jika tersedia di repo)
apt install netdata -y
```

### Konfigurasi

Edit `/etc/netdata/netdata.conf`:

```ini
[global]
    run as user = netdata
    update every = 1

[web]
    bind to = 0.0.0.0:19999
    allow connections from = 192.168.10.0/24

[health]
    enabled = yes
    health configuration directory = /etc/netdata/health.d/
```

Restart:

```bash
systemctl restart netdata
systemctl enable netdata
```

Buka dashboard: `http://192.168.10.10:19999`

### Yang Dimonitor Netdata

| Kategori | Metrik |
|----------|--------|
| **CPU** | Utilization, interrupts, softirqs |
| **Memory** | RAM, swap, page faults |
| **Disks** | I/O, bandwidth, latency |
| **Network** | Traffic per interface, errors, drops |
| **Services** | Nginx, MySQL, Postfix, etc. |
| **System** | Load, processes, uptime |

### Alarm Configuration

Netdata punya **health alarms** bawaan yang bisa dikustomisasi:

```bash
# Contoh: alarm CPU > 90% selama 10 menit
cd /etc/netdata/health.d/
nano cpu.conf
```

```
alarm: cpu_usage
    on: system.cpu
    lookup: average -10m
    warn: $this > 80
    crit: $this > 90
```

### Nginx Reverse Proxy untuk Netdata

```nginx
server {
    listen 80;
    server_name monitor.ngopidulur.local;

    location / {
        proxy_pass http://127.0.0.1:19999;
        proxy_set_header Host $host;
    }

    # Basic auth
    auth_basic "Monitoring";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## Perbandingan File Sharing

| Protokol | Platform | Kecepatan | Keamanan | Setup |
|----------|----------|-----------|----------|-------|
| **Samba** | Windows + Linux | Cepat | User/password | Mudah |
| **NFS** | Linux only | Sangat cepat | IP-based | Mudah |
| **FTP** | Semua | Cepat | User/password + SSL | Medium |
| **SFTP** | Semua | Cepat | SSH key | Mudah (pakai SSH) |
| **SCP** | Semua | Cepat | SSH key | Built-in SSH |

## Kesimpulan

Server Debian 10 kamu sekarang **production-ready**:

- ✅ **DNS** — BIND9 (caching + authoritative)
- ✅ **Web** — Apache/Nginx + MariaDB + PHP
- ✅ **Mail** — Postfix + Dovecot + Roundcube
- ✅ **File Sharing** — Samba (Windows) + NFS (Linux) + FTP
- ✅ **Monitoring** — Netdata (real-time dashboard)

Dengan layanan-layanan ini, kamu bisa mengelola infrastruktur IT skala kecil hingga menengah secara profesional. 

---

*Referensi: Pramudika, A. Debian 10 Server Administration. Samba/NFS/vsFTPd/Netdata Documentation.*
