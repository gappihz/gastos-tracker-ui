import { TREATMENTS } from '../config/constants.js';
import { parseAmount } from './money.js';
import { normalizeIsoDate } from './periods.js';

export function normalizeTransaction(row = {}) {
  const treatment = TREATMENTS.includes(row.budget_treatment) ? row.budget_treatment : 'normal';
  return {
    messageid: row.messageid || '',
    messagedate: normalizeIsoDate(row.messagedate),
    vendor: row.vendor || 'Unknown vendor',
    amount: parseAmount(row.amount),
    category: row.category || 'uncategorized',
    valid: row.valid === true,
    description: row.description || '',
    analyzed_at: row.analyzed_at || '',
    budget_treatment: treatment,
    budget_treatment_note: row.budget_treatment_note || ''
  };
}

export function normalizeTransactions(rows = []) {
  return rows.map(normalizeTransaction);
}
