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

  // Scroll & Compression State
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");
  const lastScrollY = useRef(0);

  // Scroll detection for Floating Capsule & Directional Expansion/Compression
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const heroThreshold = window.innerHeight * 0.05;

          setIsScrolled(currentY > heroThreshold);

          if (currentY > lastScrollY.current && currentY > heroThreshold + 40) {
            setScrollDirection("down");
          } else if (currentY < lastScrollY.current && currentY > heroThreshold) {
            setScrollDirection("up");
          } else if (currentY <= heroThreshold) {
            setScrollDirection("none");
          }

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

  // Mobile Header Dynamic Classes
  const getMobileHeaderHeight = () => {
    if (!isScrolled) return "h-16 sm:h-20"; // Hero State
    if (scrollDirection === "down") return "h-12 sm:h-14"; // Scroll Down Compact
    return "h-14 sm:h-16"; // Scroll Up Expanded
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-out pointer-events-none ${
          isScrolled ? "pt-2 sm:pt-4" : "pt-0"
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between box-border ${
            isScrolled
              ? `w-[94%] max-w-[1320px] rounded-sm bg-gradient-to-b from-[#F3EFE5]/95 to-[#ECE6D8]/95 backdrop-blur-md border-2 border-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] px-3 sm:px-6 lg:px-8 ${getMobileHeaderHeight()}`
              : "w-full max-w-7xl h-16 sm:h-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F3EFE5] to-[#ECE6D8] backdrop-blur-md border-b-2 border-black shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* Left Brand Lockup (Always returns home) with generous padding */}
          <Link
            href={`/${locale}`}
            className="group relative flex items-center shrink-0 select-none py-1 pl-1 sm:pl-2 rtl:pl-0 rtl:pr-1 rtl:sm:pr-2"
            aria-label={`${SITE_CONFIG.companyName[locale]} Homepage`}
          >
            <div className="relative h-12 sm:h-14 md:h-16 lg:h-[68px] w-44 sm:w-52 md:w-60 lg:w-68 shrink-0 flex items-center">
              <Image
                src="/mmainlogot1.png"
                alt={isRtl ? SITE_CONFIG.companyName.ar : SITE_CONFIG.companyName.en}
                fill
                priority
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 280px"
                className="object-contain object-left rtl:object-right scale-125 origin-left rtl:origin-right group-hover:scale-[1.30] transition-transform duration-300"
              />
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
                      isPageActive ? "text-[#3A3A34] font-bold" : "text-[#6B6B63] hover:text-[#3A3A34]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Page Copper Underline Indicator (#C8A94A) with smooth slide transition */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A94A] transition-all duration-300 ${
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
            <div className="hidden xl:flex items-center space-x-2 rtl:space-x-reverse font-tech text-[9px] tracking-widest text-[#6B6B63] uppercase border border-[#D4CBB8] px-2.5 py-1 bg-[#ECE6D8]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A94A]" />
              <span>{activePageLabel}</span>
            </div>

            {/* Language Switch */}
            <Link
              href={targetPath}
              className="font-tech text-[10px] sm:text-xs tracking-widest uppercase text-[#6B6B63] hover:text-[#3A3A34] border border-transparent hover:border-[#D4CBB8] px-2 py-1 transition-all"
            >
              {targetLocale === "ar" ? "العربية" : "ENGLISH"}
            </Link>

            {/* Dark Live RFQ Cart Button */}
            <button
              onClick={openMiniCart}
              className={`group relative inline-flex items-center space-x-2 rtl:space-x-reverse font-tech text-[10px] sm:text-xs tracking-wider uppercase px-3.5 py-2 bg-[#111418] hover:bg-[#1C2026] text-[#F3EFE5] border border-[#111418] hover:border-[#C8A94A] shadow-[0_4px_14px_rgba(17,20,24,0.35)] hover:shadow-[0_0_16px_rgba(200,169,74,0.35)] transition-all duration-200 active:translate-y-0.5 select-none ${
                pulseTrigger
                  ? "border-[#C8A94A] shadow-lg shadow-[#C8A94A]/40 scale-105"
                  : ""
              }`}
              aria-label="Open RFQ Cart"
            >
              <span className="font-bold">{isRtl ? "طلب الأسعار" : "RFQ CART"}</span>
              <span
                className={`font-bold font-mono text-[10px] sm:text-xs transition-colors ${
                  pulseTrigger ? "text-[#F3EFE5]" : "text-[#C8A94A] group-hover:text-[#F3EFE5]"
                }`}
              >
                [{String(totalQuantity).padStart(2, "0")}]
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-[#F3EFE5]">
                <IconArrow locale={locale} size={12} />
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden font-tech text-[10px] sm:text-xs tracking-widest text-[#3A3A34] border border-[#D4CBB8] px-2.5 py-1.5 uppercase hover:border-[#C8A94A] bg-[#ECE6D8]/80 transition-colors shadow-sm"
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
