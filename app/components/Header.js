"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // no border or backdrop-blur-md and no background color keep it transparent and simple 
    <header className="fixed inset-x-0 top-0 z-50 w-full "> 
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/LogixaLab logo Final 1.png"
            alt=""
            width={100}
            height={100}
            className="h-50 w-50 shrink-0 object-contain"
            priority
          />
          {/* <span className="font-heading text-base font-normal tracking-tight text-white">
            Logixa Lab
          </span> */}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors duration-300 ease-out hover:text-(--hero-accent) focus-visible:text-(--hero-accent) focus-visible:outline-none"
            >
              <RandomLetterSwapPingPong
                label={link.label}
                className="text-inherit transition-colors duration-300 ease-out"
                staggerDuration={0.025}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA — sliding icon (Uiverse-style), mark = small-logo */}
        <div className="hidden md:flex rounded-full">
          <Link href="#contact" className="header-contact-btn rounded-full">
            <span className="header-contact-btn__icon rounded-full " aria-hidden >
              <Image
                src="/images/Icon Gradient.png"
                alt=""
                width={26}
                height={25}
                className="header-contact-btn__icon-img rounded-full"
              />
            </span>
            <span className="relative z-1 rounded-full">Contact Us</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:text-white md:hidden"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/90 px-4 py-5 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-white/70 transition-colors duration-300 ease-out hover:text-(--hero-accent) focus-visible:text-(--hero-accent) focus-visible:outline-none"
              >
                <RandomLetterSwapPingPong
                  label={link.label}
                  className="text-inherit transition-colors duration-300 ease-out"
                  staggerDuration={0.025}
                />
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="header-contact-btn mt-2 w-full sm:w-auto"
            >
              <span className="header-contact-btn__icon" aria-hidden>
                <Image
                  src="/images/small-logo.svg"
                  alt=""
                  width={26}
                  height={25}
                  className="header-contact-btn__icon-img"
                />
              </span>
              <span className="relative z-1">Contact Us</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
