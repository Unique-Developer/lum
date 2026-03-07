/**
 * SEO helpers: site URL, JSON-LD, canonical URLs
 */

export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (typeof process.env.VERCEL_BRANCH_URL === "string" && process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  return "https://luminart.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** JSON-LD Organization schema for Lumin Art */
export function getOrganizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lumin Art",
    alternateName: "Lumin Art Luxury Lighting Studio",
    url,
    logo: absoluteUrl("/opengraph-image"),
    description:
      "Luxury Lighting Studio. Light is not a product. It is an experience. A Light House Creation.",
    foundingDate: "2001",
    sameAs: [],
  };
}

/** JSON-LD Article schema for blog posts */
export function getArticleJsonLd(params: {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    datePublished: params.publishedAt,
    author: {
      "@type": "Person",
      name: params.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Lumin Art",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url,
    },
  };
}
