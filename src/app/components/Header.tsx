import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
          </nav>
        )}
      </div>
    </header>
  );
}
