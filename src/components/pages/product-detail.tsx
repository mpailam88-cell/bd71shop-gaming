"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, ShoppingBag, Heart, Truck, ShieldCheck, RefreshCw, ChevronRight, ChevronDown,
  Minus, Plus, Home as HomeIcon, Check, Share2, Headphones, Zap, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useCart } from "@/lib/store";
import { getProductById, getRelatedProducts, getCategoryById, formatPrice } from "@/lib/data";
import { ProductCard } from "@/components/site/product-card";
import { cn } from "@/lib/utils";

export function ProductDetailPage() {
  const navigate = useRouter((s) => s.navigate);
  const params = useRouter((s) => s.params);
  const addItem = useCart((s) => s.addItem);
  const product = getProductById(params.productId || 1);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Product not found</h1>
        <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => navigate("shop")} className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full">
          Back to Shop
        </Button>
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  const category = getCategoryById(product.categoryId);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      gradient: product.gradient,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      gradient: product.gradient,
    }, quantity);
    navigate("checkout");
  };

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => navigate("shop")} className="hover:text-cyber">Shop</button>
            {category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <button onClick={() => navigate("shop", { category: category.id })} className="hover:text-cyber">
                  {category.name}
                </button>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "relative aspect-square rounded-3xl bg-gradient-to-br overflow-hidden flex items-center justify-center",
                product.gradient
              )}
            >
              {product.tag && (
                <Badge className="absolute top-4 left-4 z-10 border-0 text-xs font-bold px-3 py-1.5 bg-magenta text-white">
                  {product.tag}
                </Badge>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-card hover:scale-110 transition-transform"
                aria-label="Add to wishlist"
              >
                <Heart className={cn("h-5 w-5", wishlisted ? "fill-magenta text-magenta" : "text-muted-foreground")} />
              </button>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[180px] sm:text-[220px] drop-shadow-2xl select-none"
              >
                {product.emoji}
              </motion.div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-2 border-dashed border-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-neon/10 blur-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Product info */}
          <div>
            {category && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{category.emoji}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyber">
                  {category.name}
                </span>
              </div>
            )}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4 flex-wrap">
              {product.reviews > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-foreground/20"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              ) : (
                <Badge className="bg-cyber/15 text-cyber border-0">
                  <Check className="h-3 w-3 mr-1" /> New Arrival
                </Badge>
              )}
              <Badge className="bg-cyber/15 text-cyber border-0">
                <Check className="h-3 w-3 mr-1" /> In Stock
              </Badge>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-3xl sm:text-4xl font-bold text-gradient-neon">
                ৳{formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through mb-1">
                    ৳{formatPrice(product.oldPrice)}
                  </span>
                  <Badge className="bg-magenta text-white border-0 mb-2">
                    Save ৳{formatPrice(product.oldPrice - product.price)}
                  </Badge>
                </>
              )}
            </div>

            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Instant digital delivery for {product.name}. 100% genuine codes sourced from authorized
              distributors. Secure payment with bKash, Nagad, Rocket, or cards. 24/7 customer support.
            </p>

            {/* Quantity & actions */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-1 bg-card rounded-full border-2 border-border p-1.5 self-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-9 w-9 rounded-full bg-secondary hover:bg-neon hover:text-white text-foreground flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-base font-semibold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-9 w-9 rounded-full bg-secondary hover:bg-neon hover:text-white text-foreground flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-12 rounded-full text-sm font-medium transition-all shadow-neon",
                  added
                    ? "bg-cyber hover:bg-cyber text-foreground"
                    : "bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white"
                )}
              >
                {added ? (
                  <><Check className="h-4 w-4 mr-2" /> Added to Cart!</>
                ) : (
                  <><ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart</>
                )}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm font-medium"
              >
                <Zap className="h-4 w-4 mr-2" fill="currentColor" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border hover:bg-secondary"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { icon: Zap, label: "Instant Delivery", sub: "Within minutes" },
                { icon: ShieldCheck, label: "100% Authentic", sub: "Genuine codes" },
                { icon: RefreshCw, label: "Easy Returns", sub: "If codes fail" },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl border border-border/60 p-3 text-center">
                  <item.icon className="h-5 w-5 text-cyber mx-auto mb-1.5" />
                  <div className="text-xs font-semibold text-foreground">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="border-b border-border/60 flex gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: "description" as const, label: "Description" },
              { id: "reviews" as const, label: `Reviews (${product.reviews})` },
              { id: "shipping" as const, label: "Delivery & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 sm:px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id ? "text-cyber" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeProductTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon to-cyber rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p className="text-foreground/80 leading-relaxed text-base">
                  <span className="font-semibold text-foreground">{product.name}</span>
                  {category && <> — part of our <span className="text-cyber font-medium">{category.name}</span> category.</>}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  BD71SHOP is Bangladesh&apos;s trusted online digital products store. We source all
                  codes directly from authorized distributors to ensure 100% authenticity. This
                  product is delivered instantly to your email after payment confirmation.
                </p>
                <div className="bg-card rounded-2xl p-5 mt-4 border border-border/60">
                  <h3 className="font-display text-base font-semibold text-foreground mb-3">Product Details</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {category && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Product ID:</span>
                      <span className="font-medium text-foreground font-mono text-xs">#{product.id.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span className="font-medium text-cyber">Instant (Email)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="font-medium text-foreground">As specified</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                  For more info, contact us at{" "}
                  <a href="mailto:admin@bd71shop.com" className="text-cyber hover:underline">admin@bd71shop.com</a>{" "}
                  or call <a href="tel:+8801748287630" className="text-cyber hover:underline">+880 1748-287630</a>.
                </p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                {product.reviews > 0 ? (
                  <>
                    <div className="bg-card rounded-2xl border border-border/60 p-5 flex flex-col sm:flex-row gap-6 items-center">
                      <div className="text-center">
                        <div className="font-display text-5xl font-bold text-gradient-neon">{product.rating}</div>
                        <div className="flex items-center gap-0.5 my-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("h-4 w-4", s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-foreground/20")} />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">{product.reviews} reviews</div>
                      </div>
                      <div className="flex-1 w-full space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const pct = star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 3 : star === 2 ? 1 : 1;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="w-3 text-muted-foreground">{star}</span>
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-neon to-cyber rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Individual review details are loaded from customer feedback.
                    </p>
                  </>
                ) : (
                  <div className="bg-card rounded-2xl border border-border/60 p-8 text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="max-w-3xl space-y-4">
                <div className="bg-card rounded-2xl border border-border/60 p-5">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-neon mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">Instant Digital Delivery</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All digital codes and top-ups are delivered instantly to your email within
                        minutes of payment confirmation, 24/7. No physical shipping required.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border/60 p-5">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-cyber mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">Instant Returns Policy</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        If codes have problems, we offer instant returns and replacements. Contact us
                        within 24 hours of delivery with proof of the issue for a full refund or
                        replacement.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border/60 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-magenta mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">100% Secure Payment</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All transactions processed through secure SSL-encrypted gateways. We accept
                        bKash, Nagad, Rocket, VISA, Mastercard, and Cash on Delivery (where
                        applicable).
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border/60 p-5">
                  <div className="flex items-start gap-3">
                    <Headphones className="h-5 w-5 text-cyber mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">24/7 Customer Support</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Our dedicated support team is available 24/7 to assist with orders, refunds,
                        and any technical issues. Contact us at admin@bd71shop.com or +880 1748-287630.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
