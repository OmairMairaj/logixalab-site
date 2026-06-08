/**
 * PM2 process config for the LogixaLab Next.js server on the Hostinger VPS.
 *
 * Why PM2: it keeps `next start` alive, restarts it automatically if it crashes
 * or runs out of memory, and brings it back on server reboot — which is what
 * fixes the "page is broken until I refresh" symptom (a dead/over-budget Node
 * process serving partial assets).
 *
 * Deploy (run on the VPS, in the project dir):
 *   npm ci
 *   npm run build
 *   pm2 start ecosystem.config.js
 *   pm2 save          # remember the process list
 *   pm2 startup       # run the printed command once so PM2 starts on boot
 *
 * Redeploy after a git pull:
 *   git pull && npm ci && npm run build:server && pm2 reload logixalab
 *
 * SMTP secrets live in `.env.local` (gitignored); Next loads it automatically
 * at runtime — do NOT put them here (this file is committed).
 */
module.exports = {
  apps: [
    {
      name: "logixalab",
      // Call the Next binary directly so PM2 owns the actual server process
      // (more reliable restarts than going through `npm`).
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      interpreter: "node",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
