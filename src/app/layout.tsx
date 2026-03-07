import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { UniqueFeaturesProvider } from "@/components/providers/UniqueFeaturesProvider";
import { getSiteUrl, getOrganizationJsonLd } from "@/lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const orgJsonLd = getOrganizationJsonLd();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lumin Art | Luxury Lighting Studio",
    template: "%s | Lumin Art",
  },
  description:
    "Light is not a product. It is an experience. Lumin Art – Luxury Lighting Studio. A Light House Creation.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Lumin Art",
    title: "Lumin Art | Luxury Lighting Studio",
    description: "Light is not a product. It is an experience. Lumin Art – Luxury Lighting Studio. A Light House Creation.",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Lumin Art – Luxury Lighting Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumin Art | Luxury Lighting Studio",
    description: "Light is not a product. It is an experience. Lumin Art – Luxury Lighting Studio. A Light House Creation.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} relative min-h-screen font-sans antialiased`}
      >
        <SmoothScroll>
          <UniqueFeaturesProvider>{children}</UniqueFeaturesProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
