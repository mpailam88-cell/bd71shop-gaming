"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Menu, X, Phone, ChevronDown, User, Zap, Package, Truck, Home as HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter, useCart, type PageId } from "@/lib/store";
import { siteInfo, categories } from "@/lib/data";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Games Top Up",
    page: "shop" as PageId,
    items: categories
      .filter((c) => c.group === "topup")
      .map((c) => ({ label: c.name, categoryId: c.id })),
  },
  {
    label: "Gift Cards",
    page: "shop" as PageId,
    items: categories
      .filter((c) => c.group === "giftcard")
      .map((c) => ({ label: c.name, categoryId: c.id })),
  },
  {
    label: "Digital Wallets",
    page: "shop" as PageId,
    items: categories
      .filter((c) => c.group === "digital")
      .map((c) => ({ label: c.name, categoryId: c.id })),
  },
];

const topNav: { label: string; page: PageId }[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Shop", page: "shop" },
  { label: "Our Blogs", page: "blog" },
  { label: "Order Tracking", page: "order-tracking" },
  { label: "Contact", page: "contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useRouter((s) => s.navigate);
  const cartCount = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (page: PageId, params?: Record<string, unknown>) => {
    navigate(page, params as never);
    setMobileOpen(false);
    setOpenMenu(null);
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-neon via-magenta to-cyber text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-center gap-2 sm:gap-6 text-center">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-medium">
            <Phone className="h-3 w-3" />
            <span>{siteInfo.phone}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Zap className="h-3 w-3" />
            <span>Instant Delivery • 100% Secure Payment • 24/7 Support</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <span className="font-semibold">⚡</span>
            <span>Cash on Delivery Available</span>
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-background/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-border/60"
            : "bg-background/60 backdrop-blur-md border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => goTo("home")}
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="BD71SHOP home"
            >
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-neon to-cyber flex items-center justify-center shadow-neon transition-transform group-hover:scale-105">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-magenta ring-2 ring-background animate-pulse-glow" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  BD71<span className="text-gradient-neon">SHOP</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.18em] text-cyber uppercase">
                  Global Gaming
                </span>
              </div>
            </button>

            {/* Top nav (desktop) */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {topNav.map((link) => (
                <button
                  key={link.label}
                  onClick={() => goTo(link.page)}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-cyber transition-colors rounded-lg hover:bg-secondary/60"
                >
                  {link.label}
                </button>
              ))}
              {/* Mega menus */}
              {navGroups.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    onClick={() => goTo(group.page)}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-cyber transition-colors flex items-center gap-1 rounded-lg hover:bg-secondary/60"
                  >
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {openMenu === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 pt-2 w-[340px]"
                      >
                        <div className="bg-card rounded-2xl shadow-card border border-border/60 p-2 grid grid-cols-2 gap-1">
                          {group.items.map((item) => {
                            const cat = categories.find((c) => c.id === item.categoryId);
                            return (
                              <button
                                key={item.categoryId}
                                onClick={() => goTo("shop", { category: item.categoryId })}
                                className="px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors group/item text-left flex items-center gap-2"
                              >
                                <span className="text-lg">{cat?.emoji}</span>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-foreground group-hover/item:text-cyber transition-colors truncate">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground truncate">
                                    {cat?.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-10 w-10 rounded-full text-foreground hover:bg-secondary/80"
                aria-label="Search"
                onClick={() => goTo("shop")}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-10 w-10 rounded-full text-foreground hover:bg-secondary/80"
                aria-label="Account"
                onClick={() => goTo("account")}
              >
                <User className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setOpen(true)}
                className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-neon to-cyber text-white hover:scale-105 transition-transform flex items-center justify-center shadow-neon"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-magenta text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-10 w-10 rounded-full text-foreground hover:bg-secondary/80"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 bg-card">
                  <SheetHeader className="p-5 border-b border-border/60">
                    <SheetTitle className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-neon to-cyber flex items-center justify-center shadow-neon">
                        <Zap className="h-5 w-5 text-white" fill="currentColor" />
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="font-display text-base font-bold text-foreground">
                          BD71<span className="text-gradient-neon">SHOP</span>
                        </span>
                        <span className="text-[9px] font-medium tracking-[0.18em] text-cyber uppercase">
                          Global Gaming
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-3 overflow-y-auto max-h-[70vh] no-scrollbar">
                    {topNav.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => goTo(link.page)}
                        className="px-4 py-3 text-left text-base font-medium text-foreground/90 hover:bg-secondary/60 hover:text-cyber rounded-xl transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                    <div className="my-3 h-px bg-border/60" />
                    {navGroups.map((group) => (
                      <div key={group.label}>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {group.label}
                        </div>
                        {group.items.map((item) => {
                          const cat = categories.find((c) => c.id === item.categoryId);
                          return (
                            <button
                              key={item.categoryId}
                              onClick={() => goTo("shop", { category: item.categoryId })}
                              className="w-full px-4 py-2.5 text-left text-sm text-foreground/80 hover:text-cyber rounded-xl hover:bg-secondary/60 transition-colors flex items-center gap-2"
                            >
                              <span>{cat?.emoji}</span>
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
