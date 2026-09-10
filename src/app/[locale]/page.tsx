import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";

// Homepage Narrative Sections
import HeroSection from "@/components/homepage/HeroSection";
import PinnedVideoTimeline from "@/components/homepage/PinnedVideoTimeline";
// Client boundary wrapper — holds the ssr:false dynamic import for Three.js section
import ManufacturingSection from "@/components/homepage/ManufacturingSectionLoader";
import HeroVideoShowcase from "@/components/homepage/HeroVideoShowcase";
import GatewayStrip from "@/components/homepage/GatewayStrip";
import CompanySection from "@/components/homepage/CompanySection";
import ApplicationsSection from "@/components/homepage/ApplicationsSection";
import ProductsSection from "@/components/homepage/ProductsSection";
import FinalCtaSection from "@/components/homepage/FinalCtaSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-carbon text-bone w-full max-w-full">
      {/* 01A. DESKTOP ONLY: 100% UNTOUCHED THREE.JS 3D HERO */}
      <div className="hidden md:block w-full">
        <HeroSection locale={locale as Locale} />
      </div>

      {/* 01B. MOBILE ONLY: PINNED VIDEO TIMELINE (600vh timeline, 100svh sticky stage) */}
      <div className="block md:hidden w-full">
        <PinnedVideoTimeline locale={locale as Locale} />
      </div>

      {/* 02. MANUFACTURING JOURNEY — 5-stage scroll section */}
      <ManufacturingSection locale={locale as Locale} />

      {/* 03. CINEMATIC VIDEO SHOWCASE (DESKTOP ONLY) */}
      <div className="hidden md:block w-full">
        <HeroVideoShowcase locale={locale as Locale} />
      </div>

      {/* 04. ENGINEERING GATEWAY STRIP — Decision Directory */}
      <GatewayStrip locale={locale as Locale} />

      {/* 04. COMPANY / ARCHITECTURAL PURPOSE PREVIEW */}
      <CompanySection locale={locale as Locale} />

      {/* 05. APPLICATIONS / SECTOR USAGE PREVIEW */}
      <ApplicationsSection locale={locale as Locale} />

      {/* 06. FEATURED PRODUCTS / CATALOGUE UNIVERSE PREVIEW */}
      <ProductsSection locale={locale as Locale} />

      {/* 07. FINAL CTA / DIRECT INQUIRY */}
      <FinalCtaSection locale={locale as Locale} />
    </main>
  );
}

