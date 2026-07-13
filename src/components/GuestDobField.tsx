import { useEffect, useId, useRef, useState } from 'react'
import {
  buildMonthGrid,
  clampDobViewYearMonth,
  defaultDobCalendarAnchor,
  dobMonthYearLabel,
  formatDateAsDob,
  formatDobInput,
  isDobSelectable,
  isMaxDobMonth,
  isMinDobMonth,
  isSameCalendarDay,
  maxDobDate,
  parseDob,
  type CalendarCell,
} from '../lib/dobFormat'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

type GuestDobFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  describedBy?: string
}

export function GuestDobField({ id, value, onChange, invalid, describedBy }: GuestDobFieldProps) {
  const [open, setOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const calendarId = useId()

  const parsed = parseDob(value)
  const today = maxDobDate()
  const anchorForView = parsed ?? defaultDobCalendarAnchor()
  const initialView = clampDobViewYearMonth(
    anchorForView.getFullYear(),
    anchorForView.getMonth(),
  )
  const [viewYear, setViewYear] = useState(initialView.year)
  const [viewMonth, setViewMonth] = useState(initialView.month)

  useEffect(() => {
    if (!open) return
    const p = parseDob(value)
    const anchor = p ?? defaultDobCalendarAnchor()
    const next = clampDobViewYearMonth(anchor.getFullYear(), anchor.getMonth())
    setViewYear(next.year)
    setViewMonth(next.month)
  }, [open, value])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const cells = buildMonthGrid(viewYear, viewMonth)
  const selected = parsed

  const pickDay = (cell: CalendarCell) => {
    if (!isDobSelectable(cell.date)) return
    onChange(formatDateAsDob(cell.date))
    setOpen(false)
  }

  const shiftMonth = (delta: number) => {
    const next = clampDobViewYearMonth(viewYear, viewMonth + delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  const atMinMonth = isMinDobMonth(viewYear, viewMonth)
  const atMaxMonth = isMaxDobMonth(viewYear, viewMonth)

  const onClear = () => {
    onChange('')
    setOpen(false)
  }

  const onToday = () => {
    onChange(formatDateAsDob(new Date()))
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`guestDobField${open ? ' guestDobField--open' : ''}${invalid ? ' guestDobField--invalid' : ''}`}
    >
      <div className="guestInputWrap guestDobField__inputWrap">
        <input
          id={id}
          type="text"
          className={`guestInput${invalid ? ' guestInput--invalid' : ''}`}
          inputMode="numeric"
          autoComplete="bday"
          placeholder="dd/mm/yyyy"
          value={value}
          onChange={(e) => onChange(formatDobInput(e.target.value))}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className={`guestDobField__calendarBtn${inputFocused || open ? ' guestDobField__calendarBtn--focus' : ''}`}
          aria-label="Open calendar"
          aria-expanded={open}
          aria-controls={calendarId}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div id={calendarId} className="guestDobCalendar" role="dialog" aria-label="Choose date of birth">
          <div className="guestDobCalendar__head">
            <button
              type="button"
              className="guestDobCalendar__monthBtn"
              aria-label={`${dobMonthYearLabel(viewYear, viewMonth)}`}
            >
              {dobMonthYearLabel(viewYear, viewMonth)}
              <span className="guestDobCalendar__monthChev" aria-hidden>
                ▾
              </span>
            </button>
            <div className="guestDobCalendar__nav">
              <button
                type="button"
                className="guestDobCalendar__navBtn"
                aria-label="Previous month"
                disabled={atMinMonth}
                onClick={() => shiftMonth(-1)}
              >
                ▲
              </button>
              <button
                type="button"
                className="guestDobCalendar__navBtn"
                aria-label="Next month"
                disabled={atMaxMonth}
                onClick={() => shiftMonth(1)}
              >
                ▼
              </button>
            </div>
          </div>

          <div className="guestDobCalendar__weekdays" aria-hidden>
            {WEEKDAYS.map((d, i) => (
              <span key={`${d}-${i}`} className="guestDobCalendar__weekday">
                {d}
              </span>
            ))}
          </div>

          <div className="guestDobCalendar__grid" role="grid">
            {cells.map((cell) => {
              const selectable = isDobSelectable(cell.date)
              const isSelected = selected ? isSameCalendarDay(cell.date, selected) : false
              const isToday = isSameCalendarDay(cell.date, today)
              return (
                <button
                  key={cell.date.toISOString()}
                  type="button"
                  role="gridcell"
                  disabled={!selectable}
                  className={[
                    'guestDobCalendar__day',
                    !cell.inMonth ? 'guestDobCalendar__day--outside' : '',
                    !selectable ? 'guestDobCalendar__day--disabled' : '',
                    isSelected ? 'guestDobCalendar__day--selected' : '',
                    isToday && !isSelected && selectable ? 'guestDobCalendar__day--today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => pickDay(cell)}
                >
                  {cell.date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="guestDobCalendar__foot">
            <button type="button" className="guestDobCalendar__action" onClick={onClear}>
              Clear
            </button>
            <button type="button" className="guestDobCalendar__action" onClick={onToday}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
