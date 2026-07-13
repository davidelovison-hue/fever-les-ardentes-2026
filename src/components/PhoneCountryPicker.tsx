import { useEffect, useId, useRef, useState } from 'react'
import { PHONE_COUNTRIES, phoneCountryByCode, type PhoneCountry } from '../lib/phoneCountries'

type PhoneCountryPickerProps = {
  value: string
  onChange: (code: string) => void
  id?: string
}

export function PhoneCountryPicker({ value, onChange, id }: PhoneCountryPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = phoneCountryByCode(value)

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

  const pick = (country: PhoneCountry) => {
    onChange(country.value)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`guestPhoneField__code${open ? ' guestPhoneField__code--open' : ''}`}
    >
      <button
        type="button"
        id={id}
        className="guestPhoneField__codeBtn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="guestPhoneField__flag" aria-hidden>
          {selected.flag}
        </span>
        <span className="guestPhoneField__codeValue">{selected.value}</span>
        <span className="guestPhoneField__chev" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul id={listId} className="guestPhoneDropdown" role="listbox" aria-label="Country code">
          {PHONE_COUNTRIES.map((country) => {
            const isActive = country.value === value
            return (
              <li key={country.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`guestPhoneDropdown__item${isActive ? ' guestPhoneDropdown__item--active' : ''}`}
                  onClick={() => pick(country)}
                >
                  <span className="guestPhoneDropdown__flag" aria-hidden>
                    {country.flag}
                  </span>
                  <span className="guestPhoneDropdown__name">
                    <span className="guestPhoneDropdown__namePrimary">{country.name}</span>
                    {country.nameAlt ? (
                      <span className="guestPhoneDropdown__nameAlt">{country.nameAlt}</span>
                    ) : null}
                  </span>
                  <span className="guestPhoneDropdown__code">{country.value}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
