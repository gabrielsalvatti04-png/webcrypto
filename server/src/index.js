const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { initDb } = require('./lib/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));
app.use(express.json());

app.get('/api/health', (req,res)=>res.json({ ok:true, ts: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

initDb().then(() => {
  app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
}).catch((e) => {
  console.error('❌ Failed to init DB', e);
  process.exit(1);
});

// Limpa tokens sempre que (re)iniciar o app em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
