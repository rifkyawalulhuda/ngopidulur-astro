---
title: "Tree dan Graph: Struktur Data Non-Linear untuk Hierarki dan Jaringan"
description: Panduan lengkap Tree dan Graph dalam struktur data — Binary Tree,
  BST, AVL Tree, traversal inorder/preorder/postorder, representasi graph
  adjacency matrix vs list, DFS dan BFS, serta aplikasi nyata dalam sistem
  file, database, dan jaringan komputer.
pubDate: 2026-06-29T20:00:00.000Z
image: /image/dsa-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - StrukturData
  - Tree
  - Graph
  - BinaryTree
  - BST
  - DFS
  - BFS
  - Algorithm
---

**Tree dan Graph** adalah struktur data non-linear yang memodelkan hubungan hierarkis dan jaringan — dari sistem file komputer hingga peta jalan kota, dari database index hingga jaringan sosial.

## Tree (Pohon)

### Konsep Dasar

Tree adalah struktur hierarkis dengan **satu root** dan node-node yang terhubung tanpa siklus.

```
         [10]          ← Root
        /    \
      [5]    [15]      ← Internal nodes
     /   \      \
   [3]   [7]   [20]   ← Leaf nodes
```

### Terminologi

| Istilah | Pengertian |
|---------|-----------|
| **Root** | Node paling atas, tidak punya parent |
| **Parent** | Node yang punya child |
| **Child** | Node turunan dari parent |
| **Leaf** | Node tanpa child |
| **Height** | Jarak terpanjang dari root ke leaf |
| **Depth** | Jarak dari root ke node tertentu |
| **Subtree** | Tree yang berakar dari node tertentu |
| **Degree** | Jumlah child dari sebuah node |

### Binary Tree

Binary Tree adalah tree di mana setiap node punya **maksimal 2 child** (left dan right).

```c
struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int data) {
    struct TreeNode* node = malloc(sizeof(struct TreeNode));
    node->data = data;
    node->left = node->right = NULL;
    return node;
}
```

### Traversal Binary Tree

Ada 3 cara menelusuri Binary Tree:

#### 1. Inorder (Left → Root → Right)

```c
void inorder(struct TreeNode* root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}
// Output: 3 5 7 10 15 20
```

#### 2. Preorder (Root → Left → Right)

```c
void preorder(struct TreeNode* root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}
// Output: 10 5 3 7 15 20
```

#### 3. Postorder (Left → Right → Root)

```c
void postorder(struct TreeNode* root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}
// Output: 3 7 5 20 15 10
```

### Binary Search Tree (BST)

BST adalah Binary Tree dengan properti khusus:
- **Left subtree** hanya berisi nilai **lebih kecil** dari root
- **Right subtree** hanya berisi nilai **lebih besar** dari root

```
        [50]
       /    \
    [30]    [70]
   /    \   /  \
 [20]  [40][60][80]
```

#### Insert di BST

```c
struct TreeNode* insert(struct TreeNode* root, int data) {
    if (root == NULL) return createNode(data);
    
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    
    return root;
}
```

#### Search di BST

```c
struct TreeNode* search(struct TreeNode* root, int data) {
    if (root == NULL || root->data == data)
        return root;
    
    if (data < root->data)
        return search(root->left, data);
    return search(root->right, data);
}
// Kompleksitas: O(log n) average, O(n) worst case
```

#### Delete di BST

```c
struct TreeNode* minNode(struct TreeNode* node) {
    while (node->left != NULL)
        node = node->left;
    return node;
}

struct TreeNode* deleteNode(struct TreeNode* root, int data) {
    if (root == NULL) return NULL;
    
    if (data < root->data)
        root->left = deleteNode(root->left, data);
    else if (data > root->data)
        root->right = deleteNode(root->right, data);
    else {
        // Node ditemukan
        if (root->left == NULL) {
            struct TreeNode* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct TreeNode* temp = root->left;
            free(root);
            return temp;
        }
        // Node dengan 2 child: ganti dengan inorder successor
        struct TreeNode* temp = minNode(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}
```

### Tipe-Tipe Tree

| Tipe | Karakteristik | Kegunaan |
|------|--------------|---------|
| **Binary Tree** | Max 2 child | Traversal, ekspresi |
| **BST** | Left < Root < Right | Search O(log n) |
| **AVL Tree** | BST + balanced | Database index |
| **Heap** | Parent > semua child | Priority Queue |
| **B-Tree** | Multi-child, balanced | File system, DB |
| **Trie** | Karakter per node | Autocomplete |

---

## Graph

### Konsep Dasar

Graph adalah kumpulan **vertex (node)** yang terhubung oleh **edge (sisi)**. Berbeda dengan tree, graph bisa punya siklus dan tidak harus punya root.

```
    A ——— B
   / \   / \
  C   D—E   F
```

### Terminologi Graph

| Istilah | Pengertian |
|---------|-----------|
| **Vertex (V)** | Node dalam graph |
| **Edge (E)** | Koneksi antara dua vertex |
| **Directed** | Edge punya arah (A→B beda dengan B→A) |
| **Undirected** | Edge tanpa arah |
| **Weighted** | Edge punya bobot/jarak |
| **Adjacent** | Dua vertex yang terhubung langsung |
| **Degree** | Jumlah edge yang terhubung ke vertex |
| **Path** | Urutan vertex yang terhubung |
| **Cycle** | Path yang kembali ke starting vertex |

### Representasi Graph

#### 1. Adjacency Matrix

```
Vertex: A=0, B=1, C=2, D=3

     A  B  C  D
A  [ 0  1  1  0 ]
B  [ 1  0  0  1 ]
C  [ 1  0  0  1 ]
D  [ 0  1  1  0 ]
```

```c
#define V 4
int graph[V][V] = {
    {0, 1, 1, 0},
    {1, 0, 0, 1},
    {1, 0, 0, 1},
    {0, 1, 1, 0}
};

// Cek edge A-B: graph[0][1] == 1
```

**Kelebihan:** Cek edge O(1)
**Kekurangan:** Memori O(V²), boros untuk sparse graph

#### 2. Adjacency List

```c
struct AdjNode {
    int dest;
    struct AdjNode* next;
};

struct Graph {
    int numVertices;
    struct AdjNode** adjLists;
};
```

**Kelebihan:** Memori O(V+E), efisien untuk sparse graph
**Kekurangan:** Cek edge O(V)

### Graph Traversal

#### DFS (Depth First Search)

Telusuri sedalam mungkin sebelum backtrack — gunakan **Stack**.

```c
void dfs(int graph[V][V], int visited[], int vertex) {
    visited[vertex] = 1;
    printf("%d ", vertex);
    
    for (int i = 0; i < V; i++) {
        if (graph[vertex][i] == 1 && !visited[i])
            dfs(graph, visited, i);
    }
}

// Mulai dari vertex 0
int visited[V] = {0};
dfs(graph, visited, 0);
```

#### BFS (Breadth First Search)

Telusuri semua tetangga dulu sebelum ke level berikutnya — gunakan **Queue**.

```c
void bfs(int graph[V][V], int start) {
    int visited[V] = {0};
    int queue[V], front = 0, rear = 0;
    
    visited[start] = 1;
    queue[rear++] = start;
    
    while (front < rear) {
        int vertex = queue[front++];
        printf("%d ", vertex);
        
        for (int i = 0; i < V; i++) {
            if (graph[vertex][i] == 1 && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
}
```

### Perbandingan DFS vs BFS

| Aspek | DFS | BFS |
|-------|-----|-----|
| **Struktur** | Stack (rekursif) | Queue |
| **Memori** | O(h) — tinggi tree | O(w) — lebar tree |
| **Optimal** | Tidak (jarak terpendek) | Ya (BFS menemukan jalur terpendek) |
| **Cocok untuk** | Cycle detection, topological sort | Shortest path, level-order |

### Aplikasi Graph

| Algoritma | Kegunaan |
|-----------|---------|
| **Dijkstra** | Rute terpendek (GPS, jaringan) |
| **Kruskal/Prim** | Minimum Spanning Tree (jaringan kabel) |
| **Topological Sort** | Dependency resolution (package manager) |
| **BFS** | Social network (teman dalam N langkah) |
| **DFS** | Maze solving, web crawler |

## Kesimpulan

Tree dan Graph adalah struktur data yang memodelkan **dunia nyata**:
- **Tree** → hierarki (file system, DOM HTML, org chart)
- **Graph** → jaringan (peta, social media, internet)

Pemahaman mendalam tentang traversal DFS dan BFS adalah fondasi untuk menyelesaikan masalah algoritma tingkat lanjut.

Di artikel berikutnya: **Sorting dan Searching** — algoritma fundamental yang wajib dikuasai setiap programmer.

---

*Referensi: Data Structure and Algorithm — Trees, Graphs, BFS, DFS.*
