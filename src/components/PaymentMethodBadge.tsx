import { publicAsset } from '../lib/publicAsset'
import '../PaymentMethodBadge.css'

export type PaymentBadgeKind = 'paypal' | 'google_pay' | 'apple_pay' | 'klarna'

const BADGE_SRC: Record<PaymentBadgeKind, string> = {
  paypal: publicAsset('payment/paypal.svg'),
  google_pay: publicAsset('payment/google-pay.svg'),
  apple_pay: publicAsset('payment/apple-pay.svg'),
  klarna: publicAsset('payment/klarna.svg'),
}

export function PaymentMethodBadge({ kind }: { kind: PaymentBadgeKind }) {
  return (
    <span className={`paymentBadge paymentBadge--${kind}`}>
      <img src={BADGE_SRC[kind]} alt="" className="paymentBadge__img" decoding="async" />
    </span>
  )
}
