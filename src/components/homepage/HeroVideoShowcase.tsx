"use client";

import React, { useRef, useEffect, useState } from "react";
import { Locale } from "@/config/locales";
import { Container } from "@/components/ui/Container";

interface HeroVideoShowcaseProps {
  locale: Locale;
}

export default function HeroVideoShowcase({ locale }: HeroVideoShowcaseProps) {
  const isRtl = locale === "ar";
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play / pause on intersection observer for optimal performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0a0b0d] border-b border-carbon-border overflow-hidden select-none py-8 sm:py-12 lg:py-16"
    >
      <Container>
        {/* Top Technical Metadata Header Strip */}
        <div className="flex items-center justify-between border-b border-carbon-border/60 pb-3 mb-6 font-tech text-[10px] tracking-widest text-accent-metal uppercase">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-bone font-bold">
              {isRtl ? "الفيديو الهندسي // المنشأة الميدانية" : "CINEMATIC SHOWCASE // FACILITY & FABRICATION"}
            </span>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse font-tech text-[9px] text-accent-copper">
            <span>HD 1080P · 60 FPS</span>
            <span>·</span>
            <span>KSA MGF LIVE</span>
          </div>
        </div>

        {/* Video Frame Container */}
        <div className="relative w-full rounded-sm overflow-hidden border border-carbon-border/80 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.8)] group">
          
          {/* Desktop Video (hidden on mobile/tablet) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="hidden md:block w-full h-auto max-h-[75vh] object-cover object-center"
            poster="/hero-factory-1.jpg"
          >
            <source src="/pcvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Mobile Video (visible only on mobile/tablet) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="block md:hidden w-full h-auto max-h-[70vh] object-cover object-center"
            poster="/hero-factory-1.jpg"
          >
            <source src="/mobilevideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Subtle Industrial Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Bottom Video Quick Controls */}
          <div className="absolute bottom-4 end-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 text-bone font-tech text-[10px] rounded-sm opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              className="hover:text-accent-copper uppercase font-bold tracking-wider transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (isRtl ? "إيقاف مؤقت ❚❚" : "PAUSE ❚❚") : (isRtl ? "تشغيل ▶" : "PLAY ▶")}
            </button>
            <span>|</span>
            <button
              onClick={toggleMute}
              className="hover:text-accent-copper uppercase font-bold tracking-wider transition-colors"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (isRtl ? "كتم الصوت 🔇" : "MUTED 🔇") : (isRtl ? "تشغيل الصوت 🔊" : "SOUND ON 🔊")}
            </button>
          </div>
        </div>

        {/* Bottom Notation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 font-tech text-[9px] text-accent-metal/60 uppercase tracking-widest">
          <span>{isRtl ? "شركة ميتالو أرابيا — مصنع جدة المتطور" : "METALLO ARABIA COMPANY — ADVANCED JEDDAH FABRICATION FACILITY"}</span>
          <span className="text-accent-copper/80">ISO 9001:2015 CERTIFIED MANUFACTURING</span>
        </div>
      </Container>
    </section>
  );
}
