/** Paths for React Router (basename applied by BrowserRouter). */

export function planPath(hash?: string): string {
  return hash ? `/#${hash.replace(/^#/, '')}` : '/';
}

export function eventPath(eventId: string, hash?: string): string {
  void eventId;
  return planPath(hash ?? 'tickets');
}

export function connectPath(eventId: string): string {
  return `/event/${eventId}/connect`;
}

export function checkoutPath(eventId: string): string {
  return `/event/${eventId}/checkout`;
}

export function guestCheckoutPath(eventId: string): string {
  return `/event/${eventId}/guest-checkout`;
}

export function orderConfirmationPath(eventId: string): string {
  return `/event/${eventId}/confirmation`;
}

export function postBookingPath(eventId: string): string {
  return `/event/${eventId}/post-booking`;
}

export function postBookingAbsolutePath(eventId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = `/event/${encodeURIComponent(eventId)}/post-booking`;
  return base ? `${base}${path}` : path;
}

export function orderConfirmationAbsolutePath(eventId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = `/event/${encodeURIComponent(eventId)}/confirmation`;
  return base ? `${base}${path}` : path;
}

export function accountPath(): string {
  return '/account';
}

/** @deprecated use planPath */
export function hubPath(hash?: string): string {
  return planPath(hash);
}
