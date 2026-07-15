import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Lock } from 'lucide-react';
import { useCart } from '../state/CartContext';
import { useCatalog } from '../state/CatalogContext';
import { useAuth } from '../state/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Cart() {
  const navigate = useNavigate();
  const { items, setQuantity, removeItem, hasDigitalItem } = useCart();
  const { getBook } = useCatalog();
  const { user } = useAuth();

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

  const handleCheckout = () => {
    if (hasDigitalItem && !user) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Your Selection</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Shopping Cart
          </h1>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-32 border border-border">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-6" strokeWidth={1.5} />
            <p className="text-muted-foreground mb-8">Your cart is empty</p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
            >
              Browse Catalog <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-6">
              {rows.map(({ item, book, price }) => (
                <div key={`${item.bookId}-${item.format}`} className="flex gap-6 border border-border p-6">
                  <div className="w-20 h-28 shrink-0 bg-card overflow-hidden">
                    <ImageWithFallback src={book.image} alt={book.title} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{book.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground/60 mt-2">
                        {item.format === 'digital' ? 'Digital Edition' : 'Physical Copy'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => setQuantity(item.bookId, item.format, item.quantity - 1)}
                          className="p-2 text-secondary hover:bg-card transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-10 text-center text-sm text-secondary">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.bookId, item.format, item.quantity + 1)}
                          className="p-2 text-secondary hover:bg-card transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-secondary">${(price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.bookId, item.format)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <div className="border border-border p-8 sticky top-32">
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Order Summary</p>
                <div className="space-y-3 mb-8">
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

                {hasDigitalItem && !user && (
                  <div className="flex items-start gap-3 border border-border p-4 mb-6">
                    <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your cart contains a digital title. Sign in or create an account to receive it in your library.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  className="w-full bg-secondary text-background py-5 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
