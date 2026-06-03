# Annex B: Data Model and API Catalog Outline
## ZIGDP Technical Blueprint (Logical)

**Version:** 2.0
**Date:** May 2026

---

## 1. Logical Data Domains

1. Governance domain.
2. Procurement domain.
3. Risk and controls domain.
4. Audit and compliance domain.
5. Whistleblower and case domain.
6. Program and project delivery domain.
7. Reference and master data domain.

---

## 2. Core Entities (High-Level)

1. Institution
2. Department
3. UserAccount
4. RoleAssignment
5. Supplier
6. Tender
7. BidSubmission
8. EvaluationRecord
9. Contract
10. ContractMilestone
11. Risk
12. RiskTreatment
13. Control
14. ComplianceObligation
15. ComplianceEvidence
16. AuditEngagement
17. AuditFinding
18. CorrectiveAction
19. WhistleCase
20. CaseActivity
21. Program
22. Project
23. KPI
24. KPIResult
25. Province
26. District
27. LocalAuthority

---

## 3. Key Relationships

1. Institution has many Departments and Users.
2. Tender belongs to Institution; Tender has many BidSubmissions.
3. Contract is awarded from one EvaluationRecord and one Supplier.
4. Risk belongs to Institution/Department and maps to one or more Controls.
5. AuditFinding links to Risks, Controls, and CorrectiveActions.
6. ComplianceObligation maps to Institution and due dates; has many Evidence records.
7. Program has many Projects; Projects have many KPIs and KPIResults.
8. Projects are tagged to geographic entities for devolution reporting.

---

## 4. Minimal Data Standards

1. Globally unique identifiers for all transactional entities.
2. Event timestamps in UTC with local display conversion.
3. Immutable audit metadata: createdBy, createdAt, updatedBy, updatedAt.
4. Required classification fields for confidentiality and retention rules.

---

## 5. API Design Principles

1. RESTful JSON APIs for transactional operations.
2. Event-driven notifications for state changes.
3. Versioned APIs with backward compatibility policy.
4. OAuth2/OpenID Connect for authentication and authorization.
5. Idempotency keys for critical write operations.

---

## 6. API Catalog (Initial)

### 6.1 Identity and Access

1. POST /auth/token
2. GET /users
3. POST /users
4. GET /roles
5. POST /role-assignments

### 6.2 Procurement

1. GET /tenders
2. POST /tenders
3. POST /tenders/{id}/publish
4. POST /tenders/{id}/bids
5. POST /tenders/{id}/evaluate
6. POST /tenders/{id}/award
7. GET /contracts
8. POST /contracts/{id}/milestones

### 6.3 Risk and Controls

1. GET /risks
2. POST /risks
3. PATCH /risks/{id}
4. POST /risks/{id}/treatments
5. GET /controls
6. POST /controls

### 6.4 Audit and Compliance

1. GET /audit-engagements
2. POST /audit-engagements
3. POST /audit-findings
4. POST /corrective-actions
5. GET /compliance-obligations
6. POST /compliance-evidence

### 6.5 Whistleblower Cases

1. POST /whistlecases
2. GET /whistlecases/{id}
3. POST /whistlecases/{id}/activities
4. POST /whistlecases/{id}/escalate
5. POST /whistlecases/{id}/close

### 6.6 NDS2 Delivery

1. GET /programs
2. POST /programs
3. GET /projects
4. POST /projects
5. POST /projects/{id}/kpi-results
6. GET /dashboards/executive
7. GET /dashboards/provincial

---

## 7. Example API Contract (Abbreviated)

Endpoint: POST /risks

Required request fields:

1. institutionId
2. title
3. category
4. inherentLikelihood
5. inherentImpact
6. ownerUserId
7. targetReviewDate

Response fields:

1. riskId
2. status
3. createdAt
4. createdBy

---

## 8. Event Topics (Suggested)

1. tender.published
2. contract.awarded
3. risk.threshold_breached
4. audit.finding_created
5. compliance.overdue
6. whistlecase.created
7. project.status_changed

---

## 9. Integration Priorities

1. eGP and procurement repositories.
2. Existing finance/ERP systems for budget and disbursement feeds.
3. OPC performance and planning data sources.
4. Identity provider and government directory services.

---

## 10. Data Governance Controls

1. Data ownership matrix by domain.
2. Data quality checks with exception workflows.
3. Retention policies by record type.
4. Access logging and periodic access reviews.
