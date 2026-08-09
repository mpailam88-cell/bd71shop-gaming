"use client";

import { useMemo, useEffect } from "react";
import { useRouter, mapProduct, buildCategories } from "@/lib/store";
import type { Product } from "@/lib/data";
import { ShopPage } from "@/components/pages/shop";

interface ShopSSRProps {
  initialProducts?: any[];
  initialCategories?: any[];
}

export function ShopSSR({ initialProducts, initialCategories }: ShopSSRProps) {
  // Map products immediately — available on first render
  const mappedProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    return initialProducts.map(mapProduct);
  }, [initialProducts]);

  const mappedCategories = useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) return [];
    return buildCategories(initialCategories, mappedProducts);
  }, [initialCategories, mappedProducts]);

  // Inject into store for other components (cart, navigation, etc.)
  useEffect(() => {
    useRouter.setState({ page: "shop", params: {} } as any);

    if (mappedProducts.length > 0) {
      const existing = useRouter.getState().products;
      if (existing.length === 0) {
        useRouter.setState({
          products: mappedProducts,
          categories: mappedCategories,
          dataLoaded: true,
        });
      }
    }
  }, [mappedProducts, mappedCategories]);

  // Pass products directly as props — bypass the store entirely
  // This ensures ShopPage renders with the SSR products on FIRST paint
  return <ShopPage serverProducts={mappedProducts} serverCategories={mappedCategories} />;
}
