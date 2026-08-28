import React from "react";
import Link from "next/link";
import { Locale } from "@/config/locales";
import IconArrow from "./IconArrow";
import { cn } from "@/lib/utils";

interface ButtonBaseProps {
  children: React.ReactNode;
  locale: Locale;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  world?: "carbon" | "bone";
  showArrow?: boolean;
  arrowDirection?: "forward" | "backward";
  className?: string;
  disabled?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  locale,
  variant = "primary",
  world = "carbon",
  showArrow = true,
  arrowDirection = "forward",
  className = "",
  disabled = false,
  href,
  ...props
}: ButtonProps) {
  // Styles based on World and Variant
  const baseStyles =
    "group inline-flex items-center justify-between font-tech text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase transition-all duration-200 focus:outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed max-w-full min-w-0 flex-wrap sm:flex-nowrap gap-2";

  let colorStyles = "";

  if (world === "carbon") {
    switch (variant) {
      case "primary":
        colorStyles =
          "bg-bone text-carbon border border-bone hover:bg-carbon hover:text-bone hover:border-bone";
        break;
      case "secondary":
        colorStyles =
          "bg-carbon-surface text-bone border border-carbon-border hover:border-bone";
        break;
      case "outline":
        colorStyles =
          "bg-transparent text-bone border border-carbon-border hover:border-bone hover:bg-carbon-surface";
        break;
      case "ghost":
        colorStyles =
          "bg-transparent text-accent-metal hover:text-bone px-0 py-0 border-none";
        break;
    }
  } else {
    // Bone World
    switch (variant) {
      case "primary":
        colorStyles =
          "bg-carbon text-bone border border-carbon hover:bg-bone hover:text-carbon hover:border-carbon";
        break;
      case "secondary":
        colorStyles =
          "bg-bone-surface text-carbon border border-bone-border hover:border-carbon";
        break;
      case "outline":
        colorStyles =
          "bg-transparent text-carbon border border-bone-border hover:border-carbon hover:bg-bone-surface";
        break;
      case "ghost":
        colorStyles =
          "bg-transparent text-accent-mineral hover:text-carbon px-0 py-0 border-none";
        break;
    }
  }

  const paddingStyles = variant === "ghost" ? "" : "px-4 py-3 sm:px-6 sm:py-3.5";

  const content = (
    <>
      <span className="font-bold break-words max-w-full">{children}</span>
      {showArrow && (
        <span className="ms-2 sm:ms-3 shrink-0 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          <IconArrow locale={locale} direction={arrowDirection} size={14} />
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, colorStyles, paddingStyles, className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={cn(baseStyles, colorStyles, paddingStyles, className)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
