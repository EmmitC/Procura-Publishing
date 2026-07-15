import { useLocation, Link, Navigate } from 'react-router';
import { CheckCircle2, Download, Mail, ArrowRight, BookOpen } from 'lucide-react';
import { useOrders } from '../state/OrdersContext';

export function TransactionSuccess() {
  const { state } = useLocation() as { state: { orderId?: string } | null };
  const { getOrder } = useOrders();
  const order = state?.orderId ? getOrder(state.orderId) : undefined;

  if (!order) {
    return <Navigate to="/catalog" replace />;
  }

  const methodLabel = order.paymentMethod === 'bank' ? 'Bank Transfer' : order.paymentMethod === 'mastercard' ? 'Mastercard' : 'Visa';
  const hasDigital = order.items.some((i) => i.format === 'digital');

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-2xl mx-auto px-6 py-24">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 bg-secondary/10 border border-border mx-auto mb-12">
          <CheckCircle2 className="h-10 w-10 text-secondary" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Transaction Complete</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Payment Received
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your order has been confirmed. Funds have been securely directed to the author's bank account.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="border border-border p-8 mb-10">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Receipt</p>

          <div className="space-y-4 mb-8 pb-8 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="text-secondary font-mono text-xs tracking-widest">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="text-secondary">
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-secondary">{methodLabel}</span>
            </div>
          </div>

          <div className="space-y-3 mb-8 pb-8 border-b border-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.title} {item.quantity > 1 && `× ${item.quantity}`} — {item.format === 'digital' ? 'Digital' : 'Physical'}
                </span>
                <span className="text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8 pb-8 border-b border-border">
            <span className="text-sm tracking-wider uppercase text-secondary">Amount Paid</span>
            <span className="text-3xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>${order.total.toFixed(2)}</span>
          </div>

          {/* Direct bank note */}
          <div className="bg-muted/50 p-4">
            <p className="text-[10px] text-muted-foreground tracking-wide leading-relaxed">
              ${order.total.toFixed(2)} has been remitted directly to the author's verified bank account by Procura™. The author will receive funds within 1–3 business days.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => window.print()}
            className="flex-1 border border-border text-secondary py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:border-secondary transition-colors"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            Download Receipt
          </button>
          <button
            onClick={() => {}}
            className="flex-1 border border-border text-secondary py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:border-secondary transition-colors"
          >
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Email Receipt
          </button>
        </div>

        {hasDigital && (
          <div className="mb-12">
            <Link
              to="/library"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
            >
              <BookOpen className="h-4 w-4" strokeWidth={1.5} />
              Go to My Library
            </Link>
          </div>
        )}

        <div className="text-center border-t border-border pt-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-secondary hover:text-primary transition-colors"
          >
            Continue Browsing <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
