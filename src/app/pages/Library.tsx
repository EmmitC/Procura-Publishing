import { Navigate, Link } from 'react-router';
import { useState } from 'react';
import { BookOpen, Download, Package, CheckCircle2, Circle, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../state/AuthContext';
import { useOrders } from '../state/OrdersContext';
import { useCatalog } from '../state/CatalogContext';
import type { PhysicalStatus } from '../state/types';

const PHYSICAL_STEPS: PhysicalStatus[] = ['Processing', 'Shipped', 'Delivered'];

export function Library() {
  const { user } = useAuth();
  const { ordersForUser } = useOrders();
  const { getBook } = useCatalog();
  const [tab, setTab] = useState<'digital' | 'orders'>('digital');

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: '/library' }} replace />;
  }

  const orders = ordersForUser(user.id).filter((o) => o.status === 'paid');
  const allOrders = ordersForUser(user.id);

  const digitalTitles = orders
    .flatMap((o) => o.items.filter((i) => i.format === 'digital').map((i) => ({ ...i, orderId: o.id })))
    .reduce<Record<string, { bookId: string; title: string; author: string; orderId: string }>>((acc, item) => {
      if (!acc[item.bookId]) acc[item.bookId] = item;
      return acc;
    }, {});

  const digitalList = Object.values(digitalTitles);

  const handleDownload = (title: string) => {
    toast.success('Preparing your download', {
      description: `${title} is being watermarked for your account and will download shortly.`,
    });
  };

  const handleRead = (title: string) => {
    toast.info('Opening reader', { description: `In-browser reading for "${title}" is coming soon.` });
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Your Account</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            My Library
          </h1>
        </div>

        <div className="flex border border-border mb-16 max-w-md">
          <button
            onClick={() => setTab('digital')}
            className={`flex-1 py-3 text-xs tracking-wider uppercase transition-colors ${
              tab === 'digital' ? 'bg-secondary text-background' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            Digital Library
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex-1 py-3 text-xs tracking-wider uppercase transition-colors ${
              tab === 'orders' ? 'bg-secondary text-background' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            Order History
          </button>
        </div>

        {tab === 'digital' && (
          digitalList.length === 0 ? (
            <div className="text-center py-32 border border-border">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-6" strokeWidth={1.5} />
              <p className="text-muted-foreground mb-8">No digital titles yet</p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {digitalList.map((item) => {
                const book = getBook(item.bookId);
                return (
                  <div key={item.bookId} className="border border-border p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-secondary mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{item.author}</p>
                      {book && <p className="text-[10px] tracking-wider uppercase text-muted-foreground/60 mb-6">{book.genre}</p>}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRead(item.title)}
                        className="flex-1 border border-border text-secondary py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:border-secondary transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} /> Read
                      </button>
                      <button
                        onClick={() => handleDownload(item.title)}
                        className="flex-1 bg-secondary text-background py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === 'orders' && (
          allOrders.length === 0 ? (
            <div className="text-center py-32 border border-border">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-6" strokeWidth={1.5} />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {allOrders.map((order) => (
                <div key={order.id} className="border border-border p-8">
                  <div className="flex flex-wrap justify-between gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs tracking-wider uppercase mb-1 ${
                          order.status === 'paid'
                            ? 'text-secondary'
                            : order.status === 'failed'
                            ? 'text-destructive'
                            : order.status === 'refunded'
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {order.status === 'paid'
                          ? 'Paid'
                          : order.status === 'failed'
                          ? 'Failed'
                          : order.status === 'refunded'
                          ? 'Refunded'
                          : 'Pending'}
                      </p>
                      <p className="text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.title} {item.quantity > 1 && `× ${item.quantity}`} — {item.format === 'digital' ? 'Digital' : 'Physical'}
                        </span>
                        <span className="text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.status === 'paid' && order.physical.hasPhysical && (
                    <div className="pt-6 border-t border-border">
                      <p className="text-xs tracking-wider uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5" strokeWidth={1.5} /> Shipment Status
                      </p>
                      <div className="flex items-center gap-2">
                        {PHYSICAL_STEPS.map((step, i) => {
                          const currentIndex = PHYSICAL_STEPS.indexOf(order.physical.status);
                          const reached = i <= currentIndex;
                          return (
                            <div key={step} className="flex items-center gap-2 flex-1">
                              <div className="flex flex-col items-center gap-2 flex-1">
                                {reached ? (
                                  <CheckCircle2 className="h-4 w-4 text-secondary" strokeWidth={1.5} />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground/30" strokeWidth={1.5} />
                                )}
                                <span className={`text-[10px] tracking-wider uppercase ${reached ? 'text-secondary' : 'text-muted-foreground/50'}`}>
                                  {step}
                                </span>
                              </div>
                              {i < PHYSICAL_STEPS.length - 1 && (
                                <div className={`h-px flex-1 -mt-5 ${i < currentIndex ? 'bg-secondary' : 'bg-border'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {order.physical.trackingNumber && (
                        <p className="text-xs text-muted-foreground mt-4">
                          Tracking Number: <span className="text-secondary font-mono">{order.physical.trackingNumber}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </div>
  );
}
