"use client";

import { useEffect } from "react";
import { useRouter, mapPost } from "@/lib/store";
import { BlogPage } from "@/components/pages/blog";

interface BlogSSRProps {
  serverPosts?: any[];
}

export function BlogSSR({ serverPosts }: BlogSSRProps) {
  // Map posts for the BlogPage component
  const mappedPosts = (serverPosts || []).map(mapPost);

  // Also inject into store for other components
  useEffect(() => {
    if (mappedPosts.length > 0 && useRouter.getState().blogPosts.length === 0) {
      useRouter.setState({ blogPosts: mappedPosts, dataLoaded: true });
    }
  }, [mappedPosts]);

  return <BlogPage serverPosts={mappedPosts} />;
}
