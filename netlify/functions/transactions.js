import { ensureAdditiveSchema, getTableName, handleOptions, json, query, safeError } from './db.js';
import { normalizeTransaction } from './_logic.js';

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  try {
    await ensureAdditiveSchema();
    const table = getTableName();
    const params = event.queryStringParameters || {};
    const values = [];
    const where = [];
    if (params.start) { values.push(params.start); where.push(`messagedate >= $${values.length}::date`); }
    if (params.end) { values.push(params.end); where.push(`messagedate <= $${values.length}::date`); }
    if (params.valid === 'true' || params.valid === 'false') { values.push(params.valid === 'true'); where.push(`valid = $${values.length}`); }
    if (params.category) { values.push(params.category); where.push(`category = $${values.length}`); }
    const sql = `SELECT messageid, messagedate::text AS messagedate, vendor, amount, category, valid, description, analyzed_at, budget_treatment, budget_treatment_note FROM ${table} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY messagedate DESC, analyzed_at DESC NULLS LAST LIMIT 500`;
    const rows = await query(sql, values);
    return json(200, { transactions: rows.map(normalizeTransaction) });
  } catch (error) { return safeError(error); }
}
