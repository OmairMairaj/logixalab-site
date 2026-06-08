#!/usr/bin/env bash
# Hostinger Git auto-deploy build script (shared hosting / public_html).
# Set this as the build command in hPanel → Git → Deployment settings.
#
#   bash deploy/hostinger-build.sh
#   (hPanel usually blocks bash — use: npm run build:static)
#
# Publish / output directory in hPanel must be: out
set -euo pipefail

API_DIR="app/api"
API_BACKUP="app/_api_hostinger_backup"

cleanup() {
  if [[ -d "$API_BACKUP" ]]; then
    rm -rf "$API_DIR"
    mv "$API_BACKUP" "$API_DIR"
  fi
}
trap cleanup EXIT

if [[ -d "$API_DIR" ]]; then
  rm -rf "$API_BACKUP"
  mv "$API_DIR" "$API_BACKUP"
fi

export HOSTINGER_STATIC=1
export NEXT_PUBLIC_CONTACT_ENDPOINT=/contact.php

npm ci
npx next build
node scripts/hostinger-postbuild.mjs

echo "✓ Static export ready in out/"
