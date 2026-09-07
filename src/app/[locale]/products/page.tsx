import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import ProductCatalogHub from "@/components/products/ProductCatalogHub";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeCategorySlug = resolvedSearchParams?.category || "all";

  if (!isValidLocale(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      {/* 01. TIERED HERO ARCHITECTURE (HTC-4.4 / HTC-4.5) */}
      <PageHero
        eyebrow={isRtl ? "كتالوج المواصفات الفنية" : "TECHNICAL CATALOG"}
        documentId="DOC-CAT-2026.03"
        title={isRtl ? "مكونات هيكلية فائقة الدقة." : "PRECISION STRUCTURAL COMPONENTS."}
        description={
          isRtl
            ? "فهرس المنتجات الفولاذية المعتمدة والتصاميم الهندسية المتاحة لطلبات التحديد الفني المباشر."
            : "Comprehensive catalog of precision-engineered structural steel items, heavy utility hardware, and custom fabrications."
        }
        breadcrumb={isRtl ? "الرئيسية / المنتجات" : "HOME / PRODUCTS"}
        overlayStyle="dramatic"
        primaryAction={{
          label: isRtl ? "استعراض الكتالوج" : "Explore Catalog",
          href: "#catalog-hub",
          variant: "primary",
        }}
        secondaryAction={{
          label: isRtl ? "تحميل المواصفات" : "Download Spec Sheet",
          href: `/${locale}/contact`,
          variant: "outline",
        }}
        locale={locale as Locale}
      />

      {/* 02. SPECIFICATION CATALOG HUB WITH LEFT FILTER RAIL & TECHNICAL SEARCH */}
      <Section world="bone" className="pt-8 sm:pt-12">
        <Container>
          <div id="catalog-hub" className="scroll-mt-28">
            <ProductCatalogHub
              products={PRODUCTS}
              categories={CATEGORIES}
              locale={locale as Locale}
              initialCategory={activeCategorySlug}
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
