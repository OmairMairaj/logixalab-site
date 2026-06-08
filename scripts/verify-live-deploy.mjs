/**
 * Compare the live site against the local out/ build.
 * Usage: npm run verify:live
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outIndex = path.join(root, "out", "index.html");
const site = process.env.LIVE_SITE_URL || "https://logixalab.com";

function extractCssPath(html) {
  const m = html.match(/href="(\/(?:nxt|_next)\/static\/chunks\/[^"]+\.css)"/);
  return m?.[1] ?? null;
}

function extractAssetPaths(html) {
  const paths = new Set();
  for (const m of html.matchAll(/(?:href|src)="(\/(?:nxt|_next|images)\/[^"]+)"/g)) {
    paths.add(m[1]);
  }
  return [...paths];
}

async function headOrGet(url) {
  const res = await fetch(url, { redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";
  const text = type.includes("text/html") || type.includes("text/css") || type.includes("javascript")
    ? await res.text()
    : "";
  return { status: res.status, type, snippet: text.slice(0, 80), isHtml: type.includes("text/html") };
}

if (!fs.existsSync(outIndex)) {
  console.error("Missing out/index.html — run: npm run build:hostinger");
  process.exit(1);
}

const localHtml = fs.readFileSync(outIndex, "utf8");
const localCss = extractCssPath(localHtml);

console.log(`Checking ${site} against local out/ build…\n`);

const liveRes = await fetch(`${site}/`);
const liveHtml = await liveRes.text();
const liveCss = extractCssPath(liveHtml);

console.log(`Local CSS:  ${localCss}`);
console.log(`Live CSS:   ${liveCss ?? "(none)"}`);
console.log(`Live uses /nxt/:   ${liveHtml.includes("/nxt/")}`);
console.log(`Live uses /_next/: ${liveHtml.includes("/_next/")}\n`);

if (liveCss !== localCss) {
  console.error("MISMATCH: Live index.html is not from the latest build.");
  console.error("Fix: upload the full zip via deploy-extract.php, or replace index.html from out/.");
  console.error("Also disable Hostinger Git auto-deploy if it is still enabled.\n");
}

let failed = 0;
const toCheck = [localCss, ...extractAssetPaths(localHtml).slice(0, 8)].filter(Boolean);

for (const asset of toCheck) {
  const url = `${site}${asset}`;
  const r = await headOrGet(url);
  const ok =
    r.status === 200 &&
    !r.isHtml &&
    (asset.endsWith(".css") ? r.type.includes("css") : asset.endsWith(".js") ? r.type.includes("javascript") : true);
  const label = ok ? "ok" : "FAIL";
  console.log(`[${label}] ${asset} → ${r.status} ${r.type}`);
  if (!ok) {
    failed++;
    if (r.isHtml) console.log(`       (got HTML instead of asset — file missing or .htaccess fallback)`);
  }
}

try {
  const health = await fetch(`${site}/health.php`);
  if (health.headers.get("content-type")?.includes("text/plain")) {
    console.log("\n--- health.php ---\n" + (await health.text()));
  } else {
    console.log("\n[WARN] health.php not running — upload health.php from out/ after next build");
  }
} catch {
  console.log("\n[WARN] Could not reach health.php");
}

process.exit(failed > 0 || liveCss !== localCss ? 1 : 0);
