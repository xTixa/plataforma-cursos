# Plataforma de Cursos Online

Aplicação full-stack com Angular (frontend) e Node.js/Express + MongoDB Atlas (backend).

## Estrutura

```
plataforma-cursos/
├── backend/    # API REST (Node.js, Express, MongoDB Atlas)
└── frontend/   # SPA (Angular, Angular Material)
```

## Como correr

**Backend** (`http://localhost:3000`):

```bash
cd backend
npm install
npm run dev
```

Configura `backend/.env` a partir de `backend/.env.example` antes de arrancar.

**Frontend** (`http://localhost:4200`):

```bash
cd frontend
npm install
npm start
```

Consulta [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md) (se existirem) para mais detalhes de cada parte.
