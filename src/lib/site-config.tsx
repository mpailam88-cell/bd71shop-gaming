"use client";

import { useState, useEffect } from "react";
import { siteInfo as defaultSiteInfo } from "@/lib/data";
import { getSocialLinks, type SocialLink } from "@/lib/social-links";

// =====================================================
// Site Config — dynamic site identity from CMS
// =====================================================
// Uses localStorage cache for instant load.
// Fetches fresh data in background.
// =====================================================

export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  brandColor: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
}

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";
const CACHE_KEY = "pn_site_config_v1";

const DEFAULT_CONFIG: SiteConfig = {
  siteName: defaultSiteInfo.name,
  logoUrl: "",
  faviconUrl: "",
  brandColor: "#F97316",
  tagline: defaultSiteInfo.name,
  phone: defaultSiteInfo.phone,
  email: defaultSiteInfo.email,
  address: defaultSiteInfo.address,
  socialLinks: [],
};

// Load from localStorage synchronously on module init
// Also check window.__SITE_CONFIG__ (set by inline script in layout.tsx)
function loadCachedConfig(): SiteConfig | null {
  if (typeof window === "undefined") return null;

  // First check window.__SITE_CONFIG__ (set by inline script before React)
  if ((window as any).__SITE_CONFIG__) {
    return { ...DEFAULT_CONFIG, ...(window as any).__SITE_CONFIG__ };
  }

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return null;
  }
}

let cachedConfig: SiteConfig | null = loadCachedConfig();

function saveCache(config: SiteConfig) {
  cachedConfig = config;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(config));
    } catch {}
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  // Always fetch fresh — cache is just for instant initial render.
  // Background fetch will update state when it arrives.
  try {
    // Single API call — get all settings (branding is inside settings now)
    const res = await fetch(`${CMS_API}/api/v1/sites/${CMS_SITE_ID}/settings`, {
      headers: { "X-API-Key": CMS_API_KEY },
    });
    const json = await res.json();
    const settings = json.success ? (json.data?.settings ?? {}) : {};

    // Parse branding from settings (stored as JSON string under key='branding')
    let branding: any = {};
    if (settings.branding) {
      try {
        branding = typeof settings.branding === "string"
          ? JSON.parse(settings.branding)
          : settings.branding;
      } catch {}
    }

    // Fetch social links in parallel (non-blocking)
    let socialLinks: SocialLink[] = cachedConfig?.socialLinks ?? [];
    getSocialLinks().then((links: SocialLink[]) => {
      if (cachedConfig) {
        saveCache({ ...cachedConfig, socialLinks: links });
      }
    });

    const config: SiteConfig = {
      siteName: settings.site_name || defaultSiteInfo.name,
      logoUrl: branding.logo_url || settings.logo_url || "",
      faviconUrl: branding.favicon_url || "",
      brandColor: branding.brand_color || "#F97316",
      tagline: branding.tagline || branding.brand_name || settings.site_name || defaultSiteInfo.name,
      phone: settings.phone || defaultSiteInfo.phone,
      email: settings.notification_email || settings.contact_email || defaultSiteInfo.email,
      address: settings.address || defaultSiteInfo.address,
      socialLinks,
    };

    saveCache(config);

    // Update favicon if set
    if (config.faviconUrl && typeof document !== "undefined") {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = config.faviconUrl;
    }

    // Update document title with site name
    if (config.siteName && typeof document !== "undefined") {
      document.title = document.title.replace(defaultSiteInfo.name, config.siteName);
    }

    return config;
  } catch {
    return cachedConfig ?? DEFAULT_CONFIG;
  }
}

// React hook for components
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(cachedConfig ?? DEFAULT_CONFIG);

  useEffect(() => {
    fetchSiteConfig().then(setConfig);
  }, []);

  return config;
}

export function getSiteConfigSync(): SiteConfig {
  return cachedConfig ?? DEFAULT_CONFIG;
}
