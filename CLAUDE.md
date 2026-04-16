# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for Nehme Radiators, a Lebanese radiator repair and manufacturing company (est. 1971). No build system — open `index.html` directly in a browser to preview.

## Architecture

Single-page site with all content in `index.html`, styled by `css/styles.css`, with minimal JS in `js/scripts.js`.

**Sections (in order):** Navbar → Hero → About → Services → Products → Educational → Offers → Testimonials → CTA → Footer

**CDN dependencies (no local installs):**
- Bootstrap 5.3
- Font Awesome 6.4
- Google Fonts (Open Sans)

## Key Conventions

**Brand colors** (defined as CSS variables in `styles.css`):
- `--primary: #09162d` (dark navy — used for buttons, accents, headers)
- `--secondary: #76777a`
- `--dark: #2e353e` (footer background)
- `--light: #f7f7f7`

**WhatsApp CTA pattern** — all product and offer buttons link to WhatsApp with pre-filled messages:
```
https://wa.me/9613662887?text=I%20want%20to%20ask%20you%20about%20the%20[Product%20Name]
```

**Product cards** use `.btn-shop-now` (not Bootstrap's `.btn`) for the WhatsApp button.

**Section IDs** used for nav anchors: `#about`, `#services`, `#industrial`, `#commercial`, `#automotive`, `#products`, `#educational`, `#offers`, `#contact`

## Images

All images live in `images/`. Product images should be named descriptively (e.g., `Deutschol Antifreez.png`). Hero background is `images/2.jpg` referenced from CSS via `url("../images/2.jpg")`.