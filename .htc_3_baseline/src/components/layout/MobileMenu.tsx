"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import { X } from "lucide-react";
import NumberBadge from "@/components/ui/NumberBadge";
import TechnicalLabel from "@/components/ui/TechnicalLabel";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  targetPath: string;
  targetLocale: Locale;
  navItems: { label: string; href: string }[];
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

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Focus close button
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
      className="fixed inset-0 z-50 bg-carbon text-bone flex flex-col justify-between p-6 sm:p-10 md:hidden overflow-y-auto"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-carbon-border pb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <NumberBadge number="NAV" world="carbon" />
          <TechnicalLabel variant="metal">{isRtl ? "القائمة الرئيسية" : "NAVIGATION SYSTEM"}</TechnicalLabel>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-2 border border-carbon-border hover:border-bone text-bone hover:text-accent-metal transition-colors"
          aria-label={isRtl ? "إغلاق القائمة" : "Close menu"}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-6 my-auto py-8">
        {navItems.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group flex items-baseline justify-between border-b border-carbon-border/40 pb-4"
          >
            <span className="font-display text-4xl sm:text-5xl tracking-wider text-bone group-hover:text-accent-copper transition-colors uppercase">
              {item.label}
            </span>
            <span className="font-tech text-xs text-accent-metal font-bold">
              0{idx + 1}
            </span>
          </Link>
        ))}
      </nav>

      {/* Utilities Footer */}
      <div className="border-t border-carbon-border pt-6 flex flex-col space-y-4 font-tech text-xs">
        <Link
          href={`/${locale}/cart`}
          onClick={onClose}
          className="w-full py-4 text-center border border-bone text-bone hover:bg-bone hover:text-carbon transition-colors tracking-widest uppercase font-bold"
        >
          {isRtl ? "طلبك الخاص / ٠" : "YOUR REQUEST / 00"}
        </Link>

        <div className="flex justify-between items-center text-accent-metal pt-2">
          <span className="text-[10px] tracking-widest uppercase">LANGUAGE:</span>
          <Link
            href={targetPath}
            onClick={onClose}
            className="text-bone hover:text-accent-copper tracking-widest uppercase font-bold border-b border-bone"
          >
            {targetLocale === "ar" ? "العربية (AR)" : "ENGLISH (EN)"}
          </Link>
        </div>
      </div>
    </div>
  );
}
