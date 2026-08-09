import { NextRequest, NextResponse } from "next/server";

// =====================================================
// SEO Redirect + Google Verification middleware
// =====================================================
// This middleware handles:
//   1. SEO redirects (301/302) configured in the CMS dashboard
//   2. Google Search Console verification files (google*.html)
//      — served dynamically from CMS store_settings so tenants
//        don't need to redeploy when Google generates a new file.
//
// Unknown URLs fall through to Next.js's built-in 404 page
// (src/app/not-found.tsx) which returns a proper HTTP 404.
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

// In-memory redirect cache (5 min TTL)
interface CachedRedirect {
  found: boolean;
  destination?: string;
  statusCode?: number;
  cachedAt: number;
}
const redirectCache = new Map<string, CachedRedirect>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// In-memory cache for Google verification content
let cachedGoogleVerification: string | null = null;
let googleVerifyCacheTime = 0;

// Strict pattern: /google + hex chars + .html
const GOOGLE_VERIFICATION_PATTERN = /^\/google[0-9a-f]+\.html$/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Don't process the root path or Next.js internals
  if (pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ===== Google Search Console verification files =====
  // Match /google<hex>.html exactly. Serve the verification
  // content from CMS. If not configured, return 404 (which
  // renders the custom not-found page).
  if (GOOGLE_VERIFICATION_PATTERN.test(pathname)) {
    // Check cache (5 min TTL)
    if (cachedGoogleVerification && Date.now() - googleVerifyCacheTime < CACHE_TTL) {
      // Verify the requested filename matches the configured one
      const expectedFile = extractFilename(cachedGoogleVerification);
      if (expectedFile && pathname === `/${expectedFile}`) {
        return new NextResponse(cachedGoogleVerification, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
      // Filename doesn't match → 404
      return new NextResponse(null, { status: 404 });
    }

    // Fetch verification content from CMS
    try {
      const res = await fetch(
        `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/settings`,
        {
          headers: { "X-API-Key": CMS_API_KEY },
          signal: AbortSignal.timeout(3000),
        }
      );
      const json = await res.json();
      const settings = json.data?.settings ?? {};

      // Check both the integration key and the legacy seo_ key
      let verificationContent = null;
      const raw = settings["integration:google_search_console"];
      if (raw) {
        try {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          verificationContent = parsed?.verification_content;
        } catch {
          verificationContent = raw;
        }
      }
      if (!verificationContent) {
        verificationContent = settings.seo_googleVerification;
      }

      cachedGoogleVerification = verificationContent;
      googleVerifyCacheTime = Date.now();

      if (verificationContent) {
        const expectedFile = extractFilename(verificationContent);
        if (expectedFile && pathname === `/${expectedFile}`) {
          return new NextResponse(verificationContent, {
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      }
    } catch {
      // CMS unreachable — fall through to 404
    }

    // No matching verification file → 404
    return new NextResponse(null, { status: 404 });
  }

  // ===== SEO Redirect Check =====
  const cached = redirectCache.get(pathname);
  const now = Date.now();
  if (cached && now - cached.cachedAt < CACHE_TTL) {
    if (cached.found && cached.destination) {
      return NextResponse.redirect(
        new URL(cached.destination, req.url),
        cached.statusCode ?? 301
      );
    }
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/redirects?path=${encodeURIComponent(pathname)}`,
      {
        headers: { "X-API-Key": CMS_API_KEY },
        signal: AbortSignal.timeout(3000),
      }
    );
    const json = await res.json();

    if (json.found && json.redirect?.destination) {
      redirectCache.set(pathname, {
        found: true,
        destination: json.redirect.destination,
        statusCode: json.redirect.statusCode,
        cachedAt: now,
      });

      return NextResponse.redirect(
        new URL(json.redirect.destination, req.url),
        json.redirect.statusCode ?? 301
      );
    }

    redirectCache.set(pathname, { found: false, cachedAt: now });
  } catch {
    // API failed — don't block, let Next.js handle it
  }

  return NextResponse.next();
}

// Helper: extract the filename from verification content
// e.g. "google-site-verification: google123abc.html" → "google123abc.html"
function extractFilename(content: string): string | null {
  const match = content?.match(/google[0-9a-f]+\.html/i);
  return match ? match[0] : null;
}

export const config = {
  matcher: [
    // Exclude: API routes, Next.js internals, static assets.
    // NOTE: google*.html files are NOT excluded here — they're
    // handled by the middleware above (served from CMS).
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
