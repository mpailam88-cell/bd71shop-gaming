import { getServerData } from "@/lib/server-data";
import { AppShell } from "@/components/site/app-shell";

// =====================================================
// Root page — Server Component
// =====================================================
// Pre-fetches all data on the Next.js server and passes it to
// the client AppShell via TWO mechanisms:
//   1. serverData prop — available synchronously during SSR
//      so the first render has real product data (with images)
//   2. window.__INITIAL_DATA__ — for other pages that don't
//      receive the prop (ShopSSR, BlogSSR, etc.)
// =====================================================

export const revalidate = 60; // ISR — refresh every 60s

export default async function Page() {
  // Fetch data on the server
  const serverData = await getServerData();

  // Pass to client via inline script (global variable)
  const initialDataScript = (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__INITIAL_DATA__=${JSON.stringify(serverData).replace(/</g, "\\u003c")};`,
      }}
    />
  );

  return (
    <>
      {initialDataScript}
      <AppShell serverData={serverData} />
    </>
  );
}
