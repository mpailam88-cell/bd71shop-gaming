"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, CreditCard, Truck, MapPin, User, Lock, Check, ArrowRight, Banknote, Zap, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCart, useRouter } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CheckoutPage() {
  const navigate = useRouter((s) => s.navigate);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clearCart = useCart((s) => s.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad" | "card">("bkash");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber] = useState(() => `BD71${Math.floor(100000 + Math.random() * 900000)}`);

  const total = subtotal;

  if (items.length === 0 && !submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button onClick={() => navigate("shop")} className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full">
          Browse Products
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-b from-card/30 to-background min-h-screen flex items-center">
        <div className="mx-auto max-w-xl px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-card rounded-3xl border border-border/60 p-8 sm:p-10 text-center shadow-card"
          >
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-neon/20 to-cyber/20 text-cyber flex items-center justify-center mx-auto mb-5">
              <Check className="h-10 w-10" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-muted-foreground mb-5">
              Thank you for your order. Your digital codes will be delivered to your email within
              minutes. We&apos;ll contact you shortly to confirm.
            </p>
            <div className="bg-secondary/60 rounded-xl p-4 mb-6">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Order Number</div>
              <div className="font-display text-xl font-bold text-gradient-neon">{orderNumber}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="bg-secondary/40 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">Total Amount</div>
                <div className="font-display text-lg font-bold text-foreground">৳{formatPrice(total)}</div>
              </div>
              <div className="bg-secondary/40 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">Payment Method</div>
                <div className="font-semibold text-foreground text-sm mt-1">
                  {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "bkash" ? "bKash" : paymentMethod === "nagad" ? "Nagad" : "Card"}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => { clearCart(); navigate("home"); }}
                className="flex-1 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full"
              >
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => { clearCart(); navigate("shop"); }}
                className="flex-1 rounded-full border-border hover:bg-secondary"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
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
            <button onClick={() => navigate("cart")} className="hover:text-cyber">Cart</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mt-3">
            Checkout
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            window.scrollTo({ top: 0 });
          }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <div className="bg-card rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-neon/15 text-neon flex items-center justify-center">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Contact Information</h2>
                  <p className="text-xs text-muted-foreground">We&apos;ll use this to deliver your codes</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name *</Label>
                  <Input id="firstName" required placeholder="Rahim" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name *</Label>
                  <Input id="lastName" required placeholder="Uddin" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number *</Label>
                  <Input id="phone" required type="tel" placeholder="01XXXXXXXXX" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</Label>
                  <Input id="email" required type="email" placeholder="you@example.com" className="mt-1.5 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Player ID for gaming top-ups */}
            <div className="bg-card rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-cyber/15 text-cyber flex items-center justify-center">
                  <Zap className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Game Account Details</h2>
                  <p className="text-xs text-muted-foreground">Required for game top-up orders</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="playerId" className="text-sm font-medium text-foreground">Player ID</Label>
                  <Input id="playerId" placeholder="Your in-game Player ID" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="ign" className="text-sm font-medium text-foreground">In-Game Name (IGN)</Label>
                  <Input id="ign" placeholder="Optional" className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⚠️ For gift card orders, this field can be left blank. Codes will be sent to your email.
              </p>
            </div>

            {/* Payment method */}
            <div className="bg-card rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-magenta/15 text-magenta flex items-center justify-center">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Payment Method</h2>
                  <p className="text-xs text-muted-foreground">Choose how you want to pay</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "bkash" as const, label: "bKash", desc: "Mobile wallet payment", icon: CreditCard, badge: "Popular" },
                  { id: "nagad" as const, label: "Nagad", desc: "Mobile wallet payment", icon: CreditCard },
                  { id: "cod" as const, label: "Cash on Delivery", desc: "Pay when delivered", icon: Banknote },
                  { id: "card" as const, label: "Credit/Debit Card", desc: "VISA, Mastercard", icon: CreditCard },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      paymentMethod === method.id
                        ? "border-neon bg-neon/5"
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      paymentMethod === method.id ? "bg-gradient-to-r from-neon to-cyber text-white" : "bg-secondary text-foreground"
                    )}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.desc}</div>
                    </div>
                    {method.badge && (
                      <Badge className="bg-cyber/15 text-cyber border-0 text-[10px] absolute top-2 right-2">
                        {method.badge}
                      </Badge>
                    )}
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === method.id ? "border-neon bg-neon" : "border-border"
                    )}>
                      {paymentMethod === method.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod !== "cod" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-border/60"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="payNumber" className="text-sm font-medium text-foreground">
                        {paymentMethod === "card" ? "Card Number" : `${paymentMethod === "bkash" ? "bKash" : "Nagad"} Number`}
                      </Label>
                      <Input id="payNumber" placeholder={paymentMethod === "card" ? "0000 0000 0000 0000" : "01XXXXXXXXX"} className="mt-1.5 rounded-xl" />
                    </div>
                    {paymentMethod === "card" && (
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium text-foreground">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1.5 rounded-xl" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl border border-border/60 p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className={`relative h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl`}>
                      {item.emoji}
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-magenta text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground line-clamp-2">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">৳{formatPrice(item.price)} × {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-foreground text-sm">
                      ৳{formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-border/60 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">৳{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-cyber">FREE (Digital)</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Zap className="h-3 w-3" /> Delivery time</span>
                  <span>Instant (minutes)</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/60 mb-5">
                <span className="font-display text-base font-semibold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-gradient-neon">৳{formatPrice(total)}</span>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full text-base font-medium group shadow-neon"
              >
                <Lock className="h-4 w-4 mr-2" />
                Place Order
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                By placing your order, you agree to our{" "}
                <button type="button" onClick={() => navigate("disclaimer")} className="text-cyber hover:underline">Disclaimer</button>
                {" "}and{" "}
                <button type="button" onClick={() => navigate("privacy")} className="text-cyber hover:underline">Privacy Policy</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
