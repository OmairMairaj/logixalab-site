"use client";

import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
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
    <footer className="relative z-10 h-full overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#0b0b0b] text-white shadow-[0_-24px_60px_rgba(0,0,0,0.55)] md:flex md:flex-col md:justify-center">
      <div className="mx-auto w-full px-(--gutter) pt-16 pb-8 md:pt-4 md:pb-4">
        {/* Top: 3 columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
          {/* Contact */}
          <div className="md:col-span-3 md:col-start-1">
            <FooterColumnHeading>Contact</FooterColumnHeading>

            <a
              href="mailto:info@logixalab.com"
              className="mt-4 block text-sm text-white/90 transition-colors duration-200 hover:text-(--hero-accent)"
            >
              info@logixalab.com
            </a>

            <ul className="mt-5 flex flex-col gap-2">
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
          <div className="md:col-span-3 md:col-start-4">
            <FooterColumnHeading>Navigation</FooterColumnHeading>

            <ul className="mt-4 flex flex-col gap-2">
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
          <div className="md:col-span-3 md:col-start-10">
            <FooterColumnHeading>Lab&apos;s Note</FooterColumnHeading>

            <p className="mt-4 text-sm leading-relaxed text-white/75">
              This space brings together work we&apos;ve done and work
              we&apos;re currently doing, along with conversations that
              continue beyond individual projects. If it feels right, this can
              be the starting point
            </p>
          </div>
        </div>

        {/* Big wordmark + legal column */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6 items-center md:mt-14">
          <h2
            className="font-light leading-[0.85] tracking-[-0.04em] text-white md:col-span-9 md:col-start-1"
            style={{ fontSize: "clamp(1.75rem, 18vw, 11.5rem)" }}
          >
          Logixa Lab
          </h2>

          <ul className="md:col-span-3 md:col-start-10 flex shrink-0 flex-col gap-2 pt-0 text-left sm:pt-1 md:gap-2.5 md:pt-2">
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
        <p className="mt-12 max-w-88 text-xs leading-snug text-(--hero-accent) md:mt-12">
          Copyrights @ Logixalab <br/>All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
