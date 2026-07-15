import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, ShoppingBag, User as UserIcon, LogOut, LayoutGrid, BookOpen, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';
import { useWishlist } from '../state/WishlistContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistFor } = useWishlist();
  const wishlistCount = user ? wishlistFor(user.id).length : 0;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/authors', label: 'Authors' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="group">
            <div className="tracking-[0.3em] transition-all">
              <div className="text-2xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>PROCURA<sup className="text-xs">™</sup></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm tracking-wider uppercase transition-all relative ${
                  isActive(item.path)
                    ? 'text-secondary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-secondary'
                    : 'text-muted-foreground hover:text-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-6">
            <Link
              to="/wishlist"
              className="relative p-2 text-secondary hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 bg-primary text-background text-[10px] rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-secondary hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 bg-primary text-background text-[10px] rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2 text-secondary hover:text-primary transition-colors"
                aria-label="Account"
              >
                <UserIcon className="h-5 w-5" strokeWidth={1.5} />
              </button>
              {accountMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border z-50 py-2">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm text-secondary">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Link
                          to="/library"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-secondary hover:bg-card transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4" strokeWidth={1.5} /> My Library
                        </Link>
                        {user.isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-secondary hover:bg-card transition-colors"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} /> Admin
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-secondary hover:bg-card transition-colors"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-sm text-secondary hover:bg-card transition-colors tracking-wider uppercase"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 space-y-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-sm tracking-wider uppercase transition-all ${
                  isActive(item.path)
                    ? 'text-secondary'
                    : 'text-muted-foreground hover:text-secondary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-4">
              <Link
                to="/library"
                className="block text-sm tracking-wider uppercase text-muted-foreground hover:text-secondary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Library
              </Link>
              <Link
                to="/wishlist"
                className="block text-sm tracking-wider uppercase text-muted-foreground hover:text-secondary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="block text-sm tracking-wider uppercase text-muted-foreground hover:text-secondary transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="block text-sm tracking-wider uppercase text-muted-foreground hover:text-secondary transition-all"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block text-sm tracking-wider uppercase text-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
