import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PlanEntity } from '../data/planCatalog';

export type CartSelection = Record<string, string>;

export type CartItem = {
  key: string;
  entityId: string;
  name: string;
  price: number;
  quantity: number;
  selections: CartSelection;
};

type CartContextValue = {
  items: CartItem[];
  getQuantity: (entityId: string, selections?: CartSelection) => number;
  setQuantity: (
    entity: PlanEntity,
    quantity: number,
    selections: CartSelection,
  ) => void;
  removeItem: (entityId: string, selections: CartSelection) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function getDefaultSelections(entity: PlanEntity): CartSelection {
  const selections: CartSelection = {};
  entity.variantAxes?.forEach((axis) => {
    selections[axis.id] = axis.options[0] ?? '';
  });
  return selections;
}

export function formatCartSelections(selections: CartSelection): string {
  return Object.entries(selections)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${key.replace(/-/g, ' ')}: ${value}`)
    .join(' · ');
}

function selectionKey(selections: CartSelection): string {
  const entries = Object.entries(selections)
    .filter(([, value]) => value.trim())
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}=${v}`).join('|');
}

function cartItemKey(entityId: string, selections: CartSelection): string {
  return `${entityId}::${selectionKey(selections)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getQuantity = useCallback(
    (entityId: string, selections?: CartSelection) => {
      if (!selections) return items.find((item) => item.entityId === entityId)?.quantity ?? 0;
      const key = cartItemKey(entityId, selections);
      return items.find((item) => item.key === key)?.quantity ?? 0;
    },
    [items],
  );

  const setQuantity = useCallback(
    (entity: PlanEntity, quantity: number, selections: CartSelection) => {
      setItems((current) => {
        const key = cartItemKey(entity.id, selections);
        const existingIndex = current.findIndex((item) => item.key === key);
        if (quantity <= 0) {
          if (existingIndex === -1) return current;
          return current.filter((item) => item.key !== key);
        }

        const nextItem: CartItem = {
          key,
          entityId: entity.id,
          name: entity.name,
          price: entity.price,
          quantity,
          selections,
        };

        if (existingIndex === -1) return [...current, nextItem];
        const next = [...current];
        next[existingIndex] = nextItem;
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((entityId: string, selections: CartSelection) => {
    const key = cartItemKey(entityId, selections);
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      getQuantity,
      setQuantity,
      removeItem,
      totalItems,
      totalPrice,
    }),
    [items, getQuantity, setQuantity, removeItem, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
