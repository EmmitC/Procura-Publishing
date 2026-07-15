import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, CreditCard, Shield, ChevronRight, Check, Mail } from 'lucide-react';
import { useCart } from '../state/CartContext';
import { useCatalog } from '../state/CatalogContext';
import { useAuth } from '../state/AuthContext';
import { useOrders } from '../state/OrdersContext';
import type { OrderItem } from '../state/types';

export function Checkout() {
  const navigate = useNavigate();
  const { items, hasDigitalItem, clear } = useCart();
  const { getBook, decrementPhysicalStock } = useCatalog();
  const { user } = useAuth();
  const { createOrder, setOrderStatus } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mastercard' | 'bank'>('visa');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [guestEmail, setGuestEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  // Guard: no digital checkout without an account; nothing to check out with an empty cart.
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    if (hasDigitalItem && !user) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
    }
  }, [items.length, hasDigitalItem, user, navigate]);

  const rows = items
    .map((item) => {
      const book = getBook(item.bookId);
      if (!book) return null;
      const price = item.format === 'digital' ? book.formats.digital?.price : book.formats.physical?.price;
      if (price === undefined) return null;
      return { item, book, price };
    })
    .filter((r): r is { item: typeof items[number]; book: NonNullable<ReturnType<typeof getBook>>; price: number } => r !== null);

  const subtotal = rows.reduce((sum, r) => sum + r.price * r.item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const isGuest = !user;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'number') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (name === 'expiry') value = value.replace(/\D/g, '').replace(/^(.{2})(.+)/, '$1/$2').slice(0, 5);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setCardForm({ ...cardForm, [name]: value });
  };

  const handlePay = () => {
    if (rows.length === 0) return;
    setProcessing(true);

    const orderItems: OrderItem[] = rows.map((r) => ({
      bookId: r.book.id,
      title: r.book.title,
      author: r.book.author,
      format: r.item.format,
      quantity: r.item.quantity,
      price: r.price,
    }));

    const order = createOrder({
      userId: user?.id ?? null,
      guestEmail: isGuest ? guestEmail : null,
      items: orderItems,
      subtotal,
      tax,
      total,
      paymentMethod,
    });

    // Simulate Pesapal hosted checkout + IPN round trip — success ~80% of the time.
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setOrderStatus(order.id, 'paid');
        orderItems
          .filter((i) => i.format === 'physical')
          .forEach((i) => decrementPhysicalStock(i.bookId, i.quantity));
        clear();
        navigate('/payment/success', { state: { orderId: order.id } });
      } else {
        setOrderStatus(order.id, 'failed');
        navigate('/payment/failure', { state: { orderId: order.id } });
      }
    }, 2400);
  };

  const canPay =
    rows.length > 0 &&
    (!isGuest || /\S+@\S+\.\S+/.test(guestEmail)) &&
    (paymentMethod === 'bank' ||
      (cardForm.name && cardForm.number.length >= 19 && cardForm.expiry.length === 5 && cardForm.cvv.length >= 3));

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Secure Checkout</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left — Payment Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Security Badge */}
            <div className="flex items-center gap-3 border border-border p-4">
              <Lock className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-muted-foreground tracking-wide">
                <span className="text-secondary">Secure Payment</span> — Encrypted with 256-bit SSL. Your data is never stored.
              </p>
            </div>

            {isGuest && (
              <div>
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-6">Contact Email</p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Guest checkout is available for physical orders. Order status and shipping updates will be sent here.
                </p>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-6">Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'visa', label: 'Visa', sublabel: 'Credit / Debit' },
                  { id: 'mastercard', label: 'Mastercard', sublabel: 'Credit / Debit' },
                  { id: 'bank', label: 'Bank Transfer', sublabel: 'Direct Deposit' },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`relative border p-4 text-left transition-all ${
                      paymentMethod === m.id
                        ? 'border-secondary bg-secondary/5'
                        : 'border-border hover:border-secondary/40'
                    }`}
                  >
                    {paymentMethod === m.id && (
                      <span className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 bg-secondary">
                        <Check className="h-2.5 w-2.5 text-background" />
                      </span>
                    )}
                    <CreditCard className="h-5 w-5 text-secondary mb-3" strokeWidth={1.5} />
                    <p className="text-xs text-secondary">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod !== 'bank' && (
              <div className="space-y-5">
                <p className="text-xs tracking-wider uppercase text-muted-foreground">Card Details</p>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Name on Card</label>
                  <input
                    name="name"
                    value={cardForm.name}
                    onChange={handleChange}
                    placeholder="As it appears on your card"
                    className="w-full border border-border bg-card px-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      name="number"
                      value={cardForm.number}
                      onChange={handleChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full border border-border bg-card px-4 py-4 pr-14 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                    />
                    {/* Visa badge */}
                    {paymentMethod === 'visa' && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1A1F71] text-white text-[10px] tracking-widest px-2 py-0.5">VISA</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Expiry Date</label>
                    <input
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full border border-border bg-card px-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">CVV</label>
                    <div className="relative">
                      <input
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleChange}
                        placeholder="•••"
                        className="w-full border border-border bg-card px-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="border border-border p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-secondary mb-1">Direct Bank Transfer</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Payment will be drawn directly from your linked bank account and deposited into the recipient's account within 1–3 business days. No card fees apply.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/payment/bank-setup')}
                  className="text-xs text-secondary underline underline-offset-4 tracking-wider"
                >
                  Link or change bank account →
                </button>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={!canPay || processing}
              className="w-full bg-secondary text-background py-5 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center gap-3">
                  <span className="h-4 w-4 border border-background/40 border-t-background rounded-full animate-spin" />
                  Processing Payment…
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4" strokeWidth={1.5} />
                  Pay ${total.toFixed(2)} Securely
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-5">
            <div className="border border-border p-8 sticky top-32">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Order Summary</p>
              <div className="space-y-6 mb-8">
                {rows.map(({ item, book, price }) => (
                  <div key={`${item.bookId}-${item.format}`} className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm text-secondary">{book.title} {item.quantity > 1 && `× ${item.quantity}`}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.author} · {item.format === 'digital' ? 'Digital' : 'Physical'}
                      </p>
                    </div>
                    <p className="text-sm text-secondary shrink-0">${(price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-secondary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-secondary">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4 mt-4">
                  <span className="text-sm tracking-wider uppercase text-secondary">Total</span>
                  <span className="text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Direct deposit note */}
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-[10px] text-muted-foreground tracking-wide leading-relaxed">
                  Payments processed by Procura™ are remitted directly to the author's linked bank account. Funds arrive within 1–3 business days of a successful transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
