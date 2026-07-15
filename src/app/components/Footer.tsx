import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useSiteSettings } from '../state/SiteSettingsContext';

export function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { key: 'instagram', label: 'Instagram', url: settings.social.instagram, Icon: Instagram },
    { key: 'facebook', label: 'Facebook', url: settings.social.facebook, Icon: Facebook },
    { key: 'twitter', label: 'Twitter', url: settings.social.twitter, Icon: Twitter },
    { key: 'linkedin', label: 'LinkedIn', url: settings.social.linkedin, Icon: Linkedin },
    { key: 'youtube', label: 'YouTube', url: settings.social.youtube, Icon: Youtube },
  ] as const;

  return (
    <footer className="bg-secondary border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="tracking-[0.3em] mb-6">
              <div className="text-2xl text-background" style={{ fontFamily: 'Cormorant Garamond, serif' }}>PROCURA<sup className="text-xs">™</sup></div>
            </div>
            <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-sm">
              Where exceptional stories find their readers. Curating literary excellence for the modern reader through carefully chosen narratives and meaningful connections.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-background text-sm tracking-wider uppercase mb-6">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/authors" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  Authors
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/payment/bank-setup" className="text-muted-foreground/60 hover:text-background transition-colors text-sm">
                  Link Bank Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-background text-sm tracking-wider uppercase mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="text-muted-foreground/60 text-sm">
                {settings.location}
              </li>
              <li className="text-muted-foreground/60 text-sm">
                {settings.phone}
              </li>
              <li className="text-muted-foreground/60 text-sm">
                {settings.primaryEmail}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <h4 className="text-background text-sm tracking-wider uppercase mb-6">Follow</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ key, label, url, Icon }) => (
                <a
                  key={key}
                  href={url || '#'}
                  target={url ? '_blank' : undefined}
                  rel={url ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className={`text-muted-foreground/60 hover:text-background transition-colors ${!url ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/20 pt-8">
          <p className="text-muted-foreground/40 text-xs tracking-wider">&copy; {new Date().getFullYear()} PROCURA™. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
