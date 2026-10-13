/** "2025", "2020 – 2021", or "2023 – present" when the end year has not been reached yet. */
export function formatYears(start?: number, end?: number): string {
  if (!start) return ''
  const thisYear = new Date().getFullYear()
  if (!end || end > thisYear) return `${start} – present`
  return start === end ? `${start}` : `${start} – ${end}`
}
