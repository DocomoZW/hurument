require('dotenv').config({ path: __dirname + '/../.env' });
const bcrypt = require('bcryptjs');
const { db, initSchema } = require('../database');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function seed() {
  console.log('Initializing schema...');
  await initSchema();
  console.log('Seeding database...');

  // Seed users with roles from PRD
  const users = [
    { email: 'tendai.m@finance.gov.zw', password: 'demo123', name: 'Tendai M.', role: 'risk_manager', department: 'Risk & Compliance' },
    { email: 'ceo@finance.gov.zw', password: 'demo123', name: 'Dr. Ncube', role: 'ceo', department: 'Executive' },
    { email: 'board.sec@finance.gov.zw', password: 'demo123', name: 'Mrs. Mutasa', role: 'board_secretary', department: 'Board Office' },
    { email: 'auditor@finance.gov.zw', password: 'demo123', name: 'James K.', role: 'internal_auditor', department: 'Internal Audit' },
    { email: 'compliance@finance.gov.zw', password: 'demo123', name: 'Grace T.', role: 'compliance_officer', department: 'Legal & Compliance' },
    { email: 'strategy@finance.gov.zw', password: 'demo123', name: 'Peter M.', role: 'strategic_planning_officer', department: 'Strategy' },
    { email: 'admin@finance.gov.zw', password: 'demo123', name: 'System Admin', role: 'system_admin', department: 'ICT' },
    { email: 'board@finance.gov.zw', password: 'demo123', name: 'Chairman Dube', role: 'board_member', department: 'Board' },
  ];

  const userIds = {};
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await run(
      `INSERT OR IGNORE INTO users (email, password_hash, name, role, department) VALUES (?, ?, ?, ?, ?)`,
      [u.email, hash, u.name, u.role, u.department]
    );
    const row = await get(`SELECT id FROM users WHERE email = ?`, [u.email]);
    userIds[u.email] = row.id;
    console.log(`  User: ${u.email} -> ID ${row.id}`);
  }
  console.log('Users seeded');

  // Seed strategic objectives (NDS2-aligned)
  const objectives = [
    { code: 'SO-NDS2-01', title: 'Economic Growth & Stability', nds2_pillar: 'Economic Growth', kra: 'Macroeconomic Stability', owner: 'strategy@finance.gov.zw', target: 100, actual: 68, unit: '%', start: '2026-01-01', end: '2030-12-31', status: 'On Track' },
    { code: 'SO-NDS2-02', title: 'Digital Transformation', nds2_pillar: 'Digital Economy', kra: 'e-Government Services', owner: 'strategy@finance.gov.zw', target: 80, actual: 45, unit: '%', start: '2026-01-01', end: '2030-12-31', status: 'At Risk' },
    { code: 'SO-NDS2-03', title: 'Good Governance & Anti-Corruption', nds2_pillar: 'Governance', kra: 'Corruption Perception Index', owner: 'compliance@finance.gov.zw', target: 50, actual: 35, unit: 'score', start: '2026-01-01', end: '2030-12-31', status: 'At Risk' },
    { code: 'SO-NDS2-04', title: 'Climate Resilience', nds2_pillar: 'Environment', kra: 'Renewable Energy Mix', owner: 'strategy@finance.gov.zw', target: 40, actual: 22, unit: '%', start: '2026-01-01', end: '2030-12-31', status: 'Off Track' },
    { code: 'SO-NDS2-05', title: 'Human Capital Development', nds2_pillar: 'Social Development', kra: 'Literacy Rate', owner: 'strategy@finance.gov.zw', target: 95, actual: 88, unit: '%', start: '2026-01-01', end: '2030-12-31', status: 'On Track' },
    { code: 'SO-NDS2-06', title: 'Infrastructure Modernization', nds2_pillar: 'Infrastructure', kra: 'Road Network Condition', owner: 'strategy@finance.gov.zw', target: 75, actual: 60, unit: '%', start: '2026-01-01', end: '2030-12-31', status: 'On Track' },
  ];

  const objIds = {};
  for (const o of objectives) {
    await run(
      `INSERT OR IGNORE INTO strategic_objectives (objective_code, title, nds2_pillar, kra, owner_id, target_value, actual_value, unit, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [o.code, o.title, o.nds2_pillar, o.kra, userIds[o.owner], o.target, o.actual, o.unit, o.start, o.end, o.status]
    );
    const row = await get(`SELECT id FROM strategic_objectives WHERE objective_code = ?`, [o.code]);
    objIds[o.code] = row.id;
    console.log(`  Objective: ${o.code} -> ID ${row.id}`);
  }
  console.log('Strategic objectives seeded');

  // Seed annual outputs
  const outputs = [
    { code: 'SO-NDS2-01', output_code: 'AO-2026-01', desc: 'GDP growth monitoring framework operational', date: '2026-06-30', pct: 80 },
    { code: 'SO-NDS2-01', output_code: 'AO-2026-02', desc: 'Inflation targeting policy approved', date: '2026-03-31', pct: 100 },
    { code: 'SO-NDS2-02', output_code: 'AO-2026-03', desc: 'e-Government portal launched', date: '2026-09-30', pct: 45 },
    { code: 'SO-NDS2-02', output_code: 'AO-2026-04', desc: 'Digital identity system pilot', date: '2026-12-31', pct: 30 },
    { code: 'SO-NDS2-03', output_code: 'AO-2026-05', desc: 'PECOGA compliance audit completed', date: '2026-06-30', pct: 60 },
  ];

  for (const o of outputs) {
    const status = o.pct >= 90 ? 'Completed' : o.pct >= 50 ? 'On Track' : 'At Risk';
    await run(
      `INSERT OR IGNORE INTO annual_outputs (objective_id, output_code, description, target_date, completion_pct, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [objIds[o.code], o.output_code, o.desc, o.date, o.pct, status]
    );
  }
  console.log('Annual outputs seeded');

  // Seed risks
  const risks = [
    { id: 'R-2026-001', title: 'Currency Volatility', category: 'Financial', obj: 'SO-NDS2-01', il: 4, ii: 5, rl: 3, ri: 4, owner: 'tendai.m@finance.gov.zw', status: 'In Progress', plan: 'Hedging strategy implementation', due: '2026-08-15' },
    { id: 'R-2026-002', title: 'Cyber Security Breach', category: 'Operational', obj: 'SO-NDS2-02', il: 3, ii: 5, rl: 2, ri: 3, owner: 'tendai.m@finance.gov.zw', status: 'Open', plan: 'Security audit and firewall upgrade', due: '2026-07-30' },
    { id: 'R-2026-003', title: 'Regulatory Non-Compliance', category: 'Compliance', obj: 'SO-NDS2-03', il: 4, ii: 4, rl: 2, ri: 2, owner: 'compliance@finance.gov.zw', status: 'In Progress', plan: 'PECOGA gap analysis remediation', due: '2026-09-01' },
    { id: 'R-2026-004', title: 'Climate Extreme Events', category: 'Environmental', obj: 'SO-NDS2-04', il: 3, ii: 5, rl: 3, ri: 4, owner: 'tendai.m@finance.gov.zw', status: 'Open', plan: 'Disaster preparedness fund allocation', due: '2026-10-15' },
    { id: 'R-2026-005', title: 'Skills Shortage in ICT', category: 'Human Capital', obj: 'SO-NDS2-05', il: 4, ii: 3, rl: 3, ri: 2, owner: 'strategy@finance.gov.zw', status: 'In Progress', plan: 'ICT skills development partnership', due: '2026-11-30' },
    { id: 'R-2026-006', title: 'Infrastructure Funding Gap', category: 'Financial', obj: 'SO-NDS2-06', il: 4, ii: 4, rl: 3, ri: 3, owner: 'ceo@finance.gov.zw', status: 'Open', plan: 'PPP framework development', due: '2026-08-31' },
    { id: 'R-2026-007', title: 'Data Sovereignty Risk', category: 'Legal/Regulatory', obj: 'SO-NDS2-02', il: 2, ii: 4, rl: 1, ri: 2, owner: 'compliance@finance.gov.zw', status: 'Closed', plan: 'Data localization policy approved', due: '2026-03-15' },
    { id: 'R-2026-008', title: 'Supplier Dependency', category: 'Operational', obj: 'SO-NDS2-06', il: 3, ii: 3, rl: 2, ri: 2, owner: 'tendai.m@finance.gov.zw', status: 'Open', plan: 'Diversification of critical suppliers', due: '2026-09-15' },
    { id: 'R-2026-009', title: 'Board Composition Risk', category: 'Governance', obj: 'SO-NDS2-03', il: 2, ii: 5, rl: 1, ri: 2, owner: 'board.sec@finance.gov.zw', status: 'In Progress', plan: 'Board skills matrix review', due: '2026-07-15' },
    { id: 'R-2026-010', title: 'Revenue Collection Inefficiency', category: 'Financial', obj: 'SO-NDS2-01', il: 4, ii: 4, rl: 3, ri: 3, owner: 'tendai.m@finance.gov.zw', status: 'Open', plan: 'Revenue automation system deployment', due: '2026-12-31' },
  ];

  for (const r of risks) {
    await run(
      `INSERT OR IGNORE INTO risks (risk_id, title, description, category, objective_id, inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, risk_owner_id, treatment_status, treatment_plan, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.id, r.title, null, r.category, objIds[r.obj] || null, r.il, r.ii, r.rl, r.ri, userIds[r.owner] || null, r.status, r.plan, r.due]
    );
  }
  console.log('Risks seeded');

  // Seed compliance obligations
  const obligations = [
    { reg: 'PECOGA [Ch 10:31]', obligation: 'Annual Board evaluation (Sec 25)', due: '2026-12-31', status: 'Due Soon' },
    { reg: 'PECOGA [Ch 10:31]', obligation: 'CEO performance contract (Sec 23)', due: '2026-01-31', status: 'Compliant' },
    { reg: 'Statutory Instrument 135/2019', obligation: 'Annual risk assessment mandatory', due: '2026-06-30', status: 'Due Soon' },
    { reg: 'Public Finance Mgt Act [Ch 22:19]', obligation: 'Annual audit and financial disclosure', due: '2026-09-30', status: 'Compliant' },
    { reg: 'Cyber & Data Protection Act [Ch 12:07]', obligation: 'Data protection officer appointment', due: '2026-03-31', status: 'Non-Compliant' },
    { reg: 'ISO 31000:2018', obligation: 'Risk management framework certification', due: '2026-12-31', status: 'Due Soon' },
    { reg: 'NDS2 Implementation Framework', obligation: 'Quarterly NDS2 progress reporting', due: '2026-06-30', status: 'Due Soon' },
    { reg: 'Energy Regulatory Act [Ch 13:23]', obligation: 'ZERA regulatory compliance attestation', due: '2026-04-30', status: 'Compliant' },
  ];

  for (const o of obligations) {
    await run(
      `INSERT OR IGNORE INTO compliance_obligations (regulation, obligation, due_date, evidence_required, status, owner_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [o.reg, o.obligation, o.due, 'Documentation required', o.status, userIds['compliance@finance.gov.zw']]
    );
  }
  console.log('Compliance obligations seeded');

  // Seed policies
  const policies = [
    { title: 'Code of Ethics', category: 'Governance', version: '2.1', status: 'Active', review: '2026-12-01' },
    { title: 'Risk Management Policy', category: 'Risk', version: '3.0', status: 'Active', review: '2026-11-15' },
    { title: 'Information Security Policy', category: 'ICT', version: '1.5', status: 'Under Review', review: '2026-07-01' },
    { title: 'Procurement Policy', category: 'Finance', version: '4.2', status: 'Active', review: '2026-10-01' },
    { title: 'Whistleblower Protection Policy', category: 'Ethics', version: '1.0', status: 'Active', review: '2026-09-01' },
    { title: 'Board Charter', category: 'Governance', version: '2.0', status: 'Active', review: '2026-12-15' },
    { title: 'HR Policy', category: 'Human Resources', version: '5.1', status: 'Active', review: '2026-08-01' },
    { title: 'Climate Change Adaptation Policy', category: 'Environment', version: '1.0', status: 'Draft', review: '2026-06-15' },
  ];

  for (const p of policies) {
    await run(
      `INSERT OR IGNORE INTO policies (title, category, version, status, next_review, approved_by) VALUES (?, ?, ?, ?, ?, ?)`,
      [p.title, p.category, p.version, p.status, p.review, userIds['ceo@finance.gov.zw']]
    );
  }
  console.log('Policies seeded');

  // Seed board meetings
  const meetings = [
    { title: 'Q2 2026 Board Meeting', date: '2026-06-15', type: 'Regular', status: 'Scheduled', loc: 'Boardroom A', by: userIds['board.sec@finance.gov.zw'] },
    { title: 'Audit Committee Meeting', date: '2026-05-20', type: 'Committee', status: 'Completed', loc: 'Virtual (Zoom)', by: userIds['board.sec@finance.gov.zw'] },
    { title: 'Special Board Session - Emergency', date: '2026-04-10', type: 'Special', status: 'Completed', loc: 'State House', by: userIds['board.sec@finance.gov.zw'] },
    { title: 'Q1 2026 Board Meeting', date: '2026-03-15', type: 'Regular', status: 'Completed', loc: 'Boardroom A', by: userIds['board.sec@finance.gov.zw'] },
  ];

  for (const m of meetings) {
    await run(
      `INSERT OR IGNORE INTO board_meetings (title, meeting_date, meeting_type, status, location, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
      [m.title, m.date, m.type, m.status, m.loc, m.by]
    );
  }
  console.log('Board meetings seeded');

  // Seed board actions
  const actions = [
    { desc: 'Approve revised risk appetite statement', assigned: userIds['ceo@finance.gov.zw'], due: '2026-06-30', status: 'Pending' },
    { desc: 'Review and approve ICT security upgrade budget', assigned: userIds['ceo@finance.gov.zw'], due: '2026-07-15', status: 'In Progress' },
    { desc: 'Finalize CEO performance contract 2026', assigned: userIds['ceo@finance.gov.zw'], due: '2026-01-31', status: 'Completed' },
    { desc: 'Appoint new Audit Committee Chair', assigned: userIds['board@finance.gov.zw'], due: '2026-05-01', status: 'Overdue' },
    { desc: 'Review NDS2 alignment progress report', assigned: userIds['strategy@finance.gov.zw'], due: '2026-06-20', status: 'Pending' },
    { desc: 'Approve whistleblower policy amendments', assigned: userIds['ceo@finance.gov.zw'], due: '2026-07-01', status: 'In Progress' },
    { desc: 'Endorse climate resilience fund allocation', assigned: userIds['ceo@finance.gov.zw'], due: '2026-08-15', status: 'Pending' },
    { desc: 'Review compliance attestation for Q2', assigned: userIds['compliance@finance.gov.zw'], due: '2026-07-10', status: 'Pending' },
  ];

  for (const a of actions) {
    await run(
      `INSERT OR IGNORE INTO board_actions (meeting_id, description, assigned_to, due_date, status) VALUES (?, ?, ?, ?, ?)`,
      [null, a.desc, a.assigned, a.due, a.status]
    );
  }
  console.log('Board actions seeded');

  // Seed incidents
  const incidents = [
    { case_id: 'INC-2026-001', type: 'Incident', severity: 'High', status: 'Investigating', desc: 'Unauthorized system access attempt detected', date: '2026-05-15', conf: 0, inv: userIds['auditor@finance.gov.zw'] },
    { case_id: 'INC-2026-002', type: 'Whistleblower', severity: 'Critical', status: 'Escalated', desc: 'Anonymous report of procurement irregularity', date: '2026-04-20', conf: 1, inv: userIds['auditor@finance.gov.zw'] },
    { case_id: 'INC-2026-003', type: 'Complaint', severity: 'Medium', status: 'Closed', desc: 'Staff grievance regarding workplace safety', date: '2026-03-10', conf: 0, inv: null },
    { case_id: 'INC-2026-004', type: 'Incident', severity: 'Critical', status: 'Investigating', desc: 'Data breach affecting 200 records', date: '2026-05-28', conf: 1, inv: userIds['auditor@finance.gov.zw'] },
    { case_id: 'INC-2026-005', type: 'Complaint', severity: 'Low', status: 'Closed', desc: 'Service delivery delay complaint', date: '2026-02-15', conf: 0, inv: null },
    { case_id: 'INC-2026-006', type: 'Whistleblower', severity: 'High', status: 'New', desc: 'Alleged conflict of interest in vendor selection', date: '2026-06-01', conf: 1, inv: userIds['auditor@finance.gov.zw'] },
    { case_id: 'INC-2026-007', type: 'Incident', severity: 'Medium', status: 'Investigating', desc: 'Phishing email campaign targeting finance staff', date: '2026-05-20', conf: 0, inv: userIds['auditor@finance.gov.zw'] },
    { case_id: 'INC-2026-008', type: 'Complaint', severity: 'Low', status: 'Closed', desc: 'Public complaint about website downtime', date: '2026-01-30', conf: 0, inv: null },
  ];

  for (const i of incidents) {
    await run(
      `INSERT OR IGNORE INTO incidents (case_id, incident_type, severity, status, description, received_date, confidentiality, investigator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [i.case_id, i.type, i.severity, i.status, i.desc, i.date, i.conf, i.inv]
    );
  }
  console.log('Incidents seeded');

  // Seed audit findings
  const findings = [
    { id: 'AF-2026-001', audit: 'Q1 Financial Audit', title: 'Inadequate segregation of duties in payments', rating: 'High', root: 'Staff shortage in finance', owner: userIds['auditor@finance.gov.zw'], due: '2026-07-15', status: 'Open' },
    { id: 'AF-2026-002', audit: 'Q1 Financial Audit', title: 'Missing evidence for 3 procurement awards', rating: 'Critical', root: 'Poor document retention policy', owner: userIds['compliance@finance.gov.zw'], due: '2026-06-30', status: 'Overdue' },
    { id: 'AF-2026-003', audit: 'ICT Security Review', title: 'Unpatched critical vulnerabilities in 2 servers', rating: 'High', root: 'Delayed patch management process', owner: userIds['auditor@finance.gov.zw'], due: '2026-06-15', status: 'Open' },
    { id: 'AF-2026-004', audit: 'PECOGA Compliance Review', title: 'Board minutes not signed within 14 days', rating: 'Medium', root: 'Manual signature process', owner: userIds['board.sec@finance.gov.zw'], due: '2026-05-30', status: 'Closed' },
    { id: 'AF-2026-005', audit: 'PECOGA Compliance Review', title: 'CEO performance contract not reviewed quarterly', rating: 'High', root: 'Lack of automated reminder system', owner: userIds['ceo@finance.gov.zw'], due: '2026-08-01', status: 'Open' },
    { id: 'AF-2026-006', audit: 'HR Audit', title: 'Incomplete background checks for 5 new hires', rating: 'Medium', root: 'Vendor delay in verification reports', owner: userIds['strategy@finance.gov.zw'], due: '2026-07-01', status: 'Open' },
    { id: 'AF-2026-007', audit: 'ICT Security Review', title: 'No formal disaster recovery plan tested', rating: 'High', root: 'Budget constraints for DR testing', owner: userIds['admin@finance.gov.zw'], due: '2026-09-01', status: 'Open' },
    { id: 'AF-2026-008', audit: 'Q1 Financial Audit', title: 'Revenue reconciliation discrepancies', rating: 'Medium', root: 'Manual reconciliation process', owner: userIds['tendai.m@finance.gov.zw'], due: '2026-06-20', status: 'Closed' },
  ];

  for (const f of findings) {
    await run(
      `INSERT OR IGNORE INTO audit_findings (finding_id, audit_name, title, risk_rating, root_cause, remediation_owner_id, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [f.id, f.audit, f.title, f.rating, f.root, f.owner, f.due, f.status]
    );
  }
  console.log('Audit findings seeded');

  console.log('\nSeed complete! Database is ready.');
  console.log('Default login: tendai.m@finance.gov.zw / demo123');
}

seed()
  .then(() => { db.close(); process.exit(0); })
  .catch(err => { console.error(err); db.close(); process.exit(1); });
