import { useNavigate } from 'react-router';
import { Shield, Lock, CreditCard, ChevronRight } from 'lucide-react';

export function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-2xl mx-auto px-6 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Review & Confirm</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Confirm Payment
          </h1>
        </div>

        {/* Security indicator */}
        <div className="flex items-center gap-3 border border-border p-4 mb-10">
          <Lock className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground tracking-wide">
            <span className="text-secondary">Verified Secure</span> — This page is protected by 256-bit SSL encryption.
          </p>
        </div>

        {/* Summary card */}
        <div className="border border-border p-8 mb-8">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Transaction Summary</p>

          <div className="space-y-5 mb-8 pb-8 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">The Architecture of Silence</span>
              <span className="text-secondary">$28.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meridian Crossings</span>
              <span className="text-secondary">$24.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-secondary">$4.16</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-sm tracking-wider uppercase text-secondary">Total Due</span>
            <span className="text-2xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>$56.16</span>
          </div>

          {/* Payment method summary */}
          <div className="flex items-center gap-4 bg-muted/50 p-4">
            <CreditCard className="h-5 w-5 text-secondary shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-secondary">Visa ending in 4242</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Charged immediately upon confirmation</p>
            </div>
          </div>
        </div>

        {/* Direct bank deposit notice */}
        <div className="border border-border p-6 mb-10">
          <div className="flex items-start gap-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-secondary mb-2">Funds go directly to the author</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                100% of your payment is remitted directly into the author's verified bank account by Procura™. No intermediary holds — secure, transparent, and traceable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 border border-border text-secondary py-4 text-sm tracking-[0.15em] uppercase hover:border-secondary transition-colors"
          >
            Edit Order
          </button>
          <button
            onClick={() => navigate('/payment/success', { state: { total: 56.16, method: 'visa' } })}
            className="flex-1 bg-secondary text-background py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors"
          >
            <Lock className="h-4 w-4" strokeWidth={1.5} />
            Confirm & Pay
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
