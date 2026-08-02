---
title: "Architecture Decisions, Risk Analysis, dan Diagramming: Dokumentasi untuk Architect"
description: "Panduan lengkap ADR, risk analysis, dan diagramming dari Fundamentals of Software Architecture - Architecture Decision Records, risk assessment, C4 model, dan teknik presentasi."
pubDate: 2026-11-02T08:00:00.000Z
image: /image/fundamentals-06-adr.svg
draft: false
categories:
  - Teknologi
tags:
  - Architecture
  - SoftwareDesign
  - Fundamentals
  - ADR
  - RiskAnalysis
series: "Software Architecture Fundamentals"
seriesOrder: 6
---

*Fundamentals of Software Architecture* Chapter 19-21 membahas **dokumentasi arsitektur**: bagaimana mendokumentasikan keputusan (ADR), menganalisis risiko, dan membuat diagram yang efektif. Dokumentasi yang baik adalah aset berharga untuk tim dan future architects.

Artikel ini mencakup Architecture Decision Records, risk storming, C4 model, dan teknik presentasi.

## Daftar Isi

- [Architecture Decision Records (ADR)](#architecture-decision-records-adr)
- [Struktur ADR](#struktur-adr)
- [Contoh ADR](#contoh-adr)
- [Risk Analysis](#risk-analysis)
- [Risk Storming](#risk-storming)
- [Diagramming dan Presentasi](#diagramming-dan-presentasi)
- [C4 Model](#c4-model)
- [Presenting Architecture](#presenting-architecture)
- [Kesimpulan](#kesimpulan)
- [FAQ](#faq)
- [Referensi](#referensi)

## Architecture Decision Records (ADR)

**ADR** adalah dokumen yang merekam keputusan arsitektur yang penting: konteks, alternatif, keputusan, dan konsekuensi.

![Architecture Decision Records](/image/fundamentals-06-adr.svg)

### Mengapa ADR?

| Masalah | Solusi ADR |
|---------|-----------|
| "Kenapa kita pakai PostgreSQL?" | Tertulis di ADR-001 |
| "Siapa yang memutuskan ini?" | ADR mencatat decision maker |
| "Apa alternatif yang dipertimbangkan?" | ADR mencatat semua opsi |
| "Apa konsekuensinya?" | ADR mencatat trade-offs |

## Struktur ADR

Buku ini merekomendasikan struktur ADR:

```markdown
# ADR-NNNN: [Judul Keputusan]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Context
[Apa masalahnya? Apa forces yang mempengaruhi?]

## Decision
[Apa yang kita putuskan?]

## Consequences
### Positive
- [Keuntungan 1]
- [Keuntungan 2]

### Negative
- [Kerugian 1]
- [Kerugian 2]

### Neutral
- [Hal yang perlu diperhatikan]

## Alternatives Considered
- [Alternatif 1]: [Alasan ditolak]
- [Alternatif 2]: [Alasan ditolak]
```

### Status Lifecycle

| Status | Arti | Kapan |
|--------|------|-------|
| **Proposed** | Sedang dipertimbangkan | Draft, belum disetujui |
| **Accepted** | Aktif digunakan | Keputusan final |
| **Deprecated** | Tidak direkomendasikan | Ada pengganti lebih baik |
| **Superseded** | Digantikan ADR lain | Keputusan berubah |

## Contoh ADR

```markdown
# ADR-0003: Gunakan PostgreSQL untuk Order Service

## Status
Accepted

## Context
Order Service membutuhkan database yang mendukung:
- Transaksi kompleks (multi-step order processing)
- Reporting yang rich (SQL queries)
- ACID compliance untuk financial data
- Tim familiar dengan relational model

Alternatif: MongoDB (document), Cassandra (wide-column), PostgreSQL (relational)

## Decision
Kita memilih **PostgreSQL** sebagai database untuk Order Service.

## Consequences
### Positive
- ACID compliance untuk financial transactions
- Rich SQL untuk reporting dan analytics
- Tim familiar, tidak perlu training
- Mature ecosystem (ORM, migration tools)

### Negative
- Scaling horizontal lebih sulit dari Cassandra
- Schema changes memerlukan migration

### Neutral
- Perlu setup read replicas untuk reporting
- Monitoring query performance penting

## Alternatives Considered
- **MongoDB**: Schema-less tidak cocok untuk financial data
- **Cassandra**: Eventual consistency tidak cocok untuk ACID requirements
```

### ADR Best Practices

| Praktik | Deskripsi |
|---------|-----------|
| **One ADR per decision** | Satu keputusan = satu dokumen |
| **Immutable** | Jangan edit ADR yang accepted, buat ADR baru |
| **Version controlled** | Simpan di repo bersama code |
| **Numbered** | ADR-0001, ADR-0002, ... |
| **Linked** | ADR yang supersede harus link ke yang lama |

## Risk Analysis

**Risk analysis** adalah proses mengidentifikasi, menilai, dan mitigasi risiko arsitektur.

### Risk Assessment Matrix

| Likelihood | Impact | Risk Level |
|-----------|--------|-----------|
| Low | Low | **Low** |
| Low | High | **Medium** |
| High | Low | **Medium** |
| High | High | **High** |

### Risk Categories

| Kategori | Contoh Risiko |
|----------|-------------|
| **Technical** | Framework tidak mature, performance bottleneck |
| **Team** | Skill gap, key person dependency |
| **Schedule** | Estimasi terlalu optimis, scope creep |
| **External** | Third-party API changes, vendor lock-in |

## Risk Storming

**Risk storming** adalah workshop kolaboratif untuk mengidentifikasi risiko.

### Process

```
1. Architect presents architecture
2. Team brainstorms risks
3. Categorize risks
4. Assess likelihood and impact
5. Prioritize top risks
6. Define mitigation strategies
7. Assign owners
```

### Contoh Risk Storming Output

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|-----------|-------|
| Database performance | Medium | High | Read replicas, caching | DBA |
| Third-party API failure | Low | High | Circuit breaker, fallback | Backend |
| Team skill gap | High | Medium | Training, pair programming | Tech lead |
| Scope creep | High | Medium | ADR, change control | PM |

## Diagramming dan Presentasi

Chapter 21 membahas teknik membuat diagram arsitektur yang efektif.

### Diagram Types

| Type | Purpose | Audience |
|------|---------|----------|
| **Context** | System boundary, external actors | Stakeholders |
| **Container** | Applications, databases, services | Technical leads |
| **Component** | Internal structure of container | Developers |
| **Deployment** | Infrastructure, servers, networks | DevOps |

## C4 Model

**C4 model** (Simon Brown) adalah pendekatan standard untuk diagram arsitektur:

![C4 Model](/image/fundamentals-06-c4.svg)

### Level 1: System Context

```
┌─────────────────────────────────────┐
│         System Context              │
│                                     │
│    [User] ──→ [Our System] ←── [External API] │
│                                     │
└─────────────────────────────────────┘
```

### Level 2: Container

```
┌─────────────────────────────────────┐
│           Container                 │
│                                     │
│  [Web App] ──→ [API Service] ──→ [Database] │
│                      ↑              │
│                 [Message Queue]     │
│                                     │
└─────────────────────────────────────┘
```

### Level 3: Component

```
┌─────────────────────────────────────┐
│           Component                 │
│                                     │
│  [OrderController] ──→ [OrderService] │
│                            ↑        │
│                     [OrderRepository] │
│                            ↑        │
│                       [OrderDB]     │
│                                     │
└─────────────────────────────────────┘
```

### Level 4: Code (Optional)

Class diagrams, sequence diagrams untuk detail implementasi.

## Presenting Architecture

### Tips Presentasi

| Tip | Deskripsi |
|-----|-----------|
| **Know your audience** | Technical vs business, adjust depth |
| **Tell a story** | Problem → Solution → Trade-offs |
| **Use visuals** | Diagrams, not walls of text |
| **Be honest about trade-offs** | No perfect solution |
| **Invite feedback** | Architecture is collaborative |

### Common Mistakes

| Mistake | Akibat |
|---------|--------|
| Too much detail | Audience lost |
| Too abstract | Not actionable |
| No trade-offs | Unrealistic |
| No context | "Why this decision?" |

## Kesimpulan

Chapter 19-21 buku ini membahas:

1. **ADR**: Dokumentasi keputusan dengan konteks, alternatif, konsekuensi
2. **Risk analysis**: Identifikasi, assess, mitigasi risiko
3. **Risk storming**: Workshop kolaboratif untuk risk identification
4. **Diagramming**: C4 model untuk context, container, component, code
5. **Presenting**: Know audience, tell story, be honest

Artikel berikutnya: **Teams, Negotiation, dan Career Path** , soft skills untuk architect.

## FAQ

### Apa itu ADR dan mengapa penting?

ADR (Architecture Decision Record) adalah dokumen yang merekam keputusan arsitektur: konteks, alternatif, keputusan, dan konsekuensi. Penting untuk knowledge transfer, audit trail, dan menghindari "kenapa kita pakai ini?"

### Bagaimana struktur ADR yang baik?

Struktur: Status (proposed/accepted/deprecated), Context (masalah dan forces), Decision (apa yang diputuskan), Consequences (positive, negative, neutral), Alternatives Considered. Simpan di version control bersama code.

### Apa itu risk storming?

Risk storming adalah workshop kolaboratif di mana architect present architecture, tim brainstorm risks, kategorikan, assess likelihood/impact, prioritize, dan define mitigation. Output: risk register dengan owner.

### Apa itu C4 model?

C4 model adalah pendekatan standard untuk diagram arsitektur dengan 4 level: System Context (system boundary), Container (applications, databases), Component (internal structure), Code (class diagrams). Cocok untuk dokumentasi arsitektur.

## Referensi

- Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly Media. Chapter 19-21.
- Brown, S. (2020). *The C4 Model for Visualising Software Architecture*. Leanpub.
- Nygard, M. (2011). *Documenting Architecture Decisions*. cognitect.com.
