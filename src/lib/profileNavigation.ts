import type { Location } from 'react-router-dom'
import { hubPath } from './routes'

export type ProfileNavigationState = {
  /** Where to return from account / profile login (pathname + search + hash). */
  returnTo?: string
}

export function getProfileReturnPath(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
): string {
  const isHub = location.pathname === '/' || location.pathname === ''
  if (isHub) {
    const hash = location.hash === '#filtros' ? '#filtros' : '#eventos'
    return hubPath(hash)
  }
  return `${location.pathname}${location.search}${location.hash}`
}

export function readProfileReturnPath(state: unknown): string {
  if (state && typeof state === 'object' && 'returnTo' in state) {
    const returnTo = (state as ProfileNavigationState).returnTo
    if (typeof returnTo === 'string' && returnTo.length > 0) return returnTo
  }
  return hubPath('#eventos')
}
