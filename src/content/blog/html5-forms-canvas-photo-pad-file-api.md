---
title: "HTML5 Forms, Canvas Drawing, dan Photo Pad dengan File API"
description: Panduan praktis HTML5 dari buku J.M. Gustafson - input types color
  date email range, custom data attributes, data binding, canvas API, drawing
  lines rectangles circles text, touch events, File API, image effects.
pubDate: 2026-10-19T08:00:00.000Z
image: /image/html5-web-app-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML5
  - Canvas
  - FileAPI
  - JavaScript
series: "HTML5 Web Application By Example"
seriesOrder: 2
---

Chapter 3-5 dari *HTML5 Web Application Development By Example* membawa kita ke tiga area penting: **form inputs HTML5** dan data binding (Ch3), **Canvas API** untuk drawing (Ch4-5), serta **File API** dan manipulasi gambar dengan Photo Pad (Ch5).

## Daftar Isi

- [HTML5 Input Types](#html5-input-types)
- [Task Details](#task-details)
- [Custom Data Attributes](#custom-data-attributes)
- [Data Binding dengan Custom Attributes](#data-binding-dengan-custom-attributes)
- [Queuing Up Changes](#queuing-up-changes)
- [HTML5 Canvas](#html5-canvas)
- [Canvas Basics](#canvas-basics)
- [Membuat Canvas Pad](#membuat-canvas-pad)
- [Drawing Lines dengan Mouse](#drawing-lines-dengan-mouse)
- [Context Properties](#context-properties)
- [Toolbar dan Drawing Tools](#toolbar-dan-drawing-tools)
- [Rectangles, Circles, dan Arcs](#rectangles-circles-dan-arcs)
- [Drawing Text](#drawing-text)
- [Transformations: Ellipse Tool](#transformations-ellipse-tool)
- [Exporting Image](#exporting-image)
- [Touch Events](#touch-events)
- [Photo Pad dan File API](#photo-pad-dan-file-api)
- [Image Effects: Black White dan Sepia](#image-effects-black-white-dan-sepia)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## HTML5 Input Types

HTML5 menambahkan banyak **input types baru** untuk form — validasi dan UI dibangun browser:

```html
<!-- Color picker -->
<input type="color">

<!-- Date picker -->
<input type="date">

<!-- Email dengan validasi -->
<input type="email" placeholder="nama@email.com">

<!-- Number dengan min/max/step -->
<input type="number" min="1" max="100" step="1">

<!-- Range slider -->
<input type="range" min="0" max="100" value="50">

<!-- Time -->
<input type="time">

<!-- URL -->
<input type="url">

<!-- Datalist — dropdown + free text -->
<input type="text" list="cities">
<datalist id="cities">
    <option value="Jakarta">
    <option value="Bandung">
    <option value="Surabaya">
</datalist>

<!-- Autofocus -->
<input type="text" autofocus>
```

### Keuntungan Input Types

- **Validasi otomatis** — email/url dicek browser
- **UI native** — date picker, color picker, slider
- **Mobile keyboard** — keyboard yang tepat per tipe
- **Tanpa JavaScript** untuk validasi dasar

## Task Details

Aplikasi tasklist diperluas dengan **task details** — form detail yang muncul saat task diklik:

```javascript
// Toggle tampilkan/sembunyikan detail
$("#taskList").on("click", "li", function() {
    $(this).find(".details").toggle();
});
```

Detail task: deskripsi, due date, priority, kategori.

## Custom Data Attributes

**Custom data attributes** (`data-*`) menyimpan data di elemen HTML:

```html
<li data-id="123" data-priority="high">
    <span>Task penting</span>
</li>
```

```javascript
// Akses via jQuery
var id = $("li").data("id");        // 123
var priority = $("li").data("priority"); // "high"

// Set
$("li").attr("data-status", "done");
```

Manfaat: data terikat elemen — tidak perlu lookup terpisah.

## Data Binding dengan Custom Attributes

Buku membangun **data model** dengan binding sederhana — elemen yang terikat field objek:

```javascript
// Data model
var taskModel = {
    id: 123,
    text: "Belajar HTML5",
    description: "Baca buku chapter 3",
    dueDate: "2026-10-25",
    priority: "high"
};

// Binding: elemen dengan data-bind diisi dari model
function applyBindings(model) {
    $("[data-bind]").each(function() {
        var field = $(this).data("bind");
        $(this).val(model[field]).text(model[field]);
    });
}
```

```html
<input type="text" data-bind="text">
<input type="date" data-bind="dueDate">
<select data-bind="priority">
    <option value="low">Low</option>
    <option value="high">High</option>
</select>
```

### Memuat Task List

```javascript
function loadTask(id) {
    var task = StorageManager.get("task_" + id);
    applyBindings(task);
}
```

Data binding memisahkan **tampilan dari logika** — satu sumber kebenaran (model).

## Queuing Up Changes

Buku mengajarkan **menunda penyimpanan** (debounce) — perubahan di-queue dan disimpan berkala:

```javascript
var saveQueue = [];
var saveTimer = null;

function queueSave(task) {
    saveQueue.push(task);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSaveQueue, 1000);
}

function flushSaveQueue() {
    while (saveQueue.length > 0) {
        var task = saveQueue.shift();
        StorageManager.set("task_" + task.id, task);
    }
}
```

Manfaat: mengurangi write ke localStorage — user mengetik tanpa save per keystroke.

## HTML5 Canvas

**Canvas** adalah elemen HTML5 untuk menggambar grafis via JavaScript:

```html
<canvas id="myCanvas" width="600" height="400"></canvas>
```

Canvas seperti **kanvas lukis** — semua digambar dengan kode, bukan markup.

## Canvas Basics

### Getting a Context

```javascript
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
```

`getContext("2d")` mengembalikan **2D drawing context** — API untuk menggambar.

### Clearing the Canvas

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

### Context Properties

```javascript
ctx.fillStyle = "#ff0000";    // warna isi
ctx.strokeStyle = "#0000ff";  // warna garis
ctx.lineWidth = 3;            // ketebalan garis
ctx.font = "20px Arial";      // font teks
```

## Membuat Canvas Pad

Aplikasi **Canvas Pad** — kanvas yang bisa digambar dengan mouse:

### Menampilkan Koordinat

```javascript
canvas.addEventListener("mousemove", function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    $("#coordinates").text("X: " + x + ", Y: " + y);
});
```

## Drawing Lines dengan Mouse

```javascript
var drawing = false;
var lastX, lastY;

canvas.addEventListener("mousedown", function(e) {
    drawing = true;
    var pos = getMousePos(e);
    lastX = pos.x; lastY = pos.y;
});

canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;
    var pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x; lastY = pos.y;
});

canvas.addEventListener("mouseup", function() {
    drawing = false;
});
```

### Paths dan Strokes

```javascript
ctx.beginPath();       // mulai path baru
ctx.moveTo(10, 10);    // pindah ke titik awal
ctx.lineTo(100, 100);  // garis ke titik berikut
ctx.stroke();          // gambar garis (stroke)
```

## Context Properties

```javascript
// Pilihan warna dan ketebalan
$("#colorPicker").on("change", function() {
    ctx.strokeStyle = $(this).val();
});
$("#lineWidth").on("change", function() {
    ctx.lineWidth = parseInt($(this).val(), 10);
});
```

## Toolbar dan Drawing Tools

Buku membangun **toolbar reusable** — objek toolbar dengan menu items:

```javascript
var Toolbar = {
    create: function(container, items) {
        var $toolbar = $("<div>").addClass("toolbar");
        $.each(items, function(i, item) {
            var $btn = $("<button>").text(item.label)
                .attr("data-action", item.action);
            $toolbar.append($btn);
        });
        $(container).append($toolbar);
    }
};

// Menggunakan
Toolbar.create("#main", [
    { label: "Line", action: "line" },
    { label: "Rectangle", action: "rectangle" },
    { label: "Circle", action: "circle" }
]);
```

## Rectangles, Circles, dan Arcs

### Drawing Rectangles

```javascript
// fillRect dan strokeRect
ctx.fillRect(x, y, width, height);   // persegi terisi
ctx.strokeRect(x, y, width, height); // persegi garis
```

### Arcs dan Circles

```javascript
// arc(x, y, radius, startAngle, endAngle, counterclockwise)
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2, true); // lingkaran penuh
ctx.stroke();
```

### Rectangular Selection (rubber band)

```javascript
// Menarik seleksi persegi — simpan start, gambar saat move
var startX, startY;
canvas.addEventListener("mousedown", function(e) {
    var pos = getMousePos(e);
    startX = pos.x; startY = pos.y;
});
canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;
    var pos = getMousePos(e);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
});
```

## Drawing Text

```javascript
ctx.font = "24px Arial";
ctx.fillStyle = "#333";
ctx.fillText("Halo Dunia", 50, 100);      // teks terisi
ctx.strokeText("Outline", 50, 150);       // teks garis
```

## Transformations: Ellipse Tool

**Transformations** canvas — scale, rotate, translate:

```javascript
// Ellipse via scale
ctx.save();
ctx.translate(cx, cy);        // pindah pusat
ctx.scale(1, ry / rx);        // ratakan vertikal
ctx.beginPath();
ctx.arc(0, 0, rx, 0, Math.PI * 2, true);
ctx.restore();
ctx.stroke();
```

`ctx.save()` / `ctx.restore()` — simpan dan pulihkan state context.

## Exporting Image

Canvas bisa diexport sebagai gambar:

```javascript
$("#exportBtn").on("click", function() {
    var url = canvas.toDataURL("image/png");
    var $link = $("<a>")
        .attr("href", url)
        .attr("download", "canvas.png")
        .text("Unduh gambar");
    $("#exportArea").append($link);
});
```

## Touch Events

Canvas Pad diperluas untuk **perangkat touch**:

```javascript
canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    var touch = e.touches[0];
    drawing = true;
    lastX = touch.pageX - rect.left;
    lastY = touch.pageY - rect.top;
});

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    if (!drawing) return;
    var touch = e.touches[0];
    // gambar garis seperti mouse
});
```

**Touch events:** `touchstart`, `touchmove`, `touchend` — dengan `e.touches` untuk posisi.

## Photo Pad dan File API

Aplikasi **Photo Pad** — memuat gambar dari file lokal dan menerapkan efek:

### File API

```javascript
$("#fileInput").on("change", function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            drawImage(img);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});
```

File API memungkinkan **membaca file lokal** tanpa upload server — `FileReader` membaca file sebagai Data URL.

## Image Effects: Black White dan Sepia

Efek gambar diterapkan dengan **manipulasi pixel**:

```javascript
var imageEffects = {
    apply: function(effect) {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {
            var r = data[i], g = data[i+1], b = data[i+2];

            if (effect === "bw") {
                // Grayscale: rata-rata channel
                var gray = (r + g + b) / 3;
                data[i] = data[i+1] = data[i+2] = gray;
            } else if (effect === "sepia") {
                // Sepia: kombinasi channel berbobot
                data[i]   = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
};
```

### Image Distortion: Making Waves

```javascript
// Efek wave — geser baris pixel secara sinusoidal
function makeWaves() {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var output = ctx.createImageData(imageData);

    for (var y = 0; y < canvas.height; y++) {
        var offset = Math.floor(Math.sin(y / 10) * 5);
        for (var x = 0; x < canvas.width; x++) {
            var srcX = Math.min(Math.max(x + offset, 0), canvas.width - 1);
            var srcIdx = (y * canvas.width + srcX) * 4;
            var dstIdx = (y * canvas.width + x) * 4;
            output.data[dstIdx]   = data[srcIdx];
            output.data[dstIdx+1] = data[srcIdx+1];
            output.data[dstIdx+2] = data[srcIdx+2];
            output.data[dstIdx+3] = data[srcIdx+3];
        }
    }
    ctx.putImageData(output, 0, 0);
}
```

## Kesimpulan

Chapter 3-5 menunjukkan kekuatan HTML5: **form inputs** dengan validasi native, **custom data attributes** dan **data binding** untuk aplikasi terstruktur, **Canvas API** untuk drawing lengkap (garis, persegi, lingkaran, teks, transformasi, export), **touch events** untuk mobile, serta **File API** dengan manipulasi pixel (grayscale, sepia, wave).

Di artikel berikutnya: **audio** dan game Piano Hero (Chapter 6-7).

## Referensi

- Gustafson, J. M. (2013). *HTML5 Web Application Development By Example*. Packt Publishing.
- W3C. (2014). *HTML Canvas 2D Context*. w3.org.
- W3C. (2014). *File API*. w3.org.
- Mozilla Developer Network. (2024). *Canvas API*, *FileReader*. developer.mozilla.org.
