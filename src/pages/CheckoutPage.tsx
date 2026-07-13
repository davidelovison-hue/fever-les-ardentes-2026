import { useMemo } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckoutPaymentMethods } from '../components/CheckoutPaymentMethods'
import { CheckoutSummaryCard } from '../components/CheckoutSummaryCard'
import {
  checkoutHasGuestIdentity,
  checkoutStateWithoutGuest,
  placeholderGuestForPostBooking,
  type EventCheckoutState,
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

export function CheckoutPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as unknown
  const data = useMemo(
    () => (eventId ? resolveEventCheckoutState(eventId, state) : null),
    [eventId, state],
  )

  if (!eventId || !data) {
    return <Navigate to={eventId ? planPath('tickets') : '/'} replace />
  }

  const stripped = checkoutStateWithoutGuest(data)
  let checkoutData: EventCheckoutState = data

  if (!checkoutHasGuestIdentity(data)) {
    if (!data.email?.trim()) {
      return <Navigate to={connectPath(eventId)} replace state={stripped} />
    }
    checkoutData = {
      ...data,
      guest: placeholderGuestForPostBooking(
        data.email,
        data.guest?.fullName || undefined,
      ),
    }
  }

  if (!checkoutHasGuestIdentity(checkoutData)) {
    return <Navigate to={connectPath(eventId)} replace state={stripped} />
  }

  const summaryPayload = {
    eventTitle: checkoutData.eventTitle,
    eventImage: checkoutData.eventImage,
    venue: checkoutData.venue,
    dateLine: checkoutData.dateLine,
    lines: checkoutData.lines,
    subtotal: checkoutData.subtotal,
    serviceFee: checkoutData.serviceFee,
    total: checkoutData.total,
  }

  const onPay = () => {
    const orderRef = `ARDE-${eventId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const payload: PostBookingState = { ...checkoutData, orderRef }
    if (checkoutData.email) {
      upsertUserSession({ email: checkoutData.email, name: checkoutData.guest.fullName })
    }
    persistCheckoutBasket(eventId, payload)
    navigate(postBookingPath(eventId), { state: payload })
  }

  return (
    <div className="checkoutPage guestCheckoutPage">
      <div className="checkoutPage__shell">
        <Link
          className="checkoutPage__back"
          to={connectPath(eventId)}
          state={stripped}
          onClick={() => clearCheckoutFormDrafts(eventId)}
        >
          <span className="checkoutPage__backArrow" aria-hidden>
            ←
          </span>
          Confirm and pay
        </Link>

        <div className="checkoutGrid">
          <section className="checkoutGrid__payment guestCheckoutPanel">
            <CheckoutPaymentMethods
              total={checkoutData.total}
              onPay={onPay}
              submitType="button"
            />
          </section>

          <aside className="checkoutGrid__summary" aria-label="Order summary">
            <CheckoutSummaryCard data={summaryPayload} />
          </aside>
        </div>
      </div>
    </div>
  )
}
