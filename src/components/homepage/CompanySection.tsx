import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import IconArrow from "@/components/ui/IconArrow";
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
          label={isRtl ? "المؤسسة // نظرة عامة" : "COMPANY // ARCHITECTURAL PURPOSE"}
          title={isRtl ? "الدقة الإنشائية وقوة التحمل" : "PRECISION CRAFT & MATERIAL STRENGTH"}
          locale={locale}
          world="bone"
        />

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Big Editorial Statement + Plant Proof */}
          <div className="lg:col-span-7 space-y-6">
            <DisplayM className="text-carbon leading-snug">
              {isRtl
                ? "نحن نصنع المكونات الفولاذية الصلبة التي تشكل الأسس المتينة للمشاريع الكبرى."
                : "WE MANUFACTURE PRECISION STEEL COMPONENTS BUILT TO SUSTAIN CRITICAL INFRASTRUCTURE CONNECTIONS."}
            </DisplayM>

            <BodyText className="text-carbon/80 text-base sm:text-lg leading-relaxed">
              {isRtl
                ? "خبرة هندسية تمتد عبر المشاريع الصناعية والبنية التحتية، مع الالتزام التام بالمطابقة الدقيقة للمخططات."
                : "Combining strict metallurgical purity, micro-machining tolerances, and subterranean durability for long-term project safety."}
            </BodyText>

            {/* Certified Fabrication & Quality Framework */}
            <div className="border border-bone-border bg-bone-surface p-4 sm:p-5 font-tech text-xs space-y-3 mt-4 text-carbon shadow-sm">
              <div className="flex items-center justify-between border-b border-bone-border/60 pb-2">
                <TechnicalLabel variant="copper">PLANT SPECIFICATIONS & CERTIFICATION</TechnicalLabel>
                <span className="text-[10px] text-accent-mineral font-bold">ISO 9001:2015</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                <div>
                  <span className="text-accent-mineral block text-[9px]">CAPACITY</span>
                  <span className="font-bold text-carbon">12,000 MT / YEAR</span>
                </div>
                <div>
                  <span className="text-accent-mineral block text-[9px]">METALLURGY</span>
                  <span className="font-bold text-carbon">316L / 304 / S355</span>
                </div>
                <div>
                  <span className="text-accent-mineral block text-[9px]">TRACEABILITY</span>
                  <span className="font-bold text-carbon">100% HEAT LOT</span>
                </div>
              </div>
            </div>

            {/* Read Our Story Link CTA */}
            <div className="pt-2">
              <Link
                href={`/${locale}/about`}
                className="group inline-flex items-center space-x-3 rtl:space-x-reverse font-tech text-xs sm:text-sm font-bold tracking-widest text-carbon hover:text-accent-copper uppercase transition-colors"
              >
                <span>{isRtl ? "قراءة قصة كونتراتك ومعايير المصنع" : "READ OUR STORY & MANUFACTURING HERITAGE"}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
                  <IconArrow locale={locale} size={14} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Strategic Pillars */}
          <div className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-s border-bone-border pt-8 lg:pt-0 lg:ps-8">
            <div className="space-y-2 border-b border-bone-border/60 pb-5 group hover:ps-1 transition-all">
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

            <div className="space-y-2 border-b border-bone-border/60 pb-5 group hover:ps-1 transition-all">
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

            <div className="space-y-2 group hover:ps-1 transition-all">
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


