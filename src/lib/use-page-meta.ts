"use client";

// =====================================================
// Dynamic SEO metadata for the storefront SPA.
// =====================================================
// Background:
//   This site is a single-page-app — `app/layout.tsx` exports a static
//   Next.js `metadata` object that's the same on every URL. Search
//   engines and social scrapers see identical title/description no
//   matter which page they fetch.
//
//   This hook runs client-side and updates `document.title`, the
//   `<meta name="description">` tag, Open Graph tags, and the canonical
//   URL whenever the router navigates to a new page or the active
//   product/post changes.
//
// Usage:
//   import { usePageMeta } from "@/lib/use-page-meta";
//   function SomePage() {
//     usePageMeta({ title: "...", description: "..." });
//     ...
//   }
//
//   Or call `setPageMeta(...)` directly when you need to update meta
//   from inside an effect (e.g. after fetching a product by slug).
// =====================================================

import { useEffect } from "react";
import { getSiteNameSync, DEFAULT_SITE_NAME } from "@/lib/site-name";

export type PageMeta = {
  title: string;
  description: string;
  /**
   * Canonical path (e.g. "/product/whiskas-1kg"). ALWAYS relative to
   * the current storefront — we do NOT preserve the old WordPress
   * canonical URL because:
   *   1. The WP URL no longer exists (the site has migrated).
   *   2. The new URL is the same slug on the new domain, so the
   *      canonical should point to the CURRENT page URL, not the WP
   *      URL the Yoast plugin recorded.
   *   3. Pointing the canonical at a different URL than the one the
   *      user is on would tell Google "this page is a duplicate of
   *      <other URL>" — which is the opposite of what we want.
   */
  path?: string;
  /** OG image URL. Falls back to site default. */
  image?: string;
  /** Optional keywords (comma-separated string). */
  keywords?: string;
  /** Set true for product/article pages — switches OG type to "article". */
  isArticle?: boolean;
  /**
   * When false, emits <meta name="robots" content="noindex,nofollow">.
   * Honors the Yoast robots_index flag migrated from WordPress.
   */
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

// Use getSiteNameSync() to get the site name from CMS cache.
// This ensures client-side titles match server-rendered titles.
function getSiteName(): string {
  return getSiteNameSync() || DEFAULT_SITE_NAME;
}

const DEFAULT_IMAGE = "https://bd71shop.com/og-default.jpg";
const BASE_URL = "https://bd71shop.com";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  if (typeof document === "undefined") return;
  const el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (el) el.remove();
}

function upsertCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Imperative setter — use when you can't use the hook. */
export function setPageMeta(meta: PageMeta) {
  if (typeof window === "undefined") return;

  const siteName = getSiteName();
  const fullTitle = meta.title.includes(siteName)
    ? meta.title
    : `${meta.title} | ${siteName}`;

  document.title = fullTitle;

  upsertMeta("name", "description", meta.description);
  if (meta.keywords) upsertMeta("name", "keywords", meta.keywords);
  else removeMeta("name", "keywords");

  // Open Graph
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:site_name", siteName);
  upsertMeta("property", "og:type", meta.isArticle ? "article" : "website");
  upsertMeta("property", "og:url", `${BASE_URL}${window.location.pathname}`);
  upsertMeta("property", "og:image", meta.image || DEFAULT_IMAGE);

  // Twitter
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", meta.description);
  upsertMeta("name", "twitter:image", meta.image || DEFAULT_IMAGE);

  // ===== Robots directives =====
  // Honors the migrated Yoast robots_index / robots_follow flags.
  // Default: index,follow (the safe SEO default for a public store).
  const robotsIndex = meta.robotsIndex !== false; // undefined / true → index
  const robotsFollow = meta.robotsFollow !== false;
  const robotsContent = [
    robotsIndex ? "index" : "noindex",
    robotsFollow ? "follow" : "nofollow",
  ].join(", ");
  upsertMeta("name", "robots", robotsContent);

  // ===== Canonical =====
  // Always points to the SAME URL the user is on (current page URL),
  // never to the old WP canonical URL. See PageMeta.path docs above.
  const canonical = meta.path
    ? meta.path.startsWith("http")
      ? meta.path
      : `${BASE_URL}${meta.path}`
    : `${BASE_URL}${window.location.pathname}`;
  upsertCanonical(canonical);
}

/**
 * Hook: updates document meta whenever `meta` changes.
 * Pass `null` to skip (useful while loading).
 */
export function usePageMeta(meta: PageMeta | null) {
  useEffect(() => {
    if (!meta) return;
    setPageMeta(meta);
  }, [
    meta?.title,
    meta?.description,
    meta?.path,
    meta?.image,
    meta?.keywords,
    meta?.isArticle,
    meta?.robotsIndex,
    meta?.robotsFollow,
  ]);
}
