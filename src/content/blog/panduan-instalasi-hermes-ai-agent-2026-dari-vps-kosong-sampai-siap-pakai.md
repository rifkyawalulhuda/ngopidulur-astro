---
title: "Panduan Instalasi Hermes AI Agent 2026: Dari VPS Kosong sampai Siap Pakai"
description: Panduan lengkap instalasi Hermes AI Agent di Linux, macOS, dan
  Windows (WSL2). Mulai dari persiapan sampai first run, termasuk
  troubleshooting dan rekomendasi setup production 2026. Cocok untuk pemula yang
  ingin self-hosting AI Agent.
pubDate: 2026-05-22T14:11:00.000Z
image: /image/Gemini_Generated_Image_l39clcl39clcl39c.webp
draft: false
categories:
  - Teknologi
tags:
  - HermesAgent
  - AI Agent
  - SelfHosted
  - Linux
  - WSL2
  - NousResearch
  - TelegramGateway
  - MiniPC
  - Coolify
---
Baru mau coba bikin AI Agent sendiri? Hermes Agent dari Nous Research adalah salah satu framework agent yang paling powerful dan fleksibel di 2026.

Artikel ini merangkum **panduan instalasi lengkap** Hermes AI Agent — mulai dari VPS Linux, macOS, sampai Windows via WSL2. Cocok buat pemula maupun yang sudah punya pengalaman self-hosting.

## Minimum Requirements

| Komponen   | Linux          | macOS              | Windows (WSL)     |
|------------|----------------|--------------------|-------------------|
| CPU        | 1 Core         | Intel / Apple Silicon | Any x64        |
| RAM        | 1 GB           | 4 GB+              | 4 GB+             |
| Storage    | 10 GB          | 10 GB              | 10 GB             |
| Python     | 3.10+          | 3.10+              | 3.10+             |
| Node.js    | 18.x+          | 18.x+              | 18.x+             |

**Rekomendasi**: Untuk production 24/7, pakai **VPS Linux**. Untuk belajar, laptop Mac/Windows juga cukup.

## 1. Linux (Ubuntu/Debian) – Paling Direkomendasikan

Panduan ini untuk Ubuntu 22.04 / 24.04.

### Step 1: Update Sistem
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Dependencies
```bash
sudo apt install -y curl git python3 python3-pip python3-venv build-essential ffmpeg tesseract-ocr
```

### Step 3: Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

### Step 4: Install Hermes Agent (Pilih salah satu)

**Opsi A – Install Script (Recommended)**
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

**Opsi B – Install dari Source**
```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
pip install -e .
hermes doctor
```

### Step 5: Verifikasi
```bash
hermes doctor
hermes --version
```

Kalau semua hijau, instalasi Linux berhasil!

## 2. macOS (Intel & Apple Silicon)

### Step 1: Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Dependencies
```bash
brew install python@3.12 node git curl ffmpeg tesseract
```

Untuk Apple Silicon + GPU acceleration (opsional):
```bash
brew install --cask llama.cpp
```

### Step 3: Install Hermes Agent
Sama seperti Linux:

```bash
# Opsi A (Recommended)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Opsi B
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
pip3 install -e .
hermes doctor
```

### Step 4: Fix PATH (jika perlu)
Tambahkan ke `~/.zshrc`:
```bash
export PATH="$PATH:~/.local/bin"
```

## 3. Windows (WSL2)

Hermes **tidak bisa** jalan native di Windows. Harus lewat WSL2.

### Step 1: Install WSL2
Buka **PowerShell sebagai Administrator**, lalu jalankan:
```powershell
wsl --install -d Ubuntu-24.04
```

Cek versi:
```powershell
wsl --version
```

> **Penting**: Pastikan pakai **WSL2**, bukan WSL1.

### Step 2: Install di dalam WSL
Masuk ke terminal Ubuntu, lalu jalankan langkah yang sama seperti Linux di atas.

### Step 3: Setup Gateway (Akses dari Windows)
```bash
hermes gateway setup   # Pilih Telegram
hermes gateway start
```

Sekarang kamu bisa chat dengan Hermes lewat Telegram dari HP atau Windows.

## 4. Verifikasi & First Run

Setelah instalasi, lakukan langkah berikut:

```bash
# 1. Cek kesehatan sistem
hermes doctor

# 2. Cek versi
hermes --version

# 3. First chat (tanpa setup)
hermes chat -q "Halo, siapa kamu?"

# 4. Masuk mode interaktif
hermes
```

Kalau muncul error API key, daftar gratis di [openrouter.ai](https://openrouter.ai) lalu masukkan ke file:

```bash
echo 'OPENROUTER_API_KEY=sk-or-v1-...' >> ~/.hermes/.env
```

## 5. Konfigurasi Awal

Gunakan setup wizard (paling mudah):

```bash
hermes setup           # Setup lengkap
hermes setup model     # Hanya model & provider
hermes setup gateway   # Setup Telegram / Discord
```

**File Penting**:
- `~/.hermes/config.yaml` → Konfigurasi utama
- `~/.hermes/.env` → API Keys (jangan di-share!)
- `~/.hermes/skills/` → Skill yang terinstall
- `~/.hermes/sessions/` → Riwayat percakapan

## 6. Troubleshooting

| Masalah                        | Penyebab                        | Solusi                                      |
|--------------------------------|---------------------------------|---------------------------------------------|
| `hermes doctor` error          | Missing dependencies            | Install ulang dependencies via apt/brew     |
| `command not found: hermes`    | PATH belum include `~/.local/bin` | `export PATH=$PATH:~/.local/bin`         |
| Python version error           | Python < 3.10                   | Install Python 3.10+ via pyenv / apt        |
| Node.js not found              | Node.js belum terinstall        | Install Node.js 20.x via NodeSource         |
| Gateway tidak jalan            | WSL2 systemd disabled           | Enable systemd di `/etc/wsl.conf`           |
| `No module named _tkinter`     | Tkinter missing                 | `sudo apt install python3-tk`               |

Masih bermasalah? Tanya di X: **@sequencetraders** atau buka issue di GitHub NousResearch/hermes-agent.

## Kesimpulan

Hermes AI Agent adalah framework yang sangat powerful untuk membuat agent otonom. Dengan panduan ini, kamu bisa install Hermes di hampir semua platform dalam waktu kurang dari 15 menit.

**Rekomendasi setup 2026**:
- **Production / 24/7** → VPS Linux + Coolify + Cloudflare Tunnel
- **Development** → MacBook / Windows + WSL2
- **Testing cepat** → Gunakan OpenRouter gratis dulu

Sudah berhasil install Hermes?  
Share screenshot `hermes doctor` kamu di komentar, atau ceritakan kendala yang kamu hadapi!

Mau saya buatkan panduan lanjutan? Misalnya:
- Setup Hermes + DeepSeek + Telegram Gateway
- Cara bikin custom skill
- Deploy Hermes di Mini PC (Beelink / T9 Plus)

Tinggal bilang di komentar!

**Sumber**: Panduan Instalasi Hermes AI Agent oleh Noctis (@sequencetraders), 16 Mei 2026.
