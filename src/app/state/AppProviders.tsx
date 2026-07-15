import type { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CatalogProvider } from './CatalogContext';
import { CartProvider } from './CartContext';
import { OrdersProvider } from './OrdersContext';
import { ReviewsProvider } from './ReviewsContext';
import { WishlistProvider } from './WishlistContext';
import { PeopleProvider } from './PeopleContext';
import { MessagesProvider } from './MessagesContext';
import { SiteSettingsProvider } from './SiteSettingsContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <OrdersProvider>
            <ReviewsProvider>
              <WishlistProvider>
                <PeopleProvider>
                  <MessagesProvider>
                    <SiteSettingsProvider>{children}</SiteSettingsProvider>
                  </MessagesProvider>
                </PeopleProvider>
              </WishlistProvider>
            </ReviewsProvider>
          </OrdersProvider>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
