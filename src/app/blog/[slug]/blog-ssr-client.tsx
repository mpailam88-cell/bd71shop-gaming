"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/store";
import { BlogSinglePage } from "@/components/pages/blog-single";

// =====================================================
// Client wrapper — receives SSR post data and passes it
// DIRECTLY to BlogSinglePage as a prop (eliminates flash)
// AND injects it into the store for other consumers.
// =====================================================

export function BlogSingleSSR({ post }: { post: any }) {
  // Set router state + inject into store in useEffect (after paint).
  // The post is rendered via the prop, so no flash.
  useEffect(() => {
    if (!post) return;
    useRouter.setState({
      page: "blog-single",
      params: { blogSlug: post.slug, blogId: post.id },
    } as any);

    const current = useRouter.getState().blogPosts;
    const exists = current.find((p: any) => p.slug === post.slug);
    if (!exists) {
      useRouter.setState((s) => ({
        blogPosts: [...s.blogPosts, mapApiPost(post)] as any,
      }));
    }
  }, [post]);

  return <BlogSinglePage initialPost={post ? mapApiPost(post) : undefined} />;
}

function mapApiPost(p: any) {
  // Content can be a string (HTML) or already an array of sections.
  // Normalize to an array of { heading, body } sections for the
  // BlogSinglePage renderer.
  let contentSections: { heading: string; body: string }[] = [];
  if (typeof p.content === "string" && p.content) {
    // Split HTML content by h2/h3 headings into sections
    const html = p.content;
    const parts = html.split(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i += 2) {
        const heading = parts[i]?.replace(/<[^>]*>/g, "").trim() || "";
        const body = (parts[i + 1] || "").trim();
        if (heading || body) {
          contentSections.push({ heading, body });
        }
      }
    }
    if (contentSections.length === 0) {
      contentSections = [{ heading: "", body: html }];
    }
  } else if (Array.isArray(p.content)) {
    contentSections = p.content;
  }

  return {
    id: parseInt(String(p.id).replace(/-/g, "").slice(0, 8), 16) || Math.floor(Math.random() * 1e6),
    slug: p.slug,
    title: p.title ?? "Untitled",
    excerpt: p.excerpt ?? "",
    content: contentSections,
    image: p.featured_image ?? "",
    author: p.author ?? "BD71 Pet Shop",
    date: p.published_at ?? p.created_at ?? new Date().toISOString(),
    category: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags[0] : "General",
    readTime: p.read_time ?? 5,
    tags: p.tags ?? [],
  };
}
