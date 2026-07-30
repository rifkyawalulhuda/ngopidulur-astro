---
title: "Linked List: Struktur Data Dinamis dengan Implementasi Singly, Doubly, dan Circular Linked List"
description: Panduan lengkap Linked List dalam struktur data — memahami konsep
  node dan pointer, perbedaan Singly, Doubly, dan Circular Linked List,
  operasi insert/delete/traverse, linked stack dan queue, serta perbandingan
  dengan array. Dilengkapi implementasi C yang lengkap.
pubDate: 2026-06-29T19:00:00.000Z
image: /image/dsa-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - StrukturData
  - LinkedList
  - Pointer
  - Algorithm
  - C
  - DataStructure
  - DynamicMemory
series: "DSA C"
seriesOrder: 2
---

**Linked List** adalah solusi untuk keterbatasan array — ukuran dinamis, insert/delete efisien di mana saja, tanpa perlu memindahkan elemen lain. Tapi ada trade-off: akses acak lebih lambat.

## Konsep Dasar Linked List

Linked List adalah kumpulan **node** yang terhubung satu sama lain via **pointer**.

```
[data|next] → [data|next] → [data|next] → NULL
    10             20             30
```

Setiap node terdiri dari:
1. **Data** — nilai yang disimpan
2. **Next pointer** — alamat node berikutnya

### Perbedaan Array vs Linked List

| Aspek | Array | Linked List |
|-------|-------|-------------|
| **Ukuran** | Fixed (static) | Dynamic |
| **Memori** | Contiguous | Tersebar |
| **Akses** | O(1) — random access | O(n) — sequential |
| **Insert/Delete** | O(n) — geser elemen | O(1) — ubah pointer |
| **Overhead** | Tidak ada | Pointer per node |

## Singly Linked List

Setiap node hanya punya **satu pointer** ke node berikutnya.

```
HEAD → [10|→] → [20|→] → [30|→] → NULL
```

### Struktur Node (C)

```c
struct Node {
    int data;
    struct Node* next;
};
```

### Operasi Dasar

#### Membuat Node Baru

```c
struct Node* createNode(int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}
```

#### Insert di Awal (Prepend)

```c
void insertFront(struct Node** head, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}
```

#### Insert di Akhir (Append)

```c
void insertEnd(struct Node** head, int data) {
    struct Node* newNode = createNode(data);
    if (*head == NULL) {
        *head = newNode;
        return;
    }
    struct Node* temp = *head;
    while (temp->next != NULL)
        temp = temp->next;
    temp->next = newNode;
}
```

#### Insert di Posisi Tertentu

```c
void insertAt(struct Node** head, int pos, int data) {
    if (pos == 0) {
        insertFront(head, data);
        return;
    }
    struct Node* newNode = createNode(data);
    struct Node* temp = *head;
    for (int i = 0; i < pos - 1 && temp != NULL; i++)
        temp = temp->next;
    if (temp == NULL) return;
    newNode->next = temp->next;
    temp->next = newNode;
}
```

#### Delete Node

```c
void deleteNode(struct Node** head, int data) {
    struct Node* temp = *head;
    
    // Hapus head
    if (temp != NULL && temp->data == data) {
        *head = temp->next;
        free(temp);
        return;
    }
    
    // Cari node
    struct Node* prev = NULL;
    while (temp != NULL && temp->data != data) {
        prev = temp;
        temp = temp->next;
    }
    if (temp == NULL) return;
    
    prev->next = temp->next;
    free(temp);
}
```

#### Traverse (Cetak Semua)

```c
void printList(struct Node* head) {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d → ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}
```

### Linked List untuk Penjumlahan Polinomial

Linked List sangat cocok untuk representasi **polinomial** seperti `3x² + 2x + 1`:

```c
struct Term {
    int coeff;    // koefisien
    int exp;      // eksponen
    struct Term* next;
};

// 3x^2 + 2x + 1
// [3|2|→] → [2|1|→] → [1|0|→] → NULL
```

Penjumlahan dua polinomial:
```c
struct Term* addPolynomial(struct Term* p1, struct Term* p2) {
    struct Term* result = NULL;
    
    while (p1 != NULL && p2 != NULL) {
        if (p1->exp == p2->exp) {
            // Eksponen sama: jumlahkan koefisien
            insertTerm(&result, p1->coeff + p2->coeff, p1->exp);
            p1 = p1->next;
            p2 = p2->next;
        } else if (p1->exp > p2->exp) {
            insertTerm(&result, p1->coeff, p1->exp);
            p1 = p1->next;
        } else {
            insertTerm(&result, p2->coeff, p2->exp);
            p2 = p2->next;
        }
    }
    // Sisakan yang tersisa
    while (p1 != NULL) { insertTerm(&result, p1->coeff, p1->exp); p1 = p1->next; }
    while (p2 != NULL) { insertTerm(&result, p2->coeff, p2->exp); p2 = p2->next; }
    return result;
}
```

## Doubly Linked List

Setiap node punya **dua pointer** — ke node sebelumnya (`prev`) dan berikutnya (`next`).

```
NULL ← [←|10|→] ↔ [←|20|→] ↔ [←|30|→] → NULL
```

### Struktur Node

```c
struct DNode {
    int data;
    struct DNode* prev;
    struct DNode* next;
};
```

### Keunggulan Doubly vs Singly

| | Singly | Doubly |
|-|--------|--------|
| **Traversal** | Forward saja | Forward & backward |
| **Delete node** | Butuh pointer prev | Langsung dari node |
| **Memori per node** | 1 pointer | 2 pointer |
| **Insert sebelum node** | O(n) | O(1) |

### Insert di Doubly Linked List

```c
void insertAfter(struct DNode* prev_node, int data) {
    struct DNode* newNode = (struct DNode*)malloc(sizeof(struct DNode));
    newNode->data = data;
    newNode->next = prev_node->next;
    newNode->prev = prev_node;
    
    if (prev_node->next != NULL)
        prev_node->next->prev = newNode;
    prev_node->next = newNode;
}
```

## Circular Linked List

Node terakhir menunjuk kembali ke node **pertama** — membentuk lingkaran.

```
HEAD → [10|→] → [20|→] → [30|→]
          ↑________________________|
```

### Penggunaan

- **Round-robin scheduling** — giliran proses secara berputar
- **Music player** — repeat playlist
- **Buffer ring** — data streaming

```c
// Traverse circular linked list
void printCircular(struct Node* head) {
    if (head == NULL) return;
    struct Node* temp = head;
    do {
        printf("%d → ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("(kembali ke head)\n");
}
```

## Linked Stack dan Queue

Stack dan Queue bisa diimplementasikan dengan Linked List untuk ukuran **dinamis** tanpa batasan `MAXSIZE`.

### Linked Stack

```c
// Push = insert di depan
void linkedPush(struct Node** top, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = *top;
    *top = newNode;
}

// Pop = hapus dari depan
int linkedPop(struct Node** top) {
    if (*top == NULL) return -1;
    struct Node* temp = *top;
    int data = temp->data;
    *top = temp->next;
    free(temp);
    return data;
}
```

### Linked Queue

```c
struct Queue {
    struct Node* front;
    struct Node* rear;
};

void linkedEnqueue(struct Queue* q, int data) {
    struct Node* newNode = createNode(data);
    if (q->rear != NULL)
        q->rear->next = newNode;
    q->rear = newNode;
    if (q->front == NULL)
        q->front = newNode;
}

int linkedDequeue(struct Queue* q) {
    if (q->front == NULL) return -1;
    struct Node* temp = q->front;
    int data = temp->data;
    q->front = temp->next;
    if (q->front == NULL) q->rear = NULL;
    free(temp);
    return data;
}
```

## Kesimpulan

Linked List memberikan **fleksibilitas dinamis** yang tidak dimiliki array. Pilih struktur yang tepat berdasarkan kebutuhan:

- **Array** → akses acak sering, ukuran tetap
- **Singly Linked List** → insert/delete di awal/akhir sering
- **Doubly Linked List** → butuh traversal dua arah
- **Circular Linked List** → aplikasi berputar (scheduling, buffer)

Di artikel berikutnya: **Trees dan Graph** — struktur data non-linear untuk hierarki dan jaringan.

---

*Referensi: Data Structure and Algorithm, Unit I — Singly Linked List, Linked Stacks and Queues, Polynomial Addition.*
