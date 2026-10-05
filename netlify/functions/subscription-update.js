import { ensureAdditiveSchema, handleOptions, json, query, safeError } from './db.js';
import { normalizeVendorName, OVERRIDE_SCOPES, OVERRIDE_STATUSES } from './_logic.js';

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    await ensureAdditiveSchema();
    const body = JSON.parse(event.body || '{}');
    if (!OVERRIDE_SCOPES.includes(body.override_scope)) return json(400, { error: 'Invalid override_scope' });
    if (!OVERRIDE_STATUSES.includes(body.status)) return json(400, { error: 'Invalid status' });
    const normalizedVendor = body.normalized_vendor || (body.vendor ? normalizeVendorName(body.vendor) : null);
    if (body.override_scope === 'message' && !body.messageid) return json(400, { error: 'messageid is required for message override' });
    if (body.override_scope === 'vendor' && !normalizedVendor) return json(400, { error: 'normalized_vendor or vendor is required for vendor override' });
    const rows = await query(`INSERT INTO subscription_overrides (override_scope, messageid, vendor_pattern, normalized_vendor, service_name, status, note, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,now())
      ON CONFLICT (${body.override_scope === 'message' ? 'messageid' : 'normalized_vendor'}) WHERE override_scope = '${body.override_scope === 'message' ? 'message' : 'vendor'}' ${body.override_scope === 'service' ? 'DO NOTHING' : 'DO UPDATE SET service_name = EXCLUDED.service_name, status = EXCLUDED.status, note = EXCLUDED.note, updated_at = now()'}
      RETURNING *`, [body.override_scope, body.messageid || null, body.vendor_pattern || null, normalizedVendor, body.service_name || null, body.status, body.note || null]);
    if (!rows.length && body.override_scope === 'service') {
      const inserted = await query('INSERT INTO subscription_overrides (override_scope, service_name, status, note, updated_at) VALUES ($1,$2,$3,$4,now()) RETURNING *', [body.override_scope, body.service_name || null, body.status, body.note || null]);
      return json(200, { ok: true, override: inserted[0] });
    }
    return json(200, { ok: true, override: rows[0] });
  } catch (error) { return safeError(error); }
}
