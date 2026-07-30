---
title: "Decision Trees, Random Forest, dan Ensemble Methods: Bagging, Boosting, dan XGBoost Dijelaskan Lengkap"
description: Panduan komprehensif decision trees dan ensemble methods — dari
  ID3, CART, entropy & Gini impurity, Random Forest, Bagging, AdaBoost,
  Gradient Boosting, hingga XGBoost. Dengan penjelasan matematis dan code
  Python siap pakai.
pubDate: 2026-06-24T11:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - DecisionTree
  - RandomForest
  - XGBoost
  - EnsembleLearning
  - Bagging
  - Boosting
  - DataScience
series: "CS229 Machine Learning"
seriesOrder: 4
---

**Decision Trees** adalah fondasi dari **ensemble methods** — keluarga algoritma paling dominan di kompetisi data science dan aplikasi bisnis. Dari Random Forest hingga XGBoost, semuanya berakar dari pohon keputusan.

## Decision Trees: Fondasi

### Struktur

```
          [Root: Usia > 30?]
          /                \
     [Pendapatan > 50jt?]   [Status: Menikah?]
       /          \            /            \
   [Approve]   [Deny]    [Approve]       [Deny]
```

Setiap node:
- **Internal node**: test pada satu feature
- **Edge**: hasil test (branch)
- **Leaf**: prediksi (class label atau continuous value)

### Impurity Measures

Untuk memilih split terbaik, kita ukur "impurity" node:

**Entropy** (ID3, C4.5):

```
H(S) = -∑ p(y) · log₂ p(y)
```

**Gini Impurity** (CART):

```
G(S) = 1 - ∑ p(y)²
```

| Semua kelas sama | 50-50 | 33-33-33 |
|---|---|---|
| Entropy = 0 | 1.0 | 1.58 |
| Gini = 0 | 0.5 | 0.67 |

### Information Gain

```
IG(S, A) = H(S) - ∑ (|Sᵥ|/|S|) · H(Sᵥ)
```

Dimana Sᵥ adalah subset S dimana attribute A = value v.

**Pilih split dengan Information Gain tertinggi** — memberikan pemisahan kelas yang paling "bersih".

### Kelebihan & Kekurangan Decision Trees

**✅ Kelebihan:**
- Interpretable: bisa divisualisasikan
- Non-parametric: tidak ada asumsi distribusi
- Menangani numerical + categorical features
- Feature importance built-in

**❌ Kekurangan:**
- High variance: data sedikit berubah → tree berubah drastis
- Overfitting tanpa pruning
- Greedy: tidak menjamin global optimum

## Ensemble Methods: Why Many > One

Intuisi ensemble: **"Wisdom of the crowd"**

Jika setiap model memiliki error rate ε < 0.5, dan model-model **uncorrelated**, maka ensemble bisa mencapai error mendekati 0 seiring bertambahnya jumlah model.

### Bagging (Bootstrap Aggregating)

**Ide**: Latih banyak model pada **bootstrap samples** (sampling dengan replacement), lalu **average/vote**.

```
Untuk b = 1 sampai B:
  1. Buat bootstrap sample D_b (sampling dengan replacement)
  2. Latih model f_b pada D_b

Prediksi akhir = (1/B) ∑ f_b(x)        (regression)
               = majority_vote(f_b(x))  (classification)
```

**Random Forest** = Bagging + **random feature subset**:

```
Untuk setiap tree:
  1. Bootstrap sample
  2. Untuk setiap split: pilih dari m < n features (biasanya m = √n)
  3. Bangun tree penuh (no pruning)
```

> Random feature subset **decorrelates** trees — mencegah semua tree memilih split yang sama.

### Random Forest Implementation

```python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,    # jumlah trees
    max_depth=10,        # kedalaman maksimum
    min_samples_split=5, # minimum samples untuk split
    max_features='sqrt'  # √n features per split
)
rf.fit(X_train, y_train)
```

### Out-of-Bag (OOB) Error

Setiap tree dilatih pada ~63% data. 37% sisanya adalah **out-of-bag samples** — bisa digunakan sebagai **validation set gratis**!

```python
rf = RandomForestClassifier(oob_score=True)
rf.fit(X, y)
print(f"OOB Score: {rf.oob_score_:.3f}")
```

## Boosting: Belajar dari Kesalahan

### AdaBoost (Adaptive Boosting)

**Ide**: Fokus pada data yang sulit.

```
Inisialisasi: weights w_i = 1/m
Untuk t = 1 sampai T:
  1. Latih weak learner h_t pada weighted data
  2. Hitung error ε_t = ∑ w_i · 1{h_t(x_i) ≠ y_i}
  3. Hitung α_t = ½ ln((1-ε_t)/ε_t)   ← weight model
  4. Update w_i ← w_i · exp(α_t · 1{wrong})
  5. Normalisasi w_i

Prediksi: H(x) = sign(∑ α_t · h_t(x))
```

**α_t** = weight model. Semakin kecil error, semakin besar bobot model.

### Gradient Boosting

Alih-alih reweighting, Gradient Boosting **memodelkan residual**:

```
F₀(x) = argmin_γ ∑ L(y_i, γ)

Untuk m = 1 sampai M:
  1. r_im = -[∂L(y_i, F(x_i)) / ∂F(x_i)]  ← pseudo-residual
  2. Latih tree h_m pada (x_i, r_im)
  3. γ_m = argmin_γ ∑ L(y_i, F_{m-1}(x_i) + γ·h_m(x_i))
  4. F_m(x) = F_{m-1}(x) + ν·γ_m·h_m(x)   (ν = learning rate)
```

**Learning rate ν** (shrinkage) mengontrol kontribusi setiap tree:

- ν kecil → butuh banyak trees, regularisasi kuat
- ν besar → cepat, risiko overfitting

### XGBoost: Gradient Boosting on Steroids

XGBoost menambahkan **regularization** ke objective function:

```
Obj = ∑ L(y_i, ŷ_i) + ∑ Ω(f_k)
Ω(f) = γT + ½λ||w||²
```

Dimana:
- T: jumlah leaves
- w: leaf weights
- γ, λ: regularization parameters

**Mengapa XGBoost mendominasi kompetisi:**
- Regularization (γ, λ) mencegah overfitting
- Second-order Taylor approximation (lebih akurat)
- Column subsampling (seperti Random Forest)
- Parallel processing
- Built-in cross-validation
- Handling missing values

```python
import xgboost as xgb

model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,          # row sampling
    colsample_bytree=0.8,   # column sampling
    reg_lambda=1.0,         # L2 regularization
    reg_alpha=0.0           # L1 regularization
)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)])
```

## Perbandingan Ensemble Methods

| | Random Forest | AdaBoost | Gradient Boosting | XGBoost |
|---|---|---|---|---|
| **Paralel** | ✅ | ❌ (sequential) | ❌ | ✅ optimized |
| **Overfitting** | Low (bagging) | Medium | Medium | Low (regularized) |
| **Speed** | Fast | Medium | Slow | Very fast |
| **Noise sensitivity** | Robust | Sensitive | Sensitive | Robust |
| **Interpretability** | Feature importance | Feature importance | Feature importance | Feature importance + SHAP |

## Kesimpulan

Decision Trees adalah fondasi, tapi ensemble methods-lah yang membawa performa ke level berikutnya. **Random Forest** memberikan akurasi solid dengan hampir tanpa tuning. **XGBoost** adalah senjata pamungkas kompetisi data science — dengan regularization, parallel processing, dan handling missing values.

Di artikel selanjutnya: **Neural Networks & Deep Learning** — dari perceptron ke backpropagation.

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Stanford University. Friedman, J. (2001). Greedy Function Approximation: A Gradient Boosting Machine. Chen, T. & Guestrin, C. (2016). XGBoost.*
