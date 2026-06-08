export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "Logixa Lab",
    short_name: "Logixa Lab",
    description:
      "Enterprise platforms, AI systems, cloud infrastructure, and digital experiences engineered to perform under real-world pressure.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0c",
    theme_color: "#ccff00",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
