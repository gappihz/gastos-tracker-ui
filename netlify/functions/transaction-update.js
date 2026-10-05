import { ensureAdditiveSchema, getTableName, handleOptions, json, query, safeError } from './db.js';
import { TREATMENTS } from './_logic.js';

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    await ensureAdditiveSchema();
    const table = getTableName();
    const body = JSON.parse(event.body || '{}');
    if (!body.messageid) return json(400, { error: 'messageid is required' });
    const sets = [];
    const values = [];
    if (body.budget_treatment !== undefined) { if (!TREATMENTS.includes(body.budget_treatment)) return json(400, { error: 'Invalid budget_treatment' }); values.push(body.budget_treatment); sets.push(`budget_treatment = $${values.length}`); }
    if (body.budget_treatment_note !== undefined) { values.push(body.budget_treatment_note || null); sets.push(`budget_treatment_note = $${values.length}`); }
    if (body.category !== undefined) { values.push(body.category); sets.push(`category = $${values.length}`); }
    if (body.description !== undefined) { values.push(body.description); sets.push(`description = $${values.length}`); }
    if (!sets.length) return json(400, { error: 'No update fields supplied' });
    values.push(body.messageid);
    const rows = await query(`UPDATE ${table} SET ${sets.join(', ')} WHERE messageid = $${values.length} RETURNING messageid, budget_treatment, budget_treatment_note, category, description`, values);
    return json(200, { ok: true, transaction: rows[0] || null });
  } catch (error) { return safeError(error); }
}
