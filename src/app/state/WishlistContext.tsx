import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

type WishlistMap = Record<string, string[]>;

interface WishlistContextValue {
  wishlistFor: (userId: string) => string[];
  isSaved: (userId: string, bookId: string) => boolean;
  toggle: (userId: string, bookId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useLocalStorageState<WishlistMap>('procura_wishlist', {});

  const value = useMemo<WishlistContextValue>(() => ({
    wishlistFor: (userId) => wishlists[userId] ?? [],
    isSaved: (userId, bookId) => (wishlists[userId] ?? []).includes(bookId),
    toggle: (userId, bookId) => {
      const current = wishlists[userId] ?? [];
      const next = current.includes(bookId) ? current.filter((id) => id !== bookId) : [...current, bookId];
      setWishlists({ ...wishlists, [userId]: next });
    },
  }), [wishlists, setWishlists]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
