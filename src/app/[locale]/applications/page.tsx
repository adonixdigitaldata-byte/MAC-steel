import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale } from "@/config/locales";
import { INDUSTRY_SECTORS } from "@/data/industry-sectors";
import { getProductBySlug } from "@/data/products";
import { Product } from "@/types";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";
import { FadeReveal, StaggerGroup, TechnicalDivider } from "@/components/motion";
import { DisplayM, BodyText } from "@/components/ui/Typography";

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      {/* 01. TIER-2 PAGEHERO */}
      <PageHero
        eyebrow={isRtl ? "حلول القطاعات الصناعية الكبرى" : "INDUSTRY SOLUTIONS HUB"}
        documentId="DOC-SEC-PORTAL-2026"
        title={isRtl ? "هندسة معتمدة للمشاريع الحرجة." : "DEPLOYED ACROSS CRITICAL INFRASTRUCTURE."}
        description={
          isRtl
            ? "دليل القطاعات الصناعية والهندسية في المملكة العربية السعودية: التحديات الميدانية، المواصفات المعتمدة، والمكونات الفولاذية المخصصة لكل قطاع."
            : "Cross-sector engineering solutions: Field challenge analysis, certified compliance metrics, and precision steel components tailored for key industrial environments."
        }
        breadcrumb={isRtl ? "الرئيسية / القطاعات" : "HOME / APPLICATIONS"}
        overlayStyle="dramatic"
        primaryAction={{
          label: isRtl ? "استعراض القطاعات" : "Explore Sectors",
          href: "#sectors-portal",
          variant: "primary",
        }}
        secondaryAction={{
          label: isRtl ? "طلب استشارة هندسية" : "Sector Inquiry",
          href: `/${locale}/contact`,
          variant: "outline",
        }}
        locale={locale as Locale}
      />

      {/* 02. DEDICATED SECTORS PORTAL WITH ALTERNATING EDITORIAL LAYOUT */}
      <div id="sectors-portal" className="scroll-mt-24">
        {INDUSTRY_SECTORS.map((sector, sIdx) => {
          const isEven = sIdx % 2 === 1;
          const isCarbonWorld = isEven;
          const world = isCarbonWorld ? "carbon" : "bone";

          // Resolve recommended products from single source of truth
          const recommendedProducts: Product[] = sector.productSlugs
            .map((slug) => getProductBySlug(slug))
            .filter((p): p is Product => Boolean(p));

          return (
            <React.Fragment key={sector.id}>
              <Section world={world} className="py-16 sm:py-24">
                <Container>
                  {/* Sector Header Lockup */}
                  <FadeReveal y={24} duration={700}>
                    <div className="flex flex-wrap items-center justify-between pb-4 mb-8 border-b border-current/20 gap-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <NumberBadge number={sector.id} world={world} />
                        <TechnicalLabel variant="copper">
                          {isRtl ? sector.nameAr : sector.name.toUpperCase()}
                        </TechnicalLabel>
                      </div>
                      <span className="font-tech text-xs opacity-70">
                        SPECIFICATION STANDARD: {sector.specs.standard}
                      </span>
                    </div>
                  </FadeReveal>

                  {/* Alternating Editorial Layout: Challenge / Solution vs Specifications */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-12">
                    {/* Left/Main Column: Headline, Tagline, Challenge & Solution */}
                    <FadeReveal
                      className={isEven ? "lg:col-span-7 lg:order-2 space-y-6" : "lg:col-span-7 space-y-6"}
                      y={20}
                      duration={750}
                    >
                      <DisplayM className={isCarbonWorld ? "text-bone" : "text-carbon"}>
                        {isRtl ? sector.nameAr : sector.name}
                      </DisplayM>

                      <p className="font-tech text-xs sm:text-sm text-accent-copper font-bold uppercase tracking-wider">
                        /// {isRtl ? sector.taglineAr : sector.tagline}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        {/* Challenge Block */}
                        <div className={isCarbonWorld ? "border border-carbon-border bg-carbon-surface p-5 space-y-2" : "border border-bone-border bg-bone-surface p-5 space-y-2"}>
                          <span className="font-tech text-[10px] text-accent-copper font-bold uppercase block">
                            01 // {isRtl ? "التحدي الهندسي" : "THE FIELD CHALLENGE"}
                          </span>
                          <p className="font-body text-xs opacity-85 leading-relaxed">
                            {isRtl ? sector.challengeAr : sector.challenge}
                          </p>
                        </div>

                        {/* Solution Block */}
                        <div className={isCarbonWorld ? "border border-carbon-border bg-carbon-surface p-5 space-y-2" : "border border-bone-border bg-bone-surface p-5 space-y-2"}>
                          <span className="font-tech text-[10px] text-accent-copper font-bold uppercase block">
                            02 // {isRtl ? "الحل المعتمد" : "ENGINEERED SOLUTION"}
                          </span>
                          <p className="font-body text-xs opacity-85 leading-relaxed">
                            {isRtl ? sector.solutionAr : sector.solution}
                          </p>
                        </div>
                      </div>
                    </FadeReveal>

                    {/* Right/Secondary Column: Technical Parameters & RFQ Action */}
                    <FadeReveal
                      className={isEven ? "lg:col-span-5 lg:order-1 space-y-6" : "lg:col-span-5 space-y-6"}
                      y={20}
                      duration={750}
                      delay={100}
                    >
                      <div className={isCarbonWorld ? "border border-carbon-border bg-carbon-surface p-6 font-tech text-xs space-y-4" : "border border-bone-border bg-bone-surface p-6 font-tech text-xs space-y-4"}>
                        <div className="flex justify-between items-center pb-2 border-b border-current/20">
                          <span className="text-[10px] text-accent-copper font-bold uppercase">SECTOR COMPLIANCE</span>
                          <span className="text-[10px] opacity-60">ISO 9001 / SASO</span>
                        </div>

                        <div className="space-y-2.5 text-[11px]">
                          <div>
                            <span className="block text-[9px] opacity-60 uppercase">GOVERNING STANDARD</span>
                            <span className="font-bold block">{sector.specs.standard}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] opacity-60 uppercase">CORROSION RATING</span>
                            <span className="font-bold block">{sector.specs.corrosionRating}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] opacity-60 uppercase">TESTING PROTOCOL</span>
                            <span className="font-bold text-accent-copper block">{sector.specs.testingProtocol}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-current/20">
                          <Button
                            href={`/${locale}/contact`}
                            locale={locale as Locale}
                            variant={isCarbonWorld ? "primary" : "primary"}
                            world={world}
                            className="w-full text-center"
                          >
                            {isRtl ? `طلب استشارة ${sector.nameAr}` : `REQUEST ${sector.name.toUpperCase()} RFQ`}
                          </Button>
                        </div>
                      </div>
                    </FadeReveal>
                  </div>

                  {/* Recommended Products Stream */}
                  {recommendedProducts.length > 0 && (
                    <div className="space-y-6 pt-4 border-t border-current/15">
                      <div className="flex justify-between items-center font-tech text-xs">
                        <span className="font-bold text-accent-copper uppercase tracking-wider">
                          {isRtl ? "المكونات المعتمدة الموصى بها للقطاع" : "RECOMMENDED SPECIFICATION COMPONENTS"}
                        </span>
                        <Link
                          href={`/${locale}/products`}
                          className="text-xs uppercase hover:underline opacity-80 hover:opacity-100"
                        >
                          {isRtl ? "عرض الكتالوج الكامل ←" : "VIEW FULL CATALOG →"}
                        </Link>
                      </div>

                      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={70}>
                        {recommendedProducts.map((prod, pIdx) => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                            locale={locale as Locale}
                            world={world}
                            index={pIdx}
                          />
                        ))}
                      </StaggerGroup>
                    </div>
                  )}
                </Container>
              </Section>

              {/* Technical Transition Divider between sectors */}
              <TechnicalDivider
                world={world}
                label={`SECTOR ${sector.id} / ${sector.slug.toUpperCase()}`}
                documentId={`DOC-SEC-${2026 + sIdx}`}
              />
            </React.Fragment>
          );
        })}
      </div>
    </main>
  );
}
