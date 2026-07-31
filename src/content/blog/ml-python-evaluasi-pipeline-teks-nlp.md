---
title: "Evaluasi Model, Pipeline, dan Pemrosesan Teks dengan scikit-learn"
description: Panduan lengkap evaluasi model ML scikit-learn - cross-validation,
  metrics klasifikasi regresi, pipeline preprocessing, grid search hyperparameter
  tuning, dan pemrosesan teks NLP dengan CountVectorizer TF-IDF scikit-learn.
pubDate: 2026-09-12T08:00:00.000Z
image: /image/ml-python-oreilly-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - Python
  - ScikitLearn
  - NLP
series: "Machine Learning dengan Python"
seriesOrder: 5
---

Chapter 5, 6, dan 7 dari *Introduction to Machine Learning with Python* membahas topik-topik yang membuat model ML benar-benar production-ready: cara mengevaluasi model dengan benar, membangun pipeline yang bersih, dan memproses data teks. Ini adalah chapter yang sering diabaikan pemula tapi krusial untuk hasil yang dapat diandalkan.

## Daftar Isi

- [Cross-Validation](#cross-validation)
- [Metrics Evaluasi Model](#metrics-evaluasi-model)
- [Hyperparameter Tuning: Grid Search](#hyperparameter-tuning-grid-search)
- [Pipeline: Menyatukan Preprocessing dan Model](#pipeline-menyatukan-preprocessing-dan-model)
- [Pemrosesan Teks: Bag of Words](#pemrosesan-teks-bag-of-words)
- [TF-IDF](#tf-idf)
- [Ringkasan Seri](#ringkasan-seri)



## Cross-Validation

Train/test split tunggal bisa memberikan hasil yang menyesatkan. Cross-validation memberikan estimasi yang lebih handal.

### k-Fold Cross-Validation

```python
from sklearn.model_selection import cross_val_score
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

iris = load_iris()

logreg = LogisticRegression(max_iter=1000)

# 5-fold cross-validation
scores = cross_val_score(logreg, iris.data, iris.target, cv=5)
print("CV scores:", scores)
print("Mean:", scores.mean())
print("Std:", scores.std())
# CV scores: [0.967 1.    0.933 0.967 1.   ]
# Mean: 0.973, Std: 0.024
```

### Stratified k-Fold

```python
from sklearn.model_selection import StratifiedKFold, KFold
import numpy as np

# Stratified: setiap fold punya distribusi kelas yang sama
# Penting untuk imbalanced dataset

stratified_kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_val_score(logreg, iris.data, iris.target,
                         cv=stratified_kfold)
print("Stratified CV:", scores.mean())
```

### Leave-One-Out (LOO)

```python
from sklearn.model_selection import LeaveOneOut

loo = LeaveOneOut()
scores = cross_val_score(logreg, iris.data, iris.target, cv=loo)
print("LOO mean:", scores.mean())
# Lebih reliable tapi jauh lebih lambat
# Cocok hanya untuk dataset kecil
```

### Shuffle-Split

```python
from sklearn.model_selection import ShuffleSplit

shuffle_split = ShuffleSplit(test_size=0.5, train_size=0.5, n_splits=10)
scores = cross_val_score(logreg, iris.data, iris.target, cv=shuffle_split)
print("Shuffle-Split:", scores.mean())
```



## Metrics Evaluasi Model

Accuracy bukan satu-satunya metrik. Untuk imbalanced dataset, metrik lain lebih informatif.

### Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

digits = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, random_state=0)

logreg = LogisticRegression(max_iter=5000)
logreg.fit(X_train, y_train)
y_pred = logreg.predict(X_test)

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)
```

### Classification Report

```python
print(classification_report(y_test, y_pred,
                             target_names=digits.target_names.astype(str)))
# Output:
#               precision    recall  f1-score   support
#            0       1.00      0.98      0.99        45
#            1       0.94      0.98      0.96        46
#            ...
```

**Penjelasan metrik:**

| Metrik | Rumus | Kapan Penting |
|--------|-------|---------------|
| **Precision** | TP/(TP+FP) | Ketika false positive mahal (spam filter) |
| **Recall** | TP/(TP+FN) | Ketika false negative mahal (kanker detection) |
| **F1-Score** | 2*(P*R)/(P+R) | Trade-off precision-recall seimbang |
| **Accuracy** | (TP+TN)/Total | Hanya untuk balanced dataset |

### ROC Curve dan AUC

```python
from sklearn.metrics import roc_curve, auc
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=42)

from sklearn.svm import SVC
svc = SVC(kernel='rbf', probability=True)
svc.fit(X_train, y_train)

# ROC curve
fpr, tpr, thresholds = roc_curve(y_test, svc.predict_proba(X_test)[:, 1])
roc_auc = auc(fpr, tpr)
print(f"AUC: {roc_auc:.3f}")

import matplotlib.pyplot as plt
plt.plot(fpr, tpr, label=f'ROC (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()
```

### Precision-Recall Curve

```python
from sklearn.metrics import precision_recall_curve, average_precision_score

precision, recall, thresholds = precision_recall_curve(
    y_test, svc.predict_proba(X_test)[:, 1])

ap = average_precision_score(y_test, svc.predict_proba(X_test)[:, 1])
print(f"Average Precision: {ap:.3f}")

plt.plot(recall, precision, label=f'AP = {ap:.2f}')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.legend()
plt.show()
```

### Metrics untuk Regresi

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.linear_model import Ridge
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

ridge = Ridge()
ridge.fit(X_train, y_train)
y_pred = ridge.predict(X_test)

print("MSE:", mean_squared_error(y_test, y_pred))
print("RMSE:", mean_squared_error(y_test, y_pred, squared=False))
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R²:", r2_score(y_test, y_pred))
```



## Hyperparameter Tuning: Grid Search

Grid search secara sistematis mencari kombinasi hyperparameter terbaik.

### GridSearchCV

```python
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Grid search parameters
param_grid = {
    'C': [0.001, 0.01, 0.1, 1, 10, 100],
    'gamma': [0.001, 0.01, 0.1, 1, 10, 100]
}

grid_search = GridSearchCV(
    SVC(),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1  # pakai semua CPU
)
grid_search.fit(X_train_scaled, y_train)

print("Best parameters:", grid_search.best_params_)
print("Best CV score:", grid_search.best_score_)
print("Test score:", grid_search.score(X_test_scaled, y_test))
```

### RandomizedSearchCV

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import loguniform

# Lebih efisien dari GridSearchCV untuk ruang parameter besar
param_dist = {
    'C': loguniform(1e-3, 1e3),
    'gamma': loguniform(1e-3, 1e2)
}

random_search = RandomizedSearchCV(
    SVC(),
    param_distributions=param_dist,
    n_iter=50,     # coba 50 kombinasi acak
    cv=5,
    random_state=42,
    n_jobs=-1
)
random_search.fit(X_train_scaled, y_train)
print("Best params:", random_search.best_params_)
```

### Visualisasi Heatmap Grid Search

```python
import pandas as pd
import numpy as np

results = pd.DataFrame(grid_search.cv_results_)
scores = np.array(results['mean_test_score']).reshape(6, 6)

plt.figure(figsize=(10, 8))
plt.imshow(scores, interpolation='nearest', cmap='viridis')
plt.xlabel('gamma')
plt.ylabel('C')
plt.colorbar()
plt.xticks(np.arange(6), ['0.001', '0.01', '0.1', '1', '10', '100'], rotation=90)
plt.yticks(np.arange(6), ['0.001', '0.01', '0.1', '1', '10', '100'])
plt.title("Grid Search CV Scores")
plt.show()
```



## Pipeline: Menyatukan Preprocessing dan Model

Pipeline menyederhanakan workflow ML dan mencegah data leakage.

### Problem Tanpa Pipeline: Data Leakage

```python
# SALAH: data leakage
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)       # FIT pada semua data!
X_train, X_test = train_test_split(X_scaled, ...)  # test data sudah "bocor"

# BENAR: fit hanya pada training data
X_train, X_test = train_test_split(X, ...)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # hanya transform, tidak fit
```

### Pipeline Dasar

```python
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, random_state=0)

# Pipeline otomatis menangani fit dan transform
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC())
])

pipe.fit(X_train, y_train)
print("Test accuracy:", pipe.score(X_test, y_test))
```

### Pipeline dengan Grid Search

```python
# Grid search dengan pipeline: tidak ada data leakage!
param_grid = {
    'svm__C': [0.001, 0.01, 0.1, 1, 10, 100],
    'svm__gamma': [0.001, 0.01, 0.1, 1, 10, 100]
}
# Prefix "svm__" untuk mengakses parameter di dalam pipeline

grid_search = GridSearchCV(pipe, param_grid=param_grid, cv=5, n_jobs=-1)
grid_search.fit(X_train, y_train)  # scaling terjadi di dalam CV fold!

print("Best params:", grid_search.best_params_)
print("Test score:", grid_search.score(X_test, y_test))
```

### Pipeline Kompleks

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import Ridge
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestClassifier

# Multi-step pipeline
pipe_complex = Pipeline([
    ('scaler', StandardScaler()),
    ('poly', PolynomialFeatures(degree=2)),
    ('scaler2', StandardScaler()),
    ('ridge', Ridge())
])

pipe_complex.fit(X_train, y_train)
print("R²:", pipe_complex.score(X_test, y_test))
```



## Pemrosesan Teks: Bag of Words

Chapter 7 membahas cara merepresentasikan teks untuk machine learning.

### CountVectorizer: Bag of Words

```python
from sklearn.feature_extraction.text import CountVectorizer

bards_words = [
    "The fool doth think he is wise",
    "but the wise man knows himself to be a fool"
]

vect = CountVectorizer()
vect.fit(bards_words)

print("Vocabulary size:", len(vect.vocabulary_))
print("Feature names:", vect.get_feature_names_out())

X = vect.transform(bards_words)
print("Bag of words shape:", X.shape)
print("Dense representation:")
print(X.toarray())
```

### Analisis Sentimen Film

```python
from sklearn.datasets import load_files
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

# Load dataset IMDb (download dulu)
# reviews = load_files("aclImdb/train", categories=['pos', 'neg'])
# Atau gunakan built-in datasets

# Simulasi dengan data kecil
texts = [
    "This movie was great! I loved every minute",
    "Terrible film, waste of time and money",
    "Excellent acting and beautiful cinematography",
    "Boring plot, predictable ending, not recommended",
    "Masterpiece! One of the best films ever made",
    "Awful, awful, awful. Completely unwatchable"
]
labels = [1, 0, 1, 0, 1, 0]  # 1=positif, 0=negatif

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, random_state=42)

vect = CountVectorizer(min_df=1)
X_train_vect = vect.fit_transform(X_train)
X_test_vect = vect.transform(X_test)

logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train_vect, y_train)
print("Accuracy:", logreg.score(X_test_vect, y_test))
```

### Preprocessing Teks

```python
# n-gram: menangkap konteks lebih baik
vect_bigram = CountVectorizer(ngram_range=(1, 2))  # unigram dan bigram

# min_df: abaikan kata yang sangat jarang
vect_mindf = CountVectorizer(min_df=5)  # muncul minimal 5 dokumen

# max_df: abaikan kata yang terlalu umum
vect_maxdf = CountVectorizer(max_df=0.5)  # ada di max 50% dokumen

# stop_words: abaikan kata umum Inggris
vect_stop = CountVectorizer(stop_words='english')

# Kombinasi
vect_full = CountVectorizer(
    ngram_range=(1, 2),
    min_df=5,
    max_df=0.5,
    stop_words='english'
)
```



## TF-IDF

TF-IDF (Term Frequency-Inverse Document Frequency) memberikan bobot lebih besar pada kata yang jarang tapi informatif.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# TF-IDF lebih baik dari raw count untuk informasi retrieval
tfidf = TfidfVectorizer(min_df=5)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

logreg_tfidf = LogisticRegression(max_iter=1000)
logreg_tfidf.fit(X_train_tfidf, y_train)
print("TF-IDF accuracy:", logreg_tfidf.score(X_test_tfidf, y_test))
```

### Pipeline Teks

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

text_pipe = Pipeline([
    ('tfidf', TfidfVectorizer(min_df=5, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=1000))
])

text_pipe.fit(X_train, y_train)
print("Pipeline accuracy:", text_pipe.score(X_test, y_test))

# Grid search untuk pipeline teks
param_grid = {
    'tfidf__ngram_range': [(1, 1), (1, 2), (1, 3)],
    'tfidf__min_df': [3, 5, 10],
    'clf__C': [0.1, 1, 10]
}

grid = GridSearchCV(text_pipe, param_grid=param_grid, cv=5)
grid.fit(X_train, y_train)
print("Best params:", grid.best_params_)
```

### Latent Semantic Analysis (LSA)

```python
from sklearn.pipeline import Pipeline
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import Normalizer

lsa_pipe = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('svd', TruncatedSVD(n_components=100)),   # reduksi dimensi
    ('norm', Normalizer()),
    ('clf', LogisticRegression(max_iter=1000))
])

lsa_pipe.fit(X_train, y_train)
print("LSA accuracy:", lsa_pipe.score(X_test, y_test))
```



## Ringkasan Seri

Lima artikel seri *Machine Learning dengan Python* merangkum seluruh buku O'Reilly:

| Artikel | Chapter | Topik Utama |
|---------|---------|-------------|
| 1 | Ch. 1 | Pengantar, scikit-learn, Iris, overfitting |
| 2 | Ch. 2 Part 1 | k-NN, Linear Models, Decision Tree, Random Forest |
| 3 | Ch. 2 Part 2 | SVM, Neural Networks, estimasi ketidakpastian |
| 4 | Ch. 3-4 | PCA, NMF, t-SNE, Clustering, Feature Engineering |
| 5 | Ch. 5-7 | CV, Metrics, Grid Search, Pipeline, NLP |

### Alur Kerja ML yang Baik

```
1. Eksplorasi data
   └─ Visualisasi, statistik dasar, deteksi outlier

2. Preprocessing
   └─ Scaling, encoding, handling missing values

3. Baseline model
   └─ Logistic Regression atau Random Forest sebagai benchmark

4. Evaluasi
   └─ Cross-validation, pilih metrik yang tepat

5. Tuning
   └─ Grid Search / Random Search hyperparameters

6. Pipeline
   └─ Gabungkan preprocessing + model untuk production

7. Interpretasi
   └─ Feature importance, confusion matrix, classification report
```



**Sumber:** Andreas C. Müller & Sarah Guido, *Introduction to Machine Learning with Python: A Guide for Data Scientists* (2017), O'Reilly Media. ISBN: 978-1-449-36941-5. GitHub: [github.com/amueller/introduction_to_ml_with_python](https://github.com/amueller/introduction_to_ml_with_python)
