"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/store";

// =====================================================
// StoreInitializer — ensures SPA store is loaded on ANY page
// =====================================================
// On the home page, AppShell's useEffect calls loadData() which
// reads window.__INITIAL_DATA__ (set by server component).
//
// But on /product/[slug], /blog/[slug], /shop, /about, etc.
// the page renders WITHOUT AppShell — just the page-specific
// SSR component. So the store never initializes, and the page
// hangs in loading state forever.
//
// This component fixes that: include it once at the top of
// every SSR page wrapper. It calls loadData() on mount if
// data hasn't been loaded yet.
//
// Safe to include multiple times — loadData() is idempotent
// (returns early if dataLoaded is true).
// =====================================================

export function StoreInitializer() {
  const loadData = useRouter((s) => s.loadData);
  const dataLoaded = useRouter((s) => s.dataLoaded);

  useEffect(() => {
    if (!dataLoaded) {
      loadData();
    }
  }, [loadData, dataLoaded]);

  return null;
}
