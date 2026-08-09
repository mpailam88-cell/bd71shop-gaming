import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchAllPosts } from "@/lib/seo-fetchers";
import { stripSchemaMarkup } from "@/lib/clean-description";
import { BlogSingleSSR } from "./blog-ssr-client";
import { getSiteName } from "@/lib/site-name";

// =====================================================
// /blog/[slug] — Server-Rendered Blog Post (SEO)
// =====================================================
// Pre-renders all known blog posts at build time for instant
// page loads. New posts added after build = generated on first
// request via ISR, then cached for 60s.
// =====================================================

export const revalidate = false; // No ISR — on-demand revalidation only

// ===== Pre-render all blog post pages at build time =====
export async function generateStaticParams() {
  try {
    const posts = await fetchAllPosts();
    return posts.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteName] = await Promise.all([
    fetchPostBySlug(slug),
    getSiteName(),
  ]);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: true },
    };
  }

  const title = post.title ?? "Article";
  const description =
    post.excerpt ?? post.seo_description ?? post.meta_description ?? "";
  const image =
    post.featured_image ??
    (Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : null);
  const cleanDesc = stripSchemaMarkup(String(description))
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  return {
    title, // template adds "| SiteName" automatically
    description: cleanDesc,
    keywords: post.tags ?? [],
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description: cleanDesc,
      url: `/blog/${slug}`,
      type: "article",
      images: image ? [{ url: image, alt: title }] : [],
      publishedTime: post.published_at ?? post.created_at,
      authors: post.author ? [post.author] : ["BD71 Pet Shop"],
      tags: post.tags ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDesc,
      images: image ? [image] : [],
    },
    robots: {
      index: post.status !== "draft",
      follow: true,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = post.title ?? "Article";
  const image =
    post.featured_image ??
    (Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : null);
  const content = post.content ?? "";
  const cleanContent = stripSchemaMarkup(content).replace(/<[^>]*>/g, " ").trim();

  // ===== BlogPosting JSON-LD structured data =====
  const blogSchema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: (post.excerpt ?? cleanContent.slice(0, 160)) || undefined,
    image: image ? [image] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "BD71 Pet Shop" },
    publisher: {
      "@type": "Organization",
      name: "BD71 Pet Shop",
      logo: { "@type": "ImageObject", url: "/logo.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${slug}`,
    },
    keywords: (post.tags ?? []).join(", ") || undefined,
  };

  const cleanSchema = JSON.parse(JSON.stringify(blogSchema));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
      />

      <noscript>
        <article>
          <h1>{title}</h1>
          {post.author && <p>By {post.author}</p>}
          {post.published_at && (
            <p>Published: {new Date(post.published_at).toLocaleDateString()}</p>
          )}
          {image && <img src={image} alt={title} />}
          {cleanContent && <div>{cleanContent.slice(0, 2000)}</div>}
        </article>
      </noscript>

      <BlogSingleSSR post={post} />
    </>
  );
}
