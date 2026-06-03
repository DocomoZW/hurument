const express = require('express');
const { db } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/risks — list all risks
router.get('/', authenticate, (req, res) => {
  const { status, category, owner_id } = req.query;
  let sql = `
    SELECT r.*, u.name as owner_name, so.objective_code, so.title as objective_title
    FROM risks r
    LEFT JOIN users u ON r.risk_owner_id = u.id
    LEFT JOIN strategic_objectives so ON r.objective_id = so.id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ` AND r.treatment_status = ?`; params.push(status); }
  if (category) { sql += ` AND r.category = ?`; params.push(category); }
  if (owner_id) { sql += ` AND r.risk_owner_id = ?`; params.push(owner_id); }
  sql += ` ORDER BY r.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/risks/:id — single risk
router.get('/:id', authenticate, (req, res) => {
  db.get(`
    SELECT r.*, u.name as owner_name, so.objective_code, so.title as objective_title
    FROM risks r
    LEFT JOIN users u ON r.risk_owner_id = u.id
    LEFT JOIN strategic_objectives so ON r.objective_id = so.id
    WHERE r.id = ?
  `, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Risk not found.' });
    res.json(row);
  });
});

// POST /api/risks — create risk
router.post('/', authenticate, authorize(['risk_manager', 'risk_champion', 'ceo', 'system_admin']), (req, res) => {
  const {
    risk_id, title, description, category, objective_id,
    inherent_likelihood, inherent_impact,
    residual_likelihood, residual_impact,
    risk_owner_id, treatment_status, treatment_plan, due_date
  } = req.body;

  if (!risk_id || !title || !category) {
    return res.status(400).json({ error: 'risk_id, title, and category are required.' });
  }

  db.run(`
    INSERT INTO risks (risk_id, title, description, category, objective_id,
      inherent_likelihood, inherent_impact, residual_likelihood, residual_impact,
      risk_owner_id, treatment_status, treatment_plan, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    risk_id, title, description, category, objective_id || null,
    inherent_likelihood || 3, inherent_impact || 3,
    residual_likelihood || null, residual_impact || null,
    risk_owner_id || req.user.id, treatment_status || 'Open', treatment_plan || null, due_date || null
  ], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Risk ID already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, risk_id, title });
  });
});

// PUT /api/risks/:id — update risk
router.put('/:id', authenticate, authorize(['risk_manager', 'risk_champion', 'ceo', 'system_admin']), (req, res) => {
  const fields = [];
  const values = [];
  const allowed = ['title','description','category','objective_id','inherent_likelihood','inherent_impact','residual_likelihood','residual_impact','risk_owner_id','treatment_status','treatment_plan','due_date'];

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
  db.run(`UPDATE risks SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Risk not found.' });
    res.json({ updated: this.changes });
  });
});

// DELETE /api/risks/:id
router.delete('/:id', authenticate, authorize(['risk_manager', 'system_admin']), (req, res) => {
  db.run(`DELETE FROM risks WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Risk not found.' });
    res.json({ deleted: this.changes });
  });
});

// GET /api/risks/stats/heatmap — risk heatmap data
router.get('/stats/heatmap', authenticate, (req, res) => {
  db.all(`
    SELECT inherent_likelihood, inherent_impact, COUNT(*) as count
    FROM risks
    GROUP BY inherent_likelihood, inherent_impact
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
