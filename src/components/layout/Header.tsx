"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/config/locales";
import { useState, useEffect } from "react";
import { getStoredCart } from "@/lib/cart";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const isRtl = locale === "ar";

  useEffect(() => {
    const updateCount = () => {
      const items = getStoredCart();
      const count = items.reduce((acc, curr) => acc + curr.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, [pathname]);

  const targetLocale: Locale = locale === "en" ? "ar" : "en";
  const targetPath = pathname.replace(`/${locale}`, `/${targetLocale}`);

  const navItems = [
    { label: isRtl ? "المنتجات" : "PRODUCTS", href: `/${locale}` },
    { label: isRtl ? "التطبيقات" : "APPLICATIONS", href: `/${locale}/applications` },
    { label: isRtl ? "من نحن" : "ABOUT", href: `/${locale}/about` },
    { label: isRtl ? "المجلة" : "JOURNAL", href: `/${locale}/blog` },
    { label: isRtl ? "اتصل بنا" : "CONTACT", href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-carbon/95 backdrop-blur-md border-b border-carbon-border w-full max-w-full box-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between min-w-0 max-w-full">
        {/* Brand Logo - Un-truncated intentional lockup */}
        <Link href={`/${locale}`} className="group flex items-center space-x-2 rtl:space-x-reverse min-w-0 shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border border-bone flex items-center justify-center font-tech text-[8px] sm:text-[10px] font-bold tracking-widest text-bone group-hover:border-accent-copper transition-colors shrink-0">
            STEEL
          </div>
          <span className="font-display text-sm sm:text-xl tracking-wider text-bone group-hover:text-accent-copper transition-colors uppercase whitespace-nowrap">
            {isRtl ? "صناعة الصلب" : "INDUSTRIAL STEEL"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-widest font-body font-medium transition-colors ${
                  isActive ? "text-bone border-b border-bone pb-1" : "text-accent-metal hover:text-bone"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions & Utilities */}
        <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          <Link
            href={`/${locale}/cart`}
            className="font-tech text-xs tracking-wider uppercase px-3.5 py-2 border border-carbon-border hover:border-bone transition-colors text-bone flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>{isRtl ? "طلبك" : "YOUR REQUEST"}</span>
            <span className="text-accent-copper font-bold">
              [{String(cartCount).padStart(2, "0")}]
            </span>
          </Link>

          <Link
            href={targetPath}
            className="font-tech text-xs tracking-widest uppercase text-accent-metal hover:text-bone border-b border-transparent hover:border-bone transition-all"
          >
            {targetLocale === "ar" ? "العربية" : "ENGLISH"}
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden font-tech text-[10px] sm:text-xs tracking-widest text-bone border border-carbon-border px-2.5 py-1 sm:px-3.5 sm:py-2 uppercase hover:border-bone transition-colors shrink-0 ms-auto"
          aria-label="Toggle Navigation Menu"
        >
          {isRtl ? "القائمة" : "MENU"}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
        targetPath={targetPath}
        targetLocale={targetLocale}
        navItems={navItems}
      />
    </header>
  );
}
