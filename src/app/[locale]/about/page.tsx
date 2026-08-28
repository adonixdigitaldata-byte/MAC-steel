import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { DisplayL, DisplayM, BodyText, MetaText } from "@/components/ui/Typography";

export default async function AboutPage({
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
      {/* 01. COMPANY INTRO */}
      <Section world="bone">
        <Container>
          <PageHeader
            index="ABOUT-01"
            label={isRtl ? "المؤسسة / البيان الهندسي" : "COMPANY / ARCHITECTURAL PURPOSE"}
            title={isRtl ? "مصممة للأنظمة التي تدوم." : "ENGINEERED FOR SYSTEMS THAT LAST."}
            description={
              isRtl
                ? "نحن نتخصص في توريد وتصنيع المكونات الفولاذية الصلبة والأنظمة الهيكلية الحرجة للمشاريع الصناعية والبنية التحتية."
                : "Manufacturing high-precision metal components, structural steel assemblies, and infrastructure solutions for heavy industrial applications."
            }
            locale={locale as Locale}
            world="bone"
          />

          {/* 02. NARRATIVE POSITIONING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16">
            <div className="lg:col-span-7 space-y-6">
              <DisplayM className="text-carbon leading-snug">
                {isRtl
                  ? "الجودة الهندسية ليست مجرد معيار، بل هي الأساس الفيزيائي لكل مكون ننتجه."
                  : "STRUCTURAL INTEGRITY IS NOT SIMPLY A CERTIFICATE—IT IS THE PHYSICAL FOUNDATION OF EVERY COMPONENT WE SPECIFY."}
              </DisplayM>

              <BodyText className="text-carbon/80 text-base sm:text-lg leading-relaxed">
                {isRtl
                  ? "تعتمد فلسفتنا الهندسية على الدقة المتناهية في الحسابات والأبعاد، واختيار أجود سبيكة فولاذية تقاوم الصدمات والتآكل البيئي."
                  : "Our engineering philosophy balances raw material purity, strict tolerance limits, and long-term subterranean durability."}
              </BodyText>

              {/* Data Status Note */}
              <div className="border border-bone-border bg-bone-surface p-4 sm:p-6 font-tech text-xs space-y-2 text-accent-mineral">
                <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-carbon">
                  <TechnicalLabel variant="copper">COMPANY HERITAGE NOTICE</TechnicalLabel>
                </div>
                <p className="text-[11px] leading-normal opacity-85">
                  {isRtl
                    ? "ملاحظة التطوير: سيتم إدراج تاريخ تأسيس الشركة الرسمي والطاقة الإنتاجية وشهادات ISO المعتمدة فور تزويدها من العميل."
                    : "Development note: Official incorporation history, plant capacity metrics, and certified ISO documentation will be supplied during integration."}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-s border-bone-border pt-8 lg:pt-0 lg:ps-8">
              <div className="space-y-2 border-b border-bone-border/60 pb-6">
                <MetaText className="text-accent-copper block font-bold">01 / MATERIALITY</MetaText>
                <h4 className="font-body text-base font-semibold text-carbon">
                  {isRtl ? "درجات الصلب العالية" : "High-Grade Steel Alloys"}
                </h4>
                <p className="font-body text-xs text-carbon/70 leading-relaxed">
                  {isRtl
                    ? "معايير دقيقة لاختيار الفولاذ المقاوم للصدمات والعوامل الجوية."
                    : "Strict metallurgical selection for stress-heavy structural applications."}
                </p>
              </div>

              <div className="space-y-2 border-b border-bone-border/60 pb-6">
                <MetaText className="text-accent-copper block font-bold">02 / TOLERANCE</MetaText>
                <h4 className="font-body text-base font-semibold text-carbon">
                  {isRtl ? "التسامح الهندي الدقيق" : "Precision Machining Tolerances"}
                </h4>
                <p className="font-body text-xs text-carbon/70 leading-relaxed">
                  {isRtl
                    ? "أبعاد دقيقة تضمن التوافق التام والتثبيت المحكم في الموقع."
                    : "Calculated dimensional accuracy for immediate site installation."}
                </p>
              </div>

              <div className="space-y-2">
                <MetaText className="text-accent-copper block font-bold">03 / SUSTAINABILITY</MetaText>
                <h4 className="font-body text-base font-semibold text-carbon">
                  {isRtl ? "استدامة البنية التحتية" : "Subterranean Resilience"}
                </h4>
                <p className="font-body text-xs text-carbon/70 leading-relaxed">
                  {isRtl
                    ? "مكونات مصممة لمقاومة الرطوبة والتآكل الكيميائي على المدى الطويل."
                    : "Engineered to withstand utility environment stresses and corrosion."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03. CORE CAPABILITIES (CARBON WORLD CONTRAST) */}
      <Section world="carbon">
        <Container>
          <SectionHeader
            index="02"
            label={isRtl ? "القدرات الهندسية" : "MANUFACTURING CAPABILITIES"}
            title={isRtl ? "أنظمة التصنيع وضمان الجودة" : "QUALITY & FABRICATION FRAMEWORK"}
            locale={locale as Locale}
            world="carbon"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-carbon-border bg-carbon-surface p-6 space-y-4">
              <NumberBadge number="01" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "التصنيع المخصص" : "CUSTOM FABRICATION"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "تصنيع المكونات الفولاذية والهياكل المعدنية حسب الرسومات الهندسية الخاصة بكل مشروع."
                  : "Tailored manufacturing of structural steel components according to client engineering drawings."}
              </p>
            </div>

            <div className="border border-carbon-border bg-carbon-surface p-6 space-y-4">
              <NumberBadge number="02" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "اختبارات الأحمال" : "STRESS & LOAD TESTING"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "إجراء فحوصات الجهد والشد لضمان قدرة المكونات على تحمل الضغوط العالية."
                  : "Rigorous mechanical testing ensuring load resistance and structural safety parameters."}
              </p>
            </div>

            <div className="border border-carbon-border bg-carbon-surface p-6 space-y-4">
              <NumberBadge number="03" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "التوثيق الفني" : "TECHNICAL DOCUMENTATION"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "توفير كامل شهادات الخامات وتقارير الفحص الفني لكل شحنة."
                  : "Full traceability, mill test certificates, and specification documentation supplied per batch."}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center pt-8 border-t border-carbon-border">
            <Button href={`/${locale}/contact`} locale={locale as Locale} variant="primary" world="carbon">
              {isRtl ? "طلب التواصل الهندسي" : "CONTACT TECHNICAL SPECIFIERS"}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
