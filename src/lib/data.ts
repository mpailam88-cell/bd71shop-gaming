// ===== Site Info (from bd71shop.com) =====
export const siteInfo = {
  name: "BD71SHOP",
  domain: "bd71shop.com",
  tagline: "Your Digital Gateway to Global Gaming",
  heroTitle: "Digital online global game store for you.",
  heroSubtitle:
    "Welcome to Bd71shop.com — Bangladesh's premier digital online global game store, where gaming passion meets convenience.",
  email: "admin@bd71shop.com",
  phone: "+880 1748-287630",
  phoneRaw: "+8801748287630",
  address: "Bangladesh",
  hours: "24/7 Online",
  copyright: "© 2026 BD71SHOP. All Rights Reserved. Managed by Cynlex Digital",
  aboutBlurb:
    "BD71Shop.com is Bangladesh's trusted online digital products store, offering the best prices on gaming top-ups, gift cards, and digital services. We specialize in instant delivery and secure payment systems for popular games.",
};

// ===== Trust badges =====
export const trustBadges = [
  { icon: "Truck", title: "Fast Delivery", desc: "For our all orders" },
  { icon: "RefreshCw", title: "Instant Returns", desc: "If codes have problems" },
  { icon: "ShieldCheck", title: "Secure Payment", desc: "100% secure payment" },
  { icon: "Headphones", title: "24/7 Support", desc: "Dedicated support" },
];

// ===== Categories (from bd71shop.com nav) =====
export type Category = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  color: string; // tailwind gradient classes
  glow: string;
  group: "topup" | "giftcard" | "digital";
};

export const categories: Category[] = [
  // Games Top Up
  { id: "free-fire", name: "Free Fire", desc: "Diamonds, Airdrops & Memberships", emoji: "🔥", color: "from-orange-500/30 to-red-500/20", glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]", group: "topup" },
  { id: "pubg", name: "PUBG Mobile", desc: "Unknown Cash (UC) top-up", emoji: "🎯", color: "from-yellow-500/30 to-amber-500/20", glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]", group: "topup" },
  { id: "cod-mobile", name: "Call of Duty: Mobile", desc: "COD Points (CP) top-up", emoji: "🔫", color: "from-zinc-500/30 to-stone-500/20", glow: "shadow-[0_0_30px_rgba(161,161,170,0.3)]", group: "topup" },
  { id: "lotr", name: "Lord of the Rings", desc: "LOTR top-up services", emoji: "💍", color: "from-amber-700/30 to-yellow-700/20", glow: "shadow-[0_0_30px_rgba(180,83,9,0.3)]", group: "topup" },
  { id: "mobile-legends", name: "Mobile Legends", desc: "Diamonds top-up", emoji: "⚔️", color: "from-blue-500/30 to-cyan-500/20", glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]", group: "topup" },
  // Gift Cards
  { id: "google-play", name: "Google Play", desc: "Gift cards & redeem codes", emoji: "▶️", color: "from-green-500/30 to-emerald-500/20", glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]", group: "giftcard" },
  { id: "amazon", name: "Amazon", desc: "Gift cards (USD/EUR/GBP)", emoji: "📦", color: "from-orange-600/30 to-amber-600/20", glow: "shadow-[0_0_30px_rgba(234,88,12,0.3)]", group: "giftcard" },
  { id: "apple", name: "Apple", desc: "App Store & iTunes gift cards", emoji: "🍎", color: "from-zinc-400/30 to-slate-400/20", glow: "shadow-[0_0_30px_rgba(161,161,170,0.3)]", group: "giftcard" },
  { id: "playstation", name: "PlayStation", desc: "PSN store gift cards", emoji: "🎮", color: "from-blue-600/30 to-indigo-600/20", glow: "shadow-[0_0_30px_rgba(37,99,235,0.3)]", group: "giftcard" },
  { id: "razergold", name: "Razer Gold", desc: "RazerGold pins & top-up", emoji: "🐍", color: "from-green-400/30 to-lime-400/20", glow: "shadow-[0_0_30px_rgba(132,204,22,0.3)]", group: "giftcard" },
  { id: "netflix", name: "Netflix", desc: "Gift cards & subscriptions", emoji: "🎬", color: "from-red-600/30 to-rose-600/20", glow: "shadow-[0_0_30px_rgba(220,38,38,0.3)]", group: "giftcard" },
  { id: "steam", name: "Steam Wallet", desc: "Steam gift cards", emoji: "💨", color: "from-slate-500/30 to-blue-500/20", glow: "shadow-[0_0_30px_rgba(100,116,139,0.3)]", group: "giftcard" },
  { id: "spotify", name: "Spotify", desc: "Premium redeem codes", emoji: "🎵", color: "from-green-500/30 to-green-600/20", glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]", group: "giftcard" },
  { id: "nintendo", name: "Nintendo eShop", desc: "Gift cards", emoji: "🍄", color: "from-red-500/30 to-rose-500/20", glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]", group: "giftcard" },
  { id: "binance", name: "Binance", desc: "Crypto gift cards", emoji: "🪙", color: "from-yellow-400/30 to-amber-400/20", glow: "shadow-[0_0_30px_rgba(250,204,21,0.3)]", group: "giftcard" },
  { id: "valorant", name: "Valorant", desc: "Valorant Points (VP)", emoji: "💥", color: "from-rose-500/30 to-red-500/20", glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]", group: "topup" },
  { id: "webzen", name: "Webzen", desc: "Wcoins gift card", emoji: "⚔️", color: "from-purple-500/30 to-violet-500/20", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]", group: "giftcard" },
  // Digital Services
  { id: "digital-wallets", name: "Digital Wallets", desc: "Top-up digital wallets", emoji: "💳", color: "from-cyan-500/30 to-blue-500/20", glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]", group: "digital" },
  { id: "finance-account", name: "Finance Account", desc: "Verified finance accounts", emoji: "🏦", color: "from-emerald-500/30 to-teal-500/20", glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]", group: "digital" },
  { id: "proxy", name: "USA IP / Proxy", desc: "Buy USA IP & proxy", emoji: "🌐", color: "from-indigo-500/30 to-purple-500/20", glow: "shadow-[0_0_30px_rgba(99,102,241,0.3)]", group: "digital" },
];

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

// ===== Products (real products from bd71shop.com/shop) =====
export type Product = {
  id: number;
  name: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  gradient: string; // tailwind gradient classes
  tag?: string;
  badge?: string;
  featured?: "deals" | "popular" | "bestseller" | "new";
  // Fields added for real DB data (populated by mapProduct in store.ts)
  slug?: string;
  featured_image?: string;
  category?: string;
  categoryName?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  inStock?: boolean;
  sku?: string;
  weight?: string;
};

export const products: Product[] = [
  // === Deals of the Day ===
  { id: 1, name: "Google Play Gift Voucher 150 GBP", categoryId: "google-play", price: 16500, oldPrice: 17000, rating: 0, reviews: 0, emoji: "▶️", gradient: "from-green-500/30 to-emerald-500/20", tag: "-3%", featured: "deals" },
  { id: 2, name: "Google Play Gift Card Taiwan – Instant Delivery & Verified", categoryId: "google-play", price: 699, oldPrice: 700, rating: 4.0, reviews: 2, emoji: "▶️", gradient: "from-green-500/30 to-emerald-500/20", featured: "deals" },
  { id: 3, name: "Google Play Gift Card 25 USD", categoryId: "google-play", price: 2549, oldPrice: 2600, rating: 5.0, reviews: 1, emoji: "▶️", gradient: "from-green-500/30 to-emerald-500/20", tag: "-2%", featured: "deals" },
  { id: 4, name: "500 Rs Redeem Code – Instant Online Top-Up", categoryId: "google-play", price: 670, oldPrice: 700, rating: 5.0, reviews: 2, emoji: "🪙", gradient: "from-orange-500/30 to-amber-500/20", tag: "-4%", featured: "deals" },

  // === Popular Gift Cards ===
  { id: 5, name: "RazerGold Global 5 USD Pin", categoryId: "razergold", price: 450, oldPrice: 500, rating: 0, reviews: 0, emoji: "🐍", gradient: "from-green-400/30 to-lime-400/20", tag: "-10%", featured: "popular" },
  { id: 6, name: "RazerGold EURO 5 Pin", categoryId: "razergold", price: 490, rating: 0, reviews: 0, emoji: "🐍", gradient: "from-green-400/30 to-lime-400/20", featured: "popular" },
  { id: 7, name: "Amazon Gift Card 100 USD", categoryId: "amazon", price: 8000, rating: 0, reviews: 0, emoji: "📦", gradient: "from-orange-600/30 to-amber-600/20", featured: "popular" },
  { id: 8, name: "RazerGold Pin CAD 25", categoryId: "razergold", price: 1699, rating: 0, reviews: 0, emoji: "🐍", gradient: "from-green-400/30 to-lime-400/20", featured: "popular" },
  { id: 9, name: "I-tunes Gift Code 100 USD", categoryId: "apple", price: 7800, rating: 0, reviews: 0, emoji: "🍎", gradient: "from-zinc-400/30 to-slate-400/20", featured: "popular" },

  // === Best Seller Gaming Top-Up ===
  { id: 10, name: "Free Fire Level Up Pass Price Bangladesh – Verified Top-Up", categoryId: "free-fire", price: 175, oldPrice: 190, rating: 4.85, reviews: 26, emoji: "🔥", gradient: "from-orange-500/30 to-red-500/20", tag: "-8%", featured: "bestseller" },
  { id: 11, name: "Airdrop Top Up BD – Fast, Safe & Cheap", categoryId: "free-fire", price: 180, oldPrice: 190, rating: 4.86, reviews: 7, emoji: "🎯", gradient: "from-orange-500/30 to-red-500/20", tag: "-5%", featured: "bestseller" },
  { id: 12, name: "FF Airdrop Top Up BD – Instant Free Fire Diamonds", categoryId: "free-fire", price: 69, oldPrice: 90, rating: 4.7, reviews: 47, emoji: "💎", gradient: "from-orange-500/30 to-red-500/20", tag: "-23%", featured: "bestseller" },
  { id: 13, name: "Free Fire Diamond Top Up: 11200 Diamonds", categoryId: "free-fire", price: 7999, oldPrice: 8600, rating: 5.0, reviews: 2, emoji: "💎", gradient: "from-orange-500/30 to-red-500/20", tag: "-7%", featured: "bestseller" },
  { id: 14, name: "5600 Diamond Bundle – Fast & Verified Free Fire Top-Up", categoryId: "free-fire", price: 3999, oldPrice: 4300, rating: 4.88, reviews: 8, emoji: "💎", gradient: "from-orange-500/30 to-red-500/20", tag: "-7%", featured: "bestseller" },

  // === Top Selling (footer) ===
  { id: 15, name: "Free Fire Weekly Membership BD – Instant Activation & Rewards", categoryId: "free-fire", price: 165, oldPrice: 190, rating: 4.94, reviews: 16, emoji: "🔥", gradient: "from-orange-500/30 to-red-500/20", tag: "-13%", featured: "bestseller" },
  { id: 16, name: "Monthly Membership Free Fire – Instant Delivery BD", categoryId: "free-fire", price: 599, oldPrice: 650, rating: 4.56, reviews: 36, emoji: "🔥", gradient: "from-orange-500/30 to-red-500/20", tag: "-8%", featured: "bestseller" },
  { id: 17, name: "Buy Indian Rupee Gift Card Online – Fast & Secure Top-Up", categoryId: "digital-wallets", price: 145, rating: 4.63, reviews: 16, emoji: "💳", gradient: "from-cyan-500/30 to-blue-500/20", featured: "bestseller" },
  { id: 18, name: "Free Fire Airdrop Top Up BD – Instant Diamond Delivery", categoryId: "free-fire", price: 80, oldPrice: 90, rating: 4.83, reviews: 12, emoji: "💎", gradient: "from-orange-500/30 to-red-500/20", tag: "-11%", featured: "bestseller" },

  // === Extra products (real catalog items) ===
  { id: 19, name: "PUBG Mobile UC Top Up – 60 UC", categoryId: "pubg", price: 95, rating: 0, reviews: 0, emoji: "🎯", gradient: "from-yellow-500/30 to-amber-500/20", featured: "new" },
  { id: 20, name: "PUBG Mobile UC Top Up – 325 UC", categoryId: "pubg", price: 450, rating: 0, reviews: 0, emoji: "🎯", gradient: "from-yellow-500/30 to-amber-500/20", featured: "new" },
  { id: 21, name: "PUBG Mobile UC Top Up – 660 UC", categoryId: "pubg", price: 890, rating: 0, reviews: 0, emoji: "🎯", gradient: "from-yellow-500/30 to-amber-500/20", featured: "new" },
  { id: 22, name: "PUBG Mobile UC Top Up – 1800 UC", categoryId: "pubg", price: 2300, rating: 0, reviews: 0, emoji: "🎯", gradient: "from-yellow-500/30 to-amber-500/20", featured: "new" },
  { id: 23, name: "Steam Gift Card 10 USD", categoryId: "steam", price: 1100, rating: 0, reviews: 0, emoji: "💨", gradient: "from-slate-500/30 to-blue-500/20", featured: "new" },
  { id: 24, name: "Steam Gift Card 20 USD", categoryId: "steam", price: 2200, rating: 0, reviews: 0, emoji: "💨", gradient: "from-slate-500/30 to-blue-500/20", featured: "new" },
  { id: 25, name: "Steam Gift Card 50 USD", categoryId: "steam", price: 5400, rating: 0, reviews: 0, emoji: "💨", gradient: "from-slate-500/30 to-blue-500/20", featured: "new" },
  { id: 26, name: "Apple Gift Card 10 USD", categoryId: "apple", price: 1050, rating: 0, reviews: 0, emoji: "🍎", gradient: "from-zinc-400/30 to-slate-400/20", featured: "new" },
  { id: 27, name: "Apple Gift Card 25 USD", categoryId: "apple", price: 2600, rating: 0, reviews: 0, emoji: "🍎", gradient: "from-zinc-400/30 to-slate-400/20", featured: "new" },
  { id: 28, name: "Apple Gift Card 50 USD", categoryId: "apple", price: 5200, rating: 0, reviews: 0, emoji: "🍎", gradient: "from-zinc-400/30 to-slate-400/20", featured: "new" },
  { id: 29, name: "Netflix Gift Card 30 USD", categoryId: "netflix", price: 3200, rating: 0, reviews: 0, emoji: "🎬", gradient: "from-red-600/30 to-rose-600/20", featured: "new" },
  { id: 30, name: "Netflix Gift Card 50 USD", categoryId: "netflix", price: 5300, rating: 0, reviews: 0, emoji: "🎬", gradient: "from-red-600/30 to-rose-600/20", featured: "new" },
  { id: 31, name: "PlayStation Store Gift Card 10 USD", categoryId: "playstation", price: 1150, rating: 0, reviews: 0, emoji: "🎮", gradient: "from-blue-600/30 to-indigo-600/20", featured: "new" },
  { id: 32, name: "PlayStation Store Gift Card 25 USD", categoryId: "playstation", price: 2800, rating: 0, reviews: 0, emoji: "🎮", gradient: "from-blue-600/30 to-indigo-600/20", featured: "new" },
  { id: 33, name: "Call of Duty: Mobile CP 400", categoryId: "cod-mobile", price: 480, rating: 0, reviews: 0, emoji: "🔫", gradient: "from-zinc-500/30 to-stone-500/20", featured: "new" },
  { id: 34, name: "Call of Duty: Mobile CP 800", categoryId: "cod-mobile", price: 940, rating: 0, reviews: 0, emoji: "🔫", gradient: "from-zinc-500/30 to-stone-500/20", featured: "new" },
  { id: 35, name: "Mobile Legends Diamonds 500", categoryId: "mobile-legends", price: 320, rating: 0, reviews: 0, emoji: "⚔️", gradient: "from-blue-500/30 to-cyan-500/20", featured: "new" },
  { id: 36, name: "Mobile Legends Diamonds 1000", categoryId: "mobile-legends", price: 620, rating: 0, reviews: 0, emoji: "⚔️", gradient: "from-blue-500/30 to-cyan-500/20", featured: "new" },
  { id: 37, name: "Spotify Premium 1 Month Redeem Code", categoryId: "spotify", price: 290, rating: 0, reviews: 0, emoji: "🎵", gradient: "from-green-500/30 to-green-600/20", featured: "new" },
  { id: 38, name: "Spotify Premium 3 Months Redeem Code", categoryId: "spotify", price: 850, rating: 0, reviews: 0, emoji: "🎵", gradient: "from-green-500/30 to-green-600/20", featured: "new" },
  { id: 39, name: "Binance Gift Card 25 USD", categoryId: "binance", price: 2700, rating: 0, reviews: 0, emoji: "🪙", gradient: "from-yellow-400/30 to-amber-400/20", featured: "new" },
  { id: 40, name: "Valorant Points (VP) 1000", categoryId: "valorant", price: 950, rating: 0, reviews: 0, emoji: "💥", gradient: "from-rose-500/30 to-red-500/20", featured: "new" },
  { id: 41, name: "Nintendo eShop Gift Card 10 USD", categoryId: "nintendo", price: 1100, rating: 0, reviews: 0, emoji: "🍄", gradient: "from-red-500/30 to-rose-500/20", featured: "new" },
  { id: 42, name: "Webzen Wcoins Gift Card", categoryId: "webzen", price: 990, rating: 0, reviews: 0, emoji: "⚔️", gradient: "from-purple-500/30 to-violet-500/20", featured: "new" },
  { id: 43, name: "USA IP Buy BD – Premium Proxy", categoryId: "proxy", price: 350, rating: 0, reviews: 0, emoji: "🌐", gradient: "from-indigo-500/30 to-purple-500/20", featured: "new" },
  { id: 44, name: "Lord of the Rings Top-up Bundle", categoryId: "lotr", price: 1200, rating: 0, reviews: 0, emoji: "💍", gradient: "from-amber-700/30 to-yellow-700/20", featured: "new" },
];

export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(featured: Product["featured"]) {
  return products.filter((p) => p.featured === featured);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

// ===== Blog Posts (real titles & dates from bd71shop.com) =====
export type BlogPost = {
  id: number;
  title: string;
  date: string;
  emoji: string;
  gradient: string;
  category: string;
  excerpt: string;
  // Fields added for real DB data (populated by mapPost in store.ts)
  slug?: string;
  content?: any;
  readTime?: string;
  comments?: number;
  author?: string;
  bg?: string;
  cover_image?: string;
  seo?: any;
};

export const blogPosts: BlogPost[] = [
  { id: 1, title: "Lovesac Gift Card Discount: Every Way to Save in 2026", date: "March 1, 2026", emoji: "🛋️", gradient: "from-purple-500/30 to-pink-500/20", category: "Gift Cards", excerpt: "Discover every available Lovesac gift card discount, promo code, and savings strategy for 2026 — from seasonal sales to bundle deals and member-only offers." },
  { id: 2, title: "Blue Apron Gift Card: Where to Buy, How It Works & Everything You Need to Know", date: "February 27, 2026", emoji: "🍳", gradient: "from-blue-500/30 to-cyan-500/20", category: "Gift Cards", excerpt: "A complete guide to Blue Apron gift cards — where to buy them, how redemption works, expiration policies, and tips for getting the most value from your meal kit gift." },
  { id: 3, title: "Sell Apple Gift Card", date: "February 26, 2026", emoji: "🍎", gradient: "from-zinc-400/30 to-slate-400/20", category: "Gift Cards", excerpt: "Looking to sell an unwanted Apple gift card? This guide covers the safest platforms, payout methods, and how to get the best exchange rate for your card." },
  { id: 4, title: "Can You Use a Vanilla Gift Card on Amazon? Yes — Here's Exactly How", date: "February 24, 2026", emoji: "🛒", gradient: "from-yellow-500/30 to-amber-500/20", category: "Amazon", excerpt: "Learn the exact step-by-step process for using a Vanilla Visa gift card on Amazon, including workarounds for partial payments and common errors to avoid." },
  { id: 5, title: "How to Check Your DQ Gift Card Balance (All Methods, Step by Step)", date: "February 23, 2026", emoji: "🍦", gradient: "from-orange-500/30 to-red-500/20", category: "Gift Cards", excerpt: "Quick and easy methods to check your Dairy Queen gift card balance — online, in-store, by phone, and via the mobile app. Never get caught short at the register again." },
  { id: 6, title: "Do Gift Cards Expire? Your Complete Guide to Gift Card Expiration Laws (2026)", date: "February 22, 2026", emoji: "⏰", gradient: "from-red-500/30 to-rose-500/20", category: "Legal", excerpt: "A comprehensive guide to gift card expiration laws in 2026 — covering federal regulations, state-by-state variations, and what to do if your card has already expired." },
  { id: 7, title: "How Do I Use a Vanilla Gift Card on Amazon? Complete 2026 Guide", date: "February 3, 2026", emoji: "🛒", gradient: "from-yellow-500/30 to-amber-500/20", category: "Amazon", excerpt: "The 2026 updated guide to using Vanilla gift cards on Amazon — covering the latest workarounds, common errors, and alternative redemption strategies." },
  { id: 8, title: "How to Use a Shell Gift Card: Complete Guide for 2026", date: "January 30, 2026", emoji: "⛽", gradient: "from-yellow-400/30 to-amber-400/20", category: "Gift Cards", excerpt: "Everything you need to know about Shell gift cards — where to use them, how to check balances, fuel rewards integration, and tips for maximizing savings at the pump." },
  { id: 9, title: "What Does SMP Mean in Minecraft? Complete 2026 Guide", date: "January 18, 2026", emoji: "⛏️", gradient: "from-green-500/30 to-emerald-500/20", category: "Gaming", excerpt: "SMP stands for Survival Multiplayer — but there's much more to it. Learn what SMP means in Minecraft, the different server types, and how to join or start your own." },
  { id: 10, title: "Synergy Gift Card: Complete Guide to Savings, Usage & Benefits", date: "January 4, 2026", emoji: "💳", gradient: "from-purple-500/30 to-violet-500/20", category: "Gift Cards", excerpt: "A complete guide to Synergy gift cards — where they're accepted, how to redeem, balance checking, and tips for getting maximum value from your card." },
  { id: 11, title: "How to Check Your Dunkin Gift Card Balance (Complete Guide)", date: "January 4, 2026", emoji: "🍩", gradient: "from-orange-500/30 to-pink-500/20", category: "Gift Cards", excerpt: "Step-by-step methods to check your Dunkin' gift card balance online, in-app, by phone, or in-store — plus tips on combining gift cards with DD Perks rewards." },
  { id: 12, title: "How to Check Your Doolittles Gift Card Balance: Complete Guide (2026)", date: "January 4, 2026", emoji: "🎁", gradient: "from-rose-500/30 to-pink-500/20", category: "Gift Cards", excerpt: "Easy methods to check your Doolittles gift card balance, including online portals, phone support, and in-store options. Updated for 2026." },
  { id: 13, title: "Does FanDuel Have Gift Cards? Everything You Need to Know", date: "December 21, 2025", emoji: "🏆", gradient: "from-blue-500/30 to-indigo-500/20", category: "Gaming", excerpt: "Yes, FanDuel does offer gift cards — but with some important restrictions. Learn where to buy them, how to redeem, and what you can (and can't) use them for." },
  { id: 14, title: "How to Check Your Bath and Body Works Gift Card Balance", date: "December 21, 2025", emoji: "🧴", gradient: "from-pink-500/30 to-rose-500/20", category: "Gift Cards", excerpt: "Multiple ways to check your Bath & Body Works gift card balance — online, in-store, and by phone. Plus tips on combining gift cards with coupons and sales." },
  { id: 15, title: "Where Can I Buy a FanDuel Gift Card? Complete 2026 Guide", date: "December 17, 2025", emoji: "🏆", gradient: "from-blue-500/30 to-indigo-500/20", category: "Gaming", excerpt: "A complete guide to buying FanDuel gift cards in 2026 — including retail locations, online options, denominations, and important restrictions to know before purchasing." },
  { id: 16, title: "A Comprehensive Guide to iTunes Cards: Overview and How to Use Them", date: "November 4, 2025", emoji: "🎵", gradient: "from-zinc-400/30 to-slate-400/20", category: "Apple", excerpt: "Everything you need to know about iTunes cards — what they are, where to buy, how to redeem, what you can purchase, and how they differ from Apple Gift Cards." },
  { id: 17, title: "Maximizing Your Google Play Gift Card: Tips and Tricks", date: "November 4, 2025", emoji: "▶️", gradient: "from-green-500/30 to-emerald-500/20", category: "Google Play", excerpt: "Get the most from your Google Play gift card with these expert tips — from discounted purchases to in-app deal hunting, family library sharing, and refund strategies." },
  { id: 18, title: "5 Compelling Reasons to Buy Google Play Gift Cards", date: "April 5, 2025", emoji: "▶️", gradient: "from-green-500/30 to-emerald-500/20", category: "Google Play", excerpt: "Why Google Play gift cards are a smart purchase — from gifting flexibility to budgeting control, regional pricing arbitrage, and avoiding credit card fees." },
  { id: 19, title: "Buy Popular Gift Cards Bangladesh 2025 at Lowest Online Price", date: "April 2, 2025", emoji: "🇧🇩", gradient: "from-green-500/30 to-red-500/20", category: "Bangladesh", excerpt: "The complete guide to buying popular gift cards in Bangladesh at the lowest prices — covering Google Play, Amazon, Apple, Steam, and more, with safety tips." },
  { id: 20, title: "Buying Gift Cards with Cryptocurrency: A Comprehensive Guide", date: "December 23, 2024", emoji: "🪙", gradient: "from-yellow-400/30 to-amber-400/20", category: "Crypto", excerpt: "How to buy gift cards using Bitcoin, Ethereum, and other cryptocurrencies — covering the best platforms, fees, privacy benefits, and important security considerations." },
  { id: 21, title: "Where to Sell Unwanted Gift Cards: A Comprehensive Guide", date: "December 23, 2024", emoji: "💸", gradient: "from-emerald-500/30 to-teal-500/20", category: "Gift Cards", excerpt: "Need to convert an unwanted gift card to cash? This guide compares the best marketplaces, payout methods, fees, and tips for getting the highest resale value." },
  { id: 22, title: "Ultimate Guide to Buying Gift Cards at a Discount", date: "December 23, 2024", emoji: "🏷️", gradient: "from-purple-500/30 to-pink-500/20", category: "Gift Cards", excerpt: "Save money on every gift card purchase with these proven strategies — from warehouse clubs and cashback portals to gift card exchanges and seasonal promotions." },
  { id: 23, title: "The Ultimate Guide to Uncommon James Gift Cards: The Perfect Present for Fashion Lovers", date: "December 10, 2024", emoji: "💍", gradient: "from-amber-500/30 to-yellow-500/20", category: "Gift Cards", excerpt: "Everything you need to know about Uncommon James gift cards — denominations, where to redeem (online & in-store), expiration, and why they make perfect gifts." },
  { id: 24, title: "AudioDigest Gift Cards: The Perfect Present for Medical Professionals", date: "December 10, 2024", emoji: "🩺", gradient: "from-cyan-500/30 to-blue-500/20", category: "Gift Cards", excerpt: "AudioDigest gift cards are an excellent gift for medical professionals needing CME credits. Learn about denominations, redemption, and how they compare to subscriptions." },
  { id: 25, title: "Maximize Your Extra Hours: Smart Ways to Use Overtime Gift Cards", date: "December 9, 2024", emoji: "⏱️", gradient: "from-indigo-500/30 to-purple-500/20", category: "Gift Cards", excerpt: "Creative and practical ways to use Overtime gift cards — from sports merch to streaming bundles — and how to stretch their value beyond face amount." },
  { id: 26, title: "Best Gift Card Exchange Platforms", date: "December 2, 2024", emoji: "🔄", gradient: "from-blue-500/30 to-cyan-500/20", category: "Gift Cards", excerpt: "Compare the top gift card exchange platforms — fees, payout speed, security, and which sites offer the best rates whether you're buying or selling." },
  { id: 27, title: "How to Trade Gift Cards for Cash", date: "December 2, 2024", emoji: "💵", gradient: "from-emerald-500/30 to-green-500/20", category: "Gift Cards", excerpt: "A practical guide to converting gift cards to cash — comparing exchange platforms, direct buyers, peer-to-peer marketplaces, and how to avoid scams." },
];

export function getBlogById(id: number) {
  return blogPosts.find((p) => p.id === id);
}

// ===== About Page Content (from bd71shop.com/about) =====
export const aboutContent = {
  pageTitle: "About Us",
  heroTitle: "Most Trusted",
  heroSubtitle: "'BD71SHOP' is a Gaming Partner",
  intro:
    "Bd71shop is a Bangladeshi multinational company dedicated to bringing the world of digital entertainment right to your fingertips. We specialize in providing seamless access to gaming content, gift cards, digital streaming services, and cutting-edge gadgets that enhance your digital lifestyle.",
  services: [
    { title: "Gaming Top-Ups", desc: "Free Fire diamonds, PUBG UC, Call of Duty CP, Mobile Legends diamonds, and more — instant delivery, best prices." },
    { title: "Gift Cards", desc: "Google Play, Amazon, Apple, PlayStation, Steam, Netflix, RazerGold, Spotify, and many more global gift cards at competitive prices." },
    { title: "Digital Streaming", desc: "Netflix, Spotify, and other streaming service gift cards and subscriptions for your entertainment needs." },
    { title: "Digital Wallets & Finance", desc: "Digital wallet top-ups, finance account services, and proxy solutions for global access." },
  ],
  whyChooseUs: [
    { title: "Instant Delivery", desc: "All orders are processed instantly — receive your codes and top-ups within minutes of payment confirmation, 24/7." },
    { title: "100% Secure Payment", desc: "We use industry-standard SSL encryption and trusted payment processors including bKash, Nagad, Rocket, and cards." },
    { title: "Best Prices in Bangladesh", desc: "We offer the most competitive prices on gaming top-ups and gift cards, with regular deals and discounts." },
    { title: "24/7 Customer Support", desc: "Our dedicated support team is available around the clock to assist with orders, refunds, and any technical issues." },
    { title: "Instant Returns", desc: "If codes have problems, we offer instant returns and replacements — no questions asked within 24 hours." },
    { title: "Trusted Since Launch", desc: "BD71SHOP is Bangladesh's trusted digital products store, serving thousands of happy customers nationwide." },
  ],
  stats: [
    { value: "44+", label: "Products" },
    { value: "27+", label: "Blog Articles" },
    { value: "20+", label: "Categories" },
    { value: "24/7", label: "Support" },
  ],
};

// ===== Contact Page (from bd71shop.com/contact) =====
export const contactContent = {
  formFields: {
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    subject: "Subject",
    subjectOptions: [
      "General Inquiry",
      "Order Related",
      "Refund Request",
      "Technical Support",
      "Other",
    ],
    message: "Your Message",
    submit: "Send Message",
  },
  info: [
    { label: "Phone", value: siteInfo.phone, icon: "Phone" },
    { label: "Email", value: siteInfo.email, icon: "Mail" },
    { label: "Hours", value: "24/7 Online Support", icon: "Clock" },
    { label: "Location", value: "Bangladesh (Nationwide)", icon: "MapPin" },
  ],
};

// ===== Legal Content (verbatim from bd71shop.com) =====
export type LegalSection = {
  heading: string;
  body?: string;
  bullets?: string[];
  subsections?: { heading: string; body: string; bullets?: string[] }[];
};

export type LegalDoc = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export const legalContent: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "2026",
    intro:
      "We, BD71SHOP understand the importance of privacy and are committed to protecting the personal information of our users. This Privacy Policy outlines the types of information we collect, how we use and share it, and the choices you have with respect to your personal information.",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect information from you in several ways, including:",
        bullets: [
          "Information you provide directly to us: We may collect personal information from you when you create an account, place an order, fill out a form, participate in promotions or surveys, or otherwise interact with our website. This information may include your name, email address, postal address, telephone number, payment information, and other personal details.",
          "Information we collect automatically: When you visit our website, we may automatically collect information about your device and usage, such as your IP address, browser type, operating system, device type, and pages visited. We also use cookies and similar technologies to collect information about your preferences and online activities.",
          "Information from third parties: We may receive information about you from third-party sources, such as social media platforms, payment processors, or other companies that we work with.",
        ],
      },
      {
        heading: "How We Use Your Information",
        body: "We use the information we collect for several purposes, including:",
        bullets: [
          "To provide and improve our website and services: We use your information to provide you with the products and services you request and to improve your experience on our website.",
          "To communicate with you: We use your information to send you promotional offers, updates, and other communications related to our website and services.",
          "For security and fraud prevention: We may use your information to protect the security and integrity of our website and services and to prevent fraud and other illegal activities.",
          "For research and development: We may use your information to develop and improve our products and services.",
        ],
      },
      {
        heading: "Sharing of Your Information",
        body: "We do not sell or rent your personal information to third parties for their marketing purposes without your consent. However, we may share your information with third parties for the following reasons:",
        bullets: [
          "Service providers: We may share your information with service providers who perform services on our behalf, such as payment processors, shipping companies, and marketing agencies. These service providers are required to use your information only for the purpose of providing the services we request.",
          "Legal requirements: We may disclose your information if required by law or if we believe in good faith that such disclosure is necessary to comply with legal process, protect our rights or property, or to protect the safety of others.",
          "Business transfers: In the event that we are acquired by or merged with another company, we may share your information with the acquiring company.",
        ],
      },
      {
        heading: "Your Choices and Controls",
        body: "You have the right to access, correct, and delete your personal information, and to control the use and sharing of your information. You may also choose to opt-out of receiving promotional communications from us. To access, correct, or delete your personal information, or to opt-out of promotional communications, please contact us at admin@bd71shop.com.",
      },
      {
        heading: "Data Retention",
        body: "We retain your personal information for as long as necessary to provide you with our services and to comply with our legal obligations.",
      },
      {
        heading: "Changes to this Privacy Policy",
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.",
      },
      {
        heading: "Contact Us",
        body: "If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at admin@bd71shop.com",
      },
    ],
  },
  dmca: {
    title: "DMCA Policy",
    lastUpdated: "2026",
    intro:
      'BD71SHOP respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond promptly to notices of alleged copyright infringement that are reported to us.',
    sections: [
      {
        heading: "Notice of Infringement",
        body: "If you are a copyright owner (or authorized to act on behalf of a copyright owner) and believe that your work has been infringed, please submit a written notice to our designated agent (see contact information below) that includes the following information:",
        bullets: [
          "A physical or electronic signature of the copyright owner or a person authorized to act on their behalf;",
          "Identification of the copyrighted work claimed to have been infringed;",
          "Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material;",
          "Your contact information, including your address, telephone number, and an email address;",
          "A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and",
          "A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.",
        ],
      },
      {
        heading: "Counter-Notice",
        body: "If you believe that your content was wrongly removed in response to a DMCA notice, you may submit a written counter-notice to our designated agent (see contact information below) that includes the following information:",
        bullets: [
          "Your physical or electronic signature;",
          "Identification of the material that was removed or to which access was disabled and the location at which the material appeared before it was removed or access to it was disabled;",
          "A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled;",
          "Your name, address, and telephone number, and a statement that you consent to the jurisdiction of federal district court for the judicial district in which the address is located, or if your address is outside of the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided notification under DMCA 512 subsection (c)(1)(C) or an agent of such person.",
        ],
      },
      {
        heading: "Contact Information",
        body: "Please send any notices or counter-notices to our designated agent at the following address: admin@bd71shop.com",
      },
      {
        heading: "Repeat Infringers",
        body: "We reserve the right to terminate the accounts of users who repeatedly infringe the copyrights of others.",
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    lastUpdated: "2026",
    sections: [
      {
        heading: "1. General Information",
        body: "The information provided on bd71shop.com and our mobile application is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.",
        subsections: [
          {
            heading: "⚠️ Important Notice",
            body: "Under no circumstances shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site are solely at your own risk.",
          },
        ],
      },
      {
        heading: "2. Product and Service Disclaimer",
        subsections: [
          {
            heading: "Digital Products",
            body: "Bd71shop acts as a reseller and authorized distributor of digital products, including game codes, gift cards, top-up services, and streaming subscriptions. We are not the manufacturers or creators of these products.",
            bullets: [
              "Product Functionality: We do not guarantee that digital codes will work in all regions or on all platforms. It is the customer's responsibility to verify compatibility before purchase.",
              "Third-Party Services: Products sold on our platform are subject to the terms and conditions of their respective publishers and platforms (Steam, PlayStation, Xbox, Google Play, Apple, etc.).",
              "Stock Availability: While we strive to maintain accurate stock information, product availability may change without notice.",
              "Pricing: Prices are subject to change without prior notification. The price applicable is the one displayed at the time of purchase.",
            ],
          },
        ],
      },
      {
        heading: "3. Third-Party Links and Affiliations",
        body: "Our website may contain links to third-party websites or services that are not owned or controlled by Bd71shop. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.",
        subsections: [
          {
            heading: "Important:",
            body: "Bd71shop is an independent retailer and is not officially affiliated with, endorsed by, or sponsored by gaming companies, platform providers, or publishers unless explicitly stated. All product names, logos, and brands are property of their respective owners. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.",
          },
        ],
      },
      {
        heading: "4. Limitation of Liability",
        body: "To the maximum extent permitted by applicable law, Bd71shop shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:",
        bullets: [
          "Your access to or use of or inability to access or use the services",
          "Any conduct or content of any third party on the services",
          "Any content obtained from the services",
          "Unauthorized access, use, or alteration of your transmissions or content",
          "Technical failures, system maintenance, or downtime",
          "Errors in product codes or delivery delays",
          "Account bans or restrictions imposed by third-party platforms",
        ],
      },
      {
        heading: "5. User Responsibility",
        subsections: [
          {
            heading: "Account Security",
            body: "Users are solely responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Bd71shop is not responsible for any loss or damage arising from your failure to protect your account information.",
          },
          {
            heading: "Compliance with Laws",
            body: "Users must comply with all applicable local, national, and international laws and regulations when using our services. You are responsible for ensuring that your use of our products complies with the laws of your jurisdiction.",
          },
          {
            heading: "Age Restrictions",
            body: "Some products sold on our platform may have age restrictions. It is the customer's responsibility to verify age requirements and comply with all applicable age rating systems (ESRB, PEGI, etc.).",
          },
        ],
      },
      {
        heading: "6. Regional Restrictions",
        subsections: [
          {
            heading: "ℹ️ Geographic Limitations",
            body: "Digital products may have regional restrictions. Bd71shop is not responsible if a product purchased does not work in your region. Please verify region compatibility before making a purchase. We make reasonable efforts to indicate regional restrictions where applicable, but we cannot guarantee the accuracy of all regional information. Customers should verify compatibility independently before purchase.",
          },
        ],
      },
      {
        heading: "7. Payment and Transaction Disclaimer",
        body: "All transactions are processed through secure third-party payment processors. While we implement security measures to protect your information, we cannot guarantee absolute security of data transmitted over the internet.",
        bullets: [
          "We do not store complete credit card information on our servers",
          "Payment processing is subject to the terms of third-party payment providers",
          "Currency conversions may apply and are subject to current exchange rates",
          "Transaction fees may be charged by your bank or payment provider",
        ],
      },
      {
        heading: "8. Website Availability and Technical Issues",
        body: "While we strive to maintain 24/7 availability, Bd71shop does not guarantee uninterrupted access to our website or services. We reserve the right to:",
        bullets: [
          "Suspend or discontinue services for maintenance or updates",
          "Modify or discontinue any feature or service without prior notice",
          "Refuse service to anyone for any reason at any time",
        ],
      },
      {
        heading: "9. Intellectual Property",
        body: "All content on bd71shop.com, including but not limited to text, graphics, logos, images, and software, is the property of Bd71shop or its content suppliers and is protected by international copyright laws. Product names, brand names, and trademarks mentioned on our website are the property of their respective owners and are used for identification purposes only.",
      },
      {
        heading: "10. Customer Support Disclaimer",
        body: "While we provide 24/7 customer support, we cannot guarantee:",
        bullets: [
          "Immediate response to all inquiries",
          "Resolution of issues beyond our control (third-party platform problems, regional restrictions, etc.)",
          "Technical support for third-party platforms or services",
          "Assistance with account issues on external gaming platforms",
        ],
      },
      {
        heading: "11. Privacy and Data Collection",
        body: "Our collection and use of personal information is governed by our Privacy Policy. By using our services, you consent to our collection and use of personal data as outlined in our Privacy Policy.",
      },
    ],
  },
};

export function formatPrice(n: number) {
  return n.toLocaleString("en-US");
}
