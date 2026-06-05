"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Team", href: "/team" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-2 z-50 w-full">
      {/* Main bar */}
      <div className="relative mx-auto flex h-[var(--header-h)] items-center px-[var(--gutter)]">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo-white-full.png"
            alt="Logixa Lab"
            width={280}
            height={56}
            className="h-[clamp(2rem,3vw,4rem)] w-auto object-contain"
            priority
          />
        </Link>

        {/* Pill nav — absolutely centred so logo/CTA width never shifts it */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
          aria-label="Main navigation"
        >
          <div
            className="flex items-center gap-0.5 rounded-full px-2 py-1.5"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(217,217,217,0.20) 60%, rgba(180,180,180,0.14) 100%)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-[clamp(1rem,2.5vw,2rem)] py-2.25 text-(length:--text-xs) font-medium text-white transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none"
              >
                <RandomLetterSwapPingPong
                  label={link.label}
                  className="text-inherit transition-colors duration-200"
                  staggerDuration={0.025}
                />
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side: CTA on desktop, hamburger on mobile */}
        <div className="ml-auto flex items-center">
          {/* Desktop CTA */}
          <Link href="/contact" className="header-cta hidden md:inline-flex">
            <span>Let's Talk</span>
            <Image
              src="/images/logo-black.png"
              alt=""
              width={22}
              height={22}
              className="h-[1.2em] w-auto object-contain"
              aria-hidden
            />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/65 transition-colors hover:text-white md:hidden"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-black/92 backdrop-blur-md md:hidden">
          <nav
            className="mx-auto flex max-w-screen-xl flex-col gap-1 px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none"
              >
                <RandomLetterSwapPingPong
                  label={link.label}
                  className="text-inherit"
                  staggerDuration={0.025}
                />
              </Link>
            ))}

            <div className="mt-3 border-t border-white/10 pt-4">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="header-contact-btn"
              >
                <span className="header-contact-btn__icon" aria-hidden>
                  <Image
                    src="/images/Icon Gradient.png"
                    alt=""
                    width={26}
                    height={25}
                    className="header-contact-btn__icon-img"
                  />
                </span>
                <span className="relative z-1">Let&apos;s Talk</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
