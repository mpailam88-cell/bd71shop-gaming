"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, User, Lock, Mail, Eye, EyeOff, Zap, Package, Heart, LogOut, Settings, ShoppingBag, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/lib/store";
import { products, formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AccountPage() {
  const navigate = useRouter((s) => s.navigate);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "settings">("orders");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  const orders = [
    { id: "BD71729104", date: "Mar 18, 2026", status: "Delivered", total: 175, items: 1, type: "Free Fire Level Up Pass" },
    { id: "BD71728471", date: "Mar 10, 2026", status: "Delivered", total: 7999, items: 1, type: "Free Fire 11200 Diamonds" },
    { id: "BD71726104", date: "Feb 28, 2026", status: "Delivered", total: 2549, items: 1, type: "Google Play Gift Card 25 USD" },
  ];
  const wishlist = products.slice(2, 5);

  if (loggedIn) {
    return (
      <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
        <div className="bg-card border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
                <HomeIcon className="h-3 w-3" /> Home
              </button>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">My Account</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/60 p-5 sticky top-28">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/60">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon to-cyber text-white flex items-center justify-center font-display font-bold text-lg">
                    {form.name?.[0]?.toUpperCase() || "R"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{form.name || "Rahim Uddin"}</div>
                    <div className="text-xs text-muted-foreground truncate">{form.email || "rahim@example.com"}</div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "orders" as const, label: "My Orders", icon: Package },
                    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
                    { id: "settings" as const, label: "Settings", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-gradient-to-r from-neon to-cyber text-white shadow-neon"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-border/60">
                  <button
                    onClick={() => { setLoggedIn(false); navigate("home"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-5">My Orders</h1>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-card rounded-2xl border border-border/60 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="font-display text-lg font-semibold text-foreground">#{order.id}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.type}</div>
                            </div>
                            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyber/15 text-cyber">
                              ✓ {order.status}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border/40">
                            <div className="text-sm text-muted-foreground">{order.items} item</div>
                            <div className="font-display text-lg font-bold text-gradient-neon">৳{formatPrice(order.total)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "wishlist" && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-5">My Wishlist</h1>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {wishlist.map((p) => (
                        <div key={p.id} className="bg-card rounded-2xl border border-border/60 p-4 flex gap-4">
                          <button
                            onClick={() => navigate("product", { productId: p.id })}
                            className={`h-20 w-20 shrink-0 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-4xl`}
                          >
                            {p.emoji}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{p.name}</h3>
                            <div className="font-display text-base font-bold text-gradient-neon mt-1">৳{formatPrice(p.price)}</div>
                            <Button
                              size="sm"
                              onClick={() => navigate("product", { productId: p.id })}
                              className="mt-2 h-8 rounded-full bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white text-xs"
                            >
                              View Product
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-5">Account Settings</h1>
                    <div className="bg-card rounded-2xl border border-border/60 p-6 space-y-5">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Full Name</Label>
                        <Input defaultValue="Rahim Uddin" className="mt-1.5 rounded-xl" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-foreground">Email</Label>
                          <Input defaultValue="rahim@example.com" className="mt-1.5 rounded-xl" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground">Phone</Label>
                          <Input defaultValue="01627-001719" className="mt-1.5 rounded-xl" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border/60">
                        <Button className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{mode === "login" ? "Login" : "Register"}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-card"
        >
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-neon to-cyber text-white items-center justify-center mb-3 shadow-neon">
              <Zap className="h-7 w-7" fill="currentColor" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Sign in to access your orders and wishlist"
                : "Join BD71SHOP for exclusive deals & instant delivery"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex p-1 rounded-full bg-secondary mb-6">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2 rounded-full text-sm font-medium transition-colors",
                mode === "login" ? "bg-gradient-to-r from-neon to-cyber text-white shadow-neon" : "text-muted-foreground"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={cn(
                "flex-1 py-2 rounded-full text-sm font-medium transition-colors",
                mode === "register" ? "bg-gradient-to-r from-neon to-cyber text-white shadow-neon" : "text-muted-foreground"
              )}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahim Uddin"
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-neon" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button type="button" className="text-cyber hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full text-base font-medium shadow-neon"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-cyber font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground mb-3">Or continue shopping as guest</p>
            <Button
              variant="outline"
              onClick={() => navigate("shop")}
              className="rounded-full border-border hover:bg-secondary"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
