---
title: PowerShell Notes for Professionals
description: Versi ini dirapikan dan diperingkas dari dokumen PowerShell Notes
  for Professionals. Fokusnya adalah navigasi cepat, inti materi, dan daftar
  konsep/cmdlet penting per bab.
pubDate: 2026-05-25T23:17:00.000Z
image: /image/Power_Shell.webp
draft: false
categories:
  - Teknologi
tags:
  - powershell
---
# PowerShell Notes for Professionals

> Versi ini dirapikan dan diperingkas dari dokumen PowerShell Notes for Professionals. Fokusnya adalah navigasi cepat, inti materi, dan daftar konsep/cmdlet penting per bab.

## Cara Pakai Dokumen

- Gunakan **Daftar Isi** untuk lompat ke bab tertentu.
- Setiap bab berisi **inti materi**, **topik/bagian**, dan **cmdlet/konsep cepat**.
- Contoh kode tidak ditampilkan penuh agar dokumen lebih ringkas; gunakan versi lengkap jika perlu detail sintaks.

## Daftar Isi

### Dasar PowerShell
- [Bab 1: Memulai PowerShell](#bab-1-memulai-powershell)
- [Bab 2: Variabel di PowerShell](#bab-2-variabel-di-powershell)
- [Bab 3: Operator](#bab-3-operator)
- [Bab 4: Operator Khusus](#bab-4-operator-khusus)
- [Bab 5: Operasi Set Dasar](#bab-5-operasi-set-dasar)
- [Bab 6: Logika Kondisional](#bab-6-logika-kondisional)
- [Bab 7: Perulangan](#bab-7-perulangan)
- [Bab 8: Pernyataan Switch](#bab-8-pernyataan-switch)
- [Bab 9: String](#bab-9-string)
- [Bab 10: HashTable](#bab-10-hashtable)
- [Bab 11: Bekerja dengan Objek](#bab-11-bekerja-dengan-objek)
- [Bab 12: Fungsi PowerShell](#bab-12-fungsi-powershell)
- [Bab 13: Kelas PowerShell](#bab-13-kelas-powershell)
- [Bab 14: Modul PowerShell](#bab-14-modul-powershell)

### Objek, Modul, Pipeline, dan Data
- [Bab 15: Profil PowerShell](#bab-15-profil-powershell)
- [Bab 16: Properti Terhitung](#bab-16-properti-terhitung)
- [Bab 17: Menggunakan Kelas Statis .NET](#bab-17-menggunakan-kelas-statis-net)
- [Bab 18: Variabel Bawaan](#bab-18-variabel-bawaan)
- [Bab 19: Variabel Otomatis](#bab-19-variabel-otomatis)
- [Bab 20: Variabel Lingkungan](#bab-20-variabel-lingkungan)
- [Bab 21: Splatting](#bab-21-splatting)
- [Bab 22: Stream PowerShell](#bab-22-stream-powershell)
- [Bab 23: Mengirim Email](#bab-23-mengirim-email)
- [Bab 24: PowerShell Remoting](#bab-24-powershell-remoting)
- [Bab 25: Pipeline PowerShell](#bab-25-pipeline-powershell)
- [Bab 26: Background Job PowerShell](#bab-26-background-job-powershell)
- [Bab 27: Perilaku Return di PowerShell](#bab-27-perilaku-return-di-powershell)
- [Bab 28: Parsing CSV](#bab-28-parsing-csv)
- [Bab 29: Bekerja dengan File XML](#bab-29-bekerja-dengan-file-xml)

### Integrasi, Tooling, dan CLI
- [Bab 30: RESTful API](#bab-30-restful-api)
- [Bab 31: Query SQL PowerShell](#bab-31-query-sql-powershell)
- [Bab 32: Regular Expression](#bab-32-regular-expression)
- [Bab 33: Alias](#bab-33-alias)
- [Bab 34: Progress Bar](#bab-34-progress-bar)
- [Bab 35: Command-Line PowerShell.exe](#bab-35-command-line-powershellexe)
- [Bab 36: Penamaan Cmdlet](#bab-36-penamaan-cmdlet)
- [Bab 37: Menjalankan Executable](#bab-37-menjalankan-executable)
- [Bab 38: Prasyarat Script](#bab-38-prasyarat-script)
- [Bab 39: Sistem Bantuan](#bab-39-sistem-bantuan)
- [Bab 40: Modul, Script, dan Fungsi](#bab-40-modul-script-dan-fungsi)
- [Bab 41: Konvensi Penamaan](#bab-41-konvensi-penamaan)
- [Bab 42: Parameter Umum](#bab-42-parameter-umum)
- [Bab 43: Parameter Set](#bab-43-parameter-set)
- [Bab 44: Parameter Dinamis](#bab-44-parameter-dinamis)
- [Bab 45: GUI di PowerShell](#bab-45-gui-di-powershell)
- [Bab 46: URL Encode/Decode](#bab-46-url-encodedecode)

### Automation, Security, Cloud, dan Enterprise
- [Bab 47: Penanganan Error](#bab-47-penanganan-error)
- [Bab 48: Manajemen Paket](#bab-48-manajemen-paket)
- [Bab 49: Komunikasi TCP](#bab-49-komunikasi-tcp)
- [Bab 50: Workflow PowerShell](#bab-50-workflow-powershell)
- [Bab 51: Managed Code C# / VB](#bab-51-managed-code-c-vb)
- [Bab 52: Download Artifact dari Artifactory](#bab-52-download-artifact-dari-artifactory)
- [Bab 53: Comment-Based Help](#bab-53-comment-based-help)
- [Bab 54: Modul Archive](#bab-54-modul-archive)
- [Bab 55: Otomasi Infrastruktur](#bab-55-otomasi-infrastruktur)
- [Bab 56: PSScriptAnalyzer](#bab-56-psscriptanalyzer)
- [Bab 57: Desired State Configuration DSC](#bab-57-desired-state-configuration-dsc)
- [Bab 58: ShouldProcess](#bab-58-shouldprocess)
- [Bab 59: Scheduled Tasks](#bab-59-scheduled-tasks)
- [Bab 60: Modul ISE](#bab-60-modul-ise)
- [Bab 61: Resource DSC Berbasis Class](#bab-61-resource-dsc-berbasis-class)
- [Bab 62: WMI dan CIM](#bab-62-wmi-dan-cim)
- [Bab 63: Modul ActiveDirectory](#bab-63-modul-activedirectory)
- [Bab 64: Modul SharePoint](#bab-64-modul-sharepoint)
- [Bab 65: Psake](#bab-65-psake)
- [Bab 66: Pester](#bab-66-pester)
- [Bab 67: Secret dan Credential](#bab-67-secret-dan-credential)
- [Bab 68: Security dan Cryptography](#bab-68-security-dan-cryptography)
- [Bab 69: Signing Scripts](#bab-69-signing-scripts)
- [Bab 70: Anonimisasi IP](#bab-70-anonimisasi-ip)
- [Bab 71: AWS Rekognition](#bab-71-aws-rekognition)
- [Bab 72: AWS S3](#bab-72-aws-s3)

---
<a id="bab-1-memulai-powershell"></a>
## Bab 1: Memulai PowerShell

**Inti:** Fondasi PowerShell: execution policy, alias, pipeline, pemanggilan .NET, instalasi, komentar, dan pembuatan objek.

**Topik penting:**
- <a id="bagian-11-allow-scripts-stored-on-your-machine-to-run-un-signed-2"></a>**1.1** — Allow scripts stored on your machine to run un-signed 2 ........................................................................
- <a id="bagian-12-aliases-similar-functions-2"></a>**1.2** — Aliases & Similar Functions 2 .......................................................................................................................
- <a id="bagian-13-the-pipeline-using-output-from-a-powershell-cmdlet-3"></a>**1.3** — The Pipeline-Using Output from a PowerShell cmdlet 3 ........................................................................
- <a id="bagian-14-calling-net-library-methods-4"></a>**1.4** — Calling .Net Library Methods 4 ....................................................................................................................
- <a id="bagian-15-installation-or-setup-5"></a>**1.5** — Installation or Setup 5 ..................................................................................................................................
- <a id="bagian-16-commenting-5"></a>**1.6** — Commenting 5 ...............................................................................................................................................
- <a id="bagian-17-creating-objects-6"></a>**1.7** — Creating Objects 6 ........................................................................................................................................

---
<a id="bab-2-variabel-di-powershell"></a>
## Bab 2: Variabel di PowerShell

**Inti:** Cara menyimpan dan mengelola nilai memakai variabel, array, scope, assignment multi-variabel, dan penghapusan variabel.

**Topik penting:**
- <a id="bagian-21-simple-variable-7"></a>**2.1** — Simple variable 7 ..........................................................................................................................................
- <a id="bagian-22-arrays-7"></a>**2.2** — Arrays 7 ........................................................................................................................................................
- <a id="bagian-23-list-assignment-of-multiple-variables-7"></a>**2.3** — List Assignment of Multiple Variables 7 .....................................................................................................
- <a id="bagian-24-scope-8"></a>**2.4** — Scope 8 .........................................................................................................................................................
- <a id="bagian-25-removing-a-variable-8"></a>**2.5** — Removing a variable 8 ................................................................................................................................

---
<a id="bab-3-operator"></a>
## Bab 3: Operator

**Inti:** Operator penting untuk perbandingan, aritmatika, assignment, redirection stream, logika, dan manipulasi string.

**Topik penting:**
- <a id="bagian-31-comparison-operators-9"></a>**3.1** — Comparison Operators 9 .............................................................................................................................
- <a id="bagian-32-arithmetic-operators-9"></a>**3.2** — Arithmetic Operators 9 ................................................................................................................................
- <a id="bagian-33-assignment-operators-10"></a>**3.3** — Assignment Operators 10 ...........................................................................................................................
- <a id="bagian-34-redirection-operators-10"></a>**3.4** — Redirection Operators 10 ............................................................................................................................
- <a id="bagian-35-mixing-operand-types-the-type-of-the-left-operand-dictates-the-behavior-11"></a>**3.5** — Mixing operand types, the type of the left operand dictates the behavior 11 ......................................
- <a id="bagian-36-logical-operators-11"></a>**3.6** — Logical Operators 11 ...................................................................................................................................
- <a id="bagian-37-string-manipulation-operators-11"></a>**3.7** — String Manipulation Operators 11 ..............................................................................................................

---
<a id="bab-4-operator-khusus"></a>
## Bab 4: Operator Khusus

**Inti:** Operator khusus seperti array expression, call operator, dan dot sourcing untuk menjalankan script di scope tertentu.

**Topik penting:**
- <a id="bagian-41-array-expression-operator-13"></a>**4.1** — Array Expression Operator 13 .....................................................................................................................
- <a id="bagian-42-call-operation-13"></a>**4.2** — Call Operation 13 .........................................................................................................................................
- <a id="bagian-43-dot-sourcing-operator-13"></a>**4.3** — Dot sourcing operator 13 ............................................................................................................................

---
<a id="bab-5-operasi-set-dasar"></a>
## Bab 5: Operasi Set Dasar

**Inti:** Operasi koleksi dasar: filter, sort, group, dan select/projection objek PowerShell.

**Topik penting:**
- <a id="bagian-51-filtering-where-object-where-14"></a>**5.1** — Filtering: Where-Object / where / ? 14 ......................................................................................................
- <a id="bagian-52-ordering-sort-object-sort-14"></a>**5.2** — Ordering: Sort-Object / sort 14 ..................................................................................................................
- <a id="bagian-53-grouping-group-object-group-15"></a>**5.3** — Grouping: Group-Object / group 15 ..........................................................................................................
- <a id="bagian-54-projecting-select-object-select-16"></a>**5.4** — Projecting: Select-Object / select 16 ..........................................................................................................

**Cmdlet/konsep cepat:** `Where-Object`, `Sort-Object`, `Group-Object`, `Select-Object`

---
<a id="bab-6-logika-kondisional"></a>
## Bab 6: Logika Kondisional

**Inti:** Pola percabangan dengan if/else/elseif, negasi, dan perilaku truthy/falsy dalam PowerShell.

**Topik penting:**
- <a id="bagian-61-if-else-and-else-if-17"></a>**6.1** — if, else and else if 17 .....................................................................................................................................
- <a id="bagian-62-negation-17"></a>**6.2** — Negation 17 ..................................................................................................................................................
- <a id="bagian-63-if-conditional-shorthand-18"></a>**6.3** — If conditional shorthand 18 .........................................................................................................................

---
<a id="bab-7-perulangan"></a>
## Bab 7: Perulangan

**Inti:** Teknik perulangan: foreach, for, ForEach-Object, continue, break, while, dan do/until.

**Topik penting:**
- <a id="bagian-71-foreach-19"></a>**7.1** — Foreach 19 .....................................................................................................................................................
- <a id="bagian-72-for-19"></a>**7.2** — For 19 ............................................................................................................................................................
- <a id="bagian-73-foreach-method-19"></a>**7.3** — ForEach() Method 19 ...................................................................................................................................
- <a id="bagian-74-foreach-object-20"></a>**7.4** — ForEach-Object 20 .......................................................................................................................................
- <a id="bagian-75-continue-21"></a>**7.5** — Continue 21 ...................................................................................................................................................
- <a id="bagian-76-break-21"></a>**7.6** — Break 21 ........................................................................................................................................................
- <a id="bagian-77-while-22"></a>**7.7** — While 22 .........................................................................................................................................................
- <a id="bagian-78-do-22"></a>**7.8** — Do 22 .............................................................................................................................................................

**Cmdlet/konsep cepat:** `ForEach-Object`

---
<a id="bab-8-pernyataan-switch"></a>
## Bab 8: Pernyataan Switch

**Inti:** Penggunaan switch untuk banyak kondisi, termasuk wildcard, regex, file input, exact match, default, dan break.

**Topik penting:**
- <a id="bagian-81-simple-switch"></a>**8.1** — Simple Switch ...........................................................................................................................................
- <a id="bagian-82-switch-statement-with-casesensitive-parameter"></a>**8.2** — Switch Statement with CaseSensitive Parameter ...............................................................................
- <a id="bagian-83-switch-statement-with-wildcard-parameter"></a>**8.3** — Switch Statement with Wildcard Parameter ........................................................................................
- <a id="bagian-84-switch-statement-with-file-parameter"></a>**8.4** — Switch Statement with File Parameter .................................................................................................
- <a id="bagian-85-simple-switch-with-default-condition"></a>**8.5** — Simple Switch with Default Condition ...................................................................................................
- <a id="bagian-86-switch-statement-with-regex-parameter"></a>**8.6** — Switch Statement with Regex Parameter ............................................................................................
- <a id="bagian-87-simple-switch-with-break"></a>**8.7** — Simple Switch With Break ......................................................................................................................
- <a id="bagian-88-switch-statement-with-exact-parameter"></a>**8.8** — Switch Statement with Exact Parameter ..............................................................................................
- <a id="bagian-89-switch-statement-with-expressions"></a>**8.9** — Switch Statement with Expressions ......................................................................................................

---
<a id="bab-9-string"></a>
## Bab 9: String

**Inti:** Pengolahan string: multi-line string, here-string, concatenation, karakter escape, literal string, dan format string.

**Topik penting:**
- <a id="bagian-91-multiline-string"></a>**9.1** — Multiline string ..........................................................................................................................................
- <a id="bagian-92-here-string"></a>**9.2** — Here-string ..............................................................................................................................................
- <a id="bagian-93-concatenating-strings"></a>**9.3** — Concatenating strings ............................................................................................................................
- <a id="bagian-94-special-characters"></a>**9.4** — Special characters ..................................................................................................................................
- <a id="bagian-95-creating-a-basic-string"></a>**9.5** — Creating a basic string ...........................................................................................................................
- <a id="bagian-96-format-string"></a>**9.6** — Format string ..........................................................................................................................................

---
<a id="bab-10-hashtable"></a>
## Bab 10: HashTable

**Inti:** HashTable sebagai struktur key-value: membuat, membaca, menambah, menghapus, enumerasi, dan looping.

**Topik penting:**
- <a id="bagian-101-access-a-hash-table-value-by-key"></a>**10.1** — Access a hash table value by key ........................................................................................................
- <a id="bagian-102-creating-a-hash-table"></a>**10.2** — Creating a Hash Table ..........................................................................................................................
- <a id="bagian-103-add-a-key-value-pair-to-an-existing-hash-table"></a>**10.3** — Add a key value pair to an existing hash table ..................................................................................
- <a id="bagian-104-remove-a-key-value-pair-from-an-existing-hash-table"></a>**10.4** — Remove a key value pair from an existing hash table .....................................................................
- <a id="bagian-105-enumerating-through-keys-and-key-value-pairs"></a>**10.5** — Enumerating through keys and Key-Value Pairs ..............................................................................
- <a id="bagian-106-looping-over-a-hash-table"></a>**10.6** — Looping over a hash table ...................................................................................................................

---
<a id="bab-11-bekerja-dengan-objek"></a>
## Bab 11: Bekerja dengan Objek

**Inti:** Bekerja dengan objek: inspeksi member, menambah/menghapus properti, membuat objek custom, dan generic class.

**Topik penting:**
- <a id="bagian-111-examining-an-object"></a>**11.1** — Examining an object ...............................................................................................................................
- <a id="bagian-112-updating-objects"></a>**11.2** — Updating Objects ...................................................................................................................................
- <a id="bagian-113-creating-a-new-object"></a>**11.3** — Creating a new object ............................................................................................................................
- <a id="bagian-114-creating-instances-of-generic-classes"></a>**11.4** — Creating Instances of Generic Classes ................................................................................................

---
<a id="bab-12-fungsi-powershell"></a>
## Bab 12: Fungsi PowerShell

**Inti:** Pembuatan fungsi: parameter dasar/lanjutan, mandatory parameter, validasi, dan fungsi tanpa parameter.

**Topik penting:**
- <a id="bagian-121-basic-parameters"></a>**12.1** — Basic Parameters ...................................................................................................................................
- <a id="bagian-122-advanced-function"></a>**12.2** — Advanced Function ...............................................................................................................................
- <a id="bagian-123-mandatory-parameters"></a>**12.3** — Mandatory Parameters ........................................................................................................................
- <a id="bagian-124-parameter-validation"></a>**12.4** — Parameter Validation ............................................................................................................................
- <a id="bagian-125-simple-function-with-no-parameters"></a>**12.5** — Simple Function with No Parameters ..................................................................................................

---
<a id="bab-13-kelas-powershell"></a>
## Bab 13: Kelas PowerShell

**Inti:** Class PowerShell: constructor, method, property, overload, inheritance, dan template class.

**Topik penting:**
- <a id="bagian-131-listing-available-constructors-for-a-class"></a>**13.1** — Listing available constructors for a class ............................................................................................
- <a id="bagian-132-methods-and-properties"></a>**13.2** — Methods and properties .......................................................................................................................
- <a id="bagian-133-constructor-overloading"></a>**13.3** — Constructor overloading .......................................................................................................................
- <a id="bagian-134-get-all-members-of-an-instance"></a>**13.4** — Get All Members of an Instance ...........................................................................................................
- <a id="bagian-135-basic-class-template"></a>**13.5** — Basic Class Template ............................................................................................................................
- <a id="bagian-136-inheritance-from-parent-class-to-child-class"></a>**13.6** — Inheritance from Parent Class to Child Class .....................................................................................

---
<a id="bab-14-modul-powershell"></a>
## Bab 14: Modul PowerShell

**Inti:** Modul PowerShell: manifest, struktur folder, ekspor fungsi/variabel, lokasi modul, dan visibilitas member.

**Topik penting:**
- <a id="bagian-141-create-a-module-manifest"></a>**14.1** — Create a Module Manifest .....................................................................................................................
- <a id="bagian-142-simple-module-example"></a>**14.2** — Simple Module Example .......................................................................................................................
- <a id="bagian-143-exporting-a-variable-from-a-module"></a>**14.3** — Exporting a Variable from a Module ...................................................................................................
- <a id="bagian-144-structuring-powershell-modules"></a>**14.4** — Structuring PowerShell Modules ..........................................................................................................
- <a id="bagian-145-location-of-modules"></a>**14.5** — Location of Modules ..............................................................................................................................
- <a id="bagian-146-module-member-visibility"></a>**14.6** — Module Member Visibility .....................................................................................................................

---
<a id="bab-15-profil-powershell"></a>
## Bab 15: Profil PowerShell

**Inti:** Profil PowerShell untuk memuat otomatis fungsi, alias, dan konfigurasi pengguna saat shell dibuka.

**Topik penting:**
- <a id="bagian-151-create-an-basic-profle"></a>**15.1** — Create an basic profle ..........................................................................................................................

---
<a id="bab-16-properti-terhitung"></a>
## Bab 16: Properti Terhitung

**Inti:** Calculated properties untuk membentuk properti hasil kalkulasi saat memakai Select-Object.

**Topik penting:**
- <a id="bagian-161-display-fle-size-in-kb-calculated-properties"></a>**16.1** — Display fle size in KB-Calculated Properties .....................................................................................

---
<a id="bab-17-menggunakan-kelas-statis-net"></a>
## Bab 17: Menggunakan Kelas Statis .NET

**Inti:** Pemakaian class statis .NET seperti System.Math dan GUID dari PowerShell.

**Topik penting:**
- <a id="bagian-171-adding-types"></a>**17.1** — Adding types ...........................................................................................................................................
- <a id="bagian-172-using-the-net-math-class"></a>**17.2** — Using the .Net Math Class .....................................................................................................................
- <a id="bagian-173-creating-new-guid-instantly"></a>**17.3** — Creating new GUID instantly ................................................................................................................

---
<a id="bab-18-variabel-bawaan"></a>
## Bab 18: Variabel Bawaan

**Inti:** Variabel bawaan penting seperti $PSScriptRoot, $Args, $PSItem, $?, dan $error.

**Topik penting:**
- <a id="bagian-181-psscriptroot"></a>**18.1** — $PSScriptRoot .........................................................................................................................................
- <a id="bagian-182-args"></a>**18.2** — $Args ......................................................................................................................................................
- <a id="bagian-183-psitem"></a>**18.3** — $PSItem ...................................................................................................................................................
- <a id="bagian-184"></a>**18.4** — $? .............................................................................................................................................................
- <a id="bagian-185-error"></a>**18.5** — $error ......................................................................................................................................................

**Cmdlet/konsep cepat:** `$PSScriptRoot`, `$Args`, `$PSItem`, `$?`, `$error`

---
<a id="bab-19-variabel-otomatis"></a>
## Bab 19: Variabel Otomatis

**Inti:** Variabel otomatis seperti $OFS, $null, $pid, $true/$false, $_/$PSItem, dan $PSVersionTable.

**Topik penting:**
- <a id="bagian-191-ofs"></a>**19.1** — $OFS ........................................................................................................................................................
- <a id="bagian-192"></a>**19.2** — $? .............................................................................................................................................................
- <a id="bagian-193-null"></a>**19.3** — $null .........................................................................................................................................................
- <a id="bagian-194-error"></a>**19.4** — $error ......................................................................................................................................................
- <a id="bagian-195-pid"></a>**19.5** — $pid .........................................................................................................................................................
- <a id="bagian-196-boolean-values"></a>**19.6** — Boolean values ......................................................................................................................................
- <a id="bagian-197-psitem"></a>**19.7** — $_ / $PSItem ..........................................................................................................................................
- <a id="bagian-198-psversiontable"></a>**19.8** — $PSVersionTable ...................................................................................................................................

**Cmdlet/konsep cepat:** `$OFS`, `$?`, `$null`, `$error`, `$pid`, `$_`, `$PSItem`, `$PSVersionTable`

---
<a id="bab-20-variabel-lingkungan"></a>
## Bab 20: Variabel Lingkungan

**Inti:** Mengakses environment variables melalui drive Env: dan notasi $env:.

**Topik penting:**
- <a id="bagian-201-windows-environment-variables-are-visible-as-a-ps-drive-called-env"></a>**20.1** — Windows environment variables are visible as a PS drive called Env: ............................................
- <a id="bagian-202-instant-call-of-environment-variables-with-env"></a>**20.2** — Instant call of Environment Variables with $env: ..............................................................................

**Cmdlet/konsep cepat:** `$env`

---
<a id="bab-21-splatting"></a>
## Bab 21: Splatting

**Inti:** Splatting untuk mengirim banyak parameter memakai hashtable agar command lebih ringkas dan reusable.

**Topik penting:**
- <a id="bagian-211-piping-and-splatting"></a>**21.1** — Piping and Splatting ...............................................................................................................................
- <a id="bagian-212-passing-a-switch-parameter-using-splatting"></a>**21.2** — Passing a Switch parameter using Splatting ......................................................................................
- <a id="bagian-213-splatting-from-top-level-function-to-a-series-of-inner-function"></a>**21.3** — Splatting From Top Level Function to a Series of Inner Function ....................................................
- <a id="bagian-214-splatting-parameters"></a>**21.4** — Splatting parameters ............................................................................................................................

---
<a id="bab-22-stream-powershell"></a>
## Bab 22: Stream PowerShell

**Inti:** Stream output PowerShell: output, error, warning, verbose, debug, information, dan preference variable.

**Topik penting:**
- <a id="bagian-221-write-output"></a>**22.1** — Write-Output ..........................................................................................................................................
- <a id="bagian-222-write-preferences"></a>**22.2** — Write Preferences .................................................................................................................................

**Cmdlet/konsep cepat:** `Write-Output`

---
<a id="bab-23-mengirim-email"></a>
## Bab 23: Mengirim Email

**Inti:** Pengiriman email dengan Send-MailMessage dan SMTPClient.

**Topik penting:**
- <a id="bagian-231-send-mailmessage-with-predefned-parameters"></a>**23.1** — Send-MailMessage with predefned parameters ...............................................................................
- <a id="bagian-232-simple-send-mailmessage"></a>**23.2** — Simple Send-MailMessage ...................................................................................................................
- <a id="bagian-233-smtpclient-mail-with-txt-fle-in-body-message"></a>**23.3** — SMTPClient-Mail with .txt fle in body message ...............................................................................

---
<a id="bab-24-powershell-remoting"></a>
## Bab 24: PowerShell Remoting

**Inti:** PowerShell Remoting: Enter-PSSession, Invoke-Command, serialization, trusted hosts, dan cleanup PSSession.

**Topik penting:**
- <a id="bagian-241-connecting-to-a-remote-server-via-powershell"></a>**24.1** — Connecting to a Remote Server via PowerShell ................................................................................
- <a id="bagian-242-run-commands-on-a-remote-computer"></a>**24.2** — Run commands on a Remote Computer ...........................................................................................
- <a id="bagian-243-enabling-powershell-remoting"></a>**24.3** — Enabling PowerShell Remoting ...........................................................................................................
- <a id="bagian-244-a-best-practise-for-automatically-cleaning-up-pssessions"></a>**24.4** — A best practise for automatically cleaning-up PSSessions ..............................................................

---
<a id="bab-25-pipeline-powershell"></a>
## Bab 25: Pipeline PowerShell

**Inti:** Pipeline berbasis objek dan cara membuat fungsi yang menerima input pipeline.

**Topik penting:**
- <a id="bagian-251-writing-functions-with-advanced-lifecycle"></a>**25.1** — Writing Functions with Advanced Lifecycle ........................................................................................
- <a id="bagian-252-basic-pipeline-support-in-functions"></a>**25.2** — Basic Pipeline Support in Functions ....................................................................................................
- <a id="bagian-253-working-concept-of-pipeline"></a>**25.3** — Working concept of pipeline ...............................................................................................................

---
<a id="bab-26-background-job-powershell"></a>
## Bab 26: Background Job PowerShell

**Inti:** Background jobs untuk menjalankan proses panjang tanpa mengunci prompt.

**Topik penting:**
- <a id="bagian-261-basic-job-creation"></a>**26.1** — Basic job creation ..................................................................................................................................
- <a id="bagian-262-basic-job-management"></a>**26.2** — Basic job management ........................................................................................................................

---
<a id="bab-27-perilaku-return-di-powershell"></a>
## Bab 27: Perilaku Return di PowerShell

**Inti:** Perilaku return dan output pipeline dalam fungsi/script PowerShell.

**Topik penting:**
- <a id="bagian-271-early-exit"></a>**27.1** — Early exit .................................................................................................................................................
- <a id="bagian-272-gotcha-return-in-the-pipeline"></a>**27.2** — Gotcha! Return in the pipeline .............................................................................................................
- <a id="bagian-273-return-with-a-value"></a>**27.3** — Return with a value ...............................................................................................................................
- <a id="bagian-274-how-to-work-with-functions-returns"></a>**27.4** — How to work with functions returns ....................................................................................................
- <a id="bagian-275-gotcha-ignoring-unwanted-output"></a>**27.5** — Gotcha! Ignoring unwanted output .....................................................................................................

---
<a id="bab-28-parsing-csv"></a>
## Bab 28: Parsing CSV

**Inti:** Import CSV dan casting tipe data hasil Import-Csv.

**Topik penting:**
- <a id="bagian-281-basic-usage-of-import-csv"></a>**28.1** — Basic usage of Import-Csv ...................................................................................................................
- <a id="bagian-282-import-from-csv-and-cast-properties-to-correct-type"></a>**28.2** — Import from CSV and cast properties to correct type .....................................................................

**Cmdlet/konsep cepat:** `Import-Csv`

---
<a id="bab-29-bekerja-dengan-file-xml"></a>
## Bab 29: Bekerja dengan File XML

**Inti:** Membaca, menulis, memanipulasi XML, XPath, namespace, dan XmlWriter.

**Topik penting:**
- <a id="bagian-291-accessing-an-xml-file"></a>**29.1** — Accessing an XML File ...........................................................................................................................
- <a id="bagian-292-creating-an-xml-document-using-xmlwriter"></a>**29.2** — Creating an XML Document using XmlWriter() .................................................................................
- <a id="bagian-293-adding-snippets-of-xml-to-current-xmldocument"></a>**29.3** — Adding snippets of XML to current XMLDocument ...........................................................................

---
<a id="bab-30-restful-api"></a>
## Bab 30: RESTful API

**Inti:** Konsumsi REST API memakai Invoke-RestMethod untuk GET, POST, PUT, dan DELETE.

**Topik penting:**
- <a id="bagian-301-post-message-to-hipchat"></a>**30.1** — Post Message to hipChat ......................................................................................................................
- <a id="bagian-302-using-rest-with-powershell-objects-to-get-and-post-many-items"></a>**30.2** — Using REST with PowerShell Objects to GET and POST many items ..............................................
- <a id="bagian-303-use-slackcom-incoming-webhooks"></a>**30.3** — Use Slack.com Incoming Webhooks ..................................................................................................
- <a id="bagian-304-using-rest-with-powershell-objects-to-get-and-put-individual-data"></a>**30.4** — Using REST with PowerShell Objects to Get and Put individual data .............................................
- <a id="bagian-305-using-rest-with-powershell-to-delete-items"></a>**30.5** — Using REST with PowerShell to Delete items .....................................................................................

---
<a id="bab-31-query-sql-powershell"></a>
## Bab 31: Query SQL PowerShell

**Inti:** Menjalankan query SQL dari PowerShell.

**Topik penting:**
- <a id="bagian-311-sqlexample"></a>**31.1** — SQLExample ............................................................................................................................................
- <a id="bagian-312-sqlquery"></a>**31.2** — SQLQuery ...............................................................................................................................................

---
<a id="bab-32-regular-expression"></a>
## Bab 32: Regular Expression

**Inti:** Regex untuk match, replace, escape karakter khusus, dan multiple matches.

**Topik penting:**
- <a id="bagian-321-single-match"></a>**32.1** — Single match ..........................................................................................................................................
- <a id="bagian-322-replace"></a>**32.2** — Replace ..................................................................................................................................................
- <a id="bagian-323-replace-text-with-dynamic-value-using-a-matchevalutor"></a>**32.3** — Replace text with dynamic value using a MatchEvalutor ................................................................
- <a id="bagian-324-escape-special-characters"></a>**32.4** — Escape special characters ...................................................................................................................
- <a id="bagian-325-multiple-matches"></a>**32.5** — Multiple matches ...................................................................................................................................

---
<a id="bab-33-alias"></a>
## Bab 33: Alias

**Inti:** Membaca dan membuat alias cmdlet.

**Topik penting:**
- <a id="bagian-331-get-alias"></a>**33.1** — Get-Alias .................................................................................................................................................
- <a id="bagian-332-set-alias"></a>**33.2** — Set-Alias .................................................................................................................................................

**Cmdlet/konsep cepat:** `Get-Alias`, `Set-Alias`

---
<a id="bab-34-progress-bar"></a>
## Bab 34: Progress Bar

**Inti:** Menampilkan progress proses dengan Write-Progress.

**Topik penting:**
- <a id="bagian-341-simple-use-of-progress-bar"></a>**34.1** — Simple use of progress bar ..................................................................................................................
- <a id="bagian-342-usage-of-inner-progress-bar"></a>**34.2** — Usage of inner progress bar ...............................................................................................................

---
<a id="bab-35-command-line-powershellexe"></a>
## Bab 35: Command-Line PowerShell.exe

**Inti:** Opsi command-line PowerShell.exe untuk menjalankan command, script, policy, profile, dan window style.

**Topik penting:**
- <a id="bagian-351-executing-a-command-100"></a>**35.1** — Executing a command 100 ........................................................................................................................
- <a id="bagian-352-executing-a-script-fle-101"></a>**35.2** — Executing a script fle 101 .........................................................................................................................

---
<a id="bab-36-penamaan-cmdlet"></a>
## Bab 36: Penamaan Cmdlet

**Inti:** Standar penamaan cmdlet Verb-Noun.

**Topik penting:**
- <a id="bagian-361-verbs-102"></a>**36.1** — Verbs 102 .....................................................................................................................................................
- <a id="bagian-362-nouns-102"></a>**36.2** — Nouns 102 ...................................................................................................................................................

---
<a id="bab-37-menjalankan-executable"></a>
## Bab 37: Menjalankan Executable

**Inti:** Menjalankan aplikasi GUI/console dan membaca exit code.

**Topik penting:**
- <a id="bagian-371-gui-applications-103"></a>**37.1** — GUI Applications 103 ..................................................................................................................................
- <a id="bagian-372-console-streams-103"></a>**37.2** — Console Streams 103 .................................................................................................................................
- <a id="bagian-373-exit-codes-103"></a>**37.3** — Exit Codes 103 ............................................................................................................................................

---
<a id="bab-38-prasyarat-script"></a>
## Bab 38: Prasyarat Script

**Inti:** Menetapkan prasyarat script seperti versi minimum dan administrator.

**Topik penting:**
- <a id="bagian-381-enforce-minimum-version-of-powershell-host-104"></a>**38.1** — Enforce minimum version of PowerShell host 104 ..................................................................................
- <a id="bagian-382-enforce-running-the-script-as-administrator"></a>**38.2** — Enforce running the script as administrator ....................................................................................

---
<a id="bab-39-sistem-bantuan"></a>
## Bab 39: Sistem Bantuan

**Inti:** Memakai Get-Help, update help, contoh, full help, online help, dan parameter-specific help.

**Topik penting:**
- <a id="bagian-391-updating-the-help-system"></a>**39.1** — Updating the Help System .................................................................................................................
- <a id="bagian-392-using-get-help"></a>**39.2** — Using Get-Help ....................................................................................................................................
- <a id="bagian-393-viewing-online-version-of-a-help-topic"></a>**39.3** — Viewing online version of a help topic ..............................................................................................
- <a id="bagian-394-viewing-examples"></a>**39.4** — Viewing Examples ...............................................................................................................................
- <a id="bagian-395-viewing-the-full-help-page"></a>**39.5** — Viewing the Full Help Page ................................................................................................................
- <a id="bagian-396-viewing-help-for-a-specifc-parameter"></a>**39.6** — Viewing help for a specifc parameter .............................................................................................

**Cmdlet/konsep cepat:** `Get-Help`

---
<a id="bab-40-modul-script-dan-fungsi"></a>
## Bab 40: Modul, Script, dan Fungsi

**Inti:** Perbedaan function, script, module, dan advanced function.

**Topik penting:**
- <a id="bagian-401-function"></a>**40.1** — Function ...............................................................................................................................................
- <a id="bagian-402-script"></a>**40.2** — Script ....................................................................................................................................................
- <a id="bagian-403-module"></a>**40.3** — Module .................................................................................................................................................
- <a id="bagian-404-advanced-functions"></a>**40.4** — Advanced Functions ..........................................................................................................................

---
<a id="bab-41-konvensi-penamaan"></a>
## Bab 41: Konvensi Penamaan

**Inti:** Konvensi penamaan fungsi agar konsisten dan mudah dipahami.

**Topik penting:**
- <a id="bagian-411-functions"></a>**41.1** — Functions ...............................................................................................................................................

---
<a id="bab-42-parameter-umum"></a>
## Bab 42: Parameter Umum

**Inti:** Parameter umum seperti ErrorAction untuk mengontrol error.

**Topik penting:**
- <a id="bagian-421-erroraction-parameter"></a>**42.1** — ErrorAction parameter .......................................................................................................................

---
<a id="bab-43-parameter-set"></a>
## Bab 43: Parameter Set

**Inti:** Parameter set untuk membatasi kombinasi parameter dan memaksa pilihan valid.

**Topik penting:**
- <a id="bagian-431-parameter-set-to-enforce-the-use-of-a-parameter-when-a-other-is-selected"></a>**43.1** — Parameter set to enforce the use of a parameter when a other is selected ...............................
- <a id="bagian-432-parameter-set-to-limit-the-combination-of-parameters"></a>**43.2** — Parameter set to limit the combination of parameters .................................................................

---
<a id="bab-44-parameter-dinamis"></a>
## Bab 44: Parameter Dinamis

**Inti:** Dynamic parameter untuk menambahkan parameter saat runtime.

**Topik penting:**
- <a id="bagian-441-simpledynamic-parameter"></a>**44.1** — "Simple"dynamic parameter ............................................................................................................

---
<a id="bab-45-gui-di-powershell"></a>
## Bab 45: GUI di PowerShell

**Inti:** Pembuatan GUI WPF sederhana dari PowerShell.

**Topik penting:**
- <a id="bagian-451-wpf-gui-for-get-service-cmdlet"></a>**45.1** — WPF GUI for Get-Service cmdlet .......................................................................................................

**Cmdlet/konsep cepat:** `Get-Service`

---
<a id="bab-46-url-encodedecode"></a>
## Bab 46: URL Encode/Decode

**Inti:** Encode dan decode URL memakai HttpUtility atau URI class.

**Topik penting:**
- <a id="bagian-461-encode-query-string-withsystemwebhttputilityurlencode"></a>**46.1** — Encode Query String with`[System.Web.HttpUtility]::UrlEncode()` ...............................................
- <a id="bagian-462-quick-start-encoding"></a>**46.2** — Quick Start: Encoding .........................................................................................................................
- <a id="bagian-463-quick-start-decoding"></a>**46.3** — Quick Start: Decoding ........................................................................................................................
- <a id="bagian-464-encode-query-string-withuriescapedatastring"></a>**46.4** — Encode Query String with`[uri]::EscapeDataString()` ....................................................................
- <a id="bagian-465-decode-url-withuriunescapedatastring"></a>**46.5** — Decode URL with`[uri]::UnescapeDataString()` ..............................................................................
- <a id="bagian-466-decode-url-withsystemwebhttputilityurldecode"></a>**46.6** — Decode URL with`[System.Web.HttpUtility]::UrlDecode()` ............................................................

---
<a id="bab-47-penanganan-error"></a>
## Bab 47: Penanganan Error

**Inti:** Jenis error dan dasar penanganan error.

**Topik penting:**
- <a id="bagian-471-error-types"></a>**47.1** — Error Types ..........................................................................................................................................

---
<a id="bab-48-manajemen-paket"></a>
## Bab 48: Manajemen Paket

**Inti:** Mencari, menginstall, update, dan uninstall modul PowerShell.

**Topik penting:**
- <a id="bagian-481-create-the-default-powershell-module-repository"></a>**48.1** — Create the default PowerShell Module Repository ..........................................................................
- <a id="bagian-482-find-a-module-by-name"></a>**48.2** — Find a module by name ....................................................................................................................
- <a id="bagian-483-install-a-module-by-name"></a>**48.3** — Install a Module by name ..................................................................................................................
- <a id="bagian-484-uninstall-a-module-my-name-and-version"></a>**48.4** — Uninstall a module my name and version .......................................................................................
- <a id="bagian-485-update-a-module-by-name"></a>**48.5** — Update a module by name ...............................................................................................................
- <a id="bagian-486-find-a-powershell-module-using-a-pattern"></a>**48.6** — Find a PowerShell module using a pattern ......................................................................................

---
<a id="bab-49-komunikasi-tcp"></a>
## Bab 49: Komunikasi TCP

**Inti:** Komunikasi TCP listener/sender menggunakan PowerShell.

**Topik penting:**
- <a id="bagian-491-tcp-listener"></a>**49.1** — TCP listener ..........................................................................................................................................
- <a id="bagian-492-tcp-sender"></a>**49.2** — TCP Sender .........................................................................................................................................

---
<a id="bab-50-workflow-powershell"></a>
## Bab 50: Workflow PowerShell

**Inti:** Workflow PowerShell untuk proses background, paralel, dan input parameter.

**Topik penting:**
- <a id="bagian-501-workfow-with-input-parameters"></a>**50.1** — Workfow with Input Parameters .......................................................................................................
- <a id="bagian-502-simple-workfow-example"></a>**50.2** — Simple Workfow Example ................................................................................................................
- <a id="bagian-503-run-workfow-as-a-background-job"></a>**50.3** — Run Workfow as a Background Job ...............................................................................................
- <a id="bagian-504-add-a-parallel-block-to-a-workfow"></a>**50.4** — Add a Parallel Block to a Workfow .................................................................................................

---
<a id="bab-51-managed-code-c-vb"></a>
## Bab 51: Managed Code C# / VB

**Inti:** Menyematkan kode C# atau VB.NET dengan Add-Type.

**Topik penting:**
- <a id="bagian-511-c-example"></a>**51.1** — C# Example ...........................................................................................................................................
- <a id="bagian-512-vbnet-example"></a>**51.2** — VB.NET Example ..................................................................................................................................

---
<a id="bab-52-download-artifact-dari-artifactory"></a>
## Bab 52: Download Artifact dari Artifactory

**Inti:** Contoh script untuk mengambil artifact terbaru dari Artifactory.

**Topik penting:**
- <a id="bagian-521-powershell-script-for-downloading-the-latest-artifact"></a>**52.1** — PowerShell Script for downloading the latest artifact ....................................................................

---
<a id="bab-53-comment-based-help"></a>
## Bab 53: Comment-Based Help

**Inti:** Help berbasis komentar agar fungsi/script dapat dibaca oleh Get-Help.

**Topik penting:**
- <a id="bagian-531-function-comment-based-help"></a>**53.1** — Function comment-based help ..........................................................................................................
- <a id="bagian-532-script-comment-based-help"></a>**53.2** — Script comment-based help ..............................................................................................................

---
<a id="bab-54-modul-archive"></a>
## Bab 54: Modul Archive

**Inti:** Compress-Archive dan Expand-Archive untuk ZIP.

**Topik penting:**
- <a id="bagian-541-compress-archive-with-wildcard"></a>**54.1** — Compress-Archive with wildcard .......................................................................................................
- <a id="bagian-542-update-existing-zip-with-compress-archive"></a>**54.2** — Update existing ZIP with Compress-Archive ...................................................................................
- <a id="bagian-543-extract-a-zip-with-expand-archive"></a>**54.3** — Extract a Zip with Expand-Archive ....................................................................................................

**Cmdlet/konsep cepat:** `Compress-Archive`, `Expand-Archive`

---
<a id="bab-55-otomasi-infrastruktur"></a>
## Bab 55: Otomasi Infrastruktur

**Inti:** Otomasi infrastruktur dan contoh test integrasi black-box.

**Topik penting:**
- <a id="bagian-551-simple-script-for-black-box-integration-test-of-console-applications"></a>**55.1** — Simple script for black-box integration test of console applications ............................................

---
<a id="bab-56-psscriptanalyzer"></a>
## Bab 56: PSScriptAnalyzer

**Inti:** PSScriptAnalyzer untuk static analysis script PowerShell.

**Topik penting:**
- <a id="bagian-561-analyzing-scripts-with-the-built-in-preset-rulesets"></a>**56.1** — Analyzing scripts with the built-in preset rulesets ...........................................................................
- <a id="bagian-562-analyzing-scripts-against-every-built-in-rule"></a>**56.2** — Analyzing scripts against every built-in rule ...................................................................................
- <a id="bagian-563-list-all-built-in-rules"></a>**56.3** — List all built-in rules .............................................................................................................................

---
<a id="bab-57-desired-state-configuration-dsc"></a>
## Bab 57: Desired State Configuration DSC

**Inti:** DSC untuk mendefinisikan konfigurasi target dan resource.

**Topik penting:**
- <a id="bagian-571-simple-example-enabling-windowsfeature"></a>**57.1** — Simple example-Enabling WindowsFeature ...................................................................................
- <a id="bagian-572-starting-dsc-mof-on-remote-machine"></a>**57.2** — Starting DSC (mof) on remote machine ..........................................................................................
- <a id="bagian-573-importing-psd1-data-fle-into-local-variable"></a>**57.3** — Importing psd1 (data fle) into local variable ...................................................................................
- <a id="bagian-574-list-available-dsc-resources"></a>**57.4** — List available DSC Resources ............................................................................................................
- <a id="bagian-575-importing-resources-for-use-in-dsc"></a>**57.5** — Importing resources for use in DSC ..................................................................................................

---
<a id="bab-58-shouldprocess"></a>
## Bab 58: ShouldProcess

**Inti:** ShouldProcess untuk dukungan -WhatIf dan -Confirm.

**Topik penting:**
- <a id="bagian-581-full-usage-example"></a>**58.1** — Full Usage Example ............................................................................................................................
- <a id="bagian-582-adding-whatif-and-confrm-support-to-your-cmdlet"></a>**58.2** — Adding-WhatIf and-Confrm support to your cmdlet ..................................................................
- <a id="bagian-583-using-shouldprocess-with-one-argument"></a>**58.3** — Using ShouldProcess() with one argument .....................................................................................

---
<a id="bab-59-scheduled-tasks"></a>
## Bab 59: Scheduled Tasks

**Inti:** Scheduled Tasks untuk menjalankan script PowerShell secara terjadwal.

**Topik penting:**
- <a id="bagian-591-run-powershell-script-in-scheduled-task"></a>**59.1** — Run PowerShell Script in Scheduled Task .........................................................................................

---
<a id="bab-60-modul-ise"></a>
## Bab 60: Modul ISE

**Inti:** PowerShell ISE dan fitur scripting/debugging.

**Topik penting:**
- <a id="bagian-601-test-scripts"></a>**60.1** — Test Scripts ..........................................................................................................................................

---
<a id="bab-61-resource-dsc-berbasis-class"></a>
## Bab 61: Resource DSC Berbasis Class

**Inti:** Membuat DSC resource berbasis class.

**Topik penting:**
- <a id="bagian-611-create-a-dsc-resource-skeleton-class"></a>**61.1** — Create a DSC Resource Skeleton Class .............................................................................................
- <a id="bagian-612-dsc-resource-skeleton-with-key-property"></a>**61.2** — DSC Resource Skeleton with Key Property ......................................................................................
- <a id="bagian-613-dsc-resource-with-mandatory-property"></a>**61.3** — DSC Resource with Mandatory Property ..........................................................................................
- <a id="bagian-614-dsc-resource-with-required-methods"></a>**61.4** — DSC Resource with Required Methods .............................................................................................

---
<a id="bab-62-wmi-dan-cim"></a>
## Bab 62: WMI dan CIM

**Inti:** Query WMI/CIM, namespace, class, dan instance.

**Topik penting:**
- <a id="bagian-621-querying-objects"></a>**62.1** — Querying objects .................................................................................................................................
- <a id="bagian-622-classes-and-namespaces"></a>**62.2** — Classes and namespaces ..................................................................................................................

---
<a id="bab-63-modul-activedirectory"></a>
## Bab 63: Modul ActiveDirectory

**Inti:** Cmdlet ActiveDirectory untuk user, group, computer, dan object AD.

**Topik penting:**
- <a id="bagian-631-users"></a>**63.1** — Users .....................................................................................................................................................
- <a id="bagian-632-module"></a>**63.2** — Module .................................................................................................................................................
- <a id="bagian-633-groups"></a>**63.3** — Groups ..................................................................................................................................................
- <a id="bagian-634-computers"></a>**63.4** — Computers ...........................................................................................................................................
- <a id="bagian-635-objects"></a>**63.5** — Objects .................................................................................................................................................

---
<a id="bab-64-modul-sharepoint"></a>
## Bab 64: Modul SharePoint

**Inti:** Modul SharePoint untuk snap-in, list, dan feature site collection.

**Topik penting:**
- <a id="bagian-641-loading-sharepoint-snap-in"></a>**64.1** — Loading SharePoint Snap-In ..............................................................................................................
- <a id="bagian-642-iterating-over-all-lists-of-a-site-collection"></a>**64.2** — Iterating over all lists of a site collection .........................................................................................
- <a id="bagian-643-get-all-installed-features-on-a-site-collection"></a>**64.3** — Get all installed features on a site collection ...................................................................................

---
<a id="bab-65-psake"></a>
## Bab 65: Psake

**Inti:** Psake untuk build/task automation.

**Topik penting:**
- <a id="bagian-651-basic-outline"></a>**65.1** — Basic outline .........................................................................................................................................
- <a id="bagian-652-formattaskname-example"></a>**65.2** — FormatTaskName example ..............................................................................................................
- <a id="bagian-653-run-task-conditionally"></a>**65.3** — Run Task conditionally .......................................................................................................................
- <a id="bagian-654-continueonerror"></a>**65.4** — ContinueOnError .................................................................................................................................

---
<a id="bab-66-pester"></a>
## Bab 66: Pester

**Inti:** Pester untuk unit testing PowerShell.

**Topik penting:**
- <a id="bagian-661-getting-started-with-pester"></a>**66.1** — Getting Started with Pester ................................................................................................................

---
<a id="bab-67-secret-dan-credential"></a>
## Bab 67: Secret dan Credential

**Inti:** Menangani credential dan secret dengan SecureString/Export-CliXml.

**Topik penting:**
- <a id="bagian-671-accessing-the-plaintext-password"></a>**67.1** — Accessing the Plaintext Password .....................................................................................................
- <a id="bagian-672-prompting-for-credentials"></a>**67.2** — Prompting for Credentials .................................................................................................................
- <a id="bagian-673-working-with-stored-credentials"></a>**67.3** — Working with Stored Credentials ......................................................................................................
- <a id="bagian-674-storing-the-credentials-in-encrypted-form-and-passing-it-as-parameter-when-required"></a>**67.4** — Storing the credentials in Encrypted form and Passing it as parameter when Required

---
<a id="bab-68-security-dan-cryptography"></a>
## Bab 68: Security dan Cryptography

**Inti:** Hashing dan kriptografi via .NET.

**Topik penting:**
- <a id="bagian-681-calculating-a-strings-hash-codes-via-net-cryptography"></a>**68.1** — Calculating a string's hash codes via .Net Cryptography ...............................................................

---
<a id="bab-69-signing-scripts"></a>
## Bab 69: Signing Scripts

**Inti:** Menandatangani script dan mengatur execution policy.

**Topik penting:**
- <a id="bagian-691-signing-a-script"></a>**69.1** — Signing a script ....................................................................................................................................
- <a id="bagian-692-bypassing-execution-policy-for-a-single-script"></a>**69.2** — Bypassing execution policy for a single script ................................................................................
- <a id="bagian-693-changing-the-execution-policy-using-set-executionpolicy"></a>**69.3** — Changing the execution policy using Set-ExecutionPolicy .............................................................
- <a id="bagian-694-get-the-current-execution-policy"></a>**69.4** — Get the current execution policy .......................................................................................................
- <a id="bagian-695-getting-the-signature-from-a-signed-script"></a>**69.5** — Getting the signature from a signed script ......................................................................................
- <a id="bagian-696-creating-a-self-signed-code-signing-certifcate-for-testing"></a>**69.6** — Creating a self-signed code signing certifcate for testing ............................................................

**Cmdlet/konsep cepat:** `Set-ExecutionPolicy`

---
<a id="bab-70-anonimisasi-ip"></a>
## Bab 70: Anonimisasi IP

**Inti:** Anonimisasi IPv4/IPv6 dalam file teks dengan regex.

**Topik penting:**
- <a id="bagian-701-anonymize-ip-address-in-text-fle"></a>**70.1** — Anonymize IP address in text fle .......................................................................................................

---
<a id="bab-71-aws-rekognition"></a>
## Bab 71: AWS Rekognition

**Inti:** Contoh AWS Rekognition dari PowerShell.

**Topik penting:**
- <a id="bagian-711-detect-image-labels-with-aws-rekognition"></a>**71.1** — Detect Image Labels with AWS Rekognition .....................................................................................
- <a id="bagian-712-compare-facial-similarity-with-aws-rekognition"></a>**71.2** — Compare Facial Similarity with AWS Rekognition ...........................................................................

---
<a id="bab-72-aws-s3"></a>
## Bab 72: AWS S3

**Inti:** Operasi dasar AWS S3: bucket, upload, dan delete.

**Topik penting:**
- <a id="bagian-721-create-a-new-s3-bucket"></a>**72.1** — Create a new S3 Bucket ......................................................................................................................
- <a id="bagian-722-upload-a-local-file-into-an-s3-bucket"></a>**72.2** — Upload a Local File Into an S3 Bucket .............................................................................................
- <a id="bagian-723-delete-a-s3-bucket"></a>**72.3** — Delete a S3 Bucket .............................................................................................................................

---
