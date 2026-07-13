import { useEffect, useId, useState } from 'react'
import '../ConnectAlmostThereModal.css'

type ConnectAlmostThereModalProps = {
  open: boolean
  onSubmit: (firstName: string, lastName: string) => void
}

export function ConnectAlmostThereModal({ open, onSubmit }: ConnectAlmostThereModalProps) {
  const titleId = useId()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (!open) {
      setFirstName('')
      setLastName('')
      return
    }
    const t = window.setTimeout(() => {
      document.getElementById('connect-almost-first')?.focus()
    }, 50)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0

  const onAccept = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(firstName.trim(), lastName.trim())
  }

  return (
    <div className="connectAlmostModal" role="presentation">
      <div
        className="connectAlmostModal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="connectAlmostModal__title">
          Almost there
        </h2>
        <p className="connectAlmostModal__lead">Complete your information.</p>

        <form className="connectAlmostModal__form" onSubmit={onAccept} noValidate>
          <input
            id="connect-almost-first"
            type="text"
            name="connect-almost-first-demo"
            className="connectAlmostModal__input"
            placeholder="Name"
            autoComplete="off"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            id="connect-almost-last"
            type="text"
            name="connect-almost-last-demo"
            className="connectAlmostModal__input connectAlmostModal__input--muted"
            placeholder="Surname"
            autoComplete="off"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button
            type="submit"
            className={`connectAlmostModal__submit${canSubmit ? '' : ' connectAlmostModal__submit--disabled'}`}
            disabled={!canSubmit}
          >
            Accept and continue
          </button>
        </form>
      </div>
    </div>
  )
}
