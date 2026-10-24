// Builds the portfolio images from source files.
// Run from tools/:  npm install  &&  npm run build:images
// Paths are relative to the site root.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const profilePhoto = join(siteRoot, "assets", "images", "profile-photo.jpg");
const favicon = join(siteRoot, "favicon.svg");

async function buildProfilePhotos() {
  const image = sharp(profilePhoto).resize(192, 192, { fit: "cover" });
  await image.clone().webp({ quality: 85 }).toFile(join(siteRoot, "assets", "images", "profile-photo-192.webp"));
  await image.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(join(siteRoot, "assets", "images", "profile-photo-192.jpg"));
  console.log("profile-photo-192.webp and .jpg done");
}

function buildOgCardSvg(photoBase64) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#011A27"/>
  <defs>
    <clipPath id="photo-circle">
      <circle cx="960" cy="315" r="150"/>
    </clipPath>
  </defs>
  <image xlink:href="data:image/jpeg;base64,${photoBase64}" href="data:image/jpeg;base64,${photoBase64}" x="810" y="165" width="300" height="300" clip-path="url(#photo-circle)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="960" cy="315" r="150" fill="none" stroke="#24506A" stroke-width="4"/>
  <text x="80" y="300" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="72" font-weight="600" fill="#EEF3F7">Md Yusuf Ahmed</text>
  <text x="80" y="378" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="36" font-weight="500" fill="#E6DF44">QA Automation Engineer (SDET)</text>
  <text x="80" y="438" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="27" font-weight="400" fill="#A2B3C1">Playwright · API testing · LLM quality</text>
</svg>
`;
}

async function buildOgImage() {
  const photoBase64 = readFileSync(profilePhoto).toString("base64");
  const svg = buildOgCardSvg(photoBase64);
  const ogCardPath = join(siteRoot, "assets", "og", "og-card.svg");
  writeFileSync(ogCardPath, svg);
  await sharp(Buffer.from(svg), { density: 96 }).resize(1200, 630).png().toFile(join(siteRoot, "assets", "og", "og-image.png"));
  console.log("og-card.svg and og-image.png done");
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
