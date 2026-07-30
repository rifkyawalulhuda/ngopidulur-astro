---
title: "Prompt Engineering: Konfigurasi LLM dan Teknik Dasar Prompting"
description: Panduan prompt engineering dari whitepaper Google - konfigurasi
  output LLM seperti temperature, top-K, top-P, zero-shot, one-shot, few-shot,
  system prompting, role prompting, dan contextual prompting dengan contoh nyata.
pubDate: 2026-09-01T08:00:00.000Z
image: /image/prompt-engineering-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - PromptEngineering
  - LLM
  - AI
  - Gemini
series: "Prompt Engineering"
seriesOrder: 1
---

Prompt engineering bukan lagi domain eksklusif data scientist. Siapapun bisa menulis prompt — tapi menulis prompt yang *efektif* adalah keahlian tersendiri. Whitepaper ini ditulis oleh Lee Boonstra dari Google (September 2024) dan membahas segala yang perlu kamu ketahui tentang prompt engineering untuk Large Language Models, khususnya Gemini di Vertex AI.

## Daftar Isi

- [Apa itu Prompt Engineering](#apa-itu-prompt-engineering)
- [Konfigurasi Output LLM](#konfigurasi-output-llm)
- [Zero-Shot Prompting](#zero-shot-prompting)
- [One-Shot dan Few-Shot Prompting](#one-shot-dan-few-shot-prompting)
- [System Prompting](#system-prompting)
- [Role Prompting](#role-prompting)
- [Contextual Prompting](#contextual-prompting)



## Apa itu Prompt Engineering

Prompt adalah input teks (dan kadang modalitas lain seperti gambar) yang digunakan model untuk memprediksi output spesifik. Banyak faktor mempengaruhi efektivitas prompt:

- Model yang digunakan
- Data training model
- Konfigurasi model (temperature, token limit, dll.)
- Kata-kata yang digunakan dalam prompt
- Struktur dan format prompt
- Konteks yang diberikan

Prompt bisa digunakan untuk berbagai tugas: ringkasan teks, ekstraksi informasi, tanya-jawab, klasifikasi teks, terjemahan bahasa/kode, generasi kode, dokumentasi kode, dan reasoning.

> Prompt engineering adalah proses iteratif. Buat dan uji berbagai prompt, analisis hasilnya, dan perbaiki berdasarkan performa model.



## Konfigurasi Output LLM

Sebelum menulis prompt, pahami parameter konfigurasi yang mempengaruhi output LLM.

### Output Length (Token Limit)

Membatasi panjang output LLM **tidak** membuat model menjadi lebih ringkas secara gaya — model hanya berhenti memprediksi token setelah batas tercapai. Jika kamu butuh output pendek, kamu juga perlu merekayasa prompt-nya.

Penting: menghasilkan lebih banyak token membutuhkan lebih banyak komputasi, leading ke konsumsi energi lebih tinggi, waktu respons lebih lambat, dan biaya lebih tinggi.

### Temperature

Temperature mengontrol seberapa "kreatif" atau "acak" output model:

| Temperature | Perilaku | Kapan Digunakan |
|-------------|----------|-----------------|
| Rendah (0.1) | Deterministis, konsisten | Klasifikasi, fakta, kode |
| Sedang (0.5-0.7) | Seimbang | Ringkasan, terjemahan |
| Tinggi (1.0+) | Kreatif, beragam | Brainstorming, cerita, puisi |

Temperature rendah = model lebih "yakin" dengan satu token terbaik. Temperature tinggi = distribusi probabilitas lebih merata, output lebih bervariasi.

```python
# Contoh konfigurasi di Vertex AI (Python SDK)
from vertexai.generative_models import GenerativeModel, GenerationConfig

model = GenerativeModel("gemini-pro")
config = GenerationConfig(
    temperature=0.1,      # Rendah untuk klasifikasi
    max_output_tokens=5,  # Hanya perlu label pendek
    top_p=1,
)
response = model.generate_content(prompt, generation_config=config)
```

### Top-K

Top-K membatasi sampling ke K token dengan probabilitas tertinggi:

- **Top-K = 1**: Hanya satu token terpilih — output deterministis. Temperature dan top-P menjadi tidak relevan.
- **Top-K sangat tinggi** (setara ukuran vocabulary): Semua token dengan probabilitas nonzero dipertimbangkan.

### Top-P (Nucleus Sampling)

Top-P memilih dari token yang probabilitas kumulatifnya mencapai nilai P:

- **Top-P = 0** (atau sangat kecil): Hanya token dengan probabilitas tertinggi yang dipertimbangkan.
- **Top-P = 1**: Semua token dipertimbangkan.

### Menggabungkan Semua Konfigurasi

| Pengaturan | Rekomendasi |
|-----------|-------------|
| Top-K = 1 | Temperature dan top-P diabaikan |
| Top-P rendah + temperature rendah | Output sangat deterministis |
| Top-P tinggi + temperature tinggi | Output kreatif dan beragam |
| Untuk klasifikasi | Temperature 0.1, token limit kecil |
| Untuk generasi kreatif | Temperature 1.0, top-K 40, top-P 0.8 |



## Zero-Shot Prompting

Zero-shot adalah tipe prompt paling sederhana — hanya berisi deskripsi tugas tanpa contoh sama sekali.

```
Prompt:
Classify movie reviews as POSITIVE, NEUTRAL or NEGATIVE.

Review: "Her" is a disturbing study revealing the direction
humanity is headed if AI is allowed to keep evolving,
unchecked. I wish there were more movies like this masterpiece.

Sentiment:

Output: POSITIVE
```

**Konfigurasi yang digunakan:** Temperature 0.1, Token Limit 5, Top-P 1

Zero-shot bekerja baik untuk tugas yang:
- Model sudah cukup familiar dari training
- Instruksinya jelas dan tidak ambigu
- Tidak butuh format output yang sangat spesifik



## One-Shot dan Few-Shot Prompting

Ketika zero-shot tidak cukup, berikan satu (one-shot) atau beberapa (few-shot) contoh input-output yang diinginkan.

### One-Shot

```
Prompt:
EXAMPLE:
Can I get a large pizza with tomato sauce, basil and mozzarella?
{
  "size": "large",
  "type": "normal",
  "ingredients": [["tomato sauce", "basil", "mozzarella"]]
}

Now, I would like a large pizza, with the first half cheese
and mozzarella. And the other tomato sauce, ham and pineapple.

JSON Response:

Output:
{
  "size": "large",
  "type": "half-half",
  "ingredients": [["cheese", "mozzarella"], ["tomato sauce", "ham", "pineapple"]]
}
```

### Few-Shot

Gunakan 3-5 contoh sebagai aturan umum. Faktor yang menentukan jumlah contoh:

- **Kompleksitas tugas** — tugas kompleks butuh lebih banyak contoh
- **Kualitas contoh** — contoh berkualitas tinggi lebih efektif
- **Kapabilitas model** — model lebih kuat butuh lebih sedikit contoh
- **Batasan input length** — perhatikan context window model

**Tips kualitas contoh:**
- Gunakan contoh yang representatif dan beragam
- Hindari contoh yang bias atau misleading
- Pastikan contoh mencakup edge cases yang relevan
- Urutan contoh bisa mempengaruhi hasil



## System Prompting

System prompt memberikan konteks tambahan tentang *bagaimana* model harus berperilaku — "providing an additional task to the system."

### Mengontrol Format Output

```
Prompt:
Classify movie reviews as positive, neutral or negative. Return valid JSON:

Review: "Her" is a disturbing study...

Schema:
MOVIE:
{
  "sentiment": String "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "name": String,
  "year": Int
}

Output:
{
  "sentiment": "NEGATIVE",
  "name": "Her",
  "year": 2013
}
```

**Keuntungan return JSON:**
- Memaksa model untuk membuat struktur — mengurangi hallucination
- Data bisa di-sorted otomatis (berguna untuk datetime objects)
- Mudah di-parse oleh aplikasi downstream
- Konsistensi output yang lebih tinggi

### Mengontrol Safety dan Toxicity

System prompt juga berguna untuk membatasi konten berbahaya:

```
System:
You are a customer service assistant for a children's toy company.
Only answer questions related to our products.
Always maintain a friendly, family-appropriate tone.
Never discuss competitors, violence, or adult topics.
```

### Mengontrol Bahasa Output

```
System:
Always respond in Bahasa Indonesia, regardless of the language
the user writes in.
```



## Role Prompting

Role prompting meminta model untuk "berperan" sebagai persona atau karakter tertentu, yang mengubah cara model merespons.

### Contoh Dasar

```
Prompt:
I want you to act as a travel guide. I will write to you
about my location and you will suggest 3 places to visit
near me. In some cases, I will also give you the type of
places I will visit.

My suggestion: "I am in Amsterdam and I want to visit
only museums."

Travel Suggestions:

Output:
1. Rijksmuseum: World-renowned museum with Dutch Golden Age art...
2. Van Gogh Museum: Largest collection of Van Gogh's works...
3. Anne Frank House: Poignant museum in Anne Frank's hideout...
```

### Mengatur Style dan Tone

Role prompting bisa mengontrol gaya tulisan:

```
Prompt:
I want you to act as a travel guide. I will write to you
about my location and you will suggest 3 places to visit
near me in a HUMOROUS style.

My suggestion: "I am in Manhattan."

Output:
1. Behold the Empire State of Mind: Ascend to the dizzying
heights of the Empire State Building...
```

### Contoh Role Prompting untuk Developer

```
Prompt:
You are an expert Python developer with 10 years of experience.
You write clean, well-documented, PEP-8 compliant code.
You always include error handling and type hints.

Task: Write a function to parse CSV files from user-uploaded data.
```



## Contextual Prompting

Contextual prompting memberikan informasi latar belakang spesifik yang relevan dengan tugas, membantu model fokus pada apa yang penting.

### Contoh Contextual Prompting

```
Prompt:
Context: You are writing for a blog about retro 80's arcade
video games.

Suggest 3 topics to write an article about with a few
lines of description of what this article should contain.

Output:
1. The Evolution of Arcade Cabinet Design:
   This article would explore the evolution of arcade cabinet
   designs, from the early wood and metal cabinets to the more
   modern fiberglass and plastic designs...

2. The Golden Age of Shoot 'Em Ups:
   Covering iconic games like Galaga, Space Invaders, and Centipede...

3. Coin-Op Classics: The Business of Arcades:
   Exploring the economic model of the arcade industry...
```

### Perbedaan System, Role, dan Contextual

| Tipe | Fokus | Contoh |
|------|-------|--------|
| **System** | Perilaku keseluruhan, format output | "Return valid JSON", "Only answer in Bahasa Indonesia" |
| **Role** | Persona/karakter model | "Act as a travel guide", "You are an expert developer" |
| **Contextual** | Informasi latar belakang spesifik | "Context: You are writing for a retro gaming blog" |

Ketiga tipe ini bisa dikombinasikan dalam satu prompt untuk hasil optimal.



## Ringkasan

| Teknik | Kapan Pakai | Kelebihan |
|--------|-------------|-----------|
| Zero-shot | Tugas sederhana, model familiar | Cepat, hemat token |
| One-shot | Butuh format spesifik | Satu contoh cukup |
| Few-shot | Tugas kompleks, konsistensi tinggi | Akurasi lebih baik |
| System | Kontrol format, safety | Konsisten sepanjang sesi |
| Role | Gaya/persona spesifik | Output lebih natural |
| Contextual | Informasi domain khusus | Fokus pada konteks relevan |

**Sumber:** Lee Boonstra, *Prompt Engineering* (September 2024), Google. [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design)
