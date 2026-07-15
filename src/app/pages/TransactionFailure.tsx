import { useLocation, useNavigate, Link } from 'react-router';
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';

export function TransactionFailure() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { orderId?: string } | null };
  const refCode = state?.orderId ?? `ERR-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-2xl mx-auto px-6 py-24">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-20 h-20 bg-destructive/10 border border-destructive/20 mx-auto mb-12">
          <XCircle className="h-10 w-10 text-destructive" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Transaction Failed</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Payment Declined
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your payment could not be processed. No charges have been made to your account.
          </p>
        </div>

        {/* Reason Card */}
        <div className="border border-destructive/20 p-8 mb-10">
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-6">What Happened</p>
          <div className="space-y-4">
            {[
              'Insufficient funds or credit limit reached.',
              'Card details entered incorrectly.',
              "Transaction flagged by your bank's security system.",
              'Card expired or not activated for online payments.',
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                {reason}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-12">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-secondary text-background py-5 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
            Try Again
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full border border-border text-secondary py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:border-secondary transition-colors"
          >
            Use a Different Payment Method
          </button>
        </div>

        {/* Help */}
        <div className="flex items-start gap-4 border border-border p-6 mb-10">
          <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-secondary mb-1">Need Assistance?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you believe this is an error, contact your card issuer or reach out to our support team. Reference code: <span className="font-mono text-secondary">{refCode}</span>
            </p>
          </div>
        </div>

        <div className="text-center border-t border-border pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Return Home
          </Link>
        </div>
      </section>
    </div>
  );
}
