// Server-only: resolves the public URL used for metadata, sitemap and robots.
// Set NEXT_PUBLIC_SITE_URL once the portfolio has its own domain.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
