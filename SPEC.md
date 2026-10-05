# Gastos Tracker UI Specification

## Security Notice

This spec previously contained live database and object-storage credentials. They have been removed. Treat the exposed credentials as compromised and rotate them before deploying or sharing this repository.

Secrets must be configured only through local `.env` files or Netlify environment variables. Do not commit real values.

Required environment variables:

```txt
DATABASE_URL=<set locally or in Netlify>
DATABASE_URL_POOLED=<set locally or in Netlify>
TRANSACTIONS_TABLE=gastostracker
```

Optional storage variables, not used by v1:

```txt
AWS_ENDPOINT_URL_S3=<set only if storage features are added>
AWS_ACCESS_KEY_ID=<set only if storage features are added>
AWS_SECRET_ACCESS_KEY=<set only if storage features are added>
AWS_REGION=<set only if storage features are added>
```

## Product Goal

Lightweight Vite + Vanilla JavaScript dashboard for the existing `gastostracker` database table.

## Pages

- Budget
- Projection
- Subscriptions
- Settings

## Budget Rules

- Biweekly budget default: PHP 10,000.
- First period: day 1-15.
- Second period: day 16-end of month.
- `normal`: full amount counts in the transaction's biweekly period.
- `big_purchase`: amount is excluded from budget totals.
- `monthly`: amount is split 50/50 across both biweekly periods of the transaction month.

## Subscription Rules

- Auto-detect confirmed subscriptions by `category='subscriptions'` plus known vendor aliases.
- User corrections live in the separate `subscription_overrides` table and override auto detection.
- Generic recurrence alone is not a confirmed subscription in v1.

## Theme

Sharp Cappuccino Dashboard: cappuccino colors, flat grid layout, minimal radius, thin borders, strong alignment.
