"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, ChevronRight, Phone, Mail, MapPin, Clock, Send, MessageCircle, Zap, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/lib/store";
import { contactContent, siteInfo } from "@/lib/data";

export function ContactPage() {
  const navigate = useRouter((s) => s.navigate);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    }, 4000);
  };

  const contactMethods = [
    { icon: Phone, label: "Phone", value: siteInfo.phone, sub: "Call us anytime, 24/7", color: "bg-neon/15 text-neon", href: `tel:${siteInfo.phoneRaw}` },
    { icon: Mail, label: "Email", value: siteInfo.email, sub: "We reply within 24 hours", color: "bg-cyber/15 text-cyber", href: `mailto:${siteInfo.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: siteInfo.phone, sub: "Quick chat support", color: "bg-magenta/15 text-magenta", href: "#" },
    { icon: Clock, label: "Hours", value: "Always Open (24/7)", sub: "Online support anytime", color: "bg-foreground/10 text-foreground", href: "#" },
  ];

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Contact</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mt-3">
            Get In Touch
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Feel free to reach us. We&apos;re here to help with any questions about products, orders, refunds, or technical issues — 24/7.
          </p>
        </div>
      </div>

      {/* Contact methods */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.label}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border/60 p-5 hover:shadow-neon hover:-translate-y-1 transition-all block"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${method.color} mb-3`}>
                  <method.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {method.label}
                </div>
                <div className="font-semibold text-foreground break-words">{method.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{method.sub}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4">
          <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon to-cyber text-white flex items-center justify-center shadow-neon">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Have An Question? Contact Us!</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Your email address will not be published. Required fields are marked *</p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon/20 to-cyber/20 text-cyber flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Message Sent! 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      {contactContent.formFields.name} *
                    </Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      {contactContent.formFields.email} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      {contactContent.formFields.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                      {contactContent.formFields.subject} *
                    </Label>
                    <select
                      id="subject"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="mt-1.5 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                    >
                      {contactContent.formFields.subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    {contactContent.formFields.message} *
                  </Label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your issue or question..."
                    className="mt-1.5 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neon/30"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full text-base font-medium shadow-neon"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {contactContent.formFields.submit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Support banner */}
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="bg-gradient-to-br from-neon/10 to-cyber/10 rounded-3xl border border-border/60 p-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon to-cyber text-white mb-4 shadow-neon">
              <Headphones className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
              Need urgent help?
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
              Our 24/7 support team is ready to assist with orders, refunds, and technical issues.
              Reach us directly via phone or WhatsApp for fastest response.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${siteInfo.phoneRaw}`}>
                <Button className="bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white rounded-full px-7 shadow-neon">
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </Button>
              </a>
              <a href={`mailto:${siteInfo.email}`}>
                <Button variant="outline" className="rounded-full border-border hover:bg-secondary px-7">
                  <Mail className="h-4 w-4 mr-2" /> Email Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
