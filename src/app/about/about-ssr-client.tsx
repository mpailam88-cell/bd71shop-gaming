"use client";
import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { AboutPage } from "@/components/pages/about";

export function AboutSSR() {
  // Use direct setState — we're already on the right URL
  useMemo(() => { useRouter.setState({ page: "about", params: {} } as any); }, []);
  return <AboutPage />;
}
