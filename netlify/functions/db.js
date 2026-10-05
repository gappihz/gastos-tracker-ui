import { neon } from '@neondatabase/serverless';

const TABLE_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function getTableName() {
  const table = process.env.TRANSACTIONS_TABLE || 'gastostracker';
  if (!TABLE_RE.test(table)) throw new Error('Invalid TRANSACTIONS_TABLE');
  return table;
}

export function getSql() {
  const url = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing DATABASE_URL or DATABASE_URL_POOLED');
  return neon(url);
}

export async function query(text, params = []) {
  const sql = getSql();
  return sql.query(text, params);
}

export async function ensureAdditiveSchema() {
  const table = getTableName();
  await query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS budget_treatment text DEFAULT 'normal'`);
  await query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS budget_treatment_note text`);
  await query(`CREATE TABLE IF NOT EXISTS subscription_overrides (
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
  )`);
  await query('CREATE INDEX IF NOT EXISTS idx_subscription_overrides_scope ON subscription_overrides (override_scope)');
  await query('CREATE INDEX IF NOT EXISTS idx_subscription_overrides_messageid ON subscription_overrides (messageid)');
  await query('CREATE INDEX IF NOT EXISTS idx_subscription_overrides_normalized_vendor ON subscription_overrides (normalized_vendor)');
  await query('CREATE INDEX IF NOT EXISTS idx_subscription_overrides_status ON subscription_overrides (status)');
  await query("CREATE UNIQUE INDEX IF NOT EXISTS uniq_subscription_override_message ON subscription_overrides (messageid) WHERE override_scope = 'message' AND messageid IS NOT NULL");
  await query("CREATE UNIQUE INDEX IF NOT EXISTS uniq_subscription_override_vendor ON subscription_overrides (normalized_vendor) WHERE override_scope = 'vendor' AND normalized_vendor IS NOT NULL");
  await query(`CREATE TABLE IF NOT EXISTS app_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamptz DEFAULT now()
  )`);
}

export function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }, body: JSON.stringify(body) };
}

export function handleOptions(event) {
  return event.httpMethod === 'OPTIONS' ? json(204, {}) : null;
}

export function safeError(error) {
  console.error(error);
  return json(500, { error: error.message?.includes('Missing DATABASE') ? error.message : 'Server error' });
}
