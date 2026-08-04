import type { Metadata } from "next";
import { BlogSSR } from "./blog-ssr-client";

// =====================================================
// /blog — Server-Rendered Blog Listing (SEO)
// =====================================================

export const revalidate = false; // No ISR — on-demand revalidation only

export const metadata: Metadata = {
  title: "Pet Care Blog",
  description:
    "Expert pet care tips, nutrition guides, product reviews, and heartwarming stories. Learn how to keep your cats, dogs, and other pets happy and healthy.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Pet Care Blog",
    description: "Expert pet care tips, nutrition guides, product reviews, and pet stories.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogSSR />;
}
