const express = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../lib/db');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}
function signRefreshToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Dados inválidos', issues: parsed.error.issues });
  const { name, email, password, phone } = parsed.data;
  const emailNorm = email.toLowerCase().trim();

  const exists = await get('SELECT id FROM users WHERE email = ?', [emailNorm]);
  if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const ins = await run('INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)', [name.trim(), emailNorm, hash, phone || null]);
  const user = { id: ins.lastID, name, email: emailNorm, role: 'user' };

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  await run('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, refreshToken, expiresAt]);

  res.status(201).json({ user, accessToken, refreshToken });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Dados inválidos', issues: parsed.error.issues });
  const { email, password } = parsed.data;
  const emailNorm = email.toLowerCase().trim();

  const row = await get('SELECT * FROM users WHERE email = ?', [emailNorm]);
  if (!row) return res.status(401).json({ error: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  await run('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, refreshToken, expiresAt]);

  res.json({ user, accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token ausente' });
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
  const tk = await get(`SELECT rt.*, u.name, u.email, u.role
                        FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
                        WHERE rt.token = ?`, [refreshToken]);
  if (!tk) return res.status(401).json({ error: 'Refresh token não encontrado' });
  if (new Date(tk.expires_at).getTime() < Date.now()) return res.status(401).json({ error: 'Refresh expirado' });
  const user = { id: tk.user_id, name: tk.name, email: tk.email, role: tk.role };
  const accessToken = signAccessToken(user);
  res.json({ accessToken });
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken) await run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
  res.json({ ok: true });
});

module.exports = router;
