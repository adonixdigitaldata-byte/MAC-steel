"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { APPLICATIONS } from "@/data/applications";
import { Container, Section } from "@/components/ui/Container";
import SectionHeader from "@/components/layout/SectionHeader";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import Button from "@/components/ui/Button";
import IconArrow from "@/components/ui/IconArrow";

interface ApplicationsSectionProps {
  locale: Locale;
}

export default function ApplicationsSection({ locale }: ApplicationsSectionProps) {
  const isRtl = locale === "ar";
  const [activeAppIndex, setActiveAppIndex] = useState(0);

  // Show top 4 featured sectors as preview
  const featuredApps = APPLICATIONS.slice(0, 4);
  const activeApp = featuredApps[activeAppIndex] || featuredApps[0];

  return (
    <Section world="carbon" id="applications">
      <Container>
        <SectionHeader
          index="03"
          label={isRtl ? "مجالات التطبيق // نماذج القطاعات" : "APPLICATION SECTORS // INDUSTRY MATRIX"}
          title={isRtl ? "أين تعمل منتجاتنا؟" : "WHERE THE PRODUCTS BELONG."}
          description={
            isRtl
              ? "مكونات وحلول فولاذية مصممة خصيصاً لمشاريع البنية التحتية والشبكات الخدمية الكبرى."
              : "Tailored metal fabrications, support frames, and subterranean hardware engineered for heavy industrial deployment."
          }
          actionText={isRtl ? "عرض جميع القطاعات" : "VIEW ALL INDUSTRIES"}
          actionHref={`/${locale}/applications`}
          locale={locale}
          world="carbon"
        />

        {/* Editorial Sector Exhibition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full max-w-full min-w-0 mb-10">
          {/* Interactive Featured Sector List */}
          <div className="lg:col-span-6 space-y-3 min-w-0 w-full">
            {featuredApps.map((app, idx) => {
              const isActive = idx === activeAppIndex;
              const formattedIdx = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={app.id}
                  onMouseEnter={() => setActiveAppIndex(idx)}
                  onClick={() => setActiveAppIndex(idx)}
                  className={`group p-3.5 sm:p-5 border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 w-full max-w-full box-border min-w-0 ${
                    isActive
                      ? "bg-carbon-surface border-accent-copper text-bone shadow-md"
                      : "bg-transparent border-carbon-border text-accent-metal hover:border-carbon-border/80 hover:text-bone"
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse min-w-0 flex-1 me-2">
                    <span className="font-tech text-xs font-bold text-accent-copper border border-current px-2 py-0.5 shrink-0">
                      {formattedIdx}
                    </span>
                    <h3 className="font-display text-base sm:text-xl uppercase tracking-wider group-hover:text-accent-copper transition-colors break-words">
                      {isRtl ? app.nameAr : app.name}
                    </h3>
                  </div>

                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0">
                    <IconArrow locale={locale} size={15} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Sector Technical Showcase Frame */}
          <div
            key={activeApp.id}
            className="lg:col-span-6 border border-carbon-border bg-carbon-surface p-4 sm:p-8 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] w-full max-w-full box-border min-w-0 animate-fadeIn"
          >
            <div>
              <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-carbon-border gap-2">
                <TechnicalLabel variant="copper" className="truncate">SECTOR FOCUS // {activeApp.id}</TechnicalLabel>
                <span className="font-tech text-[10px] sm:text-xs text-accent-metal">SPEC REF: 2026</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase mb-3 sm:mb-4 break-words">
                {isRtl ? activeApp.nameAr : activeApp.name}
              </h3>

              <p className="font-body text-xs sm:text-sm text-accent-metal leading-relaxed mb-6 break-words">
                {isRtl
                  ? `مجموعات المكونات الفولاذية المعتمدة لقطاع ${activeApp.nameAr}. مصممة لمقاومة الأحمال العالية والتفاعل البيئي.`
                  : `Architectural steel products, custom frames, and support systems specified for ${activeApp.name} infrastructure projects.`}
              </p>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-carbon-border flex flex-wrap items-center justify-between gap-2 font-tech text-xs">
              <span className="text-accent-metal text-[10px] sm:text-xs">SYSTEM SPECIFICATION READY</span>
              <Link
                href={`/${locale}/applications`}
                className="text-bone hover:text-accent-copper font-bold uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse text-xs group"
              >
                <span>{isRtl ? "عرض تفاصيل القطاع" : "EXPLORE SECTOR SPECIFICATIONS"}</span>
                <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <IconArrow locale={locale} size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Directory Entry Action Footer */}
        <div className="text-center pt-6 border-t border-carbon-border flex flex-col sm:flex-row items-center justify-between gap-4 font-tech text-xs">
          <span className="text-accent-metal text-[11px]">
            {isRtl ? "متاح أكثر من ٦ قطاعات هندسية متخصصة" : "6+ DEDICATED INFRASTRUCTURE SECTORS AVAILABLE"}
          </span>
          <Button href={`/${locale}/applications`} locale={locale} variant="outline" world="carbon">
            {isRtl ? "عرض دليل القطاعات الكامل ←" : "VIEW ALL INDUSTRIES DIRECTORY →"}
          </Button>
        </div>
      </Container>
    </Section>
  );
}


