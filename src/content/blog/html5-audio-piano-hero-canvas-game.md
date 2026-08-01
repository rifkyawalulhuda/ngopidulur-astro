---
title: "HTML5 Audio dan Game Piano Hero dengan Canvas Animation"
description: Panduan praktis HTML5 audio dari buku J.M. Gustafson - audio element,
  Audio API, AudioManager, virtual piano, keyboard events, sustain volume control,
  game Piano Hero, audio sequencer, animated notes, user input handling.
pubDate: 2026-10-20T08:00:00.000Z
image: /image/html5-web-app-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML5
  - Audio
  - Canvas
  - GameDev
series: "HTML5 Web Application By Example"
seriesOrder: 3
---

Chapter 6-7 dari *HTML5 Web Application Development By Example* membangun aplikasi audio: **virtual piano** (Ch6) dan game **Piano Hero** (Ch7) — menggabungkan HTML5 Audio, Canvas animation, dan game loop.

## Daftar Isi

- [HTML5 Audio Overview](#html5-audio-overview)
- [Elemen audio](#elemen-audio)
- [HTML5 Audio API](#html5-audio-api)
- [Loading Audio Files: AudioManager](#loading-audio-files-audiomanager)
- [Membuat Virtual Piano](#membuat-virtual-piano)
- [Memuat dan Memainkan Notes](#memuat-dan-memainkan-notes)
- [Keyboard Events](#keyboard-events)
- [Sustain dan Volume Control](#sustain-dan-volume-control)
- [Audio Tools: FreeSound dan Audacity](#audio-tools-freesound-dan-audacity)
- [Membuat Game Piano Hero](#membuat-game-piano-hero)
- [Splash Panel dan Game Panel](#splash-panel)
- [Audio Sequencer](#audio-sequencer)
- [Animated Notes dengan Canvas](#animated-notes-dengan-canvas)
- [Handling User Input](#handling-user-input)
- [Results Panel](#results-panel)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## HTML5 Audio Overview

HTML5 memperkenalkan **audio native** — tanpa plugin (Flash):

- Elemen `<audio>` untuk playback sederhana
- **HTML5 Audio API** untuk kontrol programatik
- Dukungan format: MP3, OGG, WAV, AAC

## Elemen audio

```html
<audio id="pianoNote" src="audio/c4.mp3"></audio>
```

Atau dengan kontrol:

```html
<audio controls>
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    Browser Anda tidak mendukung audio HTML5.
</audio>
```

## HTML5 Audio API

Kontrol audio via JavaScript:

```javascript
var audio = document.getElementById("pianoNote");

audio.play();        // mainkan
audio.pause();       // jeda
audio.currentTime = 0;  // reset ke awal
audio.volume = 0.5;  // volume 0-1

// Events
audio.addEventListener("ended", function() {
    console.log("Audio selesai");
});
```

## Loading Audio Files: AudioManager

Buku membangun **AudioManager** — manager yang men-cache audio files:

```javascript
var AudioManager = {
    cache: {},

    load: function(name, url) {
        var audio = new Audio();
        audio.src = url;
        audio.preload = "auto";
        this.cache[name] = audio;
    },

    play: function(name) {
        var audio = this.cache[name];
        if (audio) {
            audio.currentTime = 0;  // restart
            audio.play();
        }
    },

    loadMany: function(files) {
        $.each(files, function(name, url) {
            AudioManager.load(name, url);
        });
    }
};

// Memuat semua note piano
AudioManager.loadMany({
    "c4": "audio/c4.mp3",
    "d4": "audio/d4.mp3",
    "e4": "audio/e4.mp3",
    "f4": "audio/f4.mp3",
    "g4": "audio/g4.mp3",
    "a4": "audio/a4.mp3",
    "b4": "audio/b4.mp3",
    "c5": "audio/c5.mp3"
});
```

**Preload** penting: audio dimuat sebelumnya sehingga playback langsung tanpa delay.

## Membuat Virtual Piano

**Virtual piano** — keyboard piano di layar yang bisa dimainkan klik:

```html
<div id="piano">
    <div class="white-key" data-note="c4">C</div>
    <div class="white-key" data-note="d4">D</div>
    <div class="white-key" data-note="e4">E</div>
    <!-- ... -->
</div>
```

```css
.white-key {
    width: 50px;
    height: 200px;
    background: #fff;
    border: 1px solid #999;
    display: inline-block;
    cursor: pointer;
}
.white-key:active {
    background: #eee;
}
```

## Memuat dan Memainkan Notes

```javascript
// Klik key → mainkan note
$("#piano .white-key").on("mousedown", function() {
    var note = $(this).data("note");
    AudioManager.play(note);
    $(this).addClass("pressed");
});

$("#piano .white-key").on("mouseup", function() {
    $(this).removeClass("pressed");
});
```

## Keyboard Events

Piano juga bisa dimainkan dengan **keyboard komputer**:

```javascript
var keyMap = {
    65: "c4",  // A
    83: "d4",  // S
    68: "e4",  // D
    70: "f4",  // F
    71: "g4",  // G
    72: "a4",  // H
    74: "b4",  // J
    75: "c5"   // K
};

$(document).on("keydown", function(e) {
    var note = keyMap[e.which];
    if (note) {
        AudioManager.play(note);
        $("[data-note='" + note + "']").addClass("pressed");
    }
});

$(document).on("keyup", function(e) {
    var note = keyMap[e.which];
    if (note) {
        $("[data-note='" + note + "']").removeClass("pressed");
    }
});
```

## Sustain dan Volume Control

### Sustain Control

**Sustain** menahan note setelah key dilepas (seperti pedal piano):

```javascript
var sustainOn = false;

$("#sustainBtn").on("click", function() {
    sustainOn = !sustainOn;
    $(this).toggleClass("active");
});

// Saat keyup — hanya reset jika sustain mati
$(document).on("keyup", function(e) {
    var note = keyMap[e.which];
    if (note && !sustainOn) {
        $("[data-note='" + note + "']").removeClass("pressed");
    }
});
```

### Volume Control

```javascript
$("#volumeSlider").on("change", function() {
    var volume = parseInt($(this).val(), 10) / 100;
    $.each(AudioManager.cache, function(name, audio) {
        audio.volume = volume;
    });
});
```

## Audio Tools: FreeSound dan Audacity

Buku merekomendasikan tools untuk membuat audio:

- **FreeSound.org** — koleksi sound effects gratis (Creative Commons)
- **Audacity** — audio editor open source untuk merekam/mengedit/meng-export note piano

## Membuat Game Piano Hero

**Piano Hero** — game seperti Guitar Hero tapi dengan piano: **note animasi jatuh**, pemain menekan key yang tepat saat note mencapai target.

### Arsitektur Game

```
Splash Panel (menu) → Game Panel (play) → Results Panel (skor)
```

### Splash Panel

```javascript
// Tampilkan splash, sembunyikan game
function showSplash() {
    $("#splashPanel").show();
    $("#gamePanel").hide();
    $("#resultsPanel").hide();
}

// Mulai game
$("#startBtn").on("click", function() {
    $("#splashPanel").hide();
    $("#gamePanel").show();
    startGame();
});
```

### Game Panel

```html
<div id="gamePanel">
    <canvas id="gameCanvas" width="600" height="400"></canvas>
    <div id="score">Skor: 0</div>
</div>
```

### Controller

```javascript
var Game = {
    score: 0,
    song: null,
    notes: [],
    running: false,

    init: function() {
        // setup canvas, sequencer, input
    },
    start: function(song) {
        this.song = song;
        this.score = 0;
        this.running = true;
        this.notes = [];
        this.sequencer.play(song);
        requestAnimationFrame(this.update.bind(this));
    }
};
```

## Audio Sequencer

**AudioSequencer** — memutar lagu dari jadwal notes:

```javascript
var AudioSequencer = {
    timer: null,
    position: 0,
    song: null,

    play: function(song) {
        this.song = song;
        this.position = 0;
        this.timer = setInterval(
            this.tick.bind(this), song.tempo
        );
    },

    tick: function() {
        // Cek notes pada posisi ini
        var notesAt = this.song.notes[this.position];
        if (notesAt) {
            $.each(notesAt, function(i, note) {
                AudioManager.play(note.name);
                Game.spawnNote(note);
            });
        }
        this.position++;
        if (this.position >= this.song.duration) {
            clearInterval(this.timer);
        }
    },

    stop: function() {
        clearInterval(this.timer);
    }
};
```

**Song format** — jadwal note per posisi waktu:

```javascript
var song = {
    tempo: 400,  // ms per beat
    duration: 32,
    notes: {
        0:  [{ name: "c4" }],
        1:  [{ name: "e4" }],
        2:  [{ name: "g4" }],
        3:  [{ name: "c5" }],
        4:  [{ name: "g4" }],
        5:  [{ name: "e4" }],
        6:  [{ name: "c4" }]
    }
};
```

## Animated Notes dengan Canvas

Note digambar sebagai **bola jatuh** di canvas:

```javascript
Game.spawnNote = function(note) {
    this.notes.push({
        name: note.name,
        x: keyPositions[note.name],  // posisi sesuai key
        y: -20,
        speed: 3,
        hit: false
    });
};

Game.update = function() {
    var self = this;

    // Gerakkan notes ke bawah
    $.each(this.notes, function(i, note) {
        note.y += note.speed;
    });

    this.draw();
    requestAnimationFrame(this.update.bind(this));
};

Game.draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar garis target
    ctx.strokeStyle = "#999";
    ctx.beginPath();
    ctx.moveTo(0, TARGET_Y);
    ctx.lineTo(canvas.width, TARGET_Y);
    ctx.stroke();

    // Gambar notes
    $.each(this.notes, function(i, note) {
        ctx.beginPath();
        ctx.arc(note.x, note.y, 15, 0, Math.PI * 2, true);
        ctx.fillStyle = note.hit ? "#4ade80" : "#3b82f6";
        ctx.fill();
        ctx.stroke();
    });
};
```

**Game loop** dengan `requestAnimationFrame` — animasi halus 60fps.

## Handling User Input

```javascript
// Tekan key — cek apakah ada note dekat garis target
Game.handleKey = function(noteName) {
    var self = this;

    $.each(this.notes, function(i, note) {
        if (note.name === noteName && !note.hit &&
            Math.abs(note.y - TARGET_Y) < 30) {
            // Hit! — beri skor
            note.hit = true;
            self.score += 10;
            $("#score").text("Skor: " + self.score);
            AudioManager.play(note.name);
        }
    });
};
```

**Timing window** — note dianggap "hit" jika dalam jarak tertentu dari garis target. Tekan terlalu awal/lambat = miss.

## Ending the Game

### Results Panel

```javascript
function showResults() {
    clearInterval(Game.sequencer.timer);
    Game.running = false;

    $("#gamePanel").hide();
    $("#resultsPanel").show();
    $("#finalScore").text(Game.score);
}

// Game selesai saat sequencer habis
AudioSequencer.onEnd = function() {
    setTimeout(showResults, 1000);
};
```

### Fitur Tambahan

- **Combo system** — hit beruntun bonus poin
- **Miss penalty** — note yang lewat target mengurangi skor
- **Difficulty** — kecepatan note bertambah per level

## Kesimpulan

Chapter 6-7 menunjukkan HTML5 Audio end-to-end: elemen `<audio>`, **AudioManager** dengan preload, virtual piano dengan keyboard events, sustain dan volume controls — lalu **game Piano Hero** yang menggabungkan audio sequencing, canvas animation dengan game loop, dan input handling dengan timing window.

Di artikel berikutnya: **Ajax, Geolocation, Web Workers, dan release aplikasi** (Chapter 8-10).

## Referensi

- Gustafson, J. M. (2013). *HTML5 Web Application Development By Example*. Packt Publishing.
- W3C. (2014). *HTML5 Audio and Video*. w3.org.
- Mozilla Developer Network. (2024). *HTMLMediaElement*, *Canvas API*, *requestAnimationFrame*. developer.mozilla.org.
- Freepoel, S. (2013). *FreeSound.org* — audio collection.
