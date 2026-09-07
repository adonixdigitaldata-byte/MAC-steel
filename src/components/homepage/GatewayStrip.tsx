import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { Container } from "@/components/ui/Container";
import IconArrow from "@/components/ui/IconArrow";

interface GatewayStripProps {
  locale: Locale;
}

export default function GatewayStrip({ locale }: GatewayStripProps) {
  const isRtl = locale === "ar";

  const cards = [
    {
      num: "01",
      title: isRtl ? "استكشاف المنتجات" : "Explore Products",
      desc: isRtl ? "تصفح أنظمة الصلب ومكونات الهياكل الهندسية." : "Browse engineering-grade steel systems & assemblies.",
      href: `/${locale}/products`,
      tag: "CATALOGUE",
    },
    {
      num: "02",
      title: isRtl ? "تطبيقات القطاعات" : "Industry Applications",
      desc: isRtl ? "حلول ومكونات مخصصة لمشاريع البنية التحتية والمرافق." : "Find tailored components specified by infrastructure sector.",
      href: `/${locale}/applications`,
      tag: "SECTORS",
    },
    {
      num: "03",
      title: isRtl ? "معايير التصنيع" : "Manufacturing Standards",
      desc: isRtl ? "تعرف على منهجية شركة ميتالو أرابيا في الدقة وضمان الجودة." : "See how Metallo Arabia Company builds to ISO 9001:2015 tolerances.",
      href: `/${locale}/about`,
      tag: "FABRICATION",
    },
    {
      num: "04",
      title: isRtl ? "طلب الأسعار المباشر" : "Request an RFQ",
      desc: isRtl ? "تواصل مباشرة مع المهندسين لمراجعة المخططات والكميات." : "Talk directly with engineering specifiers for custom BOMs.",
      href: `/${locale}/contact`,
      tag: "SPECIFICATION",
    },
  ];

  return (
    <section className="bg-carbon border-b border-carbon-border py-12 sm:py-16 w-full max-w-full box-border select-none">
      <Container>
        {/* Strip Eyebrow */}
        <div className="flex items-center justify-between border-b border-carbon-border/60 pb-3 mb-8 font-tech text-[10px] tracking-widest text-accent-metal uppercase">
          <span className="text-accent-copper font-bold">
            {isRtl ? "بوابة التوجيه الهندسي // القرار" : "ENGINEERING GATEWAY // DIRECTORY"}
          </span>
          <span className="hidden sm:inline-block">
            {isRtl ? "اختر مسار الاستكشاف" : "SELECT SPECIFICATION PATH"}
          </span>
        </div>

        {/* 4 Architectural Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => (
            <Link
              key={card.num}
              href={card.href}
              className="group relative border border-carbon-border bg-carbon-surface/60 p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-300 hover:border-accent-copper hover:bg-carbon-surface hover:-translate-y-1 hover:shadow-xl hover:shadow-carbon/80 box-border"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-carbon-border/40 pb-3">
                <span className="font-tech text-xs font-bold text-accent-copper border border-accent-copper/40 px-2 py-0.5">
                  {card.num}
                </span>
                <span className="font-tech text-[9px] text-accent-metal/50 tracking-widest uppercase">
                  {card.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="my-3 space-y-1.5">
                <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide group-hover:text-accent-copper transition-colors">
                  {card.title}
                </h3>
                <p className="font-body text-xs text-accent-metal leading-relaxed line-clamp-2">
                  {card.desc}
                </p>
              </div>

              {/* Card Action Link Indicator */}
              <div className="pt-3 border-t border-carbon-border/40 flex items-center justify-between font-tech text-[10px] tracking-widest text-bone uppercase">
                <span className="group-hover:text-accent-copper transition-colors">
                  {isRtl ? "دخول المسار" : "ENTER PATH"}
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <IconArrow locale={locale} size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
