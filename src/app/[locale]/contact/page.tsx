"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";
import { SITE_CONFIG } from "@/data/config";

// UI Components
import { Container, Section } from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { DisplayM, BodyText } from "@/components/ui/Typography";

// Motion Library (HTC-4.4.5)
import { FadeReveal, TechnicalDivider } from "@/components/motion";

export default function ContactPage() {
  const params = useParams();
  const localeStr = (params?.locale as string) || "en";
  const locale = (isValidLocale(localeStr) ? localeStr : "en") as Locale;
  const isRtl = locale === "ar";

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    sector: "Infrastructure",
    quantity: "",
    specs: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <main className="min-h-screen bg-carbon text-bone w-full max-w-full overflow-hidden">
      {/* 01. TIERED HERO ARCHITECTURE WITH 4K DYNAMIC SLIDESHOW */}
      <PageHero
        eyebrow={isRtl ? "مكتب التوصيف والاستفسارات" : "SPECIFIER DESK"}
        title={isRtl ? "طلب عروض الأسعار والتوصيف الهندسي." : "DIRECT SPECIFICATION & RFQ INQUIRY."}
        description={
          isRtl
            ? "قم بتعبئة نموذج الطلب الفني أدناه لمراجعة الرسومات والمواصفات والكميات من قبل مهندسينا المختصين."
            : "Direct technical submission portal for fabrication drawings, quantity schedules, mill certifications, and custom structural quotations."
        }
        breadcrumb={isRtl ? "الرئيسية / التواصل" : "HOME / CONTACT"}
        backgroundSlideshow={[
          "/hero-contact-1.jpg",
          "/hero-contact-2.jpg",
          "/hero-contact-3.jpg",
        ]}
        showRightSpec={false}
        showDocumentId={false}
        primaryAction={{
          label: isRtl ? "تقديم طلب تسعير" : "Submit RFQ",
          href: "#rfq-form",
          variant: "primary",
        }}
        secondaryAction={{
          label: isRtl ? "واتساب الهندسي" : "WhatsApp Engineering",
          href: whatsappHref,
          variant: "outline",
          isExternal: true,
        }}
        locale={locale}
      />

      <Section world="carbon">
        <Container>
          <div id="rfq-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start pt-4 sm:pt-8 scroll-mt-28">
            {/* Left / Direct Channel Metadata Panel */}
            <FadeReveal className="lg:col-span-5 space-y-6 border border-carbon-border bg-carbon-surface p-6 sm:p-8 hover:border-accent-copper/60 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.4)] transition-all duration-300 rounded-sm" y={24} duration={750}>
              <div className="flex items-center space-x-3 rtl:space-x-reverse pb-4 border-b border-carbon-border">
                <NumberBadge number="05" world="carbon" />
                <TechnicalLabel variant="copper">SPECIFICATION OFFICE</TechnicalLabel>
              </div>

              <DisplayM className="text-bone text-2xl uppercase">
                {isRtl ? "قنوات التواصل المباشرة" : "ENGINEERING SUPPORT DIRECT"}
              </DisplayM>

              <BodyText className="text-accent-metal text-xs sm:text-sm leading-relaxed">
                {isRtl
                  ? "فريق المتخصصين جاهز لمراجعة المتطلبات الفنية وتوفير عروض الأسعار الرسمية."
                  : "Our specifiers examine load tolerances, material grades, and CAD requirements for accurate quoting."}
              </BodyText>

              <div className="space-y-4 font-tech text-xs border-t border-carbon-border pt-6 text-accent-metal">
                <div className="group/item">
                  <span className="block text-[9px] opacity-60 uppercase mb-0.5">DIRECT WHATSAPP CHANNEL</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-bone block hover:text-accent-copper transition-colors"
                  >
                    {SITE_CONFIG.whatsappNumber}
                  </a>
                </div>
                <div>
                  <span className="block text-[9px] opacity-60 uppercase mb-0.5">DIRECT SPECIFIER EMAIL</span>
                  <a
                    href={`mailto:${SITE_CONFIG.contactEmail}`}
                    className="font-bold text-bone block hover:text-accent-copper transition-colors"
                  >
                    {SITE_CONFIG.contactEmail}
                  </a>
                </div>
                <div>
                  <span className="block text-[9px] opacity-60 uppercase mb-0.5">FABRICATION FACILITY</span>
                  <span className="font-bold text-bone block">{SITE_CONFIG.location[locale]}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-accent-copper text-[11px]">ENGINEERING REVIEW ACTIVE</span>
                </div>
              </div>
            </FadeReveal>

            {/* Right / Technical Inquiry Document Form */}
            <FadeReveal className="lg:col-span-7 border border-carbon-border bg-carbon-surface p-6 sm:p-10 space-y-6 hover:border-carbon-border/90 hover:shadow-[0_16px_32px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-sm" delay={120} y={24} duration={750}>
              <div className="flex justify-between items-center pb-4 border-b border-carbon-border">
                <TechnicalLabel variant="copper">
                  DOCUMENT / REQ-2026
                </TechnicalLabel>
                <span className="font-tech text-xs text-accent-metal">
                  STATUS: INQUIRY FORM
                </span>
              </div>

              {formSubmitted ? (
                <div className="p-8 border border-accent-copper bg-carbon text-center space-y-4 my-8">
                  <TechnicalLabel variant="copper">DOCUMENT LOGGED</TechnicalLabel>
                  <DisplayM className="text-bone">
                    {isRtl ? "تم استلام الطلب الفني" : "INQUIRY LOGGED SUCCESSFULLY"}
                  </DisplayM>
                  <BodyText className="text-accent-metal text-sm">
                    {isRtl
                      ? "شكراً لتواصلك. سيقوم مهندس المواصفات بمراجعة البيانات والتواصل معك."
                      : "Thank you for submitting your specification parameters. Our engineering department will review your request."}
                  </BodyText>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="font-tech text-xs text-accent-copper underline uppercase pt-4 block mx-auto hover:text-bone transition-colors"
                  >
                    {isRtl ? "إرسال طلب آخر" : "SUBMIT ANOTHER INQUIRY"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label={isRtl ? "الاسم الكامل *" : "FULL NAME *"}
                      placeholder={isRtl ? "أدخل الاسم..." : "Enter full name..."}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      world="carbon"
                    />

                    <Input
                      label={isRtl ? "اسم الشركة / الجهة *" : "COMPANY / ORGANIZATION *"}
                      placeholder={isRtl ? "أدخل اسم الشركة..." : "Enter company name..."}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      world="carbon"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label={isRtl ? "البريد الإلكتروني *" : "EMAIL ADDRESS *"}
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      world="carbon"
                    />

                    <Input
                      label={isRtl ? "رقم الجوال / الهاتف *" : "PHONE / MOBILE *"}
                      type="tel"
                      placeholder="+000 00 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      world="carbon"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label={isRtl ? "الكمية / الأبعاد التقديرية" : "ESTIMATED QUANTITY / DIMENSIONS"}
                      placeholder={isRtl ? "مثال: 500 متر / 100 قطعة" : "e.g., 500 Meters / 100 Units"}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      world="carbon"
                    />

                    <div className="space-y-1.5 font-tech text-xs">
                      <label className="block tracking-wider uppercase text-accent-metal font-medium">
                        {isRtl ? "قطاع الاستخدام *" : "APPLICATION SECTOR *"}
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full bg-carbon border border-carbon-border p-3 text-bone font-tech text-xs focus:outline-none focus:border-bone transition-colors uppercase"
                      >
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Civil Works">Civil Works</option>
                        <option value="Electrical & Telecom">Electrical & Telecom</option>
                        <option value="Utility Systems">Utility Systems</option>
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label={isRtl ? "تفاصيل الطلب / المواصفات الهندسية *" : "REQUEST DETAILS / TECHNICAL SPECIFICATIONS *"}
                    placeholder={
                      isRtl
                        ? "أدخل تفاصيل المقاسات والمعايير المطلوبة..."
                        : "Describe required dimensions, material grades, or project specifications..."
                    }
                    rows={4}
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    required
                    world="carbon"
                  />

                  <div className="pt-4 border-t border-carbon-border">
                    <Button type="submit" locale={locale} variant="primary" world="carbon" className="w-full">
                      {isRtl ? "تقديم طلب المواصفات الرسمية" : "SUBMIT SPECIFICATION REQUEST DOCUMENT"}
                    </Button>
                  </div>
                </form>
              )}
            </FadeReveal>
          </div>
        </Container>
      </Section>

      {/* Technical Transition Divider */}
      <TechnicalDivider world="carbon" label="END OF INQUIRY" documentId="DOC-RFQ-END-2026" />
    </main>
  );
}
