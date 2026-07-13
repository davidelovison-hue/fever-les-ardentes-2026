import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  ProfileActionModal,
  type ProfileActionConfirmPayload,
  type ProfileActionId,
} from '../components/ProfileActionModal'
import { ensureDemoOrder } from '../lib/demoOrder'
import { buildLoginCheckoutState } from '../lib/loginCheckout'
import { readProfileReturnPath } from '../lib/profileNavigation'
import {
  connectPath,
  planPath,
  orderConfirmationPath,
} from '../lib/routes'
import {
  clearUserSession,
  emailToDisplayName,
  getLastOrderEventId,
  getUserSession,
  isLoggedIn,
  upsertUserSession,
} from '../lib/userSession'
import '../AccountPage.css'
import '../CheckoutPage.css'
import '../ProfileActionModal.css'

const MENU: { id: ProfileActionId | 'tickets'; label: string }[] = [
  { id: 'tickets', label: 'My tickets' },
  { id: 'deletePayment', label: 'Remove payment methods' },
  { id: 'changeEmail', label: 'Change your email' },
  { id: 'communicationPrefs', label: 'Notification preferences' },
  { id: 'logout', label: 'Log out' },
]

export function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = readProfileReturnPath(location.state)
  const session = getUserSession()
  const [profileEmail, setProfileEmail] = useState(session?.email ?? '')
  const [profileName, setProfileName] = useState(session?.name ?? '')
  const [modal, setModal] = useState<ProfileActionId | null>(null)

  if (!isLoggedIn() || !session) {
    const eventId = getLastOrderEventId()
    if (eventId) {
      const loginState = buildLoginCheckoutState(eventId, { authIntent: 'profile' })
      if (loginState) {
        return (
          <Navigate
            to={connectPath(eventId)}
            replace
            state={{ ...loginState, returnTo: readProfileReturnPath(location.state) }}
          />
        )
      }
    }
    return <Navigate to={planPath('tickets')} replace />
  }

  const onMenuClick = (id: ProfileActionId | 'tickets') => {
    if (id === 'tickets') {
      const demo = ensureDemoOrder()
      const orderEventId = demo?.eventId ?? getLastOrderEventId()
      if (orderEventId) navigate(orderConfirmationPath(orderEventId))
      return
    }

    if (id === 'logout') {
      setModal('logout')
      return
    }

    setModal(id)
  }

  const onModalClose = () => setModal(null)

  const onModalConfirm = (payload?: ProfileActionConfirmPayload) => {
    if (modal === 'changeEmail' && payload?.newEmail) {
      upsertUserSession({
        email: payload.newEmail,
        name: emailToDisplayName(payload.newEmail),
      })
      setProfileEmail(payload.newEmail)
      setProfileName(emailToDisplayName(payload.newEmail))
      setModal(null)
      return
    }
    if (modal === 'communicationPrefs' && payload?.marketingEmails !== undefined) {
      upsertUserSession({
        email: profileEmail,
        marketingEmails: payload.marketingEmails,
      })
      return
    }
    if (modal === 'logout') {
      clearUserSession()
      navigate(planPath('tickets'))
    }
    setModal(null)
  }

  return (
    <div className="accountPage">
      <main className="accountPage__main">
        <section className="accountPage__profile">
          <div className="accountPage__avatar" aria-hidden>
            <span>{initials(profileName)}</span>
          </div>
          <h1 className="accountPage__name">{profileName}</h1>
          <p className="accountPage__email">{profileEmail}</p>
          {session.phone && <p className="accountPage__phone">{session.phone}</p>}
        </section>

        <nav className="accountPage__menu" aria-label="Account">
          <ul className="accountPage__menuList">
            {MENU.map((item) => (
              <li key={item.id}>
                <button type="button" className="accountPage__menuBtn" onClick={() => onMenuClick(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <p className="accountPage__backWrap">
          <Link className="accountPage__back" to={returnTo}>
            ← Back to events
          </Link>
        </p>
      </main>

      <ProfileActionModal
        action={modal}
        currentEmail={profileEmail}
        onClose={onModalClose}
        onConfirm={onModalConfirm}
      />
    </div>
  )
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
