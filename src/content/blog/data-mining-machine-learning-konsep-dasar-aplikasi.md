---
title: "Data Mining & Machine Learning: Konsep Dasar, Input Data, dan Aplikasi Dunia Nyata"
description: Pengantar komprehensif data mining dan machine learning — dari
  perbedaan supervised vs unsupervised, struktur input (konsep, instances,
  atribut), format ARFF, hingga aplikasi nyata di load forecasting, diagnosis
  medis, dan marketing. Berdasarkan buku Witten & Frank.
pubDate: 2026-06-24T14:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - DataMining
  - MachineLearning
  - WEKA
  - BigData
  - PatternRecognition
  - DataScience
series: "Data Mining WEKA"
seriesOrder: 1
---

**Data Mining** adalah proses mengekstrak pola tersembunyi dari data. Buku klasik *"Data Mining: Practical Machine Learning Tools and Techniques"* oleh Ian Witten dan Eibe Frank adalah rujukan utama yang menghubungkan teori ML dengan praktik nyata.

## Apa Itu Data Mining?

> "Data mining is the extraction of implicit, previously unknown, and potentially useful information from data."

Bukan sekadar query database — data mining **menemukan** pola yang tidak kamu ketahui sebelumnya.

### Data Mining vs Machine Learning vs Statistics

| | Data Mining | Machine Learning | Statistics |
|---|---|---|---|
| **Fokus** | Penemuan pola | Prediksi & generalisasi | Inferensi & penjelasan |
| **Data** | Besar, messy | Besar, terstruktur | Kecil, clean |
| **Tujuan** | Insight bisnis | Akurasi prediksi | Validitas ilmiah |
| **Metode** | ML + DB + viz | Algoritma learning | Uji hipotesis |

### Supervised vs Unsupervised

```
Supervised:    Input + Label →   Model  →  Prediksi
               (x₁,x₂,...,xₙ, y)                  ŷ

Unsupervised:  Input only   →   Model  →  Struktur
               (x₁,x₂,...,xₙ)                  Clusters
```

## Input: Konsep, Instances, dan Atribut

### Konsep (Concept)

**Konsep** = hal yang ingin dipelajari. Dalam ML, konsep adalah **fungsi** yang memetakan input ke output.

### Instances (Contoh)

Setiap baris data = satu **instance** (example, data point). Dataset adalah kumpulan instances.

### Atribut (Features)

| Tipe | Contoh | Operasi |
|------|--------|---------|
| **Nominal** | Warna: merah, biru, hijau | =, ≠ |
| **Ordinal** | Rating: ★, ★★, ★★★ | =, ≠, <, > |
| **Interval** | Suhu Celsius | =, ≠, <, >, +, − |
| **Ratio** | Berat, panjang | Semua operasi + ×, ÷ |

### Format ARFF (Attribute-Relation File Format)

Format standar WEKA:

```arff
@RELATION weather

@ATTRIBUTE outlook  {sunny, overcast, rainy}
@ATTRIBUTE temperature NUMERIC
@ATTRIBUTE humidity NUMERIC
@ATTRIBUTE windy {TRUE, FALSE}
@ATTRIBUTE play {yes, no}

@DATA
sunny,85,85,FALSE,no
sunny,80,90,TRUE,no
overcast,83,86,FALSE,yes
rainy,70,96,FALSE,yes
rainy,68,80,FALSE,yes
```

### Missing Values

Data mining harus menangani missing values:
- **Ignore**: Buang instance dengan missing values
- **Impute**: Isi dengan mean/mode
- **Model-based**: Gunakan algoritma yang menangani missing values natively
- **Indicator**: Buat atribut baru "is_missing"

## Aplikasi Data Mining di Dunia Nyata

### 1. Load Forecasting (Prediksi Beban Listrik)

Memutuskan apakah pembangkit listrik harus dinyalakan berdasarkan prediksi beban.

**Data**: Historical demand, cuaca, hari libur, waktu
**Metode**: Time series + regression
**Impact**: Efisiensi biaya jutaan dolar

### 2. Screening Images (Penyaringan Gambar)

Mendeteksi cacat produksi secara otomatis.

**Data**: Gambar produk dari conveyor belt
**Metode**: CNN, decision trees
**Impact**: 24/7 inspection tanpa kelelahan manusia

### 3. Diagnosis Medis

**Contoh klasik**: Dataset soybean diseases — 683 examples, 35 attributes, 19 diseases.

Decision tree J48 (C4.5 implementation) mencapai **100% akurasi** — setiap penyakit soybean teridentifikasi dengan benar!

**Kenapa berhasil?** Domain ini highly structured — ada aturan jelas dari ahli patologi tanaman.

### 4. Marketing & Sales

- **Churn prediction**: Pelanggan mana yang akan berhenti berlangganan?
- **Market basket analysis**: Produk apa yang sering dibeli bersamaan?
- **Customer segmentation**: Kelompok pelanggan dengan perilaku mirip

### 5. Manufacturing

Labor negotiations dataset: memprediksi apakah kontrak kerja akan "good" atau "bad" berdasarkan atribut seperti wage increase, cost-of-living adjustment, dll.

## Machine Learning sebagai Search Problem

Witten & Frank menekankan perspektif fundamental: **machine learning = search**.

```
Ruang hipotesis: semua fungsi yang mungkin
Tujuan: menemukan hipotesis terbaik berdasarkan data

Tantangan:
- Ruang pencarian SANGAT besar (infinite untuk continuous)
- Data terbatas → overfitting risk
- Noise → mungkin tidak ada hipotesis yang perfect
```

### Generalization

Model harus **menggeneralisasi**: performa baik pada data training ≠ performa baik pada data baru.

> "The key question is how well the discovered patterns will generalize to new data."

## Tips Praktis: Getting to Know Your Data

Sebelum modeling, **selalu eksplorasi data**:

1. **Distribusi**: Histogram setiap atribut numerik
2. **Missing values**: Berapa persen? Ada pola?
3. **Outliers**: Apakah nilai ekstrem valid atau error?
4. **Correlation**: Atribut mana yang berkorelasi?
5. **Class balance**: Apakah kelas seimbang?

## Kesimpulan

Data mining adalah disiplin praktis — teori ML + seni preprocessing + evaluasi rigorous. Buku Witten & Frank menekankan bahwa **tidak ada silver bullet algorithm** — kunci sukses adalah memahami data dan memilih tools yang tepat.

Di artikel selanjutnya: **Knowledge Representation** — bagaimana model menyimpan "pengetahuan" yang dipelajari.

---

*Referensi: Witten, I.H. & Frank, E. (2005). Data Mining: Practical Machine Learning Tools and Techniques, 2nd Edition. Morgan Kaufmann.*
