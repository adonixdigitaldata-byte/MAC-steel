"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Category } from "@/data/categories";
import { Locale } from "@/config/locales";
import ProductCard from "@/components/products/ProductCard";
import ProductListItem from "@/components/products/ProductListItem";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import { FadeReveal, StaggerGroup } from "@/components/motion";
import { cn } from "@/lib/utils";

interface ProductCatalogHubProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  initialCategory?: string;
}

export default function ProductCatalogHub({
  products,
  categories,
  locale,
  initialCategory = "all",
}: ProductCatalogHubProps) {
  const isRtl = locale === "ar";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedFinish, setSelectedFinish] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique materials & finishes for dynamic filter options
  const materialsList = useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      if (p.material) {
        if (p.material.includes("Stainless Steel") || p.material.includes("SS316") || p.material.includes("304")) {
          list.add("Stainless Steel (SS 316 / 304)");
        } else if (p.material.includes("Structural Steel") || p.material.includes("Mild Steel")) {
          list.add("Structural Steel / Mild Steel");
        } else if (p.material.includes("EPDM") || p.material.includes("Rubber")) {
          list.add("EPDM Elastomer & Rubber");
        } else if (p.material.includes("Fiberglass") || p.material.includes("FRP")) {
          list.add("FRP Pultruded Polymer");
        } else if (p.material.includes("Polyethylene") || p.material.includes("HDPE") || p.material.includes("PVC")) {
          list.add("Thermoplastic (HDPE / PVC)");
        }
      }
    });
    return Array.from(list);
  }, [products]);

  const finishesList = useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      if (p.finish) {
        list.add(p.finish);
      }
    });
    return Array.from(list);
  }, [products]);

  // Client-Side Search & Multi-Rail Filtering Engine
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query filter (matches Name, Part Number, Material, Grade, Specs, or Application)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query) || item.nameAr.toLowerCase().includes(query);
        const matchesPartNo = item.partNumber?.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
        const matchesMaterial = item.material?.toLowerCase().includes(query) || item.grade?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) || item.descriptionAr?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query) || item.categoryAr?.toLowerCase().includes(query);

        if (!matchesName && !matchesPartNo && !matchesMaterial && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "all") {
        const matchedCat = categories.find((c) => c.slug === selectedCategory);
        if (matchedCat && item.category !== matchedCat.name) {
          return false;
        }
      }

      // 3. Material Filter
      if (selectedMaterial !== "all") {
        if (selectedMaterial === "Stainless Steel (SS 316 / 304)") {
          if (!item.material?.includes("Stainless") && !item.material?.includes("SS") && !item.grade?.includes("316") && !item.grade?.includes("304")) return false;
        } else if (selectedMaterial === "Structural Steel / Mild Steel") {
          if (!item.material?.includes("Structural") && !item.material?.includes("Mild Steel") && !item.material?.includes("A36")) return false;
        } else if (selectedMaterial === "EPDM Elastomer & Rubber") {
          if (!item.material?.includes("EPDM") && !item.material?.includes("Elastomer")) return false;
        } else if (selectedMaterial === "FRP Pultruded Polymer") {
          if (!item.material?.includes("Fiberglass") && !item.material?.includes("FRP")) return false;
        } else if (selectedMaterial === "Thermoplastic (HDPE / PVC)") {
          if (!item.material?.includes("Poly") && !item.material?.includes("HDPE") && !item.material?.includes("PVC")) return false;
        }
      }

      // 4. Finish Filter
      if (selectedFinish !== "all") {
        if (item.finish !== selectedFinish) return false;
      }

      return true;
    });
  }, [products, categories, searchQuery, selectedCategory, selectedMaterial, selectedFinish]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedMaterial("all");
    setSelectedFinish("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedMaterial !== "all" || selectedFinish !== "all";

  return (
    <div className="w-full">
      {/* 01. TECHNICAL SEARCH BAR & VIEW CONTROLLER */}
      <FadeReveal y={20} duration={600} className="mb-8">
        <div className="border border-bone-border bg-bone-surface p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <span className="font-tech text-xs text-accent-copper font-bold">⌕</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRtl
                    ? "ابحث برقم القطعة (مثل CTK-ST-78502)، اسم المنتج، أو الخامة الفولاذية..."
                    : "Search by Product, Part Number or Material (e.g. CTK-ST-78502, Galvanized, SS 316)..."
                }
                className="w-full ps-9 pe-4 py-3 bg-world-bone text-carbon border border-bone-border font-tech text-xs placeholder:text-accent-mineral/60 focus:outline-none focus:border-accent-copper transition-colors uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 end-0 pe-3 flex items-center font-tech text-xs text-accent-mineral hover:text-carbon uppercase"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Actions & Mobile Filter Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 font-tech text-xs">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-3 bg-carbon text-bone border border-carbon flex items-center gap-2 uppercase tracking-wider"
              >
                <span>⚙</span>
                <span>{isRtl ? "الفلاتر الهندسية" : "FILTERS"}</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent-copper" />}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-bone-border bg-world-bone p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "px-3 py-1.5 uppercase transition-colors",
                    viewMode === "grid" ? "bg-carbon text-bone font-bold" : "text-carbon/60 hover:text-carbon"
                  )}
                  title="Grid View"
                >
                  ▦ {isRtl ? "شبكي" : "GRID"}
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "px-3 py-1.5 uppercase transition-colors",
                    viewMode === "list" ? "bg-carbon text-bone font-bold" : "text-carbon/60 hover:text-carbon"
                  )}
                  title="List View"
                >
                  ☰ {isRtl ? "أرشيف" : "LIST"}
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-bone-border/40 font-tech text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-accent-mineral uppercase">
                {isRtl ? "العناصر المطابقة:" : "SPEC ITEMS FOUND:"}{" "}
                <strong className="text-carbon">[{filteredProducts.length}]</strong>
              </span>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="ms-2 text-accent-copper underline hover:text-carbon uppercase"
                >
                  {isRtl ? "إعادة تعيين الفلاتر ↺" : "CLEAR ALL FILTERS ↺"}
                </button>
              )}
            </div>

            <div className="text-[10px] text-accent-mineral/70 uppercase hidden sm:block">
              SYSTEM REF: MAC-TDS-2026-CAT
            </div>
          </div>
        </div>
      </FadeReveal>

      {/* 02. MAIN TWO-COLUMN WORKSPACE: LEFT FILTER RAIL + RIGHT CATALOG DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP STICKY LEFT FILTER RAIL */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6 border border-bone-border bg-bone-surface p-6 font-tech text-xs select-none">
          <div className="flex justify-between items-center pb-3 border-b border-bone-border">
            <TechnicalLabel variant="copper">SPECIFICATION FILTERS</TechnicalLabel>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-accent-copper uppercase underline"
              >
                RESET
              </button>
            )}
          </div>

          {/* 1. Category Filter Section */}
          <div className="space-y-2">
            <span className="block text-[10px] tracking-widest text-accent-mineral uppercase font-bold">
              01 // {isRtl ? "تصنيف المنتجات" : "CATEGORY CLASSIFICATION"}
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                  selectedCategory === "all"
                    ? "bg-carbon text-bone font-bold"
                    : "text-carbon/80 hover:bg-world-bone"
                )}
              >
                <span>{isRtl ? "جميع التصنيفات" : "ALL CATEGORIES"}</span>
                <span className="opacity-60 font-mono text-[9px]">[{products.length}]</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                const isSelected = selectedCategory === cat.slug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                      isSelected
                        ? "bg-carbon text-bone font-bold"
                        : "text-carbon/80 hover:bg-world-bone"
                    )}
                  >
                    <span className="truncate pe-2">{isRtl ? cat.nameAr : cat.name}</span>
                    <span className="opacity-60 font-mono text-[9px]">[{count}]</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Material Filter Section */}
          <div className="space-y-2 border-t border-bone-border/50 pt-4">
            <span className="block text-[10px] tracking-widest text-accent-mineral uppercase font-bold">
              02 // {isRtl ? "نوع الخامة الفولاذية" : "STEEL & MATERIAL GRADE"}
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedMaterial("all")}
                className={cn(
                  "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                  selectedMaterial === "all"
                    ? "bg-carbon text-bone font-bold"
                    : "text-carbon/80 hover:bg-world-bone"
                )}
              >
                <span>{isRtl ? "جميع الخامات" : "ALL MATERIALS"}</span>
              </button>

              {materialsList.map((mat) => {
                const isSelected = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={cn(
                      "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                      isSelected
                        ? "bg-carbon text-bone font-bold"
                        : "text-carbon/80 hover:bg-world-bone"
                    )}
                  >
                    <span className="truncate">{mat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Finish Filter Section */}
          <div className="space-y-2 border-t border-bone-border/50 pt-4">
            <span className="block text-[10px] tracking-widest text-accent-mineral uppercase font-bold">
              03 // {isRtl ? "المعالجة والطلاء" : "SURFACE FINISH"}
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFinish("all")}
                className={cn(
                  "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                  selectedFinish === "all"
                    ? "bg-carbon text-bone font-bold"
                    : "text-carbon/80 hover:bg-world-bone"
                )}
              >
                <span>{isRtl ? "جميع أنواع الطلاء" : "ALL FINISHES"}</span>
              </button>

              {finishesList.map((finish) => {
                const isSelected = selectedFinish === finish;
                return (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={cn(
                      "w-full text-start px-2 py-1.5 transition-colors uppercase flex justify-between items-center text-[11px]",
                      isSelected
                        ? "bg-carbon text-bone font-bold"
                        : "text-carbon/80 hover:bg-world-bone"
                    )}
                  >
                    <span className="truncate">{finish}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architectural Badge */}
          <div className="pt-4 border-t border-bone-border/50 text-[9px] text-accent-mineral/60 uppercase">
            <span>QUALITY: ISO 9001 / ASTM A123</span>
          </div>
        </aside>

        {/* RIGHT: CATALOG RESULTS (GRID OR LIST) */}
        <section className="lg:col-span-9 min-w-0 w-full">
          {filteredProducts.length === 0 ? (
            /* EMPTY STATE: REFINED ENGINEERING ZERO-RESULT VIEW */
            <FadeReveal y={24} duration={600}>
              <div className="border border-bone-border bg-bone-surface p-8 sm:p-16 text-center space-y-6">
                <div className="w-12 h-12 mx-auto border border-accent-copper bg-world-bone flex items-center justify-center font-tech text-base text-accent-copper font-bold">
                  Ø
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <TechnicalLabel variant="copper">SPECIFICATION MATRIX: NO MATCH</TechnicalLabel>
                  <h3 className="font-display text-2xl sm:text-3xl text-carbon uppercase">
                    {isRtl ? "لم يتم العثور على نتائج مطابقة" : "NO MATCHING SPECIFICATIONS FOUND"}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-carbon/75 leading-relaxed">
                    {isRtl
                      ? `لم تتطابق أي عناصر مع معايير البحث الحالية "${searchQuery}". جرب إزالة الفلاتر أو إدخال رقم قطعة مختلف.`
                      : `No components in our master archive match the active query "${searchQuery}". Try modifying your search parameters or clearing filters.`}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={resetFilters}
                    className="font-tech text-xs uppercase px-6 py-3 bg-carbon text-bone border border-carbon hover:bg-world-bone hover:text-carbon transition-colors"
                  >
                    {isRtl ? "إعادة ضبط المعايير" : "CLEAR SEARCH FILTERS"}
                  </button>
                  <Link
                    href={`/${locale}/contact`}
                    className="font-tech text-xs uppercase px-6 py-3 bg-transparent text-carbon border border-bone-border hover:border-carbon transition-colors"
                  >
                    {isRtl ? "طلب تصنيع مخصص" : "REQUEST CUSTOM FABRICATION"}
                  </Link>
                </div>
              </div>
            </FadeReveal>
          ) : viewMode === "grid" ? (
            /* 1. PRODUCT GRID VIEW (Compact 3-column responsive matrix) */
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5" staggerDelay={40}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  world="bone"
                  index={index}
                />
              ))}
            </StaggerGroup>
          ) : (
            /* 2. PRODUCT LIST VIEW */
            <StaggerGroup className="space-y-4" staggerDelay={50}>
              {filteredProducts.map((product, index) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  locale={locale}
                  world="bone"
                  index={index}
                />
              ))}
            </StaggerGroup>
          )}
        </section>
      </div>

      {/* MOBILE COLLAPSIBLE FILTER DRAWER SHEET */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="relative w-[85%] max-w-sm h-full bg-world-bone text-carbon border-s border-bone-border p-6 overflow-y-auto z-10 space-y-6 font-tech text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-bone-border">
              <TechnicalLabel variant="copper">ENGINEERING FILTERS</TechnicalLabel>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="font-bold text-sm px-2 py-1 border border-bone-border"
              >
                ✕
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-2">
              <span className="block text-[10px] text-accent-mineral uppercase font-bold">CATEGORY</span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setMobileFilterOpen(false);
                  }}
                  className={cn(
                    "w-full text-start p-2 uppercase text-[11px]",
                    selectedCategory === "all" ? "bg-carbon text-bone font-bold" : "bg-bone-surface text-carbon"
                  )}
                >
                  ALL CATEGORIES
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={cn(
                      "w-full text-start p-2 uppercase text-[11px] truncate",
                      selectedCategory === cat.slug ? "bg-carbon text-bone font-bold" : "bg-bone-surface text-carbon"
                    )}
                  >
                    {isRtl ? cat.nameAr : cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Materials */}
            <div className="space-y-2 border-t border-bone-border pt-4">
              <span className="block text-[10px] text-accent-mineral uppercase font-bold">MATERIAL</span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedMaterial("all");
                    setMobileFilterOpen(false);
                  }}
                  className={cn(
                    "w-full text-start p-2 uppercase text-[11px]",
                    selectedMaterial === "all" ? "bg-carbon text-bone font-bold" : "bg-bone-surface text-carbon"
                  )}
                >
                  ALL MATERIALS
                </button>
                {materialsList.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => {
                      setSelectedMaterial(mat);
                      setMobileFilterOpen(false);
                    }}
                    className={cn(
                      "w-full text-start p-2 uppercase text-[11px] truncate",
                      selectedMaterial === mat ? "bg-carbon text-bone font-bold" : "bg-bone-surface text-carbon"
                    )}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-bone-border space-y-3">
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-3 border border-bone-border text-center uppercase"
                >
                  RESET ALL FILTERS
                </button>
              )}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-carbon text-bone font-bold text-center uppercase"
              >
                APPLY & VIEW ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
