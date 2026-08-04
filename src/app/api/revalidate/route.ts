import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// =====================================================
// POST /api/revalidate
// =====================================================
// On-demand ISR cache purge for the storefront.
// Called by the CMS dashboard's "Performance" page when a tenant
// clicks "Purge storefront cache".
//
// Security: a shared secret (STOREFRONT_REVALIDATE_SECRET env var,
// set on BOTH the CMS and the storefront) is sent in the
// `x-revalidate-secret` header. Without it, the endpoint returns 401.
//
// Body (JSON):
//   {
//     all?:    boolean,         // revalidate every known path + tag
//     tags?:   string[],        // revalidate specific fetch tags only
//     paths?:  string[]         // revalidate specific URL paths
//   }
//
// If neither tags nor paths is given, defaults to all=true.
//
// Known tags (mirrors src/lib/seo-fetchers.ts):
//   product-<slug>, post-<slug>, all-products, all-posts,
//   categories, social-links, seo-settings
//
// Known paths:
//   /, /shop, /blog, /about, /contact, /cart, /checkout,
//   /account, /privacy, /terms, /dmca, /disclaimer,
//   /product/<slug>, /blog/<slug>
//
// Response:
//   { success: true, data: { revalidated: { tags: [], paths: [] }, skipped: [] } }
// =====================================================

const KNOWN_TAGS = [
  "all-products",
  "all-posts",
  "categories",
  "social-links",
  "seo-settings",
];

const KNOWN_PATHS = [
  "/",
  "/shop",
  "/blog",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/account",
  "/privacy",
  "/terms",
  "/dmca",
  "/disclaimer",
];

export async function POST(req: NextRequest) {
  // ===== Auth: shared secret =====
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            "STOREFRONT_REVALIDATE_SECRET env var is not set on the storefront. Set it to enable remote cache purging.",
          code: "SECRET_NOT_CONFIGURED",
        },
      },
      { status: 503 }
    );
  }

  const providedSecret = req.headers.get("x-revalidate-secret");
  if (providedSecret !== secret) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Invalid or missing revalidate secret", code: "UNAUTHORIZED" },
      },
      { status: 401 }
    );
  }

  // ===== Parse body =====
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const wantsAll = body.all === true || (!body.tags?.length && !body.paths?.length);
  const tags: string[] = Array.isArray(body.tags) ? body.tags : [];
  const paths: string[] = Array.isArray(body.paths) ? body.paths : [];

  const revalidated = { tags: [] as string[], paths: [] as string[] };
  const skipped: { tag?: string; path?: string; reason: string }[] = [];

  // ===== Full purge =====
  if (wantsAll) {
    // Revalidate every known static path
    for (const p of KNOWN_PATHS) {
      try {
        revalidatePath(p);
        // Also revalidate the page transition path (Next.js App Router
        // sometimes caches the RSC payload separately from the document)
        revalidatePath(p, "page");
        revalidated.paths.push(p);
      } catch (err: any) {
        skipped.push({ path: p, reason: err?.message ?? "unknown" });
      }
    }

    // Revalidate every known fetch tag (covers the dynamic per-slug tags
    // like `product-<slug>` and `post-<slug>` — Next.js tracks them
    // individually even if we don't know the slug list here)
    for (const t of KNOWN_TAGS) {
      try {
        revalidateTag(t);
        revalidated.tags.push(t);
      } catch (err: any) {
        skipped.push({ tag: t, reason: err?.message ?? "unknown" });
      }
    }

    // Also revalidate dynamic route patterns. revalidatePath accepts
    // a wildcard segment, e.g. "/product/[slug]" clears all cached
    // product pages at once.
    for (const pattern of ["/product/[slug]", "/blog/[slug]"]) {
      try {
        revalidatePath(pattern, "page");
        revalidated.paths.push(pattern);
      } catch (err: any) {
        skipped.push({ path: pattern, reason: err?.message ?? "unknown" });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        revalidated,
        skipped,
        mode: "all",
      },
    });
  }

  // ===== Tag-only purge =====
  for (const tag of tags) {
    if (typeof tag !== "string" || !tag.trim()) continue;
    try {
      revalidateTag(tag);
      revalidated.tags.push(tag);
    } catch (err: any) {
      skipped.push({ tag, reason: err?.message ?? "unknown" });
    }
  }

  // ===== Path-only purge =====
  for (const path of paths) {
    if (typeof path !== "string" || !path.trim()) continue;
    try {
      revalidatePath(path);
      revalidatePath(path, "page");
      revalidated.paths.push(path);
    } catch (err: any) {
      skipped.push({ path, reason: err?.message ?? "unknown" });
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      revalidated,
      skipped,
      mode: "selective",
    },
  });
}

// ===== GET — health check (no secret needed) =====
// Lets the CMS dashboard verify the storefront endpoint exists and
// is reachable before showing the "Purge storefront" button as active.
export async function GET() {
  const configured = Boolean(process.env.STOREFRONT_REVALIDATE_SECRET);
  return NextResponse.json({
    success: true,
    data: {
      configured,
      message: configured
        ? "Storefront revalidate endpoint is ready."
        : "STOREFRONT_REVALIDATE_SECRET is not set. Configure it to enable remote purging.",
    },
  });
}
