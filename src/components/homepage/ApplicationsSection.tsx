"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { APPLICATIONS } from "@/data/applications";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import IconArrow from "@/components/ui/IconArrow";

interface ApplicationsSectionProps {
  locale: Locale;
}

export default function ApplicationsSection({ locale }: ApplicationsSectionProps) {
  const isRtl = locale === "ar";
  const [activeAppIndex, setActiveAppIndex] = useState(0);

  const activeApp = APPLICATIONS[activeAppIndex] || APPLICATIONS[0];

  return (
    <Section world="carbon" id="applications">
      <Container>
        <SectionHeader
          index="03"
          label={isRtl ? "مجالات التطبيق / القطاعات" : "APPLICATION SECTORS / USAGE"}
          title={isRtl ? "أين تعمل منتجاتنا؟" : "WHERE THE PRODUCTS BELONG."}
          description={
            isRtl
              ? "حلول ومكونات فولاذية مصممة خصيصاً لتلبية متطلبات قطاعات البنية التحتية والإنشاءات."
              : "Precision components engineered specifically for major infrastructure, utility networks, and civil works."
          }
          actionText={isRtl ? "جميع التطبيقات" : "ALL SECTORS"}
          actionHref={`/${locale}/applications`}
          locale={locale}
          world="carbon"
        />

        {/* Editorial Sector Exhibition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full max-w-full min-w-0">
          {/* Interactive Sector List */}
          <div className="lg:col-span-6 space-y-3 min-w-0 w-full">
            {APPLICATIONS.map((app, idx) => {
              const isActive = idx === activeAppIndex;
              const formattedIdx = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={app.id}
                  onMouseEnter={() => setActiveAppIndex(idx)}
                  onClick={() => setActiveAppIndex(idx)}
                  className={`group p-3.5 sm:p-6 border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 w-full max-w-full box-border min-w-0 ${
                    isActive
                      ? "bg-carbon-surface border-bone text-bone"
                      : "bg-transparent border-carbon-border text-accent-metal hover:border-carbon-border/80 hover:text-bone"
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse min-w-0 flex-1 me-2">
                    <span className="font-tech text-xs font-bold text-accent-copper border border-current px-2 py-0.5 shrink-0">
                      {formattedIdx}
                    </span>
                    <h3 className="font-display text-base sm:text-2xl uppercase tracking-wider group-hover:text-accent-copper transition-colors truncate">
                      {isRtl ? app.nameAr : app.name}
                    </h3>
                  </div>

                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
                    <IconArrow locale={locale} size={16} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Sector Technical Showcase Frame */}
          <div className="lg:col-span-6 border border-carbon-border bg-carbon-surface p-4 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] w-full max-w-full box-border min-w-0">
            <div>
              <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-carbon-border gap-2">
                <TechnicalLabel variant="copper" className="truncate">SECTOR FOCUS / {activeApp.id}</TechnicalLabel>
                <span className="font-tech text-[10px] sm:text-xs text-accent-metal">REF: ARCH-2026</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl text-bone uppercase mb-3 sm:mb-4 break-words">
                {isRtl ? activeApp.nameAr : activeApp.name}
              </h3>

              <p className="font-body text-xs sm:text-sm text-accent-metal leading-relaxed mb-6 break-words">
                {isRtl
                  ? `مجموعات المكونات الفولاذية المعتمدة لقطاع ${activeApp.nameAr}. مصممة لمقاومة الأحمال العالية والتفاعل البيئي.`
                  : `Architectural steel products, custom frames, and support systems specified for ${activeApp.name} infrastructure projects.`}
              </p>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-carbon-border flex flex-wrap items-center justify-between gap-2 font-tech text-xs">
              <span className="text-accent-metal text-[10px] sm:text-xs">SPECIFICATION READY</span>
              <Link
                href={`/${locale}/applications`}
                className="text-bone hover:text-accent-copper font-bold uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse text-xs"
              >
                <span>{isRtl ? "عرض منتجات القطاع" : "EXPLORE SECTOR"}</span>
                <IconArrow locale={locale} size={14} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
