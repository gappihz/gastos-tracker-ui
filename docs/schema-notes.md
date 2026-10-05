# Schema Notes

## Existing table

Main table: `gastostracker`

Unique identifier: `messageid`

Observed fields from sample data:

```txt
messageid text unique
messagedate date-like text
messagebody text
vendor text nullable
amount text numeric string nullable
category text nullable
valid boolean nullable
description text nullable
body_hash text nullable
analyzed_at timestamptz-like text nullable
```

## Additive budget migration

Do not recreate the table. Add only:

```sql
ALTER TABLE gastostracker
ADD COLUMN IF NOT EXISTS budget_treatment text DEFAULT 'normal';

ALTER TABLE gastostracker
ADD COLUMN IF NOT EXISTS budget_treatment_note text;
```

Allowed app-level values:

```txt
normal
big_purchase
monthly
```

## Budget calculation

- Only `valid = true`, numeric amount rows count.
- `normal`: full amount counts in the biweekly period containing `messagedate`.
- `big_purchase`: excluded from budget/projection variable totals.
- `monthly`: 50% counts in each biweekly period of the transaction calendar month.

## App settings table

Dashboard settings are persisted additively in a key/value table:

```sql
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

The v1 dashboard stores one row using `key = 'dashboard'` with:

```json
{
  "budget": 10000,
  "revenue": 41000,
  "fixedExpenses": [
    { "name": "House and Mamita", "amount": 13000 }
  ]
}
```

## Subscription overrides table

```sql
CREATE TABLE IF NOT EXISTS subscription_overrides (
  id bigserial PRIMARY KEY,
  override_scope text NOT NULL,
  messageid text NULL,
  vendor_pattern text NULL,
  normalized_vendor text NULL,
  service_name text NULL,
  status text NOT NULL,
  note text NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_overrides_scope ON subscription_overrides (override_scope);
CREATE INDEX IF NOT EXISTS idx_subscription_overrides_messageid ON subscription_overrides (messageid);
CREATE INDEX IF NOT EXISTS idx_subscription_overrides_normalized_vendor ON subscription_overrides (normalized_vendor);
CREATE INDEX IF NOT EXISTS idx_subscription_overrides_status ON subscription_overrides (status);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_subscription_override_message
ON subscription_overrides (messageid)
WHERE override_scope = 'message' AND messageid IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_subscription_override_vendor
ON subscription_overrides (normalized_vendor)
WHERE override_scope = 'vendor' AND normalized_vendor IS NOT NULL;
```

Override priority:

```txt
message > vendor > service > auto detection
```

Status values:

```txt
confirmed
ignored
renamed
manual
```

## Subscription detection v1

Confirmed auto-detection requires both:

```txt
category = 'subscriptions'
known vendor alias match
```

Known aliases include:

```txt
Anytime Fitness Southwood
OpenAI / ChatGPT
Disney Plus
Apple.com/Bill
Google One
Canva
ZWIFT
```

Generic recurrence is not used as confirmed detection in v1 to avoid false positives from vendors such as Grab, Shopee, Mercury Drug, restaurants, transport, or shopping vendors.
