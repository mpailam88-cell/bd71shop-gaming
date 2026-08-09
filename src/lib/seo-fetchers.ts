// =====================================================
// Single-entity server-side fetchers for SEO routes
// =====================================================
// Used by /product/[slug], /blog/[slug], /category/[slug]
// to fetch ONE entity server-side for proper SSR + SEO.
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/products?pageSize=500`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: [`product-${slug}`] },
      }
    );
    const json = await res.json();
    if (!json.success) return null;
    // API returns all products — filter by slug to find the exact match
    const products: any[] = json.data?.products ?? [];
    const product = products.find((p) => p.slug === slug);
    return product ?? null;
  } catch {
    return null;
  }
}

export async function fetchPostBySlug(slug: string) {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/posts?pageSize=200`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: [`post-${slug}`] },
      }
    );
    const json = await res.json();
    if (!json.success) return null;
    // API ignores the ?slug= param and returns all posts —
    // filter client-side to find the exact match.
    const posts: any[] = json.data?.posts ?? [];
    const post = posts.find((p) => p.slug === slug);
    return post ?? null;
  } catch {
    return null;
  }
}

export async function fetchAllProducts(): Promise<any[]> {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/products?pageSize=500`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: ["all-products"] },
      }
    );
    const json = await res.json();
    if (!json.success) return [];
    return json.data?.products ?? [];
  } catch {
    return [];
  }
}

export async function fetchAllPosts(): Promise<any[]> {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/posts?pageSize=200`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: ["all-posts"] },
      }
    );
    const json = await res.json();
    if (!json.success) return [];
    return json.data?.posts ?? [];
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<any[]> {
  try {
    const res = await fetch(
      `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/categories?include_counts=1`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": CMS_API_KEY },
        next: { revalidate: false, tags: ["categories"] },
      }
    );
    const json = await res.json();
    if (!json.success) return [];
    return json.data?.categories ?? [];
  } catch {
    return [];
  }
}
