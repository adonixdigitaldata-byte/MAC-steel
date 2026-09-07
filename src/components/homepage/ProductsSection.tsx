import React from "react";
import { Locale } from "@/config/locales";
import { PRODUCTS } from "@/data/products";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";

interface ProductsSectionProps {
  locale: Locale;
}

export default function ProductsSection({ locale }: ProductsSectionProps) {
  const isRtl = locale === "ar";

  // Display top 3 featured engineering products
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <Section world="bone" id="products">
      <Container>
        <SectionHeader
          index="04"
          label={isRtl ? "المنتجات المميزة // فهرس المواصفات" : "FEATURED PRODUCTS // SPECIFICATION DATABASE"}
          title={isRtl ? "مكونات فولاذية مختارة" : "FEATURED STEEL ASSEMBLIES."}
          description={
            isRtl
              ? "نماذج مختارة من أنظمة التثبيت والهياكل الفولاذية المعتمدة لطلبات المواصفات المباشرة."
              : "Precision manufactured components, anchor studs, and structural fabrications ready for CAD specification."
          }
          actionText={isRtl ? "قاعدة المنتجات الكاملة" : "ENTER PRODUCT DATABASE"}
          actionHref={`/${locale}/products`}
          locale={locale}
          world="bone"
        />

        {/* 3-Column Architectural Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              world="bone"
              index={index}
            />
          ))}
        </div>

        {/* Database Specification Action Directive */}
        <div className="text-center pt-8 border-t border-bone-border flex flex-col sm:flex-row items-center justify-between gap-4 font-tech text-xs">
          <span className="text-accent-mineral text-[11px]">
            {isRtl ? "أكثر من ٥٠ مواصفة قياسية جاهزة للتحميل" : "FULL CAD SPECS & MATERIAL TRACEABILITY SHEETS READY"}
          </span>
          <Button href={`/${locale}/products`} locale={locale} variant="primary" world="bone">
            {isRtl ? "تصفح قاعدة بيانات المنتجات الكاملة ←" : "BROWSE FULL PRODUCT CATALOGUE →"}
          </Button>
        </div>
      </Container>
    </Section>
  );
}

