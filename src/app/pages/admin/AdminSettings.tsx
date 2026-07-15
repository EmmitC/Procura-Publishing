import { Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useSiteSettings } from '../../state/SiteSettingsContext';

export function AdminSettings() {
  const { settings, updateSettings, updateSocial } = useSiteSettings();

  return (
    <div className="max-w-3xl space-y-16">
      <div>
        <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">
          Contact Information
        </p>
        <p className="text-[11px] text-muted-foreground/70 mb-8 -mt-6">
          Shown on the Contact page and in the site footer.
        </p>
        <div className="space-y-6">
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Location</label>
            <input
              value={settings.location}
              onChange={(e) => updateSettings({ location: e.target.value })}
              placeholder="City, Country"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Phone</label>
            <input
              value={settings.phone}
              onChange={(e) => updateSettings({ phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Primary Email</label>
            <input
              type="email"
              value={settings.primaryEmail}
              onChange={(e) => updateSettings({ primaryEmail: e.target.value })}
              placeholder="info@example.com"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
              Secondary Email <span className="normal-case text-muted-foreground/60">(optional — shown on Contact page only)</span>
            </label>
            <input
              type="email"
              value={settings.secondaryEmail}
              onChange={(e) => updateSettings({ secondaryEmail: e.target.value })}
              placeholder="submissions@example.com"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">
          Social Links
        </p>
        <p className="text-[11px] text-muted-foreground/70 mb-8">
          Shown as icons in the site footer. Leave blank to hide/disable that icon.
        </p>
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground mb-2">
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} /> Instagram
            </label>
            <input
              value={settings.social.instagram}
              onChange={(e) => updateSocial({ instagram: e.target.value })}
              placeholder="https://instagram.com/yourhandle"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground mb-2">
              <Facebook className="h-3.5 w-3.5" strokeWidth={1.5} /> Facebook
            </label>
            <input
              value={settings.social.facebook}
              onChange={(e) => updateSocial({ facebook: e.target.value })}
              placeholder="https://facebook.com/yourpage"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground mb-2">
              <Twitter className="h-3.5 w-3.5" strokeWidth={1.5} /> Twitter / X
            </label>
            <input
              value={settings.social.twitter}
              onChange={(e) => updateSocial({ twitter: e.target.value })}
              placeholder="https://x.com/yourhandle"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground mb-2">
              <Linkedin className="h-3.5 w-3.5" strokeWidth={1.5} /> LinkedIn
            </label>
            <input
              value={settings.social.linkedin}
              onChange={(e) => updateSocial({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground mb-2">
              <Youtube className="h-3.5 w-3.5" strokeWidth={1.5} /> YouTube
            </label>
            <input
              value={settings.social.youtube}
              onChange={(e) => updateSocial({ youtube: e.target.value })}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
