/**
 * Hostinger shared hosting fixes after `next build` static export:
 * 1. Rename `_next/` → `nxt/` (underscore folders are easy to miss in hPanel).
 * 2. Rewrite all `/_next/` references in exported files.
 * 3. Rename chunk files that contain `~` (some Apache configs mishandle it).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "out");
const oldNextDir = path.join(outDir, "_next");
const newNextDir = path.join(outDir, "nxt");

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".txt",
  ".webmanifest",
  ".map",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

function renameTildeFiles(dir) {
  const renames = new Map();

  for (const filePath of walk(dir)) {
    const dirName = path.dirname(filePath);
    const base = path.basename(filePath);
    if (!base.includes("~")) continue;

    const safeBase = base.replaceAll("~", "-");
    const safePath = path.join(dirName, safeBase);
    fs.renameSync(filePath, safePath);
    renames.set(base, safeBase);
  }

  return renames;
}

function patchTextFiles(dir, tildeRenames) {
  for (const filePath of walk(dir)) {
    const ext = path.extname(filePath).toLowerCase();
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    let content = fs.readFileSync(filePath, "utf8");
    let next = content.replaceAll("/_next/", "/nxt/");

    for (const [from, to] of tildeRenames) {
      if (next.includes(from)) next = next.replaceAll(from, to);
    }

    if (next !== content) fs.writeFileSync(filePath, next, "utf8");
  }
}

if (!fs.existsSync(outDir)) {
  console.error(`Missing export folder: ${outDir}`);
  process.exit(1);
}

if (!fs.existsSync(oldNextDir)) {
  console.error(`Missing ${oldNextDir}. Was HOSTINGER_STATIC=1 set for the build?`);
  process.exit(1);
}

if (fs.existsSync(newNextDir)) fs.rmSync(newNextDir, { recursive: true, force: true });
fs.renameSync(oldNextDir, newNextDir);

const tildeRenames = renameTildeFiles(outDir);
patchTextFiles(outDir, tildeRenames);

fs.writeFileSync(
  path.join(outDir, "UPLOAD-README.txt"),
  [
    "LogixaLab — Hostinger upload checklist",
    "",
    "DO NOT rely on hPanel zip extract alone — it often breaks folders.",
    "",
    "Recommended:",
    "1. Upload logixalab-hostinger.zip to public_html.",
    "2. Upload deploy-extract.php and DEPLOY-KEY.txt to public_html.",
    "3. Open: https://yourdomain.com/deploy-extract.php?key=KEY_FROM_DEPLOY-KEY.txt",
    "4. Confirm [ok] for nxt/static/chunks and images/background.webp.",
    "5. Delete deploy-extract.php, DEPLOY-KEY.txt, and the zip.",
    "6. Hard-refresh the browser (Ctrl+Shift+R).",
    "",
    "See deploy/HOSTINGER.md for full instructions.",
  ].join("\n"),
  "utf8",
);

console.log("Hostinger post-build: _next → nxt, references patched.");
