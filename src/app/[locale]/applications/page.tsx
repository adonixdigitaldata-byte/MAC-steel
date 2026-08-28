import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale } from "@/config/locales";
import { APPLICATIONS } from "@/data/applications";
import { PRODUCTS } from "@/data/products";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import IconArrow from "@/components/ui/IconArrow";
import { DisplayM, BodyText, MetaText } from "@/components/ui/Typography";

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
    <main className="min-h-screen bg-carbon text-bone w-full max-w-full overflow-hidden">
      <Section world="carbon">
        <Container>
          <PageHeader
            index="SECTOR-03"
            label={isRtl ? "قطاعات الاستخدام والتطبيق" : "APPLICATION SECTORS ARCHIVE"}
            title={isRtl ? "أرشيف التطبيقات الهندسية" : "ENGINEERED SECTORS & USAGE ARCHIVE."}
            description={
              isRtl
                ? "دليل تفصيلي لاستخدامات مكوناتنا الفولاذية عبر قطاعات البنية التحتية والشبكات والإنشاءات الصناعية."
                : "Comprehensive breakdown of industrial applications, load conditions, and structural utility deployments."
            }
            locale={locale as Locale}
            world="carbon"
          />

          {/* Applications Catalogue Archive Stream */}
          <div className="space-y-12 sm:space-y-16">
            {APPLICATIONS.map((app, index) => {
              const formattedIdx = String(index + 1).padStart(2, "0");
              const relatedProduct = PRODUCTS[index % PRODUCTS.length];

              return (
                <div
                  key={app.id}
                  className="border border-carbon-border bg-carbon-surface p-6 sm:p-10 space-y-6 w-full max-w-full box-border"
                >
                  {/* Sector Header Notation */}
                  <div className="flex flex-wrap justify-between items-center pb-4 border-b border-carbon-border gap-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <NumberBadge number={formattedIdx} world="carbon" />
                      <TechnicalLabel variant="copper">
                        SECTOR REF / {app.id}
                      </TechnicalLabel>
                    </div>
                    <span className="font-tech text-xs text-accent-metal">
                      SPECIFICATION LEVEL: INDUSTRIAL
                    </span>
                  </div>

                  {/* Title & Description Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <DisplayM className="text-bone uppercase">
                        {isRtl ? app.nameAr : app.name}
                      </DisplayM>
                      <BodyText className="text-accent-metal text-sm sm:text-base leading-relaxed">
                        {isRtl
                          ? `أنظمة المكونات الفولاذية المعتمدة المصممة خصيصاً لتلبية المتطلبات الهندسية القاسية لقطاع ${app.nameAr}.`
                          : `High-precision structural steel assemblies, custom frames, and support systems specified for ${app.name} infrastructure projects.`}
                      </BodyText>
                    </div>

                    <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-s border-carbon-border pt-4 lg:pt-0 lg:ps-6 font-tech text-xs text-accent-metal">
                      <div className="space-y-1">
                        <span className="block text-[9px] opacity-60 uppercase">ENVIRONMENT</span>
                        <span className="font-bold text-bone block">Heavy Utility / Underground</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] opacity-60 uppercase">CORROSION RESISTANCE</span>
                        <span className="font-bold text-bone block">ASTM A123 / ISO 1461</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] opacity-60 uppercase">EXAMPLE COMPONENT</span>
                        <span className="font-bold text-accent-copper block truncate">
                          {isRtl ? relatedProduct.nameAr : relatedProduct.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-carbon-border flex flex-wrap items-center justify-between gap-4 font-tech text-xs">
                    <Link
                      href={`/${locale}/products/${relatedProduct.slug}`}
                      className="text-bone hover:text-accent-copper font-bold uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <span>{isRtl ? "عرض المنتج المرتبط" : "VIEW SAMPLE SPECIFICATION ITEM"}</span>
                      <IconArrow locale={locale as Locale} size={14} />
                    </Link>

                    <Button href={`/${locale}/contact`} locale={locale as Locale} variant="outline" world="carbon">
                      {isRtl ? "طلب استشارة للقطاع" : "SECTOR INQUIRY"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}
