"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/config/locales";
import { useCart } from "@/components/cart";
import { SITE_CONFIG } from "@/data/config";
import IconArrow from "@/components/ui/IconArrow";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const isRtl = locale === "ar";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart Context for Live Badge & Pulse
  const { totalQuantity, pulseTrigger, openMiniCart } = useCart();

  const targetLocale: Locale = locale === "en" ? "ar" : "en";
  const targetPath = pathname.replace(`/${locale}`, `/${targetLocale}`);

  // Multi-Page Dedicated Routes Architecture
  const navItems = [
    { label: isRtl ? "المؤسسة" : "COMPANY", href: `/${locale}/about` },
    { label: isRtl ? "القطاعات" : "APPLICATIONS", href: `/${locale}/applications` },
    { label: isRtl ? "المنتجات" : "PRODUCTS", href: `/${locale}/products` },
    { label: isRtl ? "اتصل بنا" : "CONTACT", href: `/${locale}/contact` },
  ];

  // Derive current active page name for HUD badge
  const getActivePageLabel = () => {
    if (pathname === `/${locale}`) return isRtl ? "الرئيسية" : "HOME";
    if (pathname.startsWith(`/${locale}/about`)) return isRtl ? "المؤسسة" : "COMPANY";
    if (pathname.startsWith(`/${locale}/applications`)) return isRtl ? "القطاعات" : "APPLICATIONS";
    if (pathname.startsWith(`/${locale}/products`)) return isRtl ? "المنتجات" : "PRODUCTS";
    if (pathname.startsWith(`/${locale}/contact`)) return isRtl ? "التواصل" : "CONTACT";
    if (pathname.startsWith(`/${locale}/cart`)) return isRtl ? "طلب التسعير" : "RFQ CART";
    return isRtl ? "النظام" : "SYSTEM";
  };

  const activePageLabel = getActivePageLabel();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 sm:pt-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto flex items-center justify-between box-border w-[94%] max-w-[1320px] h-14 sm:h-16 md:h-20 rounded-full sm:rounded-sm bg-gradient-to-b from-[#F3EFE5]/95 to-[#ECE6D8]/95 backdrop-blur-md border-2 border-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] px-2.5 sm:px-6 lg:px-8"
        >
          {/* Left Brand Lockup */}
          <Link
            href={`/${locale}`}
            className="group relative flex items-center shrink-0 select-none py-1 pl-1 sm:pl-2 rtl:pl-0 rtl:pr-1 rtl:sm:pr-2"
            aria-label={`${SITE_CONFIG.companyName[locale]} Homepage`}
          >
            <div className="relative h-9 sm:h-14 md:h-16 lg:h-[68px] w-28 xs:w-32 sm:w-52 md:w-60 lg:w-68 shrink-0 flex items-center">
              <Image
                src="/mmainlogot1.png"
                alt={isRtl ? SITE_CONFIG.companyName.ar : SITE_CONFIG.companyName.en}
                fill
                priority
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 240px, 280px"
                className="object-contain object-left rtl:object-right scale-110 sm:scale-125 origin-left rtl:origin-right group-hover:scale-[1.30] transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Center Dedicated Page Navigation Links (Desktop Only) */}
          <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse">
            {navItems.map((item) => {
              const isPageActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative py-2 font-tech text-xs tracking-widest uppercase transition-colors"
                >
                  <span
                    className={`transition-colors duration-200 ${
                      isPageActive ? "text-[#3A3A34] font-bold" : "text-[#6B6B63] hover:text-[#3A3A34]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Page Copper Underline Indicator (#C8A94A) */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A94A] transition-all duration-300 ${
                      isPageActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-75"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Terminal: Arabic/EN Switch + RFQ Button + Menu Trigger */}
          <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-4 rtl:space-x-reverse shrink-0">
            {/* Active Page Status Badge (Desktop Only) */}
            <div className="hidden xl:flex items-center space-x-2 rtl:space-x-reverse font-tech text-[9px] tracking-widest text-[#6B6B63] uppercase border border-[#D4CBB8] px-2.5 py-1 bg-[#ECE6D8]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A94A]" />
              <span>{activePageLabel}</span>
            </div>

            {/* Language Switch */}
            <Link
              href={targetPath}
              className="font-tech text-xs tracking-wider uppercase text-[#3A3A34] hover:text-black border border-transparent hover:border-[#D4CBB8] px-1.5 sm:px-2 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all touch-feedback select-none font-bold"
              aria-label="Change Language"
            >
              {targetLocale === "ar" ? "العربية" : "EN"}
            </Link>

            {/* Dark Live RFQ Cart Button: RFQ [00] */}
            <button
              onClick={openMiniCart}
              className={`group relative inline-flex items-center space-x-1 xs:space-x-1.5 rtl:space-x-reverse font-tech text-xs tracking-wider uppercase px-2 xs:px-2.5 sm:px-3.5 py-2 min-h-[44px] bg-[#111418] hover:bg-[#1C2026] text-[#F3EFE5] border transition-all duration-300 active:translate-y-0.5 select-none touch-feedback rounded-sm ${
                pulseTrigger
                  ? "border-[#C8A94A] bg-[#1a170f] text-[#C8A94A] shadow-[0_0_24px_rgba(200,169,74,0.85)] ring-2 ring-[#C8A94A] scale-105"
                  : "border-[#111418] hover:border-[#C8A94A] shadow-[0_4px_14px_rgba(17,20,24,0.35)] hover:shadow-[0_0_16px_rgba(200,169,74,0.35)]"
              }`}
              aria-label="Open RFQ Cart"
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${pulseTrigger ? "bg-[#C8A94A] animate-ping" : "bg-[#C8A94A]"}`} />
              <span className="font-bold">{isRtl ? "طلب" : "RFQ"}</span>
              <span
                className={`font-bold font-mono text-[11px] sm:text-xs transition-colors ${
                  pulseTrigger ? "text-[#F3EFE5]" : "text-[#C8A94A] group-hover:text-[#F3EFE5]"
                }`}
              >
                [{String(totalQuantity).padStart(2, "0")}]
              </span>
              <span className="hidden sm:inline-block transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-[#F3EFE5]">
                <IconArrow locale={locale} size={12} />
              </span>
            </button>

            {/* Mobile Menu Trigger with 44px touch target */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden font-tech text-xs tracking-widest text-[#3A3A34] border border-[#D4CBB8] px-2.5 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center uppercase hover:border-[#C8A94A] bg-[#ECE6D8]/80 transition-colors shadow-sm select-none touch-feedback font-bold rounded-sm"
              aria-label="Toggle Navigation Menu"
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <span className="w-4 h-0.5 bg-[#3A3A34]" />
                <span className="w-4 h-0.5 bg-[#3A3A34]" />
                <span className="w-4 h-0.5 bg-[#3A3A34]" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
        targetPath={targetPath}
        targetLocale={targetLocale}
        navItems={navItems}
      />
    </>
  );
}
