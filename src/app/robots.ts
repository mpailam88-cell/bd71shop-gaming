import type { MetadataRoute } from "next";

// =====================================================
// /robots.txt — Dynamic robots.txt with sitemap reference
// =====================================================
// Reads custom rules from CMS store_settings (seo_robotsExtraRules).
// Falls back to defaults if CMS is unreachable.
// =====================================================

const BASE_URL = "https://bd71shop.com";
const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

async function getExtraRobotsRules(): Promise<string[]> {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/settings`,
      {
        headers: { "X-API-Key": CMS_API_KEY },
        next: { revalidate: 300, tags: ["seo-settings"] },
      }
    );
    const json = await res.json();
    if (!json.success) return [];
    const settings = json.data?.settings ?? {};
    const extra = settings.robotsExtraRules ?? settings.seo_robotsExtraRules ?? "";
    if (!extra) return [];
    return extra
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
  } catch {
    return [];
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const extraRules = await getExtraRobotsRules();

  // Parse extra rules into disallow/allow lists
  const extraDisallow: string[] = [];
  const extraAllow: string[] = [];
  for (const rule of extraRules) {
    const m = rule.match(/^(Disallow|Allow):\s*(.+)$/i);
    if (m) {
      if (m[1].toLowerCase() === "disallow") extraDisallow.push(m[2].trim());
      else extraAllow.push(m[2].trim());
    }
  }

  const defaultDisallow = ["/cart", "/checkout", "/account"];
  const allDisallow = [...defaultDisallow, ...extraDisallow];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...extraAllow],
        disallow: allDisallow,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", ...extraAllow],
        disallow: allDisallow,
      },
      {
        // Mediapartners-Google is Google AdSense's crawler.
        // It scans pages to determine where to place ads.
        // Without this rule, AdSense can't read the page content
        // and won't show any ads — even on an approved account.
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: allDisallow,
      },
      {
        // AdsBot-Google checks ad quality on landing pages.
        userAgent: "AdsBot-Google",
        allow: "/",
        disallow: allDisallow,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
