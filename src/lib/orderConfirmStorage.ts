import {
  isOrderConfirmationState,
  type OrderConfirmationState,
} from './checkoutState'

const STORAGE_KEY = 'fever-les-ardentes:order-confirm'

export function persistOrderConfirmation(payload: OrderConfirmationState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota / private mode */
  }
}

export function readPersistedOrderConfirmation(eventId: string): OrderConfirmationState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isOrderConfirmationState(parsed)) return null
    if (parsed.eventId !== eventId) return null
    return parsed
  } catch {
    return null
  }
}

export function clearPersistedOrderConfirmation(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
