"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/store";
import { ErrorBoundary } from "@/components/error-boundary";
// Header/Footer/CartDrawer now live in LayoutShell (root layout)
import { HomePage } from "@/components/pages/home";
import { ShopPage } from "@/components/pages/shop";
import { ProductDetailPage } from "@/components/pages/product-detail";
import { CartPage } from "@/components/pages/cart";
import { CheckoutPage } from "@/components/pages/checkout";
import { AboutPage } from "@/components/pages/about";
import { ContactPage } from "@/components/pages/contact";
import { BlogPage } from "@/components/pages/blog";
import { BlogSinglePage } from "@/components/pages/blog-single";
import { LegalPage } from "@/components/pages/legal";
import { NotFoundPage } from "@/components/pages/not-found";
import { AccountPage } from "@/components/pages/account";

// =====================================================
// AppShell — only used on the home page (/) route.
// =====================================================
// NOTE: We deliberately DO NOT use AnimatePresence / motion.div
// here. The previous version wrapped renderPage() in an
// <AnimatePresence mode="wait"> with a keyed motion.div, which
// caused a visible 3-step load pattern on every page change:
//   1. Old page fades out (200ms)
//   2. URL changes
//   3. New page fades in (200ms)
// During the fade, the user saw a blank screen — perceived as
// "page loads, URL changes, then loads again".
//
// Without AnimatePresence, page swaps are instantaneous. The
// new page renders immediately when the store's `page` field
// changes, with no fade gap.
//
// The browser's built-in loading.tsx (skeleton) handles the
// brief fetch window for SSR pages.
// =====================================================

// URL path → page mapping
const PATH_TO_PAGE: Record<string, { page: string; params?: any }> = {
  "/": { page: "home" },
  "/shop": { page: "shop" },
  "/cart": { page: "cart" },
  "/checkout": { page: "checkout" },
  "/about": { page: "about" },
  "/contact": { page: "contact" },
  "/blog": { page: "blog" },
  "/privacy": { page: "privacy" },
  "/terms": { page: "terms" },
  "/dmca": { page: "dmca" },
  "/disclaimer": { page: "disclaimer" },
  "/account": { page: "account" },
};

export function AppShell() {
  const page = useRouter((s) => s.page);
  const loadData = useRouter((s) => s.loadData);

  // Load CMS data on mount — reads from window.__INITIAL_DATA__
  // (set by the server component) so data is available instantly.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // On first load, read URL and set the right page
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "") || "/";

    if (PATH_TO_PAGE[path]) {
      useRouter.setState(PATH_TO_PAGE[path] as any);
      return;
    }

    // /product/{slug} — use slug, not ID
    if (path.startsWith("/product/")) {
      const slug = path.split("/")[2];
      if (slug) {
        useRouter.setState({ page: "product", params: { productSlug: slug } } as any);
        return;
      }
    }

    // /blog/{slug} — use slug, not ID
    if (path.startsWith("/blog/")) {
      const slug = path.split("/")[2];
      if (slug) {
        useRouter.setState({ page: "blog-single", params: { blogSlug: slug } } as any);
        return;
      }
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page) {
        useRouter.setState({ page: e.state.page, params: e.state.params || {} } as any);
      } else {
        const path = window.location.pathname.replace(/\/$/, "") || "/";
        if (PATH_TO_PAGE[path]) {
          useRouter.setState(PATH_TO_PAGE[path] as any);
        } else if (path.startsWith("/product/")) {
          useRouter.setState({ page: "product", params: { productSlug: path.split("/")[2] } } as any);
        } else if (path.startsWith("/blog/")) {
          useRouter.setState({ page: "blog-single", params: { blogSlug: path.split("/")[2] } } as any);
        } else {
          useRouter.setState({ page: "home", params: {} } as any);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "shop": return <ShopPage />;
      case "product": return <ProductDetailPage />;
      case "cart": return <CartPage />;
      case "checkout": return <CheckoutPage />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      case "blog": return <BlogPage />;
      case "blog-single": return <BlogSinglePage />;
      case "privacy": return <LegalPage page="privacy" />;
      case "terms": return <LegalPage page="terms" />;
      case "dmca": return <LegalPage page="dmca" />;
      case "disclaimer": return <LegalPage page="disclaimer" />;
      case "account": return <AccountPage />;
      case "not-found": return <NotFoundPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <ErrorBoundary key={page}>
          {renderPage()}
        </ErrorBoundary>
      </main>
    </div>
  );
}
