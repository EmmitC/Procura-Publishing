import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Lock, ChevronRight, Mail } from 'lucide-react';
import { useAuth } from '../state/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { redirectTo?: string } | null };
  const redirectTo = state?.redirectTo ?? '/library';
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const result = mode === 'login'
      ? login(form.email, form.password)
      : register(form.name, form.email, form.password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    navigate(redirectTo);
  };

  const canSubmit = mode === 'login'
    ? form.email && form.password
    : form.name && form.email && form.password.length >= 6;

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-md mx-auto px-6 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </p>
          <h1 className="text-5xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {mode === 'login' ? 'Sign In' : 'Join Procura'}
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="flex border border-border mb-10">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs tracking-wider uppercase transition-colors ${
              mode === 'login' ? 'bg-secondary text-background' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs tracking-wider uppercase transition-colors ${
              mode === 'register' ? 'bg-secondary text-background' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full border border-border bg-card px-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-border bg-card pl-12 pr-4 py-4 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-muted-foreground mt-2">Minimum 6 characters.</p>
            )}
          </div>

          {error && (
            <p className="text-xs text-destructive border border-destructive/30 p-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full bg-secondary text-background py-5 text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </section>
    </div>
  );
}
