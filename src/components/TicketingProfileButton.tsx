import { useLocation, useNavigate } from 'react-router-dom'
import { isEventCheckoutState, type EventCheckoutState } from '../lib/checkoutState'
import { buildLoginCheckoutState, resolveProfileEventId } from '../lib/loginCheckout'
import { getProfileReturnPath } from '../lib/profileNavigation'
import { accountPath, connectPath } from '../lib/routes'
import { getUserSession, isLoggedIn } from '../lib/userSession'

type TicketingProfileButtonProps = {
  /** Omit on hub listing — falls back to last order or first event. */
  eventId?: string
  checkoutState?: EventCheckoutState | null
  className?: string
  /** Larger hit target for top bars */
  size?: 'sm' | 'md'
}

export function TicketingProfileButton({
  eventId,
  checkoutState,
  className = '',
  size = 'md',
}: TicketingProfileButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getUserSession()
  const loggedIn = isLoggedIn()
  const returnTo = getProfileReturnPath(location)

  const onClick = () => {
    if (loggedIn) {
      navigate(accountPath(), { state: { returnTo } })
      return
    }

    const resolvedEventId = resolveProfileEventId(eventId)
    if (!resolvedEventId) return

    const stateFromLocation = location.state
    const stateCheckout =
      checkoutState && checkoutState.eventId === resolvedEventId
        ? checkoutState
        : isEventCheckoutState(stateFromLocation) &&
            stateFromLocation.eventId === resolvedEventId
          ? stateFromLocation
          : null

    const base = stateCheckout ?? buildLoginCheckoutState(resolvedEventId)

    if (!base) return

    navigate(connectPath(resolvedEventId), {
      state: { ...base, authIntent: 'profile' as const, returnTo },
    })
  }

  const label = loggedIn ? `${session?.name ?? 'User'} account` : 'Log in'

  return (
    <button
      type="button"
      className={`ticketingProfileBtn ticketingProfileBtn--${size}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {loggedIn && session ? (
        <span className="ticketingProfileBtn__initials" aria-hidden>
          {initialsFromName(session.name)}
        </span>
      ) : (
        <ProfileIcon />
      )}
    </button>
  )
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 20.5c1.2-3.2 4.2-5 6.5-5s5.3 1.8 6.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
