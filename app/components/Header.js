"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8 md:px-12 lg:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* Double-V / W logomark */}
          <svg
            width="24"
            height="18"
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="1,1 6,16 12,4 18,16 23,1"
              stroke="#aaff00"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="font-sans text-base font-semibold tracking-tight text-white">
            Logixa Lab
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Link
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#aaff00] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-85"
          >
            <ArrowUpRight size={15} strokeWidth={2.5} />
            Contact Us
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
        <div className="border-t border-white/10 bg-black/90 px-8 py-5 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#aaff00] px-5 py-2 text-center text-sm font-semibold text-black"
            >
              <ArrowUpRight size={15} strokeWidth={2.5} />
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
