# Japhet Nyangaresi — Portfolio

Personal portfolio for Japhet Nyangaresi.

**Live:** https://japhet-dev-portfolio-chi.vercel.app/

## Stack

- React 19 + TypeScript + Vite
- Static deployment on Vercel
- Formspree contact form
- No animation/3D dependencies: hand-rolled canvas globe, CSS 3D carousel, IntersectionObserver reveals

## Structure

```text
app/
  index.html            App shell + SEO/Open Graph/JSON-LD metadata
  src/
    content.ts          Centralized site content, projects, expertise, research copy
    model.ts            Filtering, resume builder, globe geometry
    demo-model.ts       Local sample-data models for interactive demos
    App.tsx             Page composition and sections
    ContactForm.tsx     Formspree contact form with validation + honeypot
    Sculpture.tsx       Interactive canvas stack globe
    ProjectArt.tsx      Code-drawn project covers + interactive demos
    components/         Carousel, case study dialog, command palette, reveal
    hooks/              Reduced motion and carousel helpers
    styles.css          Main design system and responsive styles
  public/               Fonts, images, OG image, robots.txt, sitemap.xml
  tests/                Vitest unit tests
vercel.json             Vercel build + headers
```

## Commands

```bash
cd app
npm install
npm run dev      # local dev server
npm run check    # tsc --noEmit
npm test         # vitest run
npm run build    # typecheck + production build
```

## Content editing

- Main content/config: `app/src/content.ts` (`site`, `copy`, `expertiseAreas`, `projects`)
- Contact endpoint: `app/src/ContactForm.tsx` uses `site.formspree`
- WhatsApp/email/social links: centralized in `app/src/content.ts`
- Project categories: `web | ai | quant | cyber`, with multi-category support via `categories: []`

## Notes

- Quantitative Finance and Cybersecurity currently use intentional empty/research-in-progress states.
- Nuru AI demo is a scripted preview (no live model). GradeCast runs exported linear-model weights client-side on synthetic training data.
- The contact email is provisional and should be confirmed before deployment.
- Reduced motion is supported across animations and interactive visuals.
