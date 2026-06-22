---
title: "Unsupervised Learning untuk Riset Sosial: Topic Modeling, Word2Vec, dan Named Entity Recognition"
description: Panduan praktis menggunakan unsupervised machine learning untuk
  riset sosial — dari LDA Topic Modeling, Word2Vec embeddings, hingga Named
  Entity Recognition. Disertai contoh aplikasi nyata pada data teks budaya,
  sastra, dan media.
pubDate: 2026-06-23T15:00:00.000Z
image: /image/ml-social-science-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - UnsupervisedLearning
  - NLP
  - TopicModeling
  - Word2Vec
  - NER
  - TextMining
  - ComputationalSocialScience
  - DataScience
---

Ketika peneliti sosial berhadapan dengan ribuan dokumen teks — novel, artikel berita, transkrip wawancara, postingan media sosial — membaca semuanya secara manual tidak mungkin dilakukan. Di sinilah **unsupervised machine learning** berperan.

Artikel ini membahas tiga metode unsupervised learning paling powerful untuk riset sosial: **Topic Modeling**, **Word2Vec**, dan **Named Entity Recognition (NER)**.

## Unsupervised vs Supervised Learning

| | Supervised | Unsupervised |
|---|---|---|
| **Data** | Berlabel (ada Y) | Tidak berlabel |
| **Tujuan** | Memprediksi Y dari X | Menemukan struktur dalam X |
| **Contoh Riset** | Prediksi pendapatan dari demografi | Menemukan tema dalam ribuan artikel |
| **Algoritma** | Random Forest, XGBoost | LDA, K-Means, Word2Vec |

Dalam riset sosial, unsupervised learning sering menjadi **langkah eksplorasi pertama** — sebelum peneliti bahkan tahu apa yang mereka cari.

## Topic Modeling dengan LDA

**Latent Dirichlet Allocation (LDA)** adalah algoritma yang secara otomatis menemukan "topik" — kumpulan kata yang sering muncul bersama — dari korpus dokumen.

### Cara Kerja LDA

```
Dokumen 1: "pemerintah mengumumkan kebijakan baru tentang..."
Dokumen 2: "pertandingan sepak bola dimenangkan oleh..."
Dokumen 3: "saham teknologi naik setelah rilis..."

          ↓ LDA ↓

Topik 1: [pemerintah, kebijakan, anggaran, parlemen, reformasi] → "Politik"
Topik 2: [sepak, bola, liga, pemain, gol, pertandingan] → "Olahraga"
Topik 3: [saham, pasar, investor, teknologi, profit] → "Ekonomi"
```

### Aplikasi dalam Riset Sosial

1. **Analisis Wacana Media**: Bagaimana framing berita berubah sepanjang waktu?
2. **Literary Studies**: Tema apa yang dominan dalam novel era tertentu?
3. **Policy Analysis**: Topik apa yang muncul dalam dokumen kebijakan?
4. **Social Media Research**: Apa yang dibicarakan netizen tentang isu tertentu?

### Contoh: Analisis Film Terkait Tiongkok

Chen et al. menggunakan LDA untuk menganalisis ribuan film internasional yang mereferensikan Tiongkok dari 1900 hingga 2020:

**Temuan Utama:**
- **1900-1949**: Topik "Oriental mystique" — Tiongkok eksotis dan misterius
- **1950-1970**: Topik "Red menace" — ancaman komunis
- **1980-2000**: Topik "Kung fu & martial arts" — budaya bela diri
- **2000-2020**: Topik "Economic powerhouse" — kekuatan ekonomi global

Pergeseran topik ini merefleksikan **evolusi citra Tiongkok** di mata dunia — dari orientalisme ke realisme ekonomi.

## Word2Vec: Memahami Makna Kata

**Word2Vec** mengubah kata menjadi **vektor numerik** (word embeddings) yang menangkap makna semantik. Kata-kata dengan makna mirip akan memiliki vektor yang berdekatan dalam ruang multi-dimensi.

### Analogi Semantik

Salah satu properti paling menakjubkan dari Word2Vec:

```
king - man + woman ≈ queen
Paris - France + Italy ≈ Rome
```

Dalam konteks sosial:

```
boss - man + woman ≈ ? (apakah gender stereotype muncul?)
doctor - he + she ≈ ? (apakah kata "nurse" muncul?)
```

### Aplikasi Riset

1. **Gender Bias Detection**: Apakah kata "pemimpin" lebih dekat ke "pria" daripada "wanita"?
2. **Ideological Mapping**: Bagaimana kata "kebebasan" digunakan dalam konteks berbeda?
3. **Cultural Semantics**: Apakah makna "keluarga" berbeda antar budaya?
4. **Historical Semantics**: Bagaimana makna kata berubah sepanjang waktu?

### Contoh: Analisis Marx-Engels

Dalam studi mereka tentang karya Marx dan Engels, peneliti menggunakan Word2Vec untuk:

- Memetakan jaringan konsep dalam pemikiran Marxis
- Mengidentifikasi pergeseran fokus dari tulisan muda ke tua
- Menemukan keterkaitan antara "alienation", "labor", dan "capital"

## Named Entity Recognition (NER)

**NER** mengidentifikasi dan mengklasifikasi entitas bernama dalam teks — orang, organisasi, lokasi, tanggal, dll.

```
Input: "Jokowi bertemu Xi Jinping di Beijing pada 17 Oktober 2023"

Output:
  - PERSON: Jokowi, Xi Jinping
  - LOCATION: Beijing  
  - DATE: 17 Oktober 2023
```

### Aplikasi Riset

1. **Network Analysis**: Siapa berinteraksi dengan siapa?
2. **Geospatial Analysis**: Di mana peristiwa terjadi?
3. **Temporal Analysis**: Kapan topik tertentu muncul?
4. **Institutional Mapping**: Organisasi mana yang dominan dalam wacana?

### Contoh: Social Networks dalam Karya Sastra

Menggunakan NER pada novel, peneliti dapat membangun **social network graph** dari karakter:

```
Node: Karakter (hasil NER)
Edge: Co-occurrence dalam chapter yang sama
Weight: Frekuensi interaksi

→ Network metrics: centrality, betweenness, clustering
→ Analisis: Siapa karakter paling berpengaruh? Bagaimana struktur sosial dalam novel?
```

## Pipeline Analisis Teks Unsupervised

```
Korpus Teks
  │
  ├─→ Preprocessing (tokenization, stopword removal, stemming)
  │
  ├─→ Topic Modeling (LDA)
  │     └─→ Distribusi topik per dokumen
  │     └─→ Top words per topik
  │
  ├─→ Word Embeddings (Word2Vec)
  │     └─→ Semantic similarity
  │     └─→ Analogi & bias
  │
  └─→ Named Entity Recognition (NER)
        └─→ Entity counts & types
        └─→ Co-occurrence networks
```

## Tantangan dan Keterbatasan

| Tantangan | Penjelasan | Solusi |
|-----------|-----------|--------|
| **Bahasa** | Model NLP kebanyakan dilatih untuk bahasa Inggris | Multilingual embeddings (mBERT, XLM-R) |
| **Konteks** | Algoritma tidak memahami nuansa budaya | Human-in-the-loop validation |
| **Interpretasi** | Topik LDA butuh interpretasi manusia | Domain expert review |
| **Temporal validity** | Makna kata berubah seiring waktu | Diachronic embeddings |
| **Data quality** | OCR errors, informal language | Robust preprocessing |

## Kesimpulan

Unsupervised learning membuka jendela baru bagi peneliti sosial untuk mengeksplorasi data teks dalam skala yang sebelumnya tidak terbayangkan. Dengan Topic Modeling, Word2Vec, dan NER, kita bisa:

- Menemukan tema dalam jutaan dokumen
- Mengukur bias dan stereotype dalam bahasa
- Memetakan jaringan sosial dari teks naratif
- Melacak perubahan budaya sepanjang waktu

Di artikel selanjutnya, kita akan beralih ke **supervised learning** — bagaimana memprediksi fenomena sosial seperti kekerasan, orientasi seksual, dan kesejahteraan subjektif.

---

*Referensi: Chen, Y., Chen, Z., Ma, W., & Ju, G. (2025). Machine Learning in Social Science. Springer.*
