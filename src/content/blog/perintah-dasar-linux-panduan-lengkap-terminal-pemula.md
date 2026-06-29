---
title: "Perintah Dasar Linux: Panduan Lengkap Terminal untuk Pemula"
description: Kuasai perintah dasar Linux dengan panduan lengkap ini — dari
  navigasi direktori, file management, text processing, permission chmod/chown,
  proses management, hingga shell scripting. Langsung praktik dengan contoh
  nyata. Cocok untuk pemula yang baru pertama kali menyentuh terminal Linux.
pubDate: 2026-06-29T15:00:00.000Z
image: /image/linux-basic-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Linux
  - Terminal
  - CommandLine
  - Bash
  - Shell
  - SysAdmin
  - Pemrograman
---

**Terminal adalah kekuatan Linux.** Banyak yang menganggap mode teks menakutkan, tapi sebenarnya terminal memberi kamu kontrol penuh atas sistem — lebih cepat, lebih efisien, dan lebih powerful daripada GUI.

## Navigasi Direktori

### Mengetahui Posisi Saat Ini

```bash
pwd
# /home/ibteam
```

### Berpindah Direktori

```bash
cd /            # ke root
cd ~            # ke home user
cd ..           # mundur satu level
cd -            # ke direktori sebelumnya
cd /var/log     # ke path absolut
cd Documents    # ke subdirektori Documents
```

### Melihat Isi Direktori

```bash
ls              # tampilkan file & folder
ls -l           # format detail (permission, owner, size, date)
ls -a           # tampilkan hidden files (diawali titik)
ls -la          # kombinasi detail + hidden
ls -lh          # ukuran manusiawi (KB, MB)
ls -R           # rekursif (subfolder juga)
```

## Manajemen File

### Membuat & Menghapus

```bash
touch file.txt              # buat file kosong
mkdir folder                # buat direktori
mkdir -p a/b/c              # buat subfolder sekaligus
rm file.txt                 # hapus file
rm -rf folder/              # hapus folder rekursif (hati-hati!)
rmdir folder                # hapus folder kosong
```

### Copy & Move

```bash
cp source.txt dest.txt      # copy file
cp -r folder/ backup/       # copy folder
mv source.txt newname.txt   # rename
mv file.txt Documents/      # pindah file
```

### Membaca File

```bash
cat file.txt                # tampilkan seluruh isi
less file.txt               # baca panjang (scroll, search)
head -10 file.txt           # 10 baris pertama
tail -10 file.txt           # 10 baris terakhir
tail -f file.txt            # ikuti perubahan file (log)
wc -l file.txt              # hitung baris
wc -w file.txt              # hitung kata
```

## Text Processing

```bash
grep "keyword" file.txt     # cari keyword dalam file
grep -r "keyword" /path/    # cari rekursif
grep -i "case" file.txt     # case-insensitive
grep -v "skip" file.txt     # cari baris yang TIDAK mengandung

sort file.txt               # urutkan berdasarkan alfabet
sort -n file.txt            # urutkan numerik
sort -r file.txt            # urutkan terbalik

uniq file.txt               # hapus duplikat berurutan
sort file.txt | uniq        # hapus semua duplikat

cut -d',' -f1 data.csv      # ambil kolom 1 (delimiter koma)
tr 'a-z' 'A-Z' < file.txt   # ubah ke huruf besar

sed 's/lama/baru/g' file    # replace text
sed -i 's/lama/baru/g' file # replace langsung di file
```

## I/O Redirection

```bash
command > file.txt          # stdout ke file (overwrite)
command >> file.txt         # stdout ke file (append)
command 2> error.txt        # stderr ke file
command > out.txt 2>&1      # stdout + stderr ke file
command < input.txt         # baca input dari file
command1 | command2         # pipe: output cmd1 → input cmd2
```

### Contoh Praktis

```bash
# Cari file log error terbaru
ls -lt /var/log/ | head -5

# Cari proses yang menggunakan banyak RAM
ps aux --sort=-%mem | head -10

# Hitung baris kode di project
find . -name "*.php" | xargs wc -l | tail -1

# Backup direktori
tar -czf backup.tar.gz /home/user/Documents

# Cek disk usage per folder
du -sh /var/*
```

## File Permission

Di Linux, setiap file dan folder punya **3 level permission**:

### Struktur Permission

```
-rwxr-xr-x  1 ibteam ibteam  1024 Jun 29 10:00 script.sh
|  │││ │││   └── owner  group
│  │││ ││└── other/execute
│  │││ │└── other/read
│  │││ └── other/write
│  ││└── group/execute
│  │└── group/read
│  └── group/write
│  owner/execute
│  owner/read
owner/write
```

### Mengubah Permission dengan chmod

#### Numeric Mode

| Angka | Binary | Permission |
|-------|--------|-----------|
| 7 | 111 | rwx (read, write, execute) |
| 6 | 110 | rw- |
| 5 | 101 | r-x |
| 4 | 100 | r-- |

```bash
chmod 755 script.sh     # owner:rwx, group:r-x, other:r-x
chmod 644 file.txt      # owner:rw-, group:r--, other:r--
chmod 700 private.ssh   # owner only
chmod +x script.sh      # tambah permission execute
```

#### Symbolic Mode

```bash
chmod u+x file.txt      # tambah execute untuk user
chmod g-w file.txt      # hapus write untuk group
chmod o=rx file.txt     # set r-x untuk other
chmod a+x file.txt      # tambah execute untuk semua
```

### Mengubah Ownership: chown

```bash
chown user:group file.txt       # ubah owner + group
chown -R user:group folder/     # rekursif untuk folder
chown user file.txt             # ubah owner saja
chgrp group file.txt            # ubah group saja
```

## Manajemen Proses

```bash
ps                  # proses user saat ini
ps aux              # semua proses (lengkap)
ps aux --sort=-%mem # urut berdasarkan memory
top                 # monitor real-time
htop                # top versi warna (lebih bagus)
kill 1234           # hentikan proses (PID)
kill -9 1234        # paksa hentikan (SIGKILL)
pkill firefox       # hentikan berdasarkan nama
pgrep apache        # cari PID berdasarkan nama
```

### Background & Foreground

```bash
command &            # jalankan di background
Ctrl + Z             # pause proses
bg                   # lanjutkan di background
fg                   # bawa ke foreground
jobs                 # lihat background jobs
nohup command &      # jalan meski terminal ditutup
```

## Manajemen User

```bash
whoami               # siapa user saat ini?
id                   # UID, GID, groups
who                  # siapa yang login?
last                 # riwayat login

useradd -m johndoe   # buat user baru + home
passwd johndoe       # set password
usermod -aG sudo jd  # tambah ke grup sudo
userdel -r johndoe   # hapus user + home

su - johndoe         # switch user
sudo command         # jalankan command sebagai root
```

## Shell Scripting Dasar

### Hello World

```bash
#!/bin/bash
echo "Hello, Linux!"
```

Simpan sebagai `hello.sh`, lalu:

```bash
chmod +x hello.sh
./hello.sh
```

### Variabel

```bash
#!/bin/bash
NAMA="Ngopidulur"
echo "Halo, $NAMA!"

# Input dari user
read -p "Masukkan nama: " nama
echo "Selamat datang $nama"
```

### Looping & Kondisi

```bash
#!/bin/bash
# Loop
for i in 1 2 3; do
    echo "Angka: $i"
done

# Kondisi
if [ -f /etc/hosts ]; then
    echo "File exists"
else
    echo "File not found"
fi
```

## Tips Terminal

1. **Tab completion** — tekan Tab untuk auto-complete
2. `Ctrl + R` — search command history
3. `history` — lihat semua perintah yang pernah dijalankan
4. `Ctrl + L` — bersihkan terminal
5. `Ctrl + C` — batalkan command
6. `Ctrl + D` — logout
7. `!!` — ulangi perintah terakhir
8. `!! | grep error` — ulangi perintah terakhir + filter

## Kesimpulan

Terminal Linux mungkin terlihat menakutkan, tapi dengan menguasai 30 perintah di atas, kamu sudah bisa melakukan 90% pekerjaan administrasi sistem. Latihan rutin di terminal akan membuatmu semakin nyaman.

Di artikel selanjutnya: **Instalasi Software & Manajemen Service di Linux** — package manager, systemctl, dan troubleshooting.

---

*Referensi: IBTeam Aceh Region. Linux Basic Tutorial Ebook, 2nd Edition. GNU Bash Manual.*
