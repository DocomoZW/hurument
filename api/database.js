const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'grc-nexus.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Enable foreign keys
 db.run('PRAGMA foreign_keys = ON');

// --- SCHEMA CREATION ---
const initSchema = () => {
  const schemaSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('system_admin', 'risk_manager', 'compliance_officer', 'internal_auditor', 'board_member', 'board_secretary', 'ceo', 'strategic_planning_officer', 'risk_champion', 'standard_staff')),
      department TEXT,
      institution TEXT DEFAULT 'Ministry of Finance',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS strategic_objectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      objective_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      nds2_pillar TEXT NOT NULL,
      kra TEXT,
      owner_id INTEGER,
      target_value REAL,
      actual_value REAL,
      unit TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'On Track' CHECK(status IN ('On Track', 'At Risk', 'Off Track', 'Completed')),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS annual_outputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      objective_id INTEGER NOT NULL,
      output_code TEXT NOT NULL,
      description TEXT NOT NULL,
      target_date TEXT,
      completion_pct REAL DEFAULT 0,
      status TEXT DEFAULT 'On Track' CHECK(status IN ('On Track', 'At Risk', 'Off Track', 'Completed')),
      FOREIGN KEY (objective_id) REFERENCES strategic_objectives(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      risk_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      objective_id INTEGER,
      inherent_likelihood INTEGER CHECK(inherent_likelihood BETWEEN 1 AND 5),
      inherent_impact INTEGER CHECK(inherent_impact BETWEEN 1 AND 5),
      residual_likelihood INTEGER CHECK(residual_likelihood BETWEEN 1 AND 5),
      residual_impact INTEGER CHECK(residual_impact BETWEEN 1 AND 5),
      risk_owner_id INTEGER,
      treatment_status TEXT DEFAULT 'Open' CHECK(treatment_status IN ('Open', 'In Progress', 'Overdue', 'Closed')),
      treatment_plan TEXT,
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (objective_id) REFERENCES strategic_objectives(id),
      FOREIGN KEY (risk_owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS compliance_obligations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regulation TEXT NOT NULL,
      obligation TEXT NOT NULL,
      due_date TEXT,
      evidence_required TEXT,
      status TEXT DEFAULT 'Compliant' CHECK(status IN ('Compliant', 'Non-Compliant', 'Due Soon')),
      owner_id INTEGER,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      version TEXT,
      content TEXT,
      last_reviewed TEXT,
      next_review TEXT,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Under Review', 'Expired', 'Draft')),
      approved_by INTEGER,
      FOREIGN KEY (approved_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS board_meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      meeting_date TEXT NOT NULL,
      meeting_type TEXT,
      status TEXT DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
      location TEXT,
      minutes TEXT,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS board_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meeting_id INTEGER,
      description TEXT NOT NULL,
      assigned_to INTEGER,
      due_date TEXT,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Progress', 'Overdue', 'Completed')),
      FOREIGN KEY (meeting_id) REFERENCES board_meetings(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id TEXT UNIQUE NOT NULL,
      incident_type TEXT NOT NULL CHECK(incident_type IN ('Incident', 'Whistleblower', 'Complaint')),
      severity TEXT NOT NULL CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')),
      status TEXT DEFAULT 'New' CHECK(status IN ('New', 'Investigating', 'Escalated', 'Closed')),
      description TEXT,
      received_date TEXT,
      confidentiality INTEGER DEFAULT 0,
      investigator_id INTEGER,
      resolution TEXT,
      FOREIGN KEY (investigator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_findings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      finding_id TEXT UNIQUE NOT NULL,
      audit_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      risk_rating TEXT CHECK(risk_rating IN ('Critical', 'High', 'Medium', 'Low')),
      root_cause TEXT,
      remediation_owner_id INTEGER,
      due_date TEXT,
      management_response TEXT,
      status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'Overdue', 'Closed')),
      FOREIGN KEY (remediation_owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  return new Promise((resolve, reject) => {
    db.exec(schemaSQL, (err) => {
      if (err) {
        console.error('Schema initialization failed:', err.message);
        reject(err);
      } else {
        console.log('Database schema initialized successfully');
        resolve();
      }
    });
  });
};

module.exports = { db, initSchema };
