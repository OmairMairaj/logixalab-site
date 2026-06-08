import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Pin Turbopack root so module resolution stays in this app when parent dirs have lockfiles. */
  turbopack: {
    root: projectRoot,
  },

  /** Hostinger's Node runtime OOMs/times out optimizing large PNGs (and sharp
   *  may be unavailable), which 500s the /_next/image endpoint and breaks the
   *  hero background. Serve the files directly instead of through the optimizer.
   *  NOTE: this ships the originals as-is, so keep public/images sizes in check. */
  images: {
    unoptimized: true,
  },

  /** Cache /public images so quick refreshes reuse them instead of re-downloading
   *  (fewer concurrent requests per load = less chance a flaky managed-host
   *  response drops one). SWR keeps them reasonably fresh if an image changes. */
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
