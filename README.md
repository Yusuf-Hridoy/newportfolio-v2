# Md Yusuf Ahmed — portfolio

Personal site of Md Yusuf Ahmed, QA Automation Engineer (SDET) in Dhaka, Bangladesh.
Plain HTML, CSS and JavaScript. No build step.

Live site: https://yusufahmedd.netlify.app/

## Run it locally

```
npx serve .
```

Then open http://localhost:3000/

## Folder map

- `css/` — all styles, one file (styles.css)
- `js/` — all page behavior, one file (main.js)
- `assets/` — images, social-card files and icons
- `tools/` — the image build script (not needed by the site)

## Rebuild the images

```
cd tools
npm install
npx playwright install chromium
npm run build:images
```

This rebuilds the 192px profile photos, the og-image.png share image and the apple-touch-icon.

The share image design lives in `tools/og-share-card.html`. The build opens it in Chromium and
saves a 1200x630 screenshot to `assets/og/og-image.png`. It needs an internet connection to load
the Schibsted Grotesk font, and it stops without writing the image if the font does not load.

## Cache note

CSS and JS are cached for a year on Netlify. When you change CSS or JS, bump the `?v=`
number in index.html and 404.html.
