import type { Metadata } from "next";
import { fetchAllPosts } from "@/lib/seo-fetchers";
import { BlogSSR } from "./blog-ssr-client";
import { getSiteName } from "@/lib/site-name";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();
  return {
    title: `Blog — ${siteName}`,
    description: "Latest articles, guides, and news from BD71SHOP.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const posts = await fetchAllPosts();
  return <BlogSSR serverPosts={posts} />;
}
