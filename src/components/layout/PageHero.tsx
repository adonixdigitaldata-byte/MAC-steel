"use client";

import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ParallaxBackground } from "@/components/motion";
import HeroImageSlideshow from "@/components/layout/HeroImageSlideshow";

export interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  isExternal?: boolean;
}

export interface PageHeroProps {
  /** Main Bebas Neue / Display Headline */
  title: string;
  /** Top Eyebrow categorization label (e.g. TECHNICAL CATALOG) */
  eyebrow: string;
  /** Supporting technical description */
  description?: string;
  /** Breadcrumb segments or string (e.g. "HOME / PRODUCTS") */
  breadcrumb?: string;
  /** Document ID tag (e.g. "DOC-CAT-2026.03") */
  documentId?: string;
  /** Background identity identifier or custom CSS class */
  backgroundImage?: string;
  /** Background slideshow images array for dynamic hero transitions */
  backgroundSlideshow?: string[];
  /** Background slideshow overlay mode ('none' | 'light' | 'default') */
  slideshowOverlayMode?: "none" | "light" | "default";
  /** Add structural border & backdrop to hero text */
  textBorder?: boolean;
  /** Primary CTA configuration */
  primaryAction?: HeroAction;
  /** Secondary CTA configuration */
  secondaryAction?: HeroAction;
  /** Engineering metadata strip chips (Default chips provided if omitted) */
  technicalMeta?: string[];
  /** Overlay style mood */
  overlayStyle?: "default" | "warm" | "dramatic" | "technical";
  /** Option to hide the right CAD structural spec box */
  showRightSpec?: boolean;
  /** Option to hide top document badge if needed */
  showDocumentId?: boolean;
  /** Option to hide bottom technical metadata strip */
  showTechnicalMeta?: boolean;
  /** Compact vertical padding for immediate item visibility */
  compact?: boolean;
  /** Current Locale */
  locale: Locale;
  /** Additional container styling */
  className?: string;
}

const DEFAULT_CHIPS = ["ISO 9001", "±0.05 MM", "JED • KSA", "LIVE SPEC"];

export default function PageHero({
  title,
  eyebrow,
  description,
  breadcrumb,
  documentId = "DOC-SPEC-2026",
  backgroundImage,
  backgroundSlideshow,
  slideshowOverlayMode = "default",
  textBorder = false,
  primaryAction,
  secondaryAction,
  technicalMeta = DEFAULT_CHIPS,
  overlayStyle = "default",
  showRightSpec = true,
  showDocumentId = true,
  showTechnicalMeta = true,
  compact = false,
  locale,
  className = "",
}: PageHeroProps) {
  const isRtl = locale === "ar";

  // Derive default breadcrumb if not explicitly provided
  const computedBreadcrumb =
    breadcrumb || (isRtl ? `الرئيسية / ${eyebrow}` : `HOME / ${eyebrow}`);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-[#0e0f12] text-bone border-b border-carbon-border/80 select-none",
        compact
          ? "pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-32 lg:pb-10"
          : "pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24",
        className
      )}
    >
      {/* Background Slideshow or Dynamic Parallax Background */}
      {backgroundSlideshow && backgroundSlideshow.length > 0 ? (
        <HeroImageSlideshow images={backgroundSlideshow} overlayMode={slideshowOverlayMode} />
      ) : (
        <ParallaxBackground
          backgroundImage={backgroundImage}
          overlayStyle={overlayStyle}
          speed={0.08}
        />
      )}

      {/* Hero Structural Frame & Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP: Technical Breadcrumb, Document ID & Eyebrow Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 sm:mb-8 border-b border-carbon-border/60">
          <div className="flex items-center space-x-3 rtl:space-x-reverse font-tech text-[10px] sm:text-xs text-accent-metal tracking-widest uppercase">
            <span className="text-accent-copper font-bold">///</span>
            <span>{computedBreadcrumb}</span>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse font-tech text-[10px] sm:text-xs">
            <span className="hidden sm:inline-block px-2 py-0.5 border border-carbon-border bg-carbon-surface/80 text-accent-metal tracking-widest uppercase">
              {eyebrow}
            </span>
            {showDocumentId && documentId && (
              <span className="px-2.5 py-0.5 border border-accent-copper/40 bg-accent-copper/10 text-bone tracking-widest uppercase font-mono font-semibold">
                {documentId}
              </span>
            )}
          </div>
        </div>

        {/* CENTER: Headline, Supporting Copy, Action Group */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className={cn("space-y-4 sm:space-y-6", showRightSpec ? "lg:col-span-8" : "lg:col-span-12")}>
            {/* Eyebrow badge for mobile view */}
            <div className="sm:hidden inline-flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-1.5 h-1.5 bg-accent-copper inline-block" />
              <span className="font-tech text-[10px] tracking-widest uppercase text-accent-copper font-bold">
                {eyebrow}
              </span>
            </div>

            {/* Display Title with Bebas Neue typography */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wider text-bone uppercase leading-[0.92] text-balance">
              {title}
            </h1>

            {/* Supporting Copy */}
            {description && (
              <p className="font-body text-sm sm:text-base lg:text-lg text-accent-metal max-w-2xl leading-relaxed text-pretty">
                {description}
              </p>
            )}

            {/* Optional CTA Group */}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
                {primaryAction && (
                  primaryAction.isExternal ? (
                    <a
                      href={primaryAction.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-between font-tech text-xs sm:text-sm tracking-widest uppercase px-6 py-3.5 bg-bone text-carbon border border-bone hover:bg-carbon hover:text-bone hover:border-bone transition-all duration-200"
                    >
                      <span className="font-bold">{primaryAction.label}</span>
                      <span className="ms-3 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        →
                      </span>
                    </a>
                  ) : (
                    <Button
                      href={primaryAction.href}
                      locale={locale}
                      variant={primaryAction.variant || "primary"}
                      world="carbon"
                    >
                      {primaryAction.label}
                    </Button>
                  )
                )}

                {secondaryAction && (
                  secondaryAction.isExternal ? (
                    <a
                      href={secondaryAction.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-between font-tech text-xs sm:text-sm tracking-widest uppercase px-6 py-3.5 bg-transparent text-bone border border-carbon-border hover:border-bone hover:bg-carbon-surface transition-all duration-200"
                    >
                      <span className="font-bold">{secondaryAction.label}</span>
                      <span className="ms-3 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <Button
                      href={secondaryAction.href}
                      locale={locale}
                      variant={secondaryAction.variant || "outline"}
                      world="carbon"
                    >
                      {secondaryAction.label}
                    </Button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right CAD Technical Bracket Ornament */}
          {showRightSpec && (
            <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-between self-stretch border-s border-carbon-border/40 ps-8 py-2">
              <div className="w-full flex justify-between items-start font-tech text-[9px] tracking-widest text-accent-metal/60 uppercase">
                <span>SEC // STRUCTURAL SPEC</span>
                <span className="text-accent-copper">VER 2026.04</span>
              </div>

              <div className="w-full space-y-2 py-4">
                <div className="flex justify-between items-center text-[10px] font-tech border-b border-carbon-border/30 pb-1.5">
                  <span className="text-accent-metal/70 uppercase">MATERIALITY</span>
                  <span className="text-bone font-mono">ASTM / DIN / BS</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-tech border-b border-carbon-border/30 pb-1.5">
                  <span className="text-accent-metal/70 uppercase">FABRICATION</span>
                  <span className="text-bone font-mono">CNC / HDG / SS316</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-tech">
                  <span className="text-accent-metal/70 uppercase">ORIGIN DISPATCH</span>
                  <span className="text-accent-copper font-mono">SAUDI ARABIA</span>
                </div>
              </div>

              <div className="w-full flex justify-between items-end font-tech text-[9px] tracking-widest text-accent-metal/50">
                <span>[KSA-MGF-REG]</span>
                <span className="text-bone font-bold">SYS-PASS</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM: Engineering Metadata Strip */}
        {showTechnicalMeta && (
          <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-carbon-border/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {technicalMeta.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 rtl:space-x-reverse font-tech text-[10px] sm:text-xs text-accent-metal border border-carbon-border/80 bg-carbon-surface/60 px-3 py-1 uppercase tracking-wider"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-copper shrink-0" />
                  <span>{chip}</span>
                </span>
              ))}
            </div>

            <div className="font-tech text-[9px] sm:text-[10px] text-accent-metal/60 tracking-widest uppercase">
              <span>METALLO ARABIA SPECIFICATION MATRIX</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
