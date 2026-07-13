import { isEventCheckoutState, type EventCheckoutState } from './checkoutState'

const BASKET_PREFIX = 'fever-les-ardentes:basket:'
const CONNECT_PREFIX = 'fever-les-ardentes:connect:'
const GUEST_CONTACT_PREFIX = 'fever-les-ardentes:guest-contact:'

export type ConnectFlowStep = 'choose' | 'email' | 'verify'

export type ConnectFlowSlice = {
  step: ConnectFlowStep
  email: string
}

export type GuestContactSlice = {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  marketing: boolean
}

function basketKey(eventId: string): string {
  return `${BASKET_PREFIX}${eventId}`
}

function connectKey(eventId: string): string {
  return `${CONNECT_PREFIX}${eventId}`
}

function guestContactKey(eventId: string): string {
  return `${GUEST_CONTACT_PREFIX}${eventId}`
}

export function persistCheckoutBasket(eventId: string, basket: EventCheckoutState): void {
  try {
    sessionStorage.setItem(basketKey(eventId), JSON.stringify(basket))
  } catch {
    /* ignore */
  }
}

export function readCheckoutBasket(eventId: string): EventCheckoutState | null {
  try {
    const raw = sessionStorage.getItem(basketKey(eventId))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isEventCheckoutState(parsed) || parsed.eventId !== eventId) return null
    return parsed
  } catch {
    return null
  }
}

/** Prefer router state; fall back to session so reload / back keep the funnel. */
export function resolveEventCheckoutState(
  eventId: string,
  fromLocation: unknown,
): EventCheckoutState | null {
  if (isEventCheckoutState(fromLocation) && fromLocation.eventId === eventId) {
    persistCheckoutBasket(eventId, fromLocation)
    return fromLocation
  }
  return readCheckoutBasket(eventId)
}

export function persistConnectFlow(eventId: string, slice: ConnectFlowSlice): void {
  try {
    sessionStorage.setItem(connectKey(eventId), JSON.stringify(slice))
  } catch {
    /* ignore */
  }
}

export function readConnectFlow(eventId: string): ConnectFlowSlice | null {
  try {
    const raw = sessionStorage.getItem(connectKey(eventId))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    const step = o.step
    if (step !== 'choose' && step !== 'email' && step !== 'verify') return null
    if (typeof o.email !== 'string') return null
    return { step, email: o.email }
  } catch {
    return null
  }
}

export function clearConnectFlow(eventId: string): void {
  try {
    sessionStorage.removeItem(connectKey(eventId))
  } catch {
    /* ignore */
  }
}

export function persistGuestContact(eventId: string, form: GuestContactSlice): void {
  try {
    sessionStorage.setItem(guestContactKey(eventId), JSON.stringify(form))
  } catch {
    /* ignore */
  }
}

export function readGuestContact(eventId: string): GuestContactSlice | null {
  try {
    const raw = sessionStorage.getItem(guestContactKey(eventId))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    if (
      typeof o.firstName !== 'string' ||
      typeof o.lastName !== 'string' ||
      typeof o.email !== 'string' ||
      typeof o.confirmEmail !== 'string' ||
      typeof o.marketing !== 'boolean'
    ) {
      return null
    }
    return {
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      confirmEmail: o.confirmEmail,
      marketing: o.marketing,
    }
  } catch {
    return null
  }
}

export function clearGuestContact(eventId: string): void {
  try {
    sessionStorage.removeItem(guestContactKey(eventId))
  } catch {
    /* ignore */
  }
}

/** Clears saved login / contact drafts (basket is kept for reload). */
export function clearCheckoutFormDrafts(eventId: string): void {
  clearConnectFlow(eventId)
  clearGuestContact(eventId)
}
