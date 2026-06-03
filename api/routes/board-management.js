const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/board/meetings
router.get('/meetings', authenticate, (req, res) => {
  db.all(`SELECT bm.*, u.name as created_by_name FROM board_meetings bm LEFT JOIN users u ON bm.created_by = u.id ORDER BY bm.meeting_date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/board/actions
router.get('/actions', authenticate, (req, res) => {
  db.all(`SELECT ba.*, u.name as assigned_to_name, bm.title as meeting_title FROM board_actions ba LEFT JOIN users u ON ba.assigned_to = u.id LEFT JOIN board_meetings bm ON ba.meeting_id = bm.id ORDER BY ba.due_date`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;