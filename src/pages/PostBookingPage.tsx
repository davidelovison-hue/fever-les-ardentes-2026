import { useLayoutEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { GuestDobField } from '../components/GuestDobField'
import { PhoneCountryPicker } from '../components/PhoneCountryPicker'
import {
  isPostBookingState,
  type GuestDetails,
  type OrderConfirmationState,
} from '../lib/checkoutState'
import { readCheckoutBasket } from '../lib/checkoutFlowStorage'
import { persistOrderConfirmation } from '../lib/orderConfirmStorage'
import { planPath, orderConfirmationPath } from '../lib/routes'
import { formatDobInput } from '../lib/dobFormat'
import { scrollPageToTop } from '../lib/scrollPageToTop'
import { phoneCountryByCode } from '../lib/phoneCountries'
import { formatGuestPhone, persistLastOrderEventId, upsertUserSession } from '../lib/userSession'
import '../CheckoutPage.css'
import '../GuestDetailsPage.css'
import '../PostBookingPage.css'

const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

export function PostBookingPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const raw = location.state as unknown
  const fromRouter =
    eventId && isPostBookingState(raw) && raw.eventId === eventId ? raw : null
  const fromBasket = eventId ? readCheckoutBasket(eventId) : null
  const data =
    fromRouter ??
    (fromBasket && isPostBookingState(fromBasket) && fromBasket.eventId === eventId
      ? fromBasket
      : null)

  const [phoneCountryCode, setPhoneCountryCode] = useState(data?.guest.phoneCountryCode || '+34')
  const [phoneNational, setPhoneNational] = useState(data?.guest.phoneNational || '')
  const [dateOfBirth, setDateOfBirth] = useState(
    data?.guest.dateOfBirth ? formatDobInput(data.guest.dateOfBirth) : '',
  )
  const [gender, setGender] = useState(data?.guest.gender || '')

  useLayoutEffect(() => {
    if (!eventId) return
    return scrollPageToTop()
  }, [eventId, location.key])

  if (!eventId || !data) {
    return <Navigate to={eventId ? planPath('tickets') : '/'} replace />
  }

  const phoneCountry = phoneCountryByCode(phoneCountryCode)

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault()
    const guest: GuestDetails = {
      ...data.guest,
      phoneCountryCode,
      phoneNational: phoneNational.trim(),
      dateOfBirth: dateOfBirth.trim(),
      gender,
    }

    if (data.email) {
      upsertUserSession({
        email: data.email,
        name: guest.fullName,
        phone: guest.phoneNational ? formatGuestPhone(guest) : undefined,
      })
    }

    const payload: OrderConfirmationState = { ...data, guest, orderRef: data.orderRef }
    persistOrderConfirmation(payload)
    persistLastOrderEventId(eventId)
    navigate(orderConfirmationPath(eventId), { state: payload, replace: true })
  }

  return (
    <div className="postBookingPage">
      <div className="postBookingPage__shell">
        <div className="postBookingCard">
          <div className="postBookingSuccess" role="status">
            <span className="postBookingSuccess__icon" aria-hidden>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="rgba(36, 168, 101, 0.35)" />
                <circle cx="20" cy="20" r="19" stroke="rgba(61, 214, 140, 0.45)" strokeWidth="1" />
                <path
                  d="M12 20.5l5 5L28 14.5"
                  stroke="#5ee09a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h1 className="postBookingSuccess__title">Success!</h1>
            <p className="postBookingSuccess__lead">Please complete the following information.</p>
          </div>

          <h2 className="postBookingCard__heading">Booking details</h2>

          <form className="postBookingForm" onSubmit={onContinue} noValidate>
            <div className="guestField">
              <label className="guestLabel" htmlFor="post-phone">
                Phone number
              </label>
              <div className="guestPhoneField">
                <PhoneCountryPicker
                  id="post-country"
                  value={phoneCountryCode}
                  onChange={setPhoneCountryCode}
                />
                <span className="guestPhoneField__divider" aria-hidden />
                <input
                  id="post-phone"
                  type="tel"
                  className="guestPhoneField__input"
                  autoComplete="tel-national"
                  placeholder={phoneCountry.placeholder}
                  value={phoneNational}
                  onChange={(e) => setPhoneNational(e.target.value)}
                />
              </div>
            </div>

            <div className="guestField">
              <label className="guestLabel" htmlFor="post-dob">
                Date of birth
              </label>
              <GuestDobField
                id="post-dob"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </div>

            <div className="guestField">
              <label className="guestLabel" id="post-gender-label" htmlFor="post-gender">
                Gender
              </label>
              <div className="guestSelectWrap">
                <select
                  id="post-gender"
                  className="guestSelect"
                  aria-labelledby="post-gender-label"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select an option…
                  </option>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="guestSelectChev" aria-hidden>
                  ▾
                </span>
              </div>
            </div>

            <button type="submit" className="postBookingContinue">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
