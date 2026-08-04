import { getServerData } from "@/lib/server-data";
import { AppShell } from "@/components/site/app-shell";

// =====================================================
// Root page — Server Component
// =====================================================
// Pre-fetches all data on the Next.js server and passes it to
// the client AppShell via a global variable. This eliminates
// the loading flash — data is available instantly when the
// page loads.
//
// Uses ISR (revalidate=60) — page is cached for 60 seconds,
// then re-generated in the background.
// =====================================================

export const revalidate = false; // No ISR — on-demand revalidation only

export default async function Page() {
  // Fetch data on the server
  const serverData = await getServerData();

  // Pass to client via inline script (global variable)
  // The client store reads window.__INITIAL_DATA__ on mount
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
      <AppShell />
    </>
  );
}
