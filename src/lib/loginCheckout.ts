import type { EventCheckoutState } from './checkoutState';
import { FESTIVAL_EVENT, FESTIVAL_EVENT_ID, getFestivalEvent } from './festivalEvent';
import { getLastOrderEventId } from './userSession';

export function resolveProfileEventId(preferred?: string): string | null {
  if (preferred) return preferred;
  const last = getLastOrderEventId();
  if (last) return last;
  return FESTIVAL_EVENT_ID;
}

export function buildLoginCheckoutState(
  eventId: string,
  extras?: Partial<EventCheckoutState>,
): EventCheckoutState | null {
  const event = getFestivalEvent(eventId);
  if (!event) return null;

  return {
    eventId: event.id,
    eventTitle: event.title,
    eventImage: event.image,
    venue: event.venue,
    dateLine: event.dateLine,
    lines: [],
    subtotal: 0,
    serviceFee: 0,
    total: 0,
    returnTab: 'general',
    returnHash: 'tickets',
    ...extras,
  };
}

export { FESTIVAL_EVENT };
