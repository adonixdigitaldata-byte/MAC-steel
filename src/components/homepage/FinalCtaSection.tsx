import React from "react";
import { Locale } from "@/config/locales";
import { Container, Section } from "@/components/ui/Container";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import Button from "@/components/ui/Button";
import { DisplayL, BodyText } from "@/components/ui/Typography";

interface FinalCtaSectionProps {
  locale: Locale;
}

export default function FinalCtaSection({ locale }: FinalCtaSectionProps) {
  const isRtl = locale === "ar";

  return (
    <Section world="carbon" id="cta" className="border-t border-carbon-border">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <NumberBadge number="05" world="carbon" />
            <TechnicalLabel variant="copper">
              {isRtl ? "طلب التواصل الهندسي" : "DIRECT SPECIFICATION INQUIRY"}
            </TechnicalLabel>
          </div>

          <DisplayL className="text-bone leading-tight">
            {isRtl ? "ماذا تبني اليوم؟" : "WHAT ARE YOU BUILDING?"}
          </DisplayL>

          <BodyText className="text-accent-metal text-base sm:text-xl leading-relaxed max-w-2xl">
            {isRtl
              ? "فريقنا الهندسي جاهز لمراجعة المواصفات والكميات وتزويدكم بطلب الأسعار التفصيلي."
              : "Our engineering specifiers are ready to review your project requirements, quantities, and material drawings."}
          </BodyText>

          <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Button href={`/${locale}/contact`} locale={locale} variant="primary" world="carbon">
              {isRtl ? "إرسال طلب الأسعار" : "SEND ORDER REQUEST"}
            </Button>
            <Button href={`/${locale}/products`} locale={locale} variant="outline" world="carbon">
              {isRtl ? "استكشاف المنتجات" : "EXPLORE PRODUCTS"}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
