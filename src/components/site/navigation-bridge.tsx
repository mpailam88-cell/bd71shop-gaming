"use client";

import { useEffect, useRef } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { setNavigationAdapter } from "@/lib/store";

// =====================================================
// NavigationBridge — connects Next.js App Router to the
// Zustand store's navigate() function.
// =====================================================
//
// Also prefetches the target route BEFORE navigating, so the
// new page's RSC payload is already in flight (or cached)
// by the time the user clicks. This eliminates the perceived
// "load → URL change → load again" pattern that happens when
// router.push() has to wait for the RSC fetch.
//
// Prefetch strategy:
//   - On mouseenter of any element with [data-prefetch] or
//     an <a> tag, prefetch the href.
//   - This is automatic and passive — no user action needed.
// =====================================================

export function NavigationBridge() {
  const router = useNextRouter();
  const prefetched = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Register the adapter — store.navigate() will call this.
    // We use router.push which triggers Next.js client-side
    // navigation (no full page reload).
    setNavigationAdapter((url: string) => {
      router.push(url);
    });

    // Cleanup on unmount (safety — should never unmount in practice)
    return () => {
      setNavigationAdapter(null);
    };
  }, [router]);

  // ===== Prefetch on hover =====
  // When the user hovers over a link or any element with a
  // data-prefetch attribute, prefetch that route. This way,
  // by the time they click, the RSC payload is already cached
  // and navigation is instant.
  useEffect(() => {
    function handleMouseOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-prefetch], a[href]") as HTMLElement | null;
      if (!target) return;

      let href: string | null = null;
      if (target.tagName === "A") {
        href = target.getAttribute("href");
      } else {
        href = target.getAttribute("data-prefetch");
      }

      if (!href || !href.startsWith("/")) return;
      if (prefetched.current.has(href)) return;

      // Mark as prefetched so we don't prefetch twice
      prefetched.current.add(href);
      try {
        router.prefetch(href);
      } catch {
        // Prefetch can fail silently — non-critical
      }
    }

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [router]);

  return null;
}
