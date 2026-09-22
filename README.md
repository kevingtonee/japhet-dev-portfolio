# Japhet Nyangaresi — Portfolio

Personal portfolio site. Full-stack and AI engineer.

**Live:** https://japhet-dev-portfolio.netlify.app/

## Stack

Plain HTML, CSS and JavaScript — no build step. Deployed on Netlify.

## Structure

```
index.html            Single-page site
assets/
  css/styles.css       All styles
  js/main.js           Nav, scroll reveal, contact form
  img/                 Profile photo + logo/favicon
  Japhet-Nyangaresi-CV.pdf   (add this — see assets/README-resume.md)
netlify.toml           Publish dir + security/cache headers
robots.txt, sitemap.xml
```

## Local preview

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Editing content

- **Copy, projects, links:** edit `index.html` directly.
- **Contact form:** posts to Formspree form `xgokqedp` (see the `action` on the form).
- **Resume:** drop `assets/Japhet-Nyangaresi-CV.pdf` into place.

## TODO

- [ ] Add resume PDF
- [x] Add live + source links to "ReMarket" when it ships
- [x] Add live + source links to "ILANA" when it ships
- [ ] Add live + source links to "Student Hub App" when it ships
- [ ] Add a dedicated AI/LLM project to the Projects section
- [ ] Consider a real screenshot for each project card
