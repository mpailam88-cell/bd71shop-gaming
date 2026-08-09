"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Plus, Minus, Trash2, ArrowRight, Home as HomeIcon, ChevronRight, Tag, Zap, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, useRouter } from "@/lib/store";
import { formatPrice, products } from "@/lib/data";
import { ProductCard } from "@/components/site/product-card";

export function CartPage() {
  const navigate = useRouter((s) => s.navigate);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const subtotal = useCart((s) => s.subtotal());

  // Digital products: free delivery
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const recommended = products.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
        <div className="bg-card border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
                <HomeIcon className="h-3 w-3" /> Home
              </button>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">Cart</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mt-3">
              Shopping Cart
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="h-32 w-32 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center text-6xl"
          >
            🛒
          </motion.div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Add some gaming top-ups, gift cards, or digital services. Instant delivery on every order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("shop")}
              className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full px-7 shadow-neon"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("home")}
              className="rounded-full border-border hover:bg-secondary px-7"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Cart</span>
          </nav>
          <div className="flex items-center justify-between mt-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl border border-border/60 p-4 flex gap-4"
                >
                  <button
                    onClick={() => navigate("product", { productId: item.id })}
                    className={`h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-5xl hover:scale-105 transition-transform`}
                  >
                    {item.emoji}
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate("product", { productId: item.id })}
                      className="font-semibold text-foreground line-clamp-2 leading-snug text-left hover:text-cyber transition-colors"
                    >
                      {item.name}
                    </button>
                    <div className="mt-1 text-xs text-muted-foreground">Unit price: ৳{formatPrice(item.price)}</div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 bg-secondary rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-full bg-card hover:bg-neon hover:text-white text-foreground flex items-center justify-center transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-full bg-card hover:bg-neon hover:text-white text-foreground flex items-center justify-center transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-gradient-neon">
                          ৳{formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 mt-0.5"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={() => navigate("shop")}
              className="text-sm text-cyber hover:underline inline-flex items-center gap-1 mt-2"
            >
              <Plus className="h-3.5 w-3.5" /> Add more items
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl border border-border/60 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm text-foreground"
                    />
                  </div>
                  <Button variant="outline" className="rounded-full border-border hover:bg-secondary">
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-2.5 py-4 border-t border-border/60">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-foreground">৳{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span className="font-medium text-cyber">FREE (Digital)</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/60 mb-5">
                <span className="font-display text-base font-semibold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-gradient-neon">৳{formatPrice(total)}</span>
              </div>

              <Button
                onClick={() => navigate("checkout")}
                className="w-full h-12 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full text-base font-medium group shadow-neon"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("shop")}
                className="w-full mt-2 rounded-full border-border hover:bg-secondary"
              >
                Continue Shopping
              </Button>

              <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-cyber" /> Secure</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Zap className="h-3 w-3 text-neon" /> Instant</span>
                <span>·</span>
                <span>💳 COD available</span>
              </div>
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
