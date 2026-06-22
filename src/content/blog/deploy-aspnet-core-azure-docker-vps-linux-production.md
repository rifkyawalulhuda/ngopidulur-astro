---
title: "Deploy ASP.NET Core ke Production: Panduan Azure App Service, VPS Linux, dan Docker"
description: Tutorial lengkap deploy aplikasi ASP.NET Core ke production — mulai
  dari Azure App Service (PaaS), VPS Linux dengan Nginx reverse proxy, sampai
  containerized deployment dengan Docker. Disertai checklist production readiness
  dan troubleshooting umum deploy.
pubDate: 2026-06-23T12:00:00.000Z
image: /image/aspnet-core-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ASPNETCore
  - Deployment
  - Azure
  - Docker
  - Linux
  - Nginx
  - DevOps
  - Production
  - CloudComputing
  - Tutorial
---

Aplikasi udah jadi, saatnya go live! Di artikel pamungkas series ASP.NET Core ini, kita akan membahas 3 cara deploy aplikasi ke production — dari yang paling managed (Azure App Service) sampai yang paling fleksibel (Docker container).

## Persiapan Sebelum Deploy

### Checklist Production Readiness

Sebelum deploy, pastikan:

- [ ] **Environment-based config**: `appsettings.Production.json` terpisah
- [ ] **HTTPS enabled**: `app.UseHttpsRedirection()` dan HSTS
- [ ] **Connection string** di environment variable atau Azure Key Vault (bukan di config file)
- [ ] **Logging** terkonfigurasi (Application Insights, Serilog, atau file log)
- [ ] **Error handling**: custom error page, jangan tampilkan stack trace
- [ ] **Database migration** strategy: auto-migrate atau manual?
- [ ] **CORS** terbatas ke domain production saja
- [ ] **Health check endpoint** untuk monitoring
- [ ] **Build di Release mode**

### Build Production

```bash
# Build di Release mode
dotnet publish -c Release -o ./publish

# Output: folder ./publish berisi semua file yang siap deploy
```

Folder `publish/` berisi:
- `MyApp.dll` — compiled application
- `MyApp.exe` — executable untuk Windows
- `web.config` — konfigurasi IIS (jika deploy ke Windows)
- `wwwroot/` — static files (CSS, JS, images)
- Semua dependency NuGet

## Opsi 1: Deploy ke Azure App Service

Azure App Service adalah **PaaS (Platform as a Service)** — paling simpel, managed sepenuhnya oleh Microsoft.

### Deploy via Visual Studio Code

1. Install **Azure App Service extension** di VS Code
2. Klik kanan folder project → **Deploy to Web App**
3. Pilih subscription, buat atau pilih App Service
4. Tunggu deploy selesai — aplikasi langsung live

### Deploy via Azure CLI

```bash
# Login ke Azure
az login

# Buat resource group
az group create --name MyAppRG --location southeastasia

# Buat App Service Plan (Linux)
az appservice plan create \
  --name MyAppPlan \
  --resource-group MyAppRG \
  --sku F1 \             # Free tier untuk testing
  --is-linux

# Buat Web App
az webapp create \
  --name my-ngopidulur-app \
  --resource-group MyAppRG \
  --plan MyAppPlan \
  --runtime "DOTNET|8.0"

# Deploy aplikasi
az webapp deployment source config-zip \
  --resource-group MyAppRG \
  --name my-ngopidulur-app \
  --src ./publish.zip
```

### Connection String di Azure

```bash
# Set connection string sebagai app setting
az webapp config appsettings set \
  --resource-group MyAppRG \
  --name my-ngopidulur-app \
  --settings \
    "ConnectionStrings__DefaultConnection=Server=tcp:myserver.database.windows.net;..." \
    "ASPNETCORE_ENVIRONMENT=Production"
```

> Gunakan format `ConnectionStrings__DefaultConnection` (double underscore) untuk nested JSON config.

## Opsi 2: Deploy ke VPS Linux (Ubuntu + Nginx)

Untuk kontrol penuh dan biaya lebih rendah, deploy ke VPS sendiri.

### Step 1: Install .NET Runtime di Server

```bash
# SSH ke server
ssh user@your-vps-ip

# Install .NET 8 Runtime
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y aspnetcore-runtime-8.0

# Verifikasi
dotnet --list-runtimes
```

### Step 2: Upload & Jalankan Aplikasi

```bash
# Dari laptop lokal — upload publish folder ke server
scp -r ./publish user@your-vps-ip:/var/www/myapp/

# Di server — jalankan aplikasi
cd /var/www/myapp
dotnet MyApp.dll --urls "http://localhost:5000"
```

### Step 3: Setup Nginx sebagai Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Buat konfigurasi site
sudo nano /etc/nginx/sites-available/myapp
```

Konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name ngopidulur.my.id;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan site:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t # test konfigurasi
sudo systemctl reload nginx
```

### Step 4: Setup Systemd agar Auto-Start

```bash
sudo nano /etc/systemd/system/myapp.service
```

```
[Unit]
Description=Ngopidulur ASP.NET Core App
After=network.target

[Service]
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/dotnet /var/www/myapp/MyApp.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=myapp
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable myapp
sudo systemctl start myapp
sudo systemctl status myapp
```

### Step 5: SSL dengan Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-plugin
sudo certbot --nginx -d ngopidulur.my.id
```

## Opsi 3: Deploy dengan Docker

Docker memberikan portability maksimal — jalan sama persis di development, staging, dan production.

### Dockerfile

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj dan restore
COPY *.csproj .
RUN dotnet restore

# Copy semua file dan build
COPY . .
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "MyApp.dll"]
```

### Build & Run

```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d \
  --name myapp \
  -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="..." \
  myapp:latest

# Check logs
docker logs myapp
```

### Docker Compose (App + Database + Nginx)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: myapp
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=MyApp;User=sa;Password=YourPassword123!
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: myapp-db
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
    volumes:
      - db-data:/var/opt/mssql
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: myapp-proxy
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

```bash
# Deploy satu perintah!
docker-compose up -d
```

## Troubleshooting Deploy

### Aplikasi Error 500

```bash
# Aktifkan detailed error (hanya untuk debugging!)
ASPNETCORE_ENVIRONMENT=Development

# Cek log
sudo journalctl -u myapp -f  # Systemd
docker logs myapp             # Docker
```

### Nginx 502 Bad Gateway

- Pastikan aplikasi .NET running di port yang benar
- Cek `proxy_pass` URL di konfigurasi Nginx
- `sudo systemctl status myapp` — pastikan service running

### Database Connection Failed

- Cek connection string — formatnya benar?
- Firewall: port database terbuka?
- Untuk Docker: service name sebagai hostname (bukan localhost)

## Rekomendasi Production

| Skala | Rekomendasi |
|-------|-------------|
| **Hobby / Personal** | VPS $5/bulan (Hetzner, DigitalOcean) + Nginx |
| **Startup / UKM** | Azure App Service (Basic/Standard) — minim ops |
| **Enterprise** | Azure + CI/CD + Kubernetes + auto-scaling |

## Kesimpulan

Deploy ASP.NET Core ke production sekarang jauh lebih mudah dibanding era .NET Framework. Dengan dukungan cross-platform, kamu bisa deploy ke Windows, Linux, container, atau managed cloud — pilih yang paling sesuai dengan kebutuhan dan budget.

Ingat: **production readiness** dimulai dari development. Terapkan best practices sejak awal, dan deploy kamu akan lancar tanpa drama.

---

*Referensi: The Little ASP.NET Core Book — Nate Barbettini, Microsoft .NET Deployment Documentation*
