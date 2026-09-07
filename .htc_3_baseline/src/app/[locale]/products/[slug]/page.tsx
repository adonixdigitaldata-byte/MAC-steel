import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale, SUPPORTED_LOCALES } from "@/config/locales";
import { PRODUCTS, getProductBySlug } from "@/data/products";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHeader from "@/components/layout/PageHeader";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import SpecificationBlock from "@/components/ui/SpecificationBlock";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import Button from "@/components/ui/Button";
import IconArrow from "@/components/ui/IconArrow";
import { DisplayM, BodyText } from "@/components/ui/Typography";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const product of PRODUCTS) {
      params.push({ locale, slug: product.slug });
    }
  }

  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isRtl = locale === "ar";

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      <Section world="bone">
        <Container>
          {/* Breadcrumb Navigation */}
          <div className="mb-6 font-tech text-xs uppercase tracking-wider text-accent-mineral flex items-center space-x-2 rtl:space-x-reverse">
            <Link href={`/${locale}/products`} className="hover:text-carbon transition-colors">
              {isRtl ? "المنتجات" : "PRODUCTS"}
            </Link>
            <span>/</span>
            <span className="text-carbon font-bold truncate max-w-[240px]">
              {isRtl ? product.nameAr : product.name}
            </span>
          </div>

          <PageHeader
            index={product.documentRef ? `REF: ${product.documentRef}` : "TECHNICAL SHEET"}
            label={isRtl ? product.categoryAr : product.category}
            title={isRtl ? product.nameAr : product.name}
            description={isRtl ? product.descriptionAr : product.description}
            locale={locale as Locale}
            world="bone"
          />

          {/* Product Detail Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16">
            {/* Left / Primary Visual Frame */}
            <div className="lg:col-span-6 space-y-4">
              <ProductPlaceholder
                productId={product.id}
                category={isRtl ? product.categoryAr : product.category}
                name={isRtl ? product.nameAr : product.name}
                world="bone"
                aspectRatio="square"
              />
              <div className="flex justify-between items-center font-tech text-[10px] text-accent-mineral border-t border-bone-border pt-2">
                <span>DOCUMENT REF: {product.documentRef || "MAC-TDS-2026"}</span>
                <span>STATUS: TECHNICAL DATA INTEGRATED</span>
              </div>
            </div>

            {/* Right / Technical Specifications & Inquiry Panel */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <TechnicalLabel variant="copper" className="mb-3">
                  {isRtl ? "المواصفات الفنية المعتمدة" : "CERTIFIED TECHNICAL DATA"}
                </TechnicalLabel>
                <DisplayM className="text-carbon mb-4">
                  {isRtl ? "معلمات المكونات" : "PRODUCT PARAMETERS"}
                </DisplayM>
                <BodyText className="text-carbon/80 text-sm leading-relaxed mb-6">
                  {isRtl ? product.descriptionAr : product.description}
                </BodyText>
              </div>

              {/* Space Mono Standard Specification Block */}
              <SpecificationBlock
                material={product.material}
                grade={product.grade}
                size={product.size}
                application={isRtl ? product.applicationAr : product.application}
                locale={locale as Locale}
                world="bone"
              />

              {/* Extended Custom Specification Key-Value Table if present */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="border border-bone-border bg-bone-surface p-4 sm:p-6 space-y-3 font-tech text-xs">
                  <span className="font-bold block border-b border-bone-border pb-2 text-carbon">
                    {isRtl ? "جدول القياسات والدعوة الفنية" : "DIAGRAM CALLOUTS & SPECIFICATIONS"}
                  </span>
                  <div className="space-y-2">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-4 border-b border-bone-border/50 pb-1.5">
                        <span className="text-accent-mineral font-medium">
                          {isRtl ? (spec.labelAr || spec.label) : spec.label}:
                        </span>
                        <span className="font-bold text-carbon text-end break-words">
                          {isRtl ? (spec.valueAr || spec.value) : spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Directive */}
              <div className="pt-6 border-t border-bone-border space-y-4">
                <Button href={`/${locale}/contact`} locale={locale as Locale} variant="primary" world="bone" className="w-full">
                  {isRtl ? "طلب مواصفات الأسعار المباشر" : "SEND TECHNICAL SPECIFICATION INQUIRY"}
                </Button>
                <Link
                  href={`/${locale}/products`}
                  className="font-tech text-xs text-accent-mineral hover:text-carbon uppercase tracking-wider flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <span>{isRtl ? "العودة إلى قائمة المنتجات" : "RETURN TO CATALOGUE INDEX"}</span>
                  <IconArrow locale={locale as Locale} size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
