---
title: "Stack dan Queue: Struktur Data LIFO dan FIFO dengan Implementasi C"
description: Panduan lengkap Stack dan Queue dalam struktur data — memahami
  konsep LIFO dan FIFO, operasi push/pop/peek pada Stack, enqueue/dequeue pada
  Queue, implementasi menggunakan array di C, evaluasi ekspresi infix/postfix,
  dan aplikasi nyata dalam pemrograman.
pubDate: 2026-06-29T18:00:00.000Z
image: /image/dsa-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - StrukturData
  - Stack
  - Queue
  - LIFO
  - FIFO
  - Algorithm
  - C
  - DataStructure
---

**Stack dan Queue** adalah dua struktur data yang paling sering kamu temui tanpa disadari — dari tombol undo/redo di text editor, hingga antrian print dokumen di printer. Keduanya sederhana tapi sangat powerful.

## Stack: Last In First Out (LIFO)

### Konsep Dasar

Stack bekerja seperti tumpukan piring — kamu hanya bisa mengambil atau meletakkan piring **dari atas**. Piring terakhir yang diletakkan adalah yang pertama diambil.

```
    |  |
    |30|  ← TOP (terakhir masuk, pertama keluar)
    |20|
    |10|
    |__|
```

**LIFO = Last In, First Out**

### Operasi Dasar Stack

| Operasi | Deskripsi |
|---------|-----------|
| `push(x)` | Masukkan elemen x ke atas stack |
| `pop()` | Ambil dan hapus elemen teratas |
| `peek()` | Lihat elemen teratas tanpa menghapus |
| `isFull()` | Cek apakah stack penuh |
| `isEmpty()` | Cek apakah stack kosong |

### Implementasi Stack dengan Array (C)

```c
#include <stdio.h>
#define MAXSIZE 10

int stack[MAXSIZE];
int top = -1;

// Push: masukkan elemen
void push(int data) {
    if (top == MAXSIZE - 1) {
        printf("Stack Overflow! Stack penuh.\n");
        return;
    }
    stack[++top] = data;
    printf("Push: %d\n", data);
}

// Pop: ambil elemen teratas
int pop() {
    if (top == -1) {
        printf("Stack Underflow! Stack kosong.\n");
        return -1;
    }
    return stack[top--];
}

// Peek: lihat elemen teratas
int peek() {
    if (top == -1) {
        printf("Stack kosong.\n");
        return -1;
    }
    return stack[top];
}

// isEmpty
int isEmpty() {
    return top == -1;
}

// isFull
int isFull() {
    return top == MAXSIZE - 1;
}

int main() {
    push(10);
    push(20);
    push(30);
    printf("Peek: %d\n", peek());   // 30
    printf("Pop: %d\n", pop());     // 30
    printf("Pop: %d\n", pop());     // 20
    printf("Peek: %d\n", peek());   // 10
    return 0;
}
```

### Evaluasi Ekspresi dengan Stack

Stack digunakan untuk **mengonversi dan mengevaluasi ekspresi matematika**.

#### Notasi Infix, Prefix, Postfix

| Notasi | Contoh | Keterangan |
|--------|--------|-----------|
| **Infix** | `A + B` | Operator di tengah (biasa kita tulis) |
| **Prefix** | `+ A B` | Operator di depan (Polish notation) |
| **Postfix** | `A B +` | Operator di belakang (Reverse Polish) |

#### Konversi Infix ke Postfix

Aturan **precedence** operator:
```
^ (pangkat)   → prioritas 3 (tertinggi)
* /           → prioritas 2
+ -           → prioritas 1 (terendah)
```

**Contoh:** `A + B * C - D` → `A B C * + D -`

```
Langkah:
1. Baca A → output: A
2. Baca + → push ke stack
3. Baca B → output: A B
4. Baca * → prioritas lebih tinggi dari +, push
5. Baca C → output: A B C
6. Baca - → pop * dan +, push -: output: A B C * +
7. Baca D → output: A B C * + D
8. Kosongkan stack: output: A B C * + D -
```

#### Evaluasi Postfix

```c
int evaluatePostfix(char* expr) {
    int stack[100], top = -1;
    
    for (int i = 0; expr[i]; i++) {
        if (isdigit(expr[i])) {
            stack[++top] = expr[i] - '0';
        } else {
            int b = stack[top--];
            int a = stack[top--];
            switch(expr[i]) {
                case '+': stack[++top] = a + b; break;
                case '-': stack[++top] = a - b; break;
                case '*': stack[++top] = a * b; break;
                case '/': stack[++top] = a / b; break;
            }
        }
    }
    return stack[top];
}
```

### Aplikasi Stack

1. **Undo/Redo** — text editor menyimpan histori aksi
2. **Browser Back/Forward** — riwayat halaman
3. **Rekursi** — call stack untuk fungsi rekursif
4. **Pengecekan kurung seimbang** — `{[()]}` valid atau tidak
5. **Evaluasi ekspresi** — kalkulator

---

## Queue: First In First Out (FIFO)

### Konsep Dasar

Queue bekerja seperti antrian di kasir — yang pertama datang adalah yang pertama dilayani.

```
REAR →  [40][30][20][10] → FRONT
         ↑                    ↑
      (masuk terakhir)   (keluar pertama)
```

**FIFO = First In, First Out**

### Operasi Dasar Queue

| Operasi | Deskripsi |
|---------|-----------|
| `enqueue(x)` | Masukkan elemen x ke belakang (rear) |
| `dequeue()` | Ambil dan hapus elemen terdepan (front) |
| `peek()` | Lihat elemen terdepan tanpa menghapus |
| `isFull()` | Cek apakah queue penuh |
| `isEmpty()` | Cek apakah queue kosong |

### Implementasi Queue dengan Array (C)

```c
#include <stdio.h>
#define MAXSIZE 10

int queue[MAXSIZE];
int front = -1, rear = -1;

// Enqueue
void enqueue(int data) {
    if (rear == MAXSIZE - 1) {
        printf("Queue penuh!\n");
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = data;
    printf("Enqueue: %d\n", data);
}

// Dequeue
int dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue kosong!\n");
        return -1;
    }
    return queue[front++];
}

// Peek
int peek() {
    if (front == -1) return -1;
    return queue[front];
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    printf("Dequeue: %d\n", dequeue());  // 10
    printf("Dequeue: %d\n", dequeue());  // 20
    printf("Peek: %d\n", peek());        // 30
    return 0;
}
```

### Circular Queue

Masalah linear queue: setelah banyak dequeue, ruang di depan terbuang sia-sia. **Circular Queue** mengatasinya dengan memutar index:

```c
int front = -1, rear = -1;

void enqueue(int data) {
    if ((rear + 1) % MAXSIZE == front) {
        printf("Queue penuh!\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAXSIZE;
    queue[rear] = data;
}

int dequeue() {
    if (front == -1) {
        printf("Queue kosong!\n");
        return -1;
    }
    int data = queue[front];
    if (front == rear) {
        front = rear = -1;  // reset ke kosong
    } else {
        front = (front + 1) % MAXSIZE;
    }
    return data;
}
```

### Multiple Stack dan Queue

Ketika satu array digunakan untuk **dua stack sekaligus**:

```
Array: [0][1][2]...[n/2]...[n]
        ↑ Stack 1 →    ← Stack 2 ↑
       top1                    top2
```

- Stack 1 tumbuh dari kiri ke kanan
- Stack 2 tumbuh dari kanan ke kiri
- **Overflow** hanya terjadi ketika `top1 + 1 == top2`

### Aplikasi Queue

1. **CPU Scheduling** — proses menunggu giliran
2. **Print Queue** — dokumen menunggu printer
3. **BFS (Breadth-First Search)** — traversal graph
4. **Buffer I/O** — keyboard buffer, network buffer
5. **Simulasi antrian** — bank, rumah sakit

---

## Perbandingan Stack vs Queue

| Aspek | Stack | Queue |
|-------|-------|-------|
| **Prinsip** | LIFO | FIFO |
| **Masuk** | `push()` dari atas | `enqueue()` dari belakang |
| **Keluar** | `pop()` dari atas | `dequeue()` dari depan |
| **Akses** | Hanya satu ujung | Dua ujung (front & rear) |
| **Contoh nyata** | Tumpukan piring | Antrian kasir |
| **Penggunaan** | Rekursi, undo/redo | Scheduling, BFS |

## Kesimpulan

Stack dan Queue adalah dua struktur data paling fundamental. Stack dengan LIFO-nya sangat cocok untuk masalah rekursi dan evaluasi ekspresi, sementara Queue dengan FIFO-nya ideal untuk scheduling dan traversal graph.

Di artikel berikutnya: **Linked List** — struktur data dinamis yang lebih fleksibel dari array.

---

*Referensi: Data Structure and Algorithm, Unit I — Stacks, Queues, Evaluation of Expressions.*
