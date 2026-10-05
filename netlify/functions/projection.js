import { ensureAdditiveSchema, getTableName, handleOptions, json, query, safeError } from './db.js';
import { normalizeTransaction, summarize } from './_logic.js';
import { getSettings } from './settings.js';

export async function handler(event) {
  const options = handleOptions(event); if (options) return options;
  try {
    await ensureAdditiveSchema();
    const table = getTableName();
    const { start, end } = event.queryStringParameters || {};
    if (!start || !end) return json(400, { error: 'start and end are required' });
    const [year, month] = start.slice(0, 7).split('-').map(Number);
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    const rows = await query(`SELECT messageid, messagedate::text AS messagedate, vendor, amount, category, valid, description, analyzed_at, budget_treatment, budget_treatment_note FROM ${table} WHERE messagedate >= $1::date AND messagedate <= $2::date`, [monthStart, monthEnd]);
    const settings = await getSettings();
    const summary = summarize(rows.map(normalizeTransaction), { start, end }, settings.budget);
    const fixedExpensesTotal = settings.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
    return json(200, { revenue: settings.revenue, fixedExpenses: settings.fixedExpenses, fixedExpensesTotal, variableExpensesTotal: summary.spent, projectedRemaining: settings.revenue - fixedExpensesTotal - summary.spent, categoryBreakdown: summary.categoryTotals, treatmentTotals: summary.treatmentTotals });
  } catch (error) { return safeError(error); }
}
