import React from "react";
import { Locale } from "@/config/locales";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import { DisplayM, BodyText, MetaText } from "@/components/ui/Typography";

interface CompanySectionProps {
  locale: Locale;
}

export default function CompanySection({ locale }: CompanySectionProps) {
  const isRtl = locale === "ar";

  return (
    <Section world="bone" id="company">
      <Container>
        <SectionHeader
          index="02"
          label={isRtl ? "المؤسسة / الرؤية الهندسية" : "COMPANY / ARCHITECTURAL PURPOSE"}
          title={isRtl ? "الدقة الإنشائية وقوة التحمل" : "PRECISION CRAFT & MATERIAL STRENGTH"}
          locale={locale}
          world="bone"
        />

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Big Editorial Statement */}
          <div className="lg:col-span-7 space-y-6">
            <DisplayM className="text-carbon leading-snug">
              {isRtl
                ? "نحن نتخصص في تصميم وتصنيع المكونات الفولاذية الصلبة التي تشكل الأسس المتينة للمشاريع الكبرى."
                : "WE MANUFACTURE PRECISION STEEL COMPONENTS BUILT TO SUSTAIN CRITICAL INFRASTRUCTURE CONNECTIONS."}
            </DisplayM>

            <BodyText className="text-carbon/80 text-base sm:text-lg leading-relaxed">
              {isRtl
                ? "تعتمد منتجاتنا على أعلى معايير الجودة والمواصفات القياسية الدولية لضمان أداء موثوق وعمر افتراضي طويل في القاسية من ظروف العمل."
                : "Our products combine structural integrity, rigorous material specifications, and architectural precision for long-term endurance."}
            </BodyText>

            {/* Development Placeholder Note */}
            <div className="border border-bone-border bg-bone-surface p-4 sm:p-6 font-tech text-xs space-y-2 text-accent-mineral mt-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-carbon">
                <TechnicalLabel variant="copper">COMPANY DATA STATUS</TechnicalLabel>
              </div>
              <p className="text-[11px] leading-normal opacity-85">
                {isRtl
                  ? "سيتم تزويد السجل التاريخي الرسمي وشهادات الاعتماد والقدرة الإنتاجية من العميل في المرحلة اللاحقة."
                  : "Official company heritage, capacity metrics, and certified manufacturing standards will be supplied by the client during integration."}
              </p>
            </div>
          </div>

          {/* Right Column: 3 Strategic Pillars */}
          <div className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-s border-bone-border pt-8 lg:pt-0 lg:ps-8">
            <div className="space-y-2 border-b border-bone-border/60 pb-6">
              <MetaText className="text-accent-copper block font-bold">01 / MATERIALITY</MetaText>
              <h4 className="font-body text-base font-semibold text-carbon">
                {isRtl ? "نقاء ودرجة المواد" : "Material Grade Purity"}
              </h4>
              <p className="font-body text-xs text-carbon/70 leading-relaxed">
                {isRtl
                  ? "اختيار خامات الفولاذ المقاوم للصدمات والتآكل بأعلى المعايير."
                  : "Rigorous alloy selection and corrosion-resistant steel grades."}
              </p>
            </div>

            <div className="space-y-2 border-b border-bone-border/60 pb-6">
              <MetaText className="text-accent-copper block font-bold">02 / ENGINEERING</MetaText>
              <h4 className="font-body text-base font-semibold text-carbon">
                {isRtl ? "التصنيع الدقيق" : "Precision Tolerances"}
              </h4>
              <p className="font-body text-xs text-carbon/70 leading-relaxed">
                {isRtl
                  ? "قياسات دقيقة وأبعاد محددة لضمان التوافق التام أثناء التركيب."
                  : "Machined dimensions calculated for seamless site assembly."}
              </p>
            </div>

            <div className="space-y-2">
              <MetaText className="text-accent-copper block font-bold">03 / ENDURANCE</MetaText>
              <h4 className="font-body text-base font-semibold text-carbon">
                {isRtl ? "استدامة البنية التحتية" : "Infrastructure Longevity"}
              </h4>
              <p className="font-body text-xs text-carbon/70 leading-relaxed">
                {isRtl
                  ? "مكونات مصممة للبقاء والأداء المستمر في المشاريع الكبرى."
                  : "Components engineered for subterranean and heavy structural environments."}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
