import type { Metadata } from "next";
import { fetchAllProducts, fetchCategories } from "@/lib/seo-fetchers";
import { ShopSSR } from "./shop-ssr-client";

// =====================================================
// /shop — Server-Rendered Shop Page (SEO)
// =====================================================
// Pre-fetches all products + categories on the Next.js server
// at build time (SSG) and passes them to the client ShopSSR
// component. This eliminates the "page loads, then products
// appear later" pattern — products are in the initial HTML.
// =====================================================

export const revalidate = false; // No ISR — on-demand revalidation only

export const metadata: Metadata = {
  title: "Shop All Pet Products",
  description:
    "Browse our full range of premium pet food, treats, litter, toys, and accessories. Genuine products with fast delivery across Bangladesh.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop All Pet Products",
    description: "Browse our full range of premium pet food, treats, litter, toys, and accessories.",
    url: "/shop",
    type: "website",
  },
};

export default async function ShopPage() {
  // Fetch products + categories in parallel — both are cached
  // at the Next.js server level (revalidate: 300s in seo-fetchers).
  // This runs at BUILD time (SSG) so the user gets a fully
  // populated HTML page instantly.
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories(),
  ]);

  return <ShopSSR initialProducts={products} initialCategories={categories} />;
}
