const pad = value => String(value).padStart(2, '0');

export function toIsoDateParts(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function normalizeIsoDate(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date) return toIsoDateParts(value.getFullYear(), value.getMonth() + 1, value.getDate());
  return String(value).slice(0, 10);
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function getCurrentPeriodKey(date = new Date()) {
  return { year: date.getFullYear(), month: date.getMonth() + 1, half: date.getDate() <= 15 ? 1 : 2 };
}

export function periodFromKey({ year, month, half }) {
  const endDay = half === 1 ? 15 : daysInMonth(year, month);
  const startDay = half === 1 ? 1 : 16;
  return { year, month, half, start: toIsoDateParts(year, month, startDay), end: toIsoDateParts(year, month, endDay) };
}

export function getBiweeklyPeriod(dateLike = new Date()) {
  if (dateLike instanceof Date) return periodFromKey(getCurrentPeriodKey(dateLike));
  const [year, month, day] = normalizeIsoDate(dateLike).split('-').map(Number);
  return periodFromKey({ year, month, half: day <= 15 ? 1 : 2 });
}

export function currentMonthInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function shiftPeriod(period, direction) {
  let { year, month, half } = period.year ? period : getBiweeklyPeriod(period.start);
  if (direction > 0) {
    if (half === 1) half = 2; else { half = 1; month += 1; }
  } else {
    if (half === 2) half = 1; else { half = 2; month -= 1; }
  }
  if (month > 12) { month = 1; year += 1; }
  if (month < 1) { month = 12; year -= 1; }
  return periodFromKey({ year, month, half });
}

export function monthRange(year, month) {
  return { start: toIsoDateParts(year, month, 1), end: toIsoDateParts(year, month, daysInMonth(year, month)) };
}

export function sameMonth(dateA, dateB) {
  return normalizeIsoDate(dateA).slice(0, 7) === normalizeIsoDate(dateB).slice(0, 7);
}
