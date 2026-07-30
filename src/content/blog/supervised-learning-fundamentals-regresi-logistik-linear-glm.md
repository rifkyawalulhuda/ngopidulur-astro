---
title: "Supervised Learning Fundamentals: Linear Regression, Logistic Regression, dan Generalized Linear Models"
description: Panduan matematis namun aksesibel tentang fondasi supervised
  learning — dari LMS algorithm, normal equations, logistic regression dengan
  Newton's method, hingga Generalized Linear Models (GLMs). Berdasarkan CS229
  Stanford oleh Andrew Ng.
pubDate: 2026-06-24T08:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - SupervisedLearning
  - LinearRegression
  - LogisticRegression
  - DeepLearning
  - CS229
  - AndrewNg
  - DataScience
  - Matematika
series: "CS229 Machine Learning"
seriesOrder: 1
---

**CS229: Machine Learning** di Stanford University adalah salah satu kursus ML paling berpengaruh di dunia. Diajarkan oleh **Andrew Ng**, catatan kuliahnya menjadi rujukan standar untuk memahami fondasi matematis machine learning.

Artikel ini mengupas tiga fondasi supervised learning: **Linear Regression**, **Logistic Regression**, dan **Generalized Linear Models**.

## Notasi dan Setup

Sebelum masuk ke algoritma, kita definisikan notasi standar:

| Simbol | Arti |
|--------|------|
| `x(i)` | Input features ke-i (vector) |
| `y(i)` | Target/output ke-i |
| `m` | Jumlah training examples |
| `n` | Jumlah features |
| `θ` | Parameter model (yang dipelajari) |
| `hθ(x)` | Hypothesis function |
| `J(θ)` | Cost/Loss function |

## Linear Regression

### Hypothesis Function

Model paling sederhana: garis lurus yang memetakan input ke output:

```
hθ(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ = θᵀx
```

Untuk notasi yang lebih ringkas, kita tambahkan `x₀ = 1` (intercept term), sehingga:

```
hθ(x) = ∑θⱼxⱼ = θᵀx
```

### Cost Function: Mean Squared Error

```
J(θ) = (1/2) ∑(hθ(x(i)) - y(i))²
```

Kenapa 1/2? Untuk menghilangkan konstanta 2 saat diferensiasi — purely computational convenience.

### LMS Algorithm (Least Mean Squares)

**Batch Gradient Descent**: Update θ menggunakan SELURUH training set:

```
θⱼ := θⱼ - α · (∂/∂θⱼ) J(θ)

     = θⱼ + α · ∑(y(i) - hθ(x(i))) · xⱼ(i)
```

Dimana `α` adalah learning rate.

**Stochastic Gradient Descent (SGD)**: Update θ menggunakan SATU example per iteration:

```
Loop {
  for i = 1 to m:
    θⱼ := θⱼ + α · (y(i) - hθ(x(i))) · xⱼ(i)
}
```

| | Batch GD | Stochastic GD |
|---|---|---|
| **Update per step** | Seluruh dataset | 1 example |
| **Konvergensi** | Smooth, deterministic | Noisy, probabilistic |
| **Kecepatan** | Lambat untuk big data | Cepat, scalable |
| **Minimum** | Local minimum | "Wanders" around minimum |

### The Normal Equations

Alternatif non-iteratif: selesaikan secara closed-form menggunakan matriks.

**Design Matrix X**: matrix m × (n+1) berisi semua training examples:

```
X = [— x(1)ᵀ —]
    [— x(2)ᵀ —]
    [   ...     ]
    [— x(m)ᵀ —]
```

**Solusi closed-form**:

```
θ = (XᵀX)⁻¹ Xᵀy
```

Derivasi menggunakan matrix derivatives:

```
∇θ J(θ) = XᵀXθ - Xᵀy = 0
XᵀXθ = Xᵀy
θ = (XᵀX)⁻¹ Xᵀy
```

**Kapan menggunakan Normal Equations?**
- ✅ n < 10,000 (small feature space)
- ✅ Butuh solusi eksak
- ❌ n besar (inversi O(n³) terlalu lambat)

### Probabilistic Interpretation

Kenapa Least Squares adalah pilihan yang "benar"? Asumsikan:

```
y(i) = θᵀx(i) + ε(i)
```

Dimana ε(i) ~ N(0, σ²) — error terdistribusi normal.

Maka likelihood function:

```
L(θ) = ∏ p(y(i)|x(i); θ)
     = ∏ (1/√(2πσ²)) · exp(-(y(i) - θᵀx(i))² / (2σ²))
```

**Memaksimalkan log-likelihood = Meminimalkan J(θ)**.

> Jadi: Least Squares adalah MLE (Maximum Likelihood Estimator) dengan asumsi error Gaussian!

### Locally Weighted Linear Regression

Untuk data non-linear, kita bisa menggunakan **weighted regression**:

```
J(θ) = ∑ w(i) · (y(i) - θᵀx(i))²
```

Dimana weights:

```
w(i) = exp(-(x(i) - x)² / (2τ²))
```

- τ kecil → fit lokal, high variance
- τ besar → fit global, high bias

## Logistic Regression (Klasifikasi)

### Dari Regresi ke Klasifikasi

Untuk binary classification (y ∈ {0, 1}), kita butuh output antara 0 dan 1:

```
hθ(x) = g(θᵀx)
```

Dimana `g(z)` adalah **sigmoid/logistic function**:

```
g(z) = 1 / (1 + e⁻ᶻ)
```

Properti sigmoid:
- g(z) → 1 saat z → ∞
- g(z) → 0 saat z → -∞
- g(0) = 0.5
- g'(z) = g(z)(1 - g(z)) ← turunan yang elegan!

### Interpretasi Probabilistik

```
P(y=1 | x; θ) = hθ(x)
P(y=0 | x; θ) = 1 - hθ(x)
```

Atau lebih ringkas:

```
p(y | x; θ) = (hθ(x))ʸ · (1 - hθ(x))¹⁻ʸ
```

### Cross-Entropy Loss

Jika kita pakai MSE untuk logistic regression, J(θ) menjadi non-convex — gradient descent bisa terjebak di local minimum.

Solusi: **Cross-entropy loss** (convex!):

```
J(θ) = -∑ [y(i) log hθ(x(i)) + (1-y(i)) log(1 - hθ(x(i)))]
```

### Gradient Descent untuk Logistic Regression

Ajaibnya, gradient-nya identik dengan linear regression:

```
∂J/∂θⱼ = ∑ (hθ(x(i)) - y(i)) · xⱼ(i)
```

Update rule:

```
θⱼ := θⱼ - α · ∑ (hθ(x(i)) - y(i)) · xⱼ(i)
```

> Sama persis dengan LMS! Bedanya hanya pada definisi hθ(x).

### Newton's Method

Untuk konvergensi lebih cepat, gunakan Newton's Method:

```
θ := θ - H⁻¹ ∇θ J(θ)
```

Dimana **H** adalah Hessian matrix (second derivatives):

```
Hᵢⱼ = ∂²J / ∂θᵢ∂θⱼ
```

Keunggulan: quadratic convergence. Kelemahan: perlu menghitung invers Hessian O(n³).

### Multi-Class Classification: Softmax

Untuk K kelas, gunakan **softmax regression**:

```
P(y=k | x; θ) = exp(θ(k)ᵀx) / ∑ⱼ exp(θ(j)ᵀx)
```

## Generalized Linear Models (GLMs)

GLM menyatukan linear regression, logistic regression, dan banyak model lain dalam satu framework.

### The Exponential Family

Distribusi dalam **exponential family** bisa ditulis:

```
p(y; η) = b(y) · exp(ηᵀT(y) - a(η))
```

Dimana:
- **η**: natural parameter
- **T(y)**: sufficient statistic
- **a(η)**: log partition function

| Distribusi | η | a(η) | Digunakan untuk |
|-----------|-----|------|----------------|
| **Bernoulli** | log(φ/(1-φ)) | log(1+e^η) | Logistic regression |
| **Gaussian** | μ | η²/2 | Linear regression |
| **Poisson** | log λ | e^η | Count data |
| **Multinomial** | ... | ... | Softmax regression |

### Konstruksi GLM: 3 Asumsi

1. **y|x;θ ~ ExponentialFamily(η)**
2. **η = θᵀx** (linear predictor)
3. **hθ(x) = E[y|x;θ]** (prediksi = expected value)

Dari 3 asumsi ini, kita bisa menurunkan:
- Linear Regression (Gaussian + identity link)
- Logistic Regression (Bernoulli + logit link)
- Poisson Regression (Poisson + log link)

## Kesimpulan

Tiga fondasi supervised learning ini — Linear Regression, Logistic Regression, dan GLMs — membentuk tulang punggung machine learning modern. Memahaminya secara matematis membuka pintu ke algoritma yang lebih kompleks seperti neural networks dan deep learning.

Di artikel selanjutnya, kita akan mendalami **Generative Learning Algorithms** — GDA, Naive Bayes, dan perbandingan generative vs discriminative models.

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Stanford University.*
