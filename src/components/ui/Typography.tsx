import React from "react";
import { cn } from "@/lib/utils";

type SupportedTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: SupportedTag;
}

export function DisplayXL({ children, className = "", as = "h1" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-display text-3.5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-[0.95] sm:leading-[0.9] text-inherit break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function DisplayL({ children, className = "", as = "h2" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-display text-2.5xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[0.98] sm:leading-[0.95] text-inherit break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function DisplayM({ children, className = "", as = "h3" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-display text-xl sm:text-3xl md:text-4xl tracking-wide uppercase leading-tight text-inherit break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function Heading({ children, className = "", as = "h4" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-body font-semibold text-base sm:text-xl tracking-normal leading-snug text-inherit break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function BodyText({ children, className = "", as = "p" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-body text-xs sm:text-base leading-relaxed text-inherit opacity-90 break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function MetaText({ children, className = "", as = "span" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-tech text-[11px] sm:text-xs tracking-wider uppercase leading-normal text-inherit break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function MicroText({ children, className = "", as = "span" }: TypographyProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        "font-tech text-[9px] sm:text-[10px] tracking-widest uppercase text-inherit opacity-75 break-words max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}
