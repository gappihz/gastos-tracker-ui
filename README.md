# Gastos Tracker UI

Lightweight Vite + Vanilla JavaScript dashboard with Netlify Functions for the existing `gastostracker` table.

## Security

Do not commit real credentials. The original spec contained live credentials; rotate the exposed Neon/S3 credentials before deployment.

## Local setup

```bash
npm install
cp .env.example .env
```

Fill `.env` locally:

```txt
DATABASE_URL=...
DATABASE_URL_POOLED=...
TRANSACTIONS_TABLE=gastostracker
```

Run frontend only:

```bash
npm run dev
```

Run with Netlify Functions:

```bash
netlify dev
```

## Build

```bash
npm run build
npm run preview
```

## Netlify settings

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Configure secrets in Netlify environment variables only:

```txt
DATABASE_URL
DATABASE_URL_POOLED
TRANSACTIONS_TABLE=gastostracker
```

## Pages

- Budget: biweekly budget meter and treatment-aware transaction list.
- Projection: revenue minus fixed and variable expenses.
- Subscriptions: alias-based subscription detection with user overrides.
- Settings: v1 defaults.
