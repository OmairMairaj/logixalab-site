<?php
/**
 * Deploy diagnostics — visit https://logixalab.com/health.php after every upload.
 * Safe to leave on the server (read-only checks, no secrets).
 */
header("Content-Type: text/plain; charset=utf-8");

$root = __DIR__;
$indexPath = $root . "/index.html";

echo "LogixaLab deploy health check\n";
echo "=============================\n\n";

if (!is_file($indexPath)) {
    echo "[FAIL] index.html is missing\n";
    exit(1);
}

$index = file_get_contents($indexPath);
$usesNxt = str_contains($index, "/nxt/");
$usesOldNext = str_contains($index, "/_next/");

echo "[index] references /nxt/:   " . ($usesNxt ? "YES (good)" : "NO") . "\n";
echo "[index] references /_next/: " . ($usesOldNext ? "YES (stale build — redeploy)" : "NO") . "\n";

$nxtChunks = $root . "/nxt/static/chunks";
echo "[disk]  nxt/static/chunks/:  " . (is_dir($nxtChunks) ? "YES" : "MISSING") . "\n";
echo "[disk]  images/:             " . (is_dir($root . "/images") ? "YES" : "MISSING") . "\n";

if (preg_match('/href="(\/nxt\/static\/chunks\/[^"]+\.css)"/', $index, $m)) {
    $cssWeb = $m[1];
    $cssDisk = $root . $cssWeb;
    echo "[css]   linked: {$cssWeb}\n";
    echo "[css]   on disk: " . (is_file($cssDisk) ? "YES" : "NO — index and nxt/ are out of sync") . "\n";
} elseif (preg_match('/href="(\/_next\/static\/chunks\/[^"]+\.css)"/', $index, $m)) {
    echo "[css]   linked (stale): {$m[1]}\n";
    echo "[css]   on disk: NO — upload a fresh index.html from npm run build:hostinger\n";
}

if (preg_match('/src="(\/nxt\/static\/chunks\/[^"]+\.js)"/', $index, $m)) {
    $jsDisk = $root . $m[1];
    echo "[js]    sample: {$m[1]}\n";
    echo "[js]    on disk: " . (is_file($jsDisk) ? "YES" : "NO") . "\n";
}

echo "\n";
if ($usesOldNext || !$usesNxt) {
    echo "RESULT: BROKEN — replace ALL files from out/ (full zip extract).\n";
    echo "Git auto-deploy may be overwriting index.html with an old build.\n";
    echo "Disable Git deploy in hPanel or set build to: bash deploy/hostinger-build.sh\n";
    exit(1);
}

if (!is_dir($nxtChunks)) {
    echo "RESULT: BROKEN — nxt/ folder missing. Re-run deploy-extract or FTP upload out/.\n";
    exit(1);
}

echo "RESULT: OK — assets and index.html look aligned.\n";
