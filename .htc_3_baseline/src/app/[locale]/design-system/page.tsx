import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale } from "@/config/locales";
import { PRODUCTS } from "@/data/products";

// UI Components
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { Container, Section } from "@/components/ui/Container";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import SpecificationBlock from "@/components/ui/SpecificationBlock";
import { Input, Textarea } from "@/components/ui/Input";
import IconArrow from "@/components/ui/IconArrow";
import {
  DisplayXL,
  DisplayL,
  DisplayM,
  Heading,
  BodyText,
  MetaText,
  MicroText,
} from "@/components/ui/Typography";

// Layout & Product Components
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import ProductCard from "@/components/products/ProductCard";
import ProductListItem from "@/components/products/ProductListItem";

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";
  const targetLocale: Locale = locale === "en" ? "ar" : "en";

  return (
    <main className="min-h-screen bg-carbon text-bone w-full max-w-full overflow-hidden">
      {/* 01. INTRO / PAGE HEADER */}
      <Section world="carbon">
        <Container>
          <div className="flex justify-between items-center gap-2 mb-6 sm:mb-8 pb-4 border-b border-carbon-border w-full max-w-full min-w-0">
            <TechnicalLabel variant="copper" className="truncate">
              INTERNAL VISUAL QA
            </TechnicalLabel>

            {/* Redesigned Language Switcher: Compact on mobile [ AR → ], Full on sm: */}
            <Link
              href={`/${targetLocale}/design-system`}
              className="font-tech text-[10px] sm:text-xs tracking-widest text-accent-metal hover:text-bone uppercase border border-carbon-border px-2 py-1 sm:px-3 sm:py-1.5 flex items-center space-x-1.5 rtl:space-x-reverse shrink-0 hover:border-bone transition-colors"
            >
              <span className="hidden sm:inline">
                SWITCH TO {targetLocale.toUpperCase()} ({targetLocale === "ar" ? "العربية" : "ENGLISH"})
              </span>
              <span className="sm:hidden font-bold">
                {targetLocale.toUpperCase()}
              </span>
              <IconArrow locale={locale as Locale} size={12} />
            </Link>
          </div>

          <PageHeader
            index="DS-01"
            label={isRtl ? "نظام التصميم الرقمي" : "DESIGN SYSTEM FOUNDATION"}
            title={isRtl ? "الهوية البصرية واللغة التفاعلية" : "VISUAL SYSTEM & INTERACTION LANGUAGE"}
            description={
              isRtl
                ? "معاينة المكونات ثنائية اللغة ونظام الخطوط والأنماط اللونية المعتمدة لشركة الصلب الصناعية."
                : "Bilingual component library, editorial typography hierarchy, color system, and layout primitives for industrial steel product presentation."
            }
            locale={locale as Locale}
            world="carbon"
          />
        </Container>
      </Section>

      {/* 02. COLOR PALETTE */}
      <Section world="bone">
        <Container>
          <SectionHeader
            index="01"
            label={isRtl ? "لوحة الألوان المعتمدة" : "LOCKED COLOR SYSTEM"}
            title={isRtl ? "العلاقة البصرية المحورية: CARBON ↔ BONE" : "PRIMARY CONTRAST: CARBON ↔ BONE"}
            description={
              isRtl
                ? "الألوان الرئيسية والمكملة المستخدمة في الواجهة دون التدرجات العشوائية."
                : "Exact locked palette. Carbon (#11110F) and Bone (#E7E2D8) dominate, accented by Raw Metal, Oxidized Copper, and Mineral."
            }
            locale={locale as Locale}
            world="bone"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            <div className="p-4 sm:p-6 bg-carbon text-bone border border-carbon-border space-y-2 sm:space-y-4 font-tech text-xs">
              <span className="block font-bold">CARBON</span>
              <span className="block text-accent-metal text-[11px]">#11110F</span>
              <span className="block text-[9px] opacity-75">World 01 / Hero</span>
            </div>

            <div className="p-4 sm:p-6 bg-world-bone text-carbon border border-bone-border space-y-2 sm:space-y-4 font-tech text-xs">
              <span className="block font-bold">BONE</span>
              <span className="block text-accent-mineral text-[11px]">#E7E2D8</span>
              <span className="block text-[9px] opacity-75">World 02 / Catalogue</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#96938B] text-carbon space-y-2 sm:space-y-4 font-tech text-xs">
              <span className="block font-bold">RAW METAL</span>
              <span className="block opacity-80 text-[11px]">#96938B</span>
              <span className="block text-[9px] opacity-75">Restrained Accent</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#875E48] text-bone space-y-2 sm:space-y-4 font-tech text-xs">
              <span className="block font-bold">COPPER</span>
              <span className="block opacity-90 text-[11px]">#875E48</span>
              <span className="block text-[9px] opacity-75">Highlight</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#596057] text-bone space-y-2 sm:space-y-4 font-tech text-xs col-span-2 sm:col-span-1">
              <span className="block font-bold">MINERAL</span>
              <span className="block opacity-90 text-[11px]">#596057</span>
              <span className="block text-[9px] opacity-75">Metadata Accent</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03. TYPOGRAPHY SCALE */}
      <Section world="carbon">
        <Container>
          <SectionHeader
            index="02"
            label={isRtl ? "نظام الخطوط والطباعة" : "TYPOGRAPHY SCALE"}
            title={isRtl ? "التسلسل الهرمي للنصوص" : "EDITORIAL SCALE & ALIGNMENT"}
            description={
              isRtl
                ? "استخدام Bebas Neue للعناوين الإنجليزية وIBM Plex Sans Arabic للعناوين والنصوص العربية."
                : "Structured hierarchy using Bebas Neue display statement sizes, IBM Plex Sans body, Space Mono technical metadata, and IBM Plex Sans Arabic."
            }
            locale={locale as Locale}
            world="carbon"
          />

          <div className="space-y-8 sm:space-y-12 border-t border-carbon-border pt-6 sm:pt-8">
            <div>
              <MetaText className="text-accent-metal block mb-2">DISPLAY XL / HERO STATEMENT</MetaText>
              <DisplayXL>{isRtl ? "مصممة للربط المتين" : "ENGINEERED TO CONNECT"}</DisplayXL>
            </div>

            <Divider world="carbon" />

            <div>
              <MetaText className="text-accent-metal block mb-2">DISPLAY L / SECTION HEADER</MetaText>
              <DisplayL>{isRtl ? "منتجات الصلب عالية الدقة" : "HIGH-PRECISION STEEL PRODUCTS"}</DisplayL>
            </div>

            <Divider world="carbon" />

            <div>
              <MetaText className="text-accent-metal block mb-2">DISPLAY M / SUBSECTION TITLE</MetaText>
              <DisplayM>{isRtl ? "مكونات هيكلية للبنية التحتية" : "STRUCTURAL INFRASTRUCTURE COMPONENTS"}</DisplayM>
            </div>

            <Divider world="carbon" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <MetaText className="text-accent-metal block mb-2">HEADING</MetaText>
                <Heading>{isRtl ? "إطار مطلي بالمجلفن عالي الكثافة" : "Heavy-Duty Hot-Dip Galvanized Frame"}</Heading>
              </div>

              <div>
                <MetaText className="text-accent-metal block mb-2">BODY TEXT</MetaText>
                <BodyText>
                  {isRtl
                    ? "تم تصنيع هذه المكونات طبقاً لأعلى المعايير الهندسية لضمان تحمل الضغوط والظروف الجوية القاسية."
                    : "Components engineered for high stress resistance, subterranean utility protection, and heavy structural load support."}
                </BodyText>
              </div>

              <div>
                <MetaText className="text-accent-metal block mb-2">META & MICRO TEXT (SPACE MONO)</MetaText>
                <div className="space-y-2">
                  <MetaText className="block text-accent-copper">CAD-REF: SS-316L-GRATE</MetaText>
                  <MicroText className="block text-accent-metal">SPECIFICATION / ISO 9001 / REVISED 2026</MicroText>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 04. BUTTONS & LABELS */}
      <Section world="bone">
        <Container>
          <SectionHeader
            index="03"
            label={isRtl ? "الأزرار والوسوم الهندسية" : "BUTTON & ANNOTATION SYSTEM"}
            title={isRtl ? "التفاعل الفيزيائي المتقن" : "PHYSICAL & DIRECTIONAL INTERACTION"}
            locale={locale as Locale}
            world="bone"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Buttons Showcase */}
            <div className="space-y-4 sm:space-y-6">
              <MetaText className="text-accent-mineral block font-bold">BUTTON VARIANTS (DIRECTION-AWARE ARROWS)</MetaText>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                <Button locale={locale as Locale} variant="primary" world="bone">
                  {isRtl ? "+ إضافة إلى الطلب" : "ADD TO REQUEST"}
                </Button>

                <Button locale={locale as Locale} variant="secondary" world="bone">
                  {isRtl ? "عرض الكتالوج" : "VIEW CATALOGUE"}
                </Button>

                <Button locale={locale as Locale} variant="outline" world="bone">
                  {isRtl ? "استكشاف المنتجات" : "EXPLORE PRODUCTS"}
                </Button>

                <Button locale={locale as Locale} variant="ghost" world="bone">
                  {isRtl ? "التواصل المباشر" : "DIRECT CONTACT"}
                </Button>
              </div>
            </div>

            {/* Technical Labels & Number Badges */}
            <div className="space-y-4 sm:space-y-6">
              <MetaText className="text-accent-mineral block font-bold">TECHNICAL LABELS & NUMBER BADGES</MetaText>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                <TechnicalLabel variant="copper">PRODUCT / 024</TechnicalLabel>
                <TechnicalLabel variant="metal">APPLICATION / CIVIL</TechnicalLabel>
                <TechnicalLabel variant="mineral">MATERIAL / SS 316L</TechnicalLabel>
                <NumberBadge number="01" world="bone" />
                <NumberBadge number="24" prefix="ITEM" world="bone" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 05. PRODUCT UI & PLACEHOLDERS */}
      <Section world="bone" className="border-t border-bone-border">
        <Container>
          <SectionHeader
            index="04"
            label={isRtl ? "واجهة عرض المنتجات" : "PRODUCT CATALOGUE UI"}
            title={isRtl ? "البطاقات والجداول الهندسية" : "EDITORIAL CARDS & SPECIFICATION BLOCKS"}
            locale={locale as Locale}
            world="bone"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Product Card Showcase */}
            <div className="lg:col-span-1">
              <MetaText className="text-accent-mineral block mb-4 font-bold">PRODUCT CARD (EDITORIAL CATALOGUE)</MetaText>
              <ProductCard product={PRODUCTS[0]} locale={locale as Locale} world="bone" index={0} />
            </div>

            {/* Industrial Placeholder & Spec Block */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div>
                <MetaText className="text-accent-mineral block mb-4 font-bold">INDUSTRIAL PLACEHOLDER FRAME</MetaText>
                <ProductPlaceholder
                  productId={PRODUCTS[1].id}
                  category={PRODUCTS[1].category}
                  name={PRODUCTS[1].name}
                  world="bone"
                  aspectRatio="video"
                />
              </div>

              <div>
                <MetaText className="text-accent-mineral block mb-4 font-bold">SPECIFICATION BLOCK (SPACE MONO)</MetaText>
                <SpecificationBlock
                  material="SS 316L"
                  grade="316L / DIN 1.4404"
                  size="Ø20 MM / 1000x500 MM"
                  application="ELECTRICAL & TELECOM"
                  locale={locale as Locale}
                  world="bone"
                />
              </div>
            </div>
          </div>

          {/* Product List Row */}
          <div>
            <MetaText className="text-accent-mineral block mb-4 font-bold">HORIZONTAL PRODUCT ROW (MOBILE/LIST VIEW)</MetaText>
            <ProductListItem product={PRODUCTS[1]} locale={locale as Locale} world="bone" index={1} />
          </div>
        </Container>
      </Section>

      {/* 06. FORM INPUTS */}
      <Section world="carbon">
        <Container>
          <SectionHeader
            index="05"
            label={isRtl ? "عناصر النماذج والبيانات" : "TECHNICAL FORM FOUNDATION"}
            title={isRtl ? "حقول الإدخال والطلبات" : "MINIMALIST INPUTS & STATES"}
            locale={locale as Locale}
            world="carbon"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl">
            <Input
              label={isRtl ? "الاسم الكامل *" : "FULL NAME *"}
              placeholder={isRtl ? "أدخل الاسم هنا..." : "Enter full name..."}
              world="carbon"
            />

            <Input
              label={isRtl ? "رقم الجوال *" : "MOBILE NUMBER *"}
              placeholder="+000 00 000 0000"
              world="carbon"
            />

            <div className="md:col-span-2">
              <Textarea
                label={isRtl ? "تفاصيل الطلب / المواصفات المطلوبة" : "REQUEST DETAILS / SPECIFICATIONS"}
                placeholder={isRtl ? "اكتب المواصفات والكميات..." : "Describe required quantities and dimensions..."}
                world="carbon"
              />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
