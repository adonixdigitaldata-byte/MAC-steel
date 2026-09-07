import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { PRODUCTS } from "@/data/products";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import ProductCard from "@/components/products/ProductCard";
import ProductListItem from "@/components/products/ProductListItem";
import Button from "@/components/ui/Button";

interface ProductsSectionProps {
  locale: Locale;
}

export default function ProductsSection({ locale }: ProductsSectionProps) {
  const isRtl = locale === "ar";

  return (
    <Section world="bone" id="products">
      <Container>
        <SectionHeader
          index="04"
          label={isRtl ? "كتالوج المنتجات / الخامات" : "PRODUCT CATALOGUE / SELECTION"}
          title={isRtl ? "فهرس المنتجات الهندسية" : "OUR PRODUCTS."}
          description={
            isRtl
              ? "مجموعة المكونات والهياكل الفولاذية المتاحة لطلبات الأسعار المباشرة عبر الكتالوج."
              : "Structural steel items, custom fabrications, and precision engineered products available for request."
          }
          actionText={isRtl ? "عرض جميع المنتجات" : "EXPLORE ALL PRODUCTS"}
          actionHref={`/${locale}/products`}
          locale={locale}
          world="bone"
        />

        {/* Editorial Product Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              world="bone"
              index={index}
            />
          ))}
        </div>

        {/* Horizontal Technical List Row Showcase */}
        {PRODUCTS[0] && (
          <div className="mb-12">
            <ProductListItem
              product={PRODUCTS[0]}
              locale={locale}
              world="bone"
              index={2}
            />
          </div>
        )}

        {/* Centered Catalogue Action Directive */}
        <div className="text-center pt-8 border-t border-bone-border">
          <Button href={`/${locale}/products`} locale={locale} variant="primary" world="bone">
            {isRtl ? "الانتقال إلى الكتالوج الكامل ←" : "BROWSE FULL PRODUCT CATALOGUE →"}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
