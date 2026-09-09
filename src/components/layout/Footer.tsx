import React from "react";
import Image from "next/image";
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
    <footer className="bg-gradient-to-b from-[#F3EFE5] to-[#ECE6D8] border-t-2 border-black text-[#3A3A34] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 w-full max-w-full box-border select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 min-w-0">
        
        {/* Column 1: Brand & Engineering Proof (2 Cols) */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="relative h-[44px] sm:h-[52px] lg:h-[64px] w-44 sm:w-52 lg:w-64 shrink-0 flex items-center">
              <Image
                src="/mmainlogot1.png"
                alt={isRtl ? SITE_CONFIG.companyName.ar : SITE_CONFIG.companyName.en}
                fill
                priority
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 256px"
                className="object-contain object-left rtl:object-right"
              />
            </div>
          </div>

          <p className="text-xs text-[#6B6B63] max-w-sm leading-relaxed font-body">
            {isRtl
              ? "تصنيع وتوريد المكونات الفولاذية الصلبة، الهياكل المخصصة، وحلول التثبيت الهندسية للمشاريع الإنشائية والصناعية الكبرى في المملكة."
              : "High-precision structural steel fabrication, custom embed assemblies, and infrastructure utility hardware engineered in Jeddah to ISO 9001:2015 standards."}
          </p>

          <div className="pt-2 font-tech text-[10px] text-[#A67C2E] flex flex-wrap gap-x-4 gap-y-1 font-semibold">
            <span>PLANT: JEDDAH, KSA</span>
            <span>·</span>
            <span>CAPACITY: 12,000 MT/YR</span>
            <span>·</span>
            <span>TOL: ±0.05 MM</span>
          </div>
        </div>

        {/* Column 2: Products Directory */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-[#A67C2E] uppercase font-bold border-b border-black/15 pb-2">
            {isRtl ? "٠١ / المنتجات" : "01 // PRODUCTS"}
          </div>
          <ul className="space-y-2 text-[#6B6B63]">
            <li>
              <Link href={`/${locale}/products`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "الهياكل والإطارات" : "Structural Frames"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "معدات المناهل والمرافق" : "Manhole Hardware"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "الأنابيب والأكمام" : "Piping & Sleeves"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "أدوات التثبيت والرسو" : "Anchor Bolts & Rods"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="text-[#A67C2E] hover:underline block pt-1 font-bold">
                {isRtl ? "عرض الكتالوج الكامل ←" : "Full Catalogue →"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Applications / Sectors */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-[#A67C2E] uppercase font-bold border-b border-black/15 pb-2">
            {isRtl ? "٠٢ / القطاعات" : "02 // APPLICATIONS"}
          </div>
          <ul className="space-y-2 text-[#6B6B63]">
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "الكهرباء والاتصالات" : "Electrical & Telecom"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "الهندسة المدنية" : "Civil Construction"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "البنية التحتية" : "Infrastructure"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-black transition-colors block truncate font-medium">
                {isRtl ? "المنشآت الصناعية" : "Industrial Plants"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="text-[#A67C2E] hover:underline block pt-1 font-bold">
                {isRtl ? "دليل القطاعات ←" : "All Sectors →"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Company & RFQ Inquiry */}
        <div className="space-y-3 min-w-0 font-tech text-xs">
          <div className="text-[10px] tracking-widest text-[#A67C2E] uppercase font-bold border-b border-black/15 pb-2">
            {isRtl ? "٠٣ / التواصل والطلب" : "03 // SPECIFIER DESK"}
          </div>
          <div className="space-y-2 text-[#6B6B63] text-[11px]">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone size={13} className="text-[#A67C2E] shrink-0" />
              <span className="truncate">{SITE_CONFIG.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Mail size={13} className="text-[#A67C2E] shrink-0" />
              <span className="truncate">{SITE_CONFIG.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin size={13} className="text-[#A67C2E] shrink-0" />
              <span className="truncate">{SITE_CONFIG.location[locale]}</span>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href={`/${locale}/contact`}
              className="inline-block py-2 px-3 bg-black text-[#F3EFE5] border border-black hover:bg-neutral-800 text-[10px] uppercase tracking-wider font-bold transition-colors"
            >
              {isRtl ? "إرسال طلب الأسعار (RFQ)" : "SUBMIT DRAWINGS / RFQ"}
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto border-t border-black/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B63] font-tech gap-4">
        <div className="text-[10px] sm:text-xs text-center sm:text-start uppercase font-medium">
          © {new Date().getFullYear()} {SITE_CONFIG.companyName.en.toUpperCase()}. ALL RIGHTS RESERVED.
        </div>
        <div className="text-[10px] sm:text-xs tracking-widest text-[#6B6B63]/80 flex items-center gap-3 font-medium">
          <span>ISO 9001:2015 CERTIFIED</span>
          <span>·</span>
          <span>ENGINEERED FOR THE LOAD</span>
        </div>
      </div>
    </footer>
  );
}
