"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// =====================================================
// Turnstile Widget — Cloudflare bot protection
// =====================================================
// Loads the Turnstile script, renders the widget, and
// provides the token to the parent form via callback.
//
// Usage:
//   <TurnstileWidget onVerify={setToken} />
//   // Then include token in form submission:
//   // headers: { "x-turnstile-token": token }
// =====================================================

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms-lac-two.vercel.app";
const CMS_SITE_ID = process.env.NEXT_PUBLIC_CMS_SITE_ID ?? "lata-test";
const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY ?? "";

interface TurnstileConfig {
  turnstileEnabled: boolean;
  turnstileSiteKey: string;
}

let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => resolve(); // Don't block on script error
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const [config, setConfig] = useState<TurnstileConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Fetch config from CMS
  useEffect(() => {
    fetch(`${CMS_API}/api/v1/sites/${CMS_SITE_ID}/verify-turnstile`, {
      headers: { "X-API-Key": CMS_API_KEY },
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setConfig({
            turnstileEnabled: json.data.turnstileEnabled ?? false,
            turnstileSiteKey: json.data.turnstileSiteKey ?? "",
          });
        } else {
          setConfig({ turnstileEnabled: false, turnstileSiteKey: "" });
        }
      })
      .catch(() => {
        setConfig({ turnstileEnabled: false, turnstileSiteKey: "" });
      })
      .finally(() => setLoading(false));
  }, []);

  // Render widget when config is available
  useEffect(() => {
    if (!config?.turnstileEnabled || !config.turnstileSiteKey || !containerRef.current) return;

    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current) return;
      const turnstile = (window as any).turnstile;
      if (!turnstile) return;

      // Clear any existing widget
      if (widgetIdRef.current) {
        try { turnstile.remove(widgetIdRef.current); } catch {}
      }

      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: config.turnstileSiteKey,
        callback: (token: string) => onVerify(token),
        "expired-callback": () => onVerify(""),
        "error-callback": () => onVerify(""),
        theme: "light",
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current) {
        const turnstile = (window as any).turnstile;
        try { turnstile?.remove(widgetIdRef.current); } catch {}
      }
    };
  }, [config, onVerify]);

  if (loading) return null;
  if (!config?.turnstileEnabled) return null;

  return (
    <div className="my-3">
      <div ref={containerRef} />
    </div>
  );
}

// Hook: useTurnstile — returns { token, widget }
// Usage in forms:
//   const { token, widget } = useTurnstile();
//   // Add {widget} to your JSX
//   // Include token in fetch headers: "x-turnstile-token": token
export function useTurnstile() {
  const [token, setToken] = useState("");
  const onVerify = useCallback((t: string) => setToken(t), []);

  const widget = <TurnstileWidget onVerify={onVerify} />;

  return { token, widget };
}
