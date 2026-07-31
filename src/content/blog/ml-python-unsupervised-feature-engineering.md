---
title: "Unsupervised Learning dan Feature Engineering dengan Python"
description: Panduan lengkap unsupervised learning scikit-learn - PCA dimensionality
  reduction, NMF, t-SNE, k-Means clustering, DBSCAN, Agglomerative Clustering,
  plus feature engineering binning, interactions, dan automatic feature selection.
pubDate: 2026-09-11T08:00:00.000Z
image: /image/ml-python-oreilly-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - Python
  - UnsupervisedLearning
  - FeatureEngineering
series: "Machine Learning dengan Python"
seriesOrder: 4
---

Chapter 3 dan 4 dari *Introduction to Machine Learning with Python* membahas dua topik yang saling melengkapi: **unsupervised learning** untuk menemukan struktur dalam data tanpa label, dan **feature engineering** untuk merepresentasikan data dengan cara yang lebih bermakna bagi model ML.

## Daftar Isi

- [Preprocessing dan Scaling](#preprocessing-dan-scaling)
- [PCA: Principal Component Analysis](#pca-principal-component-analysis)
- [NMF: Non-Negative Matrix Factorization](#nmf-non-negative-matrix-factorization)
- [t-SNE: Manifold Learning](#t-sne-manifold-learning)
- [Clustering: k-Means](#clustering-k-means)
- [DBSCAN](#dbscan)
- [Agglomerative Clustering](#agglomerative-clustering)
- [Feature Engineering](#feature-engineering)
- [Automatic Feature Selection](#automatic-feature-selection)



## Preprocessing dan Scaling

Sebelum membahas unsupervised learning, penting memahami preprocessing data.

### Kenapa Scaling Penting?

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import numpy as np

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=1)

print("Data range per feature (unscaled):")
print("Min:", X_train.min(axis=0)[:5])
print("Max:", X_train.max(axis=0)[:5])
# Rentang sangat berbeda: beberapa 0-1, yang lain 0-1000
```

### StandardScaler

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
# fit hanya pada training data!
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # transform saja, tidak fit

print("Mean setelah scaling:", X_train_scaled.mean(axis=0)[:5])  # ~0
print("Std setelah scaling:", X_train_scaled.std(axis=0)[:5])   # ~1
```

### MinMaxScaler

```python
from sklearn.preprocessing import MinMaxScaler

min_max = MinMaxScaler()
X_train_mm = min_max.fit_transform(X_train)
# Semua nilai antara 0 dan 1
```

### RobustScaler

```python
from sklearn.preprocessing import RobustScaler
# Bagus untuk data dengan banyak outlier
# Menggunakan median dan quartile, bukan mean dan std
robust = RobustScaler()
X_train_robust = robust.fit_transform(X_train)
```

### Normalizer

```python
from sklearn.preprocessing import Normalizer
# Membuat setiap baris (sample) memiliki panjang vektor = 1
# Berguna untuk text data, tidak untuk feature-based data
normalizer = Normalizer()
X_norm = normalizer.fit_transform(X_train)
```



## PCA: Principal Component Analysis

PCA adalah teknik dimensionality reduction yang paling populer. Ia menemukan arah variansi terbesar dalam data.

### PCA untuk Visualisasi

```python
from sklearn.decomposition import PCA
from sklearn.datasets import load_breast_cancer
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
scaler = StandardScaler()
X_scaled = scaler.fit_transform(cancer.data)

# Reduksi ke 2 komponen untuk visualisasi
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print("Shape asli:", cancer.data.shape)      # (569, 30)
print("Shape setelah PCA:", X_pca.shape)     # (569, 2)

# Visualisasi
plt.figure(figsize=(8, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1],
            c=cancer.target, cmap='Accent', alpha=0.8)
plt.xlabel("PC 1")
plt.ylabel("PC 2")
plt.colorbar()
plt.title("PCA - Breast Cancer Dataset")
plt.show()
```

### Explained Variance Ratio

```python
# Berapa banyak informasi yang dipertahankan?
print("Explained variance ratio:", pca.explained_variance_ratio_)
print("Total variance retained:", pca.explained_variance_ratio_.sum())

# Scree plot untuk pilih jumlah komponen
pca_full = PCA()
pca_full.fit(X_scaled)

plt.plot(np.cumsum(pca_full.explained_variance_ratio_))
plt.xlabel("Number of components")
plt.ylabel("Cumulative explained variance")
plt.grid(True)
plt.show()
```

### PCA untuk Preprocessing

```python
from sklearn.linear_model import LogisticRegression

# Tanpa PCA
clf = LogisticRegression(max_iter=1000)
clf.fit(X_scaled, cancer.target)
print("Full features score:", clf.score(X_scaled, cancer.target))

# Dengan PCA (retain 95% variance)
pca_95 = PCA(n_components=0.95)
X_pca_95 = pca_95.fit_transform(X_scaled)
print("Components untuk 95%:", pca_95.n_components_)

clf_pca = LogisticRegression(max_iter=1000)
clf_pca.fit(X_pca_95, cancer.target)
print("PCA score:", clf_pca.score(X_pca_95, cancer.target))
```

### PCA untuk Eigenfaces (Face Recognition)

```python
from sklearn.datasets import fetch_lfw_people
from sklearn.decomposition import PCA

# Load wajah orang terkenal
people = fetch_lfw_people(min_faces_per_person=20, resize=0.7)
print("Image shape:", people.images.shape)

# PCA dengan whitening
pca_faces = PCA(n_components=100, whiten=True, random_state=0)
pca_faces.fit(people.data)

# Visualisasi eigenfaces
fig, axes = plt.subplots(3, 5, figsize=(15, 12))
for i, (component, ax) in enumerate(zip(pca_faces.components_, axes.ravel())):
    ax.imshow(component.reshape(people.images.shape[1:]), cmap='viridis')
    ax.set_title(f"PC {i+1}")
    ax.axis('off')
plt.show()
```



## NMF: Non-Negative Matrix Factorization

NMF memfaktorkan data menjadi komponen non-negatif. Berguna untuk data yang secara alami non-negatif (gambar, teks, audio).

```python
from sklearn.decomposition import NMF
from sklearn.datasets import fetch_lfw_people

people = fetch_lfw_people(min_faces_per_person=20, resize=0.7)
X = people.data / 255.0  # normalisasi ke [0,1]

# NMF dengan 15 komponen
nmf = NMF(n_components=15, random_state=0)
X_nmf = nmf.fit_transform(X)

# Visualisasi komponen
fig, axes = plt.subplots(3, 5, figsize=(15, 12))
for i, (component, ax) in enumerate(zip(nmf.components_, axes.ravel())):
    ax.imshow(component.reshape(people.images.shape[1:]))
    ax.set_title(f"Component {i+1}")
    ax.axis('off')
plt.show()

# Perbedaan NMF vs PCA:
# - NMF: komponen non-negatif, interpretable (bagian dari wajah)
# - PCA: komponen bisa negatif, arah variansi global
```



## t-SNE: Manifold Learning

t-SNE adalah teknik non-linear dimensionality reduction, sangat bagus untuk visualisasi tapi tidak bisa dipakai untuk preprocessing.

```python
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits

digits = load_digits()

# t-SNE hanya ke 2D, hanya untuk visualisasi
tsne = TSNE(random_state=42)
digits_tsne = tsne.fit_transform(digits.data)

# Visualisasi 10 kelas digit
colors = ["#476A2A", "#7851B8", "#BD3430", "#4A2D4E",
          "#875525", "#A83683", "#4E655E", "#853541",
          "#3A3120", "#535D8E"]

plt.figure(figsize=(10, 10))
for i in range(len(digits.data)):
    plt.text(digits_tsne[i, 0], digits_tsne[i, 1],
             str(digits.target[i]),
             color=colors[digits.target[i]],
             fontdict={'size': 9})
plt.xlabel("t-SNE feature 1")
plt.ylabel("t-SNE feature 2")
plt.title("t-SNE Visualization of Digits Dataset")
plt.show()
```

**Catatan penting tentang t-SNE:**
- **Tidak bisa** dipakai untuk transform data baru (hanya fit_transform)
- Tidak cocok untuk preprocessing (bukan bijective transformation)
- Sangat bagus untuk visualisasi dan eksplorasi data
- Lebih lambat dari PCA



## Clustering: k-Means

k-Means membagi data menjadi k kluster dengan meminimalkan inertia (jarak ke centroid).

### k-Means Dasar

```python
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import numpy as np

# Buat data dengan 3 kluster yang jelas
X, y = make_blobs(n_samples=300, centers=3, random_state=42)

kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

print("Cluster labels:", kmeans.labels_[:10])
print("Cluster centers:", kmeans.cluster_centers_)
print("Inertia:", kmeans.inertia_)  # semakin kecil semakin baik

# Prediksi kluster untuk data baru
X_new = np.array([[0, 0], [5, 5]])
print("New predictions:", kmeans.predict(X_new))
```

### Memilih Jumlah Kluster: Elbow Method

```python
inertias = []
k_values = range(1, 11)

for k in k_values:
    km = KMeans(n_clusters=k, random_state=42)
    km.fit(X)
    inertias.append(km.inertia_)

plt.plot(k_values, inertias, 'bx-')
plt.xlabel('k')
plt.ylabel('Inertia')
plt.title('Elbow Method — Optimal k')
plt.grid(True)
plt.show()
# Cari "siku" — titik di mana penurunan inertia mulai melambat
```

### Silhouette Score

```python
from sklearn.metrics import silhouette_score

# Silhouette score: -1 (buruk) hingga +1 (sempurna)
for k in range(2, 11):
    km = KMeans(n_clusters=k, random_state=42)
    labels = km.fit_predict(X)
    score = silhouette_score(X, labels)
    print(f"k={k}: silhouette={score:.3f}")
```

### Keterbatasan k-Means

```python
# k-Means gagal untuk kluster non-circular
from sklearn.datasets import make_moons

X_moons, _ = make_moons(n_samples=200, noise=0.05, random_state=42)
km_moons = KMeans(n_clusters=2, random_state=42)
km_moons.fit(X_moons)

# Hasilnya buruk karena kluster berbentuk bulan sabit
# Solusi: gunakan DBSCAN atau Spectral Clustering
```



## DBSCAN

DBSCAN (Density-Based Spatial Clustering of Applications with Noise) menemukan kluster berdasarkan density. Tidak butuh menentukan jumlah kluster di awal dan bisa mendeteksi outlier.

```python
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler

X, y = make_moons(n_samples=200, noise=0.05, random_state=42)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

dbscan = DBSCAN(eps=0.2, min_samples=5)
labels = dbscan.fit_predict(X_scaled)

print("Unique labels:", np.unique(labels))
# -1 = noise/outlier
# 0, 1, ... = kluster

print("Points per cluster:")
for label in np.unique(labels):
    mask = labels == label
    print(f"  Cluster {label}: {mask.sum()} points")
```

### Parameter DBSCAN

```python
# eps = jarak maksimal antara dua samples untuk dianggap neighbor
# min_samples = jumlah minimum samples dalam eps-neighborhood

# eps kecil → banyak kluster kecil, banyak outlier
# eps besar → sedikit kluster besar

for eps in [0.1, 0.2, 0.5, 1.0]:
    db = DBSCAN(eps=eps)
    labels = db.fit_predict(X_scaled)
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = list(labels).count(-1)
    print(f"eps={eps}: {n_clusters} clusters, {n_noise} noise points")
```



## Agglomerative Clustering

Agglomerative clustering membangun hierarki kluster dari bawah ke atas.

```python
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, ward

X, y = make_blobs(n_samples=12, random_state=42)

# Buat dendrogram
linkage_array = ward(X)

plt.figure(figsize=(10, 5))
dendrogram(linkage_array)
plt.xlabel("Sample index")
plt.ylabel("Cluster distance")
plt.title("Hierarchical Clustering Dendrogram")
plt.show()

# Potong di jumlah kluster tertentu
agg = AgglomerativeClustering(n_clusters=3)
labels = agg.fit_predict(X)
print("Cluster assignments:", labels)
```



## Feature Engineering

Feature engineering adalah seni menciptakan representasi data yang lebih baik untuk model ML.

### Binning (Discretization)

```python
from sklearn.preprocessing import KBinsDiscretizer
import numpy as np

# Contoh: umur sebagai fitur kontinu
ages = np.array([25, 32, 45, 18, 60, 35, 22, 50]).reshape(-1, 1)

# Bagi menjadi 4 bins
binner = KBinsDiscretizer(n_bins=4, strategy='uniform', encode='onehot-dense')
ages_binned = binner.fit_transform(ages)
print("Binned ages:")
print(ages_binned)
# [0, 18] [18, 31.5] [31.5, 45] [45, 60]

# strategy options:
# 'uniform': sama lebar
# 'quantile': sama banyak sample
# 'kmeans': berdasarkan k-means
```

### Interaksi dan Polynomial Features

```python
from sklearn.preprocessing import PolynomialFeatures

X = np.array([[3, 2], [4, 5], [1, 8]])

# Polynomial degree 2
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

print("Original features:", X.shape)   # (3, 2)
print("Poly features:", X_poly.shape)  # (3, 5): x1, x2, x1^2, x1*x2, x2^2

print("Feature names:", poly.get_feature_names_out(['x1', 'x2']))
# ['x1', 'x2', 'x1^2', 'x1 x2', 'x2^2']
```

### Transformasi Non-Linear

```python
import numpy as np
from sklearn.preprocessing import FunctionTransformer

# Log transform untuk fitur dengan distribusi right-skewed
X_skewed = np.array([[1000, 5], [50, 30], [500, 2], [1, 100]])

# Log1p = log(1 + x) — menghindari log(0)
log_transform = FunctionTransformer(np.log1p)
X_log = log_transform.fit_transform(X_skewed)

print("Original:", X_skewed)
print("Log-transformed:", X_log)
```

### One-Hot Encoding

```python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

# Data kategorik
data = pd.DataFrame({
    'city': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta'],
    'gender': ['M', 'F', 'M', 'F']
})

ohe = OneHotEncoder(sparse_output=False)
encoded = ohe.fit_transform(data)

print("Feature names:", ohe.get_feature_names_out())
print("Encoded shape:", encoded.shape)
```



## Automatic Feature Selection

scikit-learn menyediakan tools untuk otomatis memilih fitur yang paling relevan.

### Univariate Selection

```python
from sklearn.feature_selection import SelectPercentile, f_classif
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

# Pilih top 50% fitur terbaik berdasarkan F-test
selector = SelectPercentile(score_func=f_classif, percentile=50)
X_train_selected = selector.fit_transform(X_train, y_train)
X_test_selected = selector.transform(X_test)

print(f"Original: {X_train.shape[1]} features")
print(f"Selected: {X_train_selected.shape[1]} features")

# Fitur yang dipilih
print("Mask:", selector.get_support())
```

### Model-Based Feature Selection

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestClassifier

# Pilih fitur berdasarkan feature importance dari Random Forest
selector_rf = SelectFromModel(
    RandomForestClassifier(n_estimators=100, random_state=42),
    threshold='median'
)
X_train_rf = selector_rf.fit_transform(X_train, y_train)
X_test_rf = selector_rf.transform(X_test)

print(f"RF selected: {X_train_rf.shape[1]} features")
```

### Recursive Feature Elimination (RFE)

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression

rfe = RFE(estimator=LogisticRegression(max_iter=1000), n_features_to_select=10)
rfe.fit(X_train, y_train)

print("Selected features mask:", rfe.support_)
print("Feature ranking:", rfe.ranking_)
# ranking = 1 untuk fitur yang dipilih
```



**Sumber:** Andreas C. Müller & Sarah Guido, *Introduction to Machine Learning with Python* (2017), O'Reilly Media. Chapter 3 & 4.
