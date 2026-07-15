# Procura Publishing Website

A literary publishing storefront — catalog browsing, cart & checkout, digital/physical fulfillment, customer accounts, and an admin back office. Built with Vite + React + TypeScript + React Router, styled with Tailwind and a custom dark/serif design system.

This document summarizes the features implemented in today's build sessions.

---

## Architecture

The app is currently **frontend-only**: there is no backend yet. All state (auth, cart, catalog, orders, reviews, wishlist, people, messages) lives in React Context providers backed by `localStorage`, so data persists across reloads but is local to the browser it's used in. See `src/app/state/AppProviders.tsx` for the provider tree, and `src/app/state/*Context.tsx` for each domain's state and actions.

Payment is a simulated Pesapal-style flow (processing spinner → success/fail) rather than a live payment integration — the order/state machine (`pending` → `paid`/`failed`/`refunded`) is real and drives fulfillment, library access, and admin views, so swapping in a real payment provider later is a matter of replacing the simulated step in `Checkout.tsx`.

---

## Phase 1 — Core Commerce Loop

- **Catalog & book detail**: dynamic catalog page and book modal driven by `CatalogContext`, with per-format (digital/physical) pricing and stock.
- **Cart**: mixed digital/physical cart (`CartContext`), a dedicated `/cart` page with quantity controls and running totals.
- **Accounts**: registration/login (`AuthContext`), with the rule that digital purchases require an account while physical-only orders support guest checkout.
- **Checkout**: real cart data flows into `/checkout`, computes subtotal/tax/total, and creates an order (`OrdersContext`) before running the simulated payment step.
- **Fulfillment**: on payment success, digital items unlock in the customer's library and physical items enter a Processing → Shipped → Delivered pipeline with a tracking number field.
- **My Library / Order History** (`/library`): purchased digital titles (download/read stubs) and full order history with live shipment status.
- **Admin back office** (`/admin`): Books tab for adding/editing titles, per-format pricing, and stock.

## Phase 2 — Trust & Engagement

- **Reviews & ratings**: star rating + written review from the book modal, held in a moderation queue (`ReviewsContext`) until an admin approves them; approved reviews display a "Verified Purchase" badge when the reviewer actually bought that title.
- **Wishlist**: heart-toggle save/remove from the book modal, a header icon with saved-count badge, and a dedicated `/wishlist` page.
- **Refunds**: admin can refund any paid order from the Orders tab; refunded orders are excluded from revenue and correctly reflected in the customer's order history.

## Admin Back Office Enhancements

The Admin page (`src/app/pages/Admin.tsx`) is organized into six tabs, each its own component under `src/app/pages/admin/`:

- **Books** — add/edit/delete titles, per-format price & stock editing, cover image upload (file → stored image, with URL fallback) both when adding a new book and per-row on existing ones, plus a Description field.
- **Orders** — revenue dashboard (total revenue, paid/pending/failed counts), fulfillment status control, and the refund action.
- **Reviews** — moderation queue: approve, reject, or delete submitted reviews.
- **People** — manage Authors and Team members shown on the public Authors and About pages: add/delete, inline-editable name/title/recognition fields, photo upload, and an expandable bio editor per person.
- **Messages** — every Contact form submission lands here as a card with a highlighted subject badge (Manuscript Submission, Rights & Permissions, General Inquiry, Media Request, Other), a relative timestamp, a truncated summary with "Read more," and mark-as-read/delete actions; an unread-count badge appears on the tab itself. Each card also shows a **Registered Account** or **Guest** badge — messages submitted while logged in are tagged with that user's ID (`ContactMessage.userId`) and pre-fill the sender's name/email from their account.
- **Settings** — edit the site's public contact info (location, phone, primary/secondary email) and footer social links (Instagram, Facebook, Twitter/X, LinkedIn, YouTube) via `SiteSettingsContext`. Changes apply live, everywhere those values are shown (Contact page, Footer) — no rebuild needed. A social icon with no URL set renders dimmed/disabled in the footer rather than linking to `#`. The settings object is merged over its seed defaults on read, so fields added later (like YouTube) never come back `undefined` for a browser that saved settings before that field existed.

Reviews also show which account submitted them: the Reviews tab displays the reviewer's account email (looked up live from `AuthContext`) alongside a **Registered Account** badge, since reviews have always required being logged in.

## Content Migration (Dominari → Procura)

The Dominari brand's real published content was extracted from its legacy codebase and used to replace all placeholder/fictional seed data:

- **Catalog**: the real 7-title catalog (Jasper Okedi's 6 poetry books plus the *Souls Soliloquy* magazine issue) with actual cover art, descriptions, genres, and prices, replacing the fictional starter catalog.
- **People**: real authors (Jasper Okedi, Hood Lubowa) and 9 real team members with real photos, wired into the Authors page and the About page's "Our Team" section (which is now data-driven from the People admin tab instead of hardcoded markup).
- **Quotes**: real first-person quotes from Jasper Okedi replace the fictional author testimonials on the Authors page.
- **Contact info**: real location (Kampala, Uganda), phone, and email addresses replace the placeholder NYC address across the Contact page and footer, plus a working Instagram link.
- Leftover "Dominari" brand text mentions from the original template were corrected to "Procura."
- **Video**: the Authors page now embeds a YouTube interview ("Watch the Interview" section) placed right after the Jasper Okedi featured-quote section and before the submission-process CTA — pairing his written words with a video conversation before inviting other authors to submit.

## Demo Accounts

- `admin@procura.com` / `admin123` — **admin** demo account.
- `emmit@procura.com` / `emmit123` — regular **customer** demo account (Emmit Christopher). Originally seeded as a second admin account by mistake — corrected so it now behaves like any other customer (no `/admin` access).

These are **not** displayed anywhere in the app UI (see Access Control below) — keep this README as the reference copy.

⚠️ **If you already logged in with the Emmit account before this fix**, your browser's `localStorage` still has the old `isAdmin: true` copy cached under the `procura_users` key (the seed data only applies on a browser's first load — it doesn't retroactively update accounts already saved). Log out, clear the site's local storage (DevTools → Application → Local Storage → delete the `procura_users` and `procura_current_user` keys, or just clear all site data) and log back in to pick up the fix.

## Access Control

- Admin-only routes and UI (`/admin`, the "Admin" link in the header account menu) are gated on `user.isAdmin`, checked in `src/app/pages/Admin.tsx`. Only the `admin@procura.com` seed account has `isAdmin: true`.
- Accounts created via the public Register form (`AuthContext.register`) never receive `isAdmin` — regular/demo customer accounts are correctly redirected away from `/admin` back to the homepage. Verified directly: both a freshly registered account and the corrected `emmit@procura.com` account are bounced from `/admin` back to `/`, and the header's account dropdown shows no "Admin" link for them.
- **Fixed (this session)**: `emmit@procura.com` had mistakenly been seeded with `isAdmin: true` in an earlier session, so logging in with it granted admin access even though it was meant to be an ordinary demo user account. Corrected in `src/app/state/AuthContext.tsx` to `isAdmin: false`.
- **Fixed (previous session)**: the Login page used to print the demo admin credentials in plaintext under the sign-in form, which meant any visitor could read them off the screen and log in as an admin without actually being one. That hint has been removed from `src/app/pages/Login.tsx` — the credentials still work, but they're no longer advertised anywhere in the UI.
- Caveat inherent to this being a frontend-only, `localStorage`-backed demo: there is no real backend enforcing this, so a user with devtools access could still hand-edit their own `procura_current_user` entry to set `isAdmin: true`. That's not fixable without a real auth backend (Phase 0 of the roadmap) — the fixes above close the actual UI-level leaks, not client-side tampering.

## Known Placeholders / Follow-ups

- Payment is simulated, not a live Pesapal integration.
- Physical stock/pricing for the migrated catalog was estimated (the source material only provided one price per title) — worth adjusting to real figures via the Admin Books tab.
- Not yet built: gifting flow, dedicated customer support/FAQ surface, recommendations, bundles, newsletter, multi-language support (see the original execution roadmap for the full Phase 3 list).
- No real backend/auth server yet, so admin access control is UI-level only (see Access Control above) — a real auth backend remains a Phase 0 item for genuine security.
