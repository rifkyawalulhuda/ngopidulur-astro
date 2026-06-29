---
title: "Sorting dan Searching: Algoritma Pengurutan dan Pencarian yang Wajib Dikuasai Programmer"
description: Panduan lengkap algoritma sorting dan searching — Bubble Sort,
  Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Binary Search, Linear
  Search, dan Hash Table. Dilengkapi implementasi C, analisis kompleksitas Big-O,
  dan panduan memilih algoritma yang tepat untuk setiap situasi.
pubDate: 2026-06-29T21:00:00.000Z
image: /image/dsa-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - StrukturData
  - Sorting
  - Searching
  - Algorithm
  - BigO
  - BubbleSort
  - QuickSort
  - BinarySearch
  - C
---

**Sorting dan searching** adalah dua operasi paling fundamental dalam ilmu komputer. Hampir setiap aplikasi yang kamu bangun — dari e-commerce hingga sistem manajemen — membutuhkan kemampuan mengurutkan dan mencari data secara efisien.

## Notasi Big-O: Mengukur Efisiensi Algoritma

Sebelum membahas algoritma, pahami dulu **Big-O notation** — cara mengukur efisiensi algoritma berdasarkan ukuran input `n`.

| Notasi | Nama | Contoh |
|--------|------|--------|
| O(1) | Constant | Akses array by index |
| O(log n) | Logarithmic | Binary Search |
| O(n) | Linear | Linear Search |
| O(n log n) | Linearithmic | Merge Sort, Quick Sort |
| O(n²) | Quadratic | Bubble Sort, Selection Sort |
| O(2ⁿ) | Exponential | Fibonacci rekursif |

---

## Algoritma Sorting

### 1. Bubble Sort

**Cara kerja:** Bandingkan dua elemen berdekatan, tukar jika tidak urut. Ulangi hingga tidak ada swap.

```c
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        // Optimasi: stop jika tidak ada swap
        if (!swapped) break;
    }
}
```

**Visualisasi:**
```
[64, 34, 25, 12, 22, 11, 90]
Pass 1: [34, 25, 12, 22, 11, 64, 90]  ← 90 naik ke atas
Pass 2: [25, 12, 22, 11, 34, 64, 90]  ← 64 ke posisi
Pass 3: [12, 22, 11, 25, 34, 64, 90]
...
Final:  [11, 12, 22, 25, 34, 64, 90]
```

| | Best | Average | Worst | Space |
|-|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |

---

### 2. Selection Sort

**Cara kerja:** Cari elemen terkecil, pindahkan ke posisi paling kiri. Ulangi untuk sisa array.

```c
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        // Swap elemen terkecil ke posisi i
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}
```

**Visualisasi:**
```
[64, 25, 12, 22, 11]
Pass 1: min=11 → [11, 25, 12, 22, 64]
Pass 2: min=12 → [11, 12, 25, 22, 64]
Pass 3: min=22 → [11, 12, 22, 25, 64]
Pass 4: min=25 → [11, 12, 22, 25, 64] (sudah urut)
```

| | Best | Average | Worst | Space |
|-|------|---------|-------|-------|
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |

---

### 3. Insertion Sort

**Cara kerja:** Ambil satu elemen, sisipkan ke posisi yang tepat di bagian kiri yang sudah terurut.

```c
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Geser elemen yang lebih besar ke kanan
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

**Visualisasi:**
```
[12, 11, 13, 5, 6]
i=1: key=11 → [11, 12, 13, 5, 6]
i=2: key=13 → [11, 12, 13, 5, 6]
i=3: key=5  → [5, 11, 12, 13, 6]
i=4: key=6  → [5, 6, 11, 12, 13]
```

| | Best | Average | Worst | Space |
|-|------|---------|-------|-------|
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |

> **Keunggulan:** Sangat efisien untuk array yang **hampir terurut** atau data kecil.

---

### 4. Merge Sort

**Cara kerja:** Divide and Conquer — bagi array menjadi dua, sort masing-masing rekursif, lalu merge.

```c
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
```

**Visualisasi:**
```
[38, 27, 43, 3, 9, 82, 10]
     ↓ Divide
[38, 27, 43]    [3, 9, 82, 10]
[38] [27,43]  [3,9] [82,10]
     ↓ Merge
[27,38,43]    [3,9,10,82]
     ↓ Final merge
[3, 9, 10, 27, 38, 43, 82]
```

| | Best | Average | Worst | Space |
|-|------|---------|-------|-------|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |

---

### 5. Quick Sort

**Cara kerja:** Pilih **pivot**, partisi array (kiri < pivot < kanan), sort rekursif.

```c
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

| | Best | Average | Worst | Space |
|-|------|---------|-------|-------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

> **Worst case** terjadi saat pivot selalu elemen terkecil/terbesar (array sudah terurut). Diatasi dengan **random pivot** atau **median-of-three**.

---

## Algoritma Searching

### 1. Linear Search

**Cara kerja:** Periksa setiap elemen satu per satu dari awal hingga akhir.

```c
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;  // kembalikan index
    }
    return -1;  // tidak ditemukan
}
```

| | Best | Average | Worst |
|-|------|---------|-------|
| Linear Search | O(1) | O(n) | O(n) |

**Cocok untuk:** Array kecil atau tidak terurut.

---

### 2. Binary Search

**Cara kerja:** Pada array **terurut**, bandingkan target dengan elemen tengah. Jika lebih kecil, cari di kiri; jika lebih besar, cari di kanan.

```c
// Iteratif
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

// Rekursif
int binarySearchRec(int arr[], int low, int high, int target) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearchRec(arr, mid+1, high, target);
    return binarySearchRec(arr, low, mid-1, target);
}
```

**Visualisasi (cari 23 dalam [1,3,5,7,9,11,13,15,17,19,21,23]):**
```
low=0, high=11, mid=5 → arr[5]=11 < 23 → cari kanan
low=6, high=11, mid=8 → arr[8]=17 < 23 → cari kanan
low=9, high=11, mid=10 → arr[10]=21 < 23 → cari kanan
low=11, high=11, mid=11 → arr[11]=23 ✓ DITEMUKAN!
```

| | Best | Average | Worst |
|-|------|---------|-------|
| Binary Search | O(1) | O(log n) | O(log n) |

---

## Perbandingan Semua Algoritma

| Algoritma | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Linear Search | O(1) | O(n) | O(n) | O(1) | — |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) | — |

> **Stable sort** = elemen dengan nilai sama mempertahankan urutan aslinya.

## Panduan Memilih Algoritma

| Kondisi | Algoritma Terbaik |
|---------|------------------|
| Data kecil (n < 50) | Insertion Sort |
| Data hampir terurut | Insertion Sort |
| Data besar, butuh garanteed O(n log n) | Merge Sort |
| Data besar, average case terbaik | Quick Sort |
| Butuh stable sort | Merge Sort |
| Array tidak terurut, cari sekali | Linear Search |
| Array terurut, cari berulang | Binary Search |

## Kesimpulan

Sorting dan searching adalah **fondasi algoritma**. Tidak ada satu algoritma yang terbaik untuk semua situasi — pilihan tergantung ukuran data, ketersediaan memori, dan apakah data sudah terurut.

Dengan menguasai Big-O notation dan memahami trade-off setiap algoritma, kamu bisa membuat keputusan yang tepat dalam merancang sistem yang efisien.

---

*Referensi: Data Structure and Algorithm — Sorting Algorithms, Searching, Complexity Analysis.*
