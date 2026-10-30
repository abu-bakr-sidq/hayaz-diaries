import type { Metadata, Viewport } from "next";
import { Caveat, Courier_Prime, Instrument_Sans, Instrument_Serif, Mrs_Saint_Delafield } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import Header from "@/components/layout/Header";
import Cursor from "@/components/layout/Cursor";
import { description, profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans" });
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier-prime" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const signature = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-signature" });

const title = `${profile.name} (${profile.alias}) — Content Writer & SEO Analyst, Chennai`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.brand}` },
  description,
  applicationName: profile.brand,
  authors: [{ name: profile.name, url: profile.instagram.url }],
  creator: profile.name,
  keywords: [
    "content writer Chennai",
    "SEO analyst Chennai",
    "Tanglish scriptwriter",
    "reel script writer",
    "Meta ads content",
    "carousel content writer",
    "technical SEO",
    "Hayaz Diaries",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.brand,
    title,
    description,
    firstName: "Thasneem",
    username: "hayaz_diaries_",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f3ede3",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    alternateName: [profile.alias, profile.brand],
    jobTitle: profile.role,
    description,
    image: `${siteUrl}/opengraph-image`,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    worksFor: { "@type": "Organization", name: "Codux Digital" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Bharathidasan University" },
    knowsLanguage: ["en", "ta"],
    knowsAbout: [
      "Content writing",
      "Scriptwriting",
      "Social media content",
      "Search engine optimization",
      "Technical SEO",
      "Keyword research",
      "Google Analytics",
      "Google Search Console",
      "Schema markup",
    ],
    sameAs: [profile.instagram.url, profile.youtube.url],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${hand.variable} ${signature.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll>
          <Preloader />
          <Header />
          {children}
        </SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
