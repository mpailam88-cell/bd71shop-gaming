"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { PageMeta } from "@/components/site/page-meta";
import { StoreInitializer } from "@/components/site/store-initializer";
import { NavigationBridge } from "@/components/site/navigation-bridge";
import { RouteSync } from "@/components/site/route-sync";
import { fetchSiteConfig, getSiteConfigSync, type SiteConfig } from "@/lib/site-config";

// =====================================================
// LayoutShell — wraps ALL pages with header/footer/cart
// =====================================================
// Uses cached site config for instant render.
// Fetches fresh config in background.
// Also mounts NavigationBridge (for client-side navigation)
// and RouteSync (for browser back/forward support).
// =====================================================

export function LayoutShell({ children }: { children: React.ReactNode }) {
  // Start with cached config (from localStorage) — instant!
  const [config, setConfig] = useState<SiteConfig>(getSiteConfigSync());

  // Fetch fresh config in background (non-blocking)
  useEffect(() => {
    fetchSiteConfig().then(setConfig);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationBridge />
      <RouteSync />
      <StoreInitializer />
      <PageMeta />
      <SiteHeader
        socialLinks={config.socialLinks}
        siteName={config.siteName}
        logoUrl={config.logoUrl}
        phone={config.phone}
      />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter
        socialLinks={config.socialLinks}
        siteName={config.siteName}
        logoUrl={config.logoUrl}
        phone={config.phone}
        email={config.email}
        address={config.address}
      />
      <CartDrawer />
    </div>
  );
}
