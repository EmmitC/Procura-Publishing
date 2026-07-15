import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { SiteSettings } from './types';

const SEED_SETTINGS: SiteSettings = {
  location: 'Kampala, Uganda',
  phone: '+256 780 192 808',
  primaryEmail: 'info@dominari.media',
  secondaryEmail: 'dominarihouse@gmail.com',
  social: {
    instagram: 'https://www.instagram.com/dominari.media',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  },
};

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  updateSocial: (patch: Partial<SiteSettings['social']>) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [stored, setSettings] = useLocalStorageState<SiteSettings>('procura_site_settings', SEED_SETTINGS);
  // Merge over the seed so fields added after a user's settings were first saved (e.g. youtube) don't come back undefined.
  const settings: SiteSettings = { ...SEED_SETTINGS, ...stored, social: { ...SEED_SETTINGS.social, ...stored.social } };

  const value = useMemo<SiteSettingsContextValue>(() => ({
    settings,
    updateSettings: (patch) => setSettings({ ...settings, ...patch }),
    updateSocial: (patch) => setSettings({ ...settings, social: { ...settings.social, ...patch } }),
  }), [settings, setSettings]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}
