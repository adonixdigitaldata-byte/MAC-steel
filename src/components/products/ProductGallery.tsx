"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  gallery?: string[];
  mainImage?: string;
  partNumber: string;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  isRtl?: boolean;
}

export default function ProductGallery({
  gallery = [],
  mainImage,
  partNumber,
  name,
  nameAr,
  category,
  categoryAr,
  isRtl = false,
}: ProductGalleryProps) {
  // Consolidate images
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (mainImage && !list.includes(mainImage)) list.push(mainImage);
    gallery.forEach((img) => {
      if (img && !list.includes(img)) list.push(img);
    });
    return list;
  }, [mainImage, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = allImages[activeIndex];

  return (
    <div className="w-full space-y-4 select-none">
      {/* 1. Main Display Stage */}
      <div className="relative overflow-hidden border border-bone-border bg-bone-surface group">
        {activeImage ? (
          <div
            onClick={() => setFullscreenOpen(true)}
            className="relative aspect-square sm:aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
          >
            <Image
              src={activeImage}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent pointer-events-none" />

            {/* Click to Zoom Pill */}
            <div className="absolute bottom-3 end-3 font-tech text-[9px] uppercase px-2.5 py-1 bg-carbon/85 text-bone border border-carbon-border/60 backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity">
              🔍 {isRtl ? "تكبير العرض" : "CLICK TO EXPAND"}
            </div>
          </div>
        ) : (
          /* Blueprint Schematic Visualizer if no photograph */
          <div className="relative aspect-square w-full">
            <ProductPlaceholder
              productId={partNumber}
              category={isRtl ? (categoryAr || category) : category}
              name={isRtl ? (nameAr || name) : name}
              world="bone"
              aspectRatio="square"
            />
          </div>
        )}

        {/* Part Number Badge */}
        <div className="absolute top-3 start-3 font-tech text-[10px] font-bold tracking-wider px-2.5 py-1 bg-carbon text-accent-copper border border-carbon-border z-10">
          {partNumber}
        </div>
      </div>

      {/* 2. Thumbnail Carousel / Switching Bar (if 2+ images) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden border transition-all duration-200",
                  isActive
                    ? "border-accent-copper scale-95 shadow-md shadow-accent-copper/20"
                    : "border-bone-border opacity-60 hover:opacity-100 hover:border-carbon/50"
                )}
                aria-label={`View gallery image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Fullscreen Zoom Modal Viewer */}
      {fullscreenOpen && activeImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex justify-between items-center pb-4 border-b border-carbon-border font-tech text-xs text-bone">
            <div className="flex items-center gap-3">
              <span className="text-accent-copper font-bold">{partNumber}</span>
              <span className="opacity-60">// {name}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-3 py-1 border border-carbon-border hover:border-accent-copper transition-colors uppercase"
              >
                {isZoomed ? "1x RESET" : "2x ZOOM"}
              </button>
              <button
                onClick={() => {
                  setFullscreenOpen(false);
                  setIsZoomed(false);
                }}
                className="px-3 py-1 bg-bone text-carbon font-bold hover:bg-accent-copper hover:text-bone transition-colors uppercase"
              >
                ✕ CLOSE
              </button>
            </div>
          </div>

          {/* Center Zoom Viewport */}
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className="relative flex-1 my-4 flex items-center justify-center overflow-auto cursor-zoom-in"
          >
            <div
              className={cn(
                "relative transition-transform duration-300 ease-out",
                isZoomed ? "w-[150vw] h-[150vh] cursor-zoom-out" : "w-full h-full max-w-5xl max-h-[80vh]"
              )}
            >
              <Image
                src={activeImage}
                alt={name}
                fill
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>
          </div>

          {/* Bottom Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-carbon-border">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative w-14 h-14 border transition-all",
                    idx === activeIndex ? "border-accent-copper" : "border-carbon-border opacity-50"
                  )}
                >
                  <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
