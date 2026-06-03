const express = require('express');
const { db } = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/dashboard
router.get('/dashboard', authenticate, (req, res) => {
  const stats = {};
  let pending = 6;

  db.get(`SELECT COUNT(*) as count FROM risks WHERE treatment_status IN ('Open','In Progress')`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.open_risks = row.count;
    if (--pending === 0) res.json(stats);
  });

  db.get(`SELECT COUNT(*) as count FROM compliance_obligations WHERE status = 'Non-Compliant'`, [], (err, row) => {
    if (!err) stats.non_compliant = row.count;
    if (--pending === 0) res.json(stats);
  });

  db.get(`SELECT COUNT(*) as count FROM board_actions WHERE status IN ('Pending','Overdue')`, [], (err, row) => {
    if (!err) stats.pending_actions = row.count;
    if (--pending === 0) res.json(stats);
  });

  db.get(`SELECT AVG(completion_pct) as avg FROM annual_outputs`, [], (err, row) => {
    if (!err) stats.kpi_attainment = row.avg ? Math.round(row.avg) : 0;
    if (--pending === 0) res.json(stats);
  });

  db.get(`SELECT COUNT(*) as count FROM incidents WHERE status != 'Closed'`, [], (err, row) => {
    if (!err) stats.open_incidents = row.count;
    if (--pending === 0) res.json(stats);
  });

  db.get(`SELECT COUNT(*) as count FROM audit_findings WHERE status IN ('Open','Overdue')`, [], (err, row) => {
    if (!err) stats.open_findings = row.count;
    if (--pending === 0) res.json(stats);
  });
});

module.exports = router;