"use client";

import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/app/components/random-letter-swap";
import { FOOTER_NAV_LINKS, SOCIAL_LINKS } from "@/app/lib/constants";

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
        {/* Top: 3 columns. On mobile, Contact + Navigation sit side-by-side in
            row 1 (grid-cols-2) and Lab's Note spans the full width below. */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12 md:gap-6">
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
              {SOCIAL_LINKS.map((s) => (
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
              {FOOTER_NAV_LINKS.map((l) => (
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
          <div className="col-span-2 md:col-span-3 md:col-start-10">
            <FooterColumnHeading>Lab&apos;s Note</FooterColumnHeading>

            <p className="mt-4 text-sm leading-relaxed text-white/75">
              This space brings together work we&apos;ve done and work
              we&apos;re currently doing, along with conversations that
              continue beyond individual projects. If it feels right, this can
              be the starting point
            </p>
          </div>
        </div>

        {/* Big wordmark + legal column.
            Wordmark spans ~60vw on desktop: for this Michroma cut the rendered
            text-width/font-size ratio is ≈ 6.369, so 60 / 6.369 ≈ 9.4vw. The
            min(.., 20vh) cap shrinks it on short/ultrawide viewports so it never
            forces the fixed-height footer to overflow.
            col-span-9 (not 10) leaves cols 10–12 free for the legal column so it
            stays on the SAME row instead of being bumped to a second row — that
            wrap was adding ~124px and overflowing the footer on short screens. */}
        <div className="[margin-top:clamp(1.5rem,5vh,3.25rem)] grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6 items-center">
          <h2
            className="font-light leading-[0.85] tracking-[-0.04em] text-white md:col-span-9 md:col-start-1 md:whitespace-nowrap"
            style={{ fontSize: "clamp(2.5rem, min(9.4vw, 20vh), 16rem)" }}
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
        <p className="[margin-top:clamp(1.5rem,5vh,3.25rem)] max-w-88 text-xs leading-snug text-(--hero-accent)">
          Copyrights @ Logixalab <br/>All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
