---
title: "Advanced Data Mining: Feature Selection, PCA, Ensemble Methods, Text Mining, dan Semi-Supervised Learning"
description: Teknik lanjutan data mining — attribute selection (filter vs
  wrapper), discretization, PCA untuk reduksi dimensi, bagging/boosting/stacking
  untuk ensemble, text mining dengan TF-IDF, dan semi-supervised learning dengan
  co-training & EM algorithm.
pubDate: 2026-06-24T18:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - DataMining
  - FeatureSelection
  - PCA
  - EnsembleLearning
  - TextMining
  - SemiSupervisedLearning
  - WEKA
  - BigData
---

Setelah menguasai fondasi, saatnya naik level. Artikel ini mengupas teknik-teknik advanced yang membedakan praktisi data mining biasa dengan yang expert.

## Attribute/Feature Selection

**"More features ≠ better model"** — curse of dimensionality.

### Filter Methods

Ranking atribut berdasarkan **statistical measure**, independen dari classifier:

**Information Gain**: Seberapa banyak informasi yang diberikan atribut tentang class.

**Gain Ratio**: Information Gain dikoreksi untuk bias atribut multi-valued.

**Correlation-based Feature Selection (CFS)**:

```
Merit_S = k·r̄_cf / √(k + k(k-1)r̄_ff)
```

Dimana:
- k = jumlah features dalam subset
- r̄_cf = rata-rata korelasi feature-class
- r̄_ff = rata-rata inter-feature correlation

> CFS mencari subset yang **highly correlated dengan class** tapi **low inter-correlation**.

### Wrapper Methods

Menggunakan classifier sebagai **black box** untuk mengevaluasi subset:

```
1. Search: generate candidate subset
2. Evaluate: train classifier, measure performance
3. Repeat sampai kriteria tercapai
```

**Search strategies**:
- **Forward selection**: Mulai kosong, tambah satu-satu
- **Backward elimination**: Mulai semua, hapus satu-satu
- **Bidirectional**: Kombinasi keduanya
- **Race search**: Hentikan evaluasi subset yang jelas-jelas buruk

### Embedded Methods

Feature selection terintegrasi dalam training:

- **L1 Regularization (Lasso)**: Koefisien tidak relevan → 0
- **Decision Trees**: Feature importance dari frekuensi split
- **Random Forest**: Mean decrease impurity

## Discretization: Numeric → Categorical

### Unsupervised Discretization

**Equal-width**: Bagi range menjadi k interval sama lebar.
```
Age 0-100 → bins: [0-20, 20-40, 40-60, 60-80, 80-100]
```

**Equal-frequency**: Setiap bin punya jumlah instance sama.

### Supervised Discretization (Entropy-based)

Fayyad & Irani (1993):

```
1. Sort instances by attribute value
2. Untuk setiap candidate cut point:
   a. Hitung Information Gain split
3. Pilih cut point dengan IG tertinggi
4. Rekursi pada kedua partisi
5. Stop jika Gain < MDL criterion
```

### Error-based Discretization

Ganti Information Gain dengan **error rate classifier** — lebih lambat tapi langsung relevan dengan performa.

## Principal Components Analysis (PCA)

Transformasi linear yang menemukan **arah varians maksimum**:

```
1. Center data (kurangi mean)
2. Hitung covariance matrix C = (1/N) XᵀX
3. Eigen decomposition: C = VΛVᵀ
4. Pilih k eigenvectors dengan eigenvalues terbesar
5. Transform: Z = XVₖ
```

### Variance Explained

```
PC1: 45% variance
PC2: 25% variance    → cumulative = 70%
PC3: 15% variance    → cumulative = 85%
```

> Pilih k sehingga cumulative variance > 90%.

### Random Projections

Alternatif cepat untuk PCA: proyeksi ke random subspace.

**Johnson-Lindenstrauss Lemma**: Pairwise distances preserved dalam random projection!

## Ensemble Methods

### Bagging

```
Untuk i = 1 sampai B:
  Sample data dengan replacement
  Train model i

Prediksi = vote (classification) atau average (regression)
```

**Kenapa berhasil?** Bagging mengurangi **variance** — model-model yang berbeda saling mengoreksi.

### Boosting (AdaBoost)

```
Train weak learner → beri bobot lebih ke misclassified → train lagi → repeat
  
Final model = weighted vote semua learners
α_t = ½ ln((1-ε_t)/ε_t)  ← bobot model
```

Boosting mengurangi **bias** — setiap model fokus ke kesalahan model sebelumnya.

### Additive Regression

Gradient Boosting untuk regresi: setiap model baru memprediksi **residual** model sebelumnya.

### Logistic Model Trees

Gabungan decision tree + logistic regression di setiap leaf:

```
Di setiap node: linear logistic model
Di setiap leaf: refined logistic model
```

### Stacking

Gunakan **meta-learner** yang belajar dari output base learners:

```
Level 1: Model A, Model B, Model C → menghasilkan prediksi pA, pB, pC
Level 2: Meta-model belajar dari (pA, pB, pC, y_actual)
```

> Stacking = "belajar bagaimana cara terbaik mengkombinasikan model."

### Error-Correcting Output Codes

Untuk multi-class: encode setiap class sebagai **binary code**.

```
Class A: 1  1  1  1  1
Class B: 1 -1 -1 -1 -1
Class C: -1 1 -1 -1 -1
```

Train binary classifier untuk setiap kolom. Prediksi = class dengan code terdekat.

## Text Mining

### Mengubah Teks menjadi Attribute Vectors

```
Documents → Tokenization → Stopword Removal → Stemming → TF-IDF → Feature Matrix
```

**TF-IDF**:

```
TF(t,d) = frekuensi term t dalam dokumen d
IDF(t) = log(N / df_t)  ← inverse document frequency

TF-IDF(t,d) = TF(t,d) · IDF(t)
```

Term yang sering muncul di dokumen tertentu tapi jarang di keseluruhan corpus → bobot tinggi.

### Time Series Mining

Mengubah time series menjadi atribut:

- **Lag features**: xₜ₋₁, xₜ₋₂, ...
- **Window statistics**: rolling mean, std, min, max
- **Frequency domain**: DFT coefficients

## Semi-Supervised Learning

### Clustering for Classification

1. Cluster all data (labeled + unlabeled)
2. Label clusters berdasarkan mayoritas labeled instances
3. Classify unlabeled berdasarkan cluster assignment

### Co-Training

Gunakan **multiple views** dari data:

```
1. Train classifier A pada view 1 (labeled data)
2. Train classifier B pada view 2 (labeled data)
3. A memprediksi unlabeled → confident predictions ditambahkan ke labeled untuk B
4. B memprediksi unlabeled → confident predictions ditambahkan ke labeled untuk A
5. Ulangi
```

> Co-training berhasil jika kedua views **independent** dan masing-masing **sufficient** untuk klasifikasi.

### EM (Expectation-Maximization) + Co-Training

Gunakan EM untuk soft (probabilistic) labeling:

```
E-step: Estimasikan P(class|instance) untuk unlabeled data
M-step: Update model parameters menggunakan labeled + probabilistically labeled data
Repeat sampai konvergensi
```

## Ringkasan Teknik

| Teknik | Kategori | Kapan Digunakan |
|--------|----------|----------------|
| Feature Selection | Preprocessing | Banyak atribut tidak relevan |
| PCA | Preprocessing | High-dimensional, correlated features |
| Bagging | Ensemble | High-variance models (trees) |
| Boosting | Ensemble | High-bias models |
| Stacking | Ensemble | Multiple diverse models |
| TF-IDF | Text Mining | Document classification |
| Co-training | Semi-supervised | Banyak unlabeled, few labeled |

## Kesimpulan

Advanced techniques adalah perbedaan antara model "cukup baik" dan "excellent". Feature selection menghilangkan noise, ensemble mengkombinasikan kekuatan, text mining membuka data unstructured, dan semi-supervised learning memanfaatkan data yang berlimpah.

Dengan tools seperti WEKA, semua teknik ini bisa kamu eksplorasi dengan point-and-click — tanpa menulis kode.

---

*Referensi: Witten, I.H. & Frank, E. (2005). Data Mining, 2nd Edition. Morgan Kaufmann.*
