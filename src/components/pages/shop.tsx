"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal, Grid3x3, List, ChevronDown, X, Home as HomeIcon, Star, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/product-card";
import { useRouter } from "@/lib/store";
import { products as hardcodedProducts, categories as hardcodedCategories, formatPrice, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "latest", label: "Sort by latest" },
  { value: "popular", label: "Sort by popularity" },
  { value: "rating", label: "Sort by average rating" },
  { value: "price-low", label: "Sort by price: low to high" },
  { value: "price-high", label: "Sort by price: high to low" },
];

export function ShopPage() {
  const navigate = useRouter((s) => s.navigate);
  const params = useRouter((s) => s.params);
  // Use products from the store (real DB data), fall back to hardcoded if empty
  const storeProducts = useRouter((s) => s.products);
  const storeCategories = useRouter((s) => s.categories);
  const products = storeProducts.length > 0 ? storeProducts : hardcodedProducts;
  const categories = storeCategories.length > 0 ? storeCategories : hardcodedCategories;
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || "all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.reviews - a.reviews); break;
      default: result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [selectedCategory, search, sortBy]);

  const currentCat = categories.find((c) => c.id === selectedCategory);

  const FilterSidebar = (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
            Categories
          </h3>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs text-cyber hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between",
              selectedCategory === "all"
                ? "bg-gradient-to-r from-neon to-cyber text-white font-medium shadow-neon"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <span>All Products</span>
            <span className="text-xs opacity-70">{products.length}</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between gap-2",
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-neon to-cyber text-white font-medium shadow-neon"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <span>{cat.emoji}</span>
                  {cat.name}
                </span>
                <span className="text-xs opacity-70 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      {/* Page header */}
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronDown className="h-3 w-3 -rotate-90" />
            <span className="text-foreground font-medium">Shop</span>
            {currentCat && (
              <>
                <ChevronDown className="h-3 w-3 -rotate-90" />
                <span className="text-cyber font-medium">{currentCat.name}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                {currentCat ? `${currentCat.emoji} ${currentCat.name}` : "🎮 All Products"}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} available
                {currentCat && <> · {currentCat.desc}</>}
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full bg-background border-border"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-card rounded-2xl border border-border/60 p-5">
              {FilterSidebar}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden rounded-full border-border"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filters
                </Button>
                <div className="hidden sm:flex items-center gap-1 bg-card rounded-full border border-border/60 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                      viewMode === "grid" ? "bg-gradient-to-r from-neon to-cyber text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                      viewMode === "list" ? "bg-gradient-to-r from-neon to-cyber text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted-foreground">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-9 py-2 rounded-full border border-border bg-card text-sm text-foreground font-medium cursor-pointer hover:bg-secondary transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border/60 p-12 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">No products found</h3>
                <p className="text-sm text-muted-foreground mb-4">Try a different search or category filter</p>
                <Button
                  onClick={() => { setSelectedCategory("all"); setSearch(""); }}
                  className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product, i) => (
                  <ProductListItem key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="absolute left-0 top-0 bottom-0 w-[300px] bg-card overflow-y-auto p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {FilterSidebar}
            <Button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full"
            >
              Show {filtered.length} Results
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ProductListItem({ product, index }: { product: Product; index: number }) {
  const navigate = useRouter((s) => s.navigate);
  const category = categories.find((c) => c.id === product.categoryId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => navigate("product", { productId: product.id })}
      className="group bg-card rounded-2xl border border-border/60 p-4 flex gap-4 hover:shadow-neon hover:border-neon/40 transition-all cursor-pointer"
    >
      <div className={`h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-5xl`}>
        {product.emoji}
      </div>
      <div className="flex-1 min-w-0">
        {category && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">{category.emoji}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyber">{category.name}</span>
          </div>
        )}
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-cyber transition-colors">{product.name}</h3>
        {product.reviews > 0 ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
        ) : (
          <Badge className="mt-1.5 bg-cyber/10 text-cyber border-0 text-[10px]">New</Badge>
        )}
        <div className="mt-2 flex items-center gap-2">
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">৳{formatPrice(product.oldPrice)}</span>
          )}
          <span className="font-display text-lg font-bold text-gradient-neon">৳{formatPrice(product.price)}</span>
        </div>
      </div>
    </motion.div>
  );
}
