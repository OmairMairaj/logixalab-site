import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Pin Turbopack root so module resolution stays in this app when parent dirs have lockfiles. */
  turbopack: {
    root: projectRoot,
  },

  /** Images are pre-compressed to WebP at capped sizes via scripts/optimize-images.mjs,
   *  so we skip Next's on-demand optimizer — the assets are already sized right and this
   *  avoids per-transformation image usage on Vercel. */
  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  /** Dev only: allow HMR when tunneling (e.g. ngrok). Add new hostnames if your tunnel URL changes. */
  allowedDevOrigins: ["subgular-olericultural-danyel.ngrok-free.dev"],
};

export default nextConfig;
