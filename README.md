# PromptPilot Frontend

## Requirements
- Node.js **20.19+** (Vite 8 requirement)

## Install
```bash
cd /var/www/html/promptpilot-sep/frontend
npm install
```

## Run (development)
```bash
cd /var/www/html/promptpilot-sep/frontend
npm run dev
```

The frontend expects a backend API at `http://localhost:3000` in dev via a Vite proxy (`/api/*` → backend).

