"use client";

import { motion } from "framer-motion";
import { Home, Search, PawPrint, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/store";

export function NotFoundPage() {
  const navigate = useRouter((s) => s.navigate);

  return (
    <div className="bg-gradient-to-b from-secondary/30 to-background min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative inline-block mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[140px] sm:text-[180px] leading-none"
          >
            🐾
          </motion.div>
          <div className="absolute -top-2 -right-4 h-12 w-12 rounded-full bg-amber-glow flex items-center justify-center text-cocoa font-display font-bold text-xl rotate-12 shadow-warm">
            ?
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="font-display text-6xl sm:text-7xl font-semibold text-cocoa tracking-tight">
            404
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-cocoa mt-3 mb-3">
            Oops! Page not found
          </h2>
          <p className="text-base sm:text-lg text-cocoa/70 max-w-md mx-auto mb-8">
            Looks like this page chased a squirrel and got lost. Let&apos;s get you back to safer
            ground — your furry friend is waiting!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("home")}
              className="bg-terracotta hover:bg-terracotta/90 text-primary-foreground rounded-full px-7 group"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("shop")}
              className="rounded-full border-2 border-cocoa/15 hover:bg-secondary px-7"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-border/40">
            <p className="text-xs text-cocoa/50 uppercase tracking-wider mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: "Shop", page: "shop" as const },
                { label: "Categories", page: "shop" as const },
                { label: "Blog", page: "blog" as const },
                { label: "About", page: "about" as const },
                { label: "Contact", page: "contact" as const },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.page)}
                  className="text-sm px-4 py-2 rounded-full bg-card border border-border/60 text-cocoa/70 hover:text-terracotta hover:border-terracotta/40 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
