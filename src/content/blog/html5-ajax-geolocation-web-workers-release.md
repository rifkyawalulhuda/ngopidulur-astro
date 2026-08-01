---
title: "Ajax, Geolocation, Web Workers, dan Release Aplikasi HTML5"
description: Panduan praktis HTML5 dari buku J.M. Gustafson - Ajax XML JSON,
  geolocation API, web services JSONP, weather widget, web workers, Mandelbrot
  set, minification, application cache offline, release script.
pubDate: 2026-10-21T08:00:00.000Z
image: /image/html5-web-app-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML5
  - Ajax
  - Geolocation
  - WebWorkers
series: "HTML5 Web Application By Example"
seriesOrder: 4
---

Chapter 8-10 dari *HTML5 Web Application Development By Example* membawa aplikasi ke dunia nyata: **Ajax** dan **Geolocation** untuk data eksternal (Ch8), **Web Workers** untuk komputasi paralel (Ch9), dan **release** aplikasi dengan minification serta Application Cache (Ch10).

## Daftar Isi

- [Introduction to Ajax](#introduction-to-ajax)
- [Membuat Weather Widget](#membuat-weather-widget)
- [Mendapatkan Data XML](#mendapatkan-data-xml)
- [Mendapatkan Data JSON](#mendapatkan-data-json)
- [HTML5 Geolocation API](#html5-geolocation-api)
- [Menggunakan Web Services](#menggunakan-web-services)
- [Cross-Site Scripting dan JSONP](#cross-site-scripting-dan-jsonp)
- [Memanggil Weather Service](#memanggil-weather-service)
- [Web Workers](#web-workers)
- [Spawning dan Implementing Web Worker](#spawning-web-worker)
- [Mandelbrot Set](#mandelbrot-set)
- [Mandelbrot dengan Web Worker](#mandelbrot-dengan-web-worker)
- [Debugging Web Workers](#debugging-web-workers)
- [Release: Menggabungkan dan Mengompres JavaScript](#release-menggabungkan-dan-mengompres-javascript)
- [HTML5 Application Cache](#html5-application-cache)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Introduction to Ajax

**Ajax (Asynchronous JavaScript and XML)** memungkinkan aplikasi berkomunikasi dengan server **tanpa reload halaman**:

- Request asinkron ke server
- Update sebagian halaman
- Data dalam format XML, JSON, atau plain text

### Membuat Ajax Requests

Dengan jQuery:

```javascript
// GET request
$.ajax({
    url: "data/weather.xml",
    type: "GET",
    dataType: "xml",
    success: function(data) {
        renderWeather(data);
    },
    error: function(xhr, status, error) {
        console.error("Error:", error);
    }
});

// Shorthand GET
$.get("data/weather.json", function(data) {
    renderWeather(data);
});
```

## Membuat Weather Widget

Aplikasi **weather widget** — menampilkan cuaca berdasarkan lokasi:

```html
<div id="weather">
    <h2>Cuaca Saat Ini</h2>
    <div id="weatherData">
        <p id="location">...</p>
        <p id="temperature">...</p>
        <p id="conditions">...</p>
    </div>
</div>
```

## Mendapatkan Data XML

```xml
<!-- data/weather.xml -->
<weather>
    <location>Jakarta</location>
    <temperature>31</temperature>
    <conditions>Berawan</conditions>
    <humidity>75%</humidity>
</weather>
```

```javascript
// Parse XML response
function renderWeather(xml) {
    var location = $(xml).find("location").text();
    var temp = $(xml).find("temperature").text();
    $("#location").text(location);
    $("#temperature").text(temp + "°C");
}
```

**XML parsing** via jQuery — query dengan `$(xml).find()`.

## Mendapatkan Data JSON

```json
{
    "location": "Jakarta",
    "temperature": 31,
    "conditions": "Berawan",
    "humidity": "75%"
}
```

```javascript
// Parse JSON — otomatis oleh jQuery
function renderWeather(data) {
    $("#location").text(data.location);
    $("#temperature").text(data.temperature + "°C");
    $("#conditions").text(data.conditions);
}
```

**JSON lebih umum** — parsing otomatis, struktur native JavaScript.

## HTML5 Geolocation API

**Geolocation API** mendapatkan posisi pengguna:

```javascript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            $("#coordinates").text(lat + ", " + lon);
            getWeather(lat, lon);
        },
        function(error) {
            console.error("Error:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
} else {
    alert("Geolocation tidak didukung browser");
}
```

**Position object** berisi `coords.latitude`, `coords.longitude`, `coords.accuracy`.

## Menggunakan Web Services

Weather widget menggunakan **web service eksternal** — misalnya **Weather Underground**:

```javascript
function getWeather(lat, lon) {
    var url = "http://api.wunderground.com/api/" +
        API_KEY + "/conditions/q/" + lat + "," + lon + ".json";

    $.getJSON(url, function(data) {
        var current = data.current_observation;
        $("#temperature").text(current.temp_c + "°C");
        $("#conditions").text(current.weather);
    });
}
```

## Cross-Site Scripting dan JSONP

### Masalah Cross-Origin

Ajax browser **tidak bisa** memanggil domain lain langsung (Same-Origin Policy) — ini untuk keamanan, tapi membatasi integrasi web services.

### Solusi: JSONP (JSON with Padding)

**JSONP** memanfaatkan `<script>` tag yang bebas cross-domain:

```javascript
// jQuery menangani JSONP otomatis via callback parameter
$.ajax({
    url: "http://api.example.com/weather?lat=6&lon=106",
    dataType: "jsonp",  // ← JSONP!
    success: function(data) {
        renderWeather(data);
    }
});
```

Cara kerja JSONP:
1. Browser membuat `<script src="url?callback=funcName">`
2. Server membungkus JSON dalam callback: `funcName({...})`
3. Browser mengeksekusi callback dengan data

### CORS (Alternative Modern)

Server bisa mengizinkan cross-origin via header `Access-Control-Allow-Origin`.

## Memanggil Weather Service

```javascript
function init() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocation);
    } else {
        // Fallback lokasi default
        getWeather(-6.2, 106.8);  // Jakarta
    }
}

function onLocation(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    getWeather(lat, lon);
}
```

## Web Workers

**Web Workers** menjalankan JavaScript **di thread terpisah** — UI tidak membeku saat komputasi berat:

- **Main thread** — UI, events, DOM
- **Worker thread** — komputasi paralel
- Komunikasi via **postMessage**

### Spawning Web Worker

```javascript
// main.js
var worker = new Worker("js/compute.js");

worker.onmessage = function(e) {
    // Terima hasil dari worker
    $("#result").text("Hasil: " + e.data);
};

worker.onerror = function(e) {
    console.error("Worker error:", e.message);
};

// Kirim data ke worker
worker.postMessage({ x: 1000, y: 1000 });
```

### Implementing Web Worker

```javascript
// compute.js — dijalankan worker thread
self.onmessage = function(e) {
    var data = e.data;
    var result = heavyComputation(data);
    self.postMessage(result);
};

function heavyComputation(data) {
    // komputasi berat tanpa membekukan UI
    return data.x * data.y;
}
```

**Batasan worker:** tidak bisa akses DOM, window, document — hanya komputasi murni dan postMessage.

## Mandelbrot Set

**Mandelbrot set** — fraktal matematika terkenal, butuh komputasi intensif per pixel:

```javascript
// hitung apakah titik (x, y) dalam Mandelbrot set
function isInMandelbrot(x, y, maxIterations) {
    var zx = 0, zy = 0;
    var cx = x, cy = y;
    var iteration = 0;

    while (zx*zx + zy*zy <= 4 && iteration < maxIterations) {
        var temp = zx*zx - zy*zy + cx;
        zy = 2*zx*zy + cy;
        zx = temp;
        iteration++;
    }

    return iteration;  // maxIterations = dalam set
}
```

Fraktal Mandelbrot butuh menghitung **jutaan pixel** — sempurna untuk demonstrasi web worker.

## Mandelbrot dengan Web Worker

### Tanpa Worker — UI Membeku

```javascript
// Menghitung di main thread → browser freeze
function computeMandelbrot(width, height) {
    var imageData = ctx.createImageData(width, height);
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            // ... komputasi berat
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
```

### Dengan Worker — UI Tetap Responsif

```javascript
// main.js
var worker = new Worker("js/mandelbrot-worker.js");

worker.onmessage = function(e) {
    ctx.putImageData(e.data.imageData, 0, 0);
    $("#status").text("Selesai!");
};

$("#startBtn").on("click", function() {
    $("#status").text("Menghitung...");
    worker.postMessage({ width: 800, height: 600 });
});
```

```javascript
// mandelbrot-worker.js
self.onmessage = function(e) {
    var w = e.data.width, h = e.data.height;
    var imageData = new ImageData(w, h);

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var value = computePixel(x, y);
            var idx = (y * w + x) * 4;
            imageData.data[idx] = value;
            imageData.data[idx+1] = value;
            imageData.data[idx+2] = value;
            imageData.data[idx+3] = 255;
        }
    }

    self.postMessage({ imageData: imageData });
};
```

**Catatan:** `ImageData` tersedia di worker (Canvas 2D untuk OffscreenCanvas) — atau kirim array data pixel dan buat ImageData di main thread.

## Debugging Web Workers

- Chrome DevTools: **Sources → Workers** — debug worker terpisah
- `console.log` di worker muncul di console dengan prefix
- `worker.onerror` menangkap error runtime
- Gunakan **try/catch** di worker untuk error handling

## Release: Menggabungkan dan Mengompres JavaScript

### Minification

Production membutuhkan file kecil:

- **Gabungkan** banyak JS files jadi satu (kurangi HTTP requests)
- **Minify** — hapus whitespace, komentar, perpendek variabel
- Tools: UglifyJS, Closure Compiler, YUI Compressor

### Membuat Release Script

```javascript
// build/release.js — script build sederhana
var files = [
    "js/jquery.min.js",
    "js/storage-manager.js",
    "js/audio-manager.js",
    "js/app.js"
];

// 1. Gabungkan semua file
var combined = files.map(function(f) {
    return fs.readFileSync(f, "utf8");
}).join("\n");

// 2. Tulis ke satu file
fs.writeFileSync("dist/app.combined.js", combined);

// 3. Minify (via UglifyJS)
var result = UglifyJS.minify(combined);
fs.writeFileSync("dist/app.min.js", result.code);
```

```html
<!-- Production — satu file kecil -->
<script src="js/app.min.js"></script>
```

## HTML5 Application Cache

**Application Cache** membuat aplikasi **bisa offline**:

### Membuat Cache Manifest

```
CACHE MANIFEST
# v1.0.0

# File yang di-cache
CACHE:
index.html
css/style.css
js/app.min.js
images/logo.png

# File yang tidak pernah di-cache
NETWORK:
*
```

```html
<!-- Referensi manifest di HTML -->
<html manifest="app.manifest">
```

### Cara Kerja Application Cache

1. Browser **pertama kali** memuat halaman → download file di manifest
2. Kunjungan berikutnya → aplikasi **dari cache** (offline-capable)
3. Server tidak perlu untuk akses berulang
4. **Versioning** — ubah komentar `# v1.0.1` untuk trigger update

### Batasan

- Cache di-manage browser (kontrol terbatas)
- Total size terbatas (~5MB per origin)
- **Sudah deprecated** — digantikan **Service Workers** (lebih powerful)

## Kesimpulan

Chapter 8-10 menyelesaikan perjalanan HTML5: **Ajax** dengan XML/JSON dan **JSONP** untuk cross-domain, **Geolocation API** untuk lokasi, **Web Workers** untuk komputasi paralel tanpa membekukan UI (demonstrasi Mandelbrot), serta **release** aplikasi — minification, cache manifest untuk offline.

**Perjalanan lengkap 10 chapter:** dari aplikasi tasklist sederhana, styling CSS3, canvas drawing, audio dan game, hingga aplikasi data-driven dengan web services dan optimasi production.

## Referensi

- Gustafson, J. M. (2013). *HTML5 Web Application Development By Example*. Packt Publishing.
- W3C. (2014). *HTML5 Web Workers*, *Geolocation API*, *Application Cache*. w3.org.
- Mozilla Developer Network. (2024). *Ajax*, *JSONP*, *Web Workers*, *Service Workers*. developer.mozilla.org.
- Weather Underground. (2013). *Weather API Documentation*. wunderground.com.
