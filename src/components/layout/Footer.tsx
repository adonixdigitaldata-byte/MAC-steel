import Link from "next/link";
import { Locale } from "@/config/locales";
import { SITE_CONFIG } from "@/data/config";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const isRtl = locale === "ar";

  return (
    <footer className="bg-carbon border-t border-carbon-border text-bone py-12 sm:py-16 px-3 sm:px-6 lg:px-8 w-full max-w-full box-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 min-w-0">
        {/* Column 1: Brand & Statement */}
        <div className="md:col-span-2 space-y-3 sm:space-y-4 min-w-0">
          <div className="font-tech text-xs tracking-widest text-accent-metal uppercase">
            {isRtl ? "مواصفات المواد الهندسية" : "ENGINEERED MATERIAL SPECIFICATIONS"}
          </div>
          <h3 className="font-display text-xl sm:text-2xl tracking-wider text-bone break-words">
            {isRtl
              ? "مكونات الصلب عالية الدقة للبنية التحتية"
              : "HIGH-PRECISION STEEL COMPONENTS & INFRASTRUCTURE SYSTEMS"}
          </h3>
          <p className="text-xs text-accent-metal max-w-md leading-relaxed font-body break-words">
            {isRtl
              ? "تصميم وتصنيع المكونات المعدنية الصناعية بأعلى معايير الجودة والمواصفات القياسية."
              : "Precision engineered metal components, frames, gratings, and support structures built for heavy industrial and infrastructure applications."}
          </p>
        </div>

        {/* Column 2: Directives / Navigation */}
        <div className="space-y-3 min-w-0">
          <div className="font-tech text-xs tracking-widest text-accent-metal uppercase mb-2">
            {isRtl ? "التنقل السريع" : "NAVIGATION"}
          </div>
          <ul className="space-y-2 text-xs font-tech tracking-wider uppercase text-bone/80">
            <li>
              <Link href={`/${locale}/products`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "كتالوج المنتجات" : "PRODUCT CATALOGUE"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/applications`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "مجالات التطبيق" : "APPLICATIONS"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "عن الشركة" : "COMPANY ABOUT"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="hover:text-bone transition-colors block truncate">
                {isRtl ? "طلب التواصل" : "CONTACT INQUIRIES"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Metadata */}
        <div className="space-y-3 min-w-0">
          <div className="font-tech text-xs tracking-widest text-accent-metal uppercase mb-2">
            {isRtl ? "بيانات النظام" : "SYSTEM METADATA"}
          </div>
          <div className="text-xs font-tech space-y-1 text-accent-metal break-words">
            <div>LOCALE: {locale.toUpperCase()}</div>
            <div>STATUS: PHASE 01 OPERATIONAL</div>
            <div className="truncate">WHATSAPP: {SITE_CONFIG.whatsappNumber}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-carbon-border mt-8 sm:mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-accent-metal font-tech gap-4">
        <div className="break-words max-w-full text-center sm:text-start">
          © {new Date().getFullYear()} {SITE_CONFIG.companyName[locale]}. ALL RIGHTS RESERVED.
        </div>
        <div className="tracking-wider shrink-0 text-center sm:text-start">
          PRECISION OVER DECORATION
        </div>
      </div>
    </footer>
  );
}
