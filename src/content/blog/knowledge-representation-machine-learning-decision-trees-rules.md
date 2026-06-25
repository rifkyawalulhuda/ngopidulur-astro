---
title: "Knowledge Representation dalam Machine Learning: Decision Trees, Rules, Association, dan Instance-Based Learning"
description: Bagaimana machine learning merepresentasikan pengetahuan? Dari
  decision trees dan classification rules, association rules dengan support &
  confidence, instance-based learning, hingga clustering. Memahami berbagai
  skema representasi output dalam data mining.
pubDate: 2026-06-24T15:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - DataMining
  - DecisionTree
  - AssociationRules
  - Clustering
  - KnowledgeRepresentation
  - MachineLearning
  - WEKA
---

Setelah data diproses dan algoritma dijalankan, apa hasilnya? **Knowledge representation** — bagaimana model menyimpan "pengetahuan" yang dipelajari.

Artikel ini mengupas berbagai skema representasi output dalam machine learning.

## Decision Tables

Representasi paling sederhana: tabel lookup.

| Outlook | Temperature | Humidity | Windy | → | Play |
|---------|------------|----------|-------|---|------|
| sunny | hot | high | FALSE | | no |
| overcast | cool | normal | TRUE | | yes |

**Kelebihan**: Simple, interpretable.
**Kekurangan**: Tidak generalisasi — hanya "menghafal" data training.

## Decision Trees

Struktur hierarkis: root → internal nodes (test atribut) → leaves (class label).

```
          Outlook
          /  |   \
     sunny overcast rainy
       /      |       \
  Humidity   yes     Windy
   /    \            /    \
high  normal     TRUE   FALSE
 |       |         |       |
no      yes       no      yes
```

### Karakteristik

- **Divide-and-conquer**: Memecah dataset berdasarkan atribut terbaik
- **Information gain**: Memilih split yang paling "informatif"
- **Pruning**: Memotong cabang untuk menghindari overfitting
- **Interpretable**: Bisa dijelaskan ke domain expert

### Dari Trees ke Rules

Setiap path dari root ke leaf = satu rule:

```
IF outlook = sunny AND humidity = high THEN play = no
IF outlook = overcast THEN play = yes
IF outlook = rainy AND windy = TRUE THEN play = no
```

## Classification Rules

Rules tidak harus berasal dari tree. Covering algorithms membangun rules langsung:

```
1. IF tear_production_rate = reduced THEN recommendation = none
2. IF age = young AND astigmatic = no THEN recommendation = soft
3. IF age = presbyopic AND spectacle_prescription = myope THEN ...
```

### Kelebihan Rules:
- Lebih compact dari trees (satu rule bisa mencakup banyak cabang)
- Natural untuk domain expert
- Bisa memiliki exceptions

## Association Rules

Mencari hubungan antar items dalam transactional data:

```
{diapers} → {beer}        [support=0.03, confidence=0.85]
{bread, milk} → {butter}  [support=0.05, confidence=0.72]
```

### Metrik

**Support**: Seberapa sering itemset muncul dalam data.
```
support(X→Y) = P(X ∪ Y) = |X ∪ Y| / N
```

**Confidence**: Seberapa sering rule benar ketika antecedent muncul.
```
confidence(X→Y) = P(Y|X) = |X ∪ Y| / |X|
```

### Apriori Algorithm

Memanfaatkan **anti-monotone property**: jika itemset jarang, superset-nya juga jarang.

```
1. Cari frequent 1-itemsets (support > min_support)
2. Generate candidate 2-itemsets dari frequent 1-itemsets
3. Prune candidate yang tidak frequent
4. Ulangi untuk k-itemsets
```

### Rules dengan Exceptions

```
IF ... THEN class = A
  EXCEPT IF ... THEN class = B
```

Lebih ekspresif — menangkap "kebanyakan X adalah Y, kecuali..."

## Instance-Based Learning (Lazy Learning)

Tidak membangun model eksplisit. Prediksi dengan **mencari instance training paling mirip**.

### k-Nearest Neighbors (k-NN)

```
Untuk instance baru x:
  1. Hitung distance ke semua training instances
  2. Pilih k nearest neighbors
  3. Prediksi = majority class (classification)
              = average value (regression)
```

### Kelebihan:
- **Tidak ada training** — langsung bisa prediksi
- **Non-parametric** — tidak ada asumsi distribusi
- **Adaptif** — otomatis update dengan data baru

### Kekurangan:
- **Lambat saat inference** — harus scan semua data
- **Curse of dimensionality** — distance metric kurang berarti di high dimensions
- **Memory intensive** — simpan semua training data

## Numeric Prediction dengan Trees

Untuk regresi, leaf menyimpan **nilai numerik** (bukan class label):

```
Model Trees (M5P):
  Di setiap leaf: linear regression model
  
  IF x > 3.2 THEN
    IF y < 1.8 THEN
      → LM1: z = 2.3 + 0.7x - 0.4y
    ELSE
      → LM2: z = 1.8 + 0.5x + 0.3y
```

## Clustering

Menemukan **kelompok alami** dalam data tanpa label.

### Output Clustering

- **Partition**: Setiap instance masuk ke SATU cluster
- **Hierarchical**: Dendrogram, nested clusters
- **Probability-based**: Setiap instance punya probabilitas untuk setiap cluster

### Representasi Cluster

- **Centroid**: Pusat cluster (rata-rata semua anggota)
- **Medoid**: Representative instance (anggota paling sentral)
- **Density region**: Area dengan konsentrasi instance tinggi

## Perbandingan Representasi

| Representasi | Interpretability | Generalisasi | Speed (Inference) | Data Type |
|-------------|-----------------|-------------|-------------------|-----------|
| Decision Table | ✅✅✅ | ❌ | ✅✅✅ | Small, discrete |
| Decision Tree | ✅✅ | ✅ | ✅✅ | Mixed |
| Rules | ✅✅✅ | ✅✅ | ✅✅ | Mixed |
| Association Rules | ✅✅ | ✅ | ✅ | Transactional |
| Instance-Based | ❌ | ✅✅ | ❌ | Numeric |
| Clusters | ✅ | N/A | ✅ | Unlabeled |

## Kesimpulan

Tidak ada representasi "terbaik" — setiap skema punya trade-off antara **interpretability**, **accuracy**, dan **efficiency**. Decision trees bagus untuk presentasi ke stakeholder, rules bagus untuk domain expert, instance-based bagus untuk data kompleks tanpa asumsi.

Di artikel selanjutnya: **Algoritma Machine Learning Klasik** — implementasi detail dari 1R, Naive Bayes, C4.5, dan k-NN.

---

*Referensi: Witten, I.H. & Frank, E. (2005). Data Mining, 2nd Edition. Morgan Kaufmann.*
