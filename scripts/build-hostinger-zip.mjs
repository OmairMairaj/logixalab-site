/**
 * Build static export + zip for manual Hostinger upload.
 * Usage: npm run build:hostinger
 */

import { createWriteStream } from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";
import { randomBytes } from "node:crypto";
import { runHostingerStaticBuild } from "./hostinger-static-build.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "out");
const deployDir = path.join(root, "deploy");

const date = new Date().toISOString().slice(0, 10);
const zipName = `logixalab-hostinger-${date}.zip`;
const zipPath = path.join(deployDir, zipName);
const zipStablePath = path.join(deployDir, "logixalab-hostinger.zip");

function zipOutFolder(targetPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(deployDir, { recursive: true });
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);

    const output = createWriteStream(targetPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(outDir, false);
    archive.finalize();
  });
}

console.log("Building static export for Hostinger shared hosting…\n");

try {
  runHostingerStaticBuild();
} catch (err) {
  console.error(err.message ?? err);
  process.exit(1);
}

const deployKey = randomBytes(16).toString("hex");
fs.writeFileSync(path.join(outDir, "DEPLOY-KEY.txt"), deployKey, "utf8");

await zipOutFolder(zipPath);
fs.copyFileSync(zipPath, zipStablePath);

const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);

console.log(`\nDone.\n`);
console.log(`  Zip: ${zipPath}`);
console.log(`  Copy: ${zipStablePath}`);
console.log(`  Size: ${sizeMb} MB`);
console.log(`\nManual upload: deploy-extract.php + DEPLOY-KEY.txt + zip`);
console.log(`  https://logixalab.com/deploy-extract.php?key=${deployKey}`);
console.log(`\nSee deploy/HOSTINGER.md for details.\n`);
