"use client";

import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/#work" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/#blog" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cookie Policy", href: "#cookies" },
];

function FooterColumnHeading({ children }) {
  return (
    <h3 className="text-[17px] font-medium text-(--hero-accent)">
      {children}
    </h3>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#0b0b0b] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 pt-20 pb-10 md:px-10 md:pt-24 md:pb-12">
        {/* Top: 3 columns */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Contact */}
          <div className="md:col-span-3 md:col-start-1">
            <FooterColumnHeading>Contact</FooterColumnHeading>

            <a
              href="mailto:info@logixalab.com"
              className="mt-4 block text-sm text-white/90 transition-colors duration-200 hover:text-(--hero-accent)"
            >
              info@logixalab.com
            </a>

            <ul className="mt-7 flex flex-col gap-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-white/90 transition-colors duration-200 hover:text-(--hero-accent)"
                  >
                    <RandomLetterSwapPingPong
                      label={s.label}
                      className="text-inherit"
                      staggerDuration={0.025}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-5">
            <FooterColumnHeading>Navigation</FooterColumnHeading>

            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/90 transition-colors duration-200 hover:text-(--hero-accent)"
                  >
                    <RandomLetterSwapPingPong
                      label={l.label}
                      className="text-inherit"
                      staggerDuration={0.025}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lab's Note */}
          <div className="md:col-span-4 md:col-start-9">
            <FooterColumnHeading>Lab&apos;s Note</FooterColumnHeading>

            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-white/75">
              This space brings together work we&apos;ve done and work
              we&apos;re currently doing, along with conversations that
              continue beyond individual projects. If it feels right, this can
              be the starting point
            </p>
          </div>
        </div>

        {/* Big wordmark + legal column */}
        <div className="mt-20 flex items-start justify-between gap-6 md:mt-24 md:gap-10">
          <h2
            className="font-sans font-light leading-[0.85] tracking-[-0.04em] text-white"
            style={{ fontSize: "clamp(2rem, 17vw, 10rem)" }}
          >
            Logixa Lab
          </h2>

          <ul className="flex shrink-0 flex-col gap-3 pt-2 text-right md:pt-3">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/90 transition-colors duration-200 hover:text-(--hero-accent)"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <p className="mt-15 max-w-68 text-xs leading-snug text-(--hero-accent)">
          Copyrights @ Logixalab All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
