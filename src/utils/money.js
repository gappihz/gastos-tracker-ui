export function parseAmount(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatPHP(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(amount);
}
