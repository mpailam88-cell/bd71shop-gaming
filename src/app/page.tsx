import { getServerData } from "@/lib/server-data";
import { HomePage } from "@/components/pages/home";
import { mapProduct, mapPost } from "@/lib/store";

// =====================================================
// Root page — Server Component
// =====================================================
// Fetches data on the server and passes it DIRECTLY to HomePage
// as props. This ensures the SSR HTML has real product data
// (with Supabase image URLs) instead of emoji fallbacks.
//
// Also injects window.__INITIAL_DATA__ for other components
// (header, footer, cart drawer) that read from the store.
// =====================================================

export const revalidate = 31536000;

export default async function Page() {
  const serverData = await getServerData();

  // Map products/posts to the format HomePage expects
  const products = (serverData.products || []).map(mapProduct);
  const blogPosts = (serverData.blogPosts || []).map(mapPost);
  const categories = serverData.categories || [];

  // Also inject into window.__INITIAL_DATA__ for the store
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
      <HomePage
        serverData={{ products, blogPosts, categories }}
      />
    </>
  );
}
