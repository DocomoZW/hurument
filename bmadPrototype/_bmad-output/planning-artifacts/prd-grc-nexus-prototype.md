# PRD: GRC-Nexus eGovernance Platform — HTML Prototype

**Version:** 1.0  
**Date:** 2026-05-22  
**Scope:** Functional HTML prototype — static HTML, CSS, vanilla JS, hardcoded dummy data  
**Source:** `whitepaper.md` — GRC-Nexus v2.1 Core Guideline

---

## Executive Summary

This PRD scopes a **browser-runnable prototype** of the GRC-Nexus eGovernance Platform for Zimbabwean MDAs and SOEs. The prototype demonstrates the full user journey across all 8 platform modules with no backend, no authentication system, and no build pipeline. All data is hardcoded. The prototype is opened directly via `index.html` in any modern browser.

**Out of scope:** real authentication, API calls, data persistence, server-side rendering, external chart libraries, and any functionality beyond what is explicitly described in this PRD.

---

## Navigation Model

```
index.html (Executive Dashboard)
├── strategic-planning.html   ← Sidebar: "Strategic Planning"
├── risk-register.html        ← Sidebar: "Risk Management"
├── board-management.html     ← Sidebar: "Board Governance"
├── compliance.html           ← Sidebar: "Compliance"
├── incidents.html            ← Sidebar: "Incidents"
├── internal-audit.html       ← Sidebar: "Internal Audit"
├── vendor-risk.html          ← Sidebar: "Vendor Risk"
└── reports.html              ← Sidebar: "Reports"
```

Every page has an identical left sidebar with all 8 module links plus the dashboard link. Active page is highlighted. Breadcrumb on each page: **Home > [Module Name]**.

---

## Module 1: Strategic Planning

### Screens
1. **Objectives List** — hierarchical table of NDS2 pillars → goals → outputs
2. **KPI Detail Panel** — right-side panel with sparkline trend (inline SVG)

### Dummy Data Entities
- 3 NDS2 pillars (e.g., Economic Growth, Social Development, Governance)
- 6 institutional goals (2 per pillar)
- 12 annual outputs (2 per goal)
- Each output: code, description, owner, target value, actual value, status

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Hierarchical table shows 3 pillars / 6 goals / 12 outputs
- [ ] Filter bar for pillar and status is present
- [ ] Clicking an output row opens a right-side KPI detail panel
- [ ] KPI panel shows a sparkline SVG with 4 data points
- [ ] Status badges: On Track (green), At Risk (amber), Off Track (red)
- [ ] "New Objective" button is visible (non-functional)
- [ ] Breadcrumb shows: Home > Strategic Planning

---

## Module 2: Enterprise Risk Management

### Screens
1. **Risk Register** — table of 10 risks with heatmap above
2. **Risk Detail Panel** — floating panel on row click with treatment actions

### Dummy Data Entities
- 10 risks: ID, title, category, linked objective, inherent L (1-5), inherent I (1-5), residual L×I, owner, treatment status, due date
- 6 risks plotted on the heatmap with coordinates
- 3 treatment actions per risk (due date, responsible person)

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] 5×5 heatmap SVG is visible above the table
- [ ] Each plotted dot on heatmap shows risk ID label
- [ ] Hovering a heatmap dot shows the risk title
- [ ] Risk register table has 10 rows
- [ ] Columns are sortable (click header to sort)
- [ ] Status badges use correct colour: Critical (dark red), High (red), Medium (amber), Low (green)
- [ ] Clicking a row opens a floating detail panel with 3 treatment actions
- [ ] "Add Risk" and "Export" buttons visible (non-functional)

---

## Module 3: Board Governance

### Screens
1. **Meeting List** — upcoming and past meetings
2. **Meeting Detail** — agenda, documents, resolutions
3. **Action Tracker Tab** — board actions with status

### Dummy Data Entities
- 4 board meetings (date, type, status)
- 5 agenda items per meeting
- 3 attached documents per meeting (non-downloadable)
- 3 resolutions per meeting (responsible, due, status)
- 8 board actions (description, assigned to, due date, status)

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Meeting list shows 4 meetings with date, type, and status badge
- [ ] Clicking a meeting shows detail section with agenda, documents, resolutions
- [ ] "Action Tracker" tab switches to actions view with 8 rows
- [ ] Status badges present on meetings and actions
- [ ] Breadcrumb shows: Home > Board Management

---

## Module 4: Compliance & Policy

### Screens
1. **Statutory Obligations** tab — register with compliance summary chart
2. **Policy Library** tab — policies with lifecycle stage indicator

### Dummy Data Entities
- 10 statutory obligations (Act/Reg, description, due date, evidence, status)
- Donut chart: 60% compliant / 25% due soon / 15% non-compliant
- 8 policies (title, category, version, last reviewed, next review, status)
- Policy lifecycle stages: Draft → Review → Approved → Published → Archived

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Tabbed layout works — clicking tabs switches content
- [ ] Obligations table has 10 rows with status badges
- [ ] SVG donut chart visible with 3 segments and legend
- [ ] Policy table has 8 rows
- [ ] Clicking a policy row shows lifecycle stage indicator
- [ ] "Submit Attestation" and "Add Obligation" buttons visible (non-functional)

---

## Module 5: Incident & Whistleblower

### Screens
1. **Case List** — table of 8 cases with confidentiality indicators
2. **Submit Report Form** — all input fields, logs to console only
3. **Case Detail Panel** — timeline, investigator, status

### Dummy Data Entities
- 8 cases (ID, type, received date, severity, status, confidentiality flag)
- 3 investigation timeline steps per case (date, action)
- Assigned investigator name per case

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Case list has 8 rows; whistleblower/high-severity rows have lock icon
- [ ] "Submit New Report" form has all required fields visible
- [ ] Form submit logs to console (no real backend call)
- [ ] Clicking a case row opens detail panel with 3-step timeline
- [ ] Status badges: New (blue), Investigating (amber), Closed (green), Escalated (red)

---

## Module 6: Internal Audit

### Screens
1. **Audit Universe** tab — auditable areas with risk priority
2. **Annual Plan** tab — Gantt-style strip for 6 audits × 12 months
3. **Findings** tab — table of 12 findings with summary counts

### Dummy Data Entities
- 8 auditable areas with risk-based priority rating
- 6 audits with start/end month and status
- 12 findings (ID, audit name, title, risk rating, root cause, owner, due date, status)
- Summary: Total 12, Open 7, Overdue 3, Closed 2

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Three tabs switch correctly
- [ ] Audit universe shows 8 areas with priority badges
- [ ] Gantt strip shows 6 audits spanning months with colour-coded status
- [ ] Findings table has 12 rows with summary count header
- [ ] Clicking a finding shows management response detail pane
- [ ] Finding risk rating badges: Critical (dark red), High (red), Medium (amber), Low (green)

---

## Module 7: Vendor & Third-Party Risk

### Screens
1. **Supplier List** — table of 10 suppliers with risk tier
2. **Supplier Detail Panel** — compliance checks, contract obligations, risk score
3. **Risk Tier Summary Bar** — count per tier

### Dummy Data Entities
- 10 suppliers (name, category, contract value USD, onboarding status, risk tier, last assessment, next review)
- 5 compliance checks per supplier (pass/fail)
- 3 contract obligations per supplier (due dates)
- Overall risk score and trend per supplier

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] Supplier table has 10 rows with risk tier badges
- [ ] Risk tier summary bar shows counts (Critical/High/Medium/Low)
- [ ] Clicking a supplier opens detail pane with 5 compliance checkboxes
- [ ] Contract obligations section shows 3 rows per supplier
- [ ] "Add Supplier" and "Run Assessment" buttons visible (non-functional)

---

## Module 8: Reporting & Decision Intelligence

### Screens
1. **Platform KPI Summary** — 6 metric cards
2. **Cross-Module Analytics** — horizontal grouped bar chart (inline SVG)
3. **Statutory Report Generator** — form with 4 report types, preview toggle

### Dummy Data Entities
- 6 KPI metrics (strategy attainment %, open risk count trend, compliance rate %, audit finding closure rate %, incident resolution time avg, board action completion rate)
- 3 dummy institutions with Risk/Compliance/Audit health scores
- 4 report types for the generator form

### Acceptance Criteria
- [ ] Page renders with no JS errors
- [ ] 6 metric cards visible with hardcoded values
- [ ] Inline SVG grouped bar chart renders with 3 institution groups
- [ ] Statutory report form shows 4 report type options
- [ ] "Generate Preview" button toggles a dummy preview section

---

## Screen Inventory (30 screens)

| # | File | Screen Name |
|---|------|-------------|
| 1 | index.html | Executive Dashboard |
| 2 | strategic-planning.html | Objectives List |
| 3 | strategic-planning.html | KPI Detail Panel (overlay) |
| 4 | risk-register.html | Risk Register + Heatmap |
| 5 | risk-register.html | Risk Detail Panel (overlay) |
| 6 | board-management.html | Meeting List |
| 7 | board-management.html | Meeting Detail (inline expand) |
| 8 | board-management.html | Action Tracker Tab |
| 9 | compliance.html | Statutory Obligations Tab |
| 10 | compliance.html | Policy Library Tab |
| 11 | compliance.html | Policy Detail (inline panel) |
| 12 | incidents.html | Case List |
| 13 | incidents.html | Submit Report Form |
| 14 | incidents.html | Case Detail Panel (overlay) |
| 15 | internal-audit.html | Audit Universe Tab |
| 16 | internal-audit.html | Annual Plan Tab (Gantt) |
| 17 | internal-audit.html | Findings Tab |
| 18 | internal-audit.html | Finding Detail (inline panel) |
| 19 | vendor-risk.html | Supplier List |
| 20 | vendor-risk.html | Supplier Detail Panel (overlay) |
| 21 | reports.html | Platform KPI Summary |
| 22 | reports.html | Cross-Module Analytics Chart |
| 23 | reports.html | Statutory Report Generator |
| 24 | reports.html | Generated Report Preview (toggle) |

---

## Global Dummy Data Schema

**Institution:** Ministry of Finance — Zimbabwe  
**User:** Tendai M. (Risk Officer)  
**Dashboard Stats:** Open Risks: 23 | Overdue Compliance: 7 | Board Actions Pending: 12 | KPI Attainment: 68%
