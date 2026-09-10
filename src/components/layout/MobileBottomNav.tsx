"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/config/locales";
import { Home, Layers, Grid, Building2, PhoneCall } from "lucide-react";

interface MobileBottomNavProps {
  locale: Locale;
}

export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname();
  const isRtl = locale === "ar";

  const navItems = [
    {
      id: "home",
      label: isRtl ? "الرئيسية" : "Home",
      href: `/${locale}`,
      icon: Home,
      isActive: pathname === `/${locale}`,
    },
    {
      id: "products",
      label: isRtl ? "المنتجات" : "Products",
      href: `/${locale}/products`,
      icon: Layers,
      isActive: pathname.startsWith(`/${locale}/products`),
    },
    {
      id: "applications",
      label: isRtl ? "القطاعات" : "Sectors",
      href: `/${locale}/applications`,
      icon: Grid,
      isActive: pathname.startsWith(`/${locale}/applications`),
    },
    {
      id: "about",
      label: isRtl ? "المؤسسة" : "About",
      href: `/${locale}/about`,
      icon: Building2,
      isActive: pathname.startsWith(`/${locale}/about`),
    },
    {
      id: "contact",
      label: isRtl ? "التواصل" : "Contact",
      href: `/${locale}/contact`,
      icon: PhoneCall,
      isActive: pathname.startsWith(`/${locale}/contact`),
    },
  ];

  return (
    <nav
      aria-label={isRtl ? "شريط التنقل السفلي" : "Mobile Bottom Navigation"}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1013]/95 backdrop-blur-xl border-t border-carbon-border/80 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)",
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              id={`mobile-nav-${item.id}`}
              className={`group relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all duration-200 select-none touch-feedback ${
                active ? "text-[#C8A94A]" : "text-[#8E9099] hover:text-[#D4CBB8]"
              }`}
            >
              {/* Active Indicator Top Glow Bar */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#C8A94A] rounded-full shadow-[0_0_8px_rgba(200,169,74,0.8)]" />
              )}

              {/* Icon Container with subtle active glow */}
              <div
                className={`flex items-center justify-center p-1 rounded-md transition-all duration-200 ${
                  active ? "bg-[#C8A94A]/10 scale-105" : "group-hover:scale-105"
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.3 : 1.75} />
              </div>

              {/* Label */}
              <span
                className={`font-tech text-[10px] tracking-wider uppercase leading-none mt-1 transition-colors ${
                  active ? "font-bold text-[#F3EFE5]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
