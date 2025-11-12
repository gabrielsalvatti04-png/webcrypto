const express = require('express');
const { get } = require('../lib/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  const row = await get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.sub]);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ user: row });
});

module.exports = router;
