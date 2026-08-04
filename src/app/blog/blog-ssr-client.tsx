"use client";

import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { BlogPage } from "@/components/pages/blog";

export function BlogSSR() {
  // Use direct setState — we're already on the right URL

  useMemo(() => {
    useRouter.setState({ page: "blog", params: {} } as any);
  }, []);

  return <BlogPage />;
}
