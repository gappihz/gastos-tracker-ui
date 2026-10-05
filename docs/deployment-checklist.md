# Deployment Checklist

## Before deploy

- Rotate previously exposed Neon credentials.
- Rotate previously exposed S3 credentials if still active.
- Confirm no real secrets are committed.
- Configure Netlify environment variables:
  - `DATABASE_URL`
  - `DATABASE_URL_POOLED`
  - `TRANSACTIONS_TABLE=gastostracker`

## Verify locally

```bash
npm install
npm run build
netlify dev
```

Function smoke tests:

```bash
curl "http://localhost:8888/.netlify/functions/settings"
curl "http://localhost:8888/.netlify/functions/transactions"
curl "http://localhost:8888/.netlify/functions/summary?start=2026-10-01&end=2026-10-15"
curl "http://localhost:8888/.netlify/functions/projection?start=2026-10-01&end=2026-10-15"
curl "http://localhost:8888/.netlify/functions/subscriptions?includeHistory=true"
```

## Netlify

- Build command: `npm run build`
- Publish: `dist`
- Functions: `netlify/functions`
