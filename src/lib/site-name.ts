// =====================================================
// Site Name — fetches the site_name from CMS store_settings
// for use in SEO titles and headers.
// =====================================================
// All page metadata (titles, descriptions) should use this
// instead of hardcoding "BD71 Pet Shop" — that way tenants
// can set their own site name in the CMS dashboard's
// Settings page and it'll appear everywhere automatically.
//
// Cache: 5 minutes (300s) — same as site-integrations.ts
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

// Fallback if CMS is unreachable or site_name not set.
// This is the platform's default name — tenants override
// it via the CMS dashboard.
export const DEFAULT_SITE_NAME = "BD71 Pet Shop";

let cachedSiteName: string | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch the site_name from CMS store_settings.
 * Returns the default "BD71 Pet Shop" if CMS is unreachable
 * or site_name is not set.
 *
 * Server-side only — this uses fetch with Next.js cache.
 */
export async function getSiteName(): Promise<string> {
  // Return cached value if fresh
  if (cachedSiteName && Date.now() - cacheTime < CACHE_TTL_MS) {
    return cachedSiteName;
  }

  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/settings`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: ["seo-settings"] },
      }
    );
    const json = await res.json();
    if (!json.success) return DEFAULT_SITE_NAME;
    const settings = json.data?.settings ?? {};
    const name = settings.site_name || DEFAULT_SITE_NAME;

    // Cache for subsequent calls in the same render cycle
    cachedSiteName = name;
    cacheTime = Date.now();

    return name;
  } catch {
    return DEFAULT_SITE_NAME;
  }
}

/**
 * Synchronous getter for the cached site name.
 * Returns the last-fetched value, or DEFAULT_SITE_NAME if
 * getSiteName() hasn't been called yet.
 *
 * Use this in client components where you can't await
 * getSiteName(). The value is populated by LayoutShell's
 * initial server-side fetch.
 */
export function getSiteNameSync(): string {
  return cachedSiteName ?? DEFAULT_SITE_NAME;
}

/**
 * Build a page title in the format: "Page Name | Site Name"
 * Uses the cached site name (no async fetch).
 */
export function buildPageTitle(pageName: string): string {
  return `${pageName} | ${getSiteNameSync()}`;
}
