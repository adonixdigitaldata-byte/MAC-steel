import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale } from "@/config/locales";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import ProductCard from "@/components/products/ProductCard";
import ProductListItem from "@/components/products/ProductListItem";
import TechnicalLabel from "@/components/ui/TechnicalLabel";

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

  redirect(`/${locale}`);

  const isRtl = locale === "ar";

  // Category filtering logic
  const filteredProducts =
    activeCategorySlug === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => {
          const matchedCategory = CATEGORIES.find((c) => c.slug === activeCategorySlug);
          return matchedCategory && p.category === matchedCategory.name;
        });

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      <Section world="bone">
        <Container>
          <PageHeader
            index="01"
            label={isRtl ? "كتالوج المنتجات / الخامات" : "PRODUCT CATALOGUE ARCHIVE"}
            title={isRtl ? "المكونات والهياكل الفولاذية" : "ENGINEERED COMPONENTS FOR INDUSTRIAL SYSTEMS."}
            description={
              isRtl
                ? "فهرس المنتجات الفولاذية المعتمدة والتصاميم الهندسية المتاحة لطلبات التحديد الفني المباشر."
                : "Comprehensive catalog of precision-engineered structural steel items, frames, and custom fabrications."
            }
            locale={locale as Locale}
            world="bone"
          />

          {/* Technical Text-Based Category Navigation Bar */}
          <div className="mb-12 border-b border-bone-border pb-6">
            <div className="flex justify-between items-center mb-4">
              <TechnicalLabel variant="copper">
                {isRtl ? "تصنيف المنتجات" : "PRODUCT CLASSIFICATION"}
              </TechnicalLabel>
              <span className="font-tech text-xs text-accent-mineral">
                {isRtl ? `إجمالي العناصر: [${filteredProducts.length}]` : `TOTAL ITEMS: [${filteredProducts.length}]`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-tech text-xs uppercase tracking-wider">
              <Link
                href={`/${locale}/products`}
                className={`pb-1 border-b-2 transition-colors ${
                  activeCategorySlug === "all"
                    ? "border-accent-copper text-carbon font-bold"
                    : "border-transparent text-accent-mineral hover:text-carbon"
                }`}
              >
                [01] {isRtl ? "جميع المنتجات" : "ALL PRODUCTS"}
              </Link>

              {CATEGORIES.map((cat, index) => {
                const isActive = activeCategorySlug === cat.slug;
                const formattedIdx = String(index + 2).padStart(2, "0");

                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/products?category=${cat.slug}`}
                    className={`pb-1 border-b-2 transition-colors ${
                      isActive
                        ? "border-accent-copper text-carbon font-bold"
                        : "border-transparent text-accent-mineral hover:text-carbon"
                    }`}
                  >
                    [{formattedIdx}] {isRtl ? cat.nameAr : cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Editorial Product Grid */}
          <SectionHeader
            index="01"
            label={isRtl ? "العرض الشبكي الهيكلي" : "EDITORIAL GRID CATALOGUE"}
            title={isRtl ? "مجموعات المنتجات الرئيسية" : "PRIMARY PRODUCT SELECTION"}
            locale={locale as Locale}
            world="bone"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale as Locale}
                world="bone"
                index={index}
              />
            ))}
          </div>

          {/* Horizontal Technical List View Archive */}
          <SectionHeader
            index="02"
            label={isRtl ? "فهرس الكتالوج الأفقي" : "HORIZONTAL SPECIFICATION INDEX"}
            title={isRtl ? "السجل الفني التفصيلي" : "DETAILED PRODUCT ARCHIVE"}
            locale={locale as Locale}
            world="bone"
          />

          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <ProductListItem
                key={product.id}
                product={product}
                locale={locale as Locale}
                world="bone"
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
