import { formatPrice } from '../lib/formatPrice'
import type { EventCheckoutState } from '../lib/checkoutState'

export type CheckoutSummaryPayload = Pick<
  EventCheckoutState,
  'eventTitle' | 'eventImage' | 'venue' | 'dateLine' | 'lines' | 'subtotal' | 'serviceFee' | 'total'
>

type Props = {
  data: CheckoutSummaryPayload
}

export function CheckoutSummaryCard({ data }: Props) {
  return (
    <div className="checkoutSummaryCard">
      <div className="checkoutSummaryHead">
        <img
          src={data.eventImage}
          alt=""
          className="checkoutSummaryThumb"
          width={48}
          height={48}
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="checkoutSummaryHeadText">
          <p className="checkoutSummaryTitle">{data.eventTitle}</p>
          <p className="checkoutSummaryVenue">
            <span className="checkoutSummaryPin" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="11" r="2" fill="currentColor" />
              </svg>
            </span>
            {data.venue}
          </p>
        </div>
      </div>

      <div className="checkoutSummaryBlock">
        <h2 className="checkoutSummaryLabel">Date</h2>
        <p className="checkoutSummaryValue">{data.dateLine}</p>
      </div>

      <div className="checkoutSummaryBlock">
        <h2 className="checkoutSummaryLabel">Tickets &amp; add-ons</h2>
        <ul className="checkoutSummaryLines">
          {data.lines.map((line) => (
            <li key={line.id} className="checkoutSummaryLine">
              <span className="checkoutSummaryLine__text">
                {line.label}
                {line.id === 'ticket' && (
                  <span className="checkoutSummaryLine__info" title="Selected tier for this event">
                    i
                  </span>
                )}
              </span>
              <span className="checkoutSummaryLine__price">{formatPrice(line.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="checkoutSummaryBlock checkoutSummaryBlock--breakdown">
        <h2 className="checkoutSummaryLabel">Price breakdown</h2>
        <dl className="checkoutBreakdown">
          <div className="checkoutBreakdown__row">
            <dt>Subtotal</dt>
            <dd>{formatPrice(data.subtotal)}</dd>
          </div>
          <div className="checkoutBreakdown__row">
            <dt>Booking fee</dt>
            <dd>{formatPrice(data.serviceFee)}</dd>
          </div>
          <div className="checkoutBreakdown__row checkoutBreakdown__row--total">
            <dt>Total</dt>
            <dd>{formatPrice(data.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
