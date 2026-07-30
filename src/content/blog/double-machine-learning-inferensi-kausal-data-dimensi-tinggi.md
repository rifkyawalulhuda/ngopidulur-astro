---
title: "Double Machine Learning: Inferensi Kausal dengan Data Dimensi Tinggi untuk Riset Sosial"
description: Panduan komprehensif Double Machine Learning (DML) — teknik
  revolusioner untuk estimasi efek kausal menggunakan machine learning.
  Pelajari cara DML mengatasi confounding, mengestimasi treatment effect
  heterogeneity, dan aplikasinya dalam riset kebijakan sosial.
pubDate: 2026-06-23T18:00:00.000Z
image: /image/ml-social-science-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - CausalInference
  - DoubleMachineLearning
  - Econometrics
  - PolicyEvaluation
  - DataScience
  - RisetSosial
  - Statistik
  - AI
series: "ML Ilmu Sosial"
seriesOrder: 5
---

"Apakah X menyebabkan Y?" — inilah pertanyaan paling fundamental dalam ilmu sosial. Tapi menjawabnya tidak semudah menghitung korelasi. **Korelasi bukan kausalitas.**

Artikel pamungkas series ini membahas **Double Machine Learning (DML)** — teknik mutakhir yang menggabungkan machine learning dengan inferensi kausal untuk menjawab pertanyaan kausal dengan data observasional.

## Mengapa Inferensi Kausal Sulit?

### Masalah Confounding

```
     Z (confounder)
    / \
   /   \
  X ---→ Y
```

**Confounding variable** (Z) mempengaruhi baik treatment (X) maupun outcome (Y), menciptakan korelasi palsu antara X dan Y.

**Contoh klasik**: Apakah pendidikan (X) menyebabkan pendapatan lebih tinggi (Y)?

- Confounder: kemampuan kognitif, latar belakang keluarga, motivasi
- Masalah: orang dengan kemampuan tinggi cenderung berpendidikan tinggi DAN berpendapatan tinggi — korelasi pendidikan-pendapatan mungkin semu

### Solusi Tradisional

| Metode | Cara Kerja | Keterbatasan |
|--------|-----------|-------------|
| **RCT** | Random assignment | Mahal, tidak selalu etis |
| **Matching** | Mencari unit "mirip" | Sulit untuk high-dimensional X |
| **IV (Instrumental Variable)** | Gunakan instrumen eksogen | Sulit menemukan instrumen valid |
| **DiD (Difference-in-Differences)** | Bandingkan perubahan | Butuh panel data |
| **Regression discontinuity** | Manfaatkan cutoff arbitrer | Hanya di sekitar cutoff |

## Apa Itu Double Machine Learning?

DML dikembangkan oleh Chernozhukov et al. (2018) sebagai solusi untuk **inferensi kausal dengan high-dimensional controls**.

### Ide Inti

DML menggunakan ML **dua kali** (double):

```
Step 1: Prediksi Y dari controls W  →  Residual Y (Ȳ)
Step 2: Prediksi X dari controls W  →  Residual X (Ẍ)
Step 3: Regresi Ȳ pada Ẍ            →  Efek kausal
```

Kenapa dua kali? Untuk **membersihkan** baik treatment maupun outcome dari pengaruh confounding variables.

### Formulasi Matematis

Model struktural:

```
Y = θ(X) + g(W) + ε
X = m(W) + η
```

Dimana:
- **Y**: outcome
- **X**: treatment variable (yang ingin diestimasi efek kausalnya)
- **W**: high-dimensional control variables (confounders)
- **θ(X)**: efek kausal yang ingin diestimasi
- **g(W), m(W)**: fungsi nuisance (tidak menarik, tapi harus dikontrol)

Algoritma DML:

```
1. Split data menjadi K fold
2. Untuk setiap fold k:
   a. Estimasi ĝ(W) menggunakan ML (fold selain k)
   b. Estimasi m̂(W) menggunakan ML (fold selain k)
   c. Hitung residual: Ȳ = Y - ĝ(W), Ẍ = X - m̂(W)
   d. Regresi Ȳ pada Ẍ untuk mendapatkan θ̂
3. Rata-rata θ̂ dari semua fold
```

### Kenapa Cross-Fitting?

**Avoid overfitting bias.** Jika kita menggunakan data yang sama untuk mengestimasi nuisance functions dan treatment effect, kita mendapatkan bias. Cross-fitting memisahkan kedua tugas.

## Mengapa DML Lebih Baik dari Regresi Linear?

### Regresi Linear Biasa

```
Y = β₀ + β₁X + β₂W₁ + β₃W₂ + ... + ε
```

Masalah:
- Asumsi linearitas (sering tidak realistis)
- Regularization bias ketika W banyak
- Tidak bisa menangkap interaksi kompleks

### DML

```
ģ(W)  ← Random Forest, XGBoost, Neural Net (non-linear, interaction otomatis)
m̂(W)  ← Random Forest, XGBoost, Neural Net (non-linear, interaction otomatis)
θ(X)  ← simple linear regression on residuals
```

Keunggulan:
- **Non-linear**: Menangkap hubungan kompleks
- **High-dimensional**: Bisa handle ratusan control variables
- **Asymptotically normal**: Standard errors valid
- **Double robustness**: Konsisten jika salah satu ML model benar

## Treatment Effect Heterogeneity

DML juga bisa mengestimasi **bagaimana efek treatment berbeda antar subkelompok**:

### Conditional Average Treatment Effect (CATE)

```
CATE(x) = E[Y(1) - Y(0) | X = x]
```

"Ini efek rata-rata treatment untuk individu dengan karakteristik x"

**Contoh aplikasi kebijakan**:

| Subkelompok | CATE (efek pada pendapatan) |
|-------------|---------------------------|
| Pendidikan rendah | +15% (efek besar) |
| Pendidikan menengah | +8% |
| Pendidikan tinggi | +3% (efek kecil) |
| Urban | +5% |
| Rural | +12% (efek lebih besar) |

→ Kebijakan pelatihan kerja paling efektif untuk **pendidikan rendah di rural**.

## Aplikasi dalam Riset Sosial

### 1. Evaluasi Kebijakan

**Pertanyaan**: Apakah program bantuan tunai (X) mengurangi kemiskinan (Y)?

```python
# Pseudocode DML
from econml.dml import LinearDML
from sklearn.ensemble import RandomForestRegressor

model = LinearDML(
    model_y=RandomForestRegressor(),  # ML untuk outcome
    model_t=RandomForestRegressor(),  # ML untuk treatment
    discrete_treatment=True
)

model.fit(Y, T, X=X, W=W)  # W = controls
ate = model.ate(X)          # Average Treatment Effect
cate = model.effect(X)      # Conditional ATE
```

### 2. Riset Pendidikan

**Pertanyaan**: Apakah ukuran kelas yang lebih kecil (X) meningkatkan nilai ujian (Y)?

### 3. Kebijakan Kesehatan

**Pertanyaan**: Apakah asuransi kesehatan universal (X) meningkatkan health outcomes (Y)?

### 4. Labor Economics

**Pertanyaan**: Apakah upah minimum (X) menyebabkan pengangguran (Y)?

## Membandingkan DML dengan Metode Lain

| Metode | Linear? | High-Dim W? | Non-parametric? | Standard Errors? |
|--------|---------|-------------|-----------------|------------------|
| Regresi Linear | Ya | Overfit | Tidak | Ya |
| Regresi + Regularisasi | Ya | Ya | Tidak | Tidak |
| Propensity Score | Semi | Ya | Tidak | Bootstrap |
| **DML** | **Bisa nonlinear** | **Ya** | **Ya** | **Ya (asymptotic)** |

## Keterbatasan DML

1. **Unconfoundedness**: Asumsi bahwa semua confounders sudah diukur dalam W
2. **Overlap/Positivity**: Harus ada variasi treatment untuk setiap nilai W
3. **SUTVA**: Treatment satu unit tidak mempengaruhi unit lain
4. **Kompleksitas komputasi**: Cross-fitting + ML membutuhkan komputasi signifikan
5. **Interpretabilitas**: Model ML untuk nuisance functions sulit diinterpretasi

## Tools Praktis

### Python: `econml` (Microsoft)

```python
pip install econml

from econml.dml import LinearDML, CausalForestDML
from sklearn.ensemble import GradientBoostingRegressor

# Linear treatment effect
dml = LinearDML(
    model_y=GradientBoostingRegressor(),
    model_t=GradientBoostingRegressor()
)

# Non-linear/heterogeneous treatment effect
cf = CausalForestDML(
    model_y=GradientBoostingRegressor(),
    model_t=GradientBoostingRegressor()
)
```

### R: `DoubleML` package

```r
library(DoubleML)
library(mlr3)

dml_plr = DoubleMLPLR$new(data, ml_g, ml_m)
dml_plr$fit()
dml_plr$summary()
```

## Contoh Empiris Lengkap

### Dataset: Job Training Program

- **N**: 5,000 peserta
- **Treatment (T)**: Mengikuti pelatihan kerja (1/0)
- **Outcome (Y)**: Pendapatan 12 bulan setelah program
- **Controls (W)**: Usia, pendidikan, pengalaman kerja, industri sebelumnya, lokasi, status pernikahan, jumlah anak, dll (total 30 variabel)

### Langkah 1: ML untuk Outcome

```python
model_y = GradientBoostingRegressor(n_estimators=500, max_depth=5)
model_y.fit(W, Y)  
# Predict income from all controls
```

### Langkah 2: ML untuk Treatment

```python
model_t = GradientBoostingClassifier(n_estimators=500, max_depth=5)
model_t.fit(W, T)  
# Predict training participation from controls
```

### Langkah 3: Residual Regression

```python
Y_resid = Y - model_y.predict(W)  # Income not explained by controls
T_resid = T - model_t.predict_proba(W)[:, 1]  # Training not predicted by controls

# Simple regression on residuals
theta = np.mean(Y_resid * T_resid) / np.mean(T_resid ** 2)
# theta = efek kausal murni dari pelatihan
```

### Hasil

| Estimator | ATE (Rp/bulan) | 95% CI |
|-----------|----------------|--------|
| Naive regression | +450,000 | [320K, 580K] |
| **DML** | **+215,000** | **[80K, 350K]** |

> Naive regression overestimasi efek 2× lipat! Confounding bias nyata.

## Kesimpulan

Double Machine Learning adalah revolusi dalam inferensi kausal. Ia memungkinkan peneliti sosial untuk:

- Mengestimasi efek kausal dengan **kontrol high-dimensional**
- Menggunakan **model non-linear** untuk menangkap hubungan kompleks
- Mendapatkan **standard errors valid** untuk inference
- Mengidentifikasi **treatment effect heterogeneity** — untuk siapa kebijakan paling efektif?

Dengan tools seperti `econml` (Python) dan `DoubleML` (R), DML semakin accessible untuk peneliti sosial. Ini adalah jembatan antara **machine learning prediktif** dan **statistika inferensial** yang membuka era baru riset kebijakan berbasis bukti.

---

*Referensi: Chernozhukov, V., et al. (2018). Double/debiased machine learning for treatment and structural parameters. The Econometrics Journal. Chen, Y., Chen, Z., Ma, W., & Ju, G. (2025). Machine Learning in Social Science. Springer.*
