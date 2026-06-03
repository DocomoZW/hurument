const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/compliance/obligations
router.get('/obligations', authenticate, (req, res) => {
  db.all(`SELECT co.*, u.name as owner_name FROM compliance_obligations co LEFT JOIN users u ON co.owner_id = u.id ORDER BY co.due_date`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/compliance/policies
router.get('/policies', authenticate, (req, res) => {
  db.all(`SELECT p.*, u.name as approved_by_name FROM policies p LEFT JOIN users u ON p.approved_by = u.id ORDER BY p.next_review`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;