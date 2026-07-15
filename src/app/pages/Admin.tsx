import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../state/AuthContext';
import { useMessages } from '../state/MessagesContext';
import { AdminBooks } from './admin/AdminBooks';
import { AdminOrders } from './admin/AdminOrders';
import { AdminReviews } from './admin/AdminReviews';
import { AdminPeople } from './admin/AdminPeople';
import { AdminMessages } from './admin/AdminMessages';
import { AdminSettings } from './admin/AdminSettings';

type AdminTab = 'books' | 'orders' | 'reviews' | 'people' | 'messages' | 'settings';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'books', label: 'Books' },
  { id: 'orders', label: 'Orders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'people', label: 'People' },
  { id: 'messages', label: 'Messages' },
  { id: 'settings', label: 'Settings' },
];

export function Admin() {
  const { user } = useAuth();
  const { unreadCount } = useMessages();
  const [tab, setTab] = useState<AdminTab>('books');

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Back Office</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Admin
          </h1>
        </div>

        <div className="flex flex-wrap border border-border mb-16 max-w-3xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 py-3 px-2 text-xs tracking-wider uppercase transition-colors ${
                tab === t.id ? 'bg-secondary text-background' : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              {t.label}
              {t.id === 'messages' && unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 flex items-center justify-center h-4 min-w-4 px-1 bg-primary text-background text-[10px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'books' && <AdminBooks />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'reviews' && <AdminReviews />}
        {tab === 'people' && <AdminPeople />}
        {tab === 'messages' && <AdminMessages />}
        {tab === 'settings' && <AdminSettings />}
      </section>
    </div>
  );
}
