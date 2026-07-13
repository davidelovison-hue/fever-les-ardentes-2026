/** European dd/mm/yyyy helpers for guest date of birth. */

export const MIN_DOB_YEAR = 1990

export function minDobDate(): Date {
  return new Date(MIN_DOB_YEAR, 0, 1)
}

export function maxDobDate(): Date {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

/** Default month shown when the field is empty (earliest allowed year). */
export function defaultDobCalendarAnchor(): Date {
  return new Date(MIN_DOB_YEAR, 0, 1)
}

export function isDobSelectable(date: Date): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  return day >= minDobDate().getTime() && day <= maxDobDate().getTime()
}

export function clampDobViewYearMonth(
  year: number,
  month: number,
): { year: number; month: number } {
  const max = maxDobDate()
  let y = year
  let m = month
  if (y < MIN_DOB_YEAR) {
    y = MIN_DOB_YEAR
    m = 0
  }
  if (y > max.getFullYear()) {
    y = max.getFullYear()
    m = max.getMonth()
  }
  if (y === MIN_DOB_YEAR && m < 0) m = 0
  if (y === max.getFullYear() && m > max.getMonth()) m = max.getMonth()
  return { year: y, month: m }
}

export function isMinDobMonth(year: number, month: number): boolean {
  return year === MIN_DOB_YEAR && month === 0
}

export function isMaxDobMonth(year: number, month: number): boolean {
  const max = maxDobDate()
  return year === max.getFullYear() && month === max.getMonth()
}

export function formatDobInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function formatDateAsDob(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

export function parseDob(value: string): Date | null {
  const parts = value.trim().split('/')
  if (parts.length !== 3) return null
  const dd = Number(parts[0])
  const mm = Number(parts[1])
  const yyyy = Number(parts[2])
  if (!Number.isInteger(dd) || !Number.isInteger(mm) || !Number.isInteger(yyyy)) return null
  if (mm < 1 || mm > 12 || dd < 1) return null
  const d = new Date(yyyy, mm - 1, dd)
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null
  return d
}

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function dobMonthYearLabel(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday-first weekday index (0 = Mon … 6 = Sun). */
export function mondayFirstWeekday(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export type CalendarCell = {
  date: Date
  inMonth: boolean
}

export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const cells: CalendarCell[] = []
  const lead = mondayFirstWeekday(year, month)
  const total = daysInMonth(year, month)
  const prevTotal = daysInMonth(year, month - 1)

  for (let i = lead - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevTotal - i),
      inMonth: false,
    })
  }
  for (let d = 1; d <= total; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, next), inMonth: false })
    next += 1
  }
  return cells
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
