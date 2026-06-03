const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/strategic/objectives
router.get('/objectives', authenticate, (req, res) => {
  const { nds2_pillar, status } = req.query;
  let sql = `
    SELECT so.*, u.name as owner_name
    FROM strategic_objectives so
    LEFT JOIN users u ON so.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];
  if (nds2_pillar) { sql += ` AND so.nds2_pillar = ?`; params.push(nds2_pillar); }
  if (status) { sql += ` AND so.status = ?`; params.push(status); }
  sql += ` ORDER BY so.start_date DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/strategic/objectives/:id
router.get('/objectives/:id', authenticate, (req, res) => {
  db.get(`
    SELECT so.*, u.name as owner_name
    FROM strategic_objectives so
    LEFT JOIN users u ON so.owner_id = u.id
    WHERE so.id = ?
  `, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Objective not found.' });
    res.json(row);
  });
});

// GET /api/strategic/objectives/:id/outputs
router.get('/objectives/:id/outputs', authenticate, (req, res) => {
  db.all(`SELECT * FROM annual_outputs WHERE objective_id = ? ORDER BY target_date`, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/strategic/objectives
router.post('/objectives', authenticate, authorize(['strategic_planning_officer', 'ceo', 'system_admin']), (req, res) => {
  const {
    objective_code, title, description, nds2_pillar, kra,
    owner_id, target_value, actual_value, unit,
    start_date, end_date, status
  } = req.body;

  if (!objective_code || !title || !nds2_pillar) {
    return res.status(400).json({ error: 'objective_code, title, and nds2_pillar are required.' });
  }

  db.run(`
    INSERT INTO strategic_objectives (objective_code, title, description, nds2_pillar, kra, owner_id, target_value, actual_value, unit, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [objective_code, title, description, nds2_pillar, kra || null, owner_id || null, target_value || null, actual_value || null, unit || null, start_date || null, end_date || null, status || 'On Track'], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Objective code already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, objective_code, title });
  });
});

// PUT /api/strategic/objectives/:id
router.put('/objectives/:id', authenticate, authorize(['strategic_planning_officer', 'ceo', 'system_admin']), (req, res) => {
  const fields = [];
  const values = [];
  const allowed = ['title','description','nds2_pillar','kra','owner_id','target_value','actual_value','unit','start_date','end_date','status'];

  allowed.forEach(key => {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  });

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update.' });
  }

  values.push(req.params.id);
  db.run(`UPDATE strategic_objectives SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Objective not found.' });
    res.json({ updated: this.changes });
  });
});

// POST /api/strategic/outputs
router.post('/outputs', authenticate, authorize(['strategic_planning_officer', 'ceo', 'system_admin']), (req, res) => {
  const { objective_id, output_code, description, target_date, completion_pct, status } = req.body;
  if (!objective_id || !output_code || !description) {
    return res.status(400).json({ error: 'objective_id, output_code, and description are required.' });
  }

  db.run(`INSERT INTO annual_outputs (objective_id, output_code, description, target_date, completion_pct, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [objective_id, output_code, description, target_date || null, completion_pct || 0, status || 'On Track'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, objective_id, output_code });
    }
  );
});

module.exports = router;
