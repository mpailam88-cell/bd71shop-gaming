// =====================================================
// Loading skeleton for /product/[slug] route
// =====================================================
// Shown by Next.js App Router while the server component
// is fetching the product from the CMS API.
//
// Without this, the user sees a blank screen during the
// fetch (which takes 200-2000ms depending on cache state).
//
// The skeleton mimics the product page layout so the user
// perceives an instant page load — the actual content
// swaps in seamlessly when the SSR data arrives.
// =====================================================

export default function ProductLoading() {
  return (
    <div className="bg-gradient-to-b from-secondary/30 to-background min-h-screen">
      {/* Breadcrumb skeleton */}
      <div className="bg-card border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            <div className="h-3 w-3 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-3 w-3 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-glow/20 to-terracotta/10 animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-8 w-28 bg-muted rounded animate-pulse" />
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-12 w-32 bg-muted rounded-full animate-pulse" />
              <div className="h-12 w-32 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
