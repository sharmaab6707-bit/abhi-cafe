import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://premium-cafe.vercel.app"),
  title: "Premium Cafe in Jaipur | Fresh Coffee & Cozy Ambience",
  description: "A luxury coffee-house experience with freshly brewed coffee, delicious food, cozy ambience, and warm service in Jaipur.",
  keywords: ["premium cafe Jaipur", "coffee house", "fresh coffee", "cozy cafe", "specialty coffee"],
  openGraph: {
    title: "Premium Cafe in Jaipur | Fresh Coffee & Cozy Ambience",
    description: "Freshly brewed coffee, delicious food, and cozy moments in a premium cafe atmosphere.",
    url: "https://premium-cafe.vercel.app",
    siteName: "Story Cup Cafe",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Premium cafe coffee cup"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Cafe in Jaipur | Fresh Coffee & Cozy Ambience",
    description: "Every cup tells a story at a warm, premium coffee-house made for cozy moments.",
    images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Story Cup Cafe",
  image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  "@id": "https://premium-cafe.vercel.app",
  url: "https://premium-cafe.vercel.app",
  telephone: "+91 12345 67890",
  priceRange: "$$",
  servesCuisine: ["Coffee", "Bakery", "Continental Snacks"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "MI Road",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302001",
    addressCountry: "IN"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "23:00"
    }
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1248"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${display.variable} ${sans.variable} bg-cream text-coffee antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
