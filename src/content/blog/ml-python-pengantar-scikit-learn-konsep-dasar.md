---
title: "Machine Learning dengan Python: Pengantar, scikit-learn, dan Konsep Dasar"
description: Panduan komprehensif Machine Learning dengan Python dari buku O'Reilly
  - mengapa ML penting, jenis-jenis masalah ML, tools scikit-learn NumPy Pandas,
  konsep generalisasi overfitting underfitting, dan contoh klasifikasi iris pertama.
pubDate: 2026-09-08T08:00:00.000Z
image: /image/ml-python-oreilly-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - Python
  - ScikitLearn
  - DataScience
series: "Machine Learning dengan Python"
seriesOrder: 1
---

Machine learning adalah tentang mengekstrak pengetahuan dari data. Ini adalah bidang penelitian di persimpangan statistik, kecerdasan buatan, dan ilmu komputer — juga dikenal sebagai *predictive analytics* atau *statistical learning*. Dari rekomendasi film Netflix, deteksi wajah di foto, hingga diagnosis medis otomatis, machine learning sudah ada di mana-mana.

Buku *Introduction to Machine Learning with Python* oleh **Andreas C. Müller dan Sarah Guido** (O'Reilly, 2017) adalah panduan praktis untuk data scientist yang ingin mulai menggunakan ML dengan Python. Seri artikel ini merangkum seluruh 7 chapter buku tersebut secara komprehensif.

## Daftar Isi

- [Mengapa Machine Learning?](#mengapa-machine-learning)
- [Masalah yang Bisa Diselesaikan ML](#masalah-yang-bisa-diselesaikan-ml)
- [Mengenal scikit-learn](#mengenal-scikit-learn)
- [Tools Python untuk ML](#tools-python-untuk-ml)
- [Klasifikasi Pertama: Dataset Iris](#klasifikasi-pertama-dataset-iris)
- [Konsep Generalisasi, Overfitting, Underfitting](#konsep-generalisasi-overfitting-underfitting)
- [Supervised vs Unsupervised Learning](#supervised-vs-unsupervised-learning)



## Mengapa Machine Learning?

Untuk banyak aplikasi, mengikuti daftar aturan yang dibuat tangan sangat tidak praktis — baik karena aturan yang diperlukan terlalu banyak dan spesifik, atau karena manusia tidak tahu bagaimana cara mendefinisikan aturan tersebut.

**Contoh kasus nyata:**

Anggaplah kamu ingin membangun sistem filter spam email. Kamu bisa mulai dengan mengidentifikasi kata-kata yang menunjukkan spam, seperti "herbal Viagra" atau "Nigerian prince." Ini akan bekerja sebagai sistem pakar berbasis aturan dan memerlukan banyak penyesuaian. Tapi penyerang spam tahu bahwa email mereka sedang diblokir — mereka bisa mengubah pesan mereka untuk menghindari filter. Segera kamu butuh lebih banyak aturan.

Sebaliknya, algoritma ML belajar dari contoh email mana yang spam dan mana yang tidak — dan akan dapat membuat penilaian bahkan dari kata-kata yang tidak pernah dilihat pemrogram.

**Kapan ML sangat efektif:**
- Email spam dan malware detection
- Personalisasi konten (YouTube, Netflix, Spotify)
- Medical imaging dan diagnosis
- Natural Language Processing
- Computer vision (autonomous vehicles)



## Masalah yang Bisa Diselesaikan ML

ML paling sukses ketika proses pengambilan keputusan tidak mudah dirumuskan oleh manusia. Ada beberapa jenis masalah utama:

### Classification (Klasifikasi)

Memprediksi **kelas** atau **label** dari sebuah input.

```python
# Contoh: Klasifikasi email
# Input: konten email
# Output: "spam" atau "bukan spam"

# Contoh: Deteksi iris
# Input: ukuran petal dan sepal
# Output: "setosa", "versicolor", atau "virginica"
```

**Contoh klasifikasi biner** (2 kelas): spam vs bukan spam, kanker vs tidak kanker
**Contoh klasifikasi multiclass** (>2 kelas): jenis bunga iris, digit tulisan tangan (0-9)

### Regression (Regresi)

Memprediksi **nilai kontinu** dari sebuah input.

```python
# Contoh: Prediksi harga rumah
# Input: luas, lokasi, jumlah kamar
# Output: harga dalam rupiah

# Contoh: Prediksi pendapatan
# Input: usia, pendidikan, pengalaman kerja
# Output: gaji tahunan
```

### Unsupervised Learning

Menemukan **struktur tersembunyi** dalam data tanpa label.

```python
# Contoh: Segmentasi pelanggan
# Input: data perilaku belanja
# Output: kelompok pelanggan serupa
```



## Mengenal scikit-learn

**scikit-learn** adalah library Python paling populer untuk machine learning. Ia menyediakan:
- Koleksi algoritma ML modern yang siap pakai
- Interface yang konsisten untuk semua algoritma
- Tools untuk preprocessing, evaluasi model, dan pemilihan model

### Instalasi

```bash
pip install scikit-learn numpy pandas matplotlib
```

Atau menggunakan Anaconda (lebih mudah):
```bash
conda install scikit-learn
```

### Verifikasi Instalasi

```python
import sklearn
print("scikit-learn version:", sklearn.__version__)
```

scikit-learn bergantung pada dua library inti Python ilmiah:
- **NumPy** — array multidimensional dan operasi matematika
- **SciPy** — koleksi fungsi ilmiah



## Tools Python untuk ML

### NumPy

NumPy adalah fondasi dari semua komputasi ilmiah di Python:

```python
import numpy as np

# Membuat array
x = np.array([[1, 2, 3],
               [4, 5, 6]])
print("Shape:", x.shape)  # (2, 3)

# Operasi matematika
print("Mean:", x.mean())
print("Max:", x.max())

# Random numbers (penting untuk ML)
rng = np.random.RandomState(42)
X = rng.randn(3, 2)  # 3 samples, 2 features
```

**Mengapa NumPy penting untuk ML:**
- Data ML disimpan sebagai array NumPy
- Operasi vektor/matriks yang sangat cepat
- Interface standar scikit-learn menggunakan NumPy arrays

### SciPy

```python
from scipy import sparse

# Sparse matrix — penting untuk data teks
eye = sparse.eye(4)
print(type(eye))  # <class 'scipy.sparse.dia.dia_matrix'>

# Konversi ke array biasa
print(eye.toarray())
```

**Kapan pakai sparse matrix:** Data dengan banyak nilai nol (teks, rekomendasi). Jauh lebih efisien dari dense array.

### Matplotlib

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-10, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.title("Sine Function")
plt.show()
```

### Pandas

```python
import pandas as pd

data = {'Name': ['John', 'Anna', 'Peter'],
        'Age': [24, 13, 53],
        'Location': ['New York', 'Paris', 'Berlin']}

data_pandas = pd.DataFrame(data)
print(data_pandas)

# Filter data
print(data_pandas[data_pandas.Age > 30])
```

Pandas sangat berguna untuk:
- Loading data dari CSV, Excel, database
- Data cleaning dan preprocessing
- Exploratory data analysis



## Klasifikasi Pertama: Dataset Iris

Kita mulai dengan contoh klasik — mengklasifikasikan bunga iris berdasarkan ukuran petal dan sepalnya.

### Memuat Data

```python
from sklearn.datasets import load_iris

iris_dataset = load_iris()

print("Keys:", iris_dataset.keys())
# dict_keys(['target_names', 'feature_names', 'DESCR', 'data', 'target'])

print("Target names:", iris_dataset['target_names'])
# ['setosa' 'versicolor' 'virginica']

print("Feature names:", iris_dataset['feature_names'])
# ['sepal length (cm)', 'sepal width (cm)',
#  'petal length (cm)', 'petal width (cm)']

print("Data shape:", iris_dataset['data'].shape)
# (150, 4) — 150 samples, 4 features

print("Target shape:", iris_dataset['target'].shape)
# (150,) — 150 labels
```

### Split Train dan Test

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    iris_dataset['data'],
    iris_dataset['target'],
    random_state=0  # untuk reproducibility
)

print("X_train shape:", X_train.shape)  # (112, 4)
print("X_test shape:", X_test.shape)    # (38, 4)
```

**Mengapa split data?** Kita ingin mengukur seberapa baik model generalisasi ke data baru — bukan data yang sudah dilihat selama training.

### Visualisasi Data

```python
import matplotlib.pyplot as plt
import pandas as pd

# Buat DataFrame untuk visualisasi
iris_dataframe = pd.DataFrame(X_train, columns=iris_dataset.feature_names)

# Pair plot
pd.plotting.scatter_matrix(
    iris_dataframe,
    c=y_train,
    figsize=(15, 15),
    marker='o',
    hist_kwds={'bins': 20},
    s=60,
    alpha=.8
)
plt.show()
```

### Training Model k-Nearest Neighbors

```python
from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=1)
knn.fit(X_train, y_train)
```

### Membuat Prediksi

```python
import numpy as np

# Data baru yang belum pernah dilihat model
X_new = np.array([[5, 2.9, 1, 0.2]])

prediction = knn.predict(X_new)
print("Prediction:", prediction)  # [0]
print("Predicted target name:",
      iris_dataset['target_names'][prediction])  # ['setosa']
```

### Evaluasi Model

```python
y_pred = knn.predict(X_test)

accuracy = np.mean(y_pred == y_test)
print("Accuracy:", accuracy)  # 0.9736842105263158

# Atau menggunakan built-in score
print("Score:", knn.score(X_test, y_test))  # 0.97
```

Model mencapai **97% akurasi** — benar mengklasifikasikan 97% dari 38 sampel test.



## Konsep Generalisasi, Overfitting, Underfitting

Ini adalah konsep paling penting dalam machine learning.

### Generalisasi

**Generalisasi** adalah kemampuan model untuk memberikan prediksi akurat pada data baru yang belum pernah dilihat sebelumnya.

Kita ingin model yang bisa **generalisasi** — bukan model yang hanya hafal data training.

### Overfitting

**Overfitting** terjadi ketika model terlalu kompleks dan "menghafal" data training, termasuk noise-nya.

```
Training accuracy: 100% ✓
Test accuracy: 60% ✗ ← masalah!
```

**Tanda-tanda overfitting:**
- Performa training sangat tinggi
- Performa test jauh lebih rendah
- Gap besar antara train dan test score

### Underfitting

**Underfitting** terjadi ketika model terlalu sederhana dan tidak cukup menangkap pola dalam data.

```
Training accuracy: 70% ✗
Test accuracy: 68% ✓ (konsisten tapi tidak bagus)
```

**Tanda-tanda underfitting:**
- Performa training rendah
- Model tidak bisa menangkap pola data
- Bias tinggi, variance rendah

### Sweet Spot

```
          Model Complexity →
Low          Medium        High
│            │              │
│Underfitting│ Good Range   │Overfitting
│            │              │
├────────────┼──────────────┤
Training err: ↓high   ↓low    ↓very low
Test err:     ↑high   ↑low    ↑high
```

**Tujuan:** menemukan kompleksitas model yang menghasilkan test error minimal.

### Ukuran Dataset dan Kompleksitas Model

- **Dataset kecil** → model sederhana (kurang parameter, regularisasi lebih banyak)
- **Dataset besar** → bisa pakai model kompleks
- Lebih banyak data hampir selalu membantu, tapi ada batas diminishing returns



## Supervised vs Unsupervised Learning

### Supervised Learning

Data training terdiri dari **pasangan input-output** (features dan label).

```python
# X = features (input)
# y = target (output/label)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

**Jenis tugas:**
- **Klasifikasi** — target adalah kelas diskrit
- **Regresi** — target adalah nilai kontinu

### Unsupervised Learning

Data training hanya berisi **input tanpa label**.

```python
# X = features saja, tidak ada y
model.fit(X)
labels = model.predict(X)  # atau transform, dsb
```

**Jenis tugas:**
- **Clustering** — mengelompokkan data serupa
- **Dimensionality Reduction** — mereduksi jumlah fitur
- **Density Estimation** — estimasi distribusi data

### Perbandingan

| Aspek | Supervised | Unsupervised |
|-------|-----------|--------------|
| Label | Ya | Tidak |
| Evaluasi | Mudah (accuracy, dll) | Sulit |
| Contoh | Klasifikasi, regresi | Clustering, PCA |
| Tujuan | Prediksi | Penemuan struktur |



## Ringkasan Seri

Seri "Machine Learning dengan Python" merangkum buku O'Reilly oleh Müller & Guido:

| Artikel | Topik | Chapter |
|---------|-------|---------|
| 1 | Pengantar, scikit-learn, dataset Iris | Ch. 1 |
| 2 | Supervised Learning: KNN, Linear, Decision Tree | Ch. 2 Part 1 |
| 3 | Supervised Learning: SVM, Neural Networks, Evaluasi | Ch. 2 Part 2 |
| 4 | Unsupervised Learning + Feature Engineering | Ch. 3-4 |
| 5 | Evaluasi Model, Pipeline, Pemrosesan Teks | Ch. 5-7 |

**Sumber:** Andreas C. Müller & Sarah Guido, *Introduction to Machine Learning with Python* (2017), O'Reilly Media. ISBN: 978-1-449-36941-5.
