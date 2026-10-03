# Japhet Nyangaresi — Portfolio

Personal portfolio site. Full-stack and AI engineer.

**Live:** https://japhet-dev-portfolio.netlify.app/

## Stack

React 19 + TypeScript + Vite, deployed on Netlify. Static site — no backend; the contact form posts to Formspree.

## Layout

```
app/                    The entire site (React + Vite)
  index.html            App shell + module entry
  src/
    content.ts          All copy (English) + project case studies + links
    App.tsx             Page composition, project filter, case-study dialog
    ProjectArt.tsx      Code-drawn project covers + interactive demo slices
    demo-model.ts       Sample-data models (ILANA / ReMarket / VibeMeet / Student Hub)
    Sculpture.tsx       Interactive canvas wireframe sculpture
    ContactForm.tsx     Formspree contact form
    styles.css, adaptation.css, project-art.css
  public/               Fonts, images, robots.txt, sitemap.xml
  tests/                Vitest unit tests
netlify.toml            Build config (base = app) + security/cache headers
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

- Copy, projects and links: edit `app/src/content.ts`.
- Contact form: posts to Formspree form `xgokqedp` (see `app/src/ContactForm.tsx`).
- Resume: the "Download resume" button generates a UTF-8 `.txt` from the same content.

## Notes

- Single language (English). All assets are local — no external font or service calls.
- The interactive demo slices run on local sample data only, with clearly labelled fictional examples.