import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { SiteShell } from "@/components/site-shell";
import { profile, siteUrl } from "@/data/profile";
import "./globals.css";

const display = localFont({
  src: "../fonts/SpaceGrotesk-latin.woff2",
  weight: "400 700",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "../fonts/Inter-latin.woff2",
  weight: "400 500",
  variable: "--font-body",
  display: "swap",
});

const mono = localFont({
  src: "../fonts/JetBrainsMono-latin.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
});

const description = profile.heroIntro;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vivek Vasani — Software Developer",
    template: "%s — Vivek Vasani",
  },
  description,
  applicationName: "Vivek Vasani",
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  keywords: [
    "Vivek Vasani",
    "software developer",
    "backend engineer",
    "AI",
    "machine learning",
    "FastAPI",
    "Spring Boot",
    "GRAPHMIND",
    "Semantic Knowledge Graph",
    "GraphRAG",
    "unpublished research",
    "Mumbai",
  ],
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Vivek Vasani — Software Developer",
    description,
    url: siteUrl,
    siteName: "Vivek Vasani",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vivek Vasani — Engineering ideas into intelligent products." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Vasani — Software Developer",
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#080a0a",
  width: "device-width",
  initialScale: 1,
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: profile.email,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: profile.education.school,
  },
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var s=localStorage.getItem("vv-theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");if(t==="light")document.documentElement.dataset.theme="light";else delete document.documentElement.dataset.theme;}catch(e){}`}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
