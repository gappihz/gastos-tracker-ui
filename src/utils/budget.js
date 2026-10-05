import { sameMonth } from './periods.js';

export function getIncludedAmountForPeriod(transaction, period) {
  if (!transaction.valid || transaction.amount === null || !transaction.messagedate) return 0;
  if (transaction.budget_treatment === 'big_purchase') return 0;
  if (transaction.budget_treatment === 'monthly') return sameMonth(transaction.messagedate, period.start) ? transaction.amount / 2 : 0;
  return transaction.messagedate >= period.start && transaction.messagedate <= period.end ? transaction.amount : 0;
}

export function summarizeBudget(transactions, period, budget) {
  const treatmentTotals = { normal: 0, monthly: 0, big_purchase: 0 };
  const categoryTotals = new Map();
  let spent = 0;
  for (const tx of transactions) {
    const included = getIncludedAmountForPeriod(tx, period);
    if (tx.budget_treatment === 'big_purchase' && tx.valid && tx.amount) treatmentTotals.big_purchase += tx.amount;
    if (included > 0) {
      treatmentTotals[tx.budget_treatment] += included;
      spent += included;
      const current = categoryTotals.get(tx.category) || { category: tx.category, total: 0, count: 0 };
      current.total += included;
      current.count += 1;
      categoryTotals.set(tx.category, current);
    }
  }
  const remaining = budget - spent;
  return { spent, remaining, percentSpent: Math.min(100, Math.max(0, (spent / budget) * 100)), treatmentTotals, categoryTotals: [...categoryTotals.values()] };
}
