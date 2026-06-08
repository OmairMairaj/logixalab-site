/* One-off image optimizer (run manually, NOT part of the build):
 *   node scripts/optimize-images.mjs
 *
 * The site runs with next.config images.unoptimized:true (the Hostinger host
 * OOMs the Next optimizer), so heavy source files ship as-is. This pre-compresses
 * them:
 *   - Non-team heavy PNG/JPG  -> sibling .webp at a capped resolution. Code refs
 *     are updated separately; the originals are removed later (after verify).
 *   - public/team/*.png       -> recompressed IN PLACE (same name + .png format,
 *     refs unchanged, NO files deleted), per project decision.
 *
 * This repo is not under git, so every original is copied to .image-backup/
 * before any destructive change, making the pass reversible.
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink, copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const BACKUP = path.join(ROOT, ".image-backup");

const kb = (n) => `${(n / 1024).toFixed(0).padStart(6)} KB`;
let savedBytes = 0;

async function backup(absSrc, relKey) {
  const dest = path.join(BACKUP, relKey);
  await mkdir(path.dirname(dest), { recursive: true });
  if (!existsSync(dest)) await copyFile(absSrc, dest);
}

/* ---- Non-team targets → .webp (sibling). { file, maxEdge, quality } ---- */
const webpTargets = [
  // Work screenshots (CSS background-image) — big detail, generous cap.
  ...["shopbreeze", "atlascrm", "voltpay", "nexusflow", "pulsehealth"].map((n) => ({
    file: `images/work/${n}.png`,
    maxEdge: 1600,
    quality: 80,
  })),
  // Capability cards — shown ~28vw.
  ...["cap-enterprise", "cap-ai-automation", "cap-mobile", "cap-uiux", "cap-cloud", "cap-data-science"].map((n) => ({
    file: `images/capabilities/${n}.png`,
    maxEdge: 1000,
    quality: 80,
  })),
  // Hero portrait + masked robot.
  { file: "images/hero-female.png", maxEdge: 1000, quality: 82 },
  { file: "images/hero-robot.png", maxEdge: 1000, quality: 82 },
  // Soft glows / decorative — low quality is invisible on blurred art.
  { file: "images/left.png", maxEdge: 1200, quality: 72 },
  { file: "images/right.png", maxEdge: 1200, quality: 72 },
  { file: "images/wide-blur.png", maxEdge: 1600, quality: 72 },
  { file: "images/binary.png", maxEdge: 1200, quality: 78 },
  // Map (needs detail) + contact background.
  { file: "images/world-map.png", maxEdge: 1600, quality: 80 },
  { file: "images/default-contact-section-bg.jpg", maxEdge: 1600, quality: 78 },
  // Delivery framework steps.
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({
    file: `images/framework/step-0${i}.png`,
    maxEdge: 800,
    quality: 80,
  })),
];

async function toWebp({ file, maxEdge, quality }) {
  const abs = path.join(PUBLIC, file);
  if (!existsSync(abs)) {
    console.log(`  skip (missing): ${file}`);
    return;
  }
  const before = (await stat(abs)).size;
  const out = abs.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(abs)
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);
  const after = (await stat(out)).size;
  savedBytes += before - after;
  console.log(`  ${kb(before)} -> ${kb(after)}   ${file} -> ${path.basename(out)}`);
}

/* ---- Team: recompress PNG in place (keep name/format/refs, keep ALL files) ---- */
async function optimizeTeam() {
  const dir = path.join(PUBLIC, "team");
  if (!existsSync(dir)) return;
  for (const name of await readdir(dir)) {
    if (!/\.png$/i.test(name)) continue;
    const abs = path.join(dir, name);
    const before = (await stat(abs)).size;
    const tmp = `${abs}.opt.tmp`;
    await sharp(abs)
      .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 85, dither: 1 })
      .toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < before) {
      await backup(abs, `team/${name}`);
      await unlink(abs);
      await rename(tmp, abs);
      savedBytes += before - after;
      console.log(`  ${kb(before)} -> ${kb(after)}   team/${name}`);
    } else {
      await unlink(tmp);
      console.log(`  ${kb(before)} -> kept (no gain)   team/${name}`);
    }
  }
}

console.log("=== non-team → webp ===");
for (const t of webpTargets) await toWebp(t);
console.log("=== team → in-place png ===");
await optimizeTeam();
console.log(`\nTotal saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
console.log("done");
