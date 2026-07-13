import { useId, useState, type MouseEvent } from 'react'
import { PaymentMethodBadge } from './PaymentMethodBadge'
import { formatCardNumber, formatExpiry } from '../lib/cardInputFormat'
import { formatPrice } from '../lib/formatPrice'
import '../CheckoutPage.css'
import './CheckoutPaymentMethods.css'

const TERMS_URL = 'https://feverup.com/legal/terms'
const PRIVACY_URL = 'https://feverup.com/legal/privacy'
const TERMS_OF_USE_URL = 'https://feverup.com/legal/terms'

type PaymentMethodId = 'card' | 'paypal' | 'google_pay' | 'apple_pay' | 'klarna'

type CardForm = {
  cardNumber: string
  expiry: string
  cvc: string
  postalCode: string
}

export type CheckoutPaymentMethodsProps = {
  total: number
  onPay: () => void
  /** Use when embedded in a parent <form> (guest checkout). */
  submitType?: 'submit' | 'button'
  /** Hidden on guest checkout (terms collected in contact section). */
  showTermsAccept?: boolean
}

export function CheckoutPaymentMethods({
  total,
  onPay,
  submitType = 'button',
  showTermsAccept = true,
}: CheckoutPaymentMethodsProps) {
  const paymentHeadingId = useId()
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card')
  const [card, setCard] = useState<CardForm>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    postalCode: '',
  })

  const updateCard = <K extends keyof CardForm>(key: K, value: CardForm[K]) => {
    setCard((prev) => ({ ...prev, [key]: value }))
  }

  const canPay = showTermsAccept ? termsAccepted : true

  const handlePayClick = () => {
    if (!canPay) return
    if (submitType === 'button') onPay()
  }

  const handlePayButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!canPay) {
      e.preventDefault()
    }
  }

  const stopLabelBubble = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
  }

  return (
    <>
      <h2 id={paymentHeadingId} className="guestCheckoutSectionTitle">
        <span className="guestCheckoutSectionTitle__icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        Payment method
      </h2>

      <div
        className="guestCheckoutPayMethods"
        role="radiogroup"
        aria-labelledby={paymentHeadingId}
      >
        <div
          className={`guestCheckoutPayMethod${paymentMethod === 'card' ? ' guestCheckoutPayMethod--active' : ''}`}
        >
          <label className="guestCheckoutPayMethod__head">
            <input
              type="radio"
              name="payment-method"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            <span className="guestCheckoutPayMethod__row guestCheckoutPayMethod__row--card">
              <span className="guestCheckoutPayMethod__logoSlot" aria-hidden>
                <span className="guestCheckoutPayOption__cardIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                    <path d="M2 10h20" stroke="#9ca3af" strokeWidth="1.5" />
                  </svg>
                </span>
              </span>
              <span className="guestCheckoutPayMethod__name">New card</span>
              <span className="guestCheckoutPayOption__brands guestCheckoutPayOption__brands--card" aria-hidden>
                <CardBrandVisa />
                <CardBrandMastercard />
                <CardBrandAmex />
              </span>
            </span>
          </label>

          {paymentMethod === 'card' && (
            <div className="guestCheckoutCardFields" data-payment-fields="demo">
              <div className="guestCheckoutInputWrap">
                <span className="guestCheckoutInputIcon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <input
                  className="guestCheckoutInput guestCheckoutInput--withIcon"
                  type="text"
                  inputMode="numeric"
                  name="demo-card-number"
                  autoComplete="off"
                  placeholder="Card number"
                  aria-label="Card number"
                  value={card.cardNumber}
                  onChange={(e) => updateCard('cardNumber', formatCardNumber(e.target.value))}
                />
              </div>

              <div className="guestCheckoutCardRow">
                <input
                  className="guestCheckoutInput"
                  type="text"
                  inputMode="numeric"
                  name="demo-card-expiry"
                  autoComplete="off"
                  placeholder="Expiry date"
                  aria-label="Expiry date"
                  value={card.expiry}
                  onChange={(e) => updateCard('expiry', formatExpiry(e.target.value))}
                />
                <input
                  className="guestCheckoutInput"
                  type="text"
                  inputMode="numeric"
                  name="demo-card-cvc"
                  autoComplete="off"
                  placeholder="CVC"
                  aria-label="CVC"
                  maxLength={4}
                  value={card.cvc}
                  onChange={(e) => updateCard('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>

              <input
                className="guestCheckoutInput"
                type="text"
                name="demo-postal-code"
                autoComplete="off"
                placeholder="Postal code"
                aria-label="Postal code"
                value={card.postalCode}
                onChange={(e) => updateCard('postalCode', e.target.value)}
              />
            </div>
          )}
        </div>

        <label className="guestCheckoutPayMethod__head">
          <input
            type="radio"
            name="payment-method"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
          />
          <span className="guestCheckoutPayMethod__row">
            <span className="guestCheckoutPayMethod__logoSlot" aria-hidden>
              <PaymentMethodBadge kind="paypal" />
            </span>
            <span className="guestCheckoutPayMethod__name">New PayPal account</span>
          </span>
        </label>

        <label className="guestCheckoutPayMethod__head">
          <input
            type="radio"
            name="payment-method"
            value="google_pay"
            checked={paymentMethod === 'google_pay'}
            onChange={() => setPaymentMethod('google_pay')}
          />
          <span className="guestCheckoutPayMethod__row">
            <span className="guestCheckoutPayMethod__logoSlot" aria-hidden>
              <PaymentMethodBadge kind="google_pay" />
            </span>
            <span className="guestCheckoutPayMethod__name">Google Pay</span>
          </span>
        </label>

        <label className="guestCheckoutPayMethod__head">
          <input
            type="radio"
            name="payment-method"
            value="apple_pay"
            checked={paymentMethod === 'apple_pay'}
            onChange={() => setPaymentMethod('apple_pay')}
          />
          <span className="guestCheckoutPayMethod__row">
            <span className="guestCheckoutPayMethod__logoSlot" aria-hidden>
              <PaymentMethodBadge kind="apple_pay" />
            </span>
            <span className="guestCheckoutPayMethod__name">Apple Pay</span>
          </span>
        </label>

        <label className="guestCheckoutPayMethod__head">
          <input
            type="radio"
            name="payment-method"
            value="klarna"
            checked={paymentMethod === 'klarna'}
            onChange={() => setPaymentMethod('klarna')}
          />
          <span className="guestCheckoutPayMethod__row">
            <span className="guestCheckoutPayMethod__logoSlot" aria-hidden>
              <PaymentMethodBadge kind="klarna" />
            </span>
            <span className="guestCheckoutPayMethod__name">Klarna</span>
          </span>
        </label>
      </div>

      <p className="guestCheckoutSecure">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 11V8a4 4 0 118 0v3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Your payment details are stored securely
      </p>

      {showTermsAccept && (
        <>
          <label className="checkoutLegalAccept">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="checkoutLegalAccept__text">
              By continuing you accept the{' '}
              <a
                href={TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLabelBubble}
              >
                Terms and Conditions
              </a>{' '}
              and the{' '}
              <a
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLabelBubble}
              >
                Privacy Policy
              </a>
            </span>
          </label>

          <hr className="checkoutLegalDivider" aria-hidden />
        </>
      )}

      <nav
        className={`checkoutLegalLinks${showTermsAccept ? '' : ' checkoutLegalLinks--afterSecure'}`}
        aria-label="Legal documents"
      >
        <a
          className="checkoutLegalLinks__item"
          href={TERMS_OF_USE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and conditions of use
          <ExternalLinkIcon />
        </a>
        <a
          className="checkoutLegalLinks__item"
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy policy
          <ExternalLinkIcon />
        </a>
      </nav>

      <hr className="guestCheckoutPayDivider" />

      <button
        type={submitType}
        className="checkoutPayBtn guestCheckoutPayBtn"
        disabled={!canPay}
        onClick={submitType === 'button' ? handlePayClick : handlePayButtonClick}
      >
        Pay {formatPrice(total)}
      </button>
    </>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      className="checkoutLegalLinks__icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M14 5h5v5M10 14L19 5M19 5h-4M19 5v4M5 9v10h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CardBrandVisa() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden>
      <rect width="32" height="20" rx="3" fill="#1a1f71" />
      <text x="16" y="13" fill="#fff" fontSize="7" fontWeight="700" textAnchor="middle">
        VISA
      </text>
    </svg>
  )
}

function CardBrandMastercard() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden>
      <rect width="32" height="20" rx="3" fill="#f5f5f5" />
      <circle cx="13" cy="10" r="6" fill="#eb001b" />
      <circle cx="19" cy="10" r="6" fill="#f79e1b" />
    </svg>
  )
}

function CardBrandAmex() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden>
      <rect width="32" height="20" rx="3" fill="#2e77bc" />
      <text x="16" y="13" fill="#fff" fontSize="5.5" fontWeight="700" textAnchor="middle">
        AMEX
      </text>
    </svg>
  )
}
