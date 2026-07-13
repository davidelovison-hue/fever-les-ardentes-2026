import { useEffect, useState } from 'react'
import { getUserSession } from '../lib/userSession'
import '../CheckoutPage.css'
import '../ProfileActionModal.css'

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

export type ProfileActionId =
  | 'deletePayment'
  | 'changeEmail'
  | 'communicationPrefs'
  | 'logout'

export type ProfileActionConfirmPayload = {
  newEmail?: string
  marketingEmails?: boolean
}

type ProfileActionModalProps = {
  action: ProfileActionId | null
  currentEmail?: string
  onClose: () => void
  onConfirm?: (payload?: ProfileActionConfirmPayload) => void
}

const COPY: Record<
  ProfileActionId,
  { title: string; body: string; confirm?: string; destructive?: boolean }
> = {
  deletePayment: {
    title: 'Remove payment methods',
    body: 'Saved cards on your account will be removed. This action cannot be undone.',
    confirm: 'Remove methods',
    destructive: true,
  },
  changeEmail: {
    title: 'Change your email',
    body: 'Enter your new address. We will send a verification link to confirm the change.',
    confirm: 'Save email',
  },
  communicationPrefs: {
    title: 'Notification preferences',
    body: '',
  },
  logout: {
    title: 'Log out',
    body: 'Are you sure you want to log out on this device?',
    confirm: 'Log out',
    destructive: true,
  },
}

export function ProfileActionModal({
  action,
  currentEmail = '',
  onClose,
  onConfirm,
}: ProfileActionModalProps) {
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [marketingEmails, setMarketingEmails] = useState(true)

  useEffect(() => {
    if (!action) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
    }
  }, [action, onClose])

  useEffect(() => {
    if (action === 'changeEmail') {
      setNewEmail('')
      setEmailError(null)
    }
    if (action === 'communicationPrefs') {
      const session = getUserSession()
      setMarketingEmails(session?.marketingEmails ?? true)
    }
  }, [action])

  if (!action) return null

  const copy = COPY[action]
  const isChangeEmail = action === 'changeEmail'
  const isCommunicationPrefs = action === 'communicationPrefs'

  const onMarketingToggle = () => {
    const next = !marketingEmails
    setMarketingEmails(next)
    ;(onConfirm ?? onClose)({ marketingEmails: next })
  }

  const handleConfirm = () => {
    if (isChangeEmail) {
      const trimmed = newEmail.trim()
      if (!isValidEmail(trimmed)) {
        setEmailError('Enter a valid email address.')
        return
      }
      if (trimmed.toLowerCase() === currentEmail.trim().toLowerCase()) {
        setEmailError('Your new email must be different from your current one.')
        return
      }
      ;(onConfirm ?? onClose)({ newEmail: trimmed })
      return
    }
    ;(onConfirm ?? onClose)()
  }

  const onEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleConfirm()
  }

  if (isCommunicationPrefs) {
    return (
      <div className="profileModal" role="presentation" onClick={onClose}>
        <div
          className="profileModal__card profileModal__card--prefs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="profileModal__prefsHead">
            <h2 id="profile-modal-title" className="profileModal__prefsTitle">
              {copy.title}
            </h2>
            <button
              type="button"
              className="profileModal__close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <div className="profileModal__prefsBody">
            <div className="profileModal__prefRow">
              <div className="profileModal__prefText">
                <p className="profileModal__prefLabel">Marketing emails</p>
                <p className="profileModal__prefHint">
                  Receive communications with the latest news, updates and exclusive offers
                </p>
              </div>
              <button
                type="button"
                role="switch"
                className={`profileModal__toggle${marketingEmails ? ' profileModal__toggle--on' : ''}`}
                aria-checked={marketingEmails}
                aria-label="Marketing emails"
                onClick={onMarketingToggle}
              >
                <span className="profileModal__toggleThumb" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profileModal" role="presentation" onClick={onClose}>
      <div
        className="profileModal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="profile-modal-title" className="profileModal__title">
          {copy.title}
        </h2>
        {copy.body ? <p className="profileModal__body">{copy.body}</p> : null}

        {isChangeEmail && (
          <form className="profileModal__form" onSubmit={onEmailFormSubmit} noValidate>
            <div className="profileModal__field">
              <span className="profileModal__label">Current email</span>
              <p className="profileModal__currentEmail">{currentEmail}</p>
            </div>
            <div className="profileModal__field">
              <label className="profileModal__label" htmlFor="profile-new-email">
                New email
              </label>
              <input
                id="profile-new-email"
                type="email"
                name="newEmail"
                autoComplete="email"
                className={`profileModal__input${emailError ? ' profileModal__input--invalid' : ''}`}
                placeholder="you@email.com"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  if (emailError) setEmailError(null)
                }}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? 'profile-email-error' : undefined}
              />
              {emailError && (
                <p id="profile-email-error" className="profileModal__error" role="alert">
                  {emailError}
                </p>
              )}
            </div>
          </form>
        )}

        <div className="profileModal__actions">
          <button type="button" className="profileModal__btn profileModal__btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`profileModal__btn${copy.destructive ? ' profileModal__btn--danger' : ' profileModal__btn--primary'}`}
            onClick={handleConfirm}
          >
            {copy.confirm ?? 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}
