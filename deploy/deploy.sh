#!/usr/bin/env bash
# One-command deploy for the LogixaLab VPS.
# Run from the project directory after SSH-ing into the server. Safe to re-run.
#
#   bash deploy/deploy.sh
#
# It installs deps (so new packages like nodemailer land), rebuilds, and
# reloads the PM2-managed Next server with zero downtime.
set -euo pipefail

echo "→ Pulling latest from git (fast-forward only)..."
git pull --ff-only

echo "→ Installing dependencies (clean, reproducible)..."
npm ci

echo "→ Building production bundle..."
npm run build

echo "→ Reloading via PM2..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js

echo "✓ Deploy complete."
