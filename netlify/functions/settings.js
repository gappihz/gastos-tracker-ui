import { ensureAdditiveSchema, handleOptions, json, query, safeError } from './db.js';
import { DEFAULT_BUDGET, DEFAULT_REVENUE, FIXED_EXPENSES } from './_logic.js';

const DEFAULTS = { budget: DEFAULT_BUDGET, revenue: DEFAULT_REVENUE, fixedExpenses: FIXED_EXPENSES };

function sanitizeSettings(input = {}) {
  const budget = Number(input.budget);
  const revenue = Number(input.revenue);
  const fixedExpenses = Array.isArray(input.fixedExpenses) ? input.fixedExpenses.map(item => ({ name: String(item.name || '').trim(), amount: Number(item.amount) })).filter(item => item.name && Number.isFinite(item.amount)) : DEFAULTS.fixedExpenses;
  return {
    budget: Number.isFinite(budget) && budget >= 0 ? budget : DEFAULTS.budget,
    revenue: Number.isFinite(revenue) && revenue >= 0 ? revenue : DEFAULTS.revenue,
    fixedExpenses
  };
}

export async function getSettings() {
  const rows = await query("SELECT value FROM app_settings WHERE key = 'dashboard' LIMIT 1");
  return sanitizeSettings({ ...DEFAULTS, ...(rows[0]?.value || {}) });
}

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  try {
    await ensureAdditiveSchema();
    if (event.httpMethod === 'GET') return json(200, await getSettings());
    if (event.httpMethod === 'POST') {
      const settings = sanitizeSettings(JSON.parse(event.body || '{}'));
      const rows = await query("INSERT INTO app_settings (key, value, updated_at) VALUES ('dashboard', $1::jsonb, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() RETURNING value", [JSON.stringify(settings)]);
      return json(200, rows[0].value);
    }
    return json(405, { error: 'Method not allowed' });
  }
  catch (error) { return safeError(error); }
}
