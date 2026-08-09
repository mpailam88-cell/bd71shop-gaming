"use client";

import { motion } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, Heart, Zap, Truck, ShieldCheck, Users, Award, Target, Eye, Sparkles, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/store";
import { aboutContent, siteInfo } from "@/lib/data";

export function AboutPage() {
  const navigate = useRouter((s) => s.navigate);

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">About</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-grid">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-neon/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyber/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-neon/10 border border-neon/30 px-4 py-1.5 text-sm font-medium text-cyber mb-5">
                <Heart className="h-4 w-4 text-neon" />
                {aboutContent.heroTitle}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight text-balance">
                {aboutContent.heroSubtitle}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
                {aboutContent.intro}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("shop")}
                  className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full px-7 group shadow-neon"
                >
                  <Zap className="h-4 w-4 mr-2" fill="currentColor" />
                  Explore Products
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("contact")}
                  className="rounded-full border-border hover:bg-secondary px-7"
                >
                  Get in Touch
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[380px] sm:h-[440px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] rounded-full bg-gradient-to-br from-neon/30 to-cyber/20 shadow-neon" />
                <div className="absolute h-[240px] w-[240px] sm:h-[300px] sm:w-[300px] rounded-full border-2 border-dashed border-neon/30 animate-[spin_60s_linear_infinite]" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] sm:text-[180px] drop-shadow-2xl"
              >
                🎮
              </motion.div>
              {[
                { emoji: "💎", pos: "top-4 right-4", delay: 0.5 },
                { emoji: "▶️", pos: "bottom-4 left-4", delay: 0.8 },
                { emoji: "🔥", pos: "bottom-12 right-2", delay: 1.2 },
                { emoji: "📦", pos: "top-12 left-2", delay: 1.5 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: item.delay }}
                  className={`absolute ${item.pos}`}
                >
                  <div className="bg-card rounded-2xl p-3 shadow-card border border-border/40">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutContent.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border/60 p-5 text-center"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-neon">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyber mb-3">
              Our Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              What we offer
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {aboutContent.services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border/60 p-6 flex gap-4 hover:shadow-neon transition-shadow"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-neon/20 to-cyber/20 text-cyber flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-card/40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyber mb-3">
              Why BD71SHOP
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
              Why customers choose us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aboutContent.whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border/60 p-6 hover:shadow-neon transition-shadow"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon/15 to-cyber/15 text-cyber mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neon via-magenta to-cyber p-8 sm:p-12 text-center shadow-neon"
          >
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Ready to level up your gaming?
              </h2>
              <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl mx-auto text-pretty">
                Join thousands of happy customers across Bangladesh. Instant delivery, secure payment,
                and 24/7 support on every order.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate("shop")}
                  className="bg-white text-foreground hover:bg-white/90 rounded-full px-7 font-semibold"
                >
                  Start Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("contact")}
                  className="bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20 rounded-full px-7"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
