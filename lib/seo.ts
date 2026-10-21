import type { Metadata } from "next";

export const siteUrl = "https://iammllc.com";
export const siteName = "IAMM Solutions";
export const defaultTitle = "IAMM Solutions | Managed IT, Cybersecurity & AI Automation";
export const defaultDescription = "IAMM Solutions provides managed IT, cybersecurity, cloud cost optimization, and AI automation for businesses in the US and UK. Keep your IT secure and scalable.";

const defaultKeywords = [
  "managed IT services",
  "cybersecurity",
  "cloud cost optimization",
  "AI automation",
  "business automation",
  "workflow automation",
  "AI integration",
  "business process automation",
  "digital transformation",
  "custom AI solutions",
  "workflow optimization",
];

type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createMetadata({ title, description, path = "/", keywords = [], noIndex = false }: SeoConfig): Metadata {
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteName} - Managed IT, cybersecurity, and AI automation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: "English",
    },
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: "en-US",
  };
}
