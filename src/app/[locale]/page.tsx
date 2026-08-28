import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";

// Homepage Narrative Sections
import HeroSection from "@/components/homepage/HeroSection";
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
    <main className="min-h-screen bg-carbon text-bone overflow-hidden w-full max-w-full">
      {/* 01. MATERIAL / CINEMATIC 3D HERO */}
      <HeroSection locale={locale as Locale} />

      {/* 02. COMPANY / ARCHITECTURAL PURPOSE */}
      <CompanySection locale={locale as Locale} />

      {/* 03. APPLICATIONS / SECTOR USAGE */}
      <ApplicationsSection locale={locale as Locale} />

      {/* 04. PRODUCTS / CATALOGUE UNIVERSE */}
      <ProductsSection locale={locale as Locale} />

      {/* 05. FINAL CTA / DIRECT INQUIRY */}
      <FinalCtaSection locale={locale as Locale} />
    </main>
  );
}
