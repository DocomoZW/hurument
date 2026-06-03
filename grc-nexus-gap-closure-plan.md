# GRC-Nexus Gap Closure Plan — Mobile + PDF Reporting
**Created:** 2026-06-03  
**Agent:** Clawdy ⚡  
**Target:** Close the two largest remaining gaps in the GRC-Nexus production app

---

## Executive Summary

This plan closes the two highest-impact gaps identified in the GRC-Nexus evaluation:

| Gap | PRD Phase | Current | Target | Effort |
|-----|-----------|---------|--------|--------|
| **React Native Mobile App** | Phase 2 (Months 3–5) | Nothing exists | Board member iOS/Android app with offline meeting packs, annotations, biometric MFA | ~4–6 weeks |
| **PDF Report Generation** | Phase 3 (Months 5–8) | 1 basic governance summary | 20 statutory report templates, auto-generation, scheduled distribution | ~3–4 weeks |

**Total estimated effort:** 7–10 weeks of focused development. Can be parallelized (mobile and PDF are independent workstreams).

---

## Part A: PDF Report Generation (RPT-001 through RPT-020)

### A1. Current State

**Existing:**
- `pdf-lib@^1.17.1` installed
- `lib/reporting/pdf.ts` — basic `buildGovernanceSummaryPdf()` function (landscape A4, Helvetica, simple text layout)
- `app/api/reports/governance/route.ts` — CSV governance data export (not PDF)
- `app/(protected)/dashboard/ExportGovernanceReportButton.tsx` — downloads `.pdf` from governance API but likely receives CSV

**Missing:**
- 19 of 20 statutory report templates
- Branded corporate styling (Navy/Gold headers, institution logo, watermarks)
- Scheduled/auto-generation (cron + email distribution)
- Multi-page layouts, tables, charts embedded as images
- Table of contents, page numbering, appendices
- Cross-module data aggregation for composite reports

### A2. Report Inventory (from PRD §21 + Acceptance Criteria)

| ID | Report Name | Module | Priority | Complexity | Pages |
|----|-------------|--------|----------|------------|-------|
| RPT-001 | Executive Governance Summary | Cross-module | P0 | Low | 2–4 |
| RPT-002 | Risk Register Summary | Risk | P0 | Medium | 5–10 |
| RPT-003 | Risk Heatmap (visual) | Risk | P0 | High | 1–2 |
| RPT-004 | Top 10 Risks Briefing | Risk | P0 | Low | 2–3 |
| RPT-005 | Compliance Obligations Status | Compliance | P0 | Medium | 3–5 |
| RPT-006 | Policy Acknowledgment Summary | Compliance | P1 | Low | 2–3 |
| RPT-007 | Board Meeting Pack | Board | P0 | **Critical** | 50–300 |
| RPT-008 | Board Minutes (formal) | Board | P0 | Medium | 5–20 |
| RPT-009 | Board Action Tracker | Board | P0 | Low | 2–4 |
| RPT-010 | Audit Findings Register | Audit | P1 | Medium | 5–10 |
| RPT-011 | Internal Audit Annual Plan | Audit | P1 | Medium | 3–5 |
| RPT-012 | Incident Summary Report | Incidents | P1 | Medium | 3–5 |
| RPT-013 | Whistleblower Statistics (anonymised) | Incidents | P1 | Low | 2–3 |
| RPT-014 | Vendor Risk Assessment Summary | Vendor | P2 | Medium | 3–5 |
| RPT-015 | **Quarterly Board Risk Committee Pack** | Cross-module | P0 | **Critical** | 30–50 |
| RPT-016 | NDS2 Alignment Progress Report | Strategic | P1 | Medium | 5–10 |
| RPT-017 | KPI Performance Dashboard (PDF) | Strategic | P1 | Medium | 3–5 |
| RPT-018 | CEO Performance Contract Review | Board | P1 | Medium | 3–5 |
| RPT-019 | Combined Assurance Map | Audit | P1 | High | 5–10 |
| RPT-020 | Annual Corporate Governance Return | Cross-module | P0 | **Critical** | 20–40 |

**Acceptance criteria requiring PDF:**
- "Quarterly Board Risk Committee Pack (RPT-015) is auto-generated and distributed on schedule without manual intervention"
- "A 300-page PDF meeting pack loads in < 5 seconds on a 4G connection via the mobile app"
- "E-Signature on a board resolution is legally valid per Zimbabwe Cyber and Data Protection Act"
- PECOGA audit artefacts: Sections 23–25, Chapter 4, Section 40

### A3. Technical Architecture

**Library Choice: `pdf-lib` + `@pdf-lib/fontkit` + custom layout engine**

Why not Puppeteer/Playwright?
- Serverless/Vercel/Node.js runtime — headless Chrome is heavy, slow cold start, memory-heavy
- pdf-lib is pure JS, fast, deterministic, works in serverless
- We need precise corporate formatting (Navy/Gold headers, logos, watermarks)

**Why add `@pdf-lib/fontkit`?**
- Need custom font embedding (Inter for body, maybe a Zimbabwe-appropriate serif for formal documents)
- Need font subsetting for small file sizes (critical for mobile download)

**Architecture:**

```
lib/reporting/pdf/
├── engine/
│   ├── layout.ts          # Page layout engine (margins, headers, footers, TOC)
│   ├── tables.ts          # Table renderer (borders, alternating rows, column widths)
│   ├── charts.ts          # SVG→PNG embed for Recharts (via node-canvas or satori)
│   └── branding.ts        # Institution logo, Navy/Gold headers, watermarks, page numbers
├── templates/
│   ├── rpt-001-governance-summary.ts
│   ├── rpt-002-risk-register.ts
│   ├── rpt-003-risk-heatmap.ts
│   ├── rpt-007-board-meeting-pack.ts
│   ├── rpt-015-quarterly-risk-committee.ts
│   ├── rpt-020-annual-governance-return.ts
│   └── ... (20 total)
├── types.ts               # Report input data interfaces
├── utils.ts               # Common helpers (date format, currency, institution name)
└── index.ts               # Factory: buildReport(templateId, data) → Uint8Array
```

**API Routes:**
```
app/api/reports/
├── [templateId]/route.ts          # POST {filters} → PDF download
├── [templateId]/preview/route.ts   # POST → JSON preview (for UI before download)
├── schedule/route.ts              # CRON: auto-generate + email distribute
└── queue/route.ts                 # Background job queue (for large reports)
```

### A4. Implementation Sprints (3 weeks)

#### Sprint P1: Foundation (Week 1)

**Goal:** Branded PDF engine + 5 core templates

**Tasks:**
1. Install `@pdf-lib/fontkit`, `@types/pdf-lib`, `svg-to-pdfkit` (for chart embedding)
2. Build `lib/reporting/pdf/engine/layout.ts`
   - A4 portrait/landscape page setup
   - Header: institution name (left), report title (center), date (right)
   - Footer: page numbering (Page X of Y), classification banner ("CONFIDENTIAL — INTERNAL USE ONLY")
   - Navy bar at top (height 40pt, color #1A3E6E), Gold accent line below (2pt, #C9A84C)
   - Watermark support ("DRAFT" diagonal semi-transparent for preview mode)
3. Build `lib/reporting/pdf/engine/tables.ts`
   - Auto-column-width calculation
   - Header row: bold, Navy background, white text
   - Alternating row colors (Paper #F5F1E8 / white)
   - Cell text wrapping with line height
   - Table split across pages with repeated header
4. Build `lib/reporting/pdf/engine/branding.ts`
   - Institution logo placeholder (configurable per tenant)
   - Navy/Gold color constants
   - Font loading: Inter Regular, Inter Bold, Inter SemiBold
5. Refactor existing `lib/reporting/pdf.ts` into new engine
6. Template RPT-001: Executive Governance Summary (refactor existing)
7. Template RPT-002: Risk Register Summary (table: ID, Title, Category, Score, Status, Owner)
8. Template RPT-004: Top 10 Risks Briefing (1-page brief per risk: title, score, treatment, owner)
9. Template RPT-005: Compliance Obligations Status (table: Regulation, Obligation, Due Date, Status, Evidence)
10. Template RPT-009: Board Action Tracker (table: Action, Meeting, Assignee, Due Date, Status)

**Deliverables:**
- `lib/reporting/pdf/` directory with engine
- 5 templates producing branded PDFs
- API route `POST /api/reports/[templateId]` returning PDF blob
- UI button component `DownloadReportButton.tsx` (replaces existing export button)
- Tests: snapshot PDF byte comparison for each template

**Test Strategy:**
- Unit: each template function tested with mock data → verify no runtime errors
- Integration: API route test → verify PDF bytes start with `%PDF-1.4`
- Visual: manual spot-check of 3 generated PDFs for branding consistency

#### Sprint P2: Critical Templates (Week 2)

**Goal:** RPT-007 (Meeting Pack), RPT-015 (Quarterly Risk Committee Pack), RPT-020 (Annual Governance Return)

**Tasks:**
1. **RPT-007: Board Meeting Pack** — THE critical template
   - Cover page: meeting title, date, location, attendee list, agenda
   - Per-agenda-item sections: title, presenter, duration, background document summaries
   - Attachment pages: resolution text with signature blocks (legal e-signature placeholder)
   - Page numbering per section (Agenda 1, Agenda 2, etc.)
   - Table of contents with page numbers
   - Target: support 300 pages, < 5 seconds generation time
   - Optimize: streaming generation, avoid holding all pages in memory
2. **RPT-015: Quarterly Board Risk Committee Pack**
   - Section A: Risk register changes this quarter (new, escalated, closed)
   - Section B: Risk heatmap (embedded as PNG chart — use Recharts server-side rendering via `satori` or `node-canvas`)
   - Section C: Top 5 treatment status updates
   - Section D: Compliance status summary
   - Section E: Incident summary this quarter
   - Section F: Audit findings status
   - Section G: Board action item progress
   - Appendix: Full risk register (condensed table)
3. **RPT-020: Annual Corporate Governance Return**
   - Formal government submission format
   - Section 1: Board composition (names, roles, independence declarations)
   - Section 2: Board evaluation summary (Sec 25)
   - Section 3: CEO performance contract (Sec 23)
   - Section 4: Risk management framework attestation
   - Section 5: Compliance attestation per PECOGA Chapter 4
   - Section 6: Internal audit effectiveness assessment
   - Section 7: Ethics code attestation (signed by all members)
   - Signature pages: Chairperson + CEO attestation
4. **RPT-003: Risk Heatmap (Visual)**
   - Server-side render 5×5 grid as SVG → embed PNG in PDF
   - Color-coded cells (Green/Yellow/Orange/Red)
   - Risk labels positioned in cells
5. **RPT-008: Board Minutes (Formal)**
   - Parliamentary format: attendees, apologies, declarations of interest
   - Per-item: mover, seconder, discussion summary, resolution text
   - Signature block for Chairperson certification

**Deliverables:**
- RPT-007, RPT-015, RPT-020 production-ready
- Chart-to-PNG pipeline (Recharts SVG → PNG → PDF embed)
- Performance benchmark: RPT-007 300-page generation time logged

#### Sprint P3: Remaining Templates + Automation (Week 3)

**Tasks:**
1. Templates RPT-006, RPT-010, RPT-011, RPT-012, RPT-013, RPT-014, RPT-016, RPT-017, RPT-018, RPT-019
2. **Auto-generation engine**
   - `lib/reporting/scheduler.ts`: cron-compatible function
   - Reads `report_schedules` table (new migration): template_id, frequency (daily/weekly/monthly/quarterly), recipient_roles, last_run
   - Generates PDF, uploads to Supabase Storage, inserts notification, emails via Resend
3. **Report queue**
   - Large reports (RPT-007 300 pages, RPT-020 40 pages) can take >5s
   - Queue pattern: client POST → returns `job_id` immediately → polls `GET /api/reports/jobs/[id]` → download when ready
   - Use Supabase `pg-boss` or simple `report_jobs` table with status
4. **UI: Report Library**
   - New page: `app/(protected)/reports/library/page.tsx`
   - Grid of report cards: thumbnail preview, title, description, last generated date
   - "Generate Now" button with role-based permission
   - "Download Previous" dropdown showing last 5 generations per template
5. **E-Signature integration**
   - RPT-007 and RPT-020 require signature blocks
   - `pdf-lib` supports AcroForm fields — add signature form fields
   - Link to e-signature workflow (Phase 5 already has resolution signing)

**Deliverables:**
- All 20 templates complete
- Scheduled report generation (cron-ready)
- Report queue system for large reports
- Report Library UI page
- Full test coverage for all templates

---

## Part B: React Native Mobile App (Board Member App)

### B1. Requirements (from PRD + ZINARA Tender)

**Target Users:** Board Members (R06), Board Secretary (R07), CEO (R08)  
**Primary Use Case:** Board meeting preparation, meeting attendance, governance oversight on tablet/phone  
**Secondary Use Case:** Risk review, action item tracking, compliance attestation

**PRD Non-Functional Requirements:**
- "Board Member mobile experience MUST be optimised for senior executives: minimum 14pt font support, large tap targets, simplified navigation"
- "Biometric (Touch ID/Face ID) MUST be supported on mobile" (FR-SEC-003)
- "A 300-page PDF meeting pack loads in < 5 seconds on a 4G connection via the mobile app"
- "Board member can download a meeting pack, open and annotate it offline, and have annotations synchronised when connectivity is restored"

**ZINARA Tender Requirements:**
- Native iOS and Android applications
- Offline access to pre-downloaded meeting packs
- Secure annotation (highlighting, private notes) synchronising across devices
- Electronic signature for resolutions
- Push notifications for meeting reminders and action item due dates

### B2. Technical Architecture

**Framework:** React Native with Expo (managed workflow)  
**Why Expo:**
- Fastest path to iOS + Android with single codebase
- OTA updates (critical for security patches)
- Built-in push notifications, biometric auth, deep linking
- PDF rendering via `react-native-pdf` + `rn-fetch-blob`
- Secure storage via `expo-secure-store` (AES-256 encrypted)

**Why NOT Flutter:** Team already knows React/TypeScript from Next.js app. Learning curve for Flutter is 4–6 weeks. Expo leverages existing expertise.

**Project Structure:**
```
mobile/
├── App.tsx                    # Root navigator, auth gate, offline banner
├── app.json                   # Expo config, splash screen, icon
├── eas.json                   # EAS Build profiles (dev, preview, production)
├── package.json
├── src/
│   ├── api/
│   │   ├── client.ts          # Supabase JS client (RLS-aware)
│   │   ├── auth.ts            # Login, MFA, biometric, token refresh
│   │   ├── meetings.ts        # Fetch meetings, packs, actions
│   │   ├── risks.ts           # Risk register (read-only for board)
│   │   ├── board-actions.ts   # Action items assigned to user
│   │   └── sync.ts            # Offline queue: pending uploads, annotations, signatures
│   ├── components/
│   │   ├── ui/                # Reusable: Button, Card, Badge, Text (14pt minimum)
│   │   ├── meeting/
│   │   │   ├── MeetingCard.tsx
│   │   │   ├── PackList.tsx
│   │   │   ├── PdfViewer.tsx  # react-native-pdf + annotation layer
│   │   │   └── AnnotationToolbar.tsx
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       ├── ActionList.tsx
│   │       └── RiskSummary.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── MFAScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── MeetingsScreen.tsx
│   │   ├── MeetingDetailScreen.tsx
│   │   ├── PdfViewerScreen.tsx
│   │   ├── RisksScreen.tsx
│   │   ├── ActionsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOffline.ts        # Network state, queue flush
│   │   ├── useMeetings.ts
│   │   └── useBiometric.ts      # Face ID / Touch ID
│   ├── store/
│   │   ├── authStore.ts         # Zustand: user, tokens, role
│   │   ├── offlineStore.ts      # Zustand: downloaded packs, annotations pending sync
│   │   └── settingsStore.ts     # Font size (14pt, 16pt, 18pt), dark mode
│   ├── utils/
│   │   ├── pdfCache.ts          # Download, encrypt, store PDFs locally
│   │   ├── annotations.ts       # SQLite or MMKV: annotation data (page, x, y, type, text)
│   │   ├── syncEngine.ts        # Detect connectivity, flush annotation queue
│   │   └── crypto.ts            # AES-256 encrypt local files, decrypt on read
│   └── types/
│       └── index.ts
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── logo.png
└── supabase/
    └── .gitignore
```

**Key Libraries:**
| Library | Purpose |
|---------|---------|
| `expo` | Managed workflow, OTA updates |
| `expo-secure-store` | AES-256 encrypted local storage (tokens, biometric flag) |
| `expo-local-authentication` | Face ID / Touch ID / fingerprint |
| `expo-notifications` | Push notifications (meeting reminders, action due dates) |
| `expo-file-system` | Local PDF cache management |
| `react-native-pdf` | PDF viewing with scroll, zoom, page navigation |
| `@react-native-community/netinfo` | Online/offline detection |
| `zustand` | Lightweight state management (familiar pattern) |
| `@supabase/supabase-js` | Supabase client (same as web app) |
| `react-native-gesture-handler` | Swipe gestures for annotation toolbar |
| `react-native-svg` | Annotation overlay (highlights, ink) on PDF |
| `react-native-mmkv` | Fast key-value store for annotation data (MMKV > AsyncStorage) |
| `react-navigation` | Stack + Tab navigation |

### B3. Data Flow — Offline-First Architecture

```
[Board Member opens app]
    ↓
[Auth Check] → Biometric prompt (if enabled) → Supabase token refresh
    ↓
[Sync Check] → NetInfo.isConnected?
    ├─ ONLINE → Flush offline queue (annotations, signatures) → fetch latest data
    └─ OFFLINE → Load from local cache → show offline banner
    ↓
[Dashboard] → Cached stats: upcoming meetings, overdue actions, new risks
    ↓
[Meeting Pack Download]
    1. User taps "Download" on meeting card
    2. API call: GET /api/reports/rpt-007?meeting_id=xxx → PDF blob
    3. Encrypt with AES-256 (device key from expo-secure-store)
    4. Save to `FileSystem.cacheDirectory + /packs/{meeting_id}.pdf`
    5. Store metadata in MMKV: { meeting_id, title, downloaded_at, size, encrypted }
    ↓
[PDF Viewing + Annotation]
    1. react-native-pdf renders PDF page
    2. react-native-svg overlay captures gestures (tap, long-press, pan)
    3. Annotation types: Highlight (rect overlay), Note (pin icon + modal), Ink (freehand SVG path)
    4. Annotations stored in MMKV as JSON: { page, x, y, width, height, type, color, text, created_at }
    5. On annotation create/update/delete → add to sync queue
    ↓
[Sync Engine]
    1. NetInfo fires "online" event
    2. Process sync queue: POST /api/board/annotations with batch payload
    3. On success: remove from queue, update local state
    4. On failure: retry with exponential backoff, max 5 attempts
    5. Conflict resolution: server wins (last-write-wins), notify user of conflicts
```

### B4. Backend Changes Required

The Next.js app needs new API endpoints to support the mobile app:

```
app/api/mobile/
├── auth/
│   ├── refresh/route.ts         # Token refresh endpoint (mobile-friendly)
│   └── biometric/route.ts       # Register Face ID / Touch ID public key
├── meetings/
│   ├── list/route.ts            # GET /api/mobile/meetings — simplified payload for mobile
│   ├── detail/route.ts          # GET /api/mobile/meetings/[id] — with pack URL
│   └── actions/route.ts         # GET /api/mobile/meetings/[id]/actions
├── annotations/
│   └── batch/route.ts           # POST /api/mobile/annotations — batch upload from sync queue
├── actions/
│   ├── list/route.ts            # GET /api/mobile/actions — my action items
│   └── update/route.ts          # PATCH /api/mobile/actions/[id] — status update
├── risks/
│   └── list/route.ts            # GET /api/mobile/risks — read-only, top 20
└── notifications/
    └── register/route.ts        # POST — register push token (expo-notifications)
```

**New Database Migration:**
```sql
-- Mobile annotations table
CREATE TABLE mobile_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  meeting_id UUID REFERENCES board_meetings(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('meeting_pack', 'policy', 'risk_document')),
  document_id UUID NOT NULL,
  page_number INTEGER NOT NULL,
  annotation_type TEXT NOT NULL CHECK (annotation_type IN ('highlight', 'note', 'ink')),
  x REAL,
  y REAL,
  width REAL,
  height REAL,
  color TEXT DEFAULT '#C9A84C',
  content TEXT, -- note text or SVG path data
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  device_id TEXT -- for conflict detection
);

-- Push notification tokens
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, device_id)
);

-- Enable RLS, add policies, audit triggers
```

### B5. Implementation Sprints (4–6 weeks)

#### Sprint M1: Scaffold + Auth (Week 1)

**Goal:** Expo project scaffolded, auth flow working, biometric login

**Tasks:**
1. Initialize Expo project: `npx create-expo-app mobile` with TypeScript template
2. Configure `app.json`: app name "GRC-Nexus Board", bundle ID `com.hurument.grcnexus.board`
3. Configure EAS Build: `eas.json` with dev/preview/production profiles
4. Install dependencies: `expo-secure-store`, `expo-local-authentication`, `expo-notifications`, `react-native-pdf`, `react-native-svg`, `react-navigation`, `zustand`, `@supabase/supabase-js`, `react-native-mmkv`, `@react-native-community/netinfo`
5. Build auth store (Zustand): token, user, role, biometric_enabled
6. Login screen: email/password → Supabase auth → MFA screen (TOTP or email OTP)
7. Biometric enrollment screen: "Enable Face ID for faster login?" → store flag in SecureStore
8. Biometric login: app launch → check flag → prompt Face ID → if success, use refresh token
9. Token refresh: background timer every 25 minutes (before 30-min expiry)
10. Dashboard skeleton: "Welcome, {name}" + 3 tab navigation (Meetings, Actions, Risks)

**Deliverables:**
- `mobile/` directory in repo
- Auth flow: login → MFA → dashboard
- Biometric login working on iOS Simulator (Face ID) and Android emulator (fingerprint)
- Token refresh preventing session expiry

**Test Strategy:**
- Unit: auth store state transitions
- E2E: Detox (or Maestro) — login flow, biometric prompt, token refresh
- Manual: Test on physical iPhone + Android device

#### Sprint M2: Meetings + Offline Pack Download (Week 2)

**Goal:** Meeting list, pack download, offline PDF viewing

**Tasks:**
1. Meeting list screen: fetch from Supabase (`board_meetings` table, filtered by attendee via `meeting_attendees` junction)
   - Card: title, date, time, location, status badge
   - "Download Pack" button (only for upcoming/scheduled meetings)
2. Pack download flow:
   - Call `GET /api/reports/rpt-007?meeting_id=xxx` → PDF blob
   - Show progress bar (download %)
   - Encrypt with AES-256 (device-specific key from SecureStore)
   - Save to `FileSystem.cacheDirectory/packs/{id}.pdf`
   - Store metadata in MMKV
3. PDF viewer screen:
   - `react-native-pdf` component, full-screen
   - Page navigation: swipe, thumbnail strip at bottom
   - Zoom: pinch-to-zoom (react-native-gesture-handler)
   - Offline mode: load from local encrypted file, decrypt on read
4. Meeting detail screen:
   - Agenda items list
   - Attendees list (with apology status)
   - Resolutions list (with vote status if applicable)
   - Action items from this meeting
5. Offline banner: NetInfo shows offline → red banner "You are offline. Limited functionality available."
6. Download management: "My Downloads" screen — list all cached packs, size, delete option

**Deliverables:**
- Meeting list + detail screens
- PDF download + offline viewing
- Encrypted local storage for sensitive documents
- Download manager UI

**Performance Target:**
- 300-page PDF download on 4G: < 5 seconds (requires server-side optimization + CDN + PDF compression)
- PDF open from local storage: < 1 second

#### Sprint M3: Annotations + Sync (Week 3)

**Goal:** Highlight, notes, ink annotations on PDFs, offline queue + sync

**Tasks:**
1. Annotation toolbar: floating bottom bar (Highlight, Note, Pen, Eraser)
2. Highlight gesture: long-press on text → select area → rect overlay with yellow tint
   - Store: `{ page, x, y, width, height, type: 'highlight', color }`
3. Note annotation: tap → pin icon appears → tap pin → modal with text input
   - Store: `{ page, x, y, type: 'note', content: 'text' }`
4. Ink annotation: pan gesture → SVG path → stroke
   - Store: `{ page, type: 'ink', content: 'SVG path string', color, strokeWidth }`
5. Annotation list sidebar: swipe from right → list all annotations on current document → jump to page
6. Sync engine:
   - `syncEngine.ts`: NetInfo listener
   - Queue: MMKV array of pending operations `[{ action: 'create', annotation }, ...]`
   - Flush: batch POST to `/api/mobile/annotations/batch`
   - Retry: exponential backoff, max 5 attempts
   - Conflict: server wins, show toast "This annotation was modified on another device"
7. Annotation persistence: store locally immediately (no wait for server), queue for sync
8. Annotation deletion: swipe to delete → local remove + queue delete action

**Deliverables:**
- Full annotation system (highlight, note, ink)
- Offline queue with conflict resolution
- Annotation sidebar for navigation
- Sync engine with retry logic

#### Sprint M4: Actions + Risks + Notifications (Week 4)

**Goal:** Action item management, risk read-only view, push notifications

**Tasks:**
1. Actions screen: list my assigned board actions
   - Card: description, due date (color-coded: green/yellow/red), meeting reference
   - Tap → detail screen → status update dropdown (Pending → In Progress → Completed)
   - Status update triggers API call (or queues if offline)
2. Risks screen: read-only risk register (top 20 risks for board view)
   - Sort by: inherent score, residual score, category
   - Filter: category, status
   - Risk detail: title, description, heatmap position, treatment plan, owner
3. Push notifications:
   - Register device token on login: `POST /api/mobile/notifications/register`
   - Trigger types: meeting reminder (24h before), action item overdue (daily at 08:00), new meeting pack available, resolution requires signature
   - Server-side: Supabase Edge Function or cron job → query `push_tokens` → send via Expo Push API
4. Profile screen:
   - Name, role, institution
   - Biometric toggle
   - Font size selector (14pt, 16pt, 18pt — satisfies PRD minimum)
   - Dark mode toggle
   - "Clear all downloads" button
   - Logout
5. Deep linking: `grcnexus://meetings/{id}` → opens meeting detail directly
   - Used in push notification tap actions

**Deliverables:**
- Actions management (CRU — no delete)
- Risk read-only view with filters
- Push notification system (register, receive, deep link)
- Profile/settings screen
- Deep linking support

#### Sprint M5: Polish + E-Signature + Testing (Weeks 5–6)

**Goal:** e-signature on resolutions, performance optimization, testing, app store submission prep

**Tasks:**
1. **E-Signature on resolutions:**
   - Meeting detail → resolution tab → "Sign Resolution" button
   - Signature pad: `react-native-signature-canvas` (or custom SVG capture)
   - Capture signature as SVG path → upload to server
   - Server: store in `resolution_signatures` table, link to audit trail
   - PDF regeneration: re-generate RPT-007 with signature embedded in signature block
   - Legal validity: timestamp, IP address, device ID stored
2. **Performance optimization:**
   - PDF download: compress images in RPT-007 generation (reduce from 300MB to <10MB)
   - Lazy loading: only load 3 pages of PDF into memory at a time
   - Image caching: meeting attendee avatars, institution logo
   - Bundle size: code splitting by screen, tree-shake unused components
3. **Testing:**
   - Unit tests: Jest for stores, hooks, utilities
   - Integration tests: React Native Testing Library for screens
   - E2E tests: Detox (iOS) + Maestro (Android)
     - Test flows: login → download pack → annotate → go offline → create annotation → online → sync → verify on web
   - Performance tests: 300-page PDF download on 3G/4G/WiFi
   - Accessibility: minimum 14pt font verified, tap targets ≥44×44pt
4. **App Store submission prep:**
   - App Store: screenshots (iPhone 14 Pro, iPad Pro), description, privacy policy
   - Google Play: screenshots (Pixel 7, Samsung Tab), description, privacy policy
   - Both: age rating, content description, data safety form
   - Zimbabwe context: app description mentions PECOGA compliance, NDS2 alignment
5. **Documentation:**
   - `mobile/README.md`: setup, build, deploy instructions
   - `mobile/USER-GUIDE.md`: board member quick start (login, download pack, annotate, sign)
   - `mobile/ARCHITECTURE.md`: offline-first architecture, sync engine, security model

**Deliverables:**
- E-signature on resolutions (legally valid per Cyber and Data Protection Act)
- Optimized 300-page PDF handling
- Comprehensive test suite
- App store submission ready
- Full documentation

---

## Part C: Integration & Parallelization

### C1. Workstream Parallelization

| Week | PDF Team | Mobile Team | Shared |
|------|----------|-------------|--------|
| 1 | Sprint P1: Engine + 5 templates | Sprint M1: Scaffold + Auth | DB migration: annotations + push tokens |
| 2 | Sprint P2: Critical templates | Sprint M2: Meetings + offline packs | API: mobile endpoints scaffold |
| 3 | Sprint P3: Remaining + automation | Sprint M3: Annotations + sync | API: annotations batch + push register |
| 4 | — | Sprint M4: Actions + risks + notifications | API: actions update + risk list |
| 5 | — | Sprint M5: Polish + e-signature | Performance testing + security audit |
| 6 | — | Sprint M5: Testing + app store | Final QA + documentation |

**Team sizing estimate:**
- PDF workstream: 1 senior Node.js/TypeScript developer (familiar with pdf-lib)
- Mobile workstream: 1 senior React Native developer + 1 junior (testing/UI)
- Shared backend: 1 developer (can be same as PDF lead, part-time)

**Total:** 2.5–3 FTE for 6 weeks = ~15 person-weeks

### C2. Critical Path Dependencies

1. **PDF templates must be server-ready before mobile pack download works**
   - Mobile Sprint M2 depends on RPT-007 being production-ready
   - Mitigation: start RPT-007 in Sprint P1 week 2, deliver by Sprint M2 start

2. **Mobile API endpoints must exist before mobile sync works**
   - Mobile Sprint M3 depends on `POST /api/mobile/annotations/batch`
   - Mitigation: backend dev delivers API scaffold in week 1, batch endpoint in week 3

3. **Supabase Storage for PDFs must be configured**
   - Large PDFs shouldn't transit through Next.js API routes (Vercel function timeout ~60s)
   - Solution: API generates PDF → uploads to Supabase Storage → returns signed URL
   - Mobile downloads directly from Storage URL (faster, bypasses function timeout)

4. **Push notifications require Expo Push Service setup**
   - Expo project ID, Apple Push Notification Service (APNS) certificate, Firebase Cloud Messaging (FCM) key
   - Lead time: Apple Developer account + APNS cert = 2–3 days

### C3. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| pdf-lib performance degrades on 300-page reports | Medium | High | Benchmark early (Sprint P1). Fallback: pre-generate meeting packs and cache in Supabase Storage |
| React Native PDF annotation libraries are buggy | Medium | High | Evaluate 2 libraries in Sprint M1 week 1. Have `react-native-pdf` + custom SVG overlay as backup |
| Expo EAS Build iOS provisioning issues | Medium | Medium | Use Apple Developer Team account (not personal). Test on physical device week 1 |
| Offline sync conflicts with web app edits | Low | Medium | Last-write-wins with toast notification. Audit log captures all changes |
| Biometric auth fails on some Android devices | Low | Low | Fallback to PIN code. Test on 3+ Android devices |
| 300-page PDF >50MB on 4G | Medium | High | Server-side compress images (jpeg 80%), subset fonts, reduce resolution. Target <10MB |

---

## Part D: Success Criteria & Acceptance

### D1. PDF Reports

| Criterion | Measurement |
|-----------|-------------|
| All 20 templates generate without error | Automated test: loop all templates with mock data → verify PDF bytes valid |
| RPT-007 300-page pack < 5s on 4G | Benchmark on throttled 4G (10 Mbps). Server-side pre-generation + CDN caching |
| RPT-015 auto-generates quarterly | Cron job runs, generates PDF, emails distribution list, logs success |
| Branded correctly | Manual QA: Navy header, Gold accent, institution name, page numbers, classification banner |
| File size < 10MB per 100 pages | pdf-lib optimization: image compression, font subsetting |

### D2. Mobile App

| Criterion | Measurement |
|-----------|-------------|
| iOS + Android builds pass EAS | `eas build --platform all` succeeds |
| Biometric login < 2 seconds | Timer from app launch to dashboard |
| 300-page PDF download < 5s on 4G | Network throttling test (10 Mbps). Compressed PDF < 10MB |
| Offline annotation create + sync | Airplane mode → annotate → online → verify on web app within 30 seconds |
| Minimum 14pt font everywhere | Accessibility audit: no text < 14pt on any screen |
| Tap targets ≥ 44×44pt | Accessibility audit: no tappable element smaller than 44pt |
| E-signature legally valid | Timestamp + IP + device ID stored. PDF signature block embedded. Audit trail captures event |
| App Store / Play Store submission ready | Screenshots, description, privacy policy, data safety form complete |

---

## Part E: Immediate Next Steps (This Week)

### PDF Team (Week 1, Day 1–2)
1. `cd hurument/grc-nexus && npm install @pdf-lib/fontkit`
2. Create `lib/reporting/pdf/engine/layout.ts` — basic page with Navy header + Gold line
3. Create `lib/reporting/pdf/engine/tables.ts` — simple 3-column table with header row
4. Refactor `lib/reporting/pdf.ts` → `lib/reporting/pdf/templates/rpt-001.ts`
5. Verify build passes: `npm run build`
6. Verify tests pass: `npm test`

### Mobile Team (Week 1, Day 1–2)
1. `cd hurument && npx create-expo-app mobile --template blank-typescript`
2. `cd mobile && npx expo install expo-secure-store expo-local-authentication expo-notifications`
3. `npm install react-native-pdf react-native-svg react-navigation zustand @supabase/supabase-js react-native-mmkv`
4. Configure `app.json` with app name, bundle ID, icon placeholder
5. Configure `eas.json` with dev/preview/production profiles
6. Run `npx expo start` — verify iOS Simulator + Android Emulator launch
7. Create `mobile/src/store/authStore.ts` with Zustand scaffold

### Shared Backend (Week 1, Day 1–2)
1. Create migration: `supabase/migrations/00053_mobile_annotations.sql`
2. Create migration: `supabase/migrations/00054_push_tokens.sql`
3. Create `app/api/mobile/auth/refresh/route.ts` — token refresh endpoint
4. `npx supabase db push` (if Supabase project linked)

---

## Appendix A: Report Template Data Requirements

### RPT-007: Board Meeting Pack
```typescript
interface MeetingPackData {
  meeting: {
    id: string
    title: string
    date: string
    time: string
    location: string
    status: string
  }
  attendees: Array<{ name: string; role: string; status: 'attending' | 'apology' | 'tentative' }>
  agenda: Array<{
    item_number: number
    title: string
    presenter: string
    duration_minutes: number
    background_documents: Array<{ title: string; pages: number }>
    resolution_text?: string
  }>
  resolutions: Array<{
    id: string
    title: string
    text: string
    mover: string
    seconder: string
    status: 'proposed' | 'carried' | 'defeated'
  }>
  previous_minutes: { meeting_date: string; approval_status: string }
  action_items: Array<{ description: string; assignee: string; due_date: string; status: string }>
}
```

### RPT-015: Quarterly Board Risk Committee Pack
```typescript
interface QuarterlyRiskCommitteeData {
  quarter: string // "Q2 2026"
  period: { from: string; to: string }
  institution: { name: string; logo_url?: string }
  risk_changes: {
    new: number
    escalated: number
    de_escalated: number
    closed: number
  }
  risk_heatmap: Array<{ id: string; title: string; likelihood: number; impact: number }>
  top_treatments: Array<{ risk_title: string; treatment: string; progress_pct: number; owner: string }>
  compliance_summary: { total: number; compliant: number; non_compliant: number; due_soon: number }
  incident_summary: { total: number; critical: number; high: number; closed: number; avg_resolution_days: number }
  audit_findings: { open: number; overdue: number; closed_this_quarter: number }
  action_progress: { total: number; completed: number; overdue: number }
}
```

---

## Appendix B: Mobile App Screen Wireframes (Text Description)

### Dashboard Screen
```
┌─────────────────────────────┐
│  GRC-Nexus        ⚙️  🔔    │  ← Header, settings + notifications
├─────────────────────────────┤
│  Welcome, Chairman Dube     │  ← 18pt bold, greeting
├─────────────────────────────┤
│  [Meeting Card]             │  ← Next meeting, 14pt, large tap target
│  Q2 2026 Board Meeting      │
│  June 15, 09:00 · Boardroom │
│  [Download Pack]            │  ← Primary button, 48pt height
├─────────────────────────────┤
│  MY ACTIONS                 │  ← Section header, 16pt bold
│  ┌───────────────────────┐  │
│  │ Approve revised risk  │  │  ← Action card, 14pt body
│  │ appetite statement    │  │     Due: June 30 · Overdue: 3 days
│  │ [Update Status ▼]     │  │  ← Dropdown, 44pt min height
│  └───────────────────────┘  │
├─────────────────────────────┤
│  [Meetings] [Actions] [Risks]│  ← Tab bar, 56pt height, icons + labels
└─────────────────────────────┘
```

### PDF Viewer Screen
```
┌─────────────────────────────┐
│  ←  Q2 2026 Pack    📝  🔍 │  ← Back, annotate, zoom
├─────────────────────────────┤
│                             │
│  [PDF Page 1 of 300]        │  ← react-native-pdf, full screen
│                             │
│  [SVG overlay]              │  ← Annotations rendered on top
│  ┌────────┐                 │
│  │ yellow │  ← Highlight     │
│  └────────┘                 │
│     📌                      │  ← Note pin
├─────────────────────────────┤
│  [←]  [1  2  3  4  5]  [→] │  ← Thumbnail strip, page nav
│  [Highlight] [Note] [Pen]   │  ← Annotation toolbar, 56pt height
└─────────────────────────────┘
```

---

*Plan generated by Clawdy ⚡ on 2026-06-03*
*Next review: weekly, or after each sprint completion*