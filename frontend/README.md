# Pumpsquare Systems LLP — Phase 1 Website

Modern, responsive corporate website for Pumpsquare Systems LLP, built with
Next.js (App Router), TypeScript and Tailwind CSS v4, using the official
**Industrial Navy + Orange** design theme.

## Pages

| Route         | Description                                   |
| ------------- | --------------------------------------------- |
| `/`           | Homepage (hero, stats, about, products, industries, capabilities) |
| `/about`      | About Us (full company, infrastructure, R&D and certification content) |
| `/industries` | Industries We Serve                           |
| `/contact`    | Contact information, enquiry form and map     |

Phase 1 is the main website only. Product catalogue management, admin
authentication and CRUD belong to Phase 2 and are intentionally not built.

## Getting started

```bash
npm install
npm run dev    # development server
npm run lint   # ESLint
npm run build  # production build
```

## Design system

Official theme: **Industrial Navy + Orange**. Colour tokens are defined in
`app/globals.css` (Tailwind v4 `@theme`):

| Token                  | Value     | Usage                                          |
| ---------------------- | --------- | ---------------------------------------------- |
| `--color-primary`      | `#183B63` | Industrial Navy — brand, header/footer, overlays, headings |
| `--color-primary-dark` | `#132E4F` | Navy hover                                     |
| `--color-primary-deep` | `#0F2440` | Deepest navy — footer / hero overlays          |
| `--color-primary-soft` | `#EDF2F8` | Light navy tint (icon tiles, info panels)      |
| `--color-steel`        | `#315C8C` | Steel Blue — icons, links, supporting UI       |
| `--color-steel-soft`   | `#D9E3F0` | Light steel tint                               |
| `--color-accent`       | `#F5A623` | Accent Orange — primary CTAs, active indicators, decorative bars |
| `--color-accent-dark`  | `#D9921A` | Orange hover                                   |
| `--color-accent-soft`  | `#FDF1DE` | Light orange tint (hover states, dropdowns)    |
| `--color-silver`       | `#BAC7D7` | Text on navy surfaces                          |
| `--color-surface`      | `#F5F7FA` | Page background                                |
| `--color-ink`          | `#172B45` | Primary text                                   |
| `--color-muted`        | `#64748B` | Secondary text                                 |
| `--color-line`         | `#E2E8F0` | Borders                                        |

Colour usage rules: navy carries the brand (header/footer/hero overlays);
steel blue supports icons and links; **orange is an accent only** — primary CTA
buttons, the active/hover nav underline, small decorative bars, required-field
asterisks and hover highlights. White and light grey keep content sections
clean; section backgrounds alternate white / light grey with navy for
high-impact bands.

Button variants (`components/ui/ButtonLink.tsx`):
`primary` (orange/white), `secondary` (navy/white), `outline` (navy border, orange
hover accent), `outlineLight` (for navy backgrounds), `light` (white, orange hover).

Typography: **Manrope** (display/headings) and **Inter** (body), self-hosted via
`next/font`.

Icons: `lucide-react`.

> Note: white text on the brand orange `#F5A623` is below WCAG AA contrast for
> small text. It is kept because the brief specifies white-on-orange CTAs; if
> stricter contrast is ever required, switch button text to navy `#183B63`
> (passes AA) without changing the palette.

## Content provenance

All company copy, statistics, product names, industry labels and contact details
were taken verbatim from the existing pumpsquare.com website (homepage,
`about.html`, `contact.html`, `header.html`, `footer.html`) so no business
claims were invented. Original spelling from the source pages is preserved on
the About page (e.g. "Infrastucture", "Devlopment") per the project brief —
request corrections explicitly if you want them fixed.

Images in `public/images/` were downloaded from the live site and are meant to
be replaced with official high-resolution photography over time:

- `water3.jpg` — hero background
- `pump1.jpg`–`pump4.jpg` — pump photography (about, capability sections)
- `products/` — nine top-product thumbnails (source images are only 200×112 px,
  so they are displayed small; supply larger images before enlarging the cards)
- `industries/` — eight industry images

### Logo

The only logo asset on the live site (`public/images/LOGO.jpg`, 4800×4800)
contains the letters "PUMP" on a heavily padded square, so it cannot be used as
a wordmark. The header/footer therefore use a clean text-based brand treatment
in `components/layout/Logo.tsx`. **To swap in the official logo later, replace
the inner markup of that single component with `next/image` — nothing else needs
to change.**

### Known contact-detail discrepancies (preserved, not silently resolved)

The live website shows different address/email variants in different places.
Both variants are preserved exactly where they appear:

- **Contact page** uses: `info@pumpsquare.com` and "Plot No. 1903, Phase IV,
  G.I.D.C Estate, Via Anand, Vithal Udyog Nagar - 388121, Gujarat, India."
- **Footer** uses the original footer markup's variant: `response@pdpumpindia.com`
  and "Plot. No. 1903, Road A-30, Phase IV, GIDC Estate, Via Anand, V.U. Nagar,
  Gujarat, 388121, India".

Confirm with the client which variant is canonical before merging them.

Employee-corner links point to `http://webmail.pumpsquare.com/` exactly as on
the current site. Product dropdown items temporarily deep-link to the existing
legacy product pages on pumpsquare.com until real `/products/...` routes are
built in Phase 2.

## Connecting the contact form

The form is fully built and validated (client + server), but **email delivery is
not configured** — the API route responds with `code: "NOT_CONFIGURED"` and the
UI tells visitors to email `info@pumpsquare.com` directly. Nothing is faked.

To enable real submissions, edit `app/api/contact/route.ts` and integrate an
email provider with the already-validated payload (`firstName`, `lastName`,
`email`, `phone`, `subject`, `message`), e.g.:

1. Store an API key in an environment variable (`.env.local`, never committed),
2. Send the email server-side (Resend, SMTP/`nodemailer`, or similar),
3. Return `{ ok: true }` on success and `{ ok: false, code: "SEND_FAILED" }` on
   failure — the form already handles both responses.

## SEO & accessibility

- Per-page `metadata` titles/descriptions, OpenGraph, `sitemap.xml`, `robots.txt`
- Semantic landmarks, skip-to-content link, breadcrumb labels, form labels with
  `aria-invalid`/`aria-describedby`, visible focus states
- Scroll animations respect `prefers-reduced-motion`
- Fully responsive: mobile hamburger nav, tablet/mobile grids, no horizontal
  overflow

## Project structure

```
app/                  # App Router pages, layout, API route, SEO files
components/
  layout/             # Header, MobileNavigation, Footer, Logo
  home/               # Homepage sections
  contact/            # ContactInformation, ContactForm
  ui/                 # Reveal, SectionHeading, PageHero, ButtonLink
lib/
  content.ts          # All site copy and data (single source of truth)
  utils.ts            # cn() helper
public/images/        # Imagery (replace with official assets over time)
```
