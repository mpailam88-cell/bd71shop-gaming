"use client";

// =====================================================
// <PageMeta /> — sets dynamic SEO metadata for the current route.
// =====================================================
// Uses getSiteNameSync() to get the site name from CMS (cached
// after the first server-side fetch in layout.tsx). This ensures
// the client-side title matches the server-rendered title — no
// hydration mismatch.
// =====================================================

import { useEffect, useMemo } from "react";
import { useRouter } from "@/lib/store";
import { setPageMeta, type PageMeta } from "@/lib/use-page-meta";
import { getSiteNameSync } from "@/lib/site-name";

const BASE_URL = "https://bd71shop.com";

// Build static meta dynamically using the CMS site name.
// Called inside useMemo so it picks up the latest cached site name.
function buildStaticMeta(siteName: string): Record<string, PageMeta> {
  return {
    home: {
      title: `${siteName} | Premium Pet Food Online in Bangladesh`,
      description: `Shop premium pet food for cats, dogs, birds & fish at ${siteName}. Genuine products, affordable prices & fast delivery across Bangladesh.`,
      path: "/",
      keywords: `pet food Bangladesh, cat food, dog food, ${siteName}, pet shop Dhaka, premium pet food`,
    },
    shop: {
      title: `Shop All Pet Products | ${siteName}`,
      description: "Browse our full range of premium pet food, treats, litter, toys, and accessories. Genuine products with fast delivery across Bangladesh.",
      path: "/shop",
      keywords: "pet shop, pet food, cat food, dog food, pet accessories Bangladesh",
    },
    cart: {
      title: `Your Cart | ${siteName}`,
      description: "Review your cart and proceed to checkout.",
      path: "/cart",
    },
    checkout: {
      title: `Checkout | ${siteName}`,
      description: "Secure checkout with cash on delivery and bKash/Nagad support.",
      path: "/checkout",
    },
    about: {
      title: `About Us | ${siteName}`,
      description: `${siteName} is Bangladesh's trusted source for premium pet food and supplies. Genuine products, fair prices, fast delivery.`,
      path: "/about",
    },
    contact: {
      title: `Contact Us | ${siteName}`,
      description: `Get in touch with ${siteName}. Call us or message us — we're here to help.`,
      path: "/contact",
    },
    blog: {
      title: `Pet Care Blog | ${siteName}`,
      description: "Pet care tips, expert guides, and stories from our community of pet lovers across Bangladesh.",
      path: "/blog",
    },
    privacy: {
      title: `Privacy Policy | ${siteName}`,
      description: `How ${siteName} collects, uses, and protects your data.`,
      path: "/privacy",
    },
    terms: {
      title: `Terms & Conditions | ${siteName}`,
      description: `Terms and conditions for using ${siteName}.`,
      path: "/terms",
    },
    dmca: {
      title: `DMCA Policy | ${siteName}`,
      description: `DMCA policy and takedown procedure for ${siteName}.`,
      path: "/dmca",
    },
    disclaimer: {
      title: `Disclaimer | ${siteName}`,
      description: `Disclaimer for ${siteName} products and content.`,
      path: "/disclaimer",
    },
    account: {
      title: `My Account | ${siteName}`,
      description: "View your orders and account details.",
      path: "/account",
    },
    "not-found": {
      title: `Page Not Found | ${siteName}`,
      description: "The page you're looking for doesn't exist.",
      path: "/404",
    },
  };
}

export function PageMeta() {
  const page = useRouter((s) => s.page);
  const params = useRouter((s) => s.params);
  const products = useRouter((s) => s.products);
  const blogPosts = useRouter((s) => s.blogPosts);

  const meta: PageMeta | null = useMemo(() => {
    const siteName = getSiteNameSync();
    const STATIC_META = buildStaticMeta(siteName);

    // ===== Product detail page =====
    if (page === "product") {
      const product = params.productSlug
        ? products.find((p) => p.slug === params.productSlug)
        : params.productId
        ? products.find((p) => String(p.id) === String(params.productId))
        : null;

      if (!product) {
        return {
          title: `Loading product… | ${siteName}`,
          description: "Loading product details.",
          path: params.productSlug ? `/product/${params.productSlug}` : "/shop",
        };
      }

      const seo = product.seo;
      const title = seo?.seo_title || `${product.name} — ৳${product.price}`;
      const description = seo?.seo_description
        || product.shortDescription
        || (product.description || "").slice(0, 160)
        || `${product.name} — buy online at ${siteName} with fast delivery across Bangladesh.`;
      const image = seo?.og_image || product.featured_image;
      const keywords = seo?.focus_keyword
        || `${product.name}, ${product.brand}, ${product.categoryName}, buy online Bangladesh`;

      return {
        title,
        description,
        path: `/product/${product.slug || product.id}`,
        image,
        keywords,
        isArticle: true,
        robotsIndex: seo?.robots_index ?? true,
        robotsFollow: seo?.robots_follow ?? true,
      };
    }

    // ===== Blog archive =====
    if (page === "blog") {
      return STATIC_META.blog;
    }

    // ===== Blog single post =====
    if (page === "blog-single") {
      const post = params.blogSlug
        ? blogPosts.find((p) => p.slug === params.blogSlug)
        : null;
      if (!post) {
        return {
          title: `Article | ${siteName}`,
          description: "Loading article.",
          path: params.blogSlug ? `/blog/${params.blogSlug}` : "/blog",
        };
      }

      const seo = post.seo;
      const title = seo?.seo_title || `${post.title} | ${siteName} Blog`;
      const description = seo?.seo_description
        || post.excerpt
        || `Read the latest pet care tips on the ${siteName} blog.`;
      const image = seo?.og_image || post.cover_image;
      const keywords = seo?.focus_keyword || post.category;

      return {
        title,
        description,
        path: `/blog/${post.slug || post.id}`,
        image,
        keywords,
        isArticle: true,
        robotsIndex: seo?.robots_index ?? true,
        robotsFollow: seo?.robots_follow ?? true,
      };
    }

    // ===== Shop with category filter =====
    if (page === "shop" && params.category) {
      const cat = products.find((p) => p.category === params.category)?.categoryName;
      return {
        title: cat ? `${cat} — Shop Online | ${siteName}` : `Shop | ${siteName}`,
        description: cat
          ? `Browse ${cat} at ${siteName}. Genuine products, fair prices, fast delivery across Bangladesh.`
          : "Browse our full range of premium pet products.",
        path: `/shop?category=${encodeURIComponent(params.category as string)}`,
      };
    }

    // ===== Static pages =====
    return STATIC_META[page] ?? STATIC_META.home;
  }, [page, params.productSlug, params.productId, params.blogSlug, params.category, products, blogPosts]);

  useEffect(() => {
    if (meta) setPageMeta(meta);
  }, [meta]);

  return null;
}
