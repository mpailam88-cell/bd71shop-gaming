import { create } from "zustand";
import type { Product, BlogPost } from "@/lib/data";
import { stripSchemaMarkup } from "@/lib/clean-description";

export type PageId =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "about"
  | "contact"
  | "blog"
  | "blog-single"
  | "privacy"
  | "terms"
  | "dmca"
  | "disclaimer"
  | "not-found"
  | "account"
  | "category";

// =====================================================
// Next.js App Router integration for client-side navigation.
// =====================================================
// The Zustand store can't use the `useRouter` hook from
// next/navigation directly (hooks only work in React
// components). Instead, we expose a global "navigation
// adapter" that a React component (NavigationBridge) sets
// on mount. When navigate() is called, it invokes this
// adapter — which calls router.push() — enabling smooth
// client-side transitions WITHOUT a full page reload.
//
// Before this, navigate() used window.location.href, which
// caused a full page reload on every navigation — resulting
// in the blank/loading flash the user saw between pages.
// =====================================================
type NavigationAdapter = (url: string) => void;

let navigationAdapter: NavigationAdapter | null = null;

export function setNavigationAdapter(adapter: NavigationAdapter | null) {
  navigationAdapter = adapter;
}

// Map page ID + params to a real URL path
export function pageToUrl(page: PageId, params: RouteParams = {}): string {
  const urlMap: Record<string, string> = {
    home: "/",
    shop: "/shop",
    product: params.productSlug ? `/product/${params.productSlug}` : "/shop",
    cart: "/cart",
    checkout: "/checkout",
    about: "/about",
    contact: "/contact",
    blog: "/blog",
    "blog-single": params.blogSlug ? `/blog/${params.blogSlug}` : "/blog",
    privacy: "/privacy",
    terms: "/terms",
    dmca: "/dmca",
    disclaimer: "/disclaimer",
    account: "/account",
        "order-tracking": "/order-tracking",
    "order-tracking": "/order-tracking",
  };
  return urlMap[page] || "/";
}

export type RouteParams = {
  productId?: string;
  productSlug?: string;
  blogId?: number;
  blogSlug?: string;
  category?: string;
  [key: string]: string | number | undefined;
};

// A category entry used by the storefront nav + filter bars.
// Built dynamically from the CMS `/categories` endpoint (with a
// fallback derived from products' category fields).
export type StoreCategory = {
  id: string;       // == slug
  name: string;
  slug: string;
  count: number;
  desc: string;
  emoji: string;
  bg: string;
};

type RouterState = {
  page: PageId;
  params: RouteParams;
  navigate: (page: PageId, params?: RouteParams) => void;
  products: Product[];
  blogPosts: BlogPost[];
  categories: StoreCategory[];
  dataLoaded: boolean;
  loadData: () => Promise<void>;
};

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

async function cmsFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${CMS_API}/api/v1/sites/${CMS_SITE_ID}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": CMS_API_KEY,
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "API error");
  return json.data as T;
}

// ===== LocalStorage Cache (stale-while-revalidate) =====
const CACHE_KEY_PRODUCTS = `cms_${CMS_SITE_ID}_products_v9`;
const CACHE_KEY_POSTS = `cms_${CMS_SITE_ID}_posts_v8`;
const CACHE_KEY_CATEGORIES = `cms_${CMS_SITE_ID}_categories_v2`;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function loadFromCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    return data as T;
  } catch {
    return null;
  }
}

function saveToCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage full or unavailable — skip caching
  }
}

function isCacheFresh(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const { timestamp } = JSON.parse(raw);
    return Date.now() - timestamp < CACHE_TTL;
  } catch {
    return false;
  }
}

// =====================================================
// Synchronous initialization from localStorage.
//
// This runs ONCE when the store module is first imported.
// If the user has visited the site before, their cached
// products/posts/categories are loaded IMMEDIATELY —
// before the first React render. This means:
//
//   - No "Loading..." flash on page navigation
//   - No "No products found" flicker while data hydrates
//   - The store is populated from the very first paint
//
// Without this, the store starts empty (dataLoaded: false),
// and pages would show loading screens for a frame or two
// before StoreInitializer's useEffect runs loadData().
// =====================================================
function getInitialStoreState() {
  if (typeof window === "undefined") {
    return {
      products: [] as Product[],
      blogPosts: [] as BlogPost[],
      categories: [] as StoreCategory[],
      dataLoaded: false,
    };
  }

  // PRIORITY 1: Check window.__INITIAL_DATA__ (set by server component)
  // This is available synchronously before React hydrates, so the first
  // render will have real product data (with featured_image URLs).
  if ((window as any).__INITIAL_DATA__) {
    const initial = (window as any).__INITIAL_DATA__;
    if (initial.products && initial.products.length > 0) {
      const products = initial.products as Product[];
      const blogPosts = (initial.blogPosts ?? []) as BlogPost[];
      const categories = initial.categories ?? buildCategories(null, products);
      return {
        products,
        blogPosts,
        categories,
        dataLoaded: true,
      };
    }
  }

  // PRIORITY 2: Check localStorage cache (from previous visit)
  const cachedProducts = loadFromCache<Product[]>(CACHE_KEY_PRODUCTS);
  const cachedPosts = loadFromCache<BlogPost[]>(CACHE_KEY_POSTS);
  const cachedCats = loadFromCache<StoreCategory[]>(CACHE_KEY_CATEGORIES);

  if (cachedProducts && cachedPosts) {
    return {
      products: cachedProducts,
      blogPosts: cachedPosts,
      categories: cachedCats ?? buildCategories(null, cachedProducts),
      dataLoaded: true,
    };
  }

  return {
    products: [] as Product[],
    blogPosts: [] as BlogPost[],
    categories: [] as StoreCategory[],
    dataLoaded: false,
  };
}

export function mapProduct(p: any): Product {
  // Strip <script> blocks (with content) AND any standalone JSON-LD
  // text that survived earlier tag stripping — Yoast/RankMath inject
  // FAQ schema into the WooCommerce description, and without this the
  // schema text leaks into the visible product page.
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

  // Determine category — use ONLY the CMS-assigned category.
  // Don't guess from tags (that created fake categories like
  // cat-food, dog-food, etc. that don't exist in the CMS).
  const tags = p.tags || [];

  let category = p.category_slug || "uncategorized";
  let categoryName = p.category_name || "Uncategorized";

  return {
    id: parseInt(String(p.id || "").replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1000000),
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
    description: stripHtml(p.description),
    shortDescription: stripHtml(p.short_description),
    // Strip schema markup from rawDescription too — otherwise the
    // product detail page will render the FAQ JSON-LD as visible text
    // (and parseFAQFromText will mistake it for FAQ answer content).
    rawDescription: stripSchemaMarkup(p.description || ""),
    images: p.images || [],
    featured_image: imageUrl,
    // Pass through the SEO metadata block (from CMS seo_metadata join).
    // PageMeta component picks this up to set proper title, description,
    // canonical URL, OG image, and robots directives on the client.
    seo: p.seo ?? null,
  };
}

export function mapPost(p: any): BlogPost {
  // Content: keep raw HTML for rendering with dangerouslySetInnerHTML
  let contentSections: { heading: string; body: string }[] = [];
  if (typeof p.content === "string" && p.content) {
    // Split HTML content into sections by h2/h3 headings
    const html = p.content;
    // Try to split by headings
    const parts = html.split(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    if (parts.length > 1) {
      // Has headings — create sections
      for (let i = 1; i < parts.length; i += 2) {
        const heading = parts[i]?.replace(/<[^>]*>/g, "").trim() || "";
        const body = (parts[i + 1] || "").trim();
        if (heading || body) {
          contentSections.push({ heading, body });
        }
      }
    }
    // If no sections created, put entire content as one section
    if (contentSections.length === 0) {
      contentSections = [{ heading: "", body: html }];
    }
  } else if (Array.isArray(p.content)) {
    contentSections = p.content;
  }

  // Calculate read time from content length
  const wordCount = (p.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return {
    id: parseInt(String(p.id || "").replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1000000),
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
    // SEO metadata (Yoast/RankMath) from CMS seo_metadata join.
    seo: p.seo ?? null,
  };
}

// =====================================================
// Build the storefront category list.
//
// Priority:
//   1. Use the CMS /categories endpoint payload (preferred — source of truth).
//   2. Derive from products' `category` + `categoryName` fields (fallback).
//
// Each category gets a deterministic emoji + gradient based on slug
// keywords so the UI looks consistent regardless of source.
// =====================================================
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

export function buildCategories(
  apiCats: any[] | null | undefined,
  products: Product[]
): StoreCategory[] {
  const out: StoreCategory[] = [];
  const seen = new Set<string>();

  // First pass: API-provided categories (source of truth)
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
      out.push({
        id: slug,
        slug,
        name,
        count,
        desc: c.description || desc,
        emoji,
        bg,
      });
    }
  }

  // Second pass: any product categories not in the API list
  // (e.g. tag-derived fallback categories for products whose
  // category_id is null in the CMS).
  for (const p of products) {
    const slug = p.category;
    const name = p.categoryName || slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const { emoji, bg, desc } = pickCategoryVisuals(slug, name);
    out.push({
      id: slug,
      slug,
      name,
      count: products.filter((pp) => pp.category === slug).length,
      desc,
      emoji,
      bg,
    });
  }

  // Sort by name (alphabetical) but keep "uncategorized" last
  out.sort((a, b) => {
    if (a.slug === "uncategorized") return 1;
    if (b.slug === "uncategorized") return -1;
    return a.name.localeCompare(b.name);
  });

  return out;
}

export const useRouter = create<RouterState>((set, get) => ({
  page: "home",
  params: {},
  // ===== Synchronous initial state from localStorage =====
  // Populated IMMEDIATELY on store creation so the very first
  // React render has data. No loading screens ever show.
  ...getInitialStoreState(),
  navigate: (page, params = {}) => {
    if (typeof window !== "undefined") {
      const newUrl = pageToUrl(page, params);

      // Already on the target page — just scroll to top.
      if (window.location.pathname === newUrl) {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return;
      }

      // Only call router.push(). Do NOT call set() here.
      // RouteSync will detect the URL change and call set() once.
      // This prevents the double-render:
      //   navigate() → set() → RouteSync → set() = TWO renders
      //   navigate() → router.push() → RouteSync → set() = ONE render
      if (navigationAdapter) {
        navigationAdapter(newUrl);
      } else {
        window.location.href = newUrl;
      }
    } else {
      set({ page, params });
    }
  },
  // ===== hydrateFromServer — called once on page load with SSR data =====
  // Sets data immediately without any loading flash. Data was fetched
  // on the Next.js server and passed via props.
  loadData: async () => {
    if (get().dataLoaded) return;

    // Step 1: Check if server already provided data (via window.__INITIAL_DATA__)
    if (typeof window !== "undefined" && (window as any).__INITIAL_DATA__) {
      const initial = (window as any).__INITIAL_DATA__;
      set({
        products: initial.products ?? [],
        blogPosts: initial.blogPosts ?? [],
        categories: initial.categories ?? [],
        dataLoaded: true,
      });
      // Save to localStorage for subsequent navigations
      try {
        saveToCache(CACHE_KEY_PRODUCTS, initial.products ?? []);
        saveToCache(CACHE_KEY_POSTS, initial.blogPosts ?? []);
        saveToCache(CACHE_KEY_CATEGORIES, initial.categories ?? []);
      } catch {}
      return;
    }

    // Step 1: Instantly load from localStorage cache (if exists)
    const cachedProducts = loadFromCache<Product[]>(CACHE_KEY_PRODUCTS);
    const cachedPosts = loadFromCache<BlogPost[]>(CACHE_KEY_POSTS);
    const cachedCats = loadFromCache<StoreCategory[]>(CACHE_KEY_CATEGORIES);

    if (cachedProducts && cachedPosts) {
      // Show cached data IMMEDIATELY — zero loading time
      set({
        products: cachedProducts,
        blogPosts: cachedPosts,
        categories: cachedCats ?? buildCategories(null, cachedProducts),
        dataLoaded: true,
      });

      // If cache is fresh (< 5 min), don't even bother fetching
      if (isCacheFresh(CACHE_KEY_PRODUCTS) && isCacheFresh(CACHE_KEY_POSTS)) {
        return;
      }

      // Cache is stale — silently revalidate in background
      // User already sees data, this just updates it
      try {
        const [prodData, postData, catData] = await Promise.all([
          cmsFetch<{ products: any[] }>("/products?pageSize=300"),
          cmsFetch<{ posts: any[] }>("/posts?pageSize=100"),
          cmsFetch<{ categories: any[] }>("/categories?include_counts=1").catch(() => ({ categories: [] })),
        ]);
        const freshProducts = prodData.products.map(mapProduct);
        const freshPosts = postData.posts.map(mapPost);
        const freshCats = buildCategories(catData.categories, freshProducts);
        set({ products: freshProducts, blogPosts: freshPosts, categories: freshCats });
        saveToCache(CACHE_KEY_PRODUCTS, freshProducts);
        saveToCache(CACHE_KEY_POSTS, freshPosts);
        saveToCache(CACHE_KEY_CATEGORIES, freshCats);
      } catch {
        // Background revalidation failed — keep showing cached data
      }
      return;
    }

    // Step 2: No cache — first visit. Show loading, fetch from API
    try {
      const [prodData, postData, catData] = await Promise.all([
        cmsFetch<{ products: any[] }>("/products?pageSize=300"),
        cmsFetch<{ posts: any[] }>("/posts?pageSize=100"),
        cmsFetch<{ categories: any[] }>("/categories?include_counts=1").catch(() => ({ categories: [] })),
      ]);
      const products = prodData.products.map(mapProduct);
      const blogPosts = postData.posts.map(mapPost);
      const categories = buildCategories(catData.categories, products);

      set({ products, blogPosts, categories, dataLoaded: true });

      // Save to cache for next visit (instant load)
      saveToCache(CACHE_KEY_PRODUCTS, products);
      saveToCache(CACHE_KEY_POSTS, blogPosts);
      saveToCache(CACHE_KEY_CATEGORIES, categories);
    } catch (e) {
      console.error("Failed to load CMS data:", e);
      set({ dataLoaded: true });
    }
  },
}));

// ===== Cart Store with localStorage persistence =====
export type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  emoji: string;
  bg: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  count: () => number;
  subtotal: () => number;
};

const CART_STORAGE_KEY = "pn_cart_v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }
}

export const useCart = create<CartState>((set, get) => ({
  items: loadCart(),
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
  addItem: (item, qty = 1) => {
    const existing = get().items.find((i) => i.id === item.id);
    let newItems: CartItem[];
    if (existing) {
      newItems = get().items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
      );
    } else {
      newItems = [...get().items, { ...item, quantity: qty }];
    }
    set({ items: newItems, isOpen: true });
    saveCart(newItems);
  },
  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.id !== id);
    set({ items: newItems });
    saveCart(newItems);
  },
  updateQuantity: (id, qty) => {
    const newItems = get()
      .items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
      .filter((i) => i.quantity > 0);
    set({ items: newItems });
    saveCart(newItems);
  },
  clearCart: () => {
    set({ items: [] });
    saveCart([]);
  },
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
