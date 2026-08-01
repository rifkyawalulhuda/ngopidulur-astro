---
title: "HTML5 Web App: Tasklist dengan Web Storage dan CSS3 Styling"
description: Panduan praktis HTML5 web application development dari buku J.M.
  Gustafson - komponen aplikasi HTML5, jQuery, DOM manipulation, HTML templates,
  localStorage, CSS3 colors gradients shadows transitions, dynamic stylesheets.
pubDate: 2026-10-18T08:00:00.000Z
image: /image/html5-web-app-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML5
  - CSS3
  - JavaScript
  - WebStorage
series: "HTML5 Web Application By Example"
seriesOrder: 1
---

*HTML5 Web Application Development By Example* karya **J.M. Gustafson** (Packt Publishing) adalah buku hands-on yang membangun **10 aplikasi web nyata** — dari tasklist sederhana sampai game piano. Pendekatan buku ini "Time for Action": setiap konsep langsung dipraktikkan step-by-step. Artikel pertama ini mencakup Chapter 1-2: fondasi aplikasi HTML5 dan styling CSS3.

## Daftar Isi

- [Tiga Komponen Aplikasi HTML5](#tiga-komponen-aplikasi-html5)
- [Membuat File HTML](#membuat-file-html)
- [Membuat File CSS](#membuat-file-css)
- [Membuat File JavaScript](#membuat-file-javascript)
- [jQuery Basics dan Dollar Sign](#jquery-basics-dan-dollar-sign)
- [Membuat Aplikasi Tasklist](#membuat-aplikasi-tasklist)
- [Menghapus dan Memindahkan Task](#menghapus-dan-memindahkan-task)
- [HTML Templates](#html-templates)
- [Editing Task](#editing-task)
- [Web Storage API dan localStorage](#web-storage-api-dan-localstorage)
- [CSS3 Colors dan Rounded Corners](#css3-colors-dan-rounded-corners)
- [Shadows: Box dan Text](#shadows-box-dan-text)
- [Backgrounds: Gradients dan Sprites](#backgrounds-gradients-dan-sprites)
- [Transitions dan Transforms](#transitions-dan-transforms)
- [Dynamic Stylesheets: Theme Selector](#dynamic-stylesheets-theme-selector)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Tiga Komponen Aplikasi HTML5

Setiap web application dimulai dari **tiga komponen**:

- **HTML** — struktur konten
- **CSS** — presentasi dan styling
- **JavaScript** — perilaku dan interaksi

Bisa ditaruh satu file untuk aplikasi sangat sederhana, tapi buku mengajarkan **pemisahan file** — aplikasi nyata butuh struktur yang rapi. Buku juga membangun **application template** yang dipakai sebagai basis semua aplikasi berikutnya — menghindari "reinventing the wheel" setiap memulai project.

## Membuat File HTML

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Tasklist</title>
    <link rel="stylesheet" href="css/tasklist.css">
</head>
<body>
    <div id="container">
        <h1>Tasklist</h1>
        <!-- konten aplikasi -->
    </div>
    <script src="js/jquery.min.js"></script>
    <script src="js/tasklist.js"></script>
</body>
</html>
```

## Membuat File CSS

```css
body {
    background: #f0f0f0;
    font-family: Arial, sans-serif;
}

#container {
    width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
}
```

## Membuat File JavaScript

```javascript
$(document).ready(function() {
    initApplication();
});

function initApplication() {
    // inisialisasi aplikasi
    console.log("Tasklist siap!");
}
```

## jQuery Basics dan Dollar Sign

Buku memakai **jQuery** untuk manipulasi DOM — pengenal `$`:

```javascript
// Selector
$("#container");        // by id
$(".task");             // by class
$("li");                // by element

// Manipulasi
$("#taskList").append("<li>Task baru</li>");
$(".task").remove();
$("#title").text("Judul baru");
$("#input").val("nilai");

// Events
$("#addTaskBtn").on("click", function() {
    addTask($("#taskInput").val());
});
```

**Penting:** jQuery bukan HTML5 API — tapi library JavaScript yang mempercepat development.

## Membuat Aplikasi Tasklist

Aplikasi pertama: **tasklist** dengan input + daftar task.

```html
<div id="app">
    <h1>Tasklist</h1>
    <input type="text" id="taskInput" placeholder="Masukkan task...">
    <button id="addTaskBtn">Tambah</button>
    <ul id="taskList"></ul>
</div>
```

```javascript
function addTask(text) {
    var task = {
        id: Date.now(),
        text: text,
        done: false
    };
    renderTask(task);
    saveTasklist();
}

function renderTask(task) {
    var $li = $('<li>').attr('data-id', task.id)
        .append($('<span>').text(task.text))
        .append($('<button>').addClass('remove').text('×'));
    $('#taskList').append($li);
}
```

### Mengelola Interaksi User

- **Add** — tombol Tambah → tambah task baru
- **Remove** — tombol × per task → hapus task
- **Move** — panah atas/bawah → pindahkan posisi task
- **Edit** — klik teks → mode edit inline

## Menghapus dan Memindahkan Task

```javascript
// Event delegation — handle tombol remove
$("#taskList").on("click", ".remove", function() {
    $(this).parent("li").remove();
    saveTasklist();
});

// Memindahkan task
$("#taskList").on("click", ".up", function() {
    var $li = $(this).parent("li");
    $li.prev().before($li);
    saveTasklist();
});
```

**Event delegation** penting: handler dipasang pada parent (`#taskList`), bekerja untuk elemen yang ditambahkan nanti.

## HTML Templates

Daripada membangun HTML lewat string concatenation, buku memakai **template**:

```javascript
var taskTemplate = Handlebars.compile(
    '<li data-id="{{id}}">' +
    '<span>{{text}}</span>' +
    '<button class="remove">×</button>' +
    '</li>'
);

function renderTask(task) {
    $("#taskList").append(taskTemplate(task));
}
```

Template memisahkan **struktur HTML dari logika JavaScript** — lebih bersih dan mudah dirawat.

## Editing Task

```javascript
// Klik span → ganti dengan input
$("#taskList").on("click", "span", function() {
    var $span = $(this);
    var $input = $("<input>").val($span.text());
    $span.replaceWith($input);
    $input.focus();
});

// Enter / blur → simpan
$input.on("keydown", function(e) {
    if (e.which === 13) {  // Enter
        var text = $(this).val();
        $input.replaceWith($("<span>").text(text));
        saveTasklist();
    }
});
```

## Web Storage API dan localStorage

**Web Storage API** adalah fitur HTML5 pertama yang dipelajari — menyimpan state aplikasi di browser:

- **localStorage** — persisten sampai dihapus
- **sessionStorage** — hilang saat tab ditutup
- Simpan **key-value pairs** (string)

### Membuat localStorage Wrapper

```javascript
var StorageManager = {
    storage: window.localStorage,

    get: function(key) {
        return JSON.parse(this.storage.getItem(key));
    },
    set: function(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    },
    remove: function(key) {
        this.storage.removeItem(key);
    }
};
```

### Menyimpan Tasklist

```javascript
function saveTasklist() {
    var tasks = [];
    $("#taskList li").each(function() {
        tasks.push({
            id: $(this).data("id"),
            text: $(this).find("span").text(),
            done: $(this).hasClass("done")
        });
    });
    StorageManager.set("tasklist", tasks);
}
```

### Memuat Tasklist

```javascript
function loadTasklist() {
    var tasks = StorageManager.get("tasklist") || [];
    $.each(tasks, function(i, task) {
        renderTask(task);
    });
}
```

**Mengapa JSON?** localStorage hanya menyimpan string — objek di-serialize dengan `JSON.stringify` dan di-parse dengan `JSON.parse`.

## CSS3 Colors dan Rounded Corners

### CSS3 Colors

CSS3 memperluas cara mendefinisikan warna:

```css
/* RGBA — transparansi */
background: rgba(255, 100, 50, 0.5);

/* HSL / HSLA */
background: hsl(120, 100%, 25%);
background: hsla(120, 100%, 25%, 0.3);
```

### Rounded Corners

```css
.button {
    border-radius: 8px;            /* semua sudut */
    border-radius: 8px 4px 8px 4px; /* per sudut */
}
```

## Shadows: Box dan Text

### Box Shadows

```css
.card {
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    /* offset-x offset-y blur color */
}
```

### Text Shadows

```css
h1 {
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
```

## Backgrounds: Gradients dan Sprites

### Linear Gradients

```css
.header {
    background: linear-gradient(to bottom, #667eea, #764ba2);
}
```

### Radial Gradients

```css
.sun {
    background: radial-gradient(circle, #ffd700, #ff8c00);
}
```

### Background Images

```css
.logo {
    background-image: url("../images/logo.png");
    background-repeat: no-repeat;
    background-position: center;
}
```

### CSS Sprites

**CSS sprites** menggabungkan banyak icon dalam satu gambar — mengurangi HTTP requests:

```css
.icon {
    background-image: url("sprites.png");
    width: 32px;
    height: 32px;
}
.icon-home  { background-position: 0 0; }
.icon-search { background-position: -32px 0; }
.icon-user  { background-position: -64px 0; }
```

## Transitions dan Transforms

### Transitions

Animasi halus saat property berubah:

```css
.button {
    background: #3498db;
    transition: background 0.3s ease;
}
.button:hover {
    background: #2980b9;
}
```

### Transforms

Mengubah bentuk elemen:

```css
.card:hover {
    transform: scale(1.05);        /* perbesar */
    transform: rotate(2deg);       /* putar */
    transform: translateX(10px);   /* geser */
}
```

### Efek dalam Aksi

```css
/* Kombinasi untuk UX modern */
.task.done {
    opacity: 0.6;
    text-decoration: line-through;
    transform: scale(0.98);
}
```

## Dynamic Stylesheets: Theme Selector

**Dynamic stylesheets** — ganti tema aplikasi saat runtime:

```javascript
// Ganti stylesheet utama
function setTheme(themeName) {
    $("#themeStylesheet").attr("href", "css/" + themeName + ".css");
}

// Theme selector
$("#themeSelector").on("change", function() {
    setTheme($(this).val());
});
```

```html
<select id="themeSelector">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="highcontrast">High Contrast</option>
</select>
```

Buku juga membahas **filling the window** — aplikasi full-height responsif:

```css
html, body {
    height: 100%;
    margin: 0;
}
#container {
    min-height: 100%;
}
```

## Kesimpulan

Chapter 1-2 membangun fondasi: struktur aplikasi HTML5 (HTML/CSS/JS), manipulasi DOM dengan jQuery, HTML templates, **Web Storage API** untuk persistence, dan styling CSS3 modern (colors, gradients, shadows, transitions, transforms, sprites, dynamic themes).

Aplikasi tasklist jadi template yang dipakai terus — di chapter berikutnya kita menambahkan detail form dan data binding (Chapter 3).

## Referensi

- Gustafson, J. M. (2013). *HTML5 Web Application Development By Example*. Packt Publishing.
- W3C. (2014). *HTML5 Specification*. w3.org.
- Mozilla Developer Network. (2024). *Web Storage API*. developer.mozilla.org.
- jQuery Foundation. (2024). *jQuery API Documentation*. api.jquery.com.
