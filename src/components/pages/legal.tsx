"use client";

import { motion } from "framer-motion";
import { Home as HomeIcon, ChevronRight, Shield, Gavel, Info, Check } from "lucide-react";
import { useRouter, type PageId } from "@/lib/store";
import { legalContent, type LegalDoc } from "@/lib/data";

const pageIcons: Record<string, typeof Shield> = {
  privacy: Shield,
  dmca: Gavel,
  disclaimer: Info,
};

export function LegalPage({ page }: { page: PageId }) {
  const navigate = useRouter((s) => s.navigate);
  const content: LegalDoc | undefined = legalContent[page];

  if (!content) return null;

  const Icon = pageIcons[page] || Shield;

  return (
    <div className="bg-gradient-to-b from-card/30 to-background min-h-screen">
      <div className="bg-card border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-cyber inline-flex items-center gap-1">
              <HomeIcon className="h-3 w-3" /> Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{content.title}</span>
          </nav>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-neon/15 to-cyber/15 text-cyber flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {content.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Last updated: {content.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 lg:p-10"
        >
          {/* TOC */}
          <div className="mb-8 p-4 rounded-2xl bg-secondary/40 border border-border/40">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Table of Contents
            </div>
            <ol className="space-y-1.5">
              {content.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm text-cyber hover:underline inline-flex items-baseline gap-2"
                  >
                    <span className="text-muted-foreground font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span className="line-clamp-1">{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Intro */}
          {content.intro && (
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8 pb-8 border-b border-border/60">
              {content.intro}
            </p>
          )}

          {/* Sections */}
          <div className="space-y-8">
            {content.sections.map((section, i) => (
              <motion.section
                key={i}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-baseline gap-3">
                  <span className="text-gradient-neon font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                {section.body && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{section.body}</p>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((bullet, bi) => (
                      <li key={bi} className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground">
                        <span className="text-cyber mt-1.5 shrink-0">•</span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-4 space-y-5">
                    {section.subsections.map((sub, si) => (
                      <div key={si} className="pl-4 border-l-2 border-neon/30">
                        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-2">
                          {sub.heading}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{sub.body}</p>
                        {sub.bullets && sub.bullets.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {sub.bullets.map((bullet, bi) => (
                              <li key={bi} className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground">
                                <span className="text-cyber mt-1.5 shrink-0">•</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-10 pt-8 border-t border-border/60">
            <div className="bg-gradient-to-br from-neon/10 to-cyber/10 rounded-2xl p-6 text-center">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Questions about this policy?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We&apos;re here to help. Contact our team and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground mb-4">
                <span className="inline-flex items-center gap-1.5 justify-center">
                  <span className="text-cyber">✉</span>
                  admin@bd71shop.com
                </span>
              </div>
              <button
                onClick={() => navigate("contact")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-neon to-cyber hover:opacity-90 text-white text-sm font-medium transition-opacity shadow-neon"
              >
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
