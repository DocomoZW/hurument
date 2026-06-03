# GRC-Nexus eGovernance Platform
## Product Requirements Document (PRD)

---

**Document Reference:** GRC-NEXUS/PRD/2026/001  
**Version:** 1.0  
**Status:** Draft  
**Date:** May 2026  
**Classification:** Internal — Technical  
**Document Owner:** Product / Engineering Team

---

## Table of Contents

1. [Document Purpose and Scope](#1-document-purpose-and-scope)
2. [Product Vision and Strategic Context](#2-product-vision-and-strategic-context)
3. [Target Users and Personas](#3-target-users-and-personas)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Module 1 — Strategic Planning & NDS2 Alignment](#5-module-1--strategic-planning--nds2-alignment)
6. [Module 2 — Enterprise Risk Management (ERM)](#6-module-2--enterprise-risk-management-erm)
7. [Module 3 — Board Management & Corporate Governance](#7-module-3--board-management--corporate-governance)
8. [Module 4 — Compliance Management](#8-module-4--compliance-management)
9. [Module 5 — Policy Management](#9-module-5--policy-management)
10. [Module 6 — Incident & Issue Management](#10-module-6--incident--issue-management)
11. [Module 7 — Internal Audit Support](#11-module-7--internal-audit-support)
12. [Module 8 — Third-Party / Vendor Risk Management](#12-module-8--third-party--vendor-risk-management)
13. [Module 9 — Reporting & Analytics](#13-module-9--reporting--analytics)
14. [Module 10 — AI & Predictive Analytics Engine](#14-module-10--ai--predictive-analytics-engine)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Security Requirements](#16-security-requirements)
17. [Integration Requirements](#17-integration-requirements)
18. [User Management and Access Control](#18-user-management-and-access-control)
19. [Data Model and Storage](#19-data-model-and-storage)
20. [Deployment and Infrastructure](#20-deployment-and-infrastructure)
21. [Implementation Phases and Milestones](#21-implementation-phases-and-milestones)
22. [Acceptance Criteria](#22-acceptance-criteria)
23. [Assumptions and Constraints](#23-assumptions-and-constraints)
24. [Glossary](#24-glossary)

---

## 1. Document Purpose and Scope

### 1.1 Purpose

This Product Requirements Document defines the complete functional, technical, security, and integration requirements for the **GRC-Nexus eGovernance Platform** — a cloud-based or on-premises governance, risk, and compliance platform designed for Zimbabwean Ministries, Departments, Agencies (MDAs), and State-Owned Enterprises (SOEs).

This document serves as the primary reference for:

- Engineering and product teams building the platform
- ICT teams at client institutions responsible for infrastructure, integration, and security
- Quality assurance and testing teams
- Business analysts conducting requirements verification
- Client stakeholders validating scope against organisational need

### 1.2 Scope

This PRD covers the end-to-end requirements for:

- A multi-tenant, role-based web application (with optional on-premises deployment) serving institutions across the Zimbabwean public sector
- All functional modules: Strategic Planning, ERM, Board Management, Compliance, Policy, Incident Management, Internal Audit, Vendor Risk, Reporting, and AI Analytics
- Integration with enterprise systems including SAP ERP, Microsoft 365, Active Directory, ZINARA, and ZERA infrastructure environments
- Mobile application (iOS and Android) for Board Management and offline document access
- Security architecture meeting public-sector and international standards
- Deployment, migration, and handover specifications

### 1.3 Intended Audience

| Audience | Usage |
|----------|-------|
| Backend Engineers | API design, database schema, business logic, workflow engine |
| Frontend Engineers | UI/UX implementation, dashboard components, form builders |
| DevOps / Infrastructure | Deployment specs, containerisation, CI/CD pipelines |
| ML Engineers | AI model requirements, feature engineering, prediction pipelines |
| Integration Engineers | SAP, Active Directory, Microsoft 365 connector design |
| QA Engineers | Test case derivation, acceptance criteria mapping |
| Client ICT Teams | Infrastructure preparation, security review, system administration |
| Client Governance Officers | Feature validation, compliance alignment |

---

## 2. Product Vision and Strategic Context

### 2.1 Product Vision

> The GRC-Nexus Platform is the single source of truth for strategic execution, risk oversight, and corporate governance in the Zimbabwean public sector — ensuring that every institutional action is rooted in the **National Development Strategy 2 (NDS2)** and complies with the **Public Entities Corporate Governance Act [Chapter 10:31] (PECOGA)**.

### 2.2 The Governance Waterfall

The platform operates on a cascading logic that ensures vertical alignment from national policy to individual accountability:

```
NDS2 National Priority Areas
        ↓
Sector Key Result Areas (SKRAs)
        ↓
Institutional 5-Year Strategic Plan
        ↓
Annual Performance Plans (KPIs, Action Targets)
        ↓
Risk Registers (Threats to Strategic Objectives)
        ↓
Individual Performance Contracts (PECOGA Section 23)
        ↓
Compliance Tracking, Board Oversight, and Audit Assurance
```

No institutional activity exists in isolation — every risk, action plan, and board decision traces upward to a national development objective.

### 2.3 Problem Statement

Public-sector institutions in Zimbabwe operate with:

- Risk registers maintained in disconnected Microsoft Excel spreadsheets
- Board meeting packs distributed via insecure email channels
- Compliance tracked via manual reminders and ad hoc documents
- No real-time visibility into strategic KPI performance
- Quarterly board reports compiled manually over multiple days
- No digital audit trail for governance decisions and risk treatments
- PECOGA reporting requirements partially met due to process limitations

The GRC-Nexus platform resolves these gaps through an integrated, automated, and evidence-based governance infrastructure.

### 2.4 Regulatory Compliance Mandate

The platform is designed to automate compliance with:

| Instrument | Key Obligations |
|-----------|----------------|
| **PECOGA [Chapter 10:31] No. 4/2018** | Board oversight (Part V–VII), performance contracts (Section 23–25), board evaluations (Section 25), risk governance (Chapter 4), committee management (Section 40) |
| **Statutory Instrument 135 of 2019** | Section 50 — annual risk assessments mandatory for all public entities |
| **Public Finance Management Act (Chapter 22:19)** | Financial risk disclosure; annual audit requirements |
| **Zimbabwe National Risk Management Framework (January 2023)** | ISO 31000-based risk process; 5-band rating scales; quarterly reporting templates |
| **ISO 31000:2018** | Enterprise risk management process standard |
| **ISO 9001:2015** | Quality management system linkage for ISO-certified entities |
| **Energy Regulatory Act (Chapter 13:23)** | ZERA-specific regulatory obligations |
| **NDS2 (2026–2030)** | National development alignment for all MDA strategic plans |

---

## 3. Target Users and Personas

### 3.1 Primary Client Institutions

The platform is purpose-built for the Zimbabwean public sector. Initial target clients include:

- **ZERA (Zimbabwe Energy Regulatory Authority)** — regulatory body for energy sector; 40 users
- **ZINARA (Zimbabwe National Roads Administration)** — roads administration; board management primary use case
- Broader MDA and SOE sector (scalable, multi-tenant architecture)

### 3.2 User Roles and Personas

| Role ID | Role Name | Primary Activities | Typical Count |
|---------|-----------|-------------------|---------------|
| R01 | System Administrator | Full configuration; user management; integration oversight | 2 |
| R02 | Risk Manager / CRO | Risk framework ownership; risk register management; board reporting | 2–3 |
| R03 | Compliance Officer | Compliance tracking; policy management; regulatory monitoring | 1–2 |
| R04 | Internal Auditor / CAE | Audit universe; findings management; combined assurance | 2–4 |
| R05 | Risk Champion | Departmental risk identification; treatment updates | 8–12 |
| R06 | Board Member / Executive | Dashboard viewing; risk appetite approval; meeting packs | 5–10 |
| R07 | Board Secretary | Meeting pack creation; agenda management; resolutions tracking | 1–2 |
| R08 | CEO / Accounting Officer | Strategic execution; KPI sign-off; statutory report approval | 1–2 |
| R09 | Strategic Planning Officer | NDS2 alignment; KPI definition; cascading action plans | 1–2 |
| R10 | Standard Staff Member | Incident reporting; policy acknowledgment; assigned task updates | 10–20 |

### 3.3 Accessibility Requirements

- All screens MUST meet **WCAG 2.1 AA** accessibility standards
- UI MUST be optimised for non-technical senior executives: large text options, simplified navigation, high-contrast mode
- Platform MUST be accessible via: iOS, Android, Windows, macOS, and major web browsers (Chrome, Edge, Firefox, Safari)

---

## 4. System Architecture Overview

### 4.1 High-Level Architecture

```
+--------------------------------------------------------------------+
|                    GRC-NEXUS PLATFORM                              |
|                                                                    |
|  +------------+ +----------+ +-----------+ +---------+            |
|  | Strategic  | |   ERM    | |   Board   | |Compliance|            |
|  | Planning   | |  Module  | | Mgmt Mod. | |  Module  |            |
|  +------------+ +----------+ +-----------+ +---------+            |
|  +------------+ +----------+ +-----------+ +---------+            |
|  |  Policy    | | Incident | |  Internal | | Vendor  |            |
|  |  Module    | |  Module  | |   Audit   | |  Risk   |            |
|  +------------+ +----------+ +-----------+ +---------+            |
|                                                                    |
|  +-----------------+  +-------------------+  +----------------+   |
|  | Reporting &     |  | AI / ML Analytics |  | Workflow &     |   |
|  | BI Dashboard    |  |     Engine        |  | Notifications  |   |
|  +-----------------+  +-------------------+  +----------------+   |
|                                                                    |
|  +-----------------+  +-------------------+  +----------------+   |
|  | Identity &      |  | Integration       |  | File &         |   |
|  | Access (IAM)    |  | Layer (SAP/M365)  |  | Document Store |   |
|  +-----------------+  +-------------------+  +----------------+   |
+--------------------------------------------------------------------+
          |                        |                   |
  +-------+--------+    +----------+------+  +--------+--------+
  |  SAP ERP       |    | Microsoft 365   |  | Active Directory|
  | (Finance,      |    | (Teams, Outlook,|  | (SSO/LDAP)      |
  |  Procurement)  |    |  SharePoint)    |  +----------------+
  +----------------+    +-----------------+
```

### 4.2 Deployment Modes

The platform MUST support two deployment configurations:

| Mode | Description | Target Clients |
|------|-------------|----------------|
| **Cloud (SaaS)** | Multi-tenant hosted in a Southern Africa data centre; SOC 2 Type II; data residency in Southern Africa | MDAs with limited data centre infrastructure |
| **On-Premises** | Deployed within the client's own data centre; client controls all hardware; air-gapped option available | Entities with strict data sovereignty requirements (e.g., ZERA) |

### 4.3 Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React.js (v18+) | Mobile-responsive; no Flash dependency |
| Backend | Node.js (v20+) or Python FastAPI | RESTful API; OpenAPI 3.0 documented |
| Database | PostgreSQL 15+ or MS SQL Server 2019+ | On-premises or managed cloud |
| Cache | Redis | Session management; query cache |
| ML Engine | Python (scikit-learn, TensorFlow Lite) | On-premises; no external cloud ML API calls |
| Task Queue | Celery (Python) or Bull (Node.js) | Async report generation; ML jobs |
| Reporting BI | Apache Superset or Metabase (embedded) | On-premises capable |
| Authentication | LDAP/Active Directory + SAML 2.0 / OIDC | MFA via TOTP |
| File Storage | On-premises NFS / MinIO (cloud: S3-compatible) | AES-256 encryption at rest |
| API Documentation | OpenAPI 3.0 / Swagger | All endpoints documented |
| Container | Docker + Docker Compose / Kubernetes | For cloud deployment |
| Mobile (Board) | React Native (iOS + Android) | Board management module |

---

## 5. Module 1 — Strategic Planning & NDS2 Alignment

### 5.1 Overview

This module is the "engine room" of the platform. It turns static strategic plans into live, trackable data — directly linking institutional objectives to NDS2 national priorities.

### 5.2 NDS2 Integration

- **FR-STRAT-001:** The platform MUST maintain a read-only, centrally managed library of NDS2 National Priority Areas (NPAs), Sector Key Result Areas (SKRAs), and National Outcomes.
- **FR-STRAT-002:** Each client institution MUST link ("tag") its institutional strategic objectives to one or more NDS2 NPAs as a mandatory step before activating a strategic goal.
- **FR-STRAT-003:** The platform MUST display an NDS2 alignment coverage map: a grid showing which NPAs are covered by the institution's strategic goals, and which are unaddressed.
- **FR-STRAT-004:** The NDS2 library MUST be updatable by the platform super-admin without requiring a code deployment.

### 5.3 Institutional Strategic Plan Management

- **FR-STRAT-005:** The system MUST support a three-level cascading action plan hierarchy:
  - **Level 1:** 5-Year Strategic Goals (linked to NDS2 NPAs)
  - **Level 2:** Annual Plan Outputs (with measurable KPIs and baseline/target values)
  - **Level 3:** Departmental Action Plans (specific tasks, "Action Owners," automated timelines)
- **FR-STRAT-006:** Each strategic goal record MUST capture: Goal ID, Title, Description, NDS2 Linkage (multi-select), Sector SKRA, Strategic Objective Ownership (department), Baseline Value, Target Value, KPI Metrics (multiple), Review Cycle, Status, Approved By, Effective Period.
- **FR-STRAT-007:** Strategic goals MUST require an approval workflow (CEO / Accounting Officer sign-off) before becoming "Active."
- **FR-STRAT-008:** The system MUST prevent the creation of a risk that is not linked to at least one active strategic objective (enforcing the "uncertainty on objectives" risk philosophy).

### 5.4 KPI Tracking and Results-Based Management

- **FR-STRAT-009:** KPIs MUST support both output-based and outcome-based measurement.
- **FR-STRAT-010:** KPI progress MUST be updatable by the assigned Action Owner with supporting evidence upload.
- **FR-STRAT-011:** The system MUST automatically calculate KPI achievement percentage and apply RAG (Red/Amber/Green) status:
  - Green: ≥ 90% of target
  - Amber: 70–89% of target
  - Red: < 70% of target
- **FR-STRAT-012:** When a KPI falls to "Red" status, the system MUST trigger a **Strategic Review Alert** — automated notification to the Strategic Planning Officer, CEO, and Board — referencing the PECOGA Section 24 obligation.
- **FR-STRAT-013:** The system MUST generate a **Cascading Accountability Dashboard** showing KPI status across all departments, filterable by department, strategic objective, NDS2 NPA, and period.

### 5.5 Performance Contracts (PECOGA Section 23)

- **FR-STRAT-014:** The system MUST provide standardised digital templates for Board and CEO performance contracts as mandated by PECOGA Section 23.
- **FR-STRAT-015:** The system MUST automatically pull live KPI data from the strategic planning module to pre-populate quarterly performance reviews, eliminating manual data gathering.
- **FR-STRAT-016:** Performance contract records MUST capture: Contract Period, Parties (Board Chair / CEO), KPIs and Targets, Review Schedule, Mid-Year Review Record, Annual Evaluation Record, Sign-Off Status.
- **FR-STRAT-017:** Performance contract sign-off MUST use a legally compliant electronic signature workflow.

### 5.6 Dynamic Strategy Review (PECOGA Section 24)

- **FR-STRAT-018:** The system MUST generate a mandatory "Strategic Review Report" template when any KPI enters Red status, pre-populated with the objective name, KPI details, current value, shortfall, and proposed corrective actions.
- **FR-STRAT-019:** The Strategic Review Report MUST be routable through a defined approval workflow before being distributed.

---

## 6. Module 2 — Enterprise Risk Management (ERM)

### 6.1 Overview

Built on the **Zimbabwe National Risk Management Framework (January 2023)** and **ISO 31000:2018**, this module ensures risks are managed dynamically, linked to strategic objectives, and visible to the Board in real time.

### 6.2 Risk Register

- **FR-RISK-001:** The system MUST maintain a centralised, versioned risk register with a full, immutable audit trail.
- **FR-RISK-002:** Each risk record MUST include the following fields at minimum:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Risk ID | Auto-generated | Yes | Unique identifier (e.g., ZERA-RISK-2026-001) |
| Risk Title | Text (255 chars) | Yes | Short descriptive name |
| Risk Description | Long text | Yes | Detailed narrative including cause and consequence |
| Risk Category | Dropdown (configurable) | Yes | Strategic / Operational / Financial / Compliance / Reputational / ESG / etc. |
| Risk Type | Dropdown | Yes | Inherent / Residual / Target |
| Risk Owner | User (linked) | Yes | Responsible individual |
| Department | Lookup | Yes | Owning department |
| Strategic Objective | Lookup (multi-select) | Yes | Must be linked to at least one strategic objective |
| Likelihood Score | Integer (1–5) | Yes | Per National Risk Framework 5-band scale |
| Impact Score | Integer (1–5) | Yes | Per National Risk Framework 5-band scale |
| Risk Rating | Computed | Yes | Likelihood × Impact |
| Risk Band | Computed | Yes | Very High / High / Medium / Low / Very Low |
| Risk Appetite Status | Computed | Yes | Within / Outside appetite |
| Treatment Strategy | Dropdown | Yes | Avoid / Reduce / Transfer / Accept / Exploit / Terminate |
| Control Description | Long text | No | Existing controls narrative |
| Control Effectiveness | Dropdown | No | Effective / Partially Effective / Ineffective |
| Risk Status | Dropdown | Yes | Open / Under Treatment / Closed / Escalated |
| Date Identified | Date | Yes | |
| Review Date | Date | Yes | Next scheduled review |
| Tags | Multi-select | No | Custom tags (e.g., ESG, Regulatory, Cyber) |
| Attachments | File upload | No | Supporting documents |

- **FR-RISK-003:** Risk records MUST support full version history with a diff view showing what changed, who changed it, and when.
- **FR-RISK-004:** Risk records MUST NOT be permanently deletable; only soft-delete (archive) is permitted.
- **FR-RISK-005:** Bulk risk import via Excel template MUST be supported using the Zimbabwe National Risk Framework format.
- **FR-RISK-006:** Risk records MUST be cloneable as templates for new risks.

### 6.3 Risk Scoring Methodology

- **FR-SCORE-001:** The system MUST support the Zimbabwe National Risk Framework **5-band rating scale** as the default scoring methodology:

| Score | Likelihood | Impact |
|-------|-----------|--------|
| 5 | Almost Certain (>80%) | Critical |
| 4 | Likely (60–80%) | Major |
| 3 | Possible (40–60%) | Moderate |
| 2 | Unlikely (20–40%) | Minor |
| 1 | Rare (<20%) | Insignificant |

- **FR-SCORE-002:** Risk colour coding MUST align with National Risk Framework heat map colours:
  - Score 15–25: **Red** (Very High)
  - Score 9–14: **Orange** (High)
  - Score 5–8: **Yellow** (Medium)
  - Score 3–4: **Blue** (Low)
  - Score 1–2: **Green** (Very Low)
- **FR-SCORE-003:** The system MUST also support a configurable **3-band scale** (High/Medium/Low) as an alternative.
- **FR-SCORE-004:** System Administrator MUST be able to configure custom scoring matrices (3×3, 4×4, 5×5).
- **FR-SCORE-005:** **Inherent risk**, **current residual risk**, and **target residual risk** scores MUST be tracked separately for each risk record.
- **FR-SCORE-006:** The system MUST support weighted scoring (qualitative × financial impact multiplier) as an optional configuration.

### 6.4 Risk Heat Map

- **FR-HEAT-001:** The system MUST generate a dynamic, real-time risk heat map (5×5 grid by default).
- **FR-HEAT-002:** Heat maps MUST be filterable by department, risk category, strategic objective, date range, and risk owner.
- **FR-HEAT-003:** Clicking a heat map cell MUST expand to show the list of risks in that scoring band.
- **FR-HEAT-004:** Heat maps MUST be exportable to PDF and PNG at board-ready resolution (minimum 300 DPI).
- **FR-HEAT-005:** Historical heat map snapshots MUST be retained for trend comparison.

### 6.5 Risk Appetite and Tolerance

- **FR-APP-001:** Risk Manager MUST be able to define risk appetite statements per risk category.
- **FR-APP-002:** Risk appetite thresholds MUST be configurable using both quantitative (numeric/financial) and qualitative (narrative/rating-band) expressions per PECOGA para 202.
- **FR-APP-003:** The system MUST visually flag risks that exceed the appetite or tolerance threshold in red.
- **FR-APP-004:** Risk appetite statements MUST require an Executive/Board approval workflow before taking effect.
- **FR-APP-005:** The system MUST enforce an annual Board Risk Management Committee (BRMC) review cycle for all risk appetite and tolerance statements (PECOGA para 201); statements unreviewed for more than 12 months MUST trigger escalation alerts to the CRO and BRMC Chair.
- **FR-APP-006:** The system MUST generate and record a **deviation disclosure** when actual risk exposure exceeds the Board-approved tolerance limit (PECOGA para 202), capturing: date detected, risk(s) involved, tolerance limit breached, actual exposure level, and escalation actions taken.

### 6.6 Annual Formal Risk Assessment (PECOGA para 200(b))

- **FR-ASSESS-001:** The system MUST enforce completion of a structured Annual Formal Risk Assessment at least once per calendar year.
- **FR-ASSESS-002:** The assessment workflow MUST guide the Risk Manager through all risk categories; require documented findings per category; capture methodology, facilitators, date range, and conclusions; route the completed assessment to the BRMC for formal sign-off; and lock the record as a versioned annual snapshot upon BRMC sign-off.
- **FR-ASSESS-003:** The system MUST generate escalation alerts to the CRO and BRMC Chair if the Annual Formal Risk Assessment workflow has not been initiated by 1 October of the calendar year.
- **FR-ASSESS-004:** Completed annual assessment records MUST be accessible in read-only form to auditors and the Corporate Secretary.

### 6.7 Risk Treatment and Monitoring

- **FR-TREAT-001:** Each risk MUST support multiple linked treatment actions.
- **FR-TREAT-002:** Each treatment action MUST capture: description, responsible owner, due date, priority, status, progress notes, and completion evidence (mandatory file upload on completion).
- **FR-TREAT-003:** Treatment action status flow: Not Started → In Progress → Completed / Overdue / Deferred.
- **FR-TREAT-004:** The system MUST automatically mark treatment actions as "Overdue" when the due date passes without completion.
- **FR-TREAT-005:** Automated email/notification reminders MUST be sent to treatment action owners: 14 days before due, 7 days before due, on the due date, and daily after overdue.
- **FR-TREAT-006:** Escalation workflow MUST automatically notify the risk owner's manager when any treatment action is 14+ days overdue.
- **FR-TREAT-007:** Treatment strategy options MUST include all six PECOGA para 206 response categories: **Avoid**, **Reduce/Mitigate**, **Transfer**, **Tolerate/Accept**, **Exploit**, and **Terminate**.
- **FR-TREAT-008:** A **Control Library** MUST be maintained: reusable control templates linkable to multiple risks, with control testing records (test date, tester, methodology, result, next test date).

### 6.8 Board Risk Governance Support (PECOGA Chapter 4)

- **FR-GOV-001:** The system MUST maintain a **Board Risk Management Committee (BRMC) Charter** record with version history, effective date, and annual review cycle tracking. Alerts MUST be sent when the charter is due for review (PECOGA para 198).
- **FR-GOV-002:** The system MUST maintain a **Chief Risk Officer (CRO) designation record** — named individual, appointment date, dual reporting lines (functional to BRMC, administrative to CEO), and Board approval record. Any change MUST require a Board-approval workflow step (PECOGA para 200(i)).
- **FR-GOV-003:** The system MUST produce a **Government/Shareholder Risk Reporting Pack** per PECOGA Second Schedule para 42 — a structured annual report covering risk management system description, top risks, risk appetite and tolerance levels, treatment summary, and material risk events — exportable as PDF and Word.
- **FR-GOV-004:** The system MUST track **Independent Assurance of Risk Management** engagements — provider, scope, date, findings, recommendations, and status of management responses (PECOGA para 187).

---

## 7. Module 3 — Board Management & Corporate Governance

### 7.1 Overview

This module provides the Board of Directors with the tools required to fulfil their oversight duties under PECOGA Part VI & VII, and delivers the secure digital board meeting experience described in the ZINARA BMS procurement specifications.

### 7.2 Meeting Management

- **FR-BOARD-001:** The Board Secretary MUST be able to electronically create, schedule, and distribute meeting packs containing agendas, reports, and minutes in Word, PDF, and PPT formats.
- **FR-BOARD-002:** The system MUST include **intuitive drag-and-drop tools** for building agendas, with reorderable agenda items.
- **FR-BOARD-003:** The system MUST automatically send calendar invitations to board members (Outlook/iCal compatible) upon meeting creation and for any updates or cancellations.
- **FR-BOARD-004:** Meeting packs MUST be distributable to designated board member groups with controlled access (each member sees only their role-appropriate documents).
- **FR-BOARD-005:** The system MUST support an **emergency alert / broadcast** feature allowing the Board Secretary to instantly notify all members of critical updates, meeting cancellations, or urgent matters.

### 7.3 Document Interaction and Collaboration

- **FR-BOARD-006:** Board members MUST be able to **securely annotate documents** — using highlighting and private notes — with annotations synchronised across all the member's registered devices.
- **FR-BOARD-007:** Annotations MUST remain private by default and MUST NOT be visible to other users unless the annotating member explicitly chooses to share them.
- **FR-BOARD-008:** All document downloads MUST be watermarked with the recipient's name and access timestamp to discourage unauthorised distribution.

### 7.4 Mobile and Offline Access

- **FR-BOARD-009:** The system MUST include a native mobile application for both **Android and iOS** providing full board member functionality.
- **FR-BOARD-010:** Board members MUST be able to download meeting packs for **offline access** — viewing and annotating while without internet connectivity (on flights, travel, or limited connectivity areas).
- **FR-BOARD-011:** The application MUST automatically synchronise offline annotations to the server when connectivity is restored.
- **FR-BOARD-012:** The mobile application MUST load a 300-page meeting pack in **under 5 seconds** on a standard 4G connection.

### 7.5 Resolutions and Electronic Signatures

- **FR-BOARD-013:** A dedicated **Resolutions Module** MUST capture formal resolutions and action items arising from board meetings, assigning each to an owner with a mandated due date.
- **FR-BOARD-014:** The system MUST support a **secure, legally compliant electronic signature process** for signing board minutes and formal resolutions, compliant with the Zimbabwe Cyber and Data Protection Act.
- **FR-BOARD-015:** The system MUST maintain a **complete, immutable, date-stamped audit trail** for the entire lifecycle of every resolution: creation → discussion → voting → signing → implementation tracking.
- **FR-BOARD-016:** Resolution tracking MUST include automated reminders to assigned action owners for outstanding implementation items.

### 7.6 Voting and Polls

- **FR-BOARD-017:** The system MUST enable formal votes and informal polls on agenda items, with immediate result aggregation displayed in real time.
- **FR-BOARD-018:** Voting records MUST be preserved in the audit trail and included in the generated minutes.
- **FR-BOARD-019:** The system MUST support both **in-meeting (synchronous)** and **out-of-meeting (asynchronous circular resolution)** voting workflows.

### 7.7 Board Evaluations (PECOGA Section 25)

- **FR-BOARD-020:** The system MUST provide a digital workflow for the **mandatory Section 25 Board Evaluation** — an annual 360-degree assessment of board effectiveness, individual member performance, and committee performance.
- **FR-BOARD-021:** Evaluation responses MUST be submitted anonymously through a secure, encrypted portal.
- **FR-BOARD-022:** The system MUST generate an evaluation summary report for the Board Chair and the line Ministry, retaining individual responses in a confidential vault.

### 7.8 Ethics and Disclosure Portal

- **FR-ETHICS-001:** The system MUST maintain a **Register of Directors' Interests** — a permanent digital ledger where Board members declare any interests before every meeting, with the Board Secretary notified of all declarations.
- **FR-ETHICS-002:** The system MUST provide a **secure, encrypted vault** for the **Annual Asset Declaration** by Board members and designated senior staff, as mandated by PECOGA.
- **FR-ETHICS-003:** The system MUST maintain a centralised repository for the **Board Charter** and **Code of Ethics**.
- **FR-ETHICS-004:** The system MUST enforce an **Annual Digital Sign-Off** — every board member and designated employee must digitally certify annual adherence to the Code of Ethics; the Corporate Secretary receives automated reminders and views a compliance dashboard showing who has and has not signed.

### 7.9 Committee Management

- **FR-COMM-001:** The system MUST provide dedicated workspaces (virtual committee portals) for each sub-committee, including: Audit & Risk Committee, Remuneration Committee (PECOGA Section 40), and Human Resources Committee.
- **FR-COMM-002:** Internal Audit findings MUST feed directly into the Audit Committee dashboard, showing "Open" vs. "Closed" audit points per committee review cycle.
- **FR-COMM-003:** Committee-specific documents, resolutions, and attendance records MUST be stored separately from full-board materials, with access scoped to committee members only.

### 7.10 Compliance Tracking Dashboard

- **FR-BOARD-023:** The Board Secretary's dashboard MUST display real-time compliance status against:
  - Statutory Instrument 135 of 2019
  - PECOGA obligations (with specific section references)
  - Public Finance Management Act key provisions
  - Any entity-specific legislative obligations

---

## 8. Module 4 — Compliance Management

### 8.1 Compliance Obligation Register

- **FR-COMP-001:** The system MUST maintain a compliance obligation register capturing: Obligation ID, Title, Source Legislation/Standard, Section Reference, Description, Obligation Type, Responsible Owner, Department, Due Date, Frequency (One-off / Monthly / Quarterly / Annual), Status, Evidence, Linked Risk.
- **FR-COMP-002:** The system MUST come pre-configured with obligations for: SI 135/2019, PECOGA Chapter 4, Public Finance Management Act, ISO 9001:2015, ISO 31000:2018, and the Energy Regulatory Act (with the pre-configuration customisable per client entity).
- **FR-COMP-003:** Compliance evidence upload MUST be mandatory for any obligation marked "Compliant."
- **FR-COMP-004:** The system MUST enforce evidence-based compliance — no obligation can be marked compliant without an attached supporting document.

### 8.2 Compliance Calendar and Alerts

- **FR-COMP-005:** The compliance calendar MUST display all obligations with colour-coding: Green (compliant), Amber (due within 30 days), Red (overdue).
- **FR-COMP-006:** Automated alerts MUST notify responsible owners 30 days, 14 days, and 7 days before obligation due dates.
- **FR-COMP-007:** The compliance dashboard MUST show: overall compliance rate (%), obligations by status, overdue obligations count, and a compliance trend chart.

### 8.3 Automated Regulatory Change Monitoring

- **FR-COMP-008:** The system MUST support automated monitoring of regulatory changes — ingesting updates from configurable RSS feeds and email inputs (e.g., Government Gazette, PECOGA amendments) and alerting the Compliance Officer when a new publication is detected.

### 8.4 Combined Assurance (Compliance Universe)

- **FR-COMP-009:** A **Compliance Universe** map MUST link compliance obligations to risks, controls, and audits, creating a combined assurance view aligned to the Three Lines of Defence model.
- **FR-COMP-010:** The system MUST generate a **quarterly compliance report** aligned to the National Risk Framework template format, auto-scheduled and distributable to the line Ministry and the Corporate Governance Unit (CGU).

---

## 9. Module 5 — Policy Management

- **FR-POL-001:** The system MUST provide a centralised policy repository for all organisational policies, standards, and procedures.
- **FR-POL-002:** Each policy MUST capture: Policy ID, Title, Category, Owner (department and individual), Version Number, Effective Date, Review Date, Status (Draft / Active / Under Review / Retired), Description/Summary, Linked Risk, Linked Compliance Obligation, Attached Document (PDF/Word).
- **FR-POL-003:** Policy version control MUST maintain full document history; all previous versions MUST be retrievable.
- **FR-POL-004:** Policy approval workflow MUST be configurable: Draft → Review → Approved → Published.
- **FR-POL-005:** Published policies MUST be distributable to designated user groups with a **mandatory acknowledgment requirement**.
- **FR-POL-006:** The system MUST track acknowledgment per user — date acknowledged, user name, IP address.
- **FR-POL-007:** Automated reminders MUST be sent to users who have not acknowledged mandatory policies within 7 days.
- **FR-POL-008:** The system MUST alert the Policy Owner 60 days before a policy review date.
- **FR-POL-009:** The system SHOULD support the ability to restrict system access for users with outstanding mandatory policy acknowledgments (configurable by System Administrator).

---

## 10. Module 6 — Incident & Issue Management

- **FR-INC-001:** All users (including standard staff) MUST be able to log incidents via a simplified intake form requiring no technical knowledge.
- **FR-INC-002:** Incident records MUST capture: Incident ID, Title, Description, Date/Time Occurred and Reported, Location/Office, Reporter, Incident Type (configurable dropdown), Severity (Low / Medium / High / Critical), Department Affected, Linked Risk (optional), Immediate Actions Taken, Attachments.
- **FR-INC-003:** An **anonymous incident reporting** option MUST be available for ethics and misconduct incidents (no reporter name is captured or stored).
- **FR-INC-004:** High-severity and critical incidents MUST trigger automatic escalation notifications to the Risk Manager and relevant department head within 2 hours.
- **FR-INC-005:** The system MUST support full **Root Cause Analysis (RCA)** workflows per incident: 5-Why methodology template, Fishbone/Ishikawa diagram option, and a custom RCA form.
- **FR-INC-006:** **Corrective and Preventive Actions (CAPA)** MUST be linked to incidents: action description, owner, due date, status, completion evidence.
- **FR-INC-007:** Incident status workflow: Reported → Under Investigation → Root Cause Identified → CAPA In Progress → Closed → Verified Closed.
- **FR-INC-008:** Repeated incident patterns (same type within a configurable time window) MUST trigger an AI alert suggesting a systemic risk addition to the risk register.
- **FR-INC-009:** A **Lessons Learned register** MUST be maintained, populated from all closed incidents and accessible to all users for reference.

---

## 11. Module 7 — Internal Audit Support

- **FR-AUDIT-001:** The system MUST maintain an **Audit Universe** — all auditable entities and processes with risk rating, last audit date, and next planned audit date.
- **FR-AUDIT-002:** An **Annual Audit Plan** MUST be manageable in the system, including audit assignments, timelines, and resource allocation.
- **FR-AUDIT-003:** Individual audit engagement records MUST capture: Title, Scope, Objectives, Methodology, Lead Auditor, Team Members, Start/End Date, and Status.
- **FR-AUDIT-004:** Audit findings MUST be logged per engagement, capturing: Finding ID, Title, Root Cause, Risk Rating (Critical/High/Medium/Low), Criteria, Condition, Effect, Recommendation, Management Response, Agreed Action, Due Date, and Responsible Owner.
- **FR-AUDIT-005:** The system MUST generate an **Audit Finding Age Report** — findings overdue by severity — for the CAE and Audit Committee.
- **FR-AUDIT-006:** A **Combined Assurance Map** MUST link risks to assurance providers (Internal Audit, External Audit, Risk & Compliance, Management Self-Assessment) for a Three-Lines-of-Defence view; the system MUST generate a Combined Assurance Summary report (RPT-009) on a quarterly schedule.
- **FR-AUDIT-007:** Internal Audit MUST be able to produce an **Annual ERM Effectiveness Assessment** report (PECOGA para 232(f)), assessing: adequacy of the risk management framework, quality of the risk register, effectiveness of treatment actions, and compliance with PECOGA Chapter 4; the report MUST be routable to the BRMC via the system's approval workflow.
- **FR-AUDIT-008:** An auditee satisfaction survey MUST be distributable post-audit, with satisfaction scores tracked on the Internal Auditor's dashboard.

---

## 12. Module 8 — Third-Party / Vendor Risk Management

- **FR-VEN-001:** The system MUST maintain a **Vendor Register** capturing: Vendor Name, Category, Services Provided, Contract Value, Contract Start/End Date, KPI Status, Linked Risks, and Risk Rating.
- **FR-VEN-002:** A **due diligence questionnaire builder** MUST allow the Risk Manager to create configurable questionnaire templates distributable to vendors via a secure, tokenised link (no vendor login account required).
- **FR-VEN-003:** Vendor risk scoring MUST be automatically calculated from questionnaire responses using configurable scoring weights.
- **FR-VEN-004:** The system MUST track vendor contract expiry and alert the Procurement/Risk team 90, 60, and 30 days before expiry.
- **FR-VEN-005:** Vendor risks MUST be integrated with the main enterprise risk register — vendor risks appear in the organisation-wide risk view.
- **FR-VEN-006:** Vendor performance KPI tracking MUST include automated RAG status updates.

---

## 13. Module 9 — Reporting & Analytics

### 13.1 Role-Specific Dashboards

- **FR-DASH-001:** The system MUST provide role-specific landing dashboards for each user type:

**Executive / Board Dashboard:**
- Top 10 risks by rating (colour-coded)
- Risk heat map (summary)
- Risk appetite status per category (within/outside)
- NDS2 alignment coverage percentage
- KPI RAG status across strategic objectives
- Compliance status (% compliant, overdue count)
- Open incidents by severity
- Treatment actions overdue (count)

**Risk Manager Dashboard:**
- Full risk register summary with filters
- Risks approaching review date
- Treatment action Kanban board (Not Started / In Progress / Overdue / Complete)
- AI early warning signals
- Compliance calendar (next 30 days)
- Audit finding trend

**Board Secretary Dashboard:**
- Upcoming meetings calendar
- Outstanding agenda items
- Unsigned resolutions / minutes
- Action items pending follow-up
- Policy acknowledgment compliance

**Compliance Officer Dashboard:**
- Compliance obligation calendar
- Policy acknowledgment rates
- Regulatory change alerts
- Obligations overdue by legislation source

**Internal Auditor Dashboard:**
- Audit plan completion percentage
- Open findings by severity and age
- Combined assurance map
- Auditee satisfaction trend

**Risk Champion Dashboard:**
- Department-scoped risks
- Assigned treatment actions
- Incidents reported by department
- Outstanding mandatory policy acknowledgments

- **FR-DASH-002:** All dashboards MUST support date-range filtering and at minimum a 3-minute data refresh cycle.
- **FR-DASH-003:** Dashboard widgets MUST be configurable — add, remove, and reorder — per role.
- **FR-DASH-004:** All dashboards MUST be fully functional and accessible on mobile devices.

### 13.2 Standard Reports

The system MUST generate the following standard reports:

| Report ID | Name | Audience | Schedule |
|-----------|------|----------|----------|
| RPT-001 | Quarterly Risk Report | Board / BRMC | Quarterly (auto) |
| RPT-002 | Risk Heat Map Report | Board / BRMC | On-demand + Quarterly |
| RPT-003 | Risk Treatment Status Report | Risk Manager | Monthly |
| RPT-004 | Compliance Status Report | Compliance Officer | Monthly |
| RPT-005 | Policy Acknowledgment Report | Compliance / HR | Monthly |
| RPT-006 | Incident Summary Report | Risk Manager / CAE | Monthly |
| RPT-007 | Audit Plan Completion Report | CAE / Board | Quarterly |
| RPT-008 | Audit Findings Age Report | CAE | Monthly |
| RPT-009 | Combined Assurance Report | CAE / Board | Quarterly |
| RPT-010 | Top 10 Risks Report | CEO / Board | Monthly |
| RPT-011 | Vendor Risk Summary | Risk / Procurement | Quarterly |
| RPT-012 | Annual Risk Assessment Report | Minister / Board | Annual |
| RPT-013 | SI 135 Compliance Evidence Report | Accounting Officer | Annual |
| RPT-014 | PECOGA Chapter 4 Governance Compliance Report | Corporate Secretary | Annual |
| RPT-015 | Quarterly Board Risk Committee Pack | BRMC / Board | Quarterly (auto) |
| RPT-016 | PECOGA Annual Risk Governance Disclosure Report | Accounting Officer | Annual |
| RPT-017 | NDS2 Strategic Alignment Report | CEO / Line Ministry | Quarterly |
| RPT-018 | Performance Contract Review Pack | Board Chair / Line Ministry | Semi-annually |
| RPT-019 | Board Meeting Minutes (auto-draft) | Board Secretary | Post-meeting |
| RPT-020 | Governance Metrics Report (attendance, resolutions passed) | Corporate Secretary | Quarterly |

- **FR-RPT-001:** All reports MUST be exportable to PDF and Excel.
- **FR-RPT-002:** Quarterly risk reports MUST align exactly with the Zimbabwe National Risk Framework template format.
- **FR-RPT-003:** Report scheduling MUST support automatic generation and emailed distribution on a configurable schedule.
- **FR-RPT-004:** A **custom report builder** MUST allow authorised users to create ad hoc reports from any data field in the system.
- **FR-RPT-005:** All generated reports MUST carry client institution branding (logo, colour scheme, report reference numbers).

### 13.3 Governance Metrics and M&E Dashboards

- **FR-RPT-006:** The system MUST generate M&E heatmaps showing implementation status of the Corporate Governance Act across each department.
- **FR-RPT-007:** The system MUST track governance metrics including: board meeting attendance records, percentage of resolutions fully implemented, compliance rate by obligation source, and KPI achievement rate by department.

---

## 14. Module 10 — AI & Predictive Analytics Engine

### 14.1 AI-Assisted Risk Identification

- **FR-ML-001:** An NLP-based risk classifier MUST suggest risk categories and likelihood/impact scores based on free-text risk description input (minimum 70% classification accuracy on entity-specific training data after an initial learning period).
- **FR-ML-002:** **Duplicate risk detection** MUST flag similar existing risks when a new risk is being created (cosine similarity threshold configurable, default 80%).
- **FR-ML-003:** The system MUST provide risk identification prompts and templates based on the institution's industry sector and risk taxonomy.

### 14.2 Early Warning Signal System

- **FR-ML-004:** The system MUST monitor configurable data inputs for early warning triggers:
  - Risk score increases above a configured threshold
  - Multiple incidents of the same type within a configurable time window
  - Treatment actions overdue beyond a threshold (default: 14 days)
  - Compliance obligations approaching their due date without evidence uploaded
  - Vendor contract expiry approaching
  - KPI falls to Red status
  - SAP-sourced financial anomalies (budget variance threshold)
- **FR-ML-005:** Early warning alerts MUST be displayed on role-specific dashboards and sent via in-app notification and email.
- **FR-ML-006:** Alert rules MUST be configurable by the System Administrator and Risk Manager.

### 14.3 Predictive Analytics

- **FR-ML-007:** The system MUST provide risk trend forecasting based on historical risk score movements (linear regression/ARIMA baseline), displayed as a confidence band (upper/lower estimate with probability).
- **FR-ML-008:** The system MUST identify high-correlation risk pairs (risks that historically move together) and flag them to the Risk Manager.

### 14.4 Monte Carlo Simulation

- **FR-ML-009:** The system MUST include **Monte Carlo simulation** for quantitative risk analysis:
  - User defines: risk event probability distribution, impact range (ZWG/USD), number of simulations (default: 10,000)
  - System generates: probability distribution of total financial exposure, Value at Risk (VaR) at 95% and 99% confidence levels, and a tornado diagram of top risk drivers
- **FR-ML-010:** Simulation results MUST be saveable and exportable as a board-ready PDF.
- **FR-ML-011:** The system MUST support at minimum: Normal, Triangular, Uniform, and PERT probability distributions.

### 14.5 ML Model Governance

- **FR-ML-012:** All ML models MUST operate on-premises when deployed in on-premises mode — no external API calls to cloud-based ML services.
- **FR-ML-013:** The System Administrator MUST be able to trigger model retraining using updated entity data.
- **FR-ML-014:** Model performance metrics (accuracy, precision, recall) MUST be visible to the System Administrator.
- **FR-ML-015:** All model predictions MUST be presented as suggestions — never as mandatory or automatic classifications — ensuring human oversight of all risk decisions.

---

## 15. Non-Functional Requirements

### 15.1 Performance

| Requirement | Target |
|-------------|--------|
| Dashboard page load time | < 2 seconds (on LAN / via VPN) |
| Board meeting pack load (300 pages) | < 5 seconds on 4G / LTE |
| Risk Heat Map render time | < 3 seconds with up to 500 risks |
| Report generation (standard reports) | < 30 seconds |
| Monte Carlo simulation (10,000 runs) | < 60 seconds |
| Search results (full-text search) | < 1 second for up to 100,000 records |
| API response time (95th percentile) | < 500ms |
| Maximum concurrent users | 100 (cloud); 40 (on-premises baseline) |

### 15.2 Availability and Reliability

- **Cloud deployment:** Minimum **99.99% uptime** (excluding scheduled maintenance windows)
- **On-premises deployment:** Minimum **99.95% uptime** for core services (SLA with deployment team)
- Scheduled maintenance windows MUST occur outside business hours (18:00–06:00 CAT) and MUST be communicated 5 business days in advance
- Automated daily database backups with a maximum **4-hour Recovery Point Objective (RPO)**
- Maximum **2-hour Recovery Time Objective (RTO)** for critical system failures

### 15.3 Scalability

- Cloud deployment MUST support horizontal scaling to accommodate growth from single-entity to multi-entity tenancy
- Database architecture MUST support at least **10 TB of archive data** per institution
- Document storage MUST support concurrent storage of **10,000+ meeting pack documents** without performance degradation
- The system MUST support adding new client institutions (tenants) without code changes

### 15.4 Usability

- Survey-based usability testing MUST achieve a **System Usability Scale (SUS) score ≥ 75** (above average) across all primary user roles
- New users MUST be able to complete core tasks (log a risk, acknowledge a policy, log an incident) without formal training
- The Board Member mobile experience MUST be optimised for senior executives: minimum 14pt font support, large tap targets, simplified navigation

### 15.5 Data Integrity

- All writes to the database MUST be captured in an immutable audit log — stored separately from operational data and writable only by the system process
- Audit log records MUST capture: timestamp (to millisecond), user ID, user role, action taken, record ID affected, before-state, and after-state
- Audit logs MUST NOT be deletable by any user role, including System Administrator

---

## 16. Security Requirements

### 16.1 Compliance Standards

- The platform and hosting infrastructure MUST maintain: **ISO 27001 / ISO 27000 certification** and **SOC 2 Type II compliance** (cloud SaaS deployment)
- The system MUST comply with the **Zimbabwe Cyber and Data Protection Act**
- Data residency for cloud deployment MUST be within a **data centre located in Southern Africa**

### 16.2 Encryption

- All data in transit MUST be encrypted using **TLS 1.2 or higher** (TLS 1.3 preferred)
- All data at rest MUST be encrypted using **AES-256**
- Electronic signatures MUST use a cryptographically secure signing mechanism compliant with Zimbabwean law

### 16.3 Authentication and Access Control

- **FR-SEC-001:** The system MUST integrate with LDAP/Active Directory for SSO
- **FR-SEC-002:** SAML 2.0 or OpenID Connect MUST be supported as fallback authentication
- **FR-SEC-003:** MFA MUST be enforced for all privileged roles (R01–R06): TOTP-based (Google Authenticator compatible); SMS OTP and biometric (Touch ID/Face ID) MUST be supported on mobile
- **FR-SEC-004:** Session timeout MUST be configurable (default: 30 minutes inactivity)
- **FR-SEC-005:** Account lockout MUST trigger after 5 consecutive failed login attempts
- **FR-SEC-006:** All authentication events MUST be logged (login, logout, failed attempts, MFA challenges)
- **FR-SEC-007:** Role-based access MUST be configurable at module, record, and field level
- **FR-SEC-008:** Department-scoped access MUST be enforced — users see only their department's records unless elevated by their role

### 16.4 Application Security

- **FR-SEC-009:** The system MUST implement OWASP Top 10 protections including prevention of: SQL injection, XSS, CSRF, insecure direct object references, and broken access control
- **FR-SEC-010:** All user-submitted file uploads MUST be scanned for malware before storage
- **FR-SEC-011:** All sensitive fields (asset declarations, CRO records, board evaluation responses) MUST be encrypted at the field level in addition to database-level encryption
- **FR-SEC-012:** A Web Application Firewall (WAF) MUST be deployed in front of the cloud SaaS environment
- **FR-SEC-013:** The vendor MUST conduct and share annual penetration test reports with client institutions

---

## 17. Integration Requirements

### 17.1 SAP ERP Integration

- **FR-INT-001:** The system MUST provide a bidirectional SAP integration connector supporting SAP RFC/BAPI protocols or REST API (SAP BTP compatible)
- **FR-INT-002:** The SAP integration MUST synchronise: Chart of Accounts and budget data (financial risk exposure), Procurement data (vendor/contract records), HR organisational data (employee records for user provisioning), and Project data (initiative risk linkage)
- **FR-INT-003:** SAP-sourced financial anomalies (budget variance exceeding a configurable threshold) MUST automatically trigger an early warning alert in the ERM module
- **FR-INT-004:** SAP integration data refresh MUST be schedulable (default: nightly) and on-demand triggerable

### 17.2 Microsoft 365 Integration

- **FR-INT-005:** The system MUST integrate with **Microsoft Outlook** for calendar invitations (meeting creation triggers .ics distribution)
- **FR-INT-006:** The system MUST integrate with **Microsoft Teams** for meeting notifications and real-time alerts
- **FR-INT-007:** The system MUST integrate with **SharePoint** for document storage synchronisation (policy documents, board packs) as a configurable option
- **FR-INT-008:** The system MUST integrate with **Zoom** for direct meeting link generation within board meeting records

### 17.3 Active Directory / LDAP

- **FR-INT-009:** User provisioning MUST support automated account creation from Active Directory group membership
- **FR-INT-010:** User deprovisioning (account disabling) MUST occur automatically when the AD account is disabled

### 17.4 API Architecture

- **FR-INT-011:** The system MUST expose a RESTful API for all primary data objects, documented in OpenAPI 3.0 / Swagger
- **FR-INT-012:** Webhook support MUST be available for outbound event notifications (new risk created, action overdue, compliance deadline approaching)
- **FR-INT-013:** The system MUST support an import/export API compatible with the Zimbabwe National Risk Framework Excel templates

---

## 18. User Management and Access Control

### 18.1 Role-Based Access Control (RBAC) Matrix

| Role | Strategic Planning | ERM | Board Mgmt | Compliance | Policy | Incidents | Audit | Reporting |
|------|-------------------|-----|-----------|-----------|--------|-----------|-------|-----------|
| R01 System Admin | Full | Full | Full | Full | Full | Full | Full | Full |
| R02 Risk Manager | Read | Full | Read | Full | Read | Read/Flag | Read | Full |
| R03 Compliance Officer | Read | Read/Comment | Read | Full | Full | Read | Read | Read |
| R04 Internal Auditor | Read | Read | Read | Read | Read | Read | Full | Read |
| R05 Risk Champion | Dept-only | Dept-only (create/update) | — | Read | Acknowledge | Create | — | Read |
| R06 Board/Executive | Read | Read/Approve appetite | Read/Participate | Read | Read | — | Read | Read |
| R07 Board Secretary | — | — | Full | Read | Read | — | — | Read |
| R08 CEO | Read/Approve | Read/Approve | Read/Sign | Approve | Approve | Read | Read | Full |
| R09 Strategic Planning | Full (own module) | Read | — | Read | Read | — | — | Read |
| R10 Staff Member | — | — | — | — | Acknowledge | Create | — | — |

### 18.2 User Administration Requirements

- **FR-USER-001:** System Administrator MUST be able to create, edit, disable, and delete users
- **FR-USER-002:** Bulk user import via CSV MUST be supported
- **FR-USER-003:** User profiles MUST include: name, email, department, office location, role, manager, and direct reports
- **FR-USER-004:** **Delegation functionality** MUST allow temporary permission handoff (e.g., during leave periods) with a defined expiry date
- **FR-USER-005:** User activity logs MUST be viewable by System Administrators

---

## 19. Data Model and Storage

### 19.1 Core Data Objects

The system's data model MUST accommodate the following primary entities:

```
Institution
├── Strategic Goal → Annual Plan Output → Departmental Action Plan → KPI
├── Risk → Treatment Actions → Controls → Incidents
├── Compliance Obligation → Evidence → Linked Risk
├── Policy → Version → Acknowledgment
├── Board Meeting → Agenda Items → Meeting Pack → Resolution → Signature
├── Audit → Audit Finding → CAPA
├── Vendor → Due Diligence → Contract → Risk
└── User → Role → Department → Notifications
```

### 19.2 Data Retention

- Risk records: retained indefinitely (soft-delete only)
- Board meeting packs and resolutions: retained for a minimum of 7 years
- Audit logs: retained for a minimum of 7 years, immutable
- Incident records: retained for a minimum of 5 years
- Policy acknowledgment records: retained for a minimum of 5 years
- Annual risk assessment snapshots: retained indefinitely as versioned records

### 19.3 Multi-Tenancy Data Isolation

- Cloud SaaS deployments MUST enforce strict logical data isolation between tenants at the database schema level or via row-level security
- No cross-tenant data access is permissible under any user role
- Backup and restore operations MUST be executable at the individual tenant level

---

## 20. Deployment and Infrastructure

### 20.1 Cloud SaaS Deployment (Southern Africa Hosted)

| Component | Specification |
|-----------|--------------|
| Hosting Region | Southern Africa (South Africa or Zimbabwe data centre) |
| Application Servers | Minimum 16 vCores, 32 GB RAM, auto-scalable |
| Database | Managed PostgreSQL, high availability (primary + replica), automated backups |
| File Storage | S3-compatible object storage, AES-256 encrypted |
| CDN | Regional CDN for static assets |
| WAF | Cloud WAF (e.g., Cloudflare or AWS WAF equivalent) |
| Uptime SLA | 99.99% (excluding scheduled maintenance) |

### 20.2 On-Premises Deployment (Client Data Centre)

| Server | CPU | RAM | Storage | OS |
|--------|-----|-----|---------|-----|
| Application Server | 16 vCores | 32 GB | 100 GB SSD | Ubuntu 22.04 LTS or RHEL 8+ |
| Database Server | 8 vCores | 32 GB | 2 TB HDD + 200 GB SSD | Ubuntu 22.04 LTS or Windows Server 2019+ |
| ML/Analytics Server | 8 vCores | 16 GB | 500 GB SSD | Ubuntu 22.04 LTS |
| File Storage | — | — | 1 TB NFS | Any Linux |
| Backup Server | 4 vCores | 8 GB | 5 TB | Any |

### 20.3 Network Requirements (On-Premises)

- HTTPS (TLS 1.3) for all client-server communication
- VPN connectivity required from all regional offices
- Active Directory accessible from the Application Server (LDAP/S)
- No outbound internet access required from application servers after initial deployment

### 20.4 Deployment Timeline

Initial client deployment MUST be completable within **30 days** of contract signature, including:
- Infrastructure provisioning
- Application deployment and configuration
- Pre-loading of regulatory obligation templates
- User account creation and AD integration
- Administrator and end-user training

---

## 21. Implementation Phases and Milestones

### Phase 1: Foundation (Months 1–3)
- Core platform deployment (infrastructure, authentication, RBAC)
- Module 2 (ERM) — Risk Register, scoring, heat maps
- Module 4 (Compliance) — Obligation register, compliance calendar
- Module 5 (Policy) — Repository, acknowledgment workflow
- Module 9 (Reporting) — Core dashboards, standard reports RPT-001 to RPT-010
- User training: administrators, risk champions

### Phase 2: Board and Governance (Months 3–5)
- Module 3 (Board Management) — Meeting management, annotated docs, resolutions, e-signatures
- Mobile application (iOS + Android) for board members
- Ethics portal, asset declaration vault
- Committee workspaces
- Integration: Microsoft 365 (Outlook, Teams, Zoom, SharePoint)
- Module 1 (Strategic Planning) — NDS2 library, cascading KPIs, performance contracts

### Phase 3: Intelligence and Integration (Months 5–8)
- Module 10 (AI/ML) — NLP risk classifier, early warning signals, Monte Carlo
- Module 6 (Incident Management) — Full incident lifecycle, CAPA, lessons learned
- Module 7 (Internal Audit) — Audit universe, findings, combined assurance
- Module 8 (Vendor Risk) — Vendor register, due diligence questionnaires
- SAP ERP integration
- Remaining standard reports (RPT-011 to RPT-020)

### Phase 4: Stabilisation and Handover (Months 8–12)
- End-to-end UAT against all acceptance criteria
- Performance optimisation and load testing
- Administrator training and system documentation handover
- Post-go-live support (minimum 6 months)
- Data migration from legacy Excel-based systems

---

## 22. Acceptance Criteria

| Category | Criterion |
|----------|-----------|
| Functional Completeness | All functional requirements (FR-*) in this document implemented and verifiable by test cases |
| Risk Register | A 300-risk register is loadable, scorable, and heat-mappable without error |
| Board Pack | A 300-page PDF meeting pack loads in < 5 seconds on a 4G connection via the mobile app |
| Compliance Automation | All pre-configured obligations (SI 135, PECOGA Chapter 4) appear in the compliance calendar with correct due dates and frequencies |
| E-Signature | Electronic signature on a board resolution is legally valid per Zimbabwe Cyber and Data Protection Act |
| MFA | All R01–R06 roles cannot authenticate without completing MFA on first login |
| SAP Integration | Financial data from SAP flows into the ERM module within the scheduled batch window (no manual data entry required) |
| AI Classification | Risk NLP classifier achieves ≥ 70% accuracy on a 50-risk validation test set |
| Uptime | System maintains 99.95% uptime over a 30-day UAT period with simulated 40-user concurrent load |
| Performance | All dashboard pages load within 2 seconds under 40 concurrent user load |
| Audit Trail | Any change to a risk record is captured in the audit log within 1 second; the log is non-editable by any user |
| Report Generation | Quarterly Board Risk Committee Pack (RPT-015) is auto-generated and distributed on schedule without manual intervention |
| Mobile Offline | Board member can download a meeting pack, open and annotate it offline, and have annotations synchronised when connectivity is restored |
| PECOGA Compliance | The system can produce evidence artefacts satisfying a sample PECOGA audit covering Sections 23–25, Chapter 4, and Sections 40 |
| Data Migration | Legacy risk data importable via Excel template without manual re-keying |

---

## 23. Assumptions and Constraints

### 23.1 Assumptions

- Client institutions have existing Active Directory / LDAP infrastructure for SSO integration
- For SAP integration, the client's SAP system is version ECC 6.0 or above (or SAP S/4HANA)
- Client institutions will nominate a dedicated System Administrator and Project Champion prior to deployment
- Legal review of electronic signature mechanism against the Zimbabwe Cyber and Data Protection Act will be conducted by client's legal team before Go Live
- Hardware procurement (servers, networking) is the client's responsibility for on-premises deployments
- The NDS2 library content will be sourced from ZIMSTAT / Ministry of Finance publications and loaded by the platform team prior to first client go-live

### 23.2 Constraints

- On-premises ML models must operate without internet connectivity post-deployment
- No dependency on Microsoft-exclusive productivity tools (the platform must be fully functional without a Microsoft 365 licence, with M365 integration as an optional enhancement)
- All data for Southern Africa-hosted cloud deployments must remain within Southern Africa at all times — no data routing through servers outside the region
- CHANGELOG.md and version release documentation are managed separately from this PRD
- External penetration testing is procured separately by client institutions; the vendor provides the test environment and cooperates fully

---

## 24. Glossary

| Term | Definition |
|------|-----------|
| **BRMC** | Board Risk Management Committee — a sub-committee of the Board responsible for risk oversight |
| **CAE** | Chief Audit Executive — head of the internal audit function |
| **CAPA** | Corrective and Preventive Actions — structured responses to incidents or audit findings |
| **CGU** | Corporate Governance Unit — a unit within the line Ministry overseeing PECOGA compliance |
| **CRO** | Chief Risk Officer — the designated officer responsible for enterprise risk management |
| **ESG** | Environmental, Social, and Governance — a framework for assessing institutional sustainability risks |
| **IRBM** | Integrated Results-Based Management — a planning methodology linking outputs to outcomes |
| **KPI** | Key Performance Indicator — a measurable value demonstrating progress toward objectives |
| **MDA** | Ministry, Department, or Agency — a Zimbabwean public-sector institution |
| **NDS2** | National Development Strategy 2 (2026–2030) — Zimbabwe's national development blueprint |
| **NPA** | National Priority Area — a pillar of the Zimbabwe NDS2 framework |
| **PECOGA** | Public Entities Corporate Governance Act [Chapter 10:31] No. 4/2018 |
| **PFM Act** | Public Finance Management Act (Chapter 22:19) |
| **RAG** | Red/Amber/Green — a traffic-light status indicator used throughout the platform |
| **RBAC** | Role-Based Access Control — a security model restricting access based on user roles |
| **RFC/BAPI** | Remote Function Call / Business Application Programming Interface — SAP integration protocols |
| **RTO / RPO** | Recovery Time Objective / Recovery Point Objective — disaster recovery metrics |
| **SI 135/2019** | Statutory Instrument 135 of 2019 — mandates annual risk assessments for all public entities |
| **SKRA** | Sector Key Result Area — a specific sector-level outcome aligned to an NDS2 NPA |
| **SOE** | State-Owned Enterprise — a government-controlled commercial entity |
| **VaR** | Value at Risk — a statistical measure of potential financial loss at a given confidence level |
| **ZERA** | Zimbabwe Energy Regulatory Authority — primary design reference client for the ERM module |
| **ZINARA** | Zimbabwe National Roads Administration — primary design reference for the Board Management module |
| **ZWG** | Zimbabwe Gold (ZiG) — the Zimbabwean currency unit |

---

*Document Reference: GRC-NEXUS/PRD/2026/001 | Version 1.0 | May 2026*
