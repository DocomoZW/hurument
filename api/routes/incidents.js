const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/incidents
router.get('/', authenticate, (req, res) => {
  const { status, severity, incident_type } = req.query;
  let sql = `SELECT i.*, u.name as investigator_name FROM incidents i LEFT JOIN users u ON i.investigator_id = u.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ` AND i.status = ?`; params.push(status); }
  if (severity) { sql += ` AND i.severity = ?`; params.push(severity); }
  if (incident_type) { sql += ` AND i.incident_type = ?`; params.push(incident_type); }
  sql += ` ORDER BY i.received_date DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;