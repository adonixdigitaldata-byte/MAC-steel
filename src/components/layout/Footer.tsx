import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { SITE_CONFIG } from "@/data/config";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const isRtl = locale === "ar";

  return (
    <footer className="bg-[#0e0f11] border-t border-carbon-border text-bone py-14 sm:py-20 px-4 sm:px-6 lg:px-8 w-full max-w-full box-border select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 min-w-0">
        
        {/* Column 1: Brand & Engineering Proof (2 Cols) */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-6 h-6 border border-bone/80 bg-carbon flex items-center justify-center font-tech text-[8px] font-bold text-bone">
              CON
            </div>
            <span className="font-display text-lg sm:text-xl tracking-wider text-bone uppercase">
              {isRtl ? "كونتراتك لأنظمة الصلب" : "CONTRATEK STEEL SYSTEMS"}
            </span>
          </div>

          <p className="text-xs text-accent-metal max-w-sm leading-relaxed font-body">
            {isRtl
              ? "تصنيع وتوريد المكونات الفولاذية الصلبة، الهياكل المخصصة، وحلول التثبيت الهندسية للمشاريع الإنشائية والصناعية الكبرى في المملكة."
              : "High-precision structural steel fabrication, custom embed assemblies, and infrastructure utility hardware engineered in Jeddah to ISO 9001:2015 standards."}
          </p>

          <div className="pt-2 font-tech text-[10px] text-accent-copper flex flex-wrap gap-x-4 gap-y-1">
            <span>PLANT: JEDDAH, KSA</span>
            <span>·</span>
            <span>CAPACITY: 12,000 MT/YR</span>
            <span>·</span>
            <span>TOL: ±0.05 MM</span>
          </div>
        </div>

        {/* Column 2: Products Directory */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-accent-copper uppercase font-bold border-b border-carbon-border/60 pb-2">
            {isRtl ? "٠١ / المنتجات" : "01 // PRODUCTS"}
          </div>
          <ul className="space-y-2 text-accent-metal">
            <li>
              <Link href={`/${locale}/products`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "الهياكل والإطارات" : "Structural Frames"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "معدات المناهل والمرافق" : "Manhole Hardware"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "الأنابيب والأكمام" : "Piping & Sleeves"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "أدوات التثبيت والرسو" : "Anchor Bolts & Rods"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="text-accent-copper hover:underline block pt-1 font-bold">
                {isRtl ? "عرض الكتالوج الكامل ←" : "Full Catalogue →"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Applications / Sectors */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-accent-copper uppercase font-bold border-b border-carbon-border/60 pb-2">
            {isRtl ? "٠٢ / القطاعات" : "02 // APPLICATIONS"}
          </div>
          <ul className="space-y-2 text-accent-metal">
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "الكهرباء والاتصالات" : "Electrical & Telecom"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "الهندسة المدنية" : "Civil Construction"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "البنية التحتية" : "Infrastructure"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "المنشآت الصناعية" : "Industrial Plants"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="text-accent-copper hover:underline block pt-1 font-bold">
                {isRtl ? "دليل القطاعات ←" : "All Sectors →"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Company & RFQ Inquiry */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-accent-copper uppercase font-bold border-b border-carbon-border/60 pb-2">
            {isRtl ? "٠٣ / التواصل والطلب" : "03 // SPECIFIER DESK"}
          </div>
          <div className="space-y-2 text-accent-metal text-[11px]">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone size={13} className="text-accent-copper shrink-0" />
              <span className="truncate">{SITE_CONFIG.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Mail size={13} className="text-accent-copper shrink-0" />
              <span className="truncate">{SITE_CONFIG.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin size={13} className="text-accent-copper shrink-0" />
              <span className="truncate">{isRtl ? "جدة، المملكة العربية السعودية" : "Jeddah, Saudi Arabia"}</span>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href={`/${locale}/contact`}
              className="inline-block py-2 px-3 bg-carbon-surface border border-carbon-border hover:border-accent-copper text-bone text-[10px] uppercase tracking-wider font-bold transition-colors"
            >
              {isRtl ? "إرسال طلب الأسعار (RFQ)" : "SUBMIT DRAWINGS / RFQ"}
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto border-t border-carbon-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-accent-metal font-tech gap-4">
        <div className="text-[10px] sm:text-xs text-center sm:text-start">
          © {new Date().getFullYear()} CONTRATEK INDUSTRIAL STEEL. ALL RIGHTS RESERVED.
        </div>
        <div className="text-[10px] sm:text-xs tracking-widest text-accent-metal/60 flex items-center gap-3">
          <span>ISO 9001:2015 CERTIFIED</span>
          <span>·</span>
          <span>ENGINEERED FOR THE LOAD</span>
        </div>
      </div>
    </footer>
  );
}

