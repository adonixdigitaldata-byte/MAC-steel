import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";

// Homepage Narrative Sections
import HeroSection from "@/components/homepage/HeroSection";
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
    <main className="min-h-screen bg-carbon text-bone overflow-clip w-full max-w-full">
      {/* 01. MATERIAL / CINEMATIC 3D HERO */}
      <HeroSection locale={locale as Locale} />

      {/* 02. MANUFACTURING JOURNEY — 5-stage scroll section */}
      <ManufacturingSection locale={locale as Locale} />

      {/* 03. CINEMATIC VIDEO SHOWCASE (DESKTOP / MOBILE RESPONSIVE) */}
      <HeroVideoShowcase locale={locale as Locale} />

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

