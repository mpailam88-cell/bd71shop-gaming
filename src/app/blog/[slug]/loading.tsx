// =====================================================
// Loading skeleton for /blog/[slug] route
// =====================================================
// Shown by Next.js App Router while the server component
// is fetching the blog post from the CMS API.
// =====================================================

export default function BlogLoading() {
  return (
    <div className="bg-gradient-to-b from-secondary/30 to-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          <div className="h-3 w-3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          <div className="h-3 w-3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        </div>

        {/* Cover image skeleton */}
        <div className="aspect-video rounded-3xl bg-gradient-to-br from-amber-glow/20 to-terracotta/10 animate-pulse mb-8" />

        {/* Title skeleton */}
        <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-4" />
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
