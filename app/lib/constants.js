/**
 * Shared cross-page constants — single source of truth for navigation and
 * social links (previously duplicated across Header, Footer, and ContactHero).
 * The brand heading gradient lives as the `.text-hero-gradient` utility in
 * globals.css.
 */

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Team", href: "/team" },
];

/** Footer navigation = the main nav plus a Blog entry. */
export const FOOTER_NAV_LINKS = [...NAV_LINKS, { label: "Blog", href: "/#blog" }];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
];
