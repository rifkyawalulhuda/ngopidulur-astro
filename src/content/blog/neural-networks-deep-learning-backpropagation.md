---
title: "Neural Networks & Deep Learning: Forward Propagation, Backpropagation, dan Arsitektur Modern"
description: Dari perceptron sederhana ke deep neural networks — pahami forward
  propagation, backpropagation algorithm, gradient descent optimization,
  activation functions, regularization, dropout, batch normalization, dan tips
  training deep networks. Materi CS229 + best practices modern.
pubDate: 2026-06-24T12:00:00.000Z
image: /image/cs229-ml-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - MachineLearning
  - DeepLearning
  - NeuralNetworks
  - Backpropagation
  - AI
  - CS229
  - DataScience
---

**Neural Networks** adalah jantung dari revolusi deep learning. Dari pengenalan gambar hingga ChatGPT, dari AlphaGo hingga protein folding — semua dibangun di atas fondasi yang sama: jaringan neuron tiruan yang belajar dari data.

Artikel ini mengupas neural networks dari dasar hingga teknik training modern.

## Dari Perceptron ke Neural Network

### Single Neuron (Perceptron)

```
Input:     x₁, x₂, ..., xₙ
Weights:   w₁, w₂, ..., wₙ
Bias:      b
Activation: a = σ(wᵀx + b)
Output:    ŷ = a
```

### Neural Network: Multiple Neurons

```
Input Layer    Hidden Layer 1    Hidden Layer 2    Output
    x₁ ────→    a₁(1) ────→      a₁(2) ────→      ŷ
    x₂ ────→    a₂(1) ────→      a₂(2) ────→
    x₃ ────→    a₃(1)
```

Setiap layer adalah **fully connected** (dense) — setiap neuron di layer l terhubung ke semua neuron di layer l+1.

## Forward Propagation

```
z[l] = W[l] · a[l-1] + b[l]
a[l] = g[l](z[l])
```

Dimana:
- **W[l]**: weight matrix layer l
- **b[l]**: bias vector
- **g[l]**: activation function
- **a[0]** = x (input)
- **a[L]** = ŷ (output)

### Activation Functions

| Function | Formula | Range | Derivative |
|----------|---------|-------|------------|
| **Sigmoid** | σ(z) = 1/(1+e⁻ᶻ) | (0,1) | σ(z)(1-σ(z)) |
| **Tanh** | tanh(z) | (-1,1) | 1-tanh²(z) |
| **ReLU** | max(0,z) | [0,∞) | 0 if z<0 else 1 |
| **Leaky ReLU** | max(0.01z,z) | (-∞,∞) | 0.01 if z<0 else 1 |
| **Softmax** | eᶻ/∑eᶻ | (0,1) | softmax·(1-softmax) |

> **ReLU** adalah default modern — simple, fast, dan menghindari vanishing gradient.

## Cost Functions

| Problem | Cost Function | Formula |
|---------|--------------|---------|
| **Regression** | MSE | J = (1/m)∑(ŷ-y)² |
| **Binary Classification** | Cross-Entropy | J = -[y log ŷ + (1-y)log(1-ŷ)] |
| **Multi-Class** | Categorical Cross-Entropy | J = -∑y log ŷ |

## Backpropagation: The Magic

Backpropagation menghitung gradient ∂J/∂W dan ∂J/∂b untuk setiap layer — memungkinkan gradient descent mengupdate bobot.

### Intuisi: Chain Rule

```
∂J/∂W[L] = ∂J/∂a[L] · ∂a[L]/∂z[L] · ∂z[L]/∂W[L]
```

### Algorithm

```
1. Forward pass: hitung semua a[l] dan z[l]
2. Output error: δ[L] = ∂J/∂a[L] ⊙ g'[L](z[L])
3. Backward pass (l = L-1 down to 1):
     δ[l] = ((W[l+1])ᵀ · δ[l+1]) ⊙ g'[l](z[l])
4. Gradients:
     ∂J/∂W[l] = δ[l] · (a[l-1])ᵀ
     ∂J/∂b[l] = δ[l]
```

```python
# Backprop in numpy (pseudocode)
def backprop(X, Y, parameters, cache):
    grads = {}
    m = X.shape[1]
    
    # Output layer
    dZ_L = cache['A_L'] - Y
    grads['dW_L'] = (1/m) * dZ_L @ cache['A_L-1'].T
    grads['db_L'] = (1/m) * np.sum(dZ_L, axis=1, keepdims=True)
    
    # Hidden layers (reverse)
    dA = parameters['W_L'].T @ dZ_L
    for l in reversed(range(1, L)):
        dZ = dA * relu_derivative(cache[f'Z_{l}'])
        grads[f'dW_{l}'] = (1/m) * dZ @ cache[f'A_{l-1}'].T
        grads[f'db_{l}'] = (1/m) * np.sum(dZ, axis=1, keepdims=True)
        dA = parameters[f'W_{l}'].T @ dZ
    
    return grads
```

## Optimization Algorithms

### SGD with Momentum

```
v := βv + (1-β)∇J(θ)
θ := θ - αv
```

Momentum **mempercepat** gradient descent di arah yang konsisten dan **meredam** osilasi.

### Adam (Adaptive Moment Estimation)

```
m := β₁m + (1-β₁)∇J       ← first moment (mean)
v := β₂v + (1-β₂)(∇J)²    ← second moment (variance)
m̂ := m/(1-β₁ᵗ)             ← bias correction
v̂ := v/(1-β₂ᵗ)
θ := θ - α · m̂/(√v̂ + ε)
```

**Adam** = momentum + adaptive learning rate. Default optimizer modern.

## Regularization

### L2 Regularization (Weight Decay)

```
J_reg = J + (λ/2m) ∑ ||W[l]||²
```

Penalty untuk bobot besar → simpler model → less overfitting.

### Dropout

Setiap training iteration, **randomly drop** p% neuron:

```python
# Training
mask = np.random.rand(*A.shape) > keep_prob
A = A * mask / keep_prob  # scale untuk kompensasi dropout

# Inference: no dropout (gunakan semua neuron)
```

> Dropout = ensemble of subnetworks. Force network untuk tidak bergantung pada neuron tertentu.

### Batch Normalization

Normalisasi aktivasi setiap mini-batch:

```
μ = (1/m) ∑ zᵢ          ← mean
σ² = (1/m) ∑ (zᵢ - μ)²  ← variance
ẑᵢ = (zᵢ - μ) / √(σ² + ε)
```

Kemudian scale & shift dengan parameter learnable:

```
yᵢ = γẑᵢ + β
```

**Manfaat BatchNorm:**
- Mempercepat training (higher learning rate)
- Regularization (noise dari mini-batch statistics)
- Mengurangi sensitivity terhadap inisialisasi

## Best Practices Training Deep Networks

1. **Inisialisasi**: He initialization untuk ReLU, Xavier untuk Tanh
2. **Learning rate scheduling**: Mulai besar, gradually decay
3. **Early stopping**: Stop ketika validation error mulai naik
4. **Gradient clipping**: Batasi gradient untuk mencegah exploding
5. **Data augmentation**: Rotasi, flip, crop, noise injection
6. **Transfer learning**: Mulai dari pretrained model

## Kesimpulan

Neural networks modern adalah hasil dari decades of research — dari perceptron sederhana ke deep architectures dengan puluhan teknik regularisasi dan optimasi. Backpropagation + gradient descent adalah mesin yang menggerakkan revolusi AI.

Di artikel terakhir: **CNN, RNN/LSTM, dan Transformers** — arsitektur spesialis untuk computer vision, sequences, dan NLP.

---

*Referensi: Ng, A. & Ma, T. (2023). CS229 Lecture Notes. Stanford University.*
