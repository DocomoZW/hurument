# UX Design Specification: GRC-Nexus HTML Prototype

**Version:** 1.0  
**Date:** 2026-05-22  
**Application Type:** Public-sector governance web application  
**Tone:** Authoritative, neutral, trust-inspiring

---

## 1. Design Tokens

### 1.1 Color Palette

```css
--color-primary:     #1A3E6E;   /* Deep institutional blue — nav, headers, primary buttons */
--color-accent:      #C9A84C;   /* Government gold — highlights, active states, icons */
--color-danger:      #C0392B;   /* Alert red — Critical risk, Non-Compliant, Escalated */
--color-warning:     #E67E22;   /* Amber — High risk, At Risk, Due Soon */
--color-success:     #27AE60;   /* Green — Low risk, Compliant, On Track, Closed */
--color-info:        #2980B9;   /* Blue — Medium risk, In Progress, info badges */
--color-background:  #F4F6F9;   /* Page background */
--color-card:        #FFFFFF;   /* Card / panel background */
--color-border:      #DDE3EC;   /* Subtle borders */
--color-text-primary:#1C2B3A;   /* Body text */
--color-text-muted:  #6B7C93;   /* Labels, secondary text */
--color-sidebar-bg:  #12284A;   /* Sidebar dark navy */
--color-sidebar-text:#B8C8DC;   /* Sidebar link text */
--color-sidebar-active-bg: #1A3E6E; /* Active sidebar item */
--color-sidebar-active-text: #FFFFFF;
--color-topnav-bg:   #FFFFFF;   /* Top nav */
```

### 1.2 Typography

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-size-base: 14px;
font-size-sm:   12px;
font-size-lg:   16px;
font-size-h1:   24px;
font-size-h2:   20px;
font-size-h3:   18px;
font-size-h4:   16px;
font-weight-normal: 400;
font-weight-medium: 500;
font-weight-semibold: 600;
font-weight-bold: 700;
line-height: 1.5;
```

### 1.3 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
```

### 1.4 Elevation / Shadow

```css
--shadow-card:  0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-panel: 0 4px 16px rgba(0,0,0,0.12);
--shadow-modal: 0 8px 32px rgba(0,0,0,0.18);
--radius-sm:    4px;
--radius-md:    8px;
--radius-lg:    12px;
```

---

## 2. Global Shell Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOP NAV BAR (height: 56px, bg: #FFFFFF, border-bottom: #DDE3EC)    │
│  [☰ GRC-NEXUS logo]  Ministry of Finance — Zimbabwe        [🔔] [TM] │
└─────────────────────────────────────────────────────────────────────┘
┌──────────────────┬──────────────────────────────────────────────────┐
│  LEFT SIDEBAR    │  MAIN CONTENT AREA                               │
│  (width: 240px)  │  (flex-1, padding: 24px, bg: #F4F6F9)           │
│  bg: #12284A     │                                                  │
│                  │  [Breadcrumb]                                    │
│  [🏠] Dashboard  │  [Page Title]                                    │
│  [📊] Strategic  │                                                  │
│  [⚠] Risk Mgmt  │  [Content varies per module]                     │
│  [👥] Board Gov  │                                                  │
│  [✅] Compliance │                                                  │
│  [🚨] Incidents  │                                                  │
│  [🔍] Int Audit  │                                                  │
│  [🏢] Vendor     │                                                  │
│  [📈] Reports    │                                                  │
│                  │                                                  │
│  ─────────────   │                                                  │
│  v2.1 GRC-Nexus  │                                                  │
└──────────────────┴──────────────────────────────────────────────────┘
```

**Top Nav Elements:**
- Left: hamburger toggle (mobile), "GRC-NEXUS" text logo in primary blue
- Center: Institution name "Ministry of Finance — Zimbabwe" in text-muted
- Right: notification bell icon, user avatar circle "TM" with "Tendai M." label

**Sidebar Behavior:**
- Fixed left, full height, dark navy background
- Module icons (Unicode/emoji) + text label
- Active item: left border accent gold, bg primary blue, text white
- Hover: slight bg lightening, text white

---

## 3. Component Library

### 3.1 Stat Card

```
┌─────────────────────────┐
│  [ICON]                 │
│  23                     │  ← large number, 32px, semibold
│  Open Risks             │  ← label, 12px, text-muted
│  ▲ 3 from last month    │  ← trend, 11px, danger/success
└─────────────────────────┘
Width: ~200px, padding: 20px, radius: 8px, shadow: card
```

### 3.2 Data Table

```
┌──────────┬─────────────────────────┬──────────┬──────────┐
│ ID ↕     │ Description ↕           │ Owner ↕  │ Status   │
├──────────┼─────────────────────────┼──────────┼──────────┤
│ RISK-001 │ Cybersecurity breach... │ IT Dept  │ [BADGE]  │
│ RISK-002 │ Budget overrun...       │ Finance  │ [BADGE]  │
└──────────┴─────────────────────────┴──────────┴──────────┘
```
- Header: bg #F4F6F9, text-primary, semibold, ↕ icon on sortable columns
- Row hover: bg #EEF2F8
- Click: opens detail panel or expands row
- Striped: every other row bg #FAFBFC

### 3.3 Status Badge

```css
/* Sizes: padding 2px 8px, border-radius: 12px, font-size: 11px, font-weight: 600 */
.badge-critical  { bg: #FCE8E8; color: #C0392B; }
.badge-high      { bg: #FDF2E5; color: #E67E22; }
.badge-medium    { bg: #EAF4FD; color: #2980B9; }
.badge-low       { bg: #EAFAF0; color: #27AE60; }
.badge-compliant { bg: #EAFAF0; color: #27AE60; }
.badge-duesoon   { bg: #FDF2E5; color: #E67E22; }
.badge-noncompliant { bg: #FCE8E8; color: #C0392B; }
.badge-scheduled { bg: #EAF4FD; color: #2980B9; }
.badge-completed { bg: #EAFAF0; color: #27AE60; }
.badge-draft     { bg: #F4F6F9; color: #6B7C93; }
.badge-ontrack   { bg: #EAFAF0; color: #27AE60; }
.badge-atrisk    { bg: #FDF2E5; color: #E67E22; }
.badge-offtrack  { bg: #FCE8E8; color: #C0392B; }
```

### 3.4 Risk Heatmap (5×5 SVG Grid)

```
    Impact →
  1   2   3   4   5
5 ·   ·   ·   ●   ●   ← Likelihood
4 ·   ·   ●   ●   ●
3 ·   ·   ●   ●   ·
2 ·   ●   ·   ·   ·
1 ·   ·   ·   ·   ·
```
- Grid cells coloured: Low (L×I ≤4, green), Medium (5-9, amber), High (10-15, orange), Critical (≥16, red)
- Risk dots: white circle with risk ID text, on-hover tooltip shows risk title
- SVG viewBox: 0 0 300 300, cells 50×50px

### 3.5 Progress Bar (KPI)

```
Target: 80%
Actual: [████████░░░░░░] 68%
```
- Track: bg #DDE3EC, height 8px, radius 4px
- Fill: green if actual ≥ target, amber if within 10%, red if >10% below

### 3.6 Tabs Component

```
[Active Tab]  [Inactive Tab]  [Inactive Tab]
─────────────────────────────────────────────
  Tab content area
```
- Active: bottom border 2px solid primary, text primary, semibold
- Inactive: text-muted, hover text-primary

### 3.7 Right-Side Detail Panel

```
                        ┌──────────────────────────┐
                        │  [×] Close               │
                        │  Panel Title             │
                        │  ─────────────────────   │
                        │  Content...              │
                        │                          │
                        └──────────────────────────┘
```
- Fixed right panel, width 380px, bg white, shadow-panel
- Overlay: semi-transparent bg over main content

### 3.8 Breadcrumb

```
Home  >  [Module Name]  >  [Optional sub-page]
```
- Font-size: 12px, text-muted
- Links: text-muted with hover underline; current page: text-primary

---

## 4. Module Page Blueprints

### 4.1 Executive Dashboard (index.html)

```
[Breadcrumb: Dashboard]
[Page Title: Executive Overview]

[Stat Card ×4 in a row]
Open Risks | Overdue Compliance | Board Actions | KPI Attainment

[2-column row]
Left: Risk Heatmap 5×5 SVG      Right: Compliance Posture Bar Chart

[Recent Activity Feed]
5 timestamped items with type icon
```

### 4.2 Strategic Planning

```
[Breadcrumb: Home > Strategic Planning]
[Page Title: Strategic Objectives — NDS2 Alignment]
[Filter bar: Pillar dropdown | Status dropdown]

[Hierarchical Table: expandable rows]
Pillar header row → Goal sub-row → Output leaf row
Each row: code | description | owner | target | actual | progress bar | badge

[Right Panel (on click)]: KPI Detail
  - Objective details
  - Sparkline trend SVG (4 quarters)
  - Owner + review date
```

### 4.3 Risk Register

```
[Breadcrumb: Home > Risk Management]
[Page Title: Enterprise Risk Register]
[Action bar: Add Risk | Export]

[5×5 Heatmap SVG — full width card]
[Risk Register Table — 10 rows]
  Risk ID | Title | Category | Inherent Score | Residual Score | Owner | Status | Due

[Floating Detail Panel (on row click)]:
  Risk details + 3 treatment actions
```

### 4.4 Board Governance

```
[Breadcrumb: Home > Board Governance]
[Page Title: Board & Committee Management]
[Tabs: Meetings | Action Tracker]

[Meetings Tab]:
  Meeting list (date | type | status badge | [View] button)
  On click: expand inline detail (agenda | documents | resolutions)

[Action Tracker Tab]:
  Actions table: description | assigned | due date | status badge
```

### 4.5 Compliance

```
[Breadcrumb: Home > Compliance]
[Page Title: Compliance & Policy Management]
[Tabs: Statutory Obligations | Policy Library]

[Obligations Tab]:
  SVG donut chart + legend (top right)
  Table: Act | Obligation | Due Date | Evidence | Status

[Policy Tab]:
  Table: Title | Category | Version | Last Reviewed | Next Review | Status
  On click: lifecycle stage indicator strip
```

### 4.6 Incidents

```
[Breadcrumb: Home > Incidents]
[Page Title: Incident & Whistleblower Management]
[Action bar: Submit New Report (button opens form)]

[Case List Table]:
  Case ID | Type | Received | Severity | Status | Confidential (lock icon)

[Submit Form (toggle/modal)]:
  Type | Description | Date | Severity | Contact preference | Submit

[Detail Panel (on row click)]:
  Case info + 3-step timeline + Investigator
```

### 4.7 Internal Audit

```
[Breadcrumb: Home > Internal Audit]
[Page Title: Internal Audit Management]
[Tabs: Audit Universe | Annual Plan | Findings]

[Universe Tab]: 8 auditable areas with priority rating
[Plan Tab]: CSS/SVG Gantt strip — 6 audits × 12 months
[Findings Tab]:
  Summary counts (Total | Open | Overdue | Closed)
  Findings table: 12 rows
  On click: detail pane with management response
```

### 4.8 Vendor Risk

```
[Breadcrumb: Home > Vendor Risk]
[Page Title: Vendor & Third-Party Risk]
[Risk Tier Bar: Critical N | High N | Medium N | Low N]

[Supplier Table]: 10 rows
  Name | Category | Contract Value | Onboarding Status | Risk Tier | Last Assessment | Next Review

[Detail Panel (on row click)]:
  5 compliance checks | 3 contract obligations | Risk score
```

### 4.9 Reports

```
[Breadcrumb: Home > Reports]
[Page Title: Reporting & Decision Intelligence]

[6 KPI Metric Cards in 2-row grid]

[Cross-Module Analytics SVG Bar Chart]
  3 institutions × 3 metrics (Risk Health / Compliance / Audit)

[Statutory Report Generator]
  Select report type | Date range | [Generate Preview]
  Preview panel: toggled dummy report content
```

---

## 5. Navigation Flow Diagram

```
index.html (Dashboard)
│
├──→ strategic-planning.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ risk-register.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ board-management.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ compliance.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ incidents.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ internal-audit.html
│       └──→ [back to Dashboard via sidebar]
│
├──→ vendor-risk.html
│       └──→ [back to Dashboard via sidebar]
│
└──→ reports.html
        └──→ [back to Dashboard via sidebar]

All pages cross-link via the sidebar (all 9 nav items always visible).
No page requires another page to be visited first.
```

---

## 6. Responsive Behaviour (Prototype Scope)

The prototype targets **desktop only** (min-width 1024px). No mobile breakpoints are required. The sidebar is always visible at full width.
