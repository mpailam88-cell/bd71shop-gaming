"use client";

// =====================================================
// /not-found — Next.js built-in 404 page
// =====================================================
// Next.js App Router automatically renders this component
// whenever:
//   1. A route doesn't match any file in /app
//   2. A server component calls notFound()
//   3. A page returns a 404 status
//
// The middleware (src/middleware.ts) rewrites unknown URLs
// to "/" so the SPA can handle them — but if the SPA's
// router also can't find a matching page, this 404 page
// is shown.
//
// For SEO: this page returns HTTP 404 (Next.js does this
// automatically when not-found.tsx is rendered). This tells
// Google to de-index the URL instead of keeping it as a
// soft-404.
//
// This is a client component because NotFoundPage uses the
// useRouter hook from the Zustand store for navigation.
// =====================================================

import { NotFoundPage } from "@/components/pages/not-found";

export default function NotFound() {
  return <NotFoundPage />;
}
