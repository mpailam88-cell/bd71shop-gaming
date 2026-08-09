"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, ChevronRight, Calendar, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/lib/store";
import { blogPosts as hardcodedBlogPosts } from "@/lib/data";
import { cn } from "@/lib/utils";

const categoriesList = ["All", "Gift Cards", "Amazon", "Apple", "Google Play", "Gaming", "Bangladesh", "Crypto", "Legal"];

interface BlogPageProps {
  serverPosts?: any[];
}

export function BlogPage({ serverPosts }: BlogPageProps = {}) {
  const navigate = useRouter((s) => s.navigate);
  const storeBlogPosts = useRouter((s) => s.blogPosts);
  const blogPosts = (serverPosts && serverPosts.length > 0) ? serverPosts : (storeBlogPosts.length > 0 ? storeBlogPosts : hardcodedBlogPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...blogPosts];
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, search]);

  const featured = blogPosts[0];

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Blog</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mt-3">
            Our Blogs
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Tips, guides, and news about gift cards, gaming top-ups, and digital services.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Featured */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("blog-single", { blogSlug: featured.slug || String(featured.id) })}
          className="group w-full bg-card rounded-3xl border border-border/60 overflow-hidden hover:shadow-neon transition-all mb-10 text-left"
        >
          <div className="grid lg:grid-cols-2">
            <div className={`relative h-64 lg:h-auto bg-gradient-to-br ${featured.gradient} flex items-center justify-center overflow-hidden`}>
              <span className="text-9xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">{featured.emoji}</span>
              <Badge className="absolute top-4 left-4 bg-card/90 text-foreground border-0 font-semibold">⭐ Featured</Badge>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-neon/15 text-neon border-0">{featured.category}</Badge>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {featured.date}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight group-hover:text-cyber transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyber group-hover:gap-2 transition-all">
                Read full article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </motion.button>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-card border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                  activeCategory === cat
                    ? "bg-gradient-to-r from-neon to-cyber text-white border-transparent shadow-neon"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/60 p-12 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">No articles found</h3>
            <p className="text-sm text-muted-foreground">Try a different search or category filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((post, i) => (
              <motion.button
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => navigate("blog-single", { blogSlug: post.slug || String(post.id) })}
                className="group bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-neon transition-all duration-300 hover:-translate-y-1 flex flex-col text-left"
              >
                <div className={`relative h-44 bg-gradient-to-br ${post.gradient} overflow-hidden flex items-center justify-center`}>
                  <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{post.emoji}</span>
                  <Badge className="absolute top-3 left-3 bg-card/90 text-foreground border-0 text-[11px] font-semibold">{post.category}</Badge>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-cyber transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                  <span className="mt-4 pt-4 border-t border-border/40 inline-flex items-center gap-1 text-sm font-medium text-cyber group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
