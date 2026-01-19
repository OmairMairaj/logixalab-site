# JUTE Fashion – Marketing Website

JUTE Fashion is a **creator-first women’s apparel customization platform** for Gen Z women in Pakistan.  
This repository contains the **marketing / company site** that promotes the platform, explains how it works, and collects leads.

The live UI is built around a **black + orange** visual language, subtle animations, and a clear, mobile‑first layout.

---

## Overview

The site’s goals:

- Explain what JUTE Fashion is and who it’s for
- Show how the **Kurta Shalwar customization flow** works
- Build trust via **testimonials, stats, and brand storytelling**
- Drive users to **Get Started** or **Contact** the team

Major sections:

- **Hero** – Core value prop and primary CTAs
- **Features** – Step‑by‑step explanation of the customization flow
- **Video / Showcase** – Platform walkthrough visuals
- **We Deliver Results** – Horizontal stat bars comparing satisfaction vs. alternatives
- **About** – Mission and founding story
- **Testimonials** – Social proof
- **Pricing / How It Works** – Simple explanation of how creators and buyers use JUTE
- **Blog** – Editorial content and design tips
- **Contact + Stay Updated** – Contact form and newsletter signup

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/app`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/styles/index.css`)
- **Animations**:
  - `framer-motion` for entrance / hover animations
  - `gsap` for some hero / header effects
  - `@number-flow/react` for animated numbers/stats
- **Icons**: `lucide-react`
- **Theming**:
  - Light/Dark support via `next-themes`
  - Color tokens (including primary orange) defined with CSS variables in `src/styles/index.css`

---

## Project Structure

```text
jute.pk/
├── public/                     # Static assets
│   ├── favicon/                # Favicons & manifest
│   ├── images/                 # All imagery (hero, about, blog, testimonials, video, etc.)
│   └── logo.JPG                # JUTE Fashion logo
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout & metadata wiring
│   │   ├── page.tsx            # Home page (assembles all sections)
│   │   ├── about/              # About page
│   │   ├── blog/               # Blog listing
│   │   ├── blog-details/       # Single blog article
│   │   ├── blog-sidebar/       # Blog with sidebar layout
│   │   ├── contact/            # Contact page (wraps contact section)
│   │   ├── privacy-policy/     # Legal copy
│   │   ├── signin/             # Auth: sign in
│   │   └── signup/             # Auth: sign up
│   ├── components/             # All UI components & sections
│   │   ├── About/              # About sections (One, Two)
│   │   ├── Blog/               # Blog cards, tag buttons, share widgets, data
│   │   ├── Brands/             # “We Deliver Results” stats section
│   │   ├── Common/             # Breadcrumb, section titles, scroll‑up helper
│   │   ├── Contact/            # Contact form + “Stay Updated” newsletter box
│   │   ├── Features/           # Feature cards & data
│   │   ├── Footer/             # Footer with nav + legal
│   │   ├── Header/             # Sticky header + navigation
│   │   ├── Hero/               # Hero section and CTAs
│   │   ├── Pricing/            # “How It Works” / pricing‑style section
│   │   ├── ScrollToTop/        # Floating “back to top” button
│   │   ├── Testimonials/       # Testimonial cards & layout
│   │   └── Video/              # Platform showcase section
│   ├── lib/
│   │   └── utils.ts            # `cn` helper (className merging)
│   ├── styles/
│   │   └── index.css           # Tailwind v4 entry + theme variables
│   └── types/                  # Shared TypeScript types (blog, menu, features, testimonials)
├── components.json             # shadcn-style aliases & Tailwind integration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript config (with `@/*` alias to `./src/*`)
├── postcss.config.js           # Tailwind / PostCSS setup
├── package.json                # Scripts & dependencies
└── README.md                   # This file
```

---

## Design & UX Notes

- **Color system**
  - Primary orange: `#FF6B35`
  - Black / dark background with subtle grays for depth
  - Colors managed via CSS variables in `src/styles/index.css`
- **Buttons**
  - Consistent rounded style: `rounded-lg`
  - Prominent primary CTAs (orange) and secondary (dark / outline) variants
- **Forms**
  - Contact form and “Stay Updated” inputs:
    - Always visible border: `border-gray-300` (light), `dark:border-gray-700` (dark)
    - Primary focus ring (`focus:border-primary`)
- **Stats (“We Deliver Results”)**
  - Horizontal bars with orange fills and a light white stripe overlay
  - Animated widths using `framer-motion`
  - Values animated with `NumberFlow`

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** (or `pnpm` / `yarn` / `bun`, but scripts assume npm)

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open [`http://localhost:3000`](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start   # run the production server
```

### Other scripts

- `npm run lint` – Run ESLint over the project

---

## Deployment

The app is a standard Next.js 16 App Router project and can be deployed to:

- **Vercel** (recommended)
- Netlify
- AWS Amplify
- Railway / Render / DigitalOcean App Platform

For Vercel:

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it on [Vercel](https://vercel.com).
3. Vercel will auto‑detect Next.js and use `npm run build` as the build command.

---

## Contributing

This is a private project, but if you’re working on it:

1. Create a feature branch:  
   `git checkout -b feature/your-branch-name`
2. Make your changes.
3. Run `npm run lint` and `npm run build` to ensure everything passes.
4. Commit and open a PR against the main branch.

---

## License

This codebase is **private and proprietary**.  
All rights reserved by the JUTE Fashion team.

---

## Developer

**Developed by:** Mujtaba & Omair

---

Made with ❤️ for **JUTE Fashion**

