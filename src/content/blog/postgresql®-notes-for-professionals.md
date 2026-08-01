---
title: PostgreSQL® Notes for Professionals
description: Dokumen Markdown ini dibuat dari file
  `PostgreSQLNotesForProfessionals.pdf` dan diterjemahkan ke Bahasa Indonesia.
  Contoh perintah SQL, shell, C, Java, Python, PHP, dan C# sengaja dipertahankan
  sedekat mungkin dengan bentuk aslinya agar tetap dapat digunakan.
pubDate: 2026-05-25T22:37:00.000Z
image: /image/Logo-PostgreSQL-Edited.webp
draft: false
categories:
  - Teknologi
tags:
  - postgresql
---
# PostgreSQL® Notes for Professionals — Versi Bahasa Indonesia

> **Catatan**: Dokumen Markdown ini dibuat dari file `PostgreSQLNotesForProfessionals.pdf` dan diterjemahkan ke Bahasa Indonesia. Contoh perintah SQL, shell, C, Java, Python, PHP, dan C# sengaja dipertahankan sedekat mungkin dengan bentuk aslinya agar tetap dapat digunakan.

## Tentang

Buku *PostgreSQL® Notes for Professionals* adalah buku gratis tidak resmi untuk tujuan edukasi. Materinya dikompilasi dari Stack Overflow Documentation. PostgreSQL®, Stack Overflow, dan merek lain adalah milik pemiliknya masing-masing. Informasi di dalam buku tidak dijamin selalu benar atau akurat; gunakan dengan pertimbangan sendiri.

---

## Daftar Isi

1. [Bab 1: Memulai dengan PostgreSQL](#bab-1-memulai-dengan-postgresql)
2. [Bab 2: Tipe Data](#bab-2-tipe-data)
3. [Bab 3: Tanggal, Timestamp, dan Interval](#bab-3-tanggal-timestamp-dan-interval)
4. [Bab 4: Pembuatan Tabel](#bab-4-pembuatan-tabel)
5. [Bab 5: SELECT](#bab-5-select)
6. [Bab 6: Mencari Panjang String / Karakter](#bab-6-mencari-panjang-string-karakter)
7. [Bab 7: COALESCE](#bab-7-coalesce)
8. [Bab 8: INSERT](#bab-8-insert)
9. [Bab 9: UPDATE](#bab-9-update)
10. [Bab 10: Dukungan JSON](#bab-10-dukungan-json)
11. [Bab 11: Fungsi Agregat](#bab-11-fungsi-agregat)
12. [Bab 12: Common Table Expressions](#bab-12-common-table-expressions-with)
13. [Bab 13: Window Functions](#bab-13-window-functions)
14. [Bab 14: Query Rekursif](#bab-14-query-rekursif)
15. [Bab 15: PL/pgSQL](#bab-15-pemrograman-dengan-plpgsql)
16. [Bab 16: Inheritance](#bab-16-inheritance)
17. [Bab 17: Export CSV](#bab-17-ekspor-header-dan-data-tabel-postgresql-ke-csv)
18. [Bab 18: Trigger](#bab-18-trigger-dan-fungsi-trigger)
19. [Bab 19: Event Trigger](#bab-19-event-trigger)
20. [Bab 20: Role Management](#bab-20-manajemen-role)
21. [Bab 21: Kriptografi](#bab-21-fungsi-kriptografi-postgresql)
22. [Bab 22: Comment](#bab-22-komentar-di-postgresql)
23. [Bab 23: Backup & Restore](#bab-23-backup-dan-restore)
24. [Bab 24: Script Backup](#bab-24-skrip-backup-untuk-database-produksi)
25. [Bab 25: Akses Programatik](#bab-25-mengakses-data-secara-programatis)
26. [Bab 26: Java](#bab-26-koneksi-postgresql-dari-java)
27. [Bab 27: High Availability](#bab-27-postgresql-high-availability)
28. [Bab 28: dblink & FDW](#bab-28-extension-dblink-dan-postgres_fdw)
29. [Bab 29: Tips & Tricks](#bab-29-tips-dan-trik-postgresql)

---

# Bab 1: Memulai dengan PostgreSQL

## Versi PostgreSQL

| Versi | Tanggal Rilis | Tanggal EOL |
|---|---:|---:|
| 10.0 | 2017-10-05 | 2022-10-01 |
| 9.6 | 2016-09-29 | 2021-09-01 |
| 9.5 | 2016-01-07 | 2021-01-01 |
| 9.4 | 2014-12-18 | 2019-12-01 |
| 9.3 | 2013-09-09 | 2018-09-01 |
| 9.2 | 2012-09-10 | 2017-09-01 |
| 9.1 | 2011-09-12 | 2016-09-01 |
| 9.0 | 2010-09-20 | 2015-09-01 |
| 8.4 | 2009-07-01 | 2014-07-01 |

## 1.1 Menginstal PostgreSQL di Windows

Walaupun server produksi umumnya lebih disarankan berjalan di sistem berbasis Unix seperti Linux atau BSD, PostgreSQL tetap dapat diinstal di Windows, terutama untuk server pengembangan.

Langkah umum:

1. Unduh installer Windows dari EnterpriseDB.
2. Pilih versi stabil terbaru, bukan versi beta.
3. Pilih paket sesuai arsitektur Windows: `x86-64` untuk 64-bit atau `x86-32` untuk 32-bit.
4. Pada installer, pilih paket tambahan yang diperlukan, misalnya:
   - **pgAdmin**: GUI gratis untuk mengelola database.
   - **PostGIS**: ekstensi analisis geospasial.
   - **Language Pack**: library untuk PL/Python, PL/Perl, dan PL/Tcl.
   - Paket lain seperti `pgAgent`, `pgBouncer`, dan `Slony` biasanya digunakan untuk server produksi yang lebih besar.
5. Setelah instalasi, buka pgAdmin dan hubungkan ke server lokal, misalnya `PostgreSQL 9.5 (localhost:5432)`.

### Opsional: Mengubah Startup Service menjadi Manual

PostgreSQL berjalan sebagai service di background. Default-nya adalah **Automatic**, artinya service selalu aktif saat komputer menyala.

Jika komputer dipakai bergantian untuk pengembangan dan pekerjaan lain, Anda dapat mengubahnya menjadi **Manual**:

1. Buka `Control Panel -> System and Security -> Administrative Tools -> Services`.
2. Cari service bernama seperti `postgresql-x64-9.5`.
3. Klik kanan → `Properties` → `Startup type` → `Manual` → `Apply`.
4. Untuk menjalankan service, klik kanan → `Start`.
5. Untuk menghentikan service, klik kanan → `Stop`.

## 1.2 Instal PostgreSQL dari Source di Linux

Dependensi umum:

- GNU Make versi > 3.80
- Compiler C ISO/ANSI, misalnya `gcc`
- Extractor seperti `tar` atau `gzip`
- `zlib-devel`
- `readline-devel` atau `libedit-devel`

Contoh ekstraksi source:

```bash
tar -xzvf postgresql-9.6.3.tar.gz
```

Opsi konfigurasi yang sering digunakan:

```text
--prefix=PATH              path untuk semua file
--exec-prefix=PATH         path untuk file bergantung arsitektur
--bindir=PATH              path program executable
--sysconfdir=PATH          path file konfigurasi
--with-pgport=NUMBER       port server
--with-perl                dukungan Perl
--with-python              dukungan Python
--with-openssl             dukungan OpenSSL
--with-ldap                dukungan LDAP
--with-blocksize=BLOCKSIZE ukuran page dalam KB
--with-wal-segsize=SEGSIZE ukuran segmen WAL dalam MB
```

Contoh build:

```bash
./configure --exec=/usr/local/pgsql
make
make install
make clean
```

Untuk ekstensi:

```bash
cd contrib
make
make install
```

## 1.3 Instalasi di GNU/Linux

### Keluarga Red Hat

Contoh alur:

```bash
yum list available | grep postgres*
yum -y install postgresqlXX postgresqlXX-server postgresqlXX-libs postgresqlXX-contrib
```

Menjalankan service sebagai user `postgres`:

```bash
sudo -su postgres ./usr/pgsql-X.X/bin/pg_ctl -D /var/lib/pgsql/X.X/data start
```

Masuk ke CLI:

```bash
psql
```

### Keluarga Debian

```bash
sudo apt-get install postgresql
```

Perintah ini menginstal paket server PostgreSQL versi default dari repository sistem operasi.

## 1.4 Instal PostgreSQL via MacPorts di macOS

Cek versi yang tersedia:

```bash
sudo port list | grep "^postgresql[[:digit:]]\{2\}[[:space:]]"
```

Contoh instalasi PostgreSQL 9.6:

```bash
sudo port install postgresql96-server postgresql96
sudo mkdir -p /opt/local/var/db/postgresql96/defaultdb
sudo chown postgres:postgres /opt/local/var/db/postgresql96/defaultdb
sudo su postgres -c '/opt/local/lib/postgresql96/bin/initdb -D /opt/local/var/db/postgresql96/defaultdb'
sudo port load -w postgresql96-server
su postgres -c psql
```

Cek direktori data:

```sql
SELECT setting FROM pg_settings WHERE name='data_directory';
```

Keluar dari `psql`:

```sql
\q
```

## 1.5 Instal PostgreSQL dengan Homebrew di Mac

```bash
brew update
brew install postgresql
brew services start postgresql
psql
```

Jika `psql` mengeluh tidak ada database sesuai user Anda, jalankan:

```bash
createdb
```

## 1.6 Postgres.app untuk macOS

Postgres.app adalah alat sederhana untuk menginstal PostgreSQL di Mac. Anda dapat mengatur apakah PostgreSQL berjalan di background atau hanya saat aplikasi aktif.

---

# Bab 2: Tipe Data

PostgreSQL menyediakan banyak tipe data native. Pengguna juga dapat menambah tipe baru dengan perintah `CREATE TYPE`.

## 2.1 Tipe Numerik

| Nama | Ukuran | Deskripsi | Rentang |
|---|---:|---|---|
| `SMALLINT` | 2 byte | integer rentang kecil | -32768 sampai +32767 |
| `INTEGER` | 4 byte | pilihan umum untuk integer | -2147483648 sampai +2147483647 |
| `BIGINT` | 8 byte | integer rentang besar | -9223372036854775808 sampai +9223372036854775807 |
| `DECIMAL` | variabel | presisi ditentukan pengguna, eksak | sangat besar |
| `NUMERIC` | variabel | presisi ditentukan pengguna, eksak | sangat besar |
| `REAL` | 4 byte | presisi variabel, tidak eksak | 6 digit desimal |
| `DOUBLE PRECISION` | 8 byte | presisi variabel, tidak eksak | 15 digit desimal |
| `smallserial` | 2 byte | integer auto-increment kecil | 1 sampai 32767 |
| `serial` | 4 byte | integer auto-increment | 1 sampai 2147483647 |
| `BIGSERIAL` | 8 byte | integer auto-increment besar | 1 sampai 9223372036854775807 |

Tipe range: `int4range`, `int8range`, `numrange`.

## 2.2 Tipe Tanggal/Waktu

| Nama | Ukuran | Deskripsi |
|---|---:|---|
| `TIMESTAMP without time zone` | 8 byte | tanggal dan waktu tanpa zona waktu |
| `TIMESTAMP with time zone` | 8 byte | tanggal dan waktu dengan zona waktu |
| `DATE` | 4 byte | tanggal tanpa jam |
| `TIME without time zone` | 8 byte | waktu tanpa tanggal |
| `TIME with time zone` | 12 byte | waktu dengan zona waktu |
| `INTERVAL` | 16 byte | interval waktu |

Tipe range: `tsrange`, `tstzrange`, `daterange`.

## 2.3 Tipe Geometrik

| Nama | Ukuran | Deskripsi | Representasi |
|---|---:|---|---|
| `point` | 16 byte | titik pada bidang | `(x,y)` |
| `line` | 32 byte | garis tak hingga | `{A,B,C}` |
| `lseg` | 32 byte | segmen garis | `((x1,y1),(x2,y2))` |
| `box` | 32 byte | kotak persegi panjang | `((x1,y1),(x2,y2))` |
| `path` | 16+16n byte | path tertutup/terbuka | `((x1,y1),...)` atau `[(x1,y1),...]` |
| `polygon` | 40+16n byte | poligon | `((x1,y1),...)` |
| `circle` | 24 byte | lingkaran | `<(x,y),r>` |

## 2.4 Tipe Alamat Jaringan

| Nama | Ukuran | Deskripsi |
|---|---:|---|
| `CIDR` | 7 atau 19 byte | jaringan IPv4/IPv6 |
| `INET` | 7 atau 19 byte | host dan jaringan IPv4/IPv6 |
| `macaddr` | 6 byte | alamat MAC |

## 2.5 Tipe Karakter

| Nama | Deskripsi |
|---|---|
| `character varying(n)`, `varchar(n)` | panjang variabel dengan batas |
| `character(n)`, `char(n)` | panjang tetap, dipenuhi spasi |
| `text` | panjang tidak terbatas |

## 2.6 Array

PostgreSQL dapat membuat array dari tipe bawaan, tipe buatan pengguna, atau enum.

Deklarasi:

```sql
SELECT INTEGER[];
SELECT INTEGER[3];
SELECT INTEGER[][];
SELECT INTEGER[3][3];
SELECT INTEGER ARRAY;
SELECT INTEGER ARRAY[3];
```

Membuat array:

```sql
SELECT '{0,1,2}';
SELECT '{{0,1},{1,2}}';
SELECT ARRAY[0,1,2];
SELECT ARRAY[ARRAY[0,1], ARRAY[1,2]];
```

Mengakses array:

```sql
WITH arr AS (SELECT ARRAY[0,1,2] int_arr)
SELECT int_arr[1] FROM arr;
```

Slicing array:

```sql
WITH arr AS (SELECT ARRAY[0,1,2] int_arr)
SELECT int_arr[1:2] FROM arr;
```

Informasi array:

```sql
WITH arr AS (SELECT ARRAY[0,1,2] int_arr)
SELECT ARRAY_DIMS(int_arr) FROM arr;

WITH arr AS (SELECT ARRAY[0,1,2] int_arr)
SELECT ARRAY_LENGTH(int_arr, 1) FROM arr;

WITH arr AS (SELECT ARRAY[0,1,2] int_arr)
SELECT cardinality(int_arr) FROM arr;
```

---

# Bab 3: Tanggal, Timestamp, dan Interval

## 3.1 SELECT hari terakhir bulan

```sql
SELECT (DATE_TRUNC('MONTH', ('201608' || '01')::DATE) + INTERVAL '1 MONTH - 1 day')::DATE;
```

`201608` dapat diganti dengan variabel.

## 3.2 Mengubah timestamp atau interval menjadi string

```sql
SELECT TO_CHAR('2016-08-12 16:40:32'::TIMESTAMP, 'DD Mon YYYY HH:MI:SSPM');
```

Hasil:

```text
12 Aug 2016 04:40:32PM
```

Teks biasa di format sebaiknya diletakkan dalam tanda kutip ganda:

```sql
SELECT TO_CHAR(
  '2016-08-12 16:40:32'::TIMESTAMP,
  '"Today is "FMDay", the "DDth" day of the month of "FMMonth" of "YYYY'
);
```

Mode translasi lokal dapat memakai modifier `TM`:

```sql
SELECT TO_CHAR('2016-08-12 16:40:32'::TIMESTAMP, 'TMDay, DD" de "TMMonth" del año "YYYY');
```

## 3.3 Menghitung jumlah record per minggu

```sql
SELECT DATE_TRUNC('week', <>) AS "Week", COUNT(*)
FROM <>
GROUP BY 1
ORDER BY 1;
```

---

# Bab 4: Pembuatan Tabel

## 4.1 Menampilkan definisi tabel

Di `psql`:

```sql
\d tablename
\d+ tablename
```

Jika lupa nama tabel:

```sql
\d
```

## 4.2 Membuat tabel dari SELECT

```sql
CREATE TABLE person (
    person_id BIGINT NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    age INT NOT NULL,
    PRIMARY KEY (person_id)
);

CREATE TABLE people_over_30 AS
SELECT * FROM person WHERE age > 30;
```

## 4.3 Membuat unlogged table

Unlogged table lebih cepat karena melewati penulisan WAL, tetapi tidak aman terhadap crash dan tidak dapat direplikasi.

```sql
CREATE UNLOGGED TABLE person (
    person_id BIGINT NOT NULL PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255)
);
```

## 4.4 Tabel dengan Primary Key

```sql
CREATE TABLE person (
    person_id BIGINT NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    PRIMARY KEY (person_id)
);
```

Atau langsung pada kolom:

```sql
CREATE TABLE person (
    person_id BIGINT NOT NULL PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255)
);
```

Disarankan memakai nama tabel dan kolom huruf kecil. Jika memakai huruf besar, PostgreSQL mengharuskan nama tersebut selalu diapit tanda kutip ganda.

## 4.5 Membuat tabel yang mereferensikan tabel lain

```sql
CREATE TABLE agencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id) DEFERRABLE INITIALLY DEFERRED
);
```

---

# Bab 5: SELECT

## 5.1 SELECT menggunakan WHERE

Contoh tabel:

```sql
CREATE TABLE sch_test.user_table (
  id serial NOT NULL,
  username CHARACTER VARYING,
  pass CHARACTER VARYING,
  first_name CHARACTER varying(30),
  last_name CHARACTER varying(30),
  CONSTRAINT user_table_pkey PRIMARY KEY (id)
);
```

Sintaks:

```sql
SELECT * FROM schema_name.table_name WHERE <condition>;
SELECT field1, field2 FROM schema_name.table_name WHERE <condition>;
```

Contoh:

```sql
SELECT * FROM schema_name.table_name WHERE id = 1;
SELECT id FROM schema_name.table_name WHERE username = 'root' AND pass = 'toor';
SELECT first_name FROM schema_name.table_name WHERE id != 1;
```

---

# Bab 6: Mencari Panjang String / Karakter

Gunakan `char_length()` atau `character_length()`.

```sql
SELECT CHAR_LENGTH('ABCDE');
SELECT CHARACTER_LENGTH('ABCDE');
```

Keduanya menghasilkan:

```text
5
```

---

# Bab 7: COALESCE

`COALESCE` mengembalikan argumen pertama yang bukan `NULL`. Jika semua argumen `NULL`, hasilnya `NULL`.

```sql
SELECT COALESCE(NULL, NULL, 'HELLO WORLD');
SELECT COALESCE(NULL, NULL, 'first non null', NULL, NULL, 'second non null');
SELECT COALESCE(NULL, NULL, NULL);
```

---

# Bab 8: INSERT

## 8.1 Insert data menggunakan COPY

`COPY` adalah mekanisme bulk insert PostgreSQL. Biasanya jauh lebih cepat daripada `INSERT` untuk ribuan baris.

Contoh data:

```bash
cat > sample_data.csv
1,Yogesh
2,Raunak
3,Varun
4,Kamal
5,Hari
6,Amit
```

Tabel tujuan:

```sql
CREATE TABLE copy_test(id INT, name varchar(8));
```

Import dari file:

```sql
COPY copy_test FROM '/path/to/file/sample_data.csv' DELIMITER ',';
```

Import dari `STDIN`:

```sql
COPY copy_test FROM STDIN DELIMITER ',';
```

Export ke file:

```sql
COPY copy_test TO 'path/to/file/sample_data.csv' DELIMITER ',';
```

## 8.2 Insert banyak baris

```sql
INSERT INTO person (name, age) VALUES
  ('john doe', 25),
  ('jane doe', 20);
```

## 8.3 INSERT data dan mengembalikan nilai

```sql
CREATE TABLE my_table (
  id serial NOT NULL,
  name CHARACTER VARYING,
  contact_number INTEGER,
  CONSTRAINT my_table_pkey PRIMARY KEY (id)
);

INSERT INTO my_table(name, contact_number)
VALUES ('USER', 8542621)
RETURNING id;
```

## 8.4 INSERT dasar

```sql
CREATE TABLE person (
    person_id BIGINT,
    name VARCHAR(255),
    age INT,
    city VARCHAR(255)
);

INSERT INTO person VALUES (1, 'john doe', 25, 'new york');
INSERT INTO person (name, age) VALUES ('john doe', 25);
```

## 8.5 Insert dari SELECT

```sql
INSERT INTO person
SELECT * FROM tmp_person WHERE age < 30;
```

Kolom hasil `SELECT` harus sesuai dengan kolom untuk `INSERT`.

## 8.6 UPSERT — `INSERT ... ON CONFLICT DO UPDATE`

Sejak PostgreSQL 9.5, tersedia UPSERT.

```sql
INSERT INTO my_table (name, contact_number)
VALUES ('one', 333)
RETURNING id;

INSERT INTO my_table VALUES (2, 'one', 333)
ON CONFLICT (id) DO UPDATE
SET name = my_table.name || ' changed to: "two" at ' || now()
RETURNING *;
```

## 8.7 SELECT data ke file

```sql
COPY my_table TO '/home/postgres/my_table.txt'
USING DELIMITERS '|'
WITH NULL AS 'null_string' CSV HEADER;
```

---

# Bab 9: UPDATE

## 9.1 Update berdasarkan join dengan tabel lain

```sql
UPDATE person
SET state_code = cities.state_code
FROM cities
WHERE cities.city = city;
```

## 9.2 Update semua baris

```sql
UPDATE person SET planet = 'Earth';
```

## 9.3 Update baris dengan kondisi

```sql
UPDATE person SET state = 'NY' WHERE city = 'New York';
```

## 9.4 Update banyak kolom

```sql
UPDATE person
SET country = 'USA',
    state = 'NY'
WHERE city = 'New York';
```

---

# Bab 10: Dukungan JSON

PostgreSQL mendukung tipe data JSON sejak versi 9.2. Operator penting:

- `->` mengembalikan nilai JSON.
- `->>` mengembalikan nilai sebagai teks.

## 10.1 Menggunakan operator JSONB

Membuat database dan tabel:

```sql
DROP DATABASE IF EXISTS books_db;
CREATE DATABASE books_db WITH ENCODING='UTF8' TEMPLATE template0;

DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  client TEXT NOT NULL,
  data JSONb NOT NULL
);
```

Mengisi data:

```sql
INSERT INTO books(client, data) VALUES
(
  'Joe',
  '{ "title": "Siddhartha", "author": { "first_name": "Herman", "last_name": "Hesse" } }'
),
(
  'Jenny',
  '{ "title": "Dharma Bums", "author": { "first_name": "Jack", "last_name": "Kerouac" } }'
),
(
  'Jenny',
  '{ "title": "100 años de soledad", "author": { "first_name": "Gabo", "last_name": "Marquéz" } }'
);
```

Memilih nilai JSON:

```sql
SELECT client, data->'title' AS title FROM books;
SELECT client, data->'title' AS title, data->'author' AS author FROM books;
SELECT client, data->'author'->'last_name' AS author FROM books;
```

Filter:

```sql
SELECT client, data->'title' AS title
FROM books
WHERE data->'title' = '"Dharma Bums"';

SELECT client, data->'title' AS title
FROM books
WHERE data->'author'->>'last_name' = 'Kerouac';
```

### Contoh dunia nyata

```sql
CREATE TABLE events (
  name varchar(200),
  visitor_id varchar(200),
  properties json,
  browser json
);
```

Contoh agregasi:

```sql
SELECT browser->>'name' AS browser,
       COUNT(browser)
FROM events
GROUP BY browser->>'name';

SELECT visitor_id,
       SUM(CAST(properties->>'amount' AS INTEGER)) AS total
FROM events
WHERE CAST(properties->>'amount' AS INTEGER) > 0
GROUP BY visitor_id;

SELECT AVG(CAST(browser->'resolution'->>'x' AS INTEGER)) AS width,
       AVG(CAST(browser->'resolution'->>'y' AS INTEGER)) AS height
FROM events;
```

## 10.2 Query dokumen JSON kompleks

```sql
CREATE TABLE mytable (data JSONB NOT NULL);
CREATE INDEX mytable_idx ON mytable USING gin (data jsonb_path_ops);
```

Contoh query:

```sql
SELECT data->>'name' FROM mytable WHERE data @> '{"name":"Alice"}';
SELECT data->>'name' FROM mytable WHERE data @> '{"emails":["alice1@test.com"]}';
SELECT data->>'name' FROM mytable WHERE data @> '{"events":[{"type":"anniversary"}]}';
SELECT data->>'name' FROM mytable WHERE data @> '{"locations":{"home":{"city":"London"}}}';
```

### Performa `@>` dibanding `->` dan `->>`

Query dengan `@>` dapat memakai index GIN yang dibuat, sedangkan filter memakai `data->'name'` atau `data->>'name'` biasanya melakukan full table scan.

```sql
SELECT data FROM mytable WHERE data @> '{"name":"Alice"}';
SELECT data FROM mytable WHERE data->'name' = '"Alice"';
SELECT data FROM mytable WHERE data->>'name' = 'Alice';
```

## 10.3 Membuat tabel JSON murni

```sql
CREATE TABLE mytable (data JSONB NOT NULL);
CREATE INDEX mytable_idx ON mytable USING gin (data jsonb_path_ops);
```

---

# Bab 11: Fungsi Agregat

## 11.1 Statistik sederhana: `min()`, `max()`, `avg()`

```sql
SELECT MIN(age), MAX(age), AVG(age)
FROM individuals;
```

## 11.2 `regr_slope(Y, X)`

`regr_slope(Y, X)` menghitung kemiringan garis regresi linear least-squares dari pasangan `(X, Y)`. Contoh penggunaan: mencari kandidat memory leak dari tren pemakaian memori.

```sql
CREATE TABLE heap_histogram (
    histwhen TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    class CHARACTER VARYING NOT NULL,
    bytes INTEGER NOT NULL
);

SELECT class,
       REGR_SLOPE(bytes, EXTRACT(epoch FROM histwhen)) AS slope
FROM public.heap_histogram
GROUP BY class
HAVING REGR_SLOPE(bytes, EXTRACT(epoch FROM histwhen)) > 0
ORDER BY slope DESC;
```

## 11.3 `string_agg(expression, delimiter)`

```sql
SELECT STRING_AGG(name, ', ') AS names, country
FROM individuals
GROUP BY country;
```

---

# Bab 12: Common Table Expressions (`WITH`)

## 12.1 CTE dalam SELECT

```sql
WITH sales AS (
  SELECT
    orders.ordered_at,
    orders.user_id,
    SUM(orders.amount) AS total
  FROM orders
  GROUP BY orders.ordered_at, orders.user_id
)
SELECT
  sales.ordered_at,
  sales.total,
  users.name
FROM sales
JOIN users USING (user_id);
```

## 12.2 Menelusuri tree dengan `WITH RECURSIVE`

```sql
CREATE TABLE empl (
    name TEXT PRIMARY KEY,
    boss TEXT NULL REFERENCES empl(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
        DEFAULT NULL
);

WITH RECURSIVE t(level, path, boss, name) AS (
    SELECT 0, name, boss, name FROM empl WHERE boss IS NULL
    UNION
    SELECT
        level + 1,
        path || ' > ' || empl.name,
        empl.boss,
        empl.name
    FROM empl JOIN t ON empl.boss = t.name
)
SELECT * FROM t ORDER BY path;
```

---

# Bab 13: Window Functions

## 13.1 Contoh umum

```sql
CREATE TABLE wf_example(i INT, t TEXT, ts timestamptz, b BOOLEAN);

SELECT *
  , DENSE_RANK() OVER (ORDER BY i) dist_by_i
  , LAG(t) OVER () prev_t
  , NTH_VALUE(i, 6) OVER () nth
  , COUNT(TRUE) OVER (PARTITION BY i) num_by_i
  , COUNT(TRUE) OVER () num_all
  , NTILE(3) OVER () ntile
FROM wf_example;
```

Penjelasan:

- `DENSE_RANK() OVER (ORDER BY i)`: memberi nomor per nilai berbeda.
- `LAG(t) OVER ()`: nilai sebelumnya dari kolom `t`.
- `NTH_VALUE(i, 6) OVER ()`: nilai kolom `i` pada baris ke-6 dalam window.
- `COUNT(TRUE) OVER (PARTITION BY i)`: jumlah baris untuk setiap nilai `i`.
- `COUNT(TRUE) OVER ()`: jumlah seluruh baris dalam window.
- `NTILE(3) OVER ()`: membagi window menjadi 3 bagian yang sebisa mungkin sama besar.

## 13.2 `dense_rank` vs `rank` vs `row_number`

```sql
SELECT i,
       DENSE_RANK() OVER (ORDER BY i),
       ROW_NUMBER() OVER (),
       RANK() OVER (ORDER BY i)
FROM wf_example;
```

- `dense_rank`: memberi ranking tanpa celah antar nilai berbeda.
- `row_number`: memberi nomor baris sesuai urutan hasil.
- `rank`: ranking berdasarkan posisi baris; nilai sama mendapat ranking sama, lalu dapat menyisakan celah.

---

# Bab 14: Query Rekursif

## 14.1 Jumlah bilangan bulat

```sql
WITH RECURSIVE t(n) AS (
    VALUES (1)
  UNION ALL
    SELECT n + 1 FROM t WHERE n < 100
)
SELECT SUM(n) FROM t;
```

---

# Bab 15: Pemrograman dengan PL/pgSQL

## 15.1 Fungsi PL/pgSQL dasar

```sql
CREATE FUNCTION active_subscribers() RETURNS BIGINT AS $$
DECLARE
    subscribers INTEGER;
BEGIN
    SELECT COUNT(user_id) INTO subscribers
    FROM users
    WHERE subscribed;

    RETURN subscribers;
EXCEPTION
    WHEN undefined_table THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

SELECT active_subscribers();
```

## 15.2 Custom exception

```sql
CREATE OR REPLACE FUNCTION s164() RETURNS void AS $$
BEGIN
  RAISE EXCEPTION USING
    message = 'S 164',
    detail = 'D 164',
    hint = 'H 164',
    errcode = 'P2222';
END;
$$ LANGUAGE plpgsql;
```

```sql
CREATE OR REPLACE FUNCTION s165() RETURNS void AS $$
BEGIN
  RAISE EXCEPTION '%', 'nothing specified';
END;
$$ LANGUAGE plpgsql;
```

## 15.3 Sintaks PL/pgSQL

```sql
CREATE [OR REPLACE] FUNCTION functionName (someParameter parameterType)
RETURNS DATATYPE AS $_block_name_$
DECLARE
    -- deklarasi
BEGIN
    -- proses
    -- return
END;
$_block_name_$ LANGUAGE plpgsql;
```

## 15.4 Blok `RETURNS`

Pilihan return:

- Tipe data tunggal.
- `TABLE(column_name column_type, ...)`.
- `SETOF datatype` atau `SETOF table_column`.

---

# Bab 16: Inheritance

## 16.1 Membuat tabel anak

```sql
CREATE TABLE users (username TEXT, email TEXT);
CREATE TABLE simple_users () INHERITS (users);
CREATE TABLE users_with_password (password TEXT) INHERITS (users);
```

Hasil:

- `users`: `username`, `email`
- `simple_users`: `username`, `email`
- `users_with_password`: `username`, `email`, `password`

---

# Bab 17: Ekspor Header dan Data Tabel PostgreSQL ke CSV

## 17.1 Copy dari query

```sql
COPY (SELECT oid, relname FROM pg_class LIMIT 5) TO STDOUT;
```

## 17.2 Ekspor kolom tertentu ke CSV dengan header

```sql
COPY products(is_public, title, discount)
TO 'D:\csv_backup\products_db.csv'
DELIMITER ',' CSV HEADER;

COPY categories(name)
TO 'D:\csv_backup\categories_db.csv'
DELIMITER ',' CSV HEADER;
```

## 17.3 Backup tabel penuh ke CSV dengan header

```sql
COPY products
TO 'D:\csv_backup\products_db.csv'
DELIMITER ',' CSV HEADER;

COPY categories
TO 'D:\csv_backup\categories_db.csv'
DELIMITER ',' CSV HEADER;
```

---

# Bab 18: Trigger dan Fungsi Trigger

Trigger dikaitkan dengan tabel atau view dan menjalankan fungsi tertentu ketika event terjadi.

## 18.1 Jenis trigger

Trigger dapat dijalankan:

- `BEFORE`: sebelum operasi `INSERT`, `UPDATE`, atau `DELETE`.
- `AFTER`: setelah operasi selesai.
- `INSTEAD OF`: untuk operasi pada view.

Trigger dapat ditandai:

- `FOR EACH ROW`: dipanggil untuk setiap baris yang berubah.
- `FOR EACH STATEMENT`: dipanggil sekali untuk setiap statement.

### Persiapan contoh

```sql
CREATE TABLE company (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE log (
    id SERIAL PRIMARY KEY NOT NULL,
    table_name TEXT NOT NULL,
    table_id TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Single insert trigger

```sql
CREATE OR REPLACE FUNCTION add_created_at_function()
RETURNS TRIGGER AS $BODY$
BEGIN
  NEW.created_at := NOW();
  RETURN NEW;
END
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER add_created_at_trigger
BEFORE INSERT ON company
FOR EACH ROW
EXECUTE PROCEDURE add_created_at_function();
```

### Trigger untuk banyak operasi

```sql
CREATE OR REPLACE FUNCTION add_log_function()
RETURNS TRIGGER AS $BODY$
DECLARE
  vDescription TEXT;
  vId INT;
  vReturn RECORD;
BEGIN
  vDescription := TG_TABLE_NAME || ' ';

  IF (TG_OP = 'INSERT') THEN
    vId := NEW.id;
    vDescription := vDescription || 'added. Id: ' || vId;
    vReturn := NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    vId := NEW.id;
    vDescription := vDescription || 'updated. Id: ' || vId;
    vReturn := NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    vId := OLD.id;
    vDescription := vDescription || 'deleted. Id: ' || vId;
    vReturn := OLD;
  END IF;

  INSERT INTO log(table_name, table_id, description, created_at)
  VALUES (TG_TABLE_NAME, vId, vDescription, NOW());

  RETURN vReturn;
END
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER add_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON company
FOR EACH ROW
EXECUTE PROCEDURE add_log_function();
```

## 18.2 Fungsi trigger PL/pgSQL dasar

```sql
CREATE OR REPLACE FUNCTION my_simple_trigger_function()
RETURNS TRIGGER AS $BODY$
BEGIN
  IF (TG_TABLE_NAME = 'users') THEN
    IF (TG_OP = 'INSERT') THEN
      INSERT INTO log_table(date_and_time, description)
      VALUES (NOW(), 'New user inserted. User ID: ' || NEW.id);
      RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
      INSERT INTO log_table(date_and_time, description)
      VALUES (NOW(), 'User deleted. User ID: ' || OLD.id);
      RETURN OLD;
    END IF;
    RETURN NULL;
  END IF;
END;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER my_trigger
AFTER INSERT OR DELETE ON users
FOR EACH ROW
EXECUTE PROCEDURE my_simple_trigger_function();
```

---

# Bab 19: Event Trigger

Event trigger dijalankan ketika event database tertentu terjadi.

Event umum:

- `DDL_COMMAND_START`
- `DDL_COMMAND_END`
- `SQL_DROP`

## 19.1 Logging event awal command DDL

```sql
CREATE TABLE tab_event_logs(
  date_time TIMESTAMP,
  event_name TEXT,
  remarks TEXT
);

CREATE OR REPLACE FUNCTION fn_log_event()
RETURNS EVENT_TRIGGER
LANGUAGE SQL
AS $main$
  INSERT INTO tab_event_logs(date_time, event_name, remarks)
  VALUES (NOW(), TG_TAG, 'Event Logging');
$main$;

CREATE EVENT TRIGGER trg_log_event
ON DDL_COMMAND_START
EXECUTE PROCEDURE fn_log_event();
```

---

# Bab 20: Manajemen Role

## 20.1 Membuat user dengan password

Sebaiknya hindari memakai role default seperti `postgres` di aplikasi. Buat user dengan privilege lebih rendah.

```sql
CREATE ROLE niceusername WITH PASSWORD 'very-strong-password' LOGIN;
```

Agar password tidak tersimpan di history `psql`, gunakan:

```sql
CREATE ROLE niceusername WITH LOGIN;
\password niceusername
```

## 20.2 Grant dan Revoke privilege

Contoh role:

- `admin`: administrator database.
- `read_write`: aplikasi dengan akses penuh pada datanya.
- `read_only`: akses baca saja.

Akses database:

```sql
REVOKE CONNECT ON DATABASE nova FROM PUBLIC;
GRANT CONNECT ON DATABASE nova TO user_name;
```

Akses schema:

```sql
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO user_name;
```

Akses tabel:

```sql
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO read_write;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
```

Akses sequence:

```sql
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO read_only;
GRANT UPDATE ON ALL SEQUENCES IN SCHEMA public TO read_write;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO read_write;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;
```

## 20.3 Membuat role dan database yang sesuai

```bash
createuser -P blogger
createdb -O blogger blogger
```

Contoh `pg_hba.conf`:

```text
host    sameuser        all     localhost    md5
local   sameuser        all                  md5
```

## 20.4 Mengubah default `search_path` user

```sql
SHOW search_path;
ALTER USER user1 SET search_path='my_schema, "$user", public';
SHOW search_path;
```

Alternatif:

```sql
SET ROLE user1;
SHOW search_path;
```

## 20.5 Membuat read-only user

```sql
CREATE USER readonly WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT CONNECT ON DATABASE <database_name> TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

## 20.6 Grant privilege untuk object masa depan

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA myschema
GRANT SELECT ON TABLES TO read_only;

ALTER DEFAULT PRIVILEGES IN SCHEMA myschema
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLES TO read_write;

ALTER DEFAULT PRIVILEGES IN SCHEMA myschema
GRANT ALL ON TABLES TO admin;

ALTER DEFAULT PRIVILEGES FOR ROLE admin
GRANT SELECT ON TABLES TO read_only;
```

---

# Bab 21: Fungsi Kriptografi PostgreSQL

Fungsi kriptografi tersedia melalui module `pgcrypto`.

```sql
CREATE EXTENSION pgcrypto;
```

## 21.1 `digest`

`digest()` membuat hash biner dari data.

```sql
SELECT DIGEST('1', 'sha1');
SELECT DIGEST(CONCAT(CAST(CURRENT_TIMESTAMP AS TEXT), RANDOM()::TEXT), 'sha1');
```

---

# Bab 22: Komentar di PostgreSQL

`COMMENT` digunakan untuk mendefinisikan atau mengubah komentar pada object database.

## 22.1 Komentar pada tabel

```sql
COMMENT ON TABLE table_name IS 'this is student details table';
```

## 22.2 Menghapus komentar

```sql
COMMENT ON TABLE student IS NULL;
```

---

# Bab 23: Backup dan Restore

## 23.1 Backup satu database

Custom format:

```bash
pg_dump -Fc -f DATABASE.pgsql DATABASE
```

Format SQL biasa:

```bash
pg_dump -f DATABASE.sql DATABASE
pg_dump DATABASE > DATABASE.sql
```

## 23.2 Restore backup

```bash
psql < backup.sql
psql -1f backup.sql
pg_restore -d DATABASE DATABASE.pgsql
pg_restore backup.pgsql > backup.sql
```

Custom format direkomendasikan karena dapat memilih object yang dipulihkan dan mendukung parallel processing.

## 23.3 Backup seluruh cluster

```bash
pg_dumpall -f backup.sql
postgres-backup-$(date +%Y-%m-%d).sql
```

Catatan: backup harian dapat menghasilkan file besar. PostgreSQL memiliki mekanisme backup reguler yang lebih baik seperti WAL archiving.

Untuk backup filesystem:

```sql
SELECT pg_start_backup('my-backup');
SELECT pg_stop_backup();
```

File konfigurasi seperti `pg_hba.conf` dan `postgresql.conf` harus dibackup terpisah.

## 23.4 Menggunakan `psql` untuk export data

```bash
psql -p 5432 -U postgres -d test_database -A -F, -c "select * from user" > /home/USER/user_data.csv
```

- `-F`: delimiter.
- `-A` / `--no-align`: output tanpa alignment.

## 23.5 Menggunakan COPY untuk import

```sql
COPY <tablename> FROM '<filename with path>';
COPY user FROM '/home/user/user_data.csv';
COPY user FROM '/home/user/user_data' WITH DELIMITER '|';
COPY user FROM '/home/user/user_data' WITH DELIMITER '|' HEADER;
```

## 23.6 Menggunakan COPY untuk export

```sql
COPY <tablename> TO STDOUT (DELIMITER '|');
COPY user TO STDOUT (DELIMITER '|');
COPY (SELECT * FROM user WHERE user_name LIKE 'A%') TO '/home/user/user_data';
COPY user TO PROGRAM 'gzip > /home/user/user_data.gz';
```

---

# Bab 24: Skrip Backup untuk Database Produksi

Parameter:

| Parameter | Keterangan |
|---|---|
| `save_db` | direktori backup utama |
| `dbProd` | direktori backup sekunder |
| `DATE` | tanggal backup |
| `dbprod` | nama database |
| `pg_dump` | path binary `pg_dump` |
| `-h` | host server |
| `-p` | port |
| `-U` | username koneksi |

## 24.1 `saveProdDb.sh`

```bash
#!/bin/sh
cd /save_db
DATE=$(date +%d-%m-%Y-%Hh%M)
echo -e "Sauvegarde de la base du ${DATE}"
mkdir prodDir${DATE}
cd prodDir${DATE}

# dump file
/opt/postgres/9.0/bin/pg_dump -i -h localhost -p 5432 -U postgres -F c -b -w -v -f "dbprod${DATE}.backup" dbprod

# SQL file
/opt/postgres/9.0/bin/pg_dump -i -h localhost -p 5432 -U postgres --format plain --verbose -f "dbprod${DATE}.sql" dbprod
```

---

# Bab 25: Mengakses Data Secara Programatis

## 25.1 Mengakses PostgreSQL dengan C-API

C-API memakai library client PostgreSQL `libpq`.

Kompilasi di GNU C:

```bash
gcc -Wall -I "$(pg_config --includedir)" -L "$(pg_config --libdir)" -o coltype coltype.c -lpq
```

Program C biasanya:

1. Membuka koneksi dengan `PQconnectdb`.
2. Mengecek status dengan `PQstatus`.
3. Menjalankan query dengan `PQexecParams`.
4. Membaca hasil dengan `PQntuples`, `PQnfields`, `PQfname`, dan `PQgetvalue`.
5. Membersihkan hasil dengan `PQclear`.
6. Menutup koneksi dengan `PQfinish`.

## 25.2 Mengakses PostgreSQL dari Python dengan `psycopg2`

```python
import psycopg2

db_host = 'postgres.server.com'
db_port = '5432'
db_un = 'user'
db_pw = 'password'
db_name = 'testdb'

conn = psycopg2.connect(
    "dbname={} host={} user={} password={}".format(db_name, db_host, db_un, db_pw)
)
cur = conn.cursor()
sql = 'select * from testtable where id > %s and id < %s'
args = (1, 4)
cur.execute(sql, args)
print(cur.fetchall())
```

## 25.3 Mengakses PostgreSQL dari .NET dengan Npgsql

```csharp
var connString = "Host=myserv;Username=myuser;Password=mypass;Database=mydb";
using (var conn = new NpgsqlConnection(connString))
{
    var querystring = "INSERT INTO data (some_field) VALUES (@content)";
    conn.Open();
    using (var cmd = new NpgsqlCommand(querystring, conn))
    {
        var contentString = "Hello World!";
        cmd.Parameters.Add("@content", NpgsqlDbType.Text).Value = contentString;
        cmd.ExecuteNonQuery();
    }
}
```

## 25.4 Mengakses PostgreSQL dari PHP menggunakan Pomm2

Pomm menyediakan pendekatan modular, converter data, dukungan listen/notify, inspector database, dan lain-lain.

Query manager Pomm melakukan escaping argument query untuk mencegah SQL injection. Jika argument di-cast, Pomm juga mengonversinya dari representasi PHP menjadi nilai PostgreSQL valid.

---

# Bab 26: Koneksi PostgreSQL dari Java

Java memakai JDBC untuk database relasional. API JDBC diimplementasikan oleh driver JDBC. Letakkan file JAR driver pada Java class path.

## 26.1 Koneksi dengan `java.sql.DriverManager`

```java
private static java.sql.Connection connect(String url, String user, String password)
    throws ClassNotFoundException, java.sql.SQLException {

    Class.forName("org.postgresql.Driver");
    return java.sql.DriverManager.getConnection(url, user, password);
}
```

`user` dan `password` juga dapat dimasukkan dalam JDBC URL.

## 26.2 Koneksi dengan `DriverManager` dan `Properties`

```java
private static java.sql.Connection connect(String url, String user, String password)
    throws ClassNotFoundException, java.sql.SQLException {

    Class.forName("org.postgresql.Driver");

    java.util.Properties props = new java.util.Properties();
    props.setProperty("user", user);
    props.setProperty("password", password);
    props.setProperty("prepareThreshold", "0");

    return java.sql.DriverManager.getConnection(url, props);
}
```

## 26.3 Koneksi dengan `javax.sql.DataSource` dan connection pool

```java
private static javax.sql.DataSource createDataSource(String url, String user, String password) {
    org.postgresql.ds.PGPoolingDataSource ds = new org.postgresql.ds.PGPoolingDataSource();
    ds.setUrl(url);
    ds.setUser(user);
    ds.setPassword(password);
    ds.setInitialConnections(10);
    ds.setMaxConnections(20);
    ds.setSslMode("require");
    ds.setSslfactory("org.postgresql.ssl.NonValidatingFactory");
    return ds;
}
```

Pemakaian:

```java
java.sql.Connection conn = ds.getConnection();
// lakukan pekerjaan
conn.close(); // mengembalikan koneksi ke pool
```

---

# Bab 27: PostgreSQL High Availability

## 27.1 Replikasi di PostgreSQL

### Konfigurasi primary server

Kebutuhan:

- User replikasi.
- Direktori untuk menyimpan WAL archive.

Membuat user replikasi:

```bash
createuser -U postgres replication -P -c 5 --replication
```

Membuat direktori archive:

```bash
mkdir $PGDATA/archive
```

Tambahkan pada `pg_hba.conf`:

```text
host    replication    replication    <slave-IP>/32    md5
```

Edit `postgresql.conf`:

```text
wal_level = hot_standby
archive_mode = on
archive_command = 'test ! -f /path/to/archivedir/%f && cp %p /path/to/archivedir/%f'
wal_senders = 5
```

Restart primary server.

### Backup primary ke standby

Jalankan `pg_basebackup`:

```bash
pg_basebackup -h <PRIMARY IP> -D /var/lib/postgresql/<VERSION>/main -U replication -v -P --xlog-method=stream
```

Keterangan:

- `-D`: lokasi backup awal.
- `-h`: host primary server.
- `--xlog-method=stream`: membuka koneksi lain untuk streaming xlog selama backup.

### Konfigurasi standby server

Pada `postgresql.conf`:

```text
hot_standby = on
```

Buat `recovery.conf`:

```text
standby_mode = on
primary_conninfo = 'host=<PRIMARY_IP> port=5432 user=replication password=<PASSWORD>'
trigger_file = '/tmp/postgresql.trigger.5432'
```

`trigger_file` dapat digunakan untuk memicu failover. Alternatifnya, gunakan `pg_ctl promote`.

---

# Bab 28: Extension `dblink` dan `postgres_fdw`

## 28.1 Extension FDW

```sql
CREATE EXTENSION postgres_fdw;

CREATE SERVER name_srv
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'hostname', dbname 'bd_name', port '5432');

CREATE USER MAPPING FOR postgres
SERVER name_srv
OPTIONS (user 'postgres', password 'password');

CREATE FOREIGN TABLE table_foreign (
  id INTEGER,
  code CHARACTER VARYING
)
SERVER name_srv
OPTIONS (schema_name 'schema', table_name 'table');

SELECT * FROM table_foreign;
```

## 28.2 Foreign Data Wrapper untuk schema lengkap

```sql
CREATE EXTENSION postgres_fdw;

CREATE SERVER server_name
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'host_ip', dbname 'db_name', port 'port_number');

CREATE USER MAPPING FOR CURRENT_USER
SERVER server_name
OPTIONS (user 'user_name', password 'password');

CREATE SCHEMA schema_name;

IMPORT FOREIGN SCHEMA schema_name_to_import_from_remote_db
FROM SERVER server_name
INTO schema_name;

SELECT * FROM schema_name.table_name;
```

## 28.3 Extension `dblink`

```sql
CREATE EXTENSION dblink;

SELECT *
FROM dblink(
  'dbname=bd_distance port=5432 host=10.6.6.6 user=username password=passw@rd',
  'SELECT id, code FROM schema.table'
) AS newTable(id INTEGER, code CHARACTER VARYING);
```

---

# Bab 29: Tips dan Trik PostgreSQL

## 29.1 Alternatif `DATEADD` di PostgreSQL

```sql
SELECT CURRENT_DATE + '1 day'::INTERVAL;
SELECT '1999-12-11'::TIMESTAMP + '19 days'::INTERVAL;
SELECT '1 month'::INTERVAL + '1 month 3 days'::INTERVAL;
```

## 29.2 Nilai kolom dipisahkan koma

```sql
SELECT STRING_AGG(<TABLE_NAME>.<COLUMN_NAME>, ',')
FROM <SCHEMA_NAME>.<TABLE_NAME> T;
```

## 29.3 Menghapus record duplikat

```sql
DELETE FROM <SCHEMA_NAME>.<TABLE_NAME>
WHERE ctid NOT IN (
    SELECT MAX(ctid)
    FROM <SCHEMA_NAME>.<TABLE_NAME>
    GROUP BY <SCHEMA_NAME>.<TABLE_NAME>.*
);
```

## 29.4 Update dengan join antar dua tabel

```sql
UPDATE <SCHEMA_NAME>.<TABLE_NAME_1> AS A
SET <COLUMN_1> = TRUE
FROM <SCHEMA_NAME>.<TABLE_NAME_2> AS B
WHERE A.<COLUMN_2> = B.<COLUMN_2>
  AND A.<COLUMN_3> = B.<COLUMN_3>;
```

## 29.5 Selisih dua timestamp dalam bulan dan tahun

Selisih bulan:

```sql
SELECT (
    (DATE_PART('year', AgeonDate) - DATE_PART('year', tmpdate)) * 12
    +
    (DATE_PART('month', AgeonDate) - DATE_PART('month', tmpdate))
)
FROM dbo."Table1";
```

Selisih tahun:

```sql
SELECT (DATE_PART('year', AgeonDate) - DATE_PART('year', tmpdate))
FROM dbo."Table1";
```

## 29.6 Copy/pindah data tabel antar database dengan schema sama

```sql
CREATE EXTENSION dblink;

INSERT INTO <SCHEMA_NAME>.<TABLE_NAME_1>
SELECT *
FROM dblink(
    'HOST=<IP-ADDRESS> USER=<USERNAME> PASSWORD=<PASSWORD> DBNAME=<DATABASE>',
    'SELECT * FROM <SCHEMA_NAME>.<TABLE_NAME_2>'
) AS <TABLE_NAME> (
    <COLUMN_1> <DATATYPE_1>,
    <COLUMN_2> <DATATYPE_2>,
    <COLUMN_3> <DATATYPE_3>
);
```

---

# Kredit

Terima kasih kepada para kontributor Stack Overflow Documentation yang menyediakan materi untuk buku ini. Beberapa nama kontributor yang tercantum dalam dokumen sumber antara lain Alison S, Andrew Cichocki, ankidaemon, AstraSerg, Ben, Ben H, bignose, Blackus, chalitha geekiyanage, commonSenseCode, Dakota Wagner, Daniel Lyons, Demircan Celebi, Dmitri Goldring, e4c5, evuez, Goerman, gpdude_, greg, Jakub Fedyczak, jasonszhao, Jefferson, jgm, joseph, Kevin Sylvestre, KIM, KIRAN KUMAR MATAM, Laurenz Albe, leeor, Mohamed Navas, Mokadillion, Nathaniel Waisbrot, Nuri Tasdemir, Patrick, Reboot, Riya Bansal, Tajinder, Tom Gerken, Udlei Nati, user_0, Vao Tsun, wOwhOw, YCF_L, dan lainnya.

---

## Catatan konversi

- Struktur bab dan subbab dipertahankan.
- Kode/perintah dipertahankan dalam bahasa aslinya.
- Istilah teknis umum seperti `role`, `trigger`, `schema`, `backup`, `restore`, `query`, `index`, dan `extension` dipertahankan bila lebih lazim dalam ekosistem PostgreSQL.
