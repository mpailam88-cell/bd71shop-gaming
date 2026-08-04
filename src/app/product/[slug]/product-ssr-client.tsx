"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "@/lib/store";
import { ProductDetailPage } from "@/components/pages/product-detail";

// =====================================================
// Client wrapper — receives SSR product data and passes
// it DIRECTLY to ProductDetailPage as a prop, AND injects
// it into the Zustand store for other components to find.
// =====================================================
//
// Why both?
//   1. Passing as a prop eliminates the "Product not found"
//      flash during navigation. The page renders with the
//      product on the very first paint — no waiting for
//      store hydration, no useMemo-then-rerender cycle.
//   2. Injecting into the store makes the product available
//      to other components (related products, breadcrumbs,
//      cart drawer, etc.) that read from the store.
//
// The store injection happens in a useEffect (after paint),
// which is fine because the prop-based render is already
// showing the product. The useEffect updates the store in
// the background for other consumers.
// =====================================================

export function ProductDetailSSR({ product }: { product: any }) {
  // Set router state in useEffect (after paint) — setting state
  // during render is an anti-pattern that causes React warnings.
  // The router state is only used by other components, not by
  // ProductDetailPage itself (which receives the product as a prop).
  useEffect(() => {
    if (!product) return;
    useRouter.setState({
      page: "product",
      params: { productSlug: product.slug, productId: String(product.id) },
    } as any);

    // Inject product into store if not already present (for other
    // components like related products, cart drawer, etc.)
    const current = useRouter.getState().products;
    const exists = current.find((p) => p.slug === product.slug);
    if (!exists) {
      useRouter.setState((s) => ({
        products: [...s.products, mapApiProduct(product)] as any,
      }));
    }
  }, [product]);

  // Pass the SSR product directly as a prop — this is the key
  // fix. ProductDetailPage uses it as a fallback when the store
  // doesn't have the product yet, so the first paint always
  // shows the correct product (no "Product not found" flash).
  return <ProductDetailPage initialProduct={product ? mapApiProduct(product) : undefined} />;
}

function mapApiProduct(p: any) {
  return {
    id: parseInt(String(p.id).replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1e6),
    slug: p.slug,
    name: p.name,
    brand: p.brand ?? "",
    price: Number(p.sale_price ?? p.base_price ?? 0),
    oldPrice: p.base_price && p.sale_price ? Number(p.base_price) : undefined,
    rating: Number(p.avg_rating ?? 0),
    reviews: Number(p.review_count ?? 0),
    emoji: "🐾",
    bg: "from-amber-glow/20 to-terracotta/10",
    category: p.category_slug ?? "uncategorized",
    categoryName: p.category_name ?? "Product",
    weight: p.weight ? `${p.weight}kg` : "",
    inStock: (p.stock_quantity ?? 0) > 0,
    sku: p.sku ?? "",
    description: p.description ?? "",
    shortDescription: p.short_description ?? "",
    images: Array.isArray(p.images) ? p.images : [],
    featured_image: p.featured_image ?? null,
  };
}
