const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit/findings
router.get('/findings', authenticate, (req, res) => {
  db.all(`SELECT af.*, u.name as remediation_owner_name FROM audit_findings af LEFT JOIN users u ON af.remediation_owner_id = u.id ORDER BY af.due_date`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;