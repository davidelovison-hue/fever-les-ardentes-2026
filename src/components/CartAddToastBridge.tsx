import { useEffect, useRef } from 'react';
import { useCart } from '../lib/cartContext';
import { useToast } from '../lib/toastContext';

export function CartAddToastBridge() {
  const { totalItems } = useCart();
  const { showToast } = useToast();
  const prevTotalRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevTotalRef.current === null) {
      prevTotalRef.current = totalItems;
      return;
    }

    if (totalItems > prevTotalRef.current) {
      showToast('Ticket added to cart');
    }

    prevTotalRef.current = totalItems;
  }, [totalItems, showToast]);

  return null;
}
