# Crypto Tracker — Fullstack (React + Express + SQLite + JWT)

## Como rodar (Windows/Mac/Linux)
1. Instale Node 18+ (recomendado 20+).
2. Na **raiz** do projeto:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
3. Copie as variáveis do backend:
   ```bash
   copy server\.env.example server\.env   # Windows
   # ou: cp server/.env.example server/.env (Mac/Linux)
   ```
   Edite `server/.env` e troque `JWT_SECRET` por uma chave forte (32+ chars).
4. Inicie **frontend + backend** juntos:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend:  http://localhost:4000 (`/api/health`)

## Fluxo
- Página inicial `"/"` → **Login**
- `"/register"` → Cadastro
- Após logar/cadastrar → **"/dashboard"** (protegida)

## Rotas de API
- `POST /api/auth/register` — `{ name, email, password, phone? }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/refresh` — `{ refreshToken }`
- `POST /api/auth/logout` — `{ refreshToken }`
- `GET  /api/users/me` — `Authorization: Bearer <accessToken>`

> Em produção, use **cookie HttpOnly** para o refresh token.
