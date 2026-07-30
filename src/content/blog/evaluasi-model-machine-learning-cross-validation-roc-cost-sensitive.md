---
title: "Evaluasi Model Machine Learning: Cross-Validation, Confusion Matrix, ROC Curve, dan Cost-Sensitive Learning"
description: Panduan lengkap evaluasi model ML secara rigorous — dari
  train/test split, k-fold cross-validation, bootstrap, confusion matrix,
  precision recall F1, ROC AUC, hingga cost-sensitive evaluation. Plus kappa
  statistic dan minimum description length principle.
pubDate: 2026-06-24T17:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - ModelEvaluation
  - CrossValidation
  - ROC
  - ConfusionMatrix
  - DataMining
  - WEKA
series: "Data Mining WEKA"
seriesOrder: 4
---

Model machine learning yang buruk lebih berbahaya daripada tidak punya model sama sekali. **Evaluasi** adalah proses menentukan apakah model kamu benar-benar berfungsi — dan seberapa baik.

## Training vs Testing: The Golden Rule

> **Jangan pernah mengevaluasi model pada data training!**

Evaluasi pada data training memberikan **optimistic bias** — model bisa saja "menghafal" (overfit).

### Holdout Method

```
Data → [Training 70%] [Test 30%]
          ↓               ↓
        Train           Evaluate
```

**Masalah**: Hasil tergantung split. Jika test set "easy", akurasi tinggi. Sebaliknya, rendah.

### Stratification

Pastikan proporsi kelas di training dan test set **sama** dengan dataset asli.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=42
)
```

## Cross-Validation

### k-Fold Cross-Validation

```
Data dibagi k fold:

Fold 1: [Test] [Train Train Train Train]
Fold 2: [Train] [Test Train Train Train]
Fold 3: [Train Train] [Test Train Train]
Fold 4: [Train Train Train] [Test Train]
Fold 5: [Train Train Train Train] [Test]

Akurasi = mean(akurasi_fold₁, ..., akurasi_fold₅)
```

**k=10** adalah standar de facto — keseimbangan antara bias dan variance.

### Leave-One-Out Cross-Validation (LOOCV)

k = N (satu instance sebagai test, sisanya training).

- ✅ Almost unbiased estimate
- ❌ Mahal komputasi (N kali training)
- ❌ High variance (setiap fold hampir identik)

### Bootstrap

Sampling **dengan replacement**:

```
1. Sample N instances WITH REPLACEMENT → training set
2. Instances yang TIDAK terpilih → test set (~36.8%)
3. Ulangi B kali, rata-rata performa
```

**0.632 Bootstrap**: Weighted average = 0.632·test_error + 0.368·train_error.

## Confusion Matrix

```
                 Predicted
               Negative    Positive
Actual  Neg  |    TN    |    FP    |
        Pos  |    FN    |    TP    |
```

| Metrik | Formula | Arti |
|--------|---------|------|
| **Accuracy** | (TP+TN)/Total | Berapa % benar? |
| **Precision** | TP/(TP+FP) | Berapa % positive predictions benar? |
| **Recall/Sensitivity** | TP/(TP+FN) | Berapa % actual positives terdeteksi? |
| **Specificity** | TN/(TN+FP) | Berapa % actual negatives terdeteksi? |
| **F1-Score** | 2·P·R/(P+R) | Harmonic mean precision & recall |

### Kapan Fokus pada Metrik Mana?

- **Fraud detection**: Recall tinggi (jangan lewatkan fraud)
- **Spam filter**: Precision tinggi (jangan salah klasifikasi email penting)
- **Medical test**: Sensitivity & specificity balanced
- **General**: F1-Score

## ROC Curve (Receiver Operating Characteristic)

Plot **True Positive Rate** vs **False Positive Rate** pada berbagai threshold.

```
                    1.0 ┤                    ╭─
                        │                 ╭──╯
        TPR (Recall)    │             ╭──╯       Good Model
                        │         ╭──╯
                    0.0 ┼────────╯
                        0.0                 1.0
                             FPR (1-Specificity)
```

### AUC (Area Under Curve)

- **AUC = 1.0**: Perfect classifier
- **AUC = 0.5**: Random guessing
- **AUC < 0.5**: Worse than random

> AUC mengukur kemampuan model membedakan kelas, tidak terpengaruh class imbalance.

## Kappa Statistic

Mengukur agreement antara prediksi dan actual, dikoreksi chance:

```
κ = (P₀ - Pₑ) / (1 - Pₑ)
```

Dimana:
- P₀ = observed agreement (akurasi)
- Pₑ = expected agreement by chance

```
κ = 0   → no agreement beyond chance
κ = 0.4 → moderate agreement
κ = 0.8 → strong agreement
κ = 1.0 → perfect agreement
```

## Cost-Sensitive Evaluation

Tidak semua kesalahan setara. Misdiagnosis kanker (FN) jauh lebih mahal daripada false alarm (FP).

### Cost Matrix

```
             Predicted
           Neg    Pos
Actual Neg  0     1    (FP cost = 1)
      Pos  10    0    (FN cost = 10)
```

**Cost-sensitive accuracy**:

```
Total Cost = FP_count · cost_FP + FN_count · cost_FN
```

### Cost Curves

Alternatif ROC untuk cost-sensitive scenarios. Plot **expected cost** vs **probability cost**.

## Quadratic & Informational Loss

Untuk probabilitas (bukan hard classification):

**Quadratic Loss (Brier Score)**:

```
Q = (1/N) · ∑ (pᵢ - aᵢ)²
```

Dimana pᵢ = predicted probability, aᵢ = actual (0/1).

**Informational Loss (Log Loss)**:

```
L = -(1/N) · ∑ [aᵢ·log(pᵢ) + (1-aᵢ)·log(1-pᵢ)]
```

> Log loss heavily penalizes confident wrong predictions.

## Minimum Description Length (MDL) Principle

Prinsip filosofis: **model terbaik adalah yang paling sederhana (shortest description)**.

```
Total Description Length = L(M) + L(D|M)

L(M)    = bits untuk mendeskripsikan model
L(D|M)  = bits untuk mendeskripsikan data dengan model
```

MDL memberikan justifikasi teoritis untuk **Occam's Razor** dalam ML.

## Rekomendasi Praktis

1. **Selalu pakai cross-validation**, bukan single train/test split
2. **pilih metrik sesuai problem**, bukan sekadar akurasi
3. **Laporkan confidence interval**, bukan point estimate
4. **Statistical test** untuk membandingkan model (paired t-test, Wilcoxon)
5. **Visualisasi** — ROC curve, learning curve, calibration plot

## Kesimpulan

Evaluasi model bukan formalitas — ia adalah **inti dari machine learning**. Tanpa evaluasi yang rigorous, kamu tidak tahu apakah model lebih baik dari random guessing atau sekadar overfitting.

Di artikel selanjutnya: **Advanced Topics** — feature selection, PCA, ensemble methods, text mining.

---

*Referensi: Witten, I.H. & Frank, E. (2005). Data Mining, 2nd Edition. Morgan Kaufmann.*
