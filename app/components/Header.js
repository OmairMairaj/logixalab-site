"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/app/components/random-letter-swap";
import { NAV_LINKS, SOCIAL_LINKS } from "@/app/lib/constants";

/* Small diagonal arrow that inherits currentColor, so it flips dark when the
   lime flood sweeps the CTA on hover. */
function ArrowIcon() {
  return (
    <svg
      className="header-cta__arrow"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  /* While the mobile menu is open: lock background scroll and close on Escape. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-2 z-50 w-full">
      {/* Main bar — sits above the menu overlay so the logo + toggle stay live */}
      <div className="relative z-20 mx-auto flex h-[var(--header-h)] items-center px-[var(--gutter)]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" onClick={closeMenu}>
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
            {NAV_LINKS.map((link) => (
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
            <span>Let&apos;s Talk</span>
            <ArrowIcon />
          </Link>

          {/* Mobile hamburger — glass pill, bars morph to a lime X.
              suppressHydrationWarning: some browser extensions (password
              managers / autofill) inject attributes like `fdprocessedid` onto
              buttons before hydration, which otherwise trips a mismatch error.
              Same pattern the contact form uses. */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="nav-toggle md:hidden"
            suppressHydrationWarning
          >
            <span className="nav-toggle__box" aria-hidden>
              <span className="nav-toggle__bar" />
              <span className="nav-toggle__bar" />
              <span className="nav-toggle__bar" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu — always mounted (so it can animate both ways); a circular
          reveal expands from the hamburger, then links blur-rise in. */}
      <div
        className={`mobile-menu md:hidden ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="mobile-menu__link"
            >
              <span className="mobile-menu__index">{`0${i + 1}`}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mobile-menu__footer">
          <Link href="/contact" onClick={closeMenu} className="header-cta header-cta--block">
            <span>Let&apos;s Talk</span>
            <ArrowIcon />
          </Link>
          <div className="mobile-menu__socials">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
