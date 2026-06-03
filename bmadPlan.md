# GRC-Nexus HTML Prototype — BMAD Execution Plan

**Goal:** Functional multi-page HTML prototype of the GRC-Nexus eGovernance Platform with dummy data, working navigation, and all 8 core modules represented.  
**Approach:** Pure HTML/CSS/Vanilla JS — no build tool, no backend. Runs by opening `index.html` in a browser.  
**Source:** `whitepaper.md` (GRC-Nexus v2.1 Core Guideline)

---

## Skill Execution Sequence

```
 1. bmad-prd
 2. bmad-create-ux-design
 3. bmad-create-epics-and-stories
 4. bmad-quick-dev  ×8  (one per module + shell)
 5. bmad-code-review
```

---

## SKILL 1 — `bmad-prd`

### Purpose
Translate the whitepaper into a scoped PRD whose acceptance criteria are tight enough to constrain the prototype (no feature creep beyond what is visible in HTML).

### Instruction to Give
> "Create a PRD for the GRC-Nexus eGovernance Platform HTML prototype. Source document is `whitepaper.md`. Scope is strictly a **functional prototype using static HTML, CSS, and vanilla JS with dummy data** — no real backend, no authentication system, no build pipeline. The PRD must cover all 8 modules listed in Section 4 of the whitepaper. Each module must have: (a) a list of key screens/views, (b) the dummy data entities needed per screen, and (c) acceptance criteria written from a prototype-reviewer perspective (i.e., 'the page renders', 'clicking X navigates to Y', 'the risk heatmap is visible'). Include a clear navigation model showing how a user moves between modules. Output to `_bmad-output/planning-artifacts/prd-grc-nexus-prototype.md`."

### Expected Output
- `_bmad-output/planning-artifacts/prd-grc-nexus-prototype.md`
- Contents: Executive summary (prototype scope), 8 module feature lists, screen inventory (~30 screens), dummy data schema per module, navigation map, acceptance criteria table.

### Handover to Next Skill
Pass `prd-grc-nexus-prototype.md` as primary context to **SKILL 2** (`bmad-create-ux-design`). Tell the UX skill: "Use this PRD as input. Do not add screens beyond those listed."

---

## SKILL 2 — `bmad-create-ux-design`

### Purpose
Define the visual language, layout system, navigation chrome, and per-module page blueprints before any HTML is written. This prevents rework by locking design decisions.

### Instruction to Give
> "Create UX design specifications for the GRC-Nexus HTML prototype. Input: `_bmad-output/planning-artifacts/prd-grc-nexus-prototype.md`. Design for a **public-sector governance web application** — use authoritative, neutral tones. Specify: (1) Global shell: top nav bar with institution branding, user avatar, notification icon, and left sidebar with module icons and labels. (2) Color palette: primary blue `#1A3E6E`, accent gold `#C9A84C`, danger red `#C0392B`, success green `#27AE60`, background `#F4F6F9`, card white `#FFFFFF`. (3) Typography: Inter or system-sans, 14px base, 18px section headers. (4) Component library: stat card, data table with sortable columns, status badge (risk level / compliance state), risk heatmap grid (5×5), timeline/gantt strip, KPI progress bar. (5) Per-module page layout blueprint for all 8 modules. (6) Navigation flow diagram (text-based is fine). Output to `_bmad-output/planning-artifacts/ux-spec-grc-nexus-prototype.md`."

### Expected Output
- `_bmad-output/planning-artifacts/ux-spec-grc-nexus-prototype.md`
- Contents: Color/type tokens, component sketches (ASCII/text), global shell layout, 8 × module page blueprints, navigation flow.

### Handover to Next Skill
Pass both `prd-grc-nexus-prototype.md` and `ux-spec-grc-nexus-prototype.md` as inputs to **SKILL 3** (`bmad-create-epics-and-stories`).

---

## SKILL 3 — `bmad-create-epics-and-stories`

### Purpose
Break the prototype into discrete, buildable stories — one per HTML file/view — so each `bmad-quick-dev` invocation has a single, scoped deliverable.

### Instruction to Give
> "Create epics and stories for the GRC-Nexus HTML prototype. Inputs: `prd-grc-nexus-prototype.md` and `ux-spec-grc-nexus-prototype.md`. Organise stories into **8 epics** matching the 8 platform modules. Each story represents **one HTML page or one significant UI component** (e.g., risk heatmap widget). Each story must include: (a) file to create (e.g., `grc-nexus/risk-register.html`), (b) dummy data entities to embed (e.g., 5 sample risks with all fields), (c) navigation links to/from this page, (d) Given/When/Then acceptance criteria, (e) UI components required from the UX spec. Add a 9th epic for the global shell and `index.html` dashboard. Output to `_bmad-output/planning-artifacts/epics-grc-nexus-prototype.md`."

### Expected Output
- `_bmad-output/planning-artifacts/epics-grc-nexus-prototype.md`
- 9 epics, ~28–35 stories, each fully specified and independently buildable.

### Handover to Next Skill
Feed individual story blocks into **SKILL 4** (`bmad-quick-dev`), one story per invocation, starting with **Epic 9** (the global shell) so all other pages can inherit the nav chrome.

---

## SKILL 4A — `bmad-quick-dev` — Epic 9: Global Shell + Dashboard (`index.html`)

### Purpose
Build the shared navigation chrome, CSS design system, and the Executive Dashboard landing page. All subsequent pages will copy/link the shared CSS and replicate the nav structure.

### Instruction to Give
> "Implement the global shell and executive dashboard for the GRC-Nexus HTML prototype. Deliverable: `grc-nexus/index.html` plus `grc-nexus/assets/styles.css` and `grc-nexus/assets/app.js`. Requirements: (1) Top nav: GRC-Nexus logo (text), institution name 'Ministry of Finance — Zimbabwe', notification bell, user avatar 'Tendai M. (Risk Officer)'. (2) Left sidebar: icons + labels for all 8 modules (Strategic Planning, Risk Management, Board Governance, Compliance, Incidents, Internal Audit, Vendor Risk, Reports), active state highlight. (3) Dashboard main area: 4 stat cards (Open Risks: 23, Overdue Compliance: 7, Board Actions Pending: 12, KPI Attainment: 68%), one 5×5 risk heatmap SVG with 6 plotted risks, one compliance posture bar chart (3 categories), one recent-activity feed (5 items). (4) Clicking any sidebar item navigates to the correct module HTML file. Use the color tokens and typography from `ux-spec-grc-nexus-prototype.md`. All dummy data is hardcoded."

### Expected Output
- `grc-nexus/index.html` — fully functional executive dashboard
- `grc-nexus/assets/styles.css` — complete design system tokens and component classes
- `grc-nexus/assets/app.js` — sidebar toggle, active link state, any micro-interactions

### Handover
All remaining `bmad-quick-dev` runs import `../assets/styles.css` and replicate the nav chrome. Hand off epic-by-epic.

---

## SKILL 4B — `bmad-quick-dev` — Epic 1: Strategic Planning Module

### Purpose
Screens: Strategic Objectives list, KPI Detail view with progress tracking.

### Instruction to Give
> "Build `grc-nexus/strategic-planning.html`. It must: (1) use the shared shell from index.html (copy nav chrome), (2) show a hierarchical table of NDS2 pillars → institutional goals → annual outputs with dummy data for 3 pillars / 6 goals / 12 outputs, (3) each row has: objective code, description, owner, target, actual, progress bar, status badge (On Track / At Risk / Off Track), (4) a top filter bar for pillar and status, (5) clicking a KPI row opens a right-side panel with a sparkline trend (last 4 quarters) using inline SVG, (6) breadcrumb: Home > Strategic Planning, (7) 'New Objective' button (non-functional, just present). All dummy data hardcoded."

### Expected Output
- `grc-nexus/strategic-planning.html`

---

## SKILL 4C — `bmad-quick-dev` — Epic 2: Enterprise Risk Management

### Purpose
Screens: Risk Register table, Risk Heatmap full-page, Risk Detail panel.

### Instruction to Give
> "Build `grc-nexus/risk-register.html`. Must include: (1) shared nav chrome, (2) risk register table with 10 dummy risks (ID, title, category, linked objective, inherent likelihood 1-5, inherent impact 1-5, residual L×I, risk owner, treatment status, due date), (3) sortable columns, (4) status badge using risk score thresholds (Critical ≥16, High ≥10, Medium ≥5, Low <5) with matching background colours from the design system, (5) a full 5×5 heatmap SVG above the table where each plotted dot is labelled with risk ID and on-hover shows risk title, (6) a floating detail panel on row click showing treatment actions (3 dummy actions each with due date and responsible person), (7) 'Add Risk' and 'Export' buttons (non-functional). All dummy data hardcoded."

### Expected Output
- `grc-nexus/risk-register.html`

---

## SKILL 4D — `bmad-quick-dev` — Epic 3: Board Management Module

### Purpose
Screens: Board Meeting list, Meeting Detail with agenda and resolutions, Board Action Tracker.

### Instruction to Give
> "Build `grc-nexus/board-management.html`. Must include: (1) shared nav chrome, (2) upcoming and past meetings list (4 dummy meetings with date, type, status: Scheduled/Completed/Draft), (3) clicking a meeting opens a detail section showing: agenda items (5 items), attached documents list (3 dummy files, non-downloadable), resolutions table (3 resolutions with responsible, due, status), (4) a separate 'Action Tracker' tab with 8 dummy board actions (description, assigned to, due date, status), (5) status badges, (6) breadcrumb: Home > Board Management. All dummy data hardcoded."

### Expected Output
- `grc-nexus/board-management.html`

---

## SKILL 4E — `bmad-quick-dev` — Epic 4: Compliance & Policy Module

### Purpose
Screens: Compliance Obligations register, Policy Library with lifecycle status.

### Instruction to Give
> "Build `grc-nexus/compliance.html`. Must include: (1) shared nav chrome, (2) tabbed layout: tab 1 = Statutory Obligations, tab 2 = Policy Library, (3) Obligations tab: table of 10 dummy obligations (Act/Regulation, obligation description, due date, evidence required, status badge: Compliant/Non-Compliant/Due Soon), a summary donut chart (SVG) showing 60% compliant / 25% due soon / 15% non-compliant, (4) Policy tab: table of 8 dummy policies (title, category, version, last reviewed, next review, status: Active/Under Review/Expired), clicking a row shows a detail pane with lifecycle stage indicator (Draft → Review → Approved → Published → Archived), (5) 'Submit Attestation' and 'Add Obligation' buttons (non-functional). All dummy data hardcoded."

### Expected Output
- `grc-nexus/compliance.html`

---

## SKILL 4F — `bmad-quick-dev` — Epic 5: Incident & Whistleblower Module

### Purpose
Screens: Incident case list, Intake form, Case detail with investigation timeline.

### Instruction to Give
> "Build `grc-nexus/incidents.html`. Must include: (1) shared nav chrome, (2) case list table with 8 dummy cases (case ID, type: Incident/Whistleblower/Complaint, received date, severity, status: New/Investigating/Closed/Escalated, confidentiality flag), (3) a 'Submit New Report' form (all fields present, form submission logs to console only — no real backend), (4) clicking a case row opens a detail panel with: case description, timeline of investigation steps (3 steps with dates), assigned investigator, current status, and confidentiality level indicator, (5) high-severity and whistleblower rows have a lock icon to indicate restricted access. All dummy data hardcoded."

### Expected Output
- `grc-nexus/incidents.html`

---

## SKILL 4G — `bmad-quick-dev` — Epic 6: Internal Audit Module

### Purpose
Screens: Audit universe, Annual plan, Finding management.

### Instruction to Give
> "Build `grc-nexus/internal-audit.html`. Must include: (1) shared nav chrome, (2) three-tab layout: Audit Universe, Annual Plan, Findings, (3) Universe tab: list of 8 auditable areas with risk-based priority rating, (4) Annual Plan tab: Gantt-style strip (inline SVG or CSS grid) for 6 audits across 12 months with status (Planned/In Progress/Complete), (5) Findings tab: table of 12 dummy findings (ID, audit name, finding title, risk rating: Critical/High/Medium/Low, root cause, remediation owner, due date, status: Open/Overdue/Closed), summary counts at the top (Total: 12, Open: 7, Overdue: 3, Closed: 2), (6) clicking a finding shows a detail pane with management response and remediation action. All dummy data hardcoded."

### Expected Output
- `grc-nexus/internal-audit.html`

---

## SKILL 4H — `bmad-quick-dev` — Epic 7: Vendor & Third-Party Risk

### Purpose
Screens: Supplier list, Supplier risk profile, Contract obligations.

### Instruction to Give
> "Build `grc-nexus/vendor-risk.html`. Must include: (1) shared nav chrome, (2) supplier list table with 10 dummy suppliers (name, category, contract value USD, onboarding status, risk tier: Critical/High/Medium/Low, last assessment date, next review), (3) a risk tier summary bar (count per tier), (4) clicking a supplier opens a detail pane with: compliance checks (5 checkboxes with pass/fail state), 3 contract obligations with due dates, overall risk score and trend, (5) 'Add Supplier' and 'Run Assessment' buttons (non-functional). All dummy data hardcoded."

### Expected Output
- `grc-nexus/vendor-risk.html`

---

## SKILL 4I — `bmad-quick-dev` — Epic 8: Reporting & Decision Intelligence

### Purpose
Screens: Executive dashboard detail, cross-module analytics, statutory report generator.

### Instruction to Give
> "Build `grc-nexus/reports.html`. Must include: (1) shared nav chrome, (2) three panels: (a) Platform KPI Summary — 6 metric cards (strategy attainment %, open risk count trend, compliance rate %, audit finding closure rate %, incident resolution time avg, board action completion rate), (b) Cross-Module Analytics — a horizontal grouped bar chart (SVG) comparing Risk / Compliance / Audit health per 3 dummy institutions, (c) Statutory Report Generator — a form listing 4 report types (CGU Quarterly, Board Performance, Risk Dashboard, Compliance Register) with a date range picker and 'Generate Preview' button that toggles a dummy report preview section, (3) all data is hardcoded dummy values. SVG charts use inline SVG only — no external chart libraries."

### Expected Output
- `grc-nexus/reports.html`

---

## SKILL 5 — `bmad-code-review`

### Purpose
Validate all 9 HTML files for: broken navigation links, missing dummy data, visual consistency with the UX spec, and any JavaScript errors.

### Instruction to Give
> "Review all files in `grc-nexus/` for the GRC-Nexus HTML prototype. Check: (1) every sidebar navigation link resolves to an existing file, (2) all 8 module pages load without JS console errors, (3) dummy data is present and renders on all tables and charts, (4) CSS class names are consistent with `assets/styles.css`, (5) no external HTTP requests (all resources are local), (6) breadcrumbs are accurate on each page, (7) status badges use correct colour tokens. Report findings as: PASS, WARN, or FAIL with file and line reference. Output to `_bmad-output/implementation-artifacts/code-review-grc-nexus-prototype.md`."

### Expected Output
- `_bmad-output/implementation-artifacts/code-review-grc-nexus-prototype.md`
- A structured findings table with severity, file, issue, and recommendation columns.

### Handover
Any FAIL or WARN items are fed back into `bmad-quick-dev` as targeted fix requests, one file at a time.

---

## Execution Sequence Summary

| Step | Skill | Input | Output | Gate |
|------|-------|-------|--------|------|
| 1 | `bmad-prd` | `whitepaper.md` | `prd-grc-nexus-prototype.md` | Review PRD before continuing |
| 2 | `bmad-create-ux-design` | PRD | `ux-spec-grc-nexus-prototype.md` | Approve palette & component list |
| 3 | `bmad-create-epics-and-stories` | PRD + UX spec | `epics-grc-nexus-prototype.md` | Confirm story list & file paths |
| 4A | `bmad-quick-dev` | Epics + UX spec | `index.html`, `styles.css`, `app.js` | Open in browser; nav works |
| 4B | `bmad-quick-dev` | Epic 1 story | `strategic-planning.html` | Visual check |
| 4C | `bmad-quick-dev` | Epic 2 story | `risk-register.html` | Heatmap renders |
| 4D | `bmad-quick-dev` | Epic 3 story | `board-management.html` | Visual check |
| 4E | `bmad-quick-dev` | Epic 4 story | `compliance.html` | Tabs work |
| 4F | `bmad-quick-dev` | Epic 5 story | `incidents.html` | Form present |
| 4G | `bmad-quick-dev` | Epic 6 story | `internal-audit.html` | Gantt visible |
| 4H | `bmad-quick-dev` | Epic 7 story | `vendor-risk.html` | Visual check |
| 4I | `bmad-quick-dev` | Epic 8 story | `reports.html` | Charts render |
| 5 | `bmad-code-review` | All `grc-nexus/*.html` | `code-review-grc-nexus-prototype.md` | All FAIL items fixed |

---

## Final Deliverable Structure

```
grc-nexus/
├── index.html                  ← Executive Dashboard (landing page)
├── strategic-planning.html     ← Module 1
├── risk-register.html          ← Module 2
├── board-management.html       ← Module 3
├── compliance.html             ← Module 4
├── incidents.html              ← Module 5
├── internal-audit.html         ← Module 6
├── vendor-risk.html            ← Module 7
├── reports.html                ← Module 8
└── assets/
    ├── styles.css              ← Design system (tokens, components)
    └── app.js                  ← Shared interactions
```

**To run:** `Open grc-nexus/index.html in any modern browser — no server required.`

---

## How to Start

Invoke the first skill now:

```
bmad-prd
```

Then follow the gate-by-gate sequence above. Each skill is self-contained; if one session ends, simply tell the next AI session which step you are on and hand it the relevant artifact files listed in the Input column above.
