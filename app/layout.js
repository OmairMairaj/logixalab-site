import { Michroma, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import SmoothScroll from "@/app/components/SmoothScroll";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: {
    template: "%s — Logixa Lab",
    default: "Logixa Lab — Engineering & AI Solutions",
  },
  description:
    "Logixa Lab builds enterprise platforms, AI systems, cloud infrastructure, and digital experiences engineered to perform under real-world pressure.",
  keywords: [
    "AI solutions",
    "software engineering",
    "enterprise platforms",
    "cloud infrastructure",
    "digital experiences",
    "Logixa Lab",
  ],
  authors: [{ name: "Logixa Lab", url: "https://logixalab.com" }],
  creator: "Logixa Lab",
  metadataBase: new URL("https://logixalab.com"),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logixalab.com",
    siteName: "Logixa Lab",
    title: "Logixa Lab — Engineering & AI Solutions",
    description:
      "Enterprise platforms, AI systems, cloud infrastructure, and digital experiences built in-house by one integrated team.",
    images: [{ url: "/images/logo-color.png", width: 512, height: 512, alt: "Logixa Lab" }],
  },
  twitter: {
    card: "summary",
    title: "Logixa Lab — Engineering & AI Solutions",
    description:
      "Enterprise platforms, AI systems, cloud infrastructure, and digital experiences built in-house by one integrated team.",
    images: ["/images/logo-color.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${michroma.variable} min-h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
