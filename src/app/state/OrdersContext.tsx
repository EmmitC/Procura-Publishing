import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { Order, OrderItem, OrderStatus, PaymentMethod, PhysicalStatus } from './types';

interface CreateOrderInput {
  userId: string | null;
  guestEmail: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
}

interface OrdersContextValue {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  setPhysicalStatus: (id: string, status: PhysicalStatus, trackingNumber?: string) => void;
  refundOrder: (id: string, reason: string) => void;
  getOrder: (id: string) => Order | undefined;
  ordersForUser: (userId: string) => Order[];
  hasPurchased: (userId: string, bookId: string) => boolean;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorageState<Order[]>('procura_orders', []);

  const value = useMemo<OrdersContextValue>(() => ({
    orders,
    createOrder: (input) => {
      const hasPhysical = input.items.some((i) => i.format === 'physical');
      const order: Order = {
        id: `PRO-${Date.now().toString(36).toUpperCase().slice(-8)}`,
        userId: input.userId,
        guestEmail: input.guestEmail,
        items: input.items,
        subtotal: input.subtotal,
        tax: input.tax,
        total: input.total,
        status: 'pending',
        paymentMethod: input.paymentMethod,
        createdAt: new Date().toISOString(),
        digitalUnlocked: false,
        physical: { hasPhysical, status: 'Processing', trackingNumber: null },
      };
      setOrders([order, ...orders]);
      return order;
    },
    setOrderStatus: (id, status) =>
      setOrders(orders.map((o) => (o.id === id ? { ...o, status, digitalUnlocked: status === 'paid' ? true : o.digitalUnlocked } : o))),
    setPhysicalStatus: (id, status, trackingNumber) =>
      setOrders(orders.map((o) =>
        o.id === id
          ? { ...o, physical: { ...o.physical, status, trackingNumber: trackingNumber ?? o.physical.trackingNumber } }
          : o
      )),
    refundOrder: (id, reason) =>
      setOrders(orders.map((o) =>
        o.id === id && o.status === 'paid'
          ? { ...o, status: 'refunded', refund: { reason, refundedAt: new Date().toISOString() } }
          : o
      )),
    getOrder: (id) => orders.find((o) => o.id === id),
    ordersForUser: (userId) => orders.filter((o) => o.userId === userId),
    hasPurchased: (userId, bookId) =>
      orders.some((o) => o.userId === userId && o.status === 'paid' && o.items.some((i) => i.bookId === bookId)),
  }), [orders, setOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
