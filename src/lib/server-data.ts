// =====================================================
// Server-side data fetcher — runs on Next.js server, not browser
// =====================================================
// This module fetches data from the CMS API at build/request time
// on the server. Data is passed to the client store as initial
// state — eliminating the loading flash and making the site
// feel instant.
//
// Uses Next.js fetch with revalidate=3600 for ISR (Incremental
// Static Regeneration) — pages are cached for 60 seconds, then
// re-fetched in the background.
// =====================================================

import type { Product, BlogPost } from "@/lib/data";
import { stripSchemaMarkup } from "@/lib/clean-description";

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

// ===== Types =====
export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
  desc: string;
  emoji: string;
  bg: string;
};

export interface ServerData {
  products: Product[];
  blogPosts: BlogPost[];
  categories: StoreCategory[];
}

// ===== Server-side fetch with ISR =====
async function serverFetch<T>(path: string): Promise<T> {
  const res = await fetch(
    `${CMS_API}/api/v1/sites/${CMS_SITE_ID}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": CMS_API_KEY,
      },
      next: { revalidate: false }, // ISR — cache for 1 hour
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "API error");
  return json.data as T;
}

// ===== mapProduct — same logic as store.ts but for server =====
function mapProduct(p: any): Product {
  const stripHtml = (html: string) => {
    if (!html) return "";
    const noScript = stripSchemaMarkup(html);
    return noScript
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  };
  const imageUrl = p.featured_image || (p.images && p.images.length > 0 ? p.images[0] : "");

  const tags = p.tags || [];

  // Use the category assigned by the CMS. If no category is assigned,
  // leave as "uncategorized" — don't guess from tags (that created
  // fake categories like cat-food, dog-food, etc. that don't exist
  // in the CMS and confused the admin).
  let category = p.category_slug || "uncategorized";
  let categoryName = p.category_name || "Uncategorized";

  return {
    id: parseInt(p.id?.replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1000000),
    name: p.name || "Unnamed Product",
    brand: tags[0] || "BD71",
    price: p.sale_price || p.base_price || 0,
    oldPrice: p.sale_price ? p.base_price : undefined,
    rating: p.avg_rating || 0,
    reviews: p.review_count || 0,
    emoji: "🐾",
    bg: "from-amber-glow/30 to-terracotta/20",
    tag: p.is_featured ? "Featured" : undefined,
    category,
    categoryName,
    weight: p.weight ? `${p.weight}kg` : "",
    inStock: (p.stock_quantity || 0) > 0,
    sku: p.sku || "",
    slug: p.slug || "",
    // NOTE: description, shortDescription, rawDescription are NOT
    // included in the initial data payload. They're large (1-5KB
    // each per product) and bloat the HTML to 5MB+, which causes
    // AdSense crawler timeouts and slow page loads.
    // Product detail pages get full descriptions via SSR
    // (fetchProductBySlug in seo-fetchers.ts).
    description: "",
    shortDescription: stripHtml(p.short_description)?.slice(0, 100) || "",
    rawDescription: "",
    images: p.images || [],
    featured_image: imageUrl,
    seo: p.seo ?? null,
  };
}

// ===== mapPost =====
function mapPost(p: any): BlogPost {
  let contentSections: { heading: string; body: string }[] = [];
  if (typeof p.content === "string" && p.content) {
    const html = p.content;
    const parts = html.split(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i += 2) {
        const heading = parts[i]?.replace(/<[^>]*>/g, "").trim() || "";
        const body = (parts[i + 1] || "").trim();
        if (heading || body) contentSections.push({ heading, body });
      }
    }
    if (contentSections.length === 0) {
      contentSections = [{ heading: "", body: html }];
    }
  } else if (Array.isArray(p.content)) {
    contentSections = p.content;
  }

  const wordCount = (p.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return {
    id: parseInt(p.id?.replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1000000),
    category: p.tags?.[0] || "Pet Care",
    title: p.title || "Untitled",
    excerpt: p.excerpt?.replace(/<[^>]*>/g, "").trim() || "",
    content: contentSections,
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    readTime,
    comments: 0,
    author: p.author_name || "BD71",
    emoji: "🐾",
    bg: "from-amber-glow/20 to-terracotta/15",
    slug: p.slug || "",
    cover_image: p.cover_image || "",
    seo: p.seo ?? null,
  };
}

// ===== Category visuals =====
function pickCategoryVisuals(slug: string, name: string): { emoji: string; bg: string; desc: string } {
  const s = (slug || "").toLowerCase();
  const n = (name || "").toLowerCase();
  if (s.includes("dog") || n.includes("dog")) return { emoji: "🐶", bg: "from-sage/25 to-terracotta/15", desc: "Dog food and supplies" };
  if (s.includes("litter") || n.includes("litter")) return { emoji: "🧹", bg: "from-sage/20 to-ocean/15", desc: "Cat litter, litter boxes & hygiene" };
  if (s.includes("treat") || n.includes("treat")) return { emoji: "🍖", bg: "from-terracotta/20 to-amber-glow/15", desc: "Treats, wet food & pouches" };
  if (s.includes("fountain") || s.includes("water") || n.includes("fountain")) return { emoji: "💧", bg: "from-ocean/25 to-sage/15", desc: "Water fountains & bowls" };
  if (s.includes("vaccine") || s.includes("medicine") || n.includes("medicine")) return { emoji: "💉", bg: "from-terracotta/20 to-sage/15", desc: "Vaccines & health products" };
  if (s.includes("toy") || n.includes("toy") || s.includes("accessor")) return { emoji: "🪀", bg: "from-amber-glow/20 to-terracotta/10", desc: "Toys, collars & accessories" };
  if (s.includes("bird") || s.includes("fish") || n.includes("bird") || n.includes("fish")) return { emoji: "🐦", bg: "from-ocean/20 to-amber-glow/10", desc: "Bird & fish supplies" };
  if (s.includes("cat") || n.includes("cat")) return { emoji: "🐱", bg: "from-amber-glow/30 to-terracotta/15", desc: "Cat food and supplies" };
  return { emoji: "🐾", bg: "from-amber-glow/20 to-terracotta/15", desc: name || "Products" };
}

// ===== buildCategories =====
function buildCategories(
  apiCats: any[] | null | undefined,
  products: Product[]
): StoreCategory[] {
  const out: StoreCategory[] = [];
  const seen = new Set<string>();

  if (apiCats && apiCats.length > 0) {
    for (const c of apiCats) {
      const slug: string = (c.slug || "").trim();
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const name: string = c.name || slug;
      const { emoji, bg, desc } = pickCategoryVisuals(slug, name);
      const count =
        typeof c.product_count === "number"
          ? c.product_count
          : products.filter((p) => p.category === slug).length;
      out.push({ id: slug, slug, name, count, desc: c.description || desc, emoji, bg });
    }
  }

  for (const p of products) {
    const slug = p.category;
    const name = p.categoryName || slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const { emoji, bg, desc } = pickCategoryVisuals(slug, name);
    out.push({
      id: slug, slug, name,
      count: products.filter((pp) => pp.category === slug).length,
      desc, emoji, bg,
    });
  }

  out.sort((a, b) => {
    if (a.slug === "uncategorized") return 1;
    if (b.slug === "uncategorized") return -1;
    return a.name.localeCompare(b.name);
  });

  return out;
}

// ===== Main server-side data fetcher =====
export async function getServerData(): Promise<ServerData> {
  try {
    const [prodData, postData, catData] = await Promise.all([
      serverFetch<{ products: any[] }>("/products?pageSize=300"),
      serverFetch<{ posts: any[] }>("/posts?pageSize=100"),
      serverFetch<{ categories: any[] }>("/categories?include_counts=1").catch(() => ({ categories: [] })),
    ]);

    const products = (prodData.products ?? []).map(mapProduct);
    const blogPosts = (postData.posts ?? []).map(mapPost);
    const categories = buildCategories(catData.categories, products);

    return { products, blogPosts, categories };
  } catch (e) {
    console.error("[server-data] Failed to fetch:", e);
    return { products: [], blogPosts: [], categories: [] };
  }
}
