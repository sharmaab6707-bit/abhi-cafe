# Story Cup Cafe Landing Page

A premium, mobile-first cafe landing page built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, and Lenis smooth scrolling.

## Features

- Full-screen cinematic hero with steam and floating coffee bean animation
- Mobile-first one-page layout for coffee, food, ambience, reviews, offers, location, and CTA
- Framer Motion reveal animations, counters, carousel, and coffee-pour SVG animation
- Dynamic navbar, scroll progress indicator, day/night cafe mode, and optional ambient sound toggle
- SEO metadata, Open Graph, Twitter card data, and Local Business structured data
- Deploy-ready for GitHub and Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` if you want to customize site URL, phone, or address values.

## Project Structure

```text
app/
components/
data/
lib/
public/
```

The page is data-driven through `data/cafe.ts`, so cafe menu items, reviews, offers, and gallery images can be updated without touching the section logic.
