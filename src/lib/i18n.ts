"use client";

import { create } from "zustand";

// =====================================================
// Storefront i18n — light-weight client-side i18n
// =====================================================
// Two layers:
//   1. UI strings (this file) — fixed keys for nav, buttons, etc.
//   2. Entity translations — fetched from CMS for product/post/page
//      content (title, description, etc.) per locale.
//
// Usage:
//   const { locale, setLocale, t } = useI18n();
//   t("nav.shop")  // → "Shop" or "দোকান"
//
//   // In a product detail page:
//   const tr = await fetchTranslations("product", productId, locale);
//   const title = tr.title ?? product.name;
// =====================================================

export type StorefrontLocale = "bn" | "en";

const UI_STRINGS: Record<string, { bn: string; en: string }> = {
  // Navigation
  "nav.home": { bn: "হোম", en: "Home" },
  "nav.shop": { bn: "দোকান", en: "Shop" },
  "nav.about": { bn: "আমাদের সম্পর্কে", en: "About" },
  "nav.contact": { bn: "যোগাযোগ", en: "Contact" },
  "nav.blog": { bn: "ব্লগ", en: "Blog" },
  "nav.account": { bn: "অ্যাকাউন্ট", en: "Account" },
  "nav.cart": { bn: "কার্ট", en: "Cart" },
  "nav.search": { bn: "সার্চ...", en: "Search..." },

  // Home
  "home.shopNow": { bn: "এখনই কিনুন", en: "Shop Now" },
  "home.learnMore": { bn: "আরও জানুন", en: "Learn More" },
  "home.featuredProducts": { bn: "ফিচার্ড প্রোডাক্ট", en: "Featured Products" },
  "home.viewAll": { bn: "সব দেখুন", en: "View All" },

  // Product
  "product.addToCart": { bn: "কার্টে যোগ করুন", en: "Add to Cart" },
  "product.buyNow": { bn: "এখনই কিনুন", en: "Buy Now" },
  "product.outOfStock": { bn: "স্টকে নেই", en: "Out of Stock" },
  "product.description": { bn: "বিবরণ", en: "Description" },
  "product.shipping": { bn: "শিপিং", en: "Shipping" },
  "product.reviews": { bn: "রিভিউ", en: "Reviews" },
  "product.relatedProducts": { bn: "সম্পর্কিত প্রোডাক্ট", en: "Related Products" },
  "product.share": { bn: "শেয়ার", en: "Share" },
  "product.wishlist": { bn: "উইশলিস্ট", en: "Wishlist" },

  // Cart
  "cart.title": { bn: "শপিং কার্ট", en: "Shopping Cart" },
  "cart.empty": { bn: "আপনার কার্ট খালি", en: "Your cart is empty" },
  "cart.subtotal": { bn: "সাবটোটাল", en: "Subtotal" },
  "cart.checkout": { bn: "চেকআউট", en: "Checkout" },
  "cart.continueShopping": { bn: "কেনাকাটা চালিয়ে যান", en: "Continue Shopping" },

  // Checkout
  "checkout.title": { bn: "চেকআউট", en: "Checkout" },
  "checkout.contactInfo": { bn: "কন্টাক্ট তথ্য", en: "Contact Information" },
  "checkout.shippingAddress": { bn: "শিপিং ঠিকানা", en: "Shipping Address" },
  "checkout.paymentMethod": { bn: "পেমেন্ট মেথড", en: "Payment Method" },
  "checkout.orderSummary": { bn: "অর্ডার সারাংশ", en: "Order Summary" },
  "checkout.placeOrder": { bn: "অর্ডার করুন", en: "Place Order" },
  "checkout.cod": { bn: "ক্যাশ অন ডেলিভারি", en: "Cash on Delivery" },

  // Account
  "account.welcome": { bn: "স্বাগতম!", en: "Welcome Back!" },
  "account.signIn": { bn: "সাইন ইন", en: "Sign In" },
  "account.register": { bn: "রেজিস্টার", en: "Register" },
  "account.myOrders": { bn: "আমার অর্ডার", en: "My Orders" },
  "account.wishlist": { bn: "উইশলিস্ট", en: "Wishlist" },
  "account.settings": { bn: "সেটিংস", en: "Settings" },
  "account.signOut": { bn: "সাইন আউট", en: "Sign Out" },

  // Contact
  "contact.title": { bn: "যোগাযোগ করুন", en: "Contact Us" },
  "contact.name": { bn: "নাম", en: "Name" },
  "contact.email": { bn: "ইমেইল", en: "Email" },
  "contact.subject": { bn: "বিষয়", en: "Subject" },
  "contact.message": { bn: "বার্তা", en: "Message" },
  "contact.send": { bn: "পাঠান", en: "Send" },

  // Common
  "common.loading": { bn: "লোড হচ্ছে...", en: "Loading..." },
  "common.save": { bn: "সেভ", en: "Save" },
  "common.cancel": { bn: "বাতিল", en: "Cancel" },
  "common.back": { bn: "ফিরে যান", en: "Back" },
  "common.currency": { bn: "৳", en: "৳" }, // Both use BDT
};

interface I18nState {
  locale: StorefrontLocale;
  setLocale: (locale: StorefrontLocale) => void;
  t: (key: string) => string;
}

const DEFAULT_LOCALE: StorefrontLocale =
  typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("bn")
    ? "bn"
    : "en";

export const useI18n = create<I18nState>((set, get) => ({
  locale:
    typeof window !== "undefined"
      ? (localStorage.getItem("sf-locale") as StorefrontLocale) || DEFAULT_LOCALE
      : "en",
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sf-locale", locale);
    }
    set({ locale });
  },
  t: (key) => {
    const { locale } = get();
    const entry = UI_STRINGS[key];
    if (!entry) return key;
    return entry[locale] ?? entry.en ?? key;
  },
}));

// =====================================================
// Fetch entity translations from CMS
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

const trCache = new Map<string, Record<string, string>>();

export async function fetchTranslations(
  entityType: string,
  entityId: string,
  locale: StorefrontLocale
): Promise<Record<string, string>> {
  const cacheKey = `${entityType}:${entityId}:${locale}`;
  if (trCache.has(cacheKey)) return trCache.get(cacheKey)!;

  try {
    const url = `${CMS_API}/api/v1/sites/${CMS_SITE_ID}/translations?entity_type=${entityType}&entity_id=${entityId}&locale=${locale}`;
    const res = await fetch(url, {
      headers: { "X-API-Key": CMS_API_KEY },
    });
    const json = await res.json();
    const tr = json.success ? (json.data?.translations ?? {}) : {};
    trCache.set(cacheKey, tr);
    return tr;
  } catch {
    return {};
  }
}

// Helper: get translated field with fallback
export function trField(
  translations: Record<string, string>,
  field: string,
  fallback: string
): string {
  return translations[field] ?? fallback;
}
