---
title: "Algoritma Machine Learning Klasik: 1R, Naive Bayes, C4.5, k-NN, dan K-Means Dijelaskan Lengkap"
description: Implementasi detail algoritma ML klasik — dari 1R (simplest
  classifier), Naive Bayes dengan probability, C4.5 decision tree dengan
  information gain, k-NN instance-based learning, hingga K-Means clustering.
  Disertai contoh perhitungan manual.
pubDate: 2026-06-24T16:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - DataMining
  - AlgoritmaML
  - NaiveBayes
  - DecisionTree
  - KNN
  - KMeans
  - WEKA
  - MachineLearning
series: "Data Mining WEKA"
seriesOrder: 3
---

Dari yang paling sederhana (1R) hingga yang sophisticated (C4.5), artikel ini mengupas **bagaimana** algoritma machine learning klasik bekerja — dengan perhitungan manual.

## 1R: The Simplest Classifier

**1R (One Rule)**: pilih satu atribut terbaik, buat rules berdasarkan nilai atribut itu.

### Algorithm

```
Untuk SETIAP atribut:
  1. Untuk SETIAP nilai atribut:
     a. Hitung frekuensi setiap class
     b. Pilih class mayoritas sebagai prediksi
  2. Hitung error rate = jumlah kesalahan / total

Pilih atribut dengan ERROR RATE TERKECIL
```

### Contoh Manual: Weather Dataset

**Atribut: Outlook**
```
sunny:    [no:3, yes:2] → prediksi = no, error = 2/5
overcast: [no:0, yes:4] → prediksi = yes, error = 0/4
rainy:    [no:2, yes:3] → prediksi = yes, error = 2/5
Total error = (2+0+2)/14 = 4/14
```

**Atribut: Humidity**
```
high:   [no:4, yes:3] → no, error = 3/7
normal: [no:1, yes:6] → yes, error = 1/7
Total error = (3+1)/14 = 4/14
```

Outlook dan Humidity sama-sama error 4/14. Pilih salah satu.

> **1R simple tapi surprisingly effective!** Sering jadi baseline yang mengejutkan.

## Naive Bayes: Probabilistic Classifier

### Bayesian Foundation

```
P(H|E) = P(E|H) · P(H) / P(E)
```

Untuk klasifikasi dengan multiple attributes:

```
P(C|a₁,a₂,...,aₙ) ∝ P(C) · ∏ P(aᵢ|C)
```

"Naive" karena mengasumsikan **conditional independence** antara atribut.

### Contoh Perhitungan

Data weather, prediksi Play untuk [sunny, cool, high, TRUE]:

```
P(yes|E) = P(yes) · P(sunny|yes) · P(cool|yes) · P(high|yes) · P(TRUE|yes)
         = 9/14 · 2/9 · 3/9 · 3/9 · 3/9
         = 0.0053

P(no|E)  = P(no) · P(sunny|no) · P(cool|no) · P(high|no) · P(TRUE|no)
         = 5/14 · 3/5 · 1/5 · 4/5 · 3/5
         = 0.0206

Normalisasi: P(yes) = 0.0053/(0.0053+0.0206) = 20.5%
            P(no)  = 0.0206/(0.0053+0.0206) = 79.5%

Prediksi: NO
```

### Laplace Estimator

Jika P(sunny|yes) = 0 → seluruh likelihood jadi 0.

```
P(attr|class) = (count + μ·p) / (N + μ)
```

μ=1, p=1/k (uniform prior) → add-one smoothing.

### Menangani Numeric Attributes

Asumsikan distribusi **normal**:

```
P(x|C) = (1/√(2πσ²)) · exp(-(x-μ)²/(2σ²))

μ = mean atribut untuk class C
σ = standard deviation
```

## C4.5 Decision Tree: Information-Based Splitting

### Information Gain

```
Info([a,b,c]) = -a/N·log₂(a/N) - b/N·log₂(b/N) - c/N·log₂(c/N)

Info(Outlook) = 5/14·Info([2,3]) + 4/14·Info([4,0]) + 5/14·Info([3,2])
              = 5/14·0.971 + 4/14·0 + 5/14·0.971
              = 0.693

Info([9,5]) = -9/14·log₂(9/14) - 5/14·log₂(5/14) = 0.940

Gain(Outlook) = 0.940 - 0.693 = 0.247 bits
```

### Gain Ratio (C4.5 improvement)

Information Gain favor atribut dengan banyak nilai. Solusi: **Gain Ratio**.

```
SplitInfo(Outlook) = -5/14·log₂(5/14) - 4/14·log₂(4/14) - 5/14·log₂(5/14)
                   = 1.577

GainRatio = Gain / SplitInfo = 0.247 / 1.577 = 0.157
```

### Pruning

**Post-pruning**: bangun tree lengkap → potong cabang yang tidak signifikan.

**Subtree replacement**: ganti subtree dengan leaf jika error rate tidak meningkat signifikan.

**Pessimistic error estimate**: error rate upper bound (confidence 25%) = observed + correction.

## k-Nearest Neighbors (k-NN)

### Algorithm

```python
def knn_predict(x_train, y_train, x_new, k=3):
    # 1. Hitung distance
    distances = [euclidean(x_new, x) for x in x_train]
    
    # 2. Pilih k nearest
    nearest_idx = np.argsort(distances)[:k]
    nearest_labels = y_train[nearest_idx]
    
    # 3. Majority vote
    return mode(nearest_labels)
```

### Distance Functions

**Euclidean**: d(x,y) = √∑(xᵢ - yᵢ)²
**Manhattan**: d(x,y) = ∑|xᵢ - yᵢ|
**Minkowski**: (∑|xᵢ - yᵢ|ᵖ)¹/ᵖ

> **Normalize attributes!** Distance didominasi atribut dengan range besar.

### Mencari Nearest Neighbors Efficiently

**kD-Tree**: Binary tree yang mem-partisi ruang. Hanya eksplorasi cabang yang berpotensi mengandung nearest neighbor.

## K-Means Clustering

### Algorithm

```
1. Pilih k initial centroids (random)
2. REPEAT:
   a. Assign setiap instance ke centroid terdekat
   b. Update centroid = mean dari semua anggota cluster
   UNTIL konvergensi (centroids tidak berubah)
```

### Memilih k

**Elbow Method**: Plot within-cluster sum of squares vs k. Pilih k di mana penurunan melambat ("elbow").

### Keterbatasan K-Means

- Harus specify k di awal
- Hanya menemukan **spherical clusters**
- Sensitif terhadap initial centroids
- Tidak menangani noise/outliers dengan baik

## Perbandingan Algoritma

| Algoritma | Speed Train | Speed Predict | Accuracy | Interpretable |
|-----------|------------|---------------|----------|---------------|
| **1R** | ✅✅✅ | ✅✅✅ | ⭐⭐ | ✅✅✅ |
| **Naive Bayes** | ✅✅✅ | ✅✅✅ | ⭐⭐⭐ | ✅✅ |
| **C4.5** | ✅✅ | ✅✅✅ | ⭐⭐⭐⭐ | ✅✅✅ |
| **k-NN** | ✅✅✅ | ❌ | ⭐⭐⭐ | ❌ |
| **K-Means** | ✅✅ | ✅✅✅ | (unsupervised) | ✅ |

## Kesimpulan

Memahami cara kerja algoritma secara detail — bukan sekadar memanggil `model.fit()` — adalah kunci menjadi praktisi data mining yang efektif. Setiap algoritma punya **inductive bias** yang membuatnya cocok untuk jenis data tertentu.

Di artikel selanjutnya: **Evaluasi Model** — cross-validation, ROC, cost-sensitive learning.

---

*Referensi: Witten, I.H. & Frank, E. (2005). Data Mining, 2nd Edition. Morgan Kaufmann.*
