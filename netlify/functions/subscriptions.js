import { ensureAdditiveSchema, getTableName, handleOptions, json, query, safeError } from './db.js';
import { groupSubscriptions, normalizeTransaction } from './_logic.js';

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  try {
    await ensureAdditiveSchema();
    const table = getTableName();
    const params = event.queryStringParameters || {};
    const includeHistory = params.includeHistory !== 'false';
    let { start, end } = params;
    if (!start || !end) {
      const latest = await query(`SELECT max(messagedate)::text AS latest_date FROM ${table} WHERE category = 'subscriptions' AND valid = true`);
      const latestDate = latest[0]?.latest_date ? String(latest[0].latest_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
      const [year, month] = latestDate.split('-').map(Number);
      start = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
      end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }
    const txRows = await query(`SELECT messageid, messagedate::text AS messagedate, messagebody, vendor, amount, category, valid, description, analyzed_at, budget_treatment, budget_treatment_note FROM ${table} WHERE messagedate >= $1::date AND messagedate <= $2::date ORDER BY messagedate DESC`, [start, end]);
    const overrides = await query('SELECT id, override_scope, messageid, vendor_pattern, normalized_vendor, service_name, status, note FROM subscription_overrides ORDER BY updated_at DESC');
    return json(200, { subscriptions: groupSubscriptions(txRows.map(normalizeTransaction), overrides, includeHistory), period: { start, end }, meta: { detectionMode: 'auto_alias_plus_user_overrides', confirmedOnly: true, excludedGenericRecurrence: true, overridePriority: ['message', 'vendor', 'service', 'auto'] } });
  } catch (error) { return safeError(error); }
}
