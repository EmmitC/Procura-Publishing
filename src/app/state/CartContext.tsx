import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { CartItem, FormatType } from './types';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (bookId: string, format: FormatType, quantity?: number) => void;
  removeItem: (bookId: string, format: FormatType) => void;
  setQuantity: (bookId: string, format: FormatType, quantity: number) => void;
  clear: () => void;
  hasDigitalItem: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageState<CartItem[]>('procura_cart', []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    hasDigitalItem: items.some((i) => i.format === 'digital'),
    addItem: (bookId, format, quantity = 1) => {
      const existing = items.find((i) => i.bookId === bookId && i.format === format);
      if (existing) {
        setItems(items.map((i) =>
          i.bookId === bookId && i.format === format ? { ...i, quantity: i.quantity + quantity } : i
        ));
      } else {
        setItems([...items, { bookId, format, quantity }]);
      }
    },
    removeItem: (bookId, format) => setItems(items.filter((i) => !(i.bookId === bookId && i.format === format))),
    setQuantity: (bookId, format, quantity) => {
      if (quantity <= 0) {
        setItems(items.filter((i) => !(i.bookId === bookId && i.format === format)));
        return;
      }
      setItems(items.map((i) => (i.bookId === bookId && i.format === format ? { ...i, quantity } : i)));
    },
    clear: () => setItems([]),
  }), [items, setItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
