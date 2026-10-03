# Japhet Nyangaresi — Portfolio

Personal portfolio site. Full-stack and AI engineer.

**Live:** https://japhet-dev-portfolio-chi.vercel.app/

## Stack

React 19 + TypeScript + Vite, deployed on Vercel. Static site — no backend; the contact form posts to Formspree. Zero animation/3D dependencies: the carousel is pure CSS transforms, the sculpture is hand-rolled canvas.

## Layout

```
app/                    The entire site (React + Vite)
  index.html            App shell + SEO/Open Graph metadata
  src/
    content.ts          All copy (English) + six project case studies + links
    model.ts            Filtering, resume builder, sculpture geometry
    demo-model.ts       Sample-data models (ILANA / ReMarket / VibeMeet / Student Hub / Nuru AI / GradeCast)
    App.tsx             Page composition, filter, palette commands
    Sculpture.tsx       Interactive canvas wireframe sculpture + skill typewriter
    ProjectArt.tsx      Code-drawn project covers + interactive demo slices
    ContactForm.tsx     Formspree contact form (with _gotcha honeypot)
    components/
      ProjectCarousel.tsx  CSS-3D carousel: autoplay, keyboard, swipe, pointer tilt
      carousel.css
      CaseStudyDialog.tsx  Case study: demo slice, architecture flow, technical fingerprint
      CommandPalette.tsx   Ctrl/Cmd+K palette (sections, case studies, resume, socials)
      command-palette.css
      Reveal.tsx           IntersectionObserver scroll-reveal wrapper
    hooks/useReducedMotion.ts
    styles.css, adaptation.css, project-art.css
  public/               Fonts, images, og.png, robots.txt, sitemap.xml
  tests/                Vitest unit tests (56)
vercel.json            Build (app dir) + security/cache headers
```

## Commands

```
cd app
npm install
npm run dev      # local dev server
npm run check    # tsc --noEmit
npm test         # vitest run
npm run build    # typecheck + production build to app/dist
```

## Content

- Copy, projects and links: edit `app/src/content.ts`. Projects carry a `fingerprint` (stack groups) and `architecture` (flow steps) — both render in the case study.
- Contact form: posts to Formspree form `xgokqedp` (see `app/src/ContactForm.tsx`).
- Resume: "Download resume" generates a UTF-8 `.txt`; "Print resume / Save PDF" prints a dedicated A4 layout (`.print-resume`).
- Building-status projects (Student Hub, Nuru AI, GradeCast) intentionally have no live links until they ship.

## Notes

- Single language (English). All assets are local — no external font or service calls.
- The interactive demo slices run on local sample data only, clearly labelled (Nuru AI is a scripted preview with no live model; GradeCast runs exported linear-model weights client-side on synthetic training data).
- Reduced motion: no autoplay, no tilt, no 3D — simple fades, full functionality.
