import { useEffect, useId, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckoutPaymentMethods } from '../components/CheckoutPaymentMethods'
import { CheckoutSummaryCard } from '../components/CheckoutSummaryCard'
import {
  checkoutStateWithoutGuest,
  type EventCheckoutState,
  type GuestDetails,
  type PostBookingState,
} from '../lib/checkoutState'
import {
  clearCheckoutFormDrafts,
  persistCheckoutBasket,
  resolveEventCheckoutState,
} from '../lib/checkoutFlowStorage'
import { connectPath, planPath, postBookingPath } from '../lib/routes'
import { upsertUserSession } from '../lib/userSession'
import '../CheckoutPage.css'
import '../GuestCheckoutPage.css'

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

type GuestContactForm = {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  marketing: boolean
}

type GuestContactErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'confirmEmail', string>
>

function getContactErrors(form: GuestContactForm): GuestContactErrors {
  const errors: GuestContactErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!form.lastName.trim()) errors.lastName = 'Enter your last name.'
  if (!form.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.confirmEmail.trim()) {
    errors.confirmEmail = 'Confirm your email address.'
  } else if (form.confirmEmail.trim() !== form.email.trim()) {
    errors.confirmEmail = 'Email addresses do not match.'
  }
  return errors
}

function guestFromContact(form: GuestContactForm): GuestDetails {
  return {
    fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
    phoneCountryCode: '+34',
    phoneNational: '',
    dateOfBirth: '',
    gender: '',
  }
}

export function GuestCheckoutPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const emptyContactForm = (): GuestContactForm => ({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    marketing: false,
  })

  const [form, setForm] = useState<GuestContactForm>(emptyContactForm)
  const [touched, setTouched] = useState(false)
  const contactHeadingId = useId()

  const state = location.state as unknown
  const data = useMemo(() => {
    if (!eventId) return null
    const resolved = resolveEventCheckoutState(eventId, state)
    if (!resolved || resolved.guestCheckout !== true) return null
    return resolved
  }, [eventId, state])

  useEffect(() => {
    if (!eventId || !data) return
    persistCheckoutBasket(eventId, data)
  }, [eventId, data])

  useEffect(() => {
    if (eventId) clearCheckoutFormDrafts(eventId)
    setForm(emptyContactForm())
    setTouched(false)
  }, [eventId])

  const onBackToConnect = () => {
    if (eventId) clearCheckoutFormDrafts(eventId)
  }

  if (!eventId || !data) {
    return <Navigate to={eventId ? planPath('tickets') : '/'} replace />
  }

  const basketForConnect = checkoutStateWithoutGuest({ ...data, guestCheckout: undefined })
  const errors = getContactErrors(form)
  const contactValid = Object.keys(errors).length === 0

  const summaryPayload = {
    eventTitle: data.eventTitle,
    eventImage: data.eventImage,
    venue: data.venue,
    dateLine: data.dateLine,
    lines: data.lines,
    subtotal: data.subtotal,
    serviceFee: data.serviceFee,
    total: data.total,
  }

  const update = <K extends keyof GuestContactForm>(key: K, value: GuestContactForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onPay = () => {
    setTouched(true)
    if (!contactValid) return

    const email = form.email.trim()
    upsertUserSession({ email })
    const orderRef = `ARDE-${eventId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const payload: PostBookingState = {
      ...data,
      email,
      guest: guestFromContact(form),
      orderRef,
    }
    delete (payload as EventCheckoutState).guestCheckout
    persistCheckoutBasket(eventId, payload)
    navigate(postBookingPath(eventId), { state: payload })
  }

  return (
    <div className="checkoutPage guestCheckoutPage">
      <div className="checkoutPage__shell">
        <Link
          className="checkoutPage__back"
          to={connectPath(eventId)}
          state={basketForConnect}
          onClick={onBackToConnect}
        >
          <span className="checkoutPage__backArrow" aria-hidden>
            ←
          </span>
          Confirm and pay
        </Link>

        <div className="checkoutGrid">
          <section className="checkoutGrid__payment guestCheckoutPanel">
            <form
              className="guestCheckoutForm"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault()
                onPay()
              }}
              noValidate
            >
              <h2 id={contactHeadingId} className="guestCheckoutSectionTitle">
                Contact details
              </h2>

              <div className="guestCheckoutNameRow">
                <div className="guestCheckoutField">
                  <label className="guestCheckoutLabel" htmlFor="guest-first-name">
                    First name
                  </label>
                  <input
                    id="guest-first-name"
                    className={`guestCheckoutInput${touched && errors.firstName ? ' guestCheckoutInput--error' : ''}`}
                    type="text"
                    name="guest-first-name-demo"
                    autoComplete="off"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                  {touched && errors.firstName && (
                    <p className="guestCheckoutError" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="guestCheckoutField">
                  <label className="guestCheckoutLabel" htmlFor="guest-last-name">
                    Last name
                  </label>
                  <input
                    id="guest-last-name"
                    className={`guestCheckoutInput${touched && errors.lastName ? ' guestCheckoutInput--error' : ''}`}
                    type="text"
                    name="guest-last-name-demo"
                    autoComplete="off"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                  {touched && errors.lastName && (
                    <p className="guestCheckoutError" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="guestCheckoutField">
                <label className="guestCheckoutLabel" htmlFor="guest-email">
                  Email
                </label>
                <input
                  id="guest-email"
                  className={`guestCheckoutInput${touched && errors.email ? ' guestCheckoutInput--error' : ''}`}
                  type="email"
                  name="guest-email-demo"
                  autoComplete="off"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
                <p className="guestCheckoutHint">We will send your purchase confirmation to this email.</p>
                {touched && errors.email && (
                  <p className="guestCheckoutError" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="guestCheckoutField">
                <label className="guestCheckoutLabel" htmlFor="guest-confirm-email">
                  Confirm email
                </label>
                <input
                  id="guest-confirm-email"
                  className={`guestCheckoutInput${touched && errors.confirmEmail ? ' guestCheckoutInput--error' : ''}`}
                  type="email"
                  name="guest-confirm-email-demo"
                  autoComplete="off"
                  inputMode="email"
                  value={form.confirmEmail}
                  onChange={(e) => update('confirmEmail', e.target.value)}
                />
                <p className="guestCheckoutHint">Just to confirm your email is correct.</p>
                {touched && errors.confirmEmail && (
                  <p className="guestCheckoutError" role="alert">
                    {errors.confirmEmail}
                  </p>
                )}
              </div>

              <label className="guestCheckoutMarketing">
                <input
                  type="checkbox"
                  checked={form.marketing}
                  onChange={(e) => update('marketing', e.target.checked)}
                />
                <span>
                  I agree to receive news, recommendations and the privacy policy from Pacha and its partners.
                </span>
              </label>

              <hr className="guestCheckoutDivider" />

              <CheckoutPaymentMethods
                total={data.total}
                onPay={onPay}
                submitType="submit"
                showTermsAccept={false}
              />
            </form>
          </section>

          <aside className="checkoutGrid__summary" aria-label="Order summary">
            <CheckoutSummaryCard data={summaryPayload} />
          </aside>
        </div>
      </div>
    </div>
  )
}
