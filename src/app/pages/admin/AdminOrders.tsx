import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../state/AuthContext';
import { useOrders } from '../../state/OrdersContext';
import type { Order, PhysicalStatus } from '../../state/types';

const PHYSICAL_STATUSES: PhysicalStatus[] = ['Processing', 'Shipped', 'Delivered'];

export function AdminOrders() {
  const { users } = useAuth();
  const { orders, setPhysicalStatus, refundOrder } = useOrders();

  const customerLabel = (order: Order) => {
    if (order.guestEmail) return `${order.guestEmail} (guest)`;
    const owner = users.find((u) => u.id === order.userId);
    return owner ? owner.name : 'Unknown';
  };

  const handleRefund = (order: Order) => {
    const reason = window.prompt(`Refund $${order.total.toFixed(2)} for order ${order.id}? Enter a reason (optional):`, '');
    if (reason === null) return;
    refundOrder(order.id, reason);
    toast.success('Order refunded', { description: `${order.id} — $${order.total.toFixed(2)}` });
  };

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const failedCount = orders.filter((o) => o.status === 'failed').length;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
        <div className="bg-background p-6">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Total Revenue</p>
          <p className="text-3xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-background p-6">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Paid Orders</p>
          <p className="text-3xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{paidOrders.length}</p>
        </div>
        <div className="bg-background p-6">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Pending</p>
          <p className="text-3xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{pendingCount}</p>
        </div>
        <div className="bg-background p-6">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Failed</p>
          <p className="text-3xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{failedCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider uppercase text-muted-foreground">
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Fulfillment</th>
              <th className="text-left p-4">Refund</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">No orders yet</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-b-0 align-top">
                <td className="p-4 text-secondary font-mono text-xs">{order.id}</td>
                <td className="p-4 text-muted-foreground">{customerLabel(order)}</td>
                <td className="p-4 text-secondary">${order.total.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`text-xs tracking-wider uppercase ${
                      order.status === 'paid'
                        ? 'text-secondary'
                        : order.status === 'failed'
                        ? 'text-destructive'
                        : order.status === 'refunded'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {order.status === 'paid' && order.physical.hasPhysical ? (
                    <div className="flex flex-col gap-2 max-w-xs">
                      <select
                        value={order.physical.status}
                        onChange={(e) => setPhysicalStatus(order.id, e.target.value as PhysicalStatus)}
                        className="border border-border bg-card px-2 py-1 text-secondary text-xs focus:outline-none focus:border-secondary"
                      >
                        {PHYSICAL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input
                        placeholder="Tracking number"
                        defaultValue={order.physical.trackingNumber ?? ''}
                        onBlur={(e) => setPhysicalStatus(order.id, order.physical.status, e.target.value)}
                        className="border border-border bg-card px-2 py-1 text-secondary text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">
                      {order.physical.hasPhysical ? '—' : 'Digital only'}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {order.status === 'paid' ? (
                    <button
                      onClick={() => handleRefund(order)}
                      className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} /> Refund
                    </button>
                  ) : order.status === 'refunded' ? (
                    <span className="text-xs text-muted-foreground" title={order.refund?.reason || undefined}>
                      Refunded {new Date(order.refund!.refundedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
