"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Star, Plus, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useCart } from "@/lib/store";
import { formatPrice, getCategoryById, type Product } from "@/lib/data";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useRouter((s) => s.navigate);
  const addItem = useCart((s) => s.addItem);
  const category = getCategoryById(product.categoryId);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      gradient: product.gradient,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // FIX: use productSlug (not productId) so pageToUrl generates /product/[slug]
  const goToProduct = () => navigate("product", { productSlug: product.slug || String(product.id) });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={goToProduct}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-neon transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Product visual */}
      <div className={cn(
        "relative aspect-[5/4] bg-gradient-to-br overflow-hidden flex items-center justify-center",
        product.gradient
      )}>
        {product.tag && (
          <Badge
            className={cn(
              "absolute top-3 left-3 z-10 border-0 text-[10px] font-bold px-2.5 py-1",
              product.tag.startsWith("-")
                ? "bg-magenta text-white"
                : "bg-cyber text-foreground"
            )}
          >
            {product.tag}
          </Badge>
        )}

        {product.featured === "bestseller" && !product.tag && (
          <Badge className="absolute top-3 left-3 z-10 border-0 text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-neon to-magenta text-white">
            <Zap className="h-2.5 w-2.5 mr-1" fill="currentColor" />
            Best Seller
          </Badge>
        )}

        {/* Show real product image if available, otherwise fall back to emoji */}
        {product.featured_image ? (
          <img
            src={product.featured_image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // If image fails to load, hide it and show emoji fallback
              (e.target as HTMLImageElement).style.display = "none";
              const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        {/* Emoji fallback (shown if no image OR image fails to load) */}
        <motion.div
          animate={hover ? { scale: 1.1, rotate: 3 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "text-6xl sm:text-7xl drop-shadow-2xl select-none",
            product.featured_image ? "hidden" : ""
          )}
          aria-hidden="true"
        >
          {product.emoji}
        </motion.div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-neon/20 blur-2xl" />
        </div>

        {/* Quick view */}
        <div
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-300",
            hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 sm:flex sm:opacity-0 sm:translate-y-3"
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 p-0 rounded-full bg-card/90 backdrop-blur shadow-card border border-border/40 hover:bg-neon hover:text-white"
            aria-label="Quick view"
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {category && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs">{category.emoji}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyber">
              {category.name}
            </span>
          </div>
        )}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.reviews > 0 ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
        ) : (
          <div className="mt-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyber bg-cyber/10 px-2 py-0.5 rounded-full">
              New Arrival
            </span>
          </div>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-gradient-neon">
              ৳{formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            className={cn(
              "h-9 px-3 rounded-full text-xs font-medium transition-all shadow-neon",
              added
                ? "bg-cyber hover:bg-cyber text-foreground"
                : "bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white"
            )}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
