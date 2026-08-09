"use client";

import { useMemo, useEffect } from "react";
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
  // Set router state + inject SSR data in useEffect (after paint).
  // The SSR data is also passed via the store below so ShopPage
  // can render products immediately.
  useEffect(() => {
    useRouter.setState({ page: "shop", params: {} } as any);

    if (initialProducts && initialProducts.length > 0) {
      const existingSlugs = new Set(useRouter.getState().products.map((p) => p.slug));
      const newProducts = initialProducts
        .filter((p) => !existingSlugs.has(p.slug))
        .map(mapProduct);
      if (newProducts.length > 0) {
        useRouter.setState((s) => ({
          products: [...s.products, ...newProducts] as Product[],
        }));
      }
    }

    if (initialCategories && initialCategories.length > 0) {
      const existing = useRouter.getState().categories;
      if (existing.length === 0) {
        const mapped = buildCategories(initialCategories, initialProducts?.map(mapProduct) ?? []);
        useRouter.setState({ categories: mapped });
      }
    }

    // Mark data as loaded so other components don't trigger another fetch
    if (initialProducts && initialProducts.length > 0) {
      useRouter.setState({ dataLoaded: true });
    }
  }, [initialProducts, initialCategories]);

  return <ShopPage />;
}
