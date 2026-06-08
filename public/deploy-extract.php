<?php
/**
 * One-time Hostinger deploy helper.
 * Upload logixalab-hostinger.zip + this file to public_html, then open:
 *   https://yourdomain.com/deploy-extract.php?key=YOUR_KEY_FROM_DEPLOY-KEY.txt
 * DELETE this file after a successful extract.
 */

header("Content-Type: text/plain; charset=utf-8");

$keyFile = __DIR__ . "/DEPLOY-KEY.txt";
$zipFile = __DIR__ . "/logixalab-hostinger.zip";

if (!file_exists($keyFile)) {
    http_response_code(500);
    echo "Missing DEPLOY-KEY.txt. Re-upload the full deploy zip.\n";
    exit;
}

$expectedKey = trim((string) file_get_contents($keyFile));
$providedKey = trim((string) ($_GET["key"] ?? ""));

if ($expectedKey === "" || !hash_equals($expectedKey, $providedKey)) {
    http_response_code(403);
    echo "Forbidden. Add ?key=... from DEPLOY-KEY.txt\n";
    exit;
}

if (!file_exists($zipFile)) {
    http_response_code(500);
    echo "Missing logixalab-hostinger.zip in public_html.\n";
    exit;
}

if (!class_exists("ZipArchive")) {
    http_response_code(500);
    echo "PHP ZipArchive is not available on this host.\n";
    exit;
}

$zip = new ZipArchive();
if ($zip->open($zipFile) !== true) {
    http_response_code(500);
    echo "Could not open logixalab-hostinger.zip\n";
    exit;
}

$written = 0;
$skipped = 0;

for ($i = 0; $i < $zip->numFiles; $i++) {
    $entry = $zip->getNameIndex($i);
    if ($entry === false) {
        continue;
    }

    // Windows-built zips may use backslashes — normalize for Linux/Apache.
    $relative = str_replace("\\", "/", $entry);
    $relative = ltrim($relative, "/");

    if ($relative === "" || str_ends_with($relative, "/")) {
        continue;
    }

    // Zip-slip guard
    if (str_contains($relative, "..")) {
        $skipped++;
        continue;
    }

    $target = __DIR__ . "/" . $relative;
    $dir = dirname($target);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        echo "Failed to create directory: {$dir}\n";
        $zip->close();
        exit(1);
    }

    $contents = $zip->getFromIndex($i);
    if ($contents === false) {
        $skipped++;
        continue;
    }

    if (file_put_contents($target, $contents) === false) {
        echo "Failed to write: {$relative}\n";
        $zip->close();
        exit(1);
    }

    $written++;
}

$zip->close();

echo "Deploy extract complete.\n";
echo "Files written: {$written}\n";
if ($skipped > 0) {
    echo "Entries skipped: {$skipped}\n";
}

$checks = ["index.html", "nxt/static/chunks", "images/background.webp", ".htaccess"];
foreach ($checks as $check) {
    echo (is_file(__DIR__ . "/" . $check) || is_dir(__DIR__ . "/" . $check) ? "[ok] " : "[MISSING] ") . "{$check}\n";
}

echo "\nDelete deploy-extract.php and logixalab-hostinger.zip after verifying the site.\n";
