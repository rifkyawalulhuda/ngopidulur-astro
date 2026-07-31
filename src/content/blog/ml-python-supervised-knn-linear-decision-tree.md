---
title: "Supervised Learning Python: KNN, Linear Models, Decision Tree"
description: Panduan supervised learning dengan scikit-learn - k-Nearest Neighbors,
  Linear Models regresi dan klasifikasi, Decision Trees, Random Forests, Gradient
  Boosting dengan contoh kode lengkap dan tips memilih algoritma yang tepat.
pubDate: 2026-09-09T08:00:00.000Z
image: /image/ml-python-oreilly-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - Python
  - ScikitLearn
  - SupervisedLearning
series: "Machine Learning dengan Python"
seriesOrder: 2
---

Chapter 2 dari *Introduction to Machine Learning with Python* membahas algoritma supervised learning secara mendalam. Ini adalah chapter terpanjang di buku — dan dengan alasan yang baik. Supervised learning adalah fondasi dari sebagian besar aplikasi ML praktis. Artikel ini mencakup algoritma-algoritma utama beserta kode Python lengkap.

## Daftar Isi

- [k-Nearest Neighbors (k-NN)](#k-nearest-neighbors-k-nn)
- [Linear Models](#linear-models)
- [Decision Trees](#decision-trees)
- [Random Forests](#random-forests)
- [Gradient Boosting](#gradient-boosting)
- [Cara Memilih Algoritma](#cara-memilih-algoritma)



## k-Nearest Neighbors (k-NN)

k-NN adalah salah satu algoritma ML paling sederhana — untuk klasifikasi maupun regresi.

### Cara Kerja k-NN

Untuk memprediksi kelas data baru:
1. Cari k data training yang paling dekat (nearest neighbors)
2. Untuk klasifikasi: voting mayoritas dari k neighbors
3. Untuk regresi: rata-rata dari k neighbors

### k-NN untuk Klasifikasi

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, stratify=cancer.target, random_state=66)

# Coba berbagai nilai k
training_accuracy = []
test_accuracy = []
neighbors_settings = range(1, 11)

for n_neighbors in neighbors_settings:
    clf = KNeighborsClassifier(n_neighbors=n_neighbors)
    clf.fit(X_train, y_train)
    training_accuracy.append(clf.score(X_train, y_train))
    test_accuracy.append(clf.score(X_test, y_test))

# k=1: overfitting (100% train, ~93% test)
# k=6: sweet spot (~94% test)
# k=10: underfitting mulai terlihat
```

### k-NN untuk Regresi

```python
from sklearn.neighbors import KNeighborsRegressor
import numpy as np

# Data sinusoidal dengan noise
X = np.array([-3, -2, -1, 0, 1, 2, 3]).reshape(-1, 1)
y = np.array([-0.9, -0.3, 0.1, 0.4, 0.7, 0.8, 0.9])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, random_state=0)

reg = KNeighborsRegressor(n_neighbors=3)
reg.fit(X_train, y_train)
print("R² score:", reg.score(X_test, y_test))
```

### Parameter k-NN

| Parameter | Efek | Rekomendasi |
|-----------|------|-------------|
| `n_neighbors` kecil (1) | Overfitting | Hindari kecuali dataset kecil |
| `n_neighbors` besar | Underfitting | Coba 3-10 |
| `metric` | Jarak yang dipakai | 'euclidean', 'manhattan' |

### Kapan Pakai k-NN

**Kelebihan:**
- Mudah dipahami dan diimplementasikan
- Tidak perlu training (lazy learner)
- Alami untuk masalah yang dekat secara geografis

**Kekurangan:**
- Lambat untuk dataset besar
- Tidak bekerja baik untuk data berdimensi tinggi
- Sensitif terhadap scaling fitur



## Linear Models

Linear models membuat prediksi menggunakan kombinasi linear dari fitur input.

### Linear Regression

```python
from sklearn.linear_model import LinearRegression
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

lr = LinearRegression()
lr.fit(X_train, y_train)

print("Training set R²:", lr.score(X_train, y_train))
print("Test set R²:", lr.score(X_test, y_test))
print("Koefisien:", lr.coef_)
print("Intercept:", lr.intercept_)
```

**Formula:** `y_pred = w[0]*x[0] + w[1]*x[1] + ... + w[p]*x[p] + b`

### Ridge Regression (Regularisasi L2)

Ridge regression menambahkan penalti pada koefisien yang terlalu besar. Berguna ketika ada banyak fitur atau fitur yang berkorelasi tinggi.

```python
from sklearn.linear_model import Ridge

ridge = Ridge(alpha=10)  # alpha besar = regularisasi lebih kuat
ridge.fit(X_train, y_train)

print("Training R²:", ridge.score(X_train, y_train))
print("Test R²:", ridge.score(X_test, y_test))

# Bandingkan: alpha=0.1 vs alpha=1 vs alpha=10
for alpha in [0.1, 1, 10, 100]:
    ridge = Ridge(alpha=alpha)
    ridge.fit(X_train, y_train)
    print(f"alpha={alpha}: train={ridge.score(X_train, y_train):.3f}, "
          f"test={ridge.score(X_test, y_test):.3f}")
```

**Trade-off alpha:**
- `alpha` kecil → mendekati LinearRegression (bisa overfit)
- `alpha` besar → model lebih sederhana (bisa underfit)

### Lasso Regression (Regularisasi L1)

Lasso juga melakukan regularisasi, tapi bisa menghasilkan koefisien 0 (feature selection otomatis).

```python
from sklearn.linear_model import Lasso

lasso = Lasso(alpha=0.01, max_iter=10000)
lasso.fit(X_train, y_train)

print("Training R²:", lasso.score(X_train, y_train))
print("Test R²:", lasso.score(X_test, y_test))
print("Features digunakan:", np.sum(lasso.coef_ != 0))
```

**Kapan pakai apa:**
- Banyak fitur, tapi hanya beberapa yang relevan → **Lasso**
- Semua fitur berkontribusi sedikit → **Ridge**

### Logistic Regression (Klasifikasi)

Meskipun namanya "regression", ini adalah algoritma klasifikasi:

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, stratify=cancer.target, random_state=42)

logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train, y_train)

print("Training score:", logreg.score(X_train, y_train))
print("Test score:", logreg.score(X_test, y_test))

# Parameter C (inverse regularization):
# C kecil → regularisasi kuat → model sederhana
# C besar → regularisasi lemah → model kompleks
logreg100 = LogisticRegression(C=100, max_iter=1000)
logreg100.fit(X_train, y_train)
print("C=100 test score:", logreg100.score(X_test, y_test))
```

### Linear SVC (Klasifikasi Linear)

```python
from sklearn.svm import LinearSVC

linear_svm = LinearSVC(max_iter=5000)
linear_svm.fit(X_train, y_train)
print("Test score:", linear_svm.score(X_test, y_test))
```

### Kapan Pakai Linear Models

**Kelebihan:**
- Cepat untuk training dan prediksi
- Bekerja baik untuk dataset besar
- Interpretable (koefisien menunjukkan pentingnya fitur)
- Efektif untuk high-dimensional data (teks, genomics)

**Kekurangan:**
- Tidak bisa menangkap hubungan non-linear
- Perlu feature scaling untuk performa optimal



## Decision Trees

Decision trees belajar dengan mengajukan serangkaian pertanyaan tentang fitur.

### Decision Tree Dasar

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=42)

tree = DecisionTreeClassifier(random_state=0)
tree.fit(X_train, y_train)

print("Training accuracy:", tree.score(X_train, y_train))
print("Test accuracy:", tree.score(X_test, y_test))
# Tanpa pembatasan depth: 100% train, ~93% test (overfitting)
```

### Kontrol Kedalaman Tree

```python
# Batasi kedalaman untuk menghindari overfitting
tree = DecisionTreeClassifier(max_depth=4, random_state=0)
tree.fit(X_train, y_train)

print("Training accuracy:", tree.score(X_train, y_train))  # ~98%
print("Test accuracy:", tree.score(X_test, y_test))         # ~94%
```

### Visualisasi Decision Tree

```python
from sklearn.tree import export_graphviz
import graphviz

export_graphviz(tree, out_file="tree.dot",
                class_names=["malignant", "benign"],
                feature_names=cancer.feature_names,
                impurity=False, filled=True)

# Buka tree.dot dengan graphviz atau Jupyter
with open("tree.dot") as f:
    dot_graph = f.read()
display(graphviz.Source(dot_graph))
```

### Feature Importance

```python
# Seberapa penting setiap fitur untuk prediksi
print("Feature importances:")
for name, score in zip(cancer.feature_names, tree.feature_importances_):
    if score > 0.01:
        print(f"  {name}: {score:.3f}")
```

### Pre-Pruning vs Post-Pruning

**Pre-pruning** (lebih umum di scikit-learn):
```python
# Batasi dengan berbagai parameter
tree_params = {
    'max_depth': 4,          # kedalaman maksimal
    'max_leaf_nodes': 5,     # jumlah daun maksimal
    'min_samples_leaf': 4,   # min samples di daun
    'min_samples_split': 10  # min samples untuk split
}
tree = DecisionTreeClassifier(**tree_params)
```

### Decision Tree untuk Regresi

```python
from sklearn.tree import DecisionTreeRegressor

reg = DecisionTreeRegressor(max_depth=3)
reg.fit(X_train, y_train)
print("R²:", reg.score(X_test, y_test))
```

### Kelebihan & Kekurangan Decision Tree

**Kelebihan:**
- Hasil model mudah divisualisasikan dan dijelaskan
- Tidak butuh normalisasi data
- Bisa handle fitur kategorik

**Kekurangan:**
- Sangat rentan overfitting
- Tidak stabil (perubahan kecil data = tree berbeda)
- Performa biasanya kalah dari ensemble methods



## Random Forests

Random Forest adalah kumpulan banyak decision tree yang berbeda. Setiap tree belajar dari subset data yang di-sample secara acak (*bootstrap*) dan subset fitur yang acak.

### Random Forest Klasifikasi

```python
from sklearn.ensemble import RandomForestClassifier

forest = RandomForestClassifier(n_estimators=100, random_state=0)
forest.fit(X_train, y_train)

print("Training accuracy:", forest.score(X_train, y_train))
print("Test accuracy:", forest.score(X_test, y_test))
# Biasanya lebih baik dari single decision tree
```

### Parameter Penting Random Forest

```python
forest = RandomForestClassifier(
    n_estimators=100,    # jumlah trees (lebih banyak lebih baik, tapi lebih lambat)
    max_features='sqrt', # √n_features untuk klasifikasi (default)
    max_depth=None,      # biarkan trees tumbuh penuh
    n_jobs=-1,           # pakai semua CPU
    random_state=42
)
```

**Trade-off n_estimators:**
- Lebih banyak trees → lebih akurat, lebih lambat
- Biasanya diminishing returns setelah ~100-200 trees

### Feature Importance dari Random Forest

```python
# Lebih stabil dari single tree
print("Feature importances (Random Forest):")
importances = forest.feature_importances_
indices = np.argsort(importances)[::-1]

for i in range(10):  # top 10 features
    print(f"{cancer.feature_names[indices[i]]}: "
          f"{importances[indices[i]]:.3f}")
```

### Random Forest untuk Regresi

```python
from sklearn.ensemble import RandomForestRegressor

reg_forest = RandomForestRegressor(n_estimators=100, random_state=42)
reg_forest.fit(X_train, y_train)
print("R²:", reg_forest.score(X_test, y_test))
```



## Gradient Boosting

Gradient Boosting juga menggunakan banyak decision tree, tapi berbeda dari Random Forest. Trees dibangun secara **sequential** — setiap tree belajar dari **kesalahan tree sebelumnya**.

### Gradient Boosting Klasifikasi

```python
from sklearn.ensemble import GradientBoostingClassifier

gbrt = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    random_state=0
)
gbrt.fit(X_train, y_train)

print("Training accuracy:", gbrt.score(X_train, y_train))
print("Test accuracy:", gbrt.score(X_test, y_test))
```

### Parameter Penting

```python
# learning_rate vs n_estimators trade-off
# Learning rate kecil + n_estimators besar = lebih baik tapi lebih lambat

gbrt_slow = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.01,  # lebih lambat belajar
    max_depth=3,
    random_state=0
)
# Biasanya butuh lebih banyak estimators untuk learning rate kecil
```

### Random Forest vs Gradient Boosting

| Aspek | Random Forest | Gradient Boosting |
|-------|--------------|-------------------|
| Training | Paralel (cepat) | Sequential (lambat) |
| Parameter | Lebih sedikit | Lebih banyak |
| Tuning | Lebih mudah | Perlu lebih hati-hati |
| Performa | Sangat baik | Seringkali lebih baik |
| Overfitting | Lebih tahan | Lebih rentan |
| Kapan | Default choice | Perlu akurasi maksimal |



## Cara Memilih Algoritma

Panduan praktis dari buku:

```
Dataset tersedia → Mulai eksplorasi

Apakah fitur input perlu dipahami manusia?
├─ Ya → Linear Model atau Decision Tree
└─ Tidak → lanjut...

Ukuran dataset?
├─ Kecil (<10K samples) → k-NN, SVM, Linear Model
└─ Besar (>100K samples) → Random Forest, Gradient Boosting

Butuh akurasi terbaik?
├─ Ya → Gradient Boosting (XGBoost/LightGBM)
└─ Cukup baik → Random Forest (lebih mudah di-tune)

Interpretabilitas penting?
├─ Ya → Logistic Regression, Decision Tree
└─ Tidak → Random Forest, Neural Network
```

### Checklist Praktis

1. **Mulai sederhana** — k-NN atau Logistic Regression sebagai baseline
2. **Coba Random Forest** — biasanya memberikan performa bagus tanpa banyak tuning
3. **Pertimbangkan Gradient Boosting** — jika butuh akurasi lebih tinggi
4. **Feature scaling** — penting untuk k-NN, Linear Models, SVM; tidak perlu untuk tree-based
5. **Cross-validation** — jangan hanya pakai satu train/test split



**Sumber:** Andreas C. Müller & Sarah Guido, *Introduction to Machine Learning with Python* (2017), O'Reilly Media. Chapter 2.
