import { computeServiceFee, type OrderConfirmationState } from './checkoutState';
import { FESTIVAL_EVENT, FESTIVAL_EVENT_ID } from './festivalEvent';
import { persistOrderConfirmation } from './orderConfirmStorage';
import { getUserSession, persistLastOrderEventId } from './userSession';

export const DEMO_ORDER_EVENT_ID = FESTIVAL_EVENT_ID;

export function ensureDemoOrder(): OrderConfirmationState | null {
  const session = getUserSession();
  const ticketSubtotal = 219;
  const serviceFee = computeServiceFee(ticketSubtotal);
  const total = ticketSubtotal + serviceFee;

  const payload: OrderConfirmationState = {
    eventId: FESTIVAL_EVENT.id,
    eventTitle: FESTIVAL_EVENT.title,
    eventImage: FESTIVAL_EVENT.image,
    venue: FESTIVAL_EVENT.venue,
    dateLine: FESTIVAL_EVENT.dateLine,
    lines: [{ id: 'ticket-4day', label: '1× 4 Days Pass', amount: ticketSubtotal }],
    subtotal: ticketSubtotal,
    serviceFee,
    total,
    returnTab: 'general',
    returnHash: 'tickets',
    email: session?.email ?? 'guest@feverup.com',
    guest: {
      fullName: session?.name ?? 'Demo Guest',
      phoneCountryCode: '+31',
      phoneNational: '612345678',
      dateOfBirth: '01/01/1990',
      gender: 'prefer_not',
    },
    orderRef: 'ARDE-DEMO-7K2M9X',
  };

  persistOrderConfirmation(payload);
  persistLastOrderEventId(FESTIVAL_EVENT.id);
  return payload;
}
