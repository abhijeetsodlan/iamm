import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { createMetadata, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: "AI Automation & Business Workflow Solutions",
    description: "IAMM helps businesses save time, reduce manual work, and improve operations with practical AI automation, intelligent integrations, and workflow optimization.",
    path: "/",
  }),
  title: {
    default: "IAMM | AI Automation & Business Workflow Solutions",
    template: "%s | IAMM",
  },
  metadataBase: new URL(siteUrl),
  applicationName: "IAMM",
  authors: [{ name: "IAMM" }],
  creator: "IAMM",
  publisher: "IAMM",
  category: "Technology",
  manifest: "/manifest.webmanifest",
};

const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        <SmoothScroll>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
