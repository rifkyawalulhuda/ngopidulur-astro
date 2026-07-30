---
title: "Generative Learning & Naive Bayes: GDA, Gaussian Discriminant Analysis, dan Aplikasi Klasifikasi Teks"
description: Memahami perbedaan mendasar antara generative dan discriminative
  learning — dari Gaussian Discriminant Analysis (GDA), Naive Bayes classifier,
  Laplace smoothing, hingga aplikasi spam filtering. Materi CS229 Stanford yang
  dijelaskan dengan intuisi dan matematika.
pubDate: 2026-06-24T09:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - NaiveBayes
  - GenerativeLearning
  - GDA
  - NLP
  - Klasifikasi
  - CS229
  - AndrewNg
  - DataScience
series: "CS229 Machine Learning"
seriesOrder: 2
---

Semua model yang kita bahas sejauh ini — linear regression, logistic regression — adalah **discriminative models**. Mereka mempelajari P(y|x) secara langsung.

Sekarang kita beralih ke **generative models** — yang mempelajari P(x|y) dan P(y), lalu menggunakan Bayes rule untuk menghitung P(y|x).

## Discriminative vs Generative

| | Discriminative | Generative |
|---|---|---|
| **Yang dipelajari** | P(y|x) langsung | P(x|y) dan P(y) |
| **Decision boundary** | Langsung dioptimasi | Produk sampingan dari distribusi |
| **Data generation** | Tidak bisa | Bisa generate data baru |
| **Contoh** | Logistic Regression, SVM | GDA, Naive Bayes |
| **Sample complexity** | Lebih sedikit data | Butuh lebih banyak data |

## Gaussian Discriminant Analysis (GDA)

GDA mengasumsikan bahwa **P(x|y) terdistribusi normal (Gaussian)**.

### Setup

Untuk binary classification (y ∈ {0,1}):

```
y ~ Bernoulli(φ)
x|y=0 ~ N(μ₀, Σ)
x|y=1 ~ N(μ₁, Σ)
```

> **Catatan**: Σ (covariance matrix) **shared** antara kedua kelas — ini asumsi penting GDA.

### Distribusi Multivariate Normal

```
N(x; μ, Σ) = (1 / (2π)^(n/2) |Σ|^(1/2)) · exp(-½(x-μ)ᵀΣ⁻¹(x-μ))
```

- **μ** (mean vector): pusat distribusi
- **Σ** (covariance matrix): bentuk dan orientasi

### Maximum Likelihood Estimation

Parameter GDA: φ, μ₀, μ₁, Σ

```
φ  = (1/m) ∑ 1{y(i)=1}
μ₀ = ∑ 1{y(i)=0}·x(i) / ∑ 1{y(i)=0}
μ₁ = ∑ 1{y(i)=1}·x(i) / ∑ 1{y(i)=1}
Σ  = (1/m) ∑ (x(i) - μ_y(i))(x(i) - μ_y(i))ᵀ
```

Intuisi:
- φ = proporsi kelas positif
- μ₀ = rata-rata x untuk kelas 0
- μ₁ = rata-rata x untuk kelas 1
- Σ = covariance matrix (pooled)

### Prediksi

```
P(y=1|x) = P(x|y=1)P(y=1) / [P(x|y=1)P(y=1) + P(x|y=0)P(y=0)]
```

Decision boundary: **linear** (karena shared Σ) — inilah kenapa GDA menghasilkan linear classifier.

### GDA vs Logistic Regression

| | GDA | Logistic Regression |
|---|---|---|
| **Asumsi** | P(x|y) Gaussian | Tidak ada asumsi distribusi x |
| **Efisiensi data** | Lebih efisien jika asumsi benar | Lebih robust |
| **Decision boundary** | Linear | Linear |
| **Generative** | Bisa generate data | Tidak bisa |

> **Prinsip penting**: Jika asumsi Gaussian benar, GDA **asymptotically efficient** — tidak ada algoritma lain yang bisa lebih baik. Tapi logistic regression lebih robust karena membuat asumsi yang lebih lemah.

## Naive Bayes

Untuk data **high-dimensional** seperti teks (n bisa 50,000+), GDA tidak praktis karena Σ akan berukuran n×n.

Naive Bayes menyederhanakan dengan **conditional independence assumption**:

```
P(x₁, x₂, ..., xₙ | y) = ∏ P(xᵢ | y)
```

"Setiap feature independen satu sama lain, diberikan class label."

### Untuk Klasifikasi Teks (Spam Filter)

Representasi **multinomial**:

- **xⱼ**: berapa kali kata ke-j muncul dalam email
- **Vocabulary**: V = 10,000 kata paling umum

Distribusi: **Multinomial**

```
P(x|y) = (∑xᵢ)! / (∏xᵢ!) · ∏ φ_y,ᵢ^xᵢ
```

### Parameter Estimation

```
φ_y=1    = proporsi spam
φ_y=1,ⱼ  = P(kata j muncul | spam)
φ_y=0,ⱼ  = P(kata j muncul | bukan spam)
```

Dengan Laplace smoothing:

```
φ_y=1,ⱼ  = (1 + ∑ 1{xⱼ(i)>0 ∧ y(i)=1}) / (|V| + ∑∑ 1{xⱼ(i)>0 ∧ y(i)=1})
```

> **Kenapa smoothing?** Tanpa smoothing, kata yang tidak pernah muncul di training akan memiliki probabilitas 0 — mengakibatkan keseluruhan likelihood menjadi 0.

### Laplace Smoothing

```
φⱼ = (1 + countⱼ) / (k + N)
```

Dimana `k` adalah jumlah kategori. Untuk binary: tambahkan 1 ke numerator, 2 ke denominator.

## Kapan Menggunakan Generative Models?

**Keunggulan:**
- Bisa memanfaatkan **unlabeled data** (semi-supervised learning)
- Memberikan **probability calibration** yang lebih baik
- Bisa **generate synthetic data**
- Natural untuk **missing data** (marginalize)

**Kelemahan:**
- Asumsi distribusi mungkin salah
- Butuh **lebih banyak parameter** (terutama untuk high-dimensional data)

## Contoh Kode: Naive Bayes dari Scratch

```python
import numpy as np

class NaiveBayes:
    def fit(self, X, y):
        self.classes = np.unique(y)
        self.theta = {}
        self.priors = {}
        
        for c in self.classes:
            X_c = X[y == c]
            self.priors[c] = len(X_c) / len(X)
            # Laplace smoothing
            self.theta[c] = (X_c.sum(axis=0) + 1) / (X_c.sum() + X.shape[1])
    
    def predict(self, X):
        log_probs = []
        for c in self.classes:
            log_prior = np.log(self.priors[c])
            log_likelihood = X @ np.log(self.theta[c]) + (1-X) @ np.log(1-self.theta[c])
            log_probs.append(log_prior + log_likelihood)
        return self.classes[np.argmax(log_probs, axis=0)]
```

## Kesimpulan

Generative models menawarkan perspektif yang berbeda dari discriminative models — alih-alih langsung mempelajari decision boundary, mereka memodelkan **bagaimana data di-generate**. 

**GDA** unggul ketika asumsi Gaussian terpenuhi. **Naive Bayes**, meskipun dengan asumsi independence yang "naif", bekerja sangat baik untuk klasifikasi teks dan menjadi fondasi NLP modern sebelum era deep learning.

Di artikel selanjutnya: **Support Vector Machines** — algoritma yang mencari "maximum margin hyperplane".

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Stanford University.*
