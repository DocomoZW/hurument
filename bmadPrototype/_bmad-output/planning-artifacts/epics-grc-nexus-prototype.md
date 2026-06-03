# Epics & Stories: GRC-Nexus HTML Prototype

**Version:** 1.0 | **Date:** 2026-05-22  
**Total Epics:** 9 | **Total Stories:** 30

---

## Epic 9: Global Shell + Executive Dashboard *(Build First)*

**Goal:** Provide shared nav chrome, CSS design system, and landing dashboard page.

### Story 9.1 — Global CSS Design System
- **File:** `grc-nexus/assets/styles.css`
- **Dummy data:** None (tokens only)
- **Navigation:** N/A
- **AC:** All colour tokens, typography, badge classes, card, table, sidebar, topnav, and button styles present; no external CSS imports

### Story 9.2 — Shared JavaScript
- **File:** `grc-nexus/assets/app.js`
- **Dummy data:** None
- **Navigation:** N/A
- **AC:** Sidebar active-link detection by current `location.pathname`; detail panel open/close; tab switching; sort-by-column for tables; all functions reusable across pages

### Story 9.3 — Executive Dashboard
- **File:** `grc-nexus/index.html`
- **Dummy data:** Open Risks 23, Overdue Compliance 7, Board Actions 12, KPI Attainment 68%; 6 heatmap dots; compliance bar chart 3 segments; 5 activity items
- **Navigation links:** All 8 sidebar module links → correct HTML files
- **AC:**
  - Given user opens index.html, then 4 stat cards render with correct values
  - Given user looks at heatmap, then SVG 5×5 grid is visible with 6 plotted risks
  - Given user clicks sidebar link, then page navigates to correct module HTML
  - Given user looks at activity feed, then 5 items are visible with timestamps

---

## Epic 1: Strategic Planning Module

### Story 1.1 — Strategic Objectives List
- **File:** `grc-nexus/strategic-planning.html`
- **Dummy data:** 3 NDS2 pillars; 6 goals; 12 outputs; each with code, description, owner, target, actual, status
- **Nav links:** sidebar active on "Strategic Planning"; breadcrumb "Home > Strategic Planning"
- **Components:** filter bar, hierarchical table, progress bars, status badges
- **AC:**
  - Given page loads, then table shows 3 pillar groups with 2 goals and 4 outputs each
  - Given user selects a pillar filter, then table filters to matching rows
  - Given user clicks an output row, then KPI detail right-panel slides in
  - Given user sees a row, then progress bar fill matches actual/target ratio
  - Given status is "On Track", badge is green; "At Risk" is amber; "Off Track" is red

---

## Epic 2: Enterprise Risk Management

### Story 2.1 — Risk Register + Heatmap
- **File:** `grc-nexus/risk-register.html`
- **Dummy data:** 10 risks (full schema); 6 heatmap coordinates; 3 treatment actions per risk
- **Nav links:** sidebar active "Risk Management"
- **Components:** 5×5 SVG heatmap, sortable data table, floating detail panel
- **AC:**
  - Given page loads, then heatmap SVG renders above table
  - Given user hovers a heatmap dot, then tooltip shows risk title
  - Given user clicks a column header, then rows re-sort by that column
  - Given user clicks a table row, then floating panel shows risk details and 3 treatment actions
  - Critical (≥16) badge is dark red; High (10-15) red; Medium (5-9) amber; Low (<5) green

---

## Epic 3: Board Governance

### Story 3.1 — Board Meeting Management
- **File:** `grc-nexus/board-management.html`
- **Dummy data:** 4 meetings; 5 agenda items each; 3 documents each; 3 resolutions each; 8 board actions
- **Nav links:** sidebar active "Board Governance"; tabs: Meetings / Action Tracker
- **Components:** meeting list, inline expand detail, tabs, action table
- **AC:**
  - Given page loads, then meeting list shows 4 rows with status badges
  - Given user clicks a meeting row, then detail section expands with agenda, documents, resolutions
  - Given user clicks "Action Tracker" tab, then actions table shows 8 rows
  - Given an action is overdue, then due date shows in danger colour

---

## Epic 4: Compliance & Policy

### Story 4.1 — Compliance Management
- **File:** `grc-nexus/compliance.html`
- **Dummy data:** 10 obligations; donut chart (60/25/15); 8 policies; lifecycle stages
- **Nav links:** sidebar active "Compliance"; tabs: Statutory Obligations / Policy Library
- **Components:** tabs, SVG donut chart, obligations table, policy table, lifecycle indicator
- **AC:**
  - Given page loads on Obligations tab, then donut chart SVG and table both render
  - Given user clicks Policy Library tab, then 8-row policy table shows
  - Given user clicks a policy row, then lifecycle indicator shows current stage highlighted
  - Given an obligation is "Non-Compliant", then badge is red; "Due Soon" amber; "Compliant" green

---

## Epic 5: Incident & Whistleblower

### Story 5.1 — Incident Case Management
- **File:** `grc-nexus/incidents.html`
- **Dummy data:** 8 cases; 3 timeline steps per case; assigned investigators
- **Nav links:** sidebar active "Incidents"
- **Components:** case table, form, detail panel, lock icons, timeline
- **AC:**
  - Given page loads, then case list table shows 8 rows
  - Given a case is Whistleblower type, then row shows lock icon
  - Given user clicks "Submit New Report", then form is visible
  - Given user submits form, then console.log fires and form clears
  - Given user clicks a case row, then detail panel shows 3-step timeline

---

## Epic 6: Internal Audit

### Story 6.1 — Audit Management
- **File:** `grc-nexus/internal-audit.html`
- **Dummy data:** 8 auditable areas; 6 audit plans; 12 findings; management responses
- **Nav links:** sidebar active "Internal Audit"; tabs: Audit Universe / Annual Plan / Findings
- **Components:** 3-tab layout, priority badges, SVG/CSS Gantt, findings table with summary counts
- **AC:**
  - Given user is on Universe tab, then 8 areas show with priority badges
  - Given user clicks Annual Plan tab, then Gantt strip renders 6 audits across 12 months
  - Given user clicks Findings tab, then summary count bar shows (12/7/3/2) and table has 12 rows
  - Given user clicks a finding, then management response pane appears

---

## Epic 7: Vendor & Third-Party Risk

### Story 7.1 — Vendor Risk Management
- **File:** `grc-nexus/vendor-risk.html`
- **Dummy data:** 10 suppliers (full schema); 5 compliance checks per supplier; 3 contract obligations per supplier; risk scores
- **Nav links:** sidebar active "Vendor Risk"
- **Components:** tier summary bar, supplier table, detail panel with checkboxes
- **AC:**
  - Given page loads, then risk tier summary bar shows counts (Critical/High/Medium/Low)
  - Given supplier table shows 10 rows, each row has a risk tier badge
  - Given user clicks a supplier, then detail panel shows 5 compliance checkboxes (pass/fail state)
  - Given panel is open, then 3 contract obligations and risk score are visible

---

## Epic 8: Reports & Decision Intelligence

### Story 8.1 — Reporting Dashboard
- **File:** `grc-nexus/reports.html`
- **Dummy data:** 6 KPI metrics; 3 institutions × 3 analytics dimensions; 4 report types
- **Nav links:** sidebar active "Reports"
- **Components:** 6 metric cards, SVG grouped bar chart, report generator form, preview toggle
- **AC:**
  - Given page loads, then 6 metric cards render with hardcoded values
  - Given user looks at analytics section, then SVG grouped bar chart renders for 3 institutions
  - Given user clicks "Generate Preview", then preview section toggles visible
  - All chart elements are inline SVG — no external libraries

---

## Story Dependency Map

```
Story 9.1 (styles.css) ──→ all other stories depend on it
Story 9.2 (app.js)     ──→ all other stories depend on it
Story 9.3 (index.html) ──→ no dependencies on module pages
Stories 1.1 – 8.1      ──→ depend on 9.1 + 9.2; independent of each other
```

**Build order:** 9.1 → 9.2 → 9.3 → (1.1 through 8.1 in any order)
