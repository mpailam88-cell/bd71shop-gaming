// =====================================================
// /ads.txt — Authoritative Digital Sellers
// =====================================================
// Served at https://bd71shop.com.bd/ads.txt
//
// This file declares authorized digital sellers for the
// site's ad inventory. Google AdSense crawls this file to
// verify that the publisher (pub-1743417934898311) is
// authorized to sell ad impressions on this domain.
//
// Format: <domain>, <publisher_id>, <relationship>, <tag_id>
//   - domain: google.com
//   - publisher_id: pub-1743417934898311
//   - relationship: DIRECT (we sell directly to Google)
//   - tag_id: f08c47fec0942fa0 (Google's authentication tag)
//
// Without this file, AdSense shows a "ads.txt file not found"
// warning in the dashboard and may stop serving ads.
// =====================================================

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const content = "google.com, pub-1743417934898311, DIRECT, f08c47fec0942fa0\n";
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
