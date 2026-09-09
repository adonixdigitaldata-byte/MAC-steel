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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          // Hide when scrolling down, show when scrolling up
          if (currentY > lastScrollY.current && currentY > 120) {
            setVisible(false);
          } else if (currentY < lastScrollY.current) {
            setVisible(true);
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
      className={`lg:hidden fixed bottom-20 end-4 z-40 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-2 bg-[#111316]/95 backdrop-blur-md p-1.5 border border-carbon-border/80 shadow-2xl rounded-full">
        {/* WhatsApp Floating Action */}
        <button
          onClick={() => openWhatsApp(whatsappUrl)}
          className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors touch-feedback shadow-md"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle size={18} />
        </button>

        {/* Direct Call Action */}
        <a
          href={`tel:${SITE_CONFIG.contactPhone.replace(/\s+/g, "")}`}
          className="w-10 h-10 rounded-full bg-carbon text-bone border border-carbon-border hover:border-accent-copper hover:text-accent-copper flex items-center justify-center transition-colors touch-feedback"
          aria-label="Direct Phone Call"
        >
          <Phone size={16} />
        </a>

        {/* Email Inquiry Action */}
        <a
          href={`mailto:${SITE_CONFIG.contactEmail}`}
          className="w-10 h-10 rounded-full bg-carbon text-bone border border-carbon-border hover:border-accent-copper hover:text-accent-copper flex items-center justify-center transition-colors touch-feedback"
          aria-label="Send Email Inquiry"
        >
          <Mail size={16} />
        </a>
      </div>
    </div>
  );
}
