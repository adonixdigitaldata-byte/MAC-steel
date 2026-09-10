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
      className="hidden md:block relative w-full bg-[#0a0b0d] border-b border-carbon-border overflow-hidden select-none py-0"
    >
      {/* Top Technical Metadata Header Strip (Floating Overlay) */}
      <div className="absolute top-6 inset-x-0 z-30 pointer-events-none">
        <Container size="full" className="px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between border border-carbon-border/60 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-sm font-tech text-[10px] tracking-widest text-accent-metal uppercase">
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
        </Container>
      </div>

      {/* Video Frame Container - Full screen edge-to-edge on desktop */}
      <div className="relative w-full min-h-screen h-screen overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.8)] group flex items-center justify-center">
        {/* Desktop Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-center"
          poster="/hero-factory-1.jpg"
        >
          <source src="/pcvideo.mp4" type="video/mp4" />
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
        <div className="absolute bottom-12 end-12 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-2 border border-white/10 text-bone font-tech text-[10px] rounded-sm opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="hover:text-accent-copper uppercase font-bold tracking-wider transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (isRtl ? "إيقاف مؤقت ❚❚" : "PAUSE ❚❚") : (isRtl ? "تشغيل ▶" : "PLAY ▶")}
          </button>
          <span className="text-white/30">|</span>
          <button
            onClick={toggleMute}
            className="hover:text-accent-copper uppercase font-bold tracking-wider transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (isRtl ? "كتم الصوت 🔇" : "MUTED 🔇") : (isRtl ? "تشغيل الصوت 🔊" : "SOUND ON 🔊")}
          </button>
        </div>

        {/* Desktop Bottom Notation Bar as Floating Overlay */}
        <div className="absolute bottom-6 inset-x-0 z-30 pointer-events-none">
          <Container size="full" className="px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between font-tech text-[9px] text-accent-metal/80 uppercase tracking-widest bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-sm border border-carbon-border/40">
              <span>{isRtl ? "شركة ميتالو أرابيا — مصنع جدة المتطور" : "METALLO ARABIA COMPANY — ADVANCED JEDDAH FABRICATION FACILITY"}</span>
              <span className="text-accent-copper">ISO 9001:2015 CERTIFIED MANUFACTURING</span>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
