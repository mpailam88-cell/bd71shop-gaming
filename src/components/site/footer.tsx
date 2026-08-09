"use client";

import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Send, Zap, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";
import { useRouter, type PageId } from "@/lib/store";
import { siteInfo, categories } from "@/lib/data";

const trustBadges = [
  { icon: Truck, title: "Fast Delivery", desc: "For our all orders" },
  { icon: RefreshCw, title: "Instant Returns", desc: "If codes have problems" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
];

const popularGiftCards = ["google-play", "amazon", "apple", "razergold"];
const popularGames = ["free-fire", "pubg", "cod-mobile", "mobile-legends"];

export function SiteFooter() {
  const navigate = useRouter((s) => s.navigate);

  const goToCategory = (catId: string) => navigate("shop", { category: catId });
  const goToPage = (page: PageId) => navigate(page);

  return (
    <footer className="relative bg-card border-t border-border/60 mt-auto">
      {/* Trust badges strip */}
      <div className="border-b border-border/60 bg-background/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-neon/20 to-cyber/20 text-cyber flex items-center justify-center">
                  <badge.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{badge.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8">
        <div className="grid gap-10 lg:gap-8 lg:grid-cols-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <button
              onClick={() => goToPage("home")}
              className="inline-flex items-center gap-2.5 mb-5"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-neon to-cyber flex items-center justify-center shadow-neon">
                <Zap className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-foreground tracking-tight">
                  BD71<span className="text-gradient-neon">SHOP</span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.18em] text-cyber uppercase">
                  Global Gaming
                </span>
              </div>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              {siteInfo.aboutBlurb}
            </p>

            <div className="space-y-3">
              <a href={`tel:${siteInfo.phoneRaw}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyber transition-colors group">
                <div className="h-9 w-9 rounded-full bg-secondary group-hover:bg-neon group-hover:text-white text-foreground flex items-center justify-center transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                {siteInfo.phone}
              </a>
              <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyber transition-colors group">
                <div className="h-9 w-9 rounded-full bg-secondary group-hover:bg-neon group-hover:text-white text-foreground flex items-center justify-center transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                {siteInfo.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed">
                  {siteInfo.address}
                  <br />
                  <span className="text-muted-foreground">Nationwide digital delivery</span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="leading-relaxed">
                  Always Open (24/7)
                  <br />
                  <span className="text-muted-foreground">Online support anytime</span>
                </span>
              </div>
            </div>
          </div>

          {/* Popular Gift Cards */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cyber mb-4">
              Gift Cards
            </h3>
            <ul className="space-y-2.5">
              {popularGiftCards.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return (
                  <li key={catId}>
                    <button
                      onClick={() => goToCategory(catId)}
                      className="text-sm text-muted-foreground hover:text-cyber transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="h-px w-0 group-hover:w-3 bg-cyber transition-all" />
                      {cat?.name}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => goToPage("shop")}
                  className="text-sm text-neon hover:text-cyber font-medium transition-colors"
                >
                  View All →
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Games */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cyber mb-4">
              Games Top Up
            </h3>
            <ul className="space-y-2.5">
              {popularGames.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return (
                  <li key={catId}>
                    <button
                      onClick={() => goToCategory(catId)}
                      className="text-sm text-muted-foreground hover:text-cyber transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="h-px w-0 group-hover:w-3 bg-cyber transition-all" />
                      {cat?.name}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => goToPage("shop")}
                  className="text-sm text-neon hover:text-cyber font-medium transition-colors"
                >
                  View All →
                </button>
              </li>
            </ul>
          </div>

          {/* Important Pages */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cyber mb-4">
              Important Pages
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "About", page: "about" as PageId },
                { label: "Contact", page: "contact" as PageId },
                { label: "Order Tracking", page: "order-tracking" as PageId },
                { label: "My Account", page: "account" as PageId },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => goToPage(link.page)}
                    className="text-sm text-muted-foreground hover:text-cyber transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="h-px w-0 group-hover:w-3 bg-cyber transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cyber mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", page: "privacy" as PageId },
                { label: "DMCA Policy", page: "dmca" as PageId },
                { label: "Disclaimer", page: "disclaimer" as PageId },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => goToPage(link.page)}
                    className="text-sm text-muted-foreground hover:text-cyber transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="h-px w-0 group-hover:w-3 bg-cyber transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber mb-3">Follow Us</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="h-9 w-9 rounded-full bg-secondary hover:bg-neon hover:text-white text-foreground flex items-center justify-center transition-all hover:scale-110"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods strip */}
        <div className="border-t border-border/60 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">We Accept:</span>
            {["bKash", "Nagad", "Rocket", "VISA", "Mastercard", "COD"].map((method) => (
              <span
                key={method}
                className="text-xs font-medium text-foreground/80 bg-secondary px-3 py-1.5 rounded-md border border-border/60"
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-cyber" />
            <span>SSL Secured Checkout</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{siteInfo.copyright}</p>
          <p className="flex items-center gap-1.5">
            Powered by <span className="text-gradient-neon font-semibold">Cynlex Digital</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
