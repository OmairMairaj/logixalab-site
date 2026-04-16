/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  /** Dev only: allow HMR when tunneling (e.g. ngrok). Add new hostnames if your tunnel URL changes. */
  allowedDevOrigins: ["subgular-olericultural-danyel.ngrok-free.dev"],
};

export default nextConfig;
