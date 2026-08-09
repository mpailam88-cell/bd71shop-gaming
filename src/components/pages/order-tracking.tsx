"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, Search, Package, Check, Clock, Truck, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/lib/store";

export function OrderTrackingPage() {
  const navigate = useRouter((s) => s.navigate);
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber) setSearched(true);
  };

  const steps = [
    { icon: Check, label: "Order Placed", desc: "We received your order", date: "Mar 18, 2026 — 2:30 PM", done: true },
    { icon: Zap, label: "Payment Confirmed", desc: "Payment processed successfully", date: "Mar 18, 2026 — 2:31 PM", done: true },
    { icon: Package, label: "Code Prepared", desc: "Digital code generated", date: "Mar 18, 2026 — 2:33 PM", done: true },
    { icon: Truck, label: "Delivered", desc: "Code sent to your email", date: "Mar 18, 2026 — 2:35 PM", done: true },
  ];

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Order Tracking</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mt-3">
            Track Your Order
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Enter your order number to check the status of your digital delivery. Most orders are delivered instantly via email.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Search form */}
        <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="orderNumber" className="text-sm font-medium text-foreground">Order Number *</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="orderNumber"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. BD71729104"
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full text-base font-medium shadow-neon"
            >
              <Search className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </form>
        </div>

        {/* Result */}
        {searched && orderNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-border/60">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Order Number</div>
                <div className="font-display text-2xl font-bold text-gradient-neon">{orderNumber}</div>
              </div>
              <Badge className="bg-cyber/15 text-cyber border-0">
                <Check className="h-3 w-3 mr-1" /> Delivered
              </Badge>
            </div>

            <div className="mb-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Order Date</div>
                  <div className="font-medium text-foreground">March 18, 2026</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Product</div>
                  <div className="font-medium text-foreground">Free Fire Level Up Pass</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Payment Method</div>
                  <div className="font-medium text-foreground">bKash</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-medium text-gradient-neon font-display font-bold">৳175</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-5">Delivery Timeline</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex items-start gap-4"
                    >
                      <div className={`relative z-10 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${step.done ? "bg-gradient-to-br from-neon to-cyber text-white shadow-neon" : "bg-secondary text-muted-foreground"}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-semibold text-foreground">{step.label}</div>
                        <div className="text-sm text-muted-foreground">{step.desc}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {step.date}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/60 bg-gradient-to-br from-neon/5 to-cyber/5 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
              <p className="text-sm text-muted-foreground mb-3">
                ✅ Your digital code has been delivered to your email. If you haven&apos;t received it, please check your spam folder or contact us.
              </p>
              <Button
                onClick={() => navigate("contact")}
                variant="outline"
                className="rounded-full border-border hover:bg-secondary"
              >
                Contact Support
              </Button>
            </div>
          </motion.div>
        )}

        {!searched && (
          <div className="bg-card rounded-2xl border border-border/60 p-8 text-center">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">Enter your order number</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your order number can be found in your order confirmation email or in your account dashboard. Format: BD71XXXXXX
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
