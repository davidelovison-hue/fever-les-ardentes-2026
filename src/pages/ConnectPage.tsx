import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConnectAlmostThereModal } from '../components/ConnectAlmostThereModal'
import { TicketingSiteFooter } from '../components/TicketingSiteFooter'
import { VerificationCodeInput } from '../components/VerificationCodeInput'
import { getFestivalEvent } from '../lib/festivalEvent'
import { placeholderGuestForPostBooking, type EventCheckoutState } from '../lib/checkoutState'
import {
  clearCheckoutFormDrafts,
  clearConnectFlow,
  persistCheckoutBasket,
  resolveEventCheckoutState,
  type ConnectFlowStep,
} from '../lib/checkoutFlowStorage'
import { readProfileReturnPath } from '../lib/profileNavigation'
import { accountPath, checkoutPath, guestCheckoutPath, planPath } from '../lib/routes'
import { emailToDisplayName, upsertUserSession } from '../lib/userSession'
import '../CheckoutPage.css'
import '../ConnectPage.css'

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

type ConnectStep = ConnectFlowStep

type SocialProvider = 'facebook' | 'google' | 'apple'

/** Demo OAuth identities — prototype only; each provider goes straight to checkout. */
const SOCIAL_DEMO_ACCOUNTS: Record<SocialProvider, { email: string; name: string }> = {
  facebook: { email: 'demo.facebook@gmail.com', name: 'Facebook User' },
  google: { email: 'demo.google@gmail.com', name: 'Google User' },
  apple: { email: 'demo.apple@icloud.com', name: 'Apple User' },
}

const emptyConnectForm = () => ({
  step: 'choose' as ConnectStep,
  email: '',
  verifyCode: '',
  touched: false,
  verifyTouched: false,
  resendNote: null as string | null,
})

export function ConnectPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const raw = location.state as unknown

  const data = useMemo(
    () => (eventId ? resolveEventCheckoutState(eventId, raw) : null),
    [eventId, raw],
  )

  const [step, setStep] = useState<ConnectStep>('choose')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyTouched, setVerifyTouched] = useState(false)
  const [resendNote, setResendNote] = useState<string | null>(null)
  const [showAlmostThere, setShowAlmostThere] = useState(false)

  useEffect(() => {
    if (eventId) clearCheckoutFormDrafts(eventId)
  }, [eventId])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [eventId, step])

  const resetConnectForm = () => {
    const next = emptyConnectForm()
    setStep(next.step)
    setEmail(next.email)
    setVerifyCode(next.verifyCode)
    setTouched(next.touched)
    setVerifyTouched(next.verifyTouched)
    setResendNote(next.resendNote)
  }

  const event = useMemo(
    () => (eventId ? getFestivalEvent(eventId) : null),
    [eventId],
  )

  const verifyFooterColumns = useMemo(() => {
    if (!eventId) return []
    const eventTitle = event?.title ?? 'Les Ardentes 2026'
    const ticketsHref = planPath(data?.returnHash ?? 'tickets')
    return [
      {
        title: 'Tickets',
        links: [
          { label: `${eventTitle} — General Admission`, href: ticketsHref },
          { label: `${eventTitle} — VIP`, href: ticketsHref },
        ],
      },
      {
        title: 'Support',
        links: [{ label: 'Customer Support', href: 'https://feverup.com/contact', external: true }],
      },
      {
        title: 'Policies',
        links: [
          { label: 'Purchase Agreement', href: 'https://feverup.com/legal/terms', external: true },
          { label: 'Privacy Policy', href: 'https://feverup.com/legal/privacy', external: true },
          { label: 'Terms and Conditions', href: 'https://feverup.com/legal/terms', external: true },
        ],
      },
    ]
  }, [event?.title, eventId])

  if (!eventId || !data) {
    return <Navigate to={eventId ? planPath('tickets') : '/'} replace />
  }

  const trimmedEmail = email.trim()
  const emailEmpty = touched && !trimmedEmail
  const emailBadFormat = touched && trimmedEmail.length > 0 && !isValidEmail(trimmedEmail)
  const emailErrorMsg = emailEmpty
    ? 'This field is required'
    : emailBadFormat
      ? 'Enter a valid email address.'
      : null
  const canContinueEmail = isValidEmail(trimmedEmail)
  const isProfile = data.authIntent === 'profile'

  const finishWithEmail = (rawEmail: string, displayName?: string) => {
    const trimmed = rawEmail.trim()
    if (!isValidEmail(trimmed)) return false
    const name = displayName?.trim() || emailToDisplayName(trimmed)
    upsertUserSession({ email: trimmed, name })
    const next: EventCheckoutState = { ...data, email: trimmed }
    persistCheckoutBasket(eventId, next)
    clearConnectFlow(eventId)
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    requestAnimationFrame(() => {
      if (isProfile) {
        navigate(accountPath(), {
          replace: true,
          state: { returnTo: readProfileReturnPath(location.state) },
        })
        return
      }
      const checkoutPayload = {
        ...next,
        guest: placeholderGuestForPostBooking(trimmed, name),
      }
      persistCheckoutBasket(eventId, checkoutPayload)
      navigate(checkoutPath(eventId), { state: checkoutPayload })
    })
    return true
  }

  const verifyIncomplete = verifyTouched && verifyCode.length < 6

  const sendEmailCode = () => {
    setTouched(true)
    setResendNote(null)
    if (!isValidEmail(trimmedEmail)) {
      document.getElementById('connect-email')?.focus()
      return
    }
    setVerifyCode('')
    setVerifyTouched(false)
    setStep('verify')
  }

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendEmailCode()
  }

  const confirmVerification = (code: string) => {
    if (code.length < 6) {
      setVerifyTouched(true)
      return
    }
    setShowAlmostThere(true)
  }

  const onAlmostThereSubmit = (firstName: string, lastName: string) => {
    setShowAlmostThere(false)
    finishWithEmail(trimmedEmail, `${firstName} ${lastName}`)
  }

  const onResendCode = () => {
    setVerifyCode('')
    setVerifyTouched(false)
    setResendNote('We sent a new code to your inbox.')
  }

  const onSocialContinue = (provider: SocialProvider) => {
    const account = SOCIAL_DEMO_ACCOUNTS[provider]
    upsertUserSession({ email: account.email, name: account.name })
    finishWithEmail(account.email)
  }

  const onGuestContinue = () => {
    const next: EventCheckoutState = { ...data, guestCheckout: true }
    persistCheckoutBasket(eventId, next)
    clearConnectFlow(eventId)
    navigate(guestCheckoutPath(eventId), { state: next })
  }

  if (step === 'verify') {
    return (
      <div className="connectPage connectPage--verify">
        <main className="connectPage__verifyMain">
          <section className="connectPage__verifyPanel" aria-labelledby="connect-verify-heading">
            <h1 id="connect-verify-heading" className="connectPage__verifyTitle">
              Check your inbox
            </h1>
            <p className="connectPage__verifyLead">
              Enter the 6-character code we sent to{' '}
              <strong className="connectPage__verifyEmail">{trimmedEmail}</strong> to initiate the login
              process.
            </p>
            <form
              className="connectPage__verifyForm"
              onSubmit={(e) => {
                e.preventDefault()
                setVerifyTouched(true)
                confirmVerification(verifyCode)
              }}
              noValidate
            >
              <label className="connectPage__verifyLabel" htmlFor="connect-verify-code">
                Verification Code
              </label>
              <VerificationCodeInput
                id="connect-verify-code"
                value={verifyCode}
                onChange={(code) => {
                  setVerifyCode(code)
                  if (verifyTouched) setVerifyTouched(false)
                }}
                onComplete={confirmVerification}
                invalid={verifyIncomplete}
                autoFocus
              />
              {verifyIncomplete && (
                <p className="connectPage__verifyError" role="alert">
                  This field is required
                </p>
              )}
              {resendNote && (
                <p className="connectPage__verifyResendNote" role="status">
                  {resendNote}
                </p>
              )}
              <p className="connectPage__verifyResend">
                Didn&apos;t receive the code?{' '}
                <button type="button" className="connectPage__verifyResendBtn" onClick={onResendCode}>
                  Resend
                </button>
              </p>
            </form>
          </section>
        </main>
        <TicketingSiteFooter columns={verifyFooterColumns} />
        <ConnectAlmostThereModal open={showAlmostThere} onSubmit={onAlmostThereSubmit} />
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="connectPage connectPage--emailStep">
        <main className="connectPage__main connectPage__main--email">
          <header className="connectPage__emailIntro">
            <h1 className="connectPage__emailTitle">
              {isProfile ? 'Sign in to continue' : 'Log in to continue'}
            </h1>
            <p className="connectPage__emailLead">
              We need to confirm your email address — it only takes a moment!
            </p>
          </header>

          <form className="connectPage__emailForm" onSubmit={onEmailSubmit} autoComplete="off" noValidate>
            <label className="connectPage__emailLabel" htmlFor="connect-email">
              Email
            </label>
            <input
              id="connect-email"
              type="email"
              name="connect-email-demo"
              autoComplete="off"
              inputMode="email"
              className={`connectPage__emailInput${emailErrorMsg ? ' connectPage__emailInput--invalid' : ''}`}
              placeholder="example@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (touched) setTouched(false)
              }}
              onBlur={() => setTouched(true)}
              aria-invalid={emailErrorMsg ? true : undefined}
              aria-describedby={emailErrorMsg ? 'connect-email-err' : undefined}
            />
            {emailErrorMsg && (
              <p id="connect-email-err" className="connectPage__emailError" role="alert">
                {emailErrorMsg}
              </p>
            )}
            <button
              type="submit"
              className={`connectPage__emailSubmit${canContinueEmail ? '' : ' connectPage__emailSubmit--disabled'}`}
              disabled={!canContinueEmail}
            >
              Continue
            </button>
          </form>

          <button type="button" className="connectPage__emailBack" onClick={resetConnectForm}>
            ← All sign-in options
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="connectPage">
      <main className="connectPage__main">
        <header className="connectPage__intro">
          <h1 className="connectPage__introTitle">
            {isProfile ? 'Sign in to your account' : 'Connect to continue'}
          </h1>
          <p className="connectPage__introLead">
            {isProfile
              ? 'Manage your tickets and account settings.'
              : 'Continue to purchase your ticket securely'}
          </p>
        </header>

        <div className="connectPage__card">
          <div className="connectPage__options">
                <button type="button" className="connectPage__optionBtn" onClick={() => onSocialContinue('facebook')}>
                  <span className="connectPage__optionIcon">
                    <SocialFacebook />
                  </span>
                  <span className="connectPage__optionLabel">Continue with Facebook</span>
                </button>
                <button type="button" className="connectPage__optionBtn" onClick={() => onSocialContinue('google')}>
                  <span className="connectPage__optionIcon">
                    <SocialGoogle />
                  </span>
                  <span className="connectPage__optionLabel">Continue with Google</span>
                </button>
                <button type="button" className="connectPage__optionBtn" onClick={() => onSocialContinue('apple')}>
                  <span className="connectPage__optionIcon">
                    <SocialApple />
                  </span>
                  <span className="connectPage__optionLabel">Continue with Apple</span>
                </button>
                <button type="button" className="connectPage__optionBtn" onClick={() => setStep('email')}>
                  <span className="connectPage__optionIcon">
                    <SocialEmail />
                  </span>
                  <span className="connectPage__optionLabel">Continue with your email</span>
                </button>
              </div>

              <div className="connectPage__divider" role="separator" aria-hidden>
                <span className="connectPage__dividerLine" />
                <span className="connectPage__dividerRing" />
                <span className="connectPage__dividerLine" />
              </div>

              <button
                type="button"
                className="connectPage__optionBtn connectPage__optionBtn--guest"
                onClick={onGuestContinue}
              >
                <span className="connectPage__optionIcon">
                  <GuestIcon />
                </span>
                <span className="connectPage__optionLabel">Continue as guest</span>
              </button>

          <p className="connectPage__legal">
            By continuing you accept the{' '}
            <a href="https://feverup.com/legal/terms" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>{' '}
            and the{' '}
            <a href="https://feverup.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  )
}

function SocialGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function SocialFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function SocialApple() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function SocialEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GuestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 20.5c1.2-3.2 4.2-5 6.5-5s5.3 1.8 6.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
