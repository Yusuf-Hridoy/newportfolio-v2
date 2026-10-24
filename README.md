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
- `data/` — site-health.json, the last test-run results shown on the page
- `assets/` — images, social-card files and icons
- `tools/` — the image build script (not needed by the site)

## Rebuild the images

```
cd tools
npm install
npm run build:images
```

This rebuilds the 192px profile photos, the og-image.png share image and the apple-touch-icon.

## Cache note

CSS and JS are cached for a year on Netlify. When you change CSS or JS, bump the `?v=`
number in index.html and 404.html.
