import type { CartItem } from './cartContext';
import { formatCartSelections } from './cartContext';
import { computeServiceFee, type EventCheckoutState } from './checkoutState';
import { FESTIVAL_EVENT, FESTIVAL_EVENT_ID } from './festivalEvent';

function lineLabel(item: CartItem): string {
  const variant = formatCartSelections(item.selections);
  const base = item.quantity > 1 ? `${item.quantity}× ${item.name}` : item.name;
  return variant ? `${base} (${variant})` : base;
}

export function buildCheckoutFromCart(
  items: CartItem[],
  returnHash = 'tickets',
): EventCheckoutState | null {
  if (items.length === 0) return null;

  const lines = items.map((item) => ({
    id: item.entityId,
    label: lineLabel(item),
    amount: item.price * item.quantity,
  }));

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const serviceFee = computeServiceFee(subtotal);

  return {
    eventId: FESTIVAL_EVENT_ID,
    eventTitle: FESTIVAL_EVENT.title,
    eventImage: FESTIVAL_EVENT.image,
    venue: FESTIVAL_EVENT.venue,
    dateLine: FESTIVAL_EVENT.dateLine,
    lines,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
    returnTab: 'general',
    returnHash,
  };
}
