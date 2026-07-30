---
title: "CNN, RNN, LSTM, dan Transformers: Arsitektur Deep Learning untuk Computer Vision dan NLP"
description: Dari convolutional neural networks untuk pengenalan gambar, RNN/LSTM
  untuk data sekuensial, hingga transformer architecture dengan self-attention
  yang mendasari ChatGPT dan model LLM modern. Penjelasan konseptual dengan kode.
pubDate: 2026-06-24T13:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - DeepLearning
  - CNN
  - RNN
  - LSTM
  - Transformer
  - Attention
  - NLP
  - ComputerVision
  - AI
series: "CS229 Machine Learning"
seriesOrder: 6
---

Setelah memahami neural networks dasar, kita masuk ke **specialized architectures** — CNN untuk computer vision, RNN/LSTM untuk sequences, dan Transformers yang mendominasi NLP modern.

## Convolutional Neural Networks (CNN)

### Masalah dengan Fully Connected Networks untuk Gambar

Gambar 256×256×3 = 196,608 input neurons. Dengan 1000 hidden neurons = 196 JUTA parameter. **Too many!**

CNN menyelesaikan ini dengan dua ide kunci: **sparse connectivity** dan **parameter sharing**.

### Convolution Operation

```
Input Image          Filter (Kernel)       Feature Map
┌──────────┐         ┌─────┐               ┌──────────┐
│ 1 2 3 4 │         │ 1 0 │               │    ...   │
│ 5 6 7 8 │    ⊗    │ 0 1 │    =          │    ...   │
│ 9 0 1 2 │         └─────┘               └──────────┘
└──────────┘
```

Operasi: **sliding window** — filter bergeser, menghitung dot product di setiap posisi.

```python
# Convolution concept
output[i,j] = sum(input[i:i+kh, j:j+kw] * kernel)
```

### Arsitektur CNN Klasik (LeNet-5 Style)

```
Input (32×32×3)
  → Conv (5×5, 6 filters) + ReLU
  → MaxPool (2×2)
  → Conv (5×5, 16 filters) + ReLU
  → MaxPool (2×2)
  → Flatten
  → FC (120) + ReLU
  → FC (84) + ReLU
  → FC (10) + Softmax
```

### Pooling Layer

**Max Pooling**: downsample feature map dengan mengambil nilai maksimum:

```
┌──────┐     ┌──┐
│1 3 2│     │3 │  ← max
│4 6 5│  →  │8 │  ← max
│7 8 9│     └──┘
└──────┘
```

Fungsi pooling:
- **Reduce spatial dimensions** (kurangi komputasi)
- **Translation invariance** (posisi objek tidak kritis)
- **Increase receptive field** (lihat konteks lebih luas)

### Transfer Learning

Alih-alih melatih CNN dari nol, gunakan pretrained model:

```python
from tensorflow.keras.applications import ResNet50

base_model = ResNet50(weights='imagenet', include_top=False)
base_model.trainable = False  # freeze pretrained weights

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])
```

### Arsitektur CNN Terkenal

| Model | Tahun | Inovasi | Parameters |
|-------|-------|---------|------------|
| **LeNet-5** | 1998 | Conv + Pool + FC | 60K |
| **AlexNet** | 2012 | ReLU, Dropout, GPU | 60M |
| **VGG-16** | 2014 | Deep (16 layers) | 138M |
| **ResNet** | 2015 | Skip connections | 25M-60M |
| **EfficientNet** | 2019 | Compound scaling | 5M-66M |

## RNN & LSTM: Memahami Sequences

### Masalah dengan Feedforward Networks

Data sekuensial (teks, time series, audio) memiliki **temporal dependency** — output di waktu t bergantung pada input di waktu t-1, t-2, ...

### Recurrent Neural Network (RNN)

```
h_t = tanh(W_hh · h_{t-1} + W_xh · x_t + b_h)
y_t = W_hy · h_t + b_y
```

**Unfolding RNN**:

```
x₁ → [h₁] → y₁
       ↓
x₂ → [h₂] → y₂
       ↓
x₃ → [h₃] → y₃
```

State h_t membawa **memory** dari semua input sebelumnya.

### Vanishing/Exploding Gradient

Saat backpropagating through time, gradient dikalikan berulang kali:

```
∂L/∂h₁ = ∂L/∂h_T · ∏(∂h_t/∂h_{t-1})
```

Jika |∂h_t/∂h_{t-1}| < 1 → gradient **vanishes**
Jika |∂h_t/∂h_{t-1}| > 1 → gradient **explodes**

> RNN sederhana hanya bisa "mengingat" ~10 steps!

### LSTM (Long Short-Term Memory)

LSTM menyelesaikan vanishing gradient dengan **gating mechanisms**:

```
Forget gate:    f_t = σ(W_f · [h_{t-1}, x_t] + b_f)     "apa yang dilupakan?"
Input gate:     i_t = σ(W_i · [h_{t-1}, x_t] + b_i)     "apa yang disimpan?"
Candidate:      c̃_t = tanh(W_c · [h_{t-1}, x_t] + b_c)
Cell state:     c_t = f_t ⊙ c_{t-1} + i_t ⊙ c̃_t           "long-term memory"
Output gate:    o_t = σ(W_o · [h_{t-1}, x_t] + b_o)     "apa yang di-output?"
Hidden state:   h_t = o_t ⊙ tanh(c_t)
```

> LSTM punya **separate memory** (c_t) yang bisa menyimpan informasi untuk ratusan steps!

## Transformers: "Attention Is All You Need"

Paper 2017 ini merevolusi NLP — dan kemudian computer vision, audio, dan hampir semua domain AI.

### Self-Attention

Setiap token "melihat" semua token lain dan menghitung seberapa relevan mereka:

```
Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V
```

- **Q (Query)**: "Apa yang saya cari?"
- **K (Key)**: "Apa yang saya punya?"
- **V (Value)**: "Informasi aktual"

**Scaling factor** √d_k mencegah dot product menjadi terlalu besar (yang membuat softmax terlalu "peaky").

### Multi-Head Attention

Alih-alih satu attention, jalankan **multiple heads** secara paralel:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_O
head_i = Attention(Q·W_i^Q, K·W_i^K, V·W_i^V)
```

Setiap head belajar **jenis relasi berbeda** — sintaksis, semantik, posisi, dll.

### Transformer Architecture

```
Encoder:
  Input → Embedding + Positional Encoding
    → Multi-Head Self-Attention
    → Add & Norm
    → Feed Forward (2-layer MLP)
    → Add & Norm
    → (repeat 6-12×)

Decoder:
  Output (shifted right) → Embedding + Positional Encoding
    → Masked Multi-Head Self-Attention (hanya lihat token sebelumnya)
    → Add & Norm
    → Cross-Attention (attend to encoder output)
    → Add & Norm
    → Feed Forward
    → Add & Norm
    → (repeat 6-12×)
    → Linear + Softmax
```

### Kenapa Transformer Mendominasi?

1. **Parallelization**: Tidak seperti RNN (sequential), Transformer memproses semua token sekaligus
2. **Long-range dependencies**: Self-attention menghubungkan semua token langsung (O(1) path length)
3. **Scalability**: Bisa diskalakan ke ratusan miliar parameter
4. **Transfer learning**: Pretrain pada massive corpus → fine-tune untuk downstream tasks

### Dari BERT ke GPT

| Model | Arsitektur | Pretraining | Use Case |
|-------|-----------|-------------|----------|
| **BERT** | Encoder-only | Masked LM + NSP | Understanding (classification, NER) |
| **GPT** | Decoder-only | Autoregressive LM | Generation (text, code) |
| **T5** | Encoder-Decoder | Span corruption | Seq2seq (translation, summarization) |

## Kapan Menggunakan Arsitektur Mana?

| Data Type | Architecture | Why |
|-----------|-------------|-----|
| **Gambar** | CNN / ViT | Spatial hierarchy, translation invariance |
| **Teks pendek** | LSTM / GRU | Efisien untuk sequences < 512 tokens |
| **Teks panjang** | Transformer | Long-range dependencies |
| **Time series** | LSTM / Transformer | Temporal patterns |
| **Audio** | CNN + RNN / Transformer | Spectrogram → CNN, temporal → RNN |
| **Graph** | GNN | Relational structure |

## Kesimpulan

Dari CNN yang mendeteksi objek dalam gambar, LSTM yang memahami konteks kalimat, hingga Transformer yang mendasari ChatGPT — specialized architectures adalah kunci revolusi deep learning. Setiap arsitektur adalah **tool yang tepat untuk job yang tepat**.

Memahami kapan menggunakan CNN vs RNN vs Transformer adalah skill esensial untuk ML engineer modern.

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Vaswani et al. (2017). Attention Is All You Need. Hochreiter & Schmidhuber (1997). Long Short-Term Memory.*
