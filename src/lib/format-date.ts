const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatMonth(monthDate: string): string {
  const [yearStr, monthStr] = monthDate.split("-");
  if (!yearStr || !monthStr) throw new Error(`expected YYYY-MM, got '${monthDate}'`);
  const monthIndex = Number(monthStr) - 1;
  const label = MONTHS[monthIndex];
  if (!label) throw new Error(`invalid month in '${monthDate}'`);
  return `${label} ${yearStr}`;
}

export function formatMonthRange(startDate: string, endDate: string | undefined): string {
  const start = formatMonth(startDate);
  if (endDate === undefined) return `${start} – Present`;
  if (endDate === startDate) return start;
  return `${start} – ${formatMonth(endDate)}`;
}
