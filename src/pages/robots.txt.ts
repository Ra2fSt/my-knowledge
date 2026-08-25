import type { APIRoute } from "astro";

// robots.txt：允许全部抓取，指向 sitemap 索引
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL(
    "sitemap-index.xml",
    site ?? "http://localhost:4321",
  );
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
