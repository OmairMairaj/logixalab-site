/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  /** Hostinger's Node runtime OOMs/times out optimizing large PNGs (and sharp
   *  may be unavailable), which 500s the /_next/image endpoint and breaks the
   *  hero background. Serve the files directly instead of through the optimizer.
   *  NOTE: this ships the originals as-is, so keep public/images sizes in check. */
  images: {
    unoptimized: true,
  },

  /** Dev only: allow HMR when tunneling (e.g. ngrok). Add new hostnames if your tunnel URL changes. */
  allowedDevOrigins: ["subgular-olericultural-danyel.ngrok-free.dev"],
};

export default nextConfig;
