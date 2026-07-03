import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Lock, ChevronRight, Building2, CheckCircle2 } from 'lucide-react';

export function BankAccountSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (step === 1) setStep(2);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStep(3);
    }, 1800);
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-2xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Payment Settings</p>
          <h1 className="text-5xl md:text-6xl text-secondary mb-6 leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Link Bank Account
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Connect your bank account to receive payments directly. All transactions are encrypted and secured.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-16">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-8 h-8 text-sm tracking-wider border transition-colors ${
                step >= s ? 'bg-secondary text-background border-secondary' : 'border-border text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              <span className={`text-xs tracking-wider uppercase ${step >= s ? 'text-secondary' : 'text-muted-foreground'}`}>
                {['Account Details', 'Verify', 'Done'][i]}
              </span>
              {i < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-secondary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-3 border border-border p-4 mb-10">
          <Shield className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground tracking-wide">
            <span className="text-secondary">Secure Connection</span> — Your banking details are encrypted with 256-bit SSL and never stored on our servers.
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Bank Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <input
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="e.g. Chase, Bank of America"
                  className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Account Holder Name</label>
              <input
                name="accountHolder"
                value={form.accountHolder}
                onChange={handleChange}
                placeholder="Full legal name"
                className="w-full border border-border bg-card px-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Account Type</label>
              <select
                name="accountType"
                value={form.accountType}
                onChange={handleChange}
                className="w-full border border-border bg-card px-4 py-4 text-secondary focus:outline-none focus:border-secondary transition-colors appearance-none"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
              </select>
            </div>
            <button
              onClick={handleContinue}
              disabled={!form.bankName || !form.accountHolder}
              className="w-full bg-secondary text-background py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Routing Number</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <input
                  name="routingNumber"
                  value={form.routingNumber}
                  onChange={handleChange}
                  placeholder="9-digit routing number"
                  maxLength={9}
                  className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Account Number</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <input
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Account number"
                  className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Payments collected through Procura™ will be deposited directly into this account. Standard processing time is 1–3 business days.
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !form.routingNumber || !form.accountNumber}
              className="w-full bg-secondary text-background py-4 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4"
            >
              {saving ? (
                <span className="flex items-center gap-3">
                  <span className="h-4 w-4 border border-background/40 border-t-background rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                <>Save Account <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 border border-border mx-auto mb-8">
              <CheckCircle2 className="h-8 w-8 text-secondary" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl text-secondary mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Account Linked</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Your {form.bankName} account ending in {form.accountNumber.slice(-4)} has been successfully linked. Payments will be deposited directly into your account.
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="border border-secondary text-secondary px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-secondary hover:text-background transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
