import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { isValidLocale, Locale, SUPPORTED_LOCALES } from "@/config/locales";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { Product } from "@/types";
import { SITE_CONFIG } from "@/data/config";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import ProductCard from "@/components/products/ProductCard";
import ProductGallery from "@/components/products/ProductGallery";
import StickyPurchasePanel from "@/components/products/StickyPurchasePanel";
import { FadeReveal, StaggerGroup, TechnicalDivider } from "@/components/motion";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const product of PRODUCTS) {
      params.push({ locale, slug: product.slug });
    }
  }

  return params;
}

// Dynamic SEO Metadata & Open Graph Generator
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: `Product Not Found | ${SITE_CONFIG.companyName.en}` };
  }

  const isRtl = locale === "ar";
  const title = isRtl
    ? `${product.nameAr} (${product.partNumber}) | ${SITE_CONFIG.companyName.ar}`
    : `${product.name} (${product.partNumber}) | ${SITE_CONFIG.companyName.en}`;
  const description = isRtl ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescription || product.description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.image ? [{ url: product.image }] : [],
    },
    alternates: {
      canonical: `/${locale}/products/${slug}`,
    },
  };
}

// 4-item Related Products Logic (Priority: Same Category -> Same Material -> Fallback)
function getRelatedProducts(currentProduct: Product): Product[] {
  const relatedList: Product[] = [];

  // 1. Same category
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category === currentProduct.category
  );
  relatedList.push(...sameCategory);

  // 2. Same material (if less than 4)
  if (relatedList.length < 4 && currentProduct.material) {
    const sameMaterial = PRODUCTS.filter(
      (p) =>
        p.id !== currentProduct.id &&
        !relatedList.some((r) => r.id === p.id) &&
        p.material === currentProduct.material
    );
    relatedList.push(...sameMaterial);
  }

  // 3. Fallback from related slug list or general products
  if (relatedList.length < 4 && currentProduct.related) {
    currentProduct.related.forEach((slug) => {
      const matched = getProductBySlug(slug);
      if (matched && matched.id !== currentProduct.id && !relatedList.some((r) => r.id === matched.id)) {
        relatedList.push(matched);
      }
    });
  }

  // Fill remaining slots if any
  if (relatedList.length < 4) {
    const others = PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && !relatedList.some((r) => r.id === p.id)
    );
    relatedList.push(...others);
  }

  return relatedList.slice(0, 4);
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
  const relatedProducts = getRelatedProducts(product);
  const documentId = `DOC-PRD-2026-${product.partNumber}`;

  // Structured Data (JSON-LD Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.partNumber,
    mpn: product.partNumber,
    category: product.category,
    material: product.material,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.shortBrand,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE_CONFIG.companyName.en,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "SAR",
      price: "0.00",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. TIER-2 PAGEHERO WITH DYNAMIC PART NUMBER AND DOCUMENT ID */}
      <PageHero
        eyebrow={isRtl ? product.categoryAr : product.category.toUpperCase()}
        documentId={documentId}
        title={isRtl ? product.nameAr : product.name}
        description={isRtl ? (product.shortDescriptionAr || product.descriptionAr) : (product.shortDescription || product.description)}
        breadcrumb={isRtl ? `الرئيسية / المنتجات / ${product.partNumber}` : `HOME / PRODUCTS / ${product.partNumber}`}
        overlayStyle="dramatic"
        technicalMeta={[
          product.partNumber,
          product.grade || "SS 316L",
          product.thickness || "±0.05 MM",
          "ISO 9001 SPEC",
        ]}
        locale={locale as Locale}
      />

      {/* MAIN TWO-COLUMN BODY: GALLERY + TECHNICAL SPECS + STICKY PURCHASE PANEL */}
      <Section world="bone" className="pt-8 sm:pt-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            {/* LEFT 7-COL: GALLERY, SHORT OVERVIEW & SPECIFICATION CARDS */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-12">
              {/* 4. PRODUCT GALLERY WITH FULLSCREEN ZOOM */}
              <FadeReveal y={24} duration={700}>
                <ProductGallery
                  gallery={product.gallery}
                  mainImage={product.image}
                  partNumber={product.partNumber}
                  name={product.name}
                  nameAr={product.nameAr}
                  category={product.category}
                  categoryAr={product.categoryAr}
                  isRtl={isRtl}
                />
              </FadeReveal>

              {/* 2. PRODUCT OVERVIEW */}
              <FadeReveal y={20} duration={650} className="border border-bone-border bg-bone-surface p-6 sm:p-8 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-bone-border">
                  <TechnicalLabel variant="copper">ENGINEERING SUMMARY</TechnicalLabel>
                  <span className="font-tech text-[10px] text-accent-mineral font-bold">
                    SPEC REF: {product.documentRef || "MAC-TDS-2026"}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-carbon uppercase">
                  {isRtl ? "الوصف الفني والتطبيق الميداني" : "TECHNICAL SPECIFICATION OVERVIEW"}
                </h3>
                <p className="font-body text-sm sm:text-base text-carbon/85 leading-relaxed">
                  {isRtl ? product.descriptionAr : product.description}
                </p>
              </FadeReveal>

              {/* 3. TECHNICAL SPECIFICATIONS (CARDS MATRIX) */}
              <FadeReveal y={24} duration={700} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-bone-border">
                  <TechnicalLabel variant="copper">
                    {isRtl ? "جدول المعلمات والمواصفات" : "CERTIFIED SPECIFICATION MATRIX"}
                  </TechnicalLabel>
                  <span className="font-tech text-[10px] text-accent-mineral">
                    TOLERANCE: ±0.05 MM
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Part Number */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">01 // PART NUMBER</span>
                    <span className="text-sm font-bold text-accent-copper block">{product.partNumber}</span>
                  </div>

                  {/* Card 2: Material & Grade */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">02 // MATERIAL & GRADE</span>
                    <span className="text-sm font-bold text-carbon block truncate">{product.material || "SS 316L / ASTM A36"}</span>
                  </div>

                  {/* Card 3: Finish */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">03 // SURFACE FINISH</span>
                    <span className="text-sm font-bold text-carbon block truncate">{product.finish || "Hot-Dip Galvanized / Passivated"}</span>
                  </div>

                  {/* Card 4: Thickness */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">04 // THICKNESS / GAUGE</span>
                    <span className="text-sm font-bold text-carbon block">{product.thickness || "Engineering Standard"}</span>
                  </div>

                  {/* Card 5: Available Sizes */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">05 // AVAILABLE SIZES / DIMENSIONS</span>
                    <span className="text-xs font-bold text-carbon block">
                      {product.availableSizes && product.availableSizes.length > 0
                        ? product.availableSizes.join(" | ")
                        : product.size || "Custom Specified Fabrication"}
                    </span>
                  </div>

                  {/* Card 6: Category */}
                  <div className="border border-bone-border bg-bone-surface p-4 font-tech text-xs space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-accent-mineral block uppercase font-bold">06 // INDUSTRIAL CATEGORY</span>
                    <span className="text-xs font-bold text-carbon block">
                      {isRtl ? product.categoryAr : product.category}
                    </span>
                  </div>
                </div>

                {/* Additional custom specification table if defined in product data */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="border border-bone-border bg-bone-surface p-4 sm:p-6 space-y-3 font-tech text-xs mt-6">
                    <span className="font-bold block border-b border-bone-border pb-2 text-carbon">
                      {isRtl ? "القياسات الهندسية التفصيلية" : "DETAILED MEASUREMENT SCHEDULE"}
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
              </FadeReveal>
            </div>

            {/* RIGHT 5-COL: 5. STICKY PURCHASE PANEL (DESKTOP STICKY & MOBILE BOTTOM BAR) */}
            <div className="lg:col-span-5">
              <StickyPurchasePanel product={product} locale={locale as Locale} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical Transition Divider */}
      <TechnicalDivider world="bone" label="RELATED SPECIFICATIONS" documentId="DOC-REL-2026.04" />

      {/* 6. RELATED PRODUCTS (MANDATORY 4 CARDS) */}
      <Section world="bone" className="pb-16 sm:pb-24">
        <Container>
          <FadeReveal y={20} duration={600}>
            <SectionHeader
              index="04"
              label={isRtl ? "المكونات الهندسية المرتبطة" : "COMPATIBLE SPECIFICATION ITEMS"}
              title={isRtl ? "منتجات هندسية ذات صلة" : "RELATED SYSTEM COMPONENTS"}
              locale={locale as Locale}
              world="bone"
            />
          </FadeReveal>

          {/* Desktop Grid & Mobile Swipeable / Horizontal Layout */}
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={70}>
            {relatedProducts.map((relProduct, index) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                locale={locale as Locale}
                world="bone"
                index={index}
              />
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </main>
  );
}
