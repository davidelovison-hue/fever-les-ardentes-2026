import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PlanEntity } from '../data/planCatalog';

export type CartSelection = Record<string, string>;

export type CartItem = {
  entityId: string;
  name: string;
  price: number;
  quantity: number;
  selections: CartSelection;
};

type CartContextValue = {
  items: CartItem[];
  getQuantity: (entityId: string) => number;
  getSelections: (entityId: string) => CartSelection | undefined;
  setQuantity: (
    entity: PlanEntity,
    quantity: number,
    selections: CartSelection,
  ) => void;
  setSelections: (entityId: string, selections: CartSelection) => void;
  removeItem: (entityId: string) => void;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getQuantity = useCallback(
    (entityId: string) => items.find((item) => item.entityId === entityId)?.quantity ?? 0,
    [items],
  );

  const getSelections = useCallback(
    (entityId: string) => items.find((item) => item.entityId === entityId)?.selections,
    [items],
  );

  const setQuantity = useCallback(
    (entity: PlanEntity, quantity: number, selections: CartSelection) => {
      setItems((current) => {
        const existingIndex = current.findIndex((item) => item.entityId === entity.id);
        if (quantity <= 0) {
          if (existingIndex === -1) return current;
          return current.filter((item) => item.entityId !== entity.id);
        }

        const nextItem: CartItem = {
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

  const setSelections = useCallback((entityId: string, selections: CartSelection) => {
    setItems((current) =>
      current.map((item) =>
        item.entityId === entityId ? { ...item, selections } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((entityId: string) => {
    setItems((current) => current.filter((item) => item.entityId !== entityId));
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
      getSelections,
      setQuantity,
      setSelections,
      removeItem,
      totalItems,
      totalPrice,
    }),
    [items, getQuantity, getSelections, setQuantity, setSelections, removeItem, totalItems, totalPrice],
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
