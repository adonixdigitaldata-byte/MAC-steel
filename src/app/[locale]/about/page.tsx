import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, Locale } from "@/config/locales";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { DisplayM, BodyText } from "@/components/ui/Typography";

// Motion Library
import { FadeReveal, StaggerGroup, TechnicalDivider } from "@/components/motion";

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

  const timelineSteps = [
    {
      year: "2018",
      title: isRtl ? "التأسيس والاعتماد الأولي" : "Foundry & Tooling Establishment",
      desc: isRtl
        ? "تدشين خطوط التصنيع الأولى للمكونات الفولاذية واعتماد معايير الجودة ISO 9001."
        : "Commissioning of core structural steel machining tooling and ISO 9001 manufacturing accreditation in Jeddah.",
    },
    {
      year: "2021",
      title: isRtl ? "توسعة خطوط الجلفنة والغمس الساخن" : "Hot-Dip Galvanizing & CNC Expansion",
      desc: isRtl
        ? "إضافة خطوط الجلفنة بالحرارة بطاقة عالية ومكائن القطع والتشكيل بالتحكم الرقمي CNC."
        : "Deployment of high-capacity ASTM A123 hot-dip galvanizing kettles and automated multi-axis CNC drilling arrays.",
    },
    {
      year: "2024",
      title: isRtl ? "اعتماد مشاريع البنية التحتية الكبرى" : "National Infrastructure Supply",
      desc: isRtl
        ? "توريد مكونات غرف التفتيش ومرابط الرسو للمشاريع الكبرى وشبكات المرافق الوطنية."
        : "Master vendor qualification across sovereign utility expansions, rail corridors, and subterranean tunnel contracts.",
    },
    {
      year: "2026",
      title: isRtl ? "الجيل الهندسي المتقدم" : "Digital Precision & Automated QC",
      desc: isRtl
        ? "دمج أنظمة الفحص بالموجات فوق الصوتية وتتبع الشحنات بشهادات الفحص الرقمية 1:1."
        : "Integration of 100% ultrasonic weld testing, CMM dimensional verification, and digital mill certificate traceability.",
    },
  ];

  const qcJourneySteps = [
    {
      step: "01",
      title: isRtl ? "فحص نقاء السبيكة الفولاذية" : "Raw Material Spectrometry",
      code: "MET-QC-01",
      desc: isRtl
        ? "تحليل التركيب الكيميائي لكل شحنة فولاذ للتأكد من نسب الكربون والكروم والنيكل قبل التصنيع."
        : "Optical emission spectrometry verifying carbon, chromium, and nickel composition against ASTM A36 / SS316 standards.",
    },
    {
      step: "02",
      title: isRtl ? "التشكيل والتصنيع الدقيق CNC" : "Multi-Axis CNC Machining",
      code: "CNC-QC-02",
      desc: isRtl
        ? "قص وتشكيل وثقب الألواح والزوايا بتفاوتات هندسية لا تتجاوز ±0.05 مم."
        : "Precision cutting, thread rolling, and hole punching maintaining strict ±0.05 mm mechanical tolerances.",
    },
    {
      step: "03",
      title: isRtl ? "المعالجة الحرارية والجلفنة" : "Galvanizing & Passivation",
      code: "HDG-QC-03",
      desc: isRtl
        ? "معالجة الأسطح بالجلفنة بالغمس الساخن (ASTM A123) أو التخميل الحمضي للفولاذ المقاوم للصدأ."
        : "Submersion in molten zinc kettle (>85µm coating) or nitric-hydrofluoric acid bath for stainless steel passivation.",
    },
    {
      step: "04",
      title: isRtl ? "الفحص النهائي واختبارات الإجهاد" : "Proof Load & Non-Destructive Testing",
      code: "NDT-QC-04",
      desc: isRtl
        ? "إجراء فحوصات الشد والجهد الميكانيكي والفحص بالموجات فوق الصوتية قبل اعتماد الشحنة."
        : "Hydraulic tensile pull testing and ultrasonic non-destructive weld inspection with batch mill test certificates.",
    },
  ];

  const certifications = [
    {
      badge: "ISO 9001:2015",
      title: isRtl ? "نظام إدارة الجودة المعتمد" : "Quality Management System",
      issuer: "TUV Rheinland Certified",
      ref: "REG-ISO-9001-KSA",
    },
    {
      badge: "ASTM A123 / A153",
      title: isRtl ? "معيار الجلفنة بالحرارة" : "Hot-Dip Zinc Coatings Standard",
      issuer: "American Society for Testing Materials",
      ref: "STD-ASTM-HDG-2026",
    },
    {
      badge: "AWS D1.1M",
      title: isRtl ? "معايير اللحام الهيكلي" : "Structural Welding Code - Steel",
      issuer: "American Welding Society",
      ref: "CODE-AWS-D1.1-CERT",
    },
    {
      badge: "SASO / ISO 1461",
      title: isRtl ? "المطابقة السعودية للمواصفات" : "Saudi National Standards Compliance",
      issuer: "Saudi Standards, Metrology and Quality",
      ref: "SASO-QUAL-APPROVED",
    },
  ];

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      {/* 01. TIER-2 PAGEHERO */}
      <PageHero
        eyebrow={isRtl ? "التصنيع والقدرات الهندسية" : "MANUFACTURING CREDIBILITY"}
        documentId="DOC-MGF-PLANT-2026"
        title={isRtl ? "دقة التصنيع وموثوقية المواد." : "MANUFACTURED FOR EXTREME LOADS."}
        description={
          isRtl
            ? "نظرة تفصيلية على منشأتنا الصناعية في المملكة العربية السعودية: خطوط التشكيل والقطع، معايير الجلفنة، ورحلة ضبط الجودة الصارمة 1:1."
            : "A comprehensive look inside our Saudi-based manufacturing facility: precision machining, hot-dip galvanizing lines, and our 4-stage quality assurance protocol."
        }
        breadcrumb={isRtl ? "الرئيسية / المؤسسة والتصنيع" : "HOME / MANUFACTURING"}
        overlayStyle="warm"
        primaryAction={{
          label: isRtl ? "رحلة ضبط الجودة" : "Quality Journey",
          href: "#qc-protocol",
          variant: "primary",
        }}
        secondaryAction={{
          label: isRtl ? "طلب زيارة المصنع" : "Factory Inquiry",
          href: `/${locale}/contact`,
          variant: "outline",
        }}
        locale={locale as Locale}
      />

      {/* 02. EDITORIAL TIMELINE & HERITAGE */}
      <Section world="bone" className="pt-12 sm:pt-16">
        <Container>
          <FadeReveal y={20} duration={650}>
            <SectionHeader
              index="01"
              label={isRtl ? "تاريخ التطوير الهندسي" : "INDUSTRIAL EVOLUTION"}
              title={isRtl ? "مسيرة التميز الهندسي في المملكة" : "CHRONOLOGY OF MANUFACTURING EXCELLENCE"}
              locale={locale as Locale}
              world="bone"
            />
          </FadeReveal>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={80}>
            {timelineSteps.map((item, idx) => (
              <div
                key={idx}
                className="border border-bone-border bg-bone-surface p-6 space-y-3 hover:border-carbon/40 transition-colors relative"
              >
                <span className="font-display text-4xl text-accent-copper block leading-none">
                  {item.year}
                </span>
                <span className="font-tech text-xs font-bold text-carbon block uppercase">
                  {item.title}
                </span>
                <p className="font-body text-xs text-carbon/75 leading-relaxed">
                  {item.desc}
                </p>
                <span className="absolute top-4 end-4 font-tech text-[9px] text-accent-mineral font-mono">
                  [STEP 0{idx + 1}]
                </span>
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      {/* Technical Transition Divider */}
      <TechnicalDivider world="bone" label="CAPABILITIES MATRIX" documentId="DOC-MGF-CAP-2026" />

      {/* 03. CORE CAPABILITIES (CARBON WORLD CONTRAST) */}
      <Section world="carbon" className="py-16 sm:py-24">
        <Container>
          <FadeReveal y={20} duration={650}>
            <SectionHeader
              index="02"
              label={isRtl ? "قدرات خطوط الإنتاج" : "FABRICATION CAPABILITIES"}
              title={isRtl ? "أنظمة التصنيع والتجهيز الهندسي" : "CORE PRODUCTION & MACHINING ARRAYS"}
              locale={locale as Locale}
              world="carbon"
            />
          </FadeReveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={90}>
            <div className="border border-carbon-border bg-carbon-surface p-6 sm:p-8 space-y-4 hover:border-accent-copper/60 transition-colors">
              <NumberBadge number="01" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "القطع والتشكيل بالتحكم الرقمي CNC" : "AUTOMATED CNC FORMING"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "مكائن قطع بالليزر والبلازما ومكابس هيدروليكية قادرة على تشكيل ألواح الفولاذ حتى سمك 50 مم بدقة متناهية."
                  : "High-precision laser cutting, automated punching, and heavy press brakes capable of forming structural plates up to 50mm thickness."}
              </p>
              <div className="pt-2 font-tech text-[10px] text-accent-copper">
                TOLERANCE CAPACITY: ±0.05 MM
              </div>
            </div>

            <div className="border border-carbon-border bg-carbon-surface p-6 sm:p-8 space-y-4 hover:border-accent-copper/60 transition-colors">
              <NumberBadge number="02" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "الجلفنة بالغمس الساخن ASTM A123" : "HOT-DIP GALVANIZING KETTLES"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "أحواض جلفنة حرارية عميقة تغطي الهياكل الفولاذية بطبقة زنك تتجاوز 85 ميكرون لمقاومة الصدأ والتربة الكيميائية."
                  : "Industrial zinc kettle immersion exceeding 85 microns protective thickness for maximum subterranean and marine lifespan."}
              </p>
              <div className="pt-2 font-tech text-[10px] text-accent-copper">
                COATING STANDARD: ASTM A123 / ISO 1461
              </div>
            </div>

            <div className="border border-carbon-border bg-carbon-surface p-6 sm:p-8 space-y-4 hover:border-accent-copper/60 transition-colors">
              <NumberBadge number="03" world="carbon" />
              <h3 className="font-display text-2xl text-bone uppercase">
                {isRtl ? "تشغيل الفولاذ المقاوم للصدأ SS 316L" : "STAINLESS STEEL FABRICATION"}
              </h3>
              <p className="font-body text-xs text-accent-metal leading-relaxed">
                {isRtl
                  ? "خط مخصص لمعالجة وتلحيم سبائك الفولاذ 316L و 304 مع معالجة التخميل الكيميائي لإزالة الشوائب بعد اللحام."
                  : "Dedicated non-ferrous clean fabrication line for SS316L/304 with pickling and passivation baths preventing intergranular corrosion."}
              </p>
              <div className="pt-2 font-tech text-[10px] text-accent-copper">
                ALLOY SPECIFICATION: A4-70 / A4-80
              </div>
            </div>
          </StaggerGroup>
        </Container>
      </Section>

      {/* Technical Transition Divider */}
      <TechnicalDivider world="bone" label="QUALITY ASSURANCE" documentId="DOC-MGF-QC-2026" />

      {/* 04. QUALITY CONTROL JOURNEY PROTOCOL */}
      <div id="qc-protocol" className="scroll-mt-24">
        <Section world="bone" className="py-16 sm:py-24">
          <Container>
            <FadeReveal y={20} duration={650}>
              <SectionHeader
                index="03"
                label={isRtl ? "مراحل ضبط الجودة" : "QUALITY ASSURANCE PROTOCOL"}
                title={isRtl ? "رحلة الفحص والاختبار الميكانيكي 1:1" : "FOUR-STAGE QUALITY CONTROL JOURNEY"}
                locale={locale as Locale}
                world="bone"
              />
            </FadeReveal>

            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={80}>
              {qcJourneySteps.map((step) => (
                <div
                  key={step.step}
                  className="border border-bone-border bg-bone-surface p-6 space-y-3 hover:border-accent-copper transition-colors"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-bone-border">
                    <span className="font-tech text-xs font-bold text-accent-copper">
                      STAGE // {step.step}
                    </span>
                    <span className="font-tech text-[9px] text-accent-mineral font-mono">
                      {step.code}
                    </span>
                  </div>
                  <h4 className="font-display text-xl text-carbon uppercase">
                    {step.title}
                  </h4>
                  <p className="font-body text-xs text-carbon/75 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </StaggerGroup>
          </Container>
        </Section>
      </div>

      {/* 05. CERTIFICATION & ACCREDITATION CARDS */}
      <Section world="carbon" className="py-16 sm:py-24">
        <Container>
          <FadeReveal y={20} duration={650}>
            <SectionHeader
              index="04"
              label={isRtl ? "الشهادات والاعتمادات" : "ACCREDITATIONS & STANDARDS"}
              title={isRtl ? "شهادات الجودة والمعايير المعتمدة" : "CERTIFIED ENGINEERING COMPLIANCE"}
              locale={locale as Locale}
              world="carbon"
            />
          </FadeReveal>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={80}>
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="border border-carbon-border bg-carbon-surface p-6 space-y-3 hover:border-bone transition-colors"
              >
                <div className="font-tech text-xs font-bold text-accent-copper border border-accent-copper/40 px-2 py-1 inline-block bg-accent-copper/10">
                  {cert.badge}
                </div>
                <h4 className="font-display text-xl text-bone uppercase">
                  {cert.title}
                </h4>
                <p className="font-tech text-[10px] text-accent-metal">
                  {cert.issuer}
                </p>
                <div className="pt-2 border-t border-carbon-border/50 font-tech text-[9px] text-accent-metal/60">
                  DOC REF: {cert.ref}
                </div>
              </div>
            ))}
          </StaggerGroup>

          {/* Bottom RFQ CTA */}
          <FadeReveal delay={150} className="mt-14 pt-8 border-t border-carbon-border text-center space-y-4">
            <h3 className="font-display text-3xl sm:text-4xl text-bone uppercase">
              {isRtl ? "هل تحتاج إلى تصنيع فولاذي مخصص لمشروعك؟" : "READY TO SPECIFY CUSTOM STRUCTURAL COMPONENTS?"}
            </h3>
            <p className="font-body text-xs sm:text-sm text-accent-metal max-w-xl mx-auto">
              {isRtl
                ? "مهندسونا جاهزون لمراجعة المخططات الفنية وتقديم عروض الأسعار وجداول الكميات المعتمدة."
                : "Our engineering department reviews project drawings, quantity schedules, and custom fabrication parameters."}
            </p>
            <div className="pt-2">
              <Button
                href={`/${locale}/contact`}
                locale={locale as Locale}
                variant="primary"
                world="carbon"
              >
                {isRtl ? "طلب التواصل والمواصفات الفنية" : "SUBMIT SPECIFICATION INQUIRY"}
              </Button>
            </div>
          </FadeReveal>
        </Container>
      </Section>
    </main>
  );
}
