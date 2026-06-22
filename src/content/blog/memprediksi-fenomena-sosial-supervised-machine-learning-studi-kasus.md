---
title: "Memprediksi Fenomena Sosial dengan Supervised Machine Learning: Studi Kasus Kekerasan & Identitas Tersembunyi"
description: Bagaimana supervised machine learning digunakan untuk
  memprediksi fenomena sosial sensitif — dari intimate partner violence hingga
  identitas seksual minoritas. Lengkap dengan metodologi, pemilihan algoritma,
  evaluasi model, dan diskusi etis dari riset terkini.
pubDate: 2026-06-23T16:00:00.000Z
image: /image/ml-social-science-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - SupervisedLearning
  - SocialPrediction
  - RandomForest
  - XGBoost
  - EtikaAI
  - DataScience
  - RisetSosial
  - ComputationalSocialScience
---

Seberapa akurat machine learning bisa memprediksi perilaku manusia? Pertanyaan ini bukan lagi spekulasi — riset terkini menunjukkan bahwa supervised learning dapat memprediksi fenomena sosial kompleks dengan akurasi yang mengejutkan.

Artikel ini membahas dua studi kasus dari buku *"Machine Learning in Social Science"*: prediksi **intimate partner violence** dan identifikasi **orientasi seksual minoritas**. Dua topik sensitif yang menunjukkan kekuatan — dan bahaya — ML dalam ilmu sosial.

## Framework Supervised Learning untuk Ilmu Sosial

### Workflow Standar

```
1. Problem Definition   → Apa yang ingin diprediksi?
2. Data Collection      → Dataset dengan label (Y)
3. Feature Engineering  → Variabel prediktor (X)
4. Algorithm Selection  → Pilih model yang sesuai
5. Training & Tuning    → Hyperparameter optimization
6. Evaluation           → Cross-validation, metrik
7. Interpretation       → Feature importance, SHAP
8. Ethical Review       → Potensi misuse
```

### Algoritma yang Umum Digunakan

| Algoritma | Kekuatan | Kelemahan | Cocok Untuk |
|-----------|----------|-----------|-------------|
| **Random Forest** | Robust, interpretable | Kurang akurat untuk data sangat kompleks | Survey data, tabular |
| **XGBoost** | Sangat akurat, fast | Banyak hyperparameters | Kompetisi, produksi |
| **Neural Network** | Menangkap non-linear kompleks | Black box, butuh banyak data | Image, text, audio |
| **Logistic Regression** | Interpretable, baseline | Hanya linear | Baseline comparison |

## Studi Kasus 1: Memprediksi Kekerasan Pasangan Intim (IPV)

Intimate Partner Violence (IPV) adalah masalah kesehatan publik global. Bisakah ML membantu identifikasi dini?

### Data dan Variabel

**Sumber data**: Survei nasional dengan ribuan responden

**Variabel prediktor (features)**:
- Demografi: usia, pendidikan, pendapatan, urban/rural
- Relasi: status pernikahan, durasi hubungan, jumlah anak
- Perilaku: konsumsi alkohol, riwayat kekerasan keluarga
- Psikologis: tingkat stres, depresi, self-esteem
- Sosial: dukungan sosial, norma gender

**Target variabel**: Apakah responden mengalami IPV dalam 12 bulan terakhir?

### Metodologi

1. **Data Splitting**: 70% training, 30% test
2. **Class Imbalance**: IPV adalah rare event (~15%) → gunakan SMOTE oversampling
3. **Feature Selection**: Recursive Feature Elimination (RFE)
4. **Algorithm Comparison**: Logistic Regression vs Random Forest vs XGBoost

### Hasil

| Model | Accuracy | AUC-ROC | Recall (IPV) |
|-------|----------|---------|--------------|
| Logistic Regression | 0.78 | 0.81 | 0.62 |
| Random Forest | 0.84 | 0.89 | 0.71 |
| **XGBoost** | **0.86** | **0.91** | **0.76** |

XGBoost unggul di semua metrik. Recall 0.76 berarti model berhasil mengidentifikasi 76% kasus IPV aktual.

### Feature Importance

Variabel paling prediktif untuk IPV:

1. **Riwayat kekerasan di keluarga asal** (paling kuat)
2. **Frekuensi konsumsi alkohol pasangan**
3. **Ketimpangan ekonomi dalam rumah tangga**
4. **Norma gender tradisional**
5. **Isolasi sosial**

> Temuan ini konsisten dengan teori sosiologi tentang siklus kekerasan dan stress-dependency framework.

### Heterogenitas Analisis

Model menunjukkan **performa berbeda** antar subkelompok:

- **Urban vs Rural**: Akurasi lebih tinggi di urban (data lebih kaya)
- **Pendidikan tinggi vs rendah**: Model lebih akurat untuk responden berpendidikan
- **Lintas region**: Perlu retraining untuk region berbeda

## Studi Kasus 2: Memprediksi Orientasi Seksual Minoritas

Ini adalah topik paling kontroversial dalam ML sosial — **apakah orientasi seksual bisa diprediksi dari data?**

### Mengapa Riset Ini Kontroversial?

1. **Potensi penyalahgunaan**: Rezim represif bisa menggunakan model untuk mengidentifikasi dan menargetkan minoritas seksual
2. **Esensialisme**: Prediksi berbasis data bisa disalahartikan sebagai "determinisme biologis"
3. **Privasi**: Data yang digunakan mungkin tidak dikumpulkan dengan consent
4. **Akurasi vs etika**: Bahkan jika model akurat, apakah etis mengembangkannya?

### Metodologi yang Digunakan

Chen et al. menggunakan pendekatan yang ketat secara etis:

- Data dari **survei anonim sukarela**
- **Informed consent** eksplisit
- Model hanya digunakan untuk **riset akademik**, bukan deployment
- Fokus pada **memahami determinan sosial**, bukan identifikasi individu

### Hasil Utama

| Feature Category | Top Predictors |
|-----------------|----------------|
| **Demografi** | Usia, gender, pendidikan |
| **Sosial** | Urban/rural, religiusitas |
| **Psikologis** | Openness to experience |
| **Perilaku** | Konsumsi media, peer group |
| **Keluarga** | Jumlah saudara, urutan kelahiran |

### Interpretasi Sosiologis

Yang menarik: **prediktor terkuat bukanlah faktor biologis, melainkan faktor sosial** — terutama peer group dan akses ke media. Ini mendukung teori sosiologi bahwa identitas seksual dibentuk oleh interaksi kompleks antara individu dan lingkungan sosial.

## Robustness Checks

Setiap model prediktif harus diuji ketahanannya:

### 1. Cross-Validation (K-Fold)

```
Data dibagi 5 fold → 4 training, 1 testing → diulang 5x
Rata-rata performa = robust estimate
```

### 2. Sensitivity Analysis

Bagaimana jika:
- Feature tertentu dihilangkan?
- Hyperparameter diubah?
- Data imbalance dikoreksi berbeda?

### 3. Temporal Validation

Model dilatih pada data 2010-an → diuji pada data 2020-an. Apakah masih akurat? Jika tidak, ada **concept drift** — hubungan antar variabel berubah seiring waktu.

### 4. Spatial Validation

Model dilatih di Region A → diuji di Region B. Generalizability lintas konteks?

## Framework Etis untuk Prediksi Sosial

Setiap proyek ML sosial harus melewati **ethical checklist**:

```
☐ Apakah data dikumpulkan dengan informed consent?
☐ Apakah model bisa disalahgunakan untuk merugikan kelompok tertentu?
☐ Apakah akurasi merata antar subkelompok? (fairness)
☐ Apakah model interpretable atau black-box?
☐ Siapa yang diuntungkan/dirugikan oleh prediksi ini?
☐ Apakah ada mekanisme appeal untuk individu yang terkena dampak?
☐ Apakah data dan model disimpan dengan aman?
```

## Kesimpulan

Supervised machine learning membuka kemungkinan baru untuk memahami dan memprediksi fenomena sosial — dari kekerasan rumah tangga hingga identitas gender. Namun dengan kekuatan ini datang tanggung jawab besar.

**Prediction is not destiny.** Model ML memberikan probabilitas, bukan kepastian. Riset harus selalu diiringi dengan:
- Kesadaran etis yang mendalam
- Transparansi metodologis
- Keterlibatan komunitas yang diteliti
- Komitmen bahwa teknologi melayani manusia, bukan sebaliknya

Di artikel selanjutnya, kita akan mengeksplorasi **Computing Grounded Theory** — bagaimana ML bisa membantu membangun teori sosial dari data.

---

*Referensi: Chen, Y., Chen, Z., Ma, W., & Ju, G. (2025). Machine Learning in Social Science. Springer.*
