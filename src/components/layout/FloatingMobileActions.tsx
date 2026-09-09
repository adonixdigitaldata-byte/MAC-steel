"use client";

import React, { useState, useEffect, useRef } from "react";
import { Locale } from "@/config/locales";
import { SITE_CONFIG } from "@/data/config";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

interface FloatingMobileActionsProps {
  locale: Locale;
}

export default function FloatingMobileActions({ locale }: FloatingMobileActionsProps) {
  const isRtl = locale === "ar";
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          // Hide in Hero & 3D Manufacturing sections (first 1.5 viewport heights)
          const heroMfgThreshold = window.innerHeight * 1.5;

          if (currentY <= heroMfgThreshold) {
            setVisible(false);
          } else {
            // Hide while scrolling down, return while scrolling up
            if (currentY > lastScrollY.current + 10) {
              setVisible(false);
            } else if (currentY < lastScrollY.current - 5) {
              setVisible(true);
            }
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

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    isRtl ? "مرحباً فريق شركة ميتالو أرابيا (MAC)، أود الاستفسار عن المنتجات والمواصفات." : "Hello MAC Engineering Desk, I would like to inquire about specifications."
  )}`;

  return (
    <div
      className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-out select-none ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Premium Unified Floating Contact Pill */}
      <div className="flex items-center gap-1.5 bg-[#111316]/95 text-bone backdrop-blur-xl px-3 py-2 border-2 border-[#C8A94A]/60 shadow-[0_8px_32px_rgba(0,0,0,0.45)] rounded-full">
        {/* WhatsApp Action */}
        <button
          onClick={() => openWhatsApp(whatsappUrl)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors touch-feedback font-tech text-xs font-bold uppercase"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle size={15} />
          <span>{isRtl ? "واتساب" : "WhatsApp"}</span>
        </button>

        {/* Divider */}
        <span className="w-px h-5 bg-carbon-border" />

        {/* Direct Call Action */}
        <a
          href={`tel:${SITE_CONFIG.contactPhone.replace(/\s+/g, "")}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-carbon text-bone border border-carbon-border hover:border-accent-copper hover:text-accent-copper transition-colors touch-feedback font-tech text-xs font-bold uppercase"
          aria-label="Direct Phone Call"
        >
          <Phone size={14} className="text-accent-copper" />
          <span>{isRtl ? "اتصال" : "Call"}</span>
        </a>

        {/* Divider */}
        <span className="w-px h-5 bg-carbon-border" />

        {/* Email Inquiry Action */}
        <a
          href={`mailto:${SITE_CONFIG.contactEmail}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-carbon text-bone border border-carbon-border hover:border-accent-copper hover:text-accent-copper transition-colors touch-feedback font-tech text-xs font-bold uppercase"
          aria-label="Send Email Inquiry"
        >
          <Mail size={14} className="text-accent-copper" />
          <span>{isRtl ? "إيميل" : "Email"}</span>
        </a>
      </div>
    </div>
  );
}
