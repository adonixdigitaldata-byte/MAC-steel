"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { X, Phone, Mail, MapPin } from "lucide-react";
import NumberBadge from "@/components/ui/NumberBadge";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import { SITE_CONFIG } from "@/data/config";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  targetPath: string;
  targetLocale: Locale;
  navItems: { label: string; href: string; anchor?: string }[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  locale,
  targetPath,
  targetLocale,
  navItems,
}: MobileMenuProps) {
  const isRtl = locale === "ar";
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRtl ? "قائمة التنقل الرئيسية" : "Main Navigation Menu"}
      className="fixed inset-0 z-50 bg-[#0e0f11]/95 backdrop-blur-xl text-bone flex flex-col justify-between p-6 sm:p-10 md:hidden overflow-y-auto border-s border-carbon-border animate-fadeIn"
    >
      {/* Header technical strip */}
      <div className="flex items-center justify-between border-b border-carbon-border/60 pb-5">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <NumberBadge number="SYS" world="carbon" />
          <TechnicalLabel variant="copper">
            {isRtl ? "لوحة التحكم الهندسية" : "CONTROL PANEL // NAV"}
          </TechnicalLabel>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-2 border border-carbon-border hover:border-accent-copper text-bone hover:text-accent-copper transition-colors bg-carbon-surface/60"
          aria-label={isRtl ? "إغلاق القائمة" : "Close menu"}
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links with large typography and staggered index */}
      <nav className="flex flex-col space-y-5 my-auto py-6">
        {navItems.map((item, idx) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="group flex items-baseline justify-between border-b border-carbon-border/30 pb-3 transition-transform active:scale-[0.98]"
          >
            <span className="font-display text-3xl sm:text-4xl tracking-wider text-bone group-hover:text-accent-copper transition-colors uppercase">
              {item.label}
            </span>
            <span className="font-tech text-xs text-accent-metal font-bold">
              0{idx + 1} //
            </span>
          </Link>
        ))}
      </nav>

      {/* Direct Contact Metadata & Utilities Footer */}
      <div className="border-t border-carbon-border/60 pt-5 flex flex-col space-y-4 font-tech text-xs">
        
        {/* Quick RFQ Cart Directive */}
        <Link
          href={`/${locale}/cart`}
          onClick={onClose}
          className="w-full py-3 text-center bg-gradient-to-r from-[#212429] via-[#2a2e35] to-[#212429] border border-carbon-border hover:border-accent-copper text-bone transition-all tracking-widest uppercase font-bold text-xs"
        >
          {isRtl ? "استعراض طلب الأسعار (RFQ)" : "VIEW SPECIFIER RFQ"}
        </Link>

        {/* Location & Support Details */}
        <div className="grid grid-cols-1 gap-2 pt-1 text-[10px] text-accent-metal border-b border-carbon-border/40 pb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Phone size={12} className="text-accent-copper shrink-0" />
            <span>{SITE_CONFIG.contactPhone}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Mail size={12} className="text-accent-copper shrink-0" />
            <span>{SITE_CONFIG.contactEmail}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPin size={12} className="text-accent-copper shrink-0" />
            <span>{isRtl ? SITE_CONFIG.address.ar : SITE_CONFIG.address.en}</span>
          </div>
        </div>

        {/* Language Switch */}
        <div className="flex justify-between items-center text-accent-metal pt-1">
          <span className="text-[10px] tracking-widest uppercase">LOCALE SELECT:</span>
          <Link
            href={targetPath}
            onClick={onClose}
            className="text-bone hover:text-accent-copper tracking-widest uppercase font-bold border-b border-accent-copper pb-0.5"
          >
            {targetLocale === "ar" ? "العربية (AR)" : "ENGLISH (EN)"}
          </Link>
        </div>
      </div>
    </div>
  );
}

