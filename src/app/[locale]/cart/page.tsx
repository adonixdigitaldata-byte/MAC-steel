"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { isValidLocale, Locale } from "@/config/locales";
import { useCart } from "@/components/cart";
import {
  generateWhatsAppRFQUrl,
  generateRFQPlainText,
  ProjectInformation,
  getStoredCustomerInfo,
  saveStoredCustomerInfo,
} from "@/lib/cart";
import { openWhatsApp } from "@/lib/whatsapp";
import PageHero from "@/components/layout/PageHero";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import { Container, Section } from "@/components/ui/Container";
import { Input, Textarea } from "@/components/ui/Input";
import { FadeReveal, StaggerGroup } from "@/components/motion";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const params = useParams();
  const localeStr = (params?.locale as string) || "en";
  const locale = (isValidLocale(localeStr) ? localeStr : "en") as Locale;
  const isRtl = locale === "ar";

  const {
    items,
    totalCount,
    totalQuantity,
    rfqReference,
    updateQuantity,
    removeItem,
    clearAll,
  } = useCart();

  const [formData, setFormData] = useState<ProjectInformation>({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    projectLocation: "Jeddah / KSA",
    projectName: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Load saved customer info from localStorage
  useEffect(() => {
    const saved = getStoredCustomerInfo();
    if (saved) {
      setFormData(saved);
    }
  }, []);

  const handleFormChange = (field: keyof ProjectInformation, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      saveStoredCustomerInfo(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyRFQ = () => {
    if (items.length === 0) return;
    const text = generateRFQPlainText(items, formData, rfqReference, isRtl);
    navigator.clipboard.writeText(text);
    showToast(isRtl ? "تم نسخ نص طلب التسعير إلى الحافظة ✓" : "RFQ schedule copied to clipboard ✓");
  };

  const handleClearConfirm = () => {
    clearAll();
    setConfirmClearOpen(false);
    showToast(isRtl ? "تم إفراغ سلة RFQ بنجاح" : "RFQ specification schedule cleared");
  };

  const handleWhatsAppSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim() || !formData.companyName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMessage(
        isRtl
          ? "يرجى تعبئة الحقول الأساسية الإلزامية: الاسم، الشركة، الجوال، والبريد الإلكتروني."
          : "Please complete mandatory project fields: Name, Company, Phone, and Email."
      );
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        isRtl ? "سلة RFQ فارغة. يرجى إضافة عناصر أولاً." : "Your RFQ list is empty. Add products first."
      );
      return;
    }

    saveStoredCustomerInfo(formData);
    setIsSubmitting(true);
    const targetUrl = generateWhatsAppRFQUrl(items, formData, rfqReference, isRtl);
    openWhatsApp(targetUrl);
    showToast(isRtl ? "جاري تحويلك إلى واتساب الهندسي..." : "Opening WhatsApp Engineering Desk...");
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <main className="min-h-screen bg-world-bone text-carbon w-full max-w-full overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 end-6 z-50 bg-[#141518] text-bone border border-accent-copper/80 px-4 py-3 font-tech text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-accent-copper animate-ping" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-world-bone text-carbon border border-bone-border max-w-md w-full p-6 space-y-4 font-tech text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-accent-copper font-bold">
              <span>⚠</span>
              <span className="uppercase">CONFIRM RFQ CLEARANCE</span>
            </div>
            <p className="font-body text-xs text-carbon/80 leading-relaxed">
              {isRtl
                ? "هل أنت متأكد من رغبتك في تفريغ جميع المكونات المحددة من جدول RFQ؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you wish to clear all specification items from your quotation schedule? This action will reset your active session."}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 border border-bone-border hover:border-carbon uppercase text-carbon"
              >
                {isRtl ? "إلغاء" : "CANCEL"}
              </button>
              <button
                onClick={handleClearConfirm}
                className="px-4 py-2 bg-red-600 text-white font-bold uppercase hover:bg-red-700"
              >
                {isRtl ? "تفريغ السلة" : "CONFIRM CLEAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 01. STREAMLINED COMPACT HERO FOR RFQ QUOTATION DESK */}
      <PageHero
        eyebrow={isRtl ? "مكتب تسعير وتوصيف المشاريع" : "QUOTATION DESK"}
        title={isRtl ? "سلة طلب الأسعار والمواصفات" : "RFQ QUOTATION DESK"}
        description={
          isRtl
            ? "راجع المكونات الفولاذية المحددة وأرسل طلب التسعير الرسمي مباشرة."
            : "Review selected structural components and dispatch your official engineering quotation inquiry."
        }
        breadcrumb={isRtl ? "الرئيسية / سلة الطلبات" : "HOME / RFQ CART"}
        overlayStyle="technical"
        compact={true}
        showRightSpec={false}
        showDocumentId={false}
        showTechnicalMeta={false}
        locale={locale}
      />

      {/* 02. MAIN RFQ QUOTATION WORKSPACE */}
      <Section world="bone" className="pt-8 sm:pt-14 pb-20">
        <Container>
          {items.length === 0 ? (
            /* EMPTY RFQ STATE WITH BLUEPRINT SCHEMATIC */
            <FadeReveal y={24} duration={700}>
              <div className="border border-bone-border bg-bone-surface p-8 sm:p-20 text-center space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 mx-auto border border-accent-copper bg-world-bone flex items-center justify-center font-tech text-xl text-accent-copper font-bold shadow-inner">
                  ⌗
                </div>

                <div className="space-y-3">
                  <TechnicalLabel variant="copper">SPECIFICATION REGISTRY / ZERO ITEMS</TechnicalLabel>
                  <h3 className="font-display text-3xl sm:text-4xl text-carbon uppercase">
                    {isRtl ? "قائمة طلب الأسعار فارغة حالياً" : "YOUR RFQ SPECIFICATION LIST IS EMPTY"}
                  </h3>
                  <p className="font-body text-xs sm:text-base text-carbon/75 max-w-md mx-auto leading-relaxed">
                    {isRtl
                      ? "لم تقم بإضافة أي مكونات فولاذية إلى قائمة التسعير بعد. تصفح الكتالوج الهندسي وأضف المواد المطلوبة."
                      : "You have not added any structural steel components or precision hardware to your quotation schedule."}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href={`/${locale}/products`}
                    className="font-tech text-xs uppercase tracking-widest px-8 py-4 bg-carbon text-bone border border-carbon hover:bg-world-bone hover:text-carbon transition-colors font-bold"
                  >
                    {isRtl ? "استعراض كتالوج المنتجات" : "BROWSE PRODUCT CATALOG"}
                  </Link>
                  <Link
                    href={`/${locale}/applications`}
                    className="font-tech text-xs uppercase tracking-widest px-8 py-4 bg-transparent text-carbon border border-bone-border hover:border-carbon transition-colors"
                  >
                    {isRtl ? "استكشاف قطاعات البنية التحتية" : "EXPLORE APPLICATIONS"}
                  </Link>
                </div>
              </div>
            </FadeReveal>
          ) : (
            /* POPULATED RFQ WORKSPACE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
              {/* LEFT 7-COL: QUOTATION ITEMS SCHEDULE */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-bone-border gap-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse font-tech text-xs">
                    <TechnicalLabel variant="copper">
                      {isRtl ? "جدول العناصر المحددة" : "QUOTATION ITEM SCHEDULE"}
                    </TechnicalLabel>
                    <span className="text-accent-mineral font-mono">[{totalCount} ITEMS]</span>
                  </div>

                  <div className="flex items-center gap-3 font-tech text-[10px]">
                    <button
                      onClick={handleCopyRFQ}
                      className="text-accent-copper hover:text-carbon uppercase underline transition-colors"
                    >
                      {isRtl ? "نسخ الملخص 📋" : "COPY RFQ TEXT 📋"}
                    </button>
                    <span className="text-bone-border">|</span>
                    <button
                      onClick={() => setConfirmClearOpen(true)}
                      className="text-accent-mineral hover:text-red-600 uppercase underline transition-colors"
                    >
                      {isRtl ? "تفريغ القائمة ↺" : "CLEAR RFQ ↺"}
                    </button>
                  </div>
                </div>

                {/* Items List Rows */}
                <StaggerGroup className="space-y-4" staggerDelay={60}>
                  {items.map((item, index) => {
                    const p = item.product;
                    const formattedIdx = String(index + 1).padStart(2, "0");

                    return (
                      <div
                        key={p.id}
                        className="border border-bone-border bg-bone-surface p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover:border-carbon/30 transition-all duration-200 group"
                      >
                        {/* Media Thumbnail & Number */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse min-w-0 w-full sm:w-auto">
                          <span className="font-tech text-xs font-bold text-accent-mineral border border-bone-border px-2 py-1 shrink-0">
                            {formattedIdx}
                          </span>

                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-bone-border bg-world-bone overflow-hidden">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-tech text-[9px] text-accent-mineral">
                                CAD SPEC
                              </div>
                            )}
                          </div>

                          {/* Identity */}
                          <div className="min-w-0 flex-1">
                            <span className="font-tech text-[10px] text-accent-copper font-bold block uppercase truncate">
                              {p.partNumber}
                            </span>
                            <Link
                              href={`/${locale}/products/${p.slug}`}
                              className="font-display text-base sm:text-xl text-carbon uppercase block hover:text-accent-copper transition-colors truncate"
                            >
                              {isRtl ? p.nameAr : p.name}
                            </Link>
                            <span className="font-tech text-[10px] text-accent-mineral block truncate">
                              {p.finish || p.material || "SS 316L Standard"}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-bone-border/50">
                          <div className="flex items-center border border-bone-border bg-world-bone font-tech">
                            <button
                              onClick={() => updateQuantity(p.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-sm text-carbon hover:bg-carbon/10 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-bold text-xs text-carbon font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(p.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-sm text-carbon hover:bg-carbon/10 transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(p.id)}
                            className="font-tech text-xs text-accent-mineral hover:text-accent-copper uppercase transition-colors"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </StaggerGroup>

                {/* Continue Shopping Button */}
                <div className="pt-4 flex justify-between items-center">
                  <Link
                    href={`/${locale}/products`}
                    className="font-tech text-xs text-carbon hover:text-accent-copper uppercase tracking-wider flex items-center gap-2 border border-bone-border px-4 py-2.5 bg-world-bone transition-colors"
                  >
                    <span>← {isRtl ? "مواصلة تصفح المنتجات" : "CONTINUE BROWSING CATALOG"}</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT 5-COL: PROJECT INFORMATION & WHATSAPP GENERATION TERMINAL */}
              <div className="lg:col-span-5 sticky top-28">
                <FadeReveal y={24} duration={700} className="border border-bone-border bg-bone-surface p-6 sm:p-8 space-y-6 shadow-md">
                  <div className="flex justify-between items-center pb-3 border-b border-bone-border">
                    <TechnicalLabel variant="copper">
                      {isRtl ? "بيانات المشروع وموقع العمل" : "PROJECT REGISTRY SPEC"}
                    </TechnicalLabel>
                    <span className="font-tech text-[10px] text-accent-copper font-mono font-bold">
                      {rfqReference}
                    </span>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 gap-3 font-tech text-xs border-b border-bone-border pb-4">
                    <div className="p-3 border border-bone-border bg-world-bone">
                      <span className="text-[10px] text-accent-mineral block uppercase">ITEMS IN RFQ</span>
                      <span className="font-bold text-base text-carbon font-mono">[{totalCount}]</span>
                    </div>
                    <div className="p-3 border border-bone-border bg-world-bone">
                      <span className="text-[10px] text-accent-mineral block uppercase">TOTAL UNITS</span>
                      <span className="font-bold text-base text-accent-copper font-mono">{totalQuantity}</span>
                    </div>
                  </div>

                  {/* Project Input Form */}
                  <form onSubmit={handleWhatsAppSubmission} className="space-y-4 font-tech text-xs">
                    {errorMessage && (
                      <div className="p-3 border border-red-600/40 bg-red-600/10 text-red-600 text-xs font-bold">
                        {errorMessage}
                      </div>
                    )}

                    <Input
                      label={isRtl ? "الاسم الكامل للمهندس / المشتري *" : "CONTACT / SPECIFIER FULL NAME *"}
                      placeholder="e.g. Eng. Khalid Al-Ghamdi"
                      value={formData.fullName}
                      onChange={(e) => handleFormChange("fullName", e.target.value)}
                      required
                      world="bone"
                    />

                    <Input
                      label={isRtl ? "اسم الشركة / جهة التعاقد *" : "COMPANY / CONTRACTOR NAME *"}
                      placeholder="e.g. Red Sea Infrastructure Works"
                      value={formData.companyName}
                      onChange={(e) => handleFormChange("companyName", e.target.value)}
                      required
                      world="bone"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label={isRtl ? "رقم الجوال *" : "PHONE NUMBER *"}
                        type="tel"
                        placeholder="+966 50 000 0000"
                        value={formData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                        required
                        world="bone"
                      />

                      <Input
                        label={isRtl ? "البريد الإلكتروني *" : "EMAIL ADDRESS *"}
                        type="email"
                        placeholder="khalid@company.com"
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                        required
                        world="bone"
                      />
                    </div>

                    <Input
                      label={isRtl ? "موقع المشروع / المدينة *" : "PROJECT LOCATION / CITY *"}
                      placeholder="e.g. Jeddah Industrial Port / Riyadh Metro"
                      value={formData.projectLocation}
                      onChange={(e) => handleFormChange("projectLocation", e.target.value)}
                      required
                      world="bone"
                    />

                    <Input
                      label={isRtl ? "اسم المشروع (اختياري)" : "PROJECT REFERENCE NAME (OPTIONAL)"}
                      placeholder="e.g. Utility Tunnel Expansion Phase 2"
                      value={formData.projectName || ""}
                      onChange={(e) => handleFormChange("projectName", e.target.value)}
                      world="bone"
                    />

                    <Textarea
                      label={isRtl ? "ملاحظات إضافية / طلب شهادات الفحص" : "TECHNICAL INQUIRY NOTES / CERTIFICATIONS"}
                      placeholder="e.g. Please confirm delivery lead time and mill test certificates per batch."
                      rows={3}
                      value={formData.additionalNotes || ""}
                      onChange={(e) => handleFormChange("additionalNotes", e.target.value)}
                      world="bone"
                    />

                    {/* WhatsApp Action Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-carbon text-bone font-bold text-xs uppercase tracking-widest border border-carbon hover:bg-bone hover:text-carbon transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                        <span>
                          {isSubmitting
                            ? (isRtl ? "جاري تجهيز الطلب..." : "PREPARING DISPATCH...")
                            : (isRtl ? "إرسال طلب التسعير عبر واتساب" : "DISPATCH RFQ VIA WHATSAPP")}
                        </span>
                        <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          →
                        </span>
                      </button>
                    </div>

                    <div className="text-[9px] text-accent-mineral/70 text-center uppercase pt-1">
                      DIRECT ENGINEERING DESK · PERSISTENT RFQ SESSION
                    </div>
                  </form>
                </FadeReveal>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
