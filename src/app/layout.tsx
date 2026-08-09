import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LayoutShell } from "@/components/site/layout-shell";
import { getSiteIntegrations } from "@/lib/site-integrations";
import { getSiteName, DEFAULT_SITE_NAME } from "@/lib/site-name";
import { generateOrganizationSchema, serializeSchema } from "@/lib/schema";
import { siteInfo } from "@/lib/data";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// No ISR — on-demand revalidation only
export const revalidate = false;

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();
  return {
    title: {
      default: `${siteName} — Digital Gaming Store Bangladesh`,
      template: `%s | ${siteName}`,
    },
    description: `Bangladesh's premier digital online game store. Instant delivery on gaming top-ups, gift cards, and digital services at ${siteName}.`,
    authors: [{ name: siteName }],
    openGraph: {
      title: `${siteName} — Digital Gaming Store Bangladesh`,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
    },
  };
}

// Inline script — loads site config from localStorage before React
const logoInitScript = `
(function(){
  try {
    var raw = localStorage.getItem('pn_site_config_v1');
    if (!raw) return;
    var config = JSON.parse(raw);
    window.__SITE_CONFIG__ = config;
    if (config.faviconUrl) {
      var link = document.querySelector("link[rel='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = config.faviconUrl;
      if (!link.parentNode) document.head.appendChild(link);
    }
  } catch(e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const integrations = await getSiteIntegrations();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon — server-rendered */}
        {integrations.faviconUrl && (
          <>
            <link rel="icon" href={integrations.faviconUrl} type="image/png" />
            <link rel="apple-touch-icon" href={integrations.faviconUrl} />
          </>
        )}
        {!integrations.faviconUrl && <link rel="icon" href="/favicon.ico" />}

        {/* Pre-load site config from localStorage */}
        <script dangerouslySetInnerHTML={{ __html: logoInitScript }} />

        {/* Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(generateOrganizationSchema(siteInfo)) }}
        />

        {/* Google Tag Manager */}
        {integrations.googleTagManagerId && (
          <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${integrations.googleTagManagerId}');` }} />
        )}

        {/* Google Analytics 4 */}
        {integrations.googleAnalyticsId && !integrations.googleTagManagerId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.googleAnalyticsId}');` }} />
          </>
        )}

        {/* Google AdSense */}
        {integrations.adsensePublisherId && (
          <>
            <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${integrations.adsensePublisherId}`} crossOrigin="anonymous" />
            <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle=window.adsbygoogle||[]).push({});` }} />
          </>
        )}

        {/* Facebook Pixel */}
        {integrations.facebookPixelId && (
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integrations.facebookPixelId}');fbq('track','PageView');` }} />
        )}

        {/* Custom header scripts */}
        {integrations.headerScripts && (
          <div dangerouslySetInnerHTML={{ __html: integrations.headerScripts }} />
        )}
      </head>
      <body className={`${poppins.variable} antialiased bg-background text-foreground font-sans`}>
        {/* GTM noscript */}
        {integrations.googleTagManagerId && (
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${integrations.googleTagManagerId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        )}

        <LayoutShell>{children}</LayoutShell>

        {/* Custom body scripts */}
        {integrations.bodyScripts && (
          <div dangerouslySetInnerHTML={{ __html: integrations.bodyScripts }} />
        )}

        <Toaster />
      </body>
    </html>
  );
}
