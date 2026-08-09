"use client";

import { motion } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, Calendar, ArrowLeft, ArrowRight, Share2, Bookmark, Facebook, Twitter, Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/lib/store";
import { getBlogById, blogPosts } from "@/lib/data";

export function BlogSinglePage() {
  const navigate = useRouter((s) => s.navigate);
  const params = useRouter((s) => s.params);
  const post = getBlogById(params.blogId || 1);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Article not found</h1>
        <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => navigate("blog")} className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full">
          Back to Blog
        </Button>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  if (related.length < 3) {
    const others = blogPosts.filter((p) => p.id !== post.id && p.category !== post.category).slice(0, 3 - related.length);
    related.push(...others);
  }

  const nextPost = blogPosts.find((p) => p.id > post.id) || blogPosts[0];

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => navigate("blog")} className="hover:text-cyber">Blog</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium line-clamp-1">{post.category}</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Badge className="bg-neon/15 text-neon border-0 mb-4">{post.category}</Badge>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight text-balance">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon to-cyber text-white flex items-center justify-center font-semibold text-xs">
                B
              </div>
              <span className="font-medium text-foreground">BD71SHOP</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {post.date}
            </span>
          </div>
        </motion.header>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br ${post.gradient} rounded-3xl overflow-hidden flex items-center justify-center mb-8`}
        >
          <span className="text-[160px] sm:text-[200px] drop-shadow-2xl select-none">{post.emoji}</span>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 right-6 h-32 w-32 rounded-full border-2 border-dashed border-foreground/20" />
            <div className="absolute bottom-6 left-6 h-20 w-20 rounded-full border-2 border-dashed border-foreground/15" />
          </div>
        </motion.div>

        {/* Share bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Share:</span>
            {[Facebook, Twitter, Link2].map((Icon, i) => (
              <button
                key={i}
                className="h-9 w-9 rounded-full bg-secondary hover:bg-gradient-to-r hover:from-neon hover:to-cyber hover:text-white text-foreground flex items-center justify-center transition-colors"
                aria-label="Share"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <button className="h-9 w-9 rounded-full bg-secondary hover:bg-gradient-to-r hover:from-neon hover:to-cyber hover:text-white text-foreground flex items-center justify-center transition-colors" aria-label="Bookmark">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-medium mb-6 first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-gradient-neon first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            {post.excerpt}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
            In this comprehensive guide, we explore everything you need to know about this topic. Whether
            you&apos;re a first-time buyer or an experienced user, you&apos;ll find valuable insights and
            practical tips to help you make the most of your purchase.
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-8 mb-4">
            Key Things to Know
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
            Understanding the fundamentals is crucial before making any purchase. Here are the most
            important considerations to keep in mind, especially when buying from online platforms
            like BD71SHOP that specialize in digital products and gift cards.
          </p>
          <ul className="space-y-3 my-6">
            {[
              "Always verify the region compatibility of digital codes before purchasing — some products only work in specific geographic regions.",
              "Check the expiration date and terms of use for gift cards, as policies vary by issuer and region.",
              "Use secure payment methods like bKash, Nagad, or credit cards through SSL-encrypted checkout for maximum protection.",
              "Keep your order confirmation and receipt — you may need it for customer support or refund requests.",
              "For gaming top-ups, double-check your Player ID and game account details before completing the order to avoid delivery issues.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/80">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-neon/15 to-cyber/15 text-cyber flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-8 mb-4">
            Why Choose BD71SHOP
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
            BD71SHOP is Bangladesh&apos;s trusted online digital products store, offering the best prices
            on gaming top-ups, gift cards, and digital services. We specialize in instant delivery and
            secure payment systems for popular games. Our 24/7 customer support team is always ready
            to assist with any questions or concerns.
          </p>
          <div className="bg-card rounded-2xl border border-border/60 p-6 my-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Quick Summary</h3>
            <ul className="space-y-2">
              {[
                "Instant digital delivery within minutes",
                "100% genuine codes from authorized distributors",
                "Secure payment via bKash, Nagad, Rocket, and cards",
                "24/7 customer support and instant returns",
                "Best prices in Bangladesh on all products",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="text-cyber">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            For more information or to browse our full catalog of products, visit our shop. If you have
            any questions, feel free to contact us at admin@bd71shop.com or call +880 1748-287630.
          </p>
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground/70">Tags:</span>
            {[post.category, "BD71SHOP", "Bangladesh", "Digital"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate("blog")}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-gradient-to-r hover:from-neon hover:to-cyber hover:text-white text-foreground/70 transition-colors"
              >
                #{tag.replace(/\s+/g, "")}
              </button>
            ))}
          </div>
        </div>

        {/* Author box */}
        <div className="mt-8 bg-card rounded-2xl border border-border/60 p-6 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neon to-cyber text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
            B
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-foreground">BD71SHOP</div>
            <div className="text-xs text-muted-foreground mb-2">Digital products expert</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BD71SHOP is Bangladesh&apos;s trusted online digital products store, offering the best prices
              on gaming top-ups, gift cards, and digital services. Follow our blog for weekly tips and guides.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("blog")}
            className="rounded-full border-border hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Articles
          </Button>
          <Button
            onClick={() => navigate("blog-single", { blogId: nextPost.id })}
            className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full"
          >
            Next Article
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-background to-card/40">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
              You might also enjoy
            </h2>
            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {related.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => navigate("blog-single", { blogId: p.id })}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-neon transition-all duration-300 hover:-translate-y-1 flex flex-col text-left"
                >
                  <div className={`relative h-44 bg-gradient-to-br ${p.gradient} flex items-center justify-center overflow-hidden`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{p.emoji}</span>
                    <Badge className="absolute top-3 left-3 bg-card/90 text-foreground border-0 text-[10px]">{p.category}</Badge>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-muted-foreground mb-2">{p.date}</div>
                    <h3 className="font-display text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-cyber transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{p.excerpt}</p>
                    <span className="mt-3 text-sm font-medium text-cyber inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
