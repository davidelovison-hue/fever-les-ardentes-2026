import type { GuestDetails } from './checkoutState'

export type UserSession = {
  email: string
  name: string
  phone?: string
  marketingEmails?: boolean
}

const SESSION_KEY = 'fever-les-ardentes:user-session'
const LAST_ORDER_KEY = 'fever-les-ardentes:last-order-event'

export function emailToDisplayName(email: string): string {
  const local = email.split('@')[0] ?? email
  return local
    .replace(/[._+-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function formatGuestPhone(guest: GuestDetails): string {
  const national = guest.phoneNational.replace(/\D/g, '')
  if (!national) return ''
  return `${guest.phoneCountryCode} ${guest.phoneNational.trim()}`
}

export function getUserSession(): UserSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    if (typeof o.email !== 'string' || typeof o.name !== 'string') return null
    return {
      email: o.email,
      name: o.name,
      phone: typeof o.phone === 'string' ? o.phone : undefined,
      marketingEmails: typeof o.marketingEmails === 'boolean' ? o.marketingEmails : undefined,
    }
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getUserSession() !== null
}

export function setUserSession(session: UserSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* ignore */
  }
}

export function upsertUserSession(patch: Partial<UserSession> & { email: string }): void {
  const current = getUserSession()
  setUserSession({
    email: patch.email,
    name: patch.name ?? current?.name ?? emailToDisplayName(patch.email),
    phone: patch.phone ?? current?.phone,
    marketingEmails: patch.marketingEmails ?? current?.marketingEmails,
  })
}

export function clearUserSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function persistLastOrderEventId(eventId: string): void {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, eventId)
  } catch {
    /* ignore */
  }
}

export function getLastOrderEventId(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY)
  } catch {
    return null
  }
}
