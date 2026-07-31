---
title: "Cara Kerja AI: Hardware, Tipe ML, Pipeline, dan Keterbatasan"
description: Bedah teknis cara kerja AI dari dalam - chip GPU TPU NPU untuk
  training dan inference, supervised vs unsupervised vs reinforcement learning,
  pipeline data science, serta batasan dan tantangan nyata implementasi AI.
pubDate: 2026-08-31T08:00:00.000Z
image: /image/ai-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - ArtificialIntelligence
  - MachineLearning
  - DeepLearning
  - NeuralNetworks
series: "AI Machine Learning Explained"
seriesOrder: 3
---

Memahami *apa* yang bisa dilakukan AI sudah penting. Tapi memahami *bagaimana* AI bekerja di balik layar — hardware apa yang digunakan, bagaimana data diproses, apa perbedaan tipe-tipe machine learning — memberikan pemahaman yang jauh lebih dalam. Artikel terakhir dari seri ini membahas isi "kotak hitam" AI, didasarkan pada *AI/Machine Learning Explained* oleh Steve Blank dari Stanford.

## Daftar Isi

- [Hardware AI: GPU, TPU, dan NPU](#hardware-ai-gpu-tpu-dan-npu)
- [Tipe-Tipe Machine Learning](#tipe-tipe-machine-learning)
- [Supervised Learning](#supervised-learning)
- [Unsupervised Learning](#unsupervised-learning)
- [Reinforcement Learning](#reinforcement-learning)
- [Pipeline Data Science](#pipeline-data-science)
- [Neural Networks dan Deep Learning](#neural-networks-dan-deep-learning)
- [Keterbatasan AI yang Perlu Dipahami](#keterbatasan-ai-yang-perlu-dipahami)



## Hardware AI: GPU, TPU, dan NPU

AI membutuhkan hardware khusus. Komputer standar tidak cukup untuk training model besar atau inference real-time. Ada hierarki chip yang digunakan:

### GPU: Graphics Processing Unit

GPU awalnya dirancang untuk rendering grafik game — tugas yang membutuhkan ribuan kalkulasi paralel sederhana secara bersamaan. Ternyata, ini persis yang dibutuhkan untuk machine learning: matrix multiplication yang massif dan paralel.

**Mengapa GPU cocok untuk AI:**
- Ribuan core kecil yang bekerja paralel (vs. puluhan core besar di CPU)
- Throughput tinggi untuk operasi floating-point
- Memory bandwidth yang besar

**Nvidia mendominasi** pasar GPU untuk AI dengan chip A100 dan H100. Sebuah server training AI kelas enterprise bisa menggunakan 8-16 GPU sekaligus.

### TPU: Tensor Processing Unit

TPU adalah chip khusus yang dikembangkan Google secara internal untuk mempercepat beban kerja machine learning, khususnya TensorFlow. TPU dioptimalkan untuk operasi tensor (multi-dimensi array) yang menjadi fondasi deep learning.

**Keunggulan TPU:**
- Lebih efisien secara energi untuk training ML dibanding GPU
- Dirancang khusus untuk matrix multiplication
- Tersedia di Google Cloud (TPU v4, v5)

### NPU: Neural Processing Unit

NPU adalah chip AI yang terintegrasi dalam perangkat konsumen — smartphone, laptop, dan embedded devices. Dirancang untuk inference lokal (di perangkat, tanpa cloud) dengan konsumsi daya rendah.

**Contoh NPU:**
- Apple Neural Engine di chip M-series dan A-series
- Qualcomm Hexagon DSP di smartphone Android
- Intel Neural Compute Stick

### Perbandingan Hardware AI

| Hardware | Kekuatan | Kelemahan | Penggunaan |
|----------|----------|-----------|------------|
| GPU | Performa tinggi, fleksibel | Mahal, konsumsi daya tinggi | Training besar, research |
| TPU | Efisien untuk ML, sangat cepat | Google-specific, cloud only | Training di Google Cloud |
| NPU | Hemat daya, on-device | Performa terbatas | Inference di mobile/edge |
| CPU | Fleksibel, umum | Lambat untuk ML | Preprocessing, inference kecil |



## Tipe-Tipe Machine Learning

Ada tiga paradigma utama dalam machine learning, masing-masing dengan cara "belajar" yang berbeda:

```
Machine Learning
├── Supervised Learning     (belajar dari contoh berlabel)
├── Unsupervised Learning   (menemukan pola tanpa label)
└── Reinforcement Learning  (belajar dari reward dan punishment)
```



## Supervised Learning

Supervised learning adalah tipe ML yang paling umum dan paling banyak digunakan saat ini. Model dilatih dengan data yang sudah berlabel — setiap input memiliki output yang benar yang diketahui.

### Cara Kerja

```
Data Berlabel (Input + Label) → Training → Model → Prediksi pada Data Baru
```

**Contoh:**
- 10.000 foto kucing (label: "kucing") + 10.000 foto anjing (label: "anjing")
- Model belajar fitur apa yang membedakan kucing dari anjing
- Model kemudian bisa mengklasifikasikan foto baru yang belum pernah dilihat

### Dua Jenis Tugas Supervised Learning

**Klasifikasi:** Output adalah kategori diskrit
- Email → spam atau bukan spam
- Gambar → kucing, anjing, atau burung
- Transaksi → fraud atau legitimate

**Regresi:** Output adalah nilai kontinu
- Prediksi harga rumah berdasarkan fitur
- Prediksi suhu besok
- Estimasi waktu pengiriman

### Algoritma Supervised Learning

| Algoritma | Kapan Digunakan |
|-----------|----------------|
| Linear/Logistic Regression | Data linear, baseline sederhana |
| Decision Tree / Random Forest | Data tabular, interpretable |
| SVM (Support Vector Machine) | Data berdimensi tinggi |
| Neural Network / Deep Learning | Gambar, teks, audio kompleks |
| Gradient Boosting (XGBoost) | Kompetisi data, tabular data |



## Unsupervised Learning

Berbeda dari supervised learning, unsupervised learning bekerja dengan data yang **tidak berlabel**. Model harus menemukan struktur dan pola secara mandiri.

### Clustering: Mengelompokkan Data Serupa

Clustering mengelompokkan data points yang serupa bersama tanpa tahu terlebih dahulu berapa kelompok yang ada atau apa artinya.

**Contoh penggunaan:**
- Segmentasi pelanggan berdasarkan perilaku pembelian
- Pengelompokan dokumen berdasarkan topik
- Deteksi anomali (titik yang tidak cocok di kluster manapun)
- Kompresi gambar

**Algoritma umum:** K-Means, DBSCAN, Hierarchical Clustering

### Dimensionality Reduction

Mereduksi jumlah variabel/fitur sambil mempertahankan informasi penting. Berguna untuk:
- Visualisasi data berdimensi tinggi
- Mengurangi noise
- Mempercepat training

**Algoritma umum:** PCA (Principal Component Analysis), t-SNE, UMAP

### Generative Models

Model yang mempelajari distribusi data dan bisa menghasilkan sampel baru yang mirip dengan data training.

- **GAN (Generative Adversarial Networks):** Dua jaringan bersaing — generator menciptakan konten sintetis, discriminator menilai apakah sintetis atau nyata. Hasilnya: gambar, video, audio yang sangat realistis.

- **VAE (Variational Autoencoders):** Belajar representasi laten kompak dari data, kemudian bisa menghasilkan variasi baru.

- **Diffusion Models:** Basis dari Stable Diffusion, DALL-E 3, Midjourney — belajar membalikkan proses penambahan noise untuk menghasilkan gambar berkualitas tinggi.



## Reinforcement Learning

Reinforcement Learning (RL) adalah paradigma di mana agent belajar melalui interaksi dengan lingkungan, menerima reward untuk perilaku yang baik dan punishment untuk yang buruk.

### Cara Kerja RL

```
Agent → Action → Environment → State + Reward → Agent (belajar)
```

**Komponen:**
- **Agent** — sistem AI yang belajar dan mengambil keputusan
- **Environment** — dunia tempat agent berinteraksi
- **State** — kondisi lingkungan saat ini
- **Action** — pilihan yang bisa diambil agent
- **Reward** — sinyal numerik yang memberitahu seberapa baik action tersebut

### Data Training RL

Data training dikumpulkan oleh agent otonom saat ia menjelajahi lingkungannya dan melakukan aksi yang diarahkan oleh tujuan. **Reward adalah data input** yang diterima agent ketika kriteria tertentu terpenuhi. Kriteria ini biasanya **tidak diketahui** oleh agent pada awalnya — ia harus menemukan strategi optimal melalui trial and error.

### Contoh Penggunaan RL

- **Game:** AlphaGo (catur Go), OpenAI Five (Dota 2), AlphaStar (StarCraft II)
- **Robotika:** Melatih robot untuk berjalan, mengambil objek, navigasi
- **Rekomendasi:** Sistem rekomendasi yang belajar dari engagement pengguna
- **Trading:** Strategi trading yang beradaptasi dengan kondisi pasar
- **RLHF:** Reinforcement Learning from Human Feedback — cara GPT-4 dan Claude dilatih untuk menjadi lebih helpful dan safe



## Pipeline Data Science

Membangun aplikasi AI melibatkan lebih dari sekadar training model. Ada pipeline lengkap yang harus dikelola:

### 1. Pengumpulan Data

Sumber data untuk AI:
- **Data internal:** Database perusahaan, log sistem, data transaksi
- **Data publik:** Dataset terbuka, web scraping, API publik
- **Data sintetis:** Data yang dibuat oleh AI untuk augmentasi
- **Data sensor:** IoT, kamera, mikrofon, GPS

### 2. Persiapan dan Pembersihan Data

Ini sering memakan 60-80% waktu seorang data scientist:
- Menangani nilai yang hilang
- Menghapus duplikat dan outlier
- Normalisasi dan standarisasi
- Feature engineering (membuat fitur baru dari yang ada)
- Pelabelan data (untuk supervised learning)

### 3. Pemilihan dan Training Model

- Pilih arsitektur model yang sesuai
- Split data: training / validation / test set
- Hyperparameter tuning
- Training dengan monitoring
- Evaluasi performa

### 4. Evaluasi Model

Metrik evaluasi bergantung pada jenis tugas:

| Tugas | Metrik Utama |
|-------|-------------|
| Klasifikasi | Accuracy, Precision, Recall, F1, AUC-ROC |
| Regresi | MAE, MSE, RMSE, R² |
| Object Detection | mAP (mean Average Precision) |
| NLP | BLEU, ROUGE, Perplexity |

### 5. Deployment dan Monitoring

- Packaging model untuk produksi
- API endpoint untuk inference
- A/B testing dengan model lama
- Monitoring performa real-time
- Deteksi dan penanganan model drift



## Neural Networks dan Deep Learning

Neural networks adalah fondasi dari deep learning modern — terinspirasi (tapi tidak identik) dengan cara neuron di otak manusia bekerja.

### Struktur Neural Network

```
Input Layer → Hidden Layers → Output Layer
  [x1]           [h1]            [y1]
  [x2]    →→     [h2]    →→      [y2]
  [x3]           [h3]            [y3]
```

- **Input layer:** Menerima data mentah (pixel gambar, token teks, dll.)
- **Hidden layers:** Transformasi matematis berlapis yang mengekstrak fitur
- **Output layer:** Menghasilkan prediksi akhir

### Mengapa "Deep"?

"Deep" dalam deep learning merujuk pada banyaknya hidden layers. Model modern bisa memiliki ratusan atau ribuan layer. Setiap layer belajar representasi yang semakin abstrak.

**Contoh untuk pengenalan wajah:**
- Layer 1: Mendeteksi tepi (edge)
- Layer 2: Mendeteksi bentuk sederhana (garis, kurva)
- Layer 3: Mendeteksi fitur wajah (mata, hidung, mulut)
- Layer 4+: Mendeteksi kombinasi fitur → identitas

### Arsitektur Neural Network Populer

**CNN (Convolutional Neural Network):**
- Dirancang untuk data grid (gambar, video)
- Menggunakan operasi konvolusi untuk mendeteksi pola lokal
- Basis dari hampir semua aplikasi computer vision

**RNN/LSTM (Recurrent Neural Network):**
- Dirancang untuk data sekuensial (teks, time series, audio)
- Memiliki "memori" dari input sebelumnya
- Kini sebagian besar digantikan oleh Transformer

**Transformer:**
- Revolusi NLP sejak 2017 ("Attention is All You Need")
- Basis dari GPT, BERT, T5, dan hampir semua LLM modern
- Menggunakan mekanisme "attention" untuk menangkap dependensi jarak jauh
- Sekarang juga digunakan untuk gambar (Vision Transformer/ViT)



## Keterbatasan AI yang Perlu Dipahami

### Kebutuhan Data yang Masif

Model deep learning membutuhkan data dalam jumlah besar untuk performa tinggi. Ini menciptakan masalah:
- Tidak semua domain punya data berlabel yang cukup
- Mengumpulkan dan melabeli data mahal
- Data historis mungkin tidak mencerminkan kondisi masa depan

### Komputasi yang Mahal

Training model besar membutuhkan:
- Ratusan GPU selama berminggu-minggu
- Biaya listrik yang sangat tinggi
- Infrastruktur cloud yang mahal

Inference (penggunaan model) lebih murah, tapi masih signifikan untuk skala besar.

### Black Box Problem

Model deep learning sulit diinterpretasikan — kita tidak selalu tahu *mengapa* model membuat keputusan tertentu. Ini bermasalah untuk:
- Aplikasi kritis (medis, hukum, kredit)
- Debugging ketika model salah
- Kepatuhan regulasi (GDPR, AI Act Eropa)

### Bias dalam Data Training

AI memperkuat bias yang ada dalam data training:
- Model rekrutmen yang bias terhadap gender tertentu
- Pengenalan wajah yang kurang akurat untuk warna kulit tertentu
- Sistem kredit yang diskriminatif

### Kerentanan Adversarial

AI bisa "dikelabui" oleh input yang dirancang khusus:
- Gambar yang dimodifikasi sedikit menyebabkan misklasifikasi dramatis
- Prompt injection pada LLM
- Serangan yang bisa bypass sistem keamanan berbasis AI

### Hallucination pada LLM

Model bahasa besar bisa menghasilkan informasi yang terdengar meyakinkan tapi salah — ini disebut "hallucination":
- Mengutip sumber yang tidak ada
- Memberikan fakta yang salah dengan penuh percaya diri
- Tidak selalu bisa membedakan apa yang diketahui vs. tidak diketahui



## Ringkasan Seri AI/ML Explained

Tiga artikel seri ini merangkum keseluruhan *AI/Machine Learning Explained* oleh Steve Blank:

| Artikel | Topik |
|---------|-------|
| 1 | Definisi, perbedaan AI/ML, mengapa sekarang, training vs inference |
| 2 | Kemampuan NLP, Computer Vision, Generative AI, aplikasi militer |
| 3 | Hardware, tipe ML, pipeline data science, neural networks, keterbatasan |

**Pesan utama Steve Blank:** AI adalah perubahan sekali seumur hidup — baik secara komersial maupun pertahanan. Memahami cara kerjanya bukan pilihan, melainkan keharusan bagi siapapun yang ingin membuat keputusan yang baik di dunia yang semakin digerakkan oleh AI.



**Sumber:** Steve Blank, *Artificial Intelligence/Machine Learning Explained*, Gordian Knot Center for National Security Innovation, Stanford University. [gordianknot.stanford.edu](https://gordianknot.stanford.edu)
