---
title: "Prompt Engineering Lanjutan: CoT, ToT, ReAct, dan Code Prompting"
description: Teknik prompt engineering tingkat lanjut dari whitepaper Google -
  Step-back prompting, Chain of Thought, Self-consistency, Tree of Thoughts,
  ReAct dengan tool use, Automatic Prompt Engineering, dan code prompting.
pubDate: 2026-09-02T08:00:00.000Z
image: /image/prompt-engineering-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - PromptEngineering
  - LLM
  - ChainOfThought
  - AI
series: "Prompt Engineering"
seriesOrder: 2
---

Teknik dasar prompting sudah dikuasai — sekarang saatnya naik level. Whitepaper Google oleh Lee Boonstra membahas teknik-teknik lanjutan yang bisa meningkatkan akurasi reasoning LLM secara dramatis. Dari Chain of Thought yang memaksa model berpikir langkah demi langkah, hingga ReAct yang menggabungkan reasoning dengan tool use.

## Daftar Isi

- [Step-Back Prompting](#step-back-prompting)
- [Chain of Thought (CoT)](#chain-of-thought)
- [Self-Consistency](#self-consistency)
- [Tree of Thoughts (ToT)](#tree-of-thoughts)
- [ReAct: Reason and Act](#react-reason-and-act)
- [Automatic Prompt Engineering](#automatic-prompt-engineering)
- [Code Prompting](#code-prompting)



## Step-Back Prompting

Step-back prompting adalah teknik di mana model diminta untuk mundur selangkah dan mempertimbangkan prinsip yang lebih umum sebelum menjawab pertanyaan spesifik.

### Cara Kerja

Daripada langsung menjawab pertanyaan spesifik, model pertama-tama mengidentifikasi konsep atau prinsip umum di balik pertanyaan tersebut, kemudian menggunakannya untuk memberikan jawaban yang lebih akurat.

### Contoh Step-Back

**Tanpa Step-Back:**
```
Prompt: Apa yang terjadi pada tekanan gas jika suhu meningkat?

Output: Tekanan meningkat.
```

**Dengan Step-Back:**
```
Prompt: Sebelum menjawab, identifikasi terlebih dahulu hukum fisika
yang relevan dengan pertanyaan ini. Kemudian gunakan hukum tersebut
untuk menjawab: Apa yang terjadi pada tekanan gas jika suhu meningkat?

Output: Hukum yang relevan adalah Hukum Gay-Lussac: pada volume tetap,
tekanan gas berbanding lurus dengan temperatur absolutnya (P/T = konstan).

Berdasarkan hukum ini: jika suhu meningkat, tekanan gas juga meningkat
secara proporsional, asalkan volume tetap konstan.
```

Step-back membantu model mengaktifkan pengetahuan yang lebih luas sebelum menerapkannya ke kasus spesifik.



## Chain of Thought (CoT) {#chain-of-thought}

Chain of Thought (CoT) adalah teknik untuk meningkatkan kemampuan reasoning LLM dengan menghasilkan langkah-langkah penalaran antara (*intermediate reasoning steps*).

### Mengapa LLM Butuh CoT?

LLM sering kesulitan dengan tugas matematika dan reasoning kompleks:

```
Prompt (tanpa CoT):
When I was 3 years old, my partner was 3 times my age.
Now I am 20 years old. How old is my partner?

Output: 17 years old.  ← SALAH!
```

```
Prompt (dengan zero-shot CoT):
When I was 3 years old, my partner was 3 times my age.
Now I am 20 years old. How old is my partner?
Let's think step by step.

Output:
1. When I was 3, my partner was 3 × 3 = 9 years old.
2. The age difference is 9 - 3 = 6 years.
3. My partner is always 6 years older.
4. Now I am 20, so my partner is 20 + 6 = 26 years old.

The answer is 26.  ← BENAR!
```

### Zero-Shot CoT

Cukup tambahkan frasa "Let's think step by step" atau "Explain your reasoning":

```
Prompt:
A store has 150 apples. They sell 40% on Monday and 25% of
the remainder on Tuesday. How many apples are left?
Let's think step by step.

Output:
1. Monday: 150 × 40% = 60 apples sold. Remaining: 150 - 60 = 90
2. Tuesday: 90 × 25% = 22.5 ≈ 23 apples sold. Remaining: 90 - 23 = 67
Answer: 67 apples remain.
```

### Few-Shot CoT

Kombinasi contoh + reasoning steps menghasilkan akurasi lebih tinggi:

```
Q: When my brother was 2, I was double his age. Now I am 40.
   How old is my brother? Let's think step by step.

A: When brother was 2, I was 2×2=4. Age difference: 4-2=2 years.
   I am older. Now I am 40, so brother is 40-2=38. Answer: 38.

Q: When I was 3, my partner was 3 times my age. Now I am 20.
   How old is my partner? Let's think step by step.

A: [model mengikuti pola yang sama]
```

### Keunggulan CoT

- Low-effort tapi sangat efektif
- Bekerja dengan model off-the-shelf (tidak butuh fine-tuning)
- Bisa dikombinasikan dengan few-shot
- Memberikan "audit trail" reasoning yang bisa diverifikasi



## Self-Consistency

CoT menggunakan "greedy decoding" — selalu mengambil token dengan probabilitas tertinggi. Self-consistency mengatasinya dengan **menghasilkan banyak reasoning paths berbeda** dan mengambil jawaban yang paling konsisten.

### Cara Kerja Self-Consistency

```
Strategi:
1. Gunakan temperature tinggi → hasilkan N jawaban berbeda
2. Jalankan prompt yang sama 3-5+ kali
3. Kumpulkan semua jawaban
4. Pilih jawaban yang paling sering muncul (majority voting)
```

### Contoh: Klasifikasi Email

```
Prompt:
Is this email important to answer?

EMAIL: [email tentang bug XSS di website]

Output Attempt 1: IMPORTANT (analisis keamanan)
Output Attempt 2: NOT IMPORTANT (hanya sharing observation)
Output Attempt 3: IMPORTANT (potensi security breach)
Output Attempt 4: IMPORTANT (perlu tindakan segera)
Output Attempt 5: IMPORTANT (bug aktif di website)

Majority: IMPORTANT (4/5) ← jawaban final
```

Meskipun ada satu attempt yang salah (NOT IMPORTANT), majority voting memberikan jawaban yang lebih akurat.

### Kapan Gunakan Self-Consistency

- Tugas dengan jawaban objektif (matematika, analisis faktual)
- Ketika akurasi lebih penting dari kecepatan
- Untuk mengurangi false positives/negatives dalam klasifikasi
- Ketika satu run CoT sering memberikan hasil yang bervariasi



## Tree of Thoughts (ToT) {#tree-of-thoughts}

Tree of Thoughts (ToT) menggeneralisasi CoT dengan memungkinkan LLM **mengeksplorasi beberapa jalur reasoning sekaligus** dan memilih yang terbaik — seperti algoritma tree search.

### Perbedaan CoT vs ToT

```
Chain of Thought:
Masalah → Step 1 → Step 2 → Step 3 → Jawaban
(jalur tunggal, linear)

Tree of Thoughts:
                 ┌─ Path A1 → A2 → A3 → Jawaban A
Masalah ─ Step ──┼─ Path B1 → B2 → (dead end, backtrack)
                 └─ Path C1 → C2 → C3 → Jawaban C (terpilih)
(multiple paths, evaluasi di setiap node)
```

### Kapan ToT Lebih Baik dari CoT

- Masalah yang membutuhkan eksplorasi (planning, puzzle solving)
- Ketika ada multiple possible approaches
- Ketika beberapa langkah bisa mengarah ke dead end
- Game playing (catur, Go)

### Implementasi ToT

ToT biasanya diimplementasikan secara programatik:

```python
from langchain.llms import VertexAI

llm = VertexAI(model_name="gemini-pro", temperature=0.7)

# Step 1: Generate multiple thoughts
thoughts_prompt = """
Given the problem: [masalah]
Generate 3 different approaches to solve this:
1.
2.
3.
"""

# Step 2: Evaluate each thought
eval_prompt = """
Rate this approach (1-10) and explain if it's promising:
Approach: [thought]
Rating:
"""

# Step 3: Select best path and continue
# ... (iterasi sampai solusi ditemukan)
```



## ReAct: Reason and Act {#react-reason-and-act}

ReAct menggabungkan **reasoning** dan **acting** — model bisa menggunakan external tools (pencarian web, kalkulator, database) dalam proses reasoning-nya.

### Siklus ReAct

```
Thought → Action → Observation → Thought → Action → ... → Final Answer
```

### Contoh ReAct dengan Langchain

```python
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.llms import VertexAI

llm = VertexAI(model_name="gemini-pro", temperature=0)
tools = load_tools(["serpapi"], llm=llm)  # Google Search tool
agent = initialize_agent(tools, llm, agent="zero-shot-react-description")

question = "How many children do the members of Metallica have in total?"
result = agent.run(question)
```

### Output ReAct (Reasoning Chain)

```
Entering new AgentExecutor chain...
Thought: I need to find how many members Metallica has and
         how many children each member has.

Action: Search
Action Input: "Metallica band members"
Observation: Metallica has 4 members: James Hetfield,
             Lars Ulrich, Kirk Hammett, Robert Trujillo

Thought: Now I need children count for each member.

Action: Search
Action Input: "How many kids does James Hetfield have?"
Observation: three children

Thought: 1/4 members = 3 children so far.

Action: Search
Action Input: "How many kids does Lars Ulrich have?"
Observation: 3

Thought: 2/4 members = 6 children so far.

[... lanjut untuk Kirk dan Robert ...]

Final Answer: The members of Metallica have X children in total.
```

### Keunggulan ReAct

- Bisa mengakses informasi real-time (tidak terbatas knowledge cutoff)
- Transparent reasoning yang bisa di-audit
- Bisa digabungkan dengan banyak tools (calculator, database, APIs)
- Mengurangi hallucination dengan grounding ke sumber eksternal



## Automatic Prompt Engineering

Menulis prompt yang baik itu sulit — bagaimana jika proses ini bisa diotomatisasi?

### Konsep APE (Automatic Prompt Engineering)

APE menggunakan LLM untuk menghasilkan dan mengevaluasi berbagai variasi prompt secara otomatis, lalu memilih yang terbaik.

### Menghasilkan Variasi Prompt

```
Prompt:
We have a band merchandise t-shirt webshop, and to train a
chatbot we need various ways to order: "One Metallica t-shirt
size S". Generate 10 variants with the same meaning.

Output:
1. I'd like to purchase a Metallica t-shirt in size small.
2. Can I order a small-sized Metallica t-shirt?
3. I'd like to buy one Metallica t-shirt in small.
4. One Metallica shirt, size small, please.
5. I want one Metallica t-shirt in size small.
6. I'd like to place an order for a small Metallica t-shirt.
7. Small Metallica t-shirt, please. Just one.
8. Please send me a Metallica t-shirt, size S.
9. One small Metallica t-shirt - order please.
10. I need to order a size S Metallica t-shirt.
```

Variasi ini berguna untuk:
- Training data chatbot (augmentasi)
- A/B testing berbagai formulasi prompt
- Membuat sistem lebih robust terhadap variasi input pengguna

### Workflow APE

```
1. Definisikan task + metrik keberhasilan
2. Generate N variasi prompt dengan LLM
3. Evaluasi setiap variasi pada test set
4. Pilih prompt dengan skor tertinggi
5. (Opsional) Iterasi: generate variasi baru dari prompt terbaik
```



## Code Prompting

LLM seperti Gemini sangat capable dalam programming tasks — menulis, menjelaskan, menerjemahkan, dan men-debug kode.

### Menulis Kode Baru

**Contoh: Rename Files dengan Bash**

```
Prompt (Temperature: 0.1, Token Limit: 1024):
Write a code snippet in Bash, which asks for a folder name.
Then it takes the contents of the folder and renames all
the files inside by prepending the name "draft" to the file name.

Output:
#!/bin/bash
# Ask for the folder name
echo "Enter the folder name: "
read folder_name

# Check if the folder exists
if [ ! -d "$folder_name" ]; then
  echo "Folder does not exist."
  exit 1
fi

# Get list of files and rename them
files=( "$folder_name"/* )
for file in "${files[@]}"; do
  new_file_name="draft_$(basename "$file")"
  mv "$file" "$new_file_name"
done

echo "Files renamed successfully."
```

**Tips untuk Code Prompting:**
- Gunakan temperature rendah (0.1-0.2) untuk deterministis
- Spesifikkan bahasa pemrograman
- Berikan konteks tentang environment/framework yang digunakan
- Minta komentar pada kode yang dihasilkan

### Menjelaskan Kode

```
Prompt:
Explain to me the below Bash code:
```bash
#!/bin/bash
read folder_name
if [ ! -d "$folder_name" ]; then
  echo "Folder does not exist."
  exit 1
fi
files=( "$folder_name"/* )
for file in "${files[@]}"; do
  new_file_name="draft_$(basename "$file")"
  mv "$file" "$new_file_name"
done
```

Output:
1. **User Input**: Script asks user to enter a folder name
2. **Validation**: Checks if folder exists using -d flag
3. **File Listing**: Creates array of all files in folder
4. **File Renaming**: Iterates through files, prepends "draft_"
   using mv command
5. **Confirmation**: Prints success message when done
```

### Menerjemahkan Kode

Dari Bash ke Python:

```python
import os
import shutil

folder_name = input("Enter the folder name: ")

if not os.path.isdir(folder_name):
    print("Folder does not exist.")
    exit(1)

files = os.listdir(folder_name)
for file in files:
    new_file_name = f"draft_{file}"
    shutil.move(
        os.path.join(folder_name, file),
        os.path.join(folder_name, new_file_name)
    )

print("Files renamed successfully.")
```

### Debugging Kode

Berikan kode yang rusak beserta pesan error:

```
Prompt:
The below Python code gives an error:
NameError: name 'toUpperCase' is not defined

Debug what's wrong and fix it:
```python
text = toUpperCase(prefix)
```

Output:
The issue: `toUpperCase` is not a Python function.
In Python, use the `.upper()` string method instead.

Fix:
```python
text = prefix.upper()
```

Additional improvements:
1. Keep file extension when renaming
2. Handle spaces in folder names
3. Add error handling for failed moves
```



## Multimodal Prompting

Prompting untuk kode masih menggunakan regular LLM. **Multimodal prompting** adalah hal yang berbeda — menggunakan multiple input formats (teks, gambar, audio, kode) untuk memandu LLM.

Contoh use case multimodal:
- Analisis gambar + teks pertanyaan
- Screenshot UI + instruksi untuk generate kode
- Tabel data (sebagai gambar) + query analisis



## Ringkasan Teknik Lanjutan

| Teknik | Kapan Pakai | Kelebihan |
|--------|-------------|-----------|
| Step-back | Pertanyaan spesifik yang butuh prinsip umum | Aktivasi knowledge lebih luas |
| CoT (zero-shot) | Reasoning + math, cukup tambah "step by step" | Low-effort, efektif |
| CoT (few-shot) | Butuh format reasoning spesifik | Akurasi lebih tinggi |
| Self-consistency | Tugas objektif, butuh keandalan tinggi | Mayoritas voting |
| ToT | Problem solving kompleks, perlu eksplorasi | Multiple paths, backtracking |
| ReAct | Butuh informasi real-time, multi-step | Grounded ke external tools |
| APE | Generate variasi prompt otomatis | Augmentasi data, A/B test |
| Code prompting | Semua tugas programming | Debug, translate, explain |

**Sumber:** Lee Boonstra, *Prompt Engineering* (September 2024), Google.
