import { fetchAllProducts, fetchAllPosts, fetchCategories } from "@/lib/seo-fetchers";

// =====================================================
// /sitemap.xml — Dynamic sitemap from CMS data
// =====================================================
// Reads sitemap inclusion toggles from CMS store_settings.
// If a content type is disabled in client dashboard SEO settings,
// it won't appear in the sitemap.
// =====================================================

const BASE_URL = "https://bd71shop.com";
const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

interface SitemapToggles {
  products: boolean;
  posts: boolean;
  categories: boolean;
  pages: boolean;
}

async function getSitemapToggles(): Promise<SitemapToggles> {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/settings`,
      {
        headers: { "X-API-Key": CMS_API_KEY },
        next: { revalidate: 300, tags: ["seo-settings"] },
      }
    );
    const json = await res.json();
    if (!json.success) {
      return { products: true, posts: true, categories: true, pages: true };
    }
    const s = json.data?.settings ?? {};
    return {
      products: s.sitemapIncludeProducts !== "false" && s.sitemapIncludeProducts !== false,
      posts: s.sitemapIncludePosts !== "false" && s.sitemapIncludePosts !== false,
      categories: s.sitemapIncludeCategories !== "false" && s.sitemapIncludeCategories !== false,
      pages: s.sitemapIncludePages !== "false" && s.sitemapIncludePages !== false,
    };
  } catch {
    return { products: true, posts: true, categories: true, pages: true };
  }
}

export default async function sitemap() {
  const [toggles, products, posts, categories] = await Promise.all([
    getSitemapToggles(),
    fetchAllProducts(),
    fetchAllPosts(),
    fetchCategories(),
  ]);

  // Static pages — always include home + shop
  const staticPages: any[] = [
    { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: "daily", lastModified: new Date() },
    { url: `${BASE_URL}/shop`, priority: 0.9, changeFrequency: "daily", lastModified: new Date() },
  ];
  if (toggles.posts) {
    staticPages.push({
      url: `${BASE_URL}/blog`,
      priority: 0.8,
      changeFrequency: "daily",
      lastModified: new Date(),
    });
  }
  // About + Contact are static pages
  staticPages.push(
    { url: `${BASE_URL}/about`, priority: 0.5, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: "monthly", lastModified: new Date() },
  );

  // Conditional content pages
  const productPages = toggles.products
    ? (products ?? [])
        .filter((p: any) => p.status !== "draft" && p.slug)
        .map((p: any) => ({
          url: `${BASE_URL}/product/${p.slug}`,
          priority: 0.7,
          changeFrequency: "weekly",
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        }))
    : [];

  const postPages = toggles.posts
    ? (posts ?? [])
        .filter((p: any) => p.status !== "draft" && p.slug)
        .map((p: any) => ({
          url: `${BASE_URL}/blog/${p.slug}`,
          priority: 0.6,
          changeFrequency: "weekly",
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.published_at ?? new Date()),
        }))
    : [];

  // NOTE: Category pages (/category/{slug}) are NOT included in the
  // sitemap because there's no /category/[slug] route in the app.
  // Shop uses /shop?category={slug} query params instead (handled
  // client-side). Publishing non-existent URLs would cause Google
  // to see soft-404s, hurting SEO.
  // If a /category/[slug] route is added in the future, re-enable
  // this section.
  const categoryPages: any[] = [];

  return [...staticPages, ...productPages, ...postPages, ...categoryPages];
}
