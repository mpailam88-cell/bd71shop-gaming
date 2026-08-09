"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter, mapProduct, buildCategories, type StoreCategory } from "@/lib/store";
import type { Product, BlogPost } from "@/lib/data";
import { ShopPage } from "@/components/pages/shop";

// =====================================================
// ShopSSR — receives SSR products + categories from the
// server component and injects them into the Zustand store
// so ShopPage renders with data on the very first paint.
// =====================================================

interface ShopSSRProps {
  initialProducts?: any[];
  initialCategories?: any[];
}

export function ShopSSR({ initialProducts, initialCategories }: ShopSSRProps) {
  // Map products immediately (not in useEffect) so they're available on first render
  const mappedProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    return initialProducts.map(mapProduct);
  }, [initialProducts]);

  const mappedCategories = useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) return [];
    return buildCategories(initialCategories, mappedProducts);
  }, [initialCategories, mappedProducts]);

  // Inject into store in useEffect (for other components that read from store)
  useEffect(() => {
    useRouter.setState({ page: "shop", params: {} } as any);

    if (mappedProducts.length > 0) {
      const existingSlugs = new Set(useRouter.getState().products.map((p) => p.slug));
      const newProducts = mappedProducts.filter((p) => !existingSlugs.has(p.slug));
      if (newProducts.length > 0) {
        useRouter.setState((s) => ({
          products: [...s.products, ...newProducts] as Product[],
        }));
      }
    }

    if (mappedCategories.length > 0) {
      const existing = useRouter.getState().categories;
      if (existing.length === 0) {
        useRouter.setState({ categories: mappedCategories });
      }
    }

    if (mappedProducts.length > 0) {
      useRouter.setState({ dataLoaded: true });
    }
  }, [mappedProducts, mappedCategories]);

  // Pass mapped products directly to ShopPage via a temporary store override
  // This ensures ShopPage sees the products on FIRST render (not just after useEffect)
  if (mappedProducts.length > 0) {
    // Temporarily set the store state synchronously (before first paint)
    if (useRouter.getState().products.length === 0) {
      useRouter.setState({ products: mappedProducts, categories: mappedCategories });
    }
  }

  return <ShopPage />;
}
