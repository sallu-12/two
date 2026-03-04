# Bolzaa Studio - Full Stack Deployment

**Frontend**: React + Vite + Tailwind → **Vercel**  
**Backend**: Express.js + Email API → **Render**

## Structure

```
├── frontend/         (React + Vite - Vercel deploys this)
│   ├── src/
│   ├── vite.config.ts
│   ├── vercel.json   (SPA routing)
│   └── package.json
├── backend/          (Express API - Render deploys this)
│   ├── server.ts
│   ├── .env.local    (env variables - NOT in git)
│   └── package.json
└── render.yaml       (Render backend configuration)
```

## Deployment

### Frontend (Vercel)
1. Connect `sallu-12/two` repo to Vercel
2. Set root directory: `frontend`
3. Auto-deploys on push
4. URL: `https://bolzaa-frontend.vercel.app`

### Backend (Render)
1. Connect `sallu-12/two` repo to Render
2. Use `render.yaml` for auto-configuration
3. Auto-deploys on push  
4. URL: `https://bolzaa-backend.onrender.com`

## Environment Variables

Backend uses `.env.local` (Git ignored):
```
PORT=3001
NODE_ENV=production
ADMIN_EMAIL=bolzaa277@gmail.com
EMAIL_PASS=wvbe qofj xcdm axbx
ALLOWED_ORIGINS=https://bolzaa-frontend.vercel.app
```

## Quick Start (Local)

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 (frontend default port)
