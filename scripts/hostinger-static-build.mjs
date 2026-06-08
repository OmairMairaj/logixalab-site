/**
 * Static export for Hostinger shared hosting (no zip).
 * Used by: npm run build:static (Git deploy) and build-hostinger-zip.mjs
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "out");
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, "app", "_api_hostinger_backup");

export function restoreApi() {
  if (!fs.existsSync(apiBackup)) return;
  if (fs.existsSync(apiDir)) fs.rmSync(apiDir, { recursive: true, force: true });
  fs.cpSync(apiBackup, apiDir, { recursive: true });
  fs.rmSync(apiBackup, { recursive: true, force: true });
}

export function disableApi() {
  if (!fs.existsSync(apiDir)) return;
  if (fs.existsSync(apiBackup)) fs.rmSync(apiBackup, { recursive: true, force: true });
  fs.cpSync(apiDir, apiBackup, { recursive: true });
  fs.rmSync(apiDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

function walkDir(dir, count = 0) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) count = walkDir(p, count);
    else count += 1;
  }
  return count;
}

export function runHostingerStaticBuild() {
  disableApi();

  try {
    execSync("npx next build", {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        HOSTINGER_STATIC: "1",
        NEXT_PUBLIC_CONTACT_ENDPOINT: "/contact.php",
      },
    });
  } finally {
    restoreApi();
  }

  if (!fs.existsSync(outDir)) {
    throw new Error(`Build finished but "${outDir}" was not created.`);
  }

  execSync("node scripts/hostinger-postbuild.mjs", { cwd: root, stdio: "inherit" });

  const required = [".htaccess", "index.html", "contact.php", "nxt", "images"];
  const missing = required.filter((f) => !fs.existsSync(path.join(outDir, f)));
  if (missing.length) {
    throw new Error(`Missing from export: ${missing.join(", ")}`);
  }

  const nxtFiles = walkDir(path.join(outDir, "nxt"));
  const imageFiles = walkDir(path.join(outDir, "images"));
  if (nxtFiles < 10) throw new Error(`nxt/ incomplete (${nxtFiles} files).`);
  if (imageFiles < 5) throw new Error(`images/ incomplete (${imageFiles} files).`);

  // Hostinger Git UI may lock output directory to ".next" — mirror static export there.
  const nextDir = path.join(root, ".next");
  fs.rmSync(nextDir, { recursive: true, force: true });
  fs.cpSync(outDir, nextDir, { recursive: true });
  console.log("Mirrored out/ → .next/ for Hostinger Git deploy.");

  return outDir;
}

// CLI entry: npm run build:static
const isCli = process.argv[1]?.replace(/\\/g, "/").endsWith("hostinger-static-build.mjs");
if (isCli) {
  console.log("Building static export for Hostinger (out/)…\n");
  try {
    runHostingerStaticBuild();
    console.log("\n✓ Static export ready in out/\n");
  } catch (err) {
    console.error(err.message ?? err);
    process.exit(1);
  }
}
