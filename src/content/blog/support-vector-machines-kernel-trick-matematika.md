---
title: "Support Vector Machines & Kernel Trick: Matematika di Balik Maximum Margin Classifier"
description: Dari geometric margin ke dual optimization, dari soft-margin SVM
  ke kernel trick yang legendaris. Memahami Support Vector Machines secara
  matematis lengkap dengan intuisi visual. Materi CS229 Stanford.
pubDate: 2026-06-24T10:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - SVM
  - Kernel
  - SupportVectorMachine
  - Optimasi
  - CS229
  - Matematika
  - DataScience
series: "CS229 Machine Learning"
seriesOrder: 3
---

**Support Vector Machine (SVM)** adalah salah satu algoritma paling elegan dalam machine learning. Ia mencari **hyperplane optimal** yang memisahkan dua kelas dengan **margin maksimum**.

Artikel ini mengupas SVM dari dasar matematis — functional margin, geometric margin, primal & dual optimization, hingga kernel trick.

## Margin: Functional vs Geometric

### Setup

Binary classification: y ∈ {-1, +1}, classifier: h(x) = sign(wᵀx + b)

### Functional Margin

Untuk satu training example:

```
γ̂(i) = y(i) · (wᵀx(i) + b)
```

- γ̂ > 0 → klasifikasi benar
- γ̂ besar → confidence tinggi

**Masalah**: functional margin bisa diskalakan seenaknya (kalikan w dan b dengan 2 → margin jadi 2× tanpa mengubah decision boundary).

### Geometric Margin

Jarak Euclidean dari data point ke decision boundary:

```
γ(i) = y(i) · (wᵀx(i) + b) / ||w||
```

Ini adalah **jarak geometris sesungguhnya** — tidak berubah jika w dan b diskalakan.

### Maximum Margin Classifier

Tujuan: cari hyperplane yang memaksimalkan geometric margin:

```
max_γ,w,b  γ
s.t.       y(i)(wᵀx(i) + b) ≥ γ,  i=1,...,m
           ||w|| = 1
```

## Optimisasi: Primal Problem

Dengan manipulasi matematis, ini ekuivalen dengan:

```
min_w,b  ½||w||²
s.t.     y(i)(wᵀx(i) + b) ≥ 1,  i=1,...,m
```

Ini adalah **convex optimization problem** — ada solusi global tunggal!

## Lagrange Duality

### Lagrangian

```
L(w, b, α) = ½||w||² - ∑αᵢ[y(i)(wᵀx(i) + b) - 1]
```

Dimana αᵢ ≥ 0 adalah **Lagrange multipliers**.

### Dual Problem

Setelah menyelesaikan kondisi KKT:

```
max_α  ∑αᵢ - ½∑∑αᵢαⱼy(i)y(j)(x(i))ᵀx(j)
s.t.   αᵢ ≥ 0
       ∑αᵢy(i) = 0
```

**Mengapa dual?**
- Dimensi: N variabel (αᵢ) vs n+1 (w,b)
- Kernel trick: hanya butuh inner product (x(i))ᵀx(j)

### Support Vectors

Setelah optimasi, hanya data points dengan **αᵢ > 0** yang mempengaruhi decision boundary — inilah **support vectors**:

```
w = ∑αᵢy(i)x(i)   (hanya untuk αᵢ > 0)
```

> Mayoritas αᵢ = 0! Hanya beberapa titik — yang paling sulit diklasifikasi — menjadi support vectors.

## Soft-Margin SVM (Outlier Handling)

Untuk data yang tidak perfectly separable, kita izinkan beberapa kesalahan:

```
min  ½||w||² + C·∑ξᵢ
s.t. y(i)(wᵀx(i) + b) ≥ 1 - ξᵢ,  ξᵢ ≥ 0
```

- **C kecil** → toleransi tinggi, margin lebar, high bias
- **C besar** → toleransi rendah, margin sempit, high variance

C adalah **regularization parameter** — mengontrol trade-off antara margin lebar dan kesalahan klasifikasi.

## The Kernel Trick

### Ide

Ketika data tidak linearly separable, kita bisa memetakan ke **higher-dimensional space**:

```
x → φ(x)
```

Tapi menghitung φ(x) untuk dimensi tinggi mahal. Solusi: **kernel trick**.

### Kernel Function

```
K(x, z) = ⟨φ(x), φ(z)⟩
```

Kita tidak perlu menghitung φ(x) secara eksplisit — cukup evaluasi K(x,z)!

### Kernel Populer

| Kernel | Formula | Parameter |
|--------|---------|-----------|
| **Linear** | K(x,z) = xᵀz | - |
| **Polynomial** | K(x,z) = (xᵀz + c)ᵈ | d=degree, c=constant |
| **Gaussian/RBF** | K(x,z) = exp(-γ||x-z||²) | γ=bandwidth |
| **Sigmoid** | K(x,z) = tanh(κxᵀz + c) | κ, c |

### Gaussian Kernel: Implisit Infinite-Dimensional

Gaussian kernel bisa diekspansi:

```
exp(-||x-z||²/2σ²) = exp(-xᵀx/2σ²) · exp(-zᵀz/2σ²) · ∑(xᵀz/k!σ²ᵏ)
```

Ini ekuivalen dengan **infinite-dimensional feature space**! Inilah kekuatan kernel trick.

## SVM dengan Kernel dalam Praktik

```python
from sklearn.svm import SVC

# Linear SVM
model = SVC(kernel='linear', C=1.0)

# RBF SVM
model = SVC(kernel='rbf', C=1.0, gamma='scale')

# Polynomial SVM
model = SVC(kernel='poly', degree=3, C=1.0)

model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)
```

## SVM vs Logistic Regression vs Neural Networks

| | SVM | Logistic Reg. | Neural Net |
|---|---|---|---|
| **Interpretasi** | Geometris | Probabilistik | Black-box |
| **Non-linear** | Via kernel | Via feature engineering | Via architecture |
| **Data efficiency** | Baik | Sangat baik | Butuh banyak data |
| **Training speed** | O(m²) - O(m³) | O(mn) | O(epochs·m·params) |
| **Multi-class** | One-vs-all/rest | Softmax (native) | Native |

## Kesimpulan

SVM adalah masterpiece matematis — dari geometric intuition tentang margin, dual optimization yang elegan, sampai kernel trick yang membuka dimensi tak terbatas. Meskipun deep learning mendominasi, SVM tetap relevan untuk dataset kecil-menengah, terutama ketika interpretabilitas geometris penting.

Di artikel selanjutnya: **Decision Trees, Random Forest, dan Ensemble Methods**.

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Stanford University.*
