"use client";

import React, { useState, useEffect, useRef } from "react";
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

  // Scroll & Compression State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll detection for Floating Capsule & Directional Compression
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const heroThreshold = window.innerHeight * 0.05;

          setIsScrolled(currentY > heroThreshold);
          setIsCompressing(currentY > lastScrollY.current && currentY > heroThreshold + 50);
          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out pointer-events-none ${
          isScrolled ? "pt-2 sm:pt-4" : "pt-0"
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between box-border ${
            isScrolled
              ? `w-[94%] max-w-[1320px] rounded-sm bg-[#141518]/90 backdrop-blur-md border border-carbon-border/80 shadow-2xl shadow-carbon/80 ${
                  isCompressing ? "h-14 px-4 sm:px-6" : "h-16 px-4 sm:px-8"
                }`
              : "w-full max-w-7xl h-20 px-4 sm:px-6 lg:px-8 bg-transparent border-b border-carbon-border/20"
          }`}
        >
          {/* Left Brand Lockup (Always returns home) */}
          <Link
            href={`/${locale}`}
            className="group flex items-center space-x-3 rtl:space-x-reverse min-w-0 shrink-0 select-none"
            aria-label={`${SITE_CONFIG.companyName[locale]} Homepage`}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 border border-bone/80 bg-carbon-surface/60 flex items-center justify-center font-tech text-[8px] sm:text-[9px] font-bold tracking-widest text-bone group-hover:border-accent-copper transition-colors shrink-0">
              MAC
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg tracking-wider text-bone group-hover:text-accent-copper transition-colors uppercase leading-tight whitespace-nowrap">
                {isRtl ? SITE_CONFIG.companyName.ar : SITE_CONFIG.shortBrand}
              </span>
              <span className="font-tech text-[8px] sm:text-[9px] tracking-widest text-accent-metal/60 uppercase">
                JED • KSA • ISO 9001
              </span>
            </div>
          </Link>

          {/* Center Dedicated Page Navigation Links */}
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
                      isPageActive ? "text-bone font-bold" : "text-accent-metal hover:text-bone"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Page Copper Underline Indicator */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-accent-copper transition-all duration-300 ${
                      isPageActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-75"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Terminal: Active Page HUD + Language Switch + Live RFQ Cart Button */}
          <div className="flex items-center space-x-3 sm:space-x-5 rtl:space-x-reverse">
            {/* Active Page Status Badge (Desktop) */}
            <div className="hidden xl:flex items-center space-x-2 rtl:space-x-reverse font-tech text-[9px] tracking-widest text-accent-metal/50 uppercase border border-carbon-border/50 px-2.5 py-1 bg-carbon/40">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-copper" />
              <span>{activePageLabel}</span>
            </div>

            {/* Language Switch */}
            <Link
              href={targetPath}
              className="font-tech text-[10px] sm:text-xs tracking-widest uppercase text-accent-metal hover:text-bone border border-transparent hover:border-carbon-border px-2 py-1 transition-all"
            >
              {targetLocale === "ar" ? "العربية" : "ENGLISH"}
            </Link>

            {/* Live RFQ Cart Button with Copper Pulse Indicator */}
            <button
              onClick={openMiniCart}
              className={`group relative inline-flex items-center space-x-2 rtl:space-x-reverse font-tech text-[10px] sm:text-xs tracking-wider uppercase px-3.5 py-2 bg-gradient-to-r from-[#212429] via-[#2a2e35] to-[#212429] hover:from-accent-copper hover:to-[#734f3b] text-bone border transition-all duration-200 shadow-md active:translate-y-0.5 select-none ${
                pulseTrigger
                  ? "border-accent-copper shadow-lg shadow-accent-copper/40 scale-105"
                  : "border-carbon-border hover:border-accent-copper"
              }`}
              aria-label="Open RFQ Cart"
            >
              <span className="font-bold">{isRtl ? "طلب الأسعار" : "RFQ CART"}</span>
              <span
                className={`font-bold font-mono text-[10px] sm:text-xs transition-colors ${
                  pulseTrigger ? "text-bone" : "text-accent-copper group-hover:text-bone"
                }`}
              >
                [{String(totalQuantity).padStart(2, "0")}]
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <IconArrow locale={locale} size={12} />
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden font-tech text-[10px] sm:text-xs tracking-widest text-bone border border-carbon-border px-2.5 py-1.5 uppercase hover:border-accent-copper bg-carbon-surface/60 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isRtl ? "القائمة" : "MENU"}
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
