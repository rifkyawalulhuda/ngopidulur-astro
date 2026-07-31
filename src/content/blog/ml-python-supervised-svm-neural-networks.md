---
title: "Supervised Learning Python: SVM, Neural Networks, dan Evaluasi"
description: Panduan lengkap SVM kernel trick, Neural Networks dengan MLPClassifier,
  estimasi probabilitas, ketidakpastian prediksi, dan multi-output classification
  dengan contoh kode scikit-learn Python yang komprehensif.
pubDate: 2026-09-10T08:00:00.000Z
image: /image/ml-python-oreilly-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - Python
  - ScikitLearn
  - NeuralNetwork
series: "Machine Learning dengan Python"
seriesOrder: 3
---

Melanjutkan Chapter 2 dari *Introduction to Machine Learning with Python*, kita bahas algoritma yang lebih canggih: Support Vector Machines (SVM) dengan kernel trick, Neural Networks, dan cara mendapatkan probabilitas prediksi dari model.

## Daftar Isi

- [Naive Bayes Classifiers](#naive-bayes-classifiers)
- [Support Vector Machines (SVM)](#support-vector-machines-svm)
- [Kernel SVM](#kernel-svm)
- [Neural Networks (Deep Learning)](#neural-networks-deep-learning)
- [Estimasi Ketidakpastian Model](#estimasi-ketidakpastian-model)
- [Ringkasan Semua Algoritma Supervised](#ringkasan-semua-algoritma-supervised)



## Naive Bayes Classifiers

Naive Bayes adalah klasifikasi probabilistik berdasarkan Teorema Bayes dengan asumsi independensi antar fitur.

```python
from sklearn.naive_bayes import GaussianNB, BernoulliNB, MultinomialNB
import numpy as np

# GaussianNB — untuk fitur kontinu
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

gnb = GaussianNB()
gnb.fit(X_train, y_train)
print("Accuracy:", gnb.score(X_test, y_test))  # ~94%

# BernoulliNB — untuk fitur biner (cocok untuk teks dengan TF biner)
# MultinomialNB — untuk fitur count (cocok untuk teks TF-IDF)
```

**Kapan pakai Naive Bayes:**
- **GaussianNB** — data kontinu, distribusi mendekati Gaussian
- **BernoulliNB** — data biner (ada/tidak ada)
- **MultinomialNB** — data count (word count)
- Sangat cepat untuk train dan predict
- Bekerja baik untuk text classification
- Performa sedikit lebih rendah dari model lain karena asumsi independensi



## Support Vector Machines (SVM)

SVM mencari **hyperplane** yang memisahkan kelas dengan margin terbesar.

### Linear SVM

```python
from sklearn.svm import LinearSVC, SVC
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

# PENTING: SVM sensitif terhadap feature scaling!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Linear SVM
linear_svm = LinearSVC(max_iter=10000)
linear_svm.fit(X_train_scaled, y_train)
print("Linear SVC:", linear_svm.score(X_test_scaled, y_test))
```

### Parameter C

Parameter `C` mengontrol keseimbangan antara margin lebar dan klasifikasi yang benar:

```python
# C kecil = margin lebih lebar, lebih toleran terhadap misclassification
# C besar = margin lebih sempit, berusaha classify semua benar (bisa overfit)

for C in [0.001, 0.01, 0.1, 1, 10, 100]:
    svm = SVC(kernel='linear', C=C)
    svm.fit(X_train_scaled, y_train)
    print(f"C={C}: train={svm.score(X_train_scaled, y_train):.3f}, "
          f"test={svm.score(X_test_scaled, y_test):.3f}")
```



## Kernel SVM

Kernel SVM memungkinkan SVM untuk memisahkan kelas yang **tidak bisa dipisahkan secara linear** dengan memproyeksikan data ke dimensi yang lebih tinggi.

### Mengapa Kernel Trick?

```python
import numpy as np
import matplotlib.pyplot as plt

# Data yang tidak bisa dipisahkan secara linear (circular pattern)
from sklearn.datasets import make_circles

X, y = make_circles(noise=0.1, factor=0.5, random_state=1)

# Linear SVM gagal:
linear_svm = SVC(kernel='linear').fit(X, y)
print("Linear SVM:", linear_svm.score(X, y))  # ~50-60%

# Kernel RBF berhasil:
rbf_svm = SVC(kernel='rbf', C=10, gamma=0.1)
rbf_svm.fit(X, y)
print("RBF SVM:", rbf_svm.score(X, y))  # ~100%
```

### Parameter Kernel RBF

```python
# C = parameter regularisasi (sama seperti linear)
# gamma = lebar kernel RBF
#   - gamma kecil = kernel lebar, model lebih smooth (underfitting)
#   - gamma besar = kernel sempit, model lebih kompleks (overfitting)

from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Default settings (C=1, gamma='scale')
svm = SVC(kernel='rbf', random_state=42)
svm.fit(X_train_scaled, y_train)
print("Default SVM:", svm.score(X_test_scaled, y_test))

# Tuned settings
svm_tuned = SVC(kernel='rbf', C=10, gamma=0.1)
svm_tuned.fit(X_train_scaled, y_train)
print("Tuned SVM:", svm_tuned.score(X_test_scaled, y_test))
```

### Kapan Pakai Kernel SVM

**Kelebihan:**
- Bekerja baik pada dataset sedang (few thousand samples)
- Efektif pada high-dimensional data
- Powerful dengan kernel yang tepat

**Kekurangan:**
- Sangat sensitif terhadap preprocessing (feature scaling WAJIB)
- Lambat untuk dataset besar (>100K samples)
- Butuh tuning C dan gamma yang teliti
- Output tidak mudah diinterpretasikan



## Neural Networks (Deep Learning)

scikit-learn menyediakan `MLPClassifier` dan `MLPRegressor` — implementasi feed-forward neural network.

### Neural Network Dasar

```python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

# PENTING: Neural network juga butuh feature scaling!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Default: 1 hidden layer dengan 100 units
mlp = MLPClassifier(random_state=42, max_iter=1000)
mlp.fit(X_train_scaled, y_train)

print("Training accuracy:", mlp.score(X_train_scaled, y_train))
print("Test accuracy:", mlp.score(X_test_scaled, y_test))
```

### Mengatur Arsitektur

```python
# hidden_layer_sizes = tuple ukuran setiap hidden layer
# (100,) = 1 layer dengan 100 units
# (100, 100) = 2 layers, masing-masing 100 units

# Network yang lebih dalam
mlp_deep = MLPClassifier(
    hidden_layer_sizes=(100, 100),  # 2 hidden layers
    activation='relu',              # ReLU (default)
    solver='adam',                  # optimizer (default)
    alpha=0.001,                    # L2 regularization
    max_iter=1000,
    random_state=42
)
mlp_deep.fit(X_train_scaled, y_train)
print("Deep MLP:", mlp_deep.score(X_test_scaled, y_test))
```

### Parameter Penting MLP

```python
# Activation functions
for activation in ['relu', 'tanh', 'logistic']:
    mlp = MLPClassifier(
        hidden_layer_sizes=(100,),
        activation=activation,
        max_iter=1000,
        random_state=42
    )
    mlp.fit(X_train_scaled, y_train)
    print(f"activation={activation}: {mlp.score(X_test_scaled, y_test):.4f}")

# alpha (regularization)
# alpha kecil → model kompleks (bisa overfit)
# alpha besar → model sederhana (bisa underfit)
for alpha in [0.0001, 0.001, 0.01, 0.1]:
    mlp = MLPClassifier(alpha=alpha, max_iter=1000, random_state=42)
    mlp.fit(X_train_scaled, y_train)
    print(f"alpha={alpha}: train={mlp.score(X_train_scaled, y_train):.3f}, "
          f"test={mlp.score(X_test_scaled, y_test):.3f}")
```

### Neural Network untuk Regresi

```python
from sklearn.neural_network import MLPRegressor

# Sama dengan klasifikasi, tapi MLPRegressor
reg = MLPRegressor(
    hidden_layer_sizes=(100, 100),
    activation='relu',
    max_iter=1000,
    random_state=42
)
reg.fit(X_train_scaled, y_train)
print("R²:", reg.score(X_test_scaled, y_test))
```



## Estimasi Ketidakpastian Model

Seringkali kita tidak hanya butuh prediksi, tapi juga **seberapa yakin** model terhadap prediksinya.

### Decision Function

```python
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, random_state=42)

svm = SVC(kernel='rbf', C=5, gamma=0.1)
svm.fit(X_train, y_train)

# decision_function: skor seberapa jauh dari hyperplane
# Nilai positif = confident pada kelas positif
# Nilai negatif = confident pada kelas negatif
scores = svm.decision_function(X_test)
print("Decision function shape:", scores.shape)
print("Sample scores:", scores[:5])
```

### Predict Proba — Probabilitas Kelas

```python
# probability=True untuk mendapatkan probabilitas
svm_prob = SVC(kernel='rbf', probability=True)
svm_prob.fit(X_train, y_train)

probabilities = svm_prob.predict_proba(X_test)
print("Probability shape:", probabilities.shape)
# Shape: (n_samples, n_classes)

# Setiap baris = probabilitas untuk setiap kelas
# Jumlah per baris = 1.0
print("Sample probabilities:")
print(probabilities[:3])
```

### Contoh Praktis: Identifikasi Prediksi Tidak Yakin

```python
from sklearn.linear_model import LogisticRegression
import numpy as np

logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train, y_train)

proba = logreg.predict_proba(X_test)
predictions = logreg.predict(X_test)

# Cari prediksi dengan confidence rendah (< 70%)
max_proba = np.max(proba, axis=1)
uncertain_mask = max_proba < 0.7

print(f"Prediksi dengan confidence < 70%: {uncertain_mask.sum()}")
print("Indeks:", np.where(uncertain_mask)[0])
print("Max probabilities:", max_proba[uncertain_mask])
```



## Ringkasan Semua Algoritma Supervised

Perbandingan lengkap dari buku:

| Algoritma | Scaling | n_features | Dataset besar | Interpretable |
|-----------|---------|-----------|--------------|---------------|
| k-NN | Ya | Rendah | Tidak | Sedang |
| Linear Model | Untuk SVM | Semua | Ya | Ya |
| Naive Bayes | Tidak | Semua | Ya | Ya |
| Decision Tree | Tidak | Semua | Sedang | Ya |
| Random Forest | Tidak | Semua | Sedang | Sedang |
| Gradient Boosting | Tidak | Semua | Sedang | Sedang |
| SVM | Ya | Medium | Tidak | Tidak |
| Neural Network | Ya | Semua | Sedang | Tidak |

### Panduan Pemilihan Cepat

```
Dataset kecil (<1000 samples)?
├─ Ya → k-NN, Naive Bayes, SVM, Logistic Regression
└─ Tidak ↓

Butuh interpretabilitas?
├─ Ya → Logistic/Linear Regression, Decision Tree
└─ Tidak ↓

Waktu training tidak terbatas?
├─ Ya → Gradient Boosting, Neural Network
└─ Tidak → Random Forest (default choice untuk performa bagus)
```



**Sumber:** Andreas C. Müller & Sarah Guido, *Introduction to Machine Learning with Python* (2017), O'Reilly Media. Chapter 2.
