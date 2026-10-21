import type { Metadata } from "next";
import { cormorant, montserrat } from "@/lib/fonts";
import { getSite } from "@/lib/content";
import Analytics from "@/components/Analytics";
import "./globals.css";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.titleDefault,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${site.name} · ${site.descriptor}`,
    url: site.url,
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.descriptor}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: ["/og.jpg"],
  },
  // local-SEO geo hints (read by some engines and directories)
  other: {
    "geo.region": `${site.address.country}-${site.address.region}`,
    "geo.placename": `${site.address.locality}, California`,
    "geo.position": `${site.geo.latitude};${site.geo.longitude}`,
    ICBM: `${site.geo.latitude}, ${site.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* progressive-enhancement guard: [data-reveal] only hides when JS runs */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
