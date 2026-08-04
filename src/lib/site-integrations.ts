// =====================================================
// Site Integrations — fetch Google Analytics, Tag Manager,
// Search Console verification, and custom header/body
// scripts from the CMS store_settings table.
// =====================================================
// Used by app/layout.tsx to inject third-party scripts
// into <head> and <body> on every page.
//
// Cache: 5 minutes (300s) — these settings change rarely.
// Invalidate via the "seo-settings" tag in the CMS
// Performance dashboard's "Purge CMS cache" button.
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

export interface SiteIntegrations {
  // Google Search Console — content of the google*.html file
  // (e.g. "google-site-verification: google123abc.html")
  // The filename is derived from this content.
  googleVerification?: string;

  // Google Analytics 4 measurement ID (e.g. "G-XXXXXXXXXX")
  googleAnalyticsId?: string;

  // Google Tag Manager container ID (e.g. "GTM-XXXXXXX")
  googleTagManagerId?: string;

  // Google AdSense publisher ID (e.g. "ca-pub-1743417934898311")
  // If set, the AdSense script is loaded in <head>.
  adsensePublisherId?: string;

  // Bing Webmaster Tools verification code
  bingVerification?: string;

  // Facebook Pixel ID
  facebookPixelId?: string;

  // Favicon URL from CMS branding settings — injected as a
  // server-rendered <link rel="icon"> tag so the browser
  // loads it instantly on first paint (no JS delay).
  faviconUrl?: string;

  // Custom scripts to inject in <head> (raw HTML, e.g. <script>...</script>)
  headerScripts?: string;

  // Custom scripts to inject at end of <body> (raw HTML)
  bodyScripts?: string;
}

// In-memory cache to avoid refetching on every request during
// the same server-side render cycle.
let cached: SiteIntegrations | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Helper: parse an integration value that's stored as a JSON
 * string in store_settings (e.g. `{"measurement_id":"G-XXX"}`).
 * Returns the first non-empty value from common field names,
 * or null if not found.
 */
function extractIntegrationValue(raw: any, fieldNames: string[]): string | null {
  if (!raw) return null;
  // If it's already a string (legacy format), return it
  if (typeof raw === "string") {
    // Try parsing as JSON first (new format)
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        for (const field of fieldNames) {
          if (parsed[field]) return String(parsed[field]);
        }
      }
    } catch {
      // Not JSON — return as-is
      return raw;
    }
    return raw;
  }
  // If it's an object, look for the field
  if (typeof raw === "object") {
    for (const field of fieldNames) {
      if (raw[field]) return String(raw[field]);
    }
  }
  return null;
}

/**
 * Extract favicon URL from CMS branding settings.
 * Branding is stored as a JSON string under key='branding' in
 * store_settings, with a 'favicon_url' field inside.
 */
function extractFaviconUrl(settings: any): string | null {
  const branding = settings.branding;
  if (!branding) return null;
  try {
    const parsed = typeof branding === "string" ? JSON.parse(branding) : branding;
    return parsed?.favicon_url || null;
  } catch {
    return null;
  }
}

/**
 * Fetch all third-party integration settings from the CMS.
 * Returns an empty object if the CMS is unreachable.
 */
export async function getSiteIntegrations(): Promise<SiteIntegrations> {
  // Return cached value if fresh
  if (cached && Date.now() - cacheTime < CACHE_TTL_MS) {
    return cached;
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
    if (!json.success) return {};
    const settings = json.data?.settings ?? {};

    // Integration values come as JSON strings (e.g.
    // `{"measurement_id":"G-XXX","_installedAt":"..."}`)
    // We extract the relevant field from each.
    const gaRaw = settings["integration:google_analytics"];
    const gtmRaw = settings["integration:google_tag_manager"];
    const adsenseRaw = settings["integration:google_adsense"];
    const searchConsoleRaw = settings["integration:google_search_console"];
    const bingRaw = settings["integration:bing_webmaster"];
    const pixelRaw = settings["integration:facebook_pixel"];

    const result: SiteIntegrations = {
      googleVerification:
        extractIntegrationValue(searchConsoleRaw, ["verification_content"]) ??
        settings.seo_googleVerification ??
        undefined,
      googleAnalyticsId:
        extractIntegrationValue(gaRaw, ["measurement_id"]) ??
        undefined,
      googleTagManagerId:
        extractIntegrationValue(gtmRaw, ["gtm_id"]) ??
        undefined,
      adsensePublisherId:
        extractIntegrationValue(adsenseRaw, ["publisher_id"]) ??
        undefined,
      bingVerification:
        extractIntegrationValue(bingRaw, ["verification_code"]) ??
        settings.seo_bingVerification ??
        undefined,
      facebookPixelId:
        extractIntegrationValue(pixelRaw, ["pixel_id"]) ??
        undefined,
      faviconUrl: extractFaviconUrl(settings) ?? undefined,
      headerScripts: settings.seo_headerScripts || undefined,
      bodyScripts: settings.seo_bodyScripts || undefined,
    };

    // Cache for subsequent requests in the same render cycle
    cached = result;
    cacheTime = Date.now();

    return result;
  } catch {
    return {};
  }
}

/**
 * Extract the Google Search Console verification filename from the
 * verification content. The content format is:
 *   "google-site-verification: googleXXX.html"
 * Returns the filename (e.g. "googleXXX.html") or null.
 */
export function extractGoogleVerificationFilename(content: string): string | null {
  if (!content) return null;
  const match = content.match(/google-site-verification:\s*(google[0-9a-f]+\.html)/i);
  return match ? match[1] : null;
}
