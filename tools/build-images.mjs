// Builds the portfolio images from source files.
// Run from tools/:  npm install  &&  npx playwright install chromium  &&  npm run build:images
// Paths are relative to the site root.

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { chromium } from "playwright";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const profilePhoto = join(siteRoot, "assets", "images", "profile-photo.jpg");
const favicon = join(siteRoot, "favicon.svg");
const ogShareCard = join(siteRoot, "tools", "og-share-card.html");

async function buildProfilePhotos() {
  const image = sharp(profilePhoto).resize(192, 192, { fit: "cover" });
  await image.clone().webp({ quality: 85 }).toFile(join(siteRoot, "assets", "images", "profile-photo-192.webp"));
  await image.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(join(siteRoot, "assets", "images", "profile-photo-192.jpg"));
  console.log("profile-photo-192.webp and .jpg done");
}

// The share image is a screenshot of og-share-card.html, so it uses the real
// Schibsted Grotesk web font. If the font or photo did not load, stop without
// writing the image rather than saving one with a fallback font.
async function buildOgImage() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(pathToFileURL(ogShareCard).href, { waitUntil: "networkidle" });

    const status = await page.evaluate(async () => {
      await document.fonts.ready;
      // fonts.check() also returns true when no Schibsted face was registered at all
      // (for example, the Google Fonts stylesheet failed), so look for a loaded face too.
      const hasLoadedFace = [...document.fonts].some(
        (face) => face.family.replace(/"/g, "") === "Schibsted Grotesk" && face.weight === "800" && face.status === "loaded",
      );
      const photo = document.querySelector(".photo");
      return {
        font: hasLoadedFace && document.fonts.check('800 72px "Schibsted Grotesk"'),
        photo: Boolean(photo && photo.complete && photo.naturalWidth > 0),
      };
    });

    if (!status.font) {
      throw new Error("Schibsted Grotesk 800 did not load (check your internet connection). og-image.png was not written.");
    }
    if (!status.photo) {
      throw new Error("The profile photo did not load in og-share-card.html. og-image.png was not written.");
    }

    await page.screenshot({ path: join(siteRoot, "assets", "og", "og-image.png") });
    console.log("og-image.png done");
  } finally {
    await browser.close();
  }
}

async function buildAppleTouchIcon() {
  await sharp(favicon, { density: 180 })
    .resize(180, 180)
    .png()
    .toFile(join(siteRoot, "assets", "icons", "apple-touch-icon.png"));
  console.log("apple-touch-icon.png done");
}

await buildProfilePhotos();
await buildOgImage();
await buildAppleTouchIcon();
console.log("All images built.");
