/** Passed via React Router `location.state` from the event ticket page to checkout. */

export type CheckoutLineItem = {
  id: string
  label: string
  /** Line total in euros */
  amount: number
}

export type GuestDetails = {
  fullName: string
  phoneCountryCode: string
  /** National number only (no country prefix) */
  phoneNational: string
  /** dd/mm/yyyy */
  dateOfBirth: string
  gender: string
}

export type EventCheckoutState = {
  eventId: string
  eventTitle: string
  eventImage: string
  venue: string
  /** e.g. "Friday, 15 may 2026 · 23:00" */
  dateLine: string
  lines: CheckoutLineItem[]
  subtotal: number
  serviceFee: number
  total: number
  /** Restore tab when going back to the event page */
  returnTab: 'general' | 'vip'
  /** Festival plan hash tab to restore (e.g. tickets, camping) */
  returnHash?: string
  /** Set after email / connect step */
  email?: string
  /** Set after guest-details step */
  guest?: GuestDetails
  /** `profile`: sign-in only (profile menu). Default: continue checkout funnel. */
  authIntent?: 'checkout' | 'profile'
  /** Skips login + guest-details; uses combined contact + payment screen. */
  guestCheckout?: boolean
}

/** Demo booking fee: 10% of merchandise subtotal (matches common Ticketclub-style breakdown). */
export function computeServiceFee(subtotal: number): number {
  if (subtotal <= 0) return 0
  return Math.round(subtotal * 0.1 * 100) / 100
}

export function isCheckoutLineItem(x: unknown): x is CheckoutLineItem {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.label === 'string' && typeof o.amount === 'number'
}

export function isGuestDetails(x: unknown): x is GuestDetails {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.fullName === 'string' &&
    typeof o.phoneCountryCode === 'string' &&
    typeof o.phoneNational === 'string' &&
    typeof o.dateOfBirth === 'string' &&
    typeof o.gender === 'string'
  )
}

/** Basket + event context (guest optional — used on guest-details step). */
export function isEventCheckoutState(x: unknown): x is EventCheckoutState {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  const base =
    typeof o.eventId === 'string' &&
    typeof o.eventTitle === 'string' &&
    typeof o.eventImage === 'string' &&
    typeof o.venue === 'string' &&
    typeof o.dateLine === 'string' &&
    Array.isArray(o.lines) &&
    o.lines.every(isCheckoutLineItem) &&
    typeof o.subtotal === 'number' &&
    typeof o.serviceFee === 'number' &&
    typeof o.total === 'number' &&
    (o.returnTab === 'general' || o.returnTab === 'vip')

  if (!base) return false
  if (o.email !== undefined && typeof o.email !== 'string') return false
  if (
    o.authIntent !== undefined &&
    o.authIntent !== 'checkout' &&
    o.authIntent !== 'profile'
  ) {
    return false
  }
  if (o.guestCheckout !== undefined && typeof o.guestCheckout !== 'boolean') return false
  if (o.returnHash !== undefined && typeof o.returnHash !== 'string') return false
  if (o.guest === undefined) return true
  return isGuestDetails(o.guest)
}

export type GuestFieldErrors = Partial<
  Record<'fullName' | 'phone' | 'dateOfBirth' | 'gender', string>
>

function isValidDobDdMmYyyy(s: string): boolean {
  const parts = s.split('/')
  if (parts.length !== 3) return false
  const dd = Number(parts[0])
  const mm = Number(parts[1])
  const yyyy = Number(parts[2])
  if (!Number.isInteger(dd) || !Number.isInteger(mm) || !Number.isInteger(yyyy)) return false
  if (mm < 1 || mm > 12 || dd < 1) return false
  const d = new Date(yyyy, mm - 1, dd)
  return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd
}

function ageFromDobDdMmYyyy(s: string): number {
  const [dd, mm, yyyy] = s.split('/').map(Number)
  const birth = new Date(yyyy, mm - 1, dd)
  const t = new Date()
  let age = t.getFullYear() - birth.getFullYear()
  const mo = t.getMonth() - birth.getMonth()
  if (mo < 0 || (mo === 0 && t.getDate() < birth.getDate())) age -= 1
  return age
}

/** Inline validation for guest form (European dd/mm/yyyy). */
export function getGuestFormErrors(g: GuestDetails): GuestFieldErrors {
  const errors: GuestFieldErrors = {}
  const name = g.fullName.trim()
  if (!name) {
    errors.fullName = 'Enter your full name.'
  } else if (name.length < 2) {
    errors.fullName = 'Name must be at least 2 characters.'
  } else if (!/^[\p{L}\s'.-]+$/u.test(name)) {
    errors.fullName = 'Use letters only for your name.'
  }

  const digits = g.phoneNational.replace(/\D/g, '')
  if (digits.length < 6) {
    errors.phone = 'Enter a valid mobile number (at least 6 digits).'
  }

  const dob = g.dateOfBirth.trim()
  if (!dob) {
    errors.dateOfBirth = 'Enter your date of birth.'
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
    errors.dateOfBirth = 'Use dd/mm/yyyy (slashes are added as you type).'
  } else if (!isValidDobDdMmYyyy(dob)) {
    errors.dateOfBirth = 'That day or month is not valid — check the date.'
  } else {
    const yyyy = Number(dob.split('/')[2])
    if (yyyy < 1990) {
      errors.dateOfBirth = 'Date of birth must be from 1990 onwards.'
    } else {
      const age = ageFromDobDdMmYyyy(dob)
      if (age < 18) errors.dateOfBirth = 'You must be 18 or over for club events.'
      if (age > 120) errors.dateOfBirth = 'Please check the year you entered.'
    }
  }

  if (!g.gender.trim()) {
    errors.gender = 'Please select an option.'
  }
  return errors
}

export function guestFormComplete(g: GuestDetails): boolean {
  return Object.keys(getGuestFormErrors(g)).length === 0
}

export function checkoutHasGuest(
  state: EventCheckoutState,
): state is EventCheckoutState & { guest: GuestDetails } {
  return state.guest != null && isGuestDetails(state.guest) && guestFormComplete(state.guest)
}

export function checkoutStateWithoutGuest(state: EventCheckoutState): EventCheckoutState {
  const next = { ...state }
  delete next.guest
  return next
}

function guestDisplayNameFromEmail(email: string, name?: string): string {
  const localPart = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || 'Guest'
  const fullName =
    name?.trim() ||
    localPart
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  return fullName || 'Guest'
}

/** Name-only guest stub; booking questions collected on post-booking. */
export function placeholderGuestForPostBooking(email: string, name?: string): GuestDetails {
  return {
    fullName: guestDisplayNameFromEmail(email, name),
    phoneCountryCode: '+34',
    phoneNational: '',
    dateOfBirth: '',
    gender: '',
  }
}

/** Demo guest with all fields filled (e.g. guest-details step or demo orders). */
export function placeholderGuestForCheckout(email: string, name?: string): GuestDetails {
  return {
    ...placeholderGuestForPostBooking(email, name),
    phoneNational: '600000000',
    dateOfBirth: '01/01/1990',
    gender: 'prefer_not',
  }
}

/** Enough to pay on checkout; phone / DOB / gender collected after purchase. */
export function checkoutHasGuestIdentity(
  state: EventCheckoutState,
): state is EventCheckoutState & { guest: GuestDetails } {
  return (
    state.guest != null &&
    isGuestDetails(state.guest) &&
    state.guest.fullName.trim().length >= 2
  )
}

export type OrderConfirmationState = EventCheckoutState & {
  guest: GuestDetails
  /** Demo order reference shown on receipt */
  orderRef: string
}

/** After pay, before confirmation — collect phone, DOB, gender. */
export type PostBookingState = EventCheckoutState & {
  guest: GuestDetails
  orderRef: string
}

export function isPostBookingState(x: unknown): x is PostBookingState {
  if (!isEventCheckoutState(x)) return false
  const o = x as Record<string, unknown>
  return typeof o.orderRef === 'string' && o.orderRef.length >= 4 && isGuestDetails(o.guest)
}

export type PostBookingFieldErrors = Partial<
  Record<'phone' | 'dateOfBirth' | 'gender', string>
>

export function getPostBookingFormErrors(
  g: Pick<GuestDetails, 'phoneCountryCode' | 'phoneNational' | 'dateOfBirth' | 'gender'>,
): PostBookingFieldErrors {
  const all = getGuestFormErrors({
    fullName: 'Guest',
    phoneCountryCode: g.phoneCountryCode,
    phoneNational: g.phoneNational,
    dateOfBirth: g.dateOfBirth,
    gender: g.gender,
  })
  const errors: PostBookingFieldErrors = {}
  if (all.phone) errors.phone = all.phone
  if (all.dateOfBirth) errors.dateOfBirth = all.dateOfBirth
  if (all.gender) errors.gender = all.gender
  return errors
}

export function isOrderConfirmationState(x: unknown): x is OrderConfirmationState {
  if (!isEventCheckoutState(x)) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.orderRef === 'string' &&
    o.orderRef.length >= 4 &&
    isGuestDetails(o.guest)
  )
}
