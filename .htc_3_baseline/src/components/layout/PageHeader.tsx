import React from "react";
import { Locale } from "@/config/locales";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import { DisplayL, BodyText } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  index?: string | number;
  label: string;
  title: string;
  description?: string;
  locale: Locale;
  world?: "carbon" | "bone";
  className?: string;
}

export default function PageHeader({
  index = "01",
  label,
  title,
  description,
  locale,
  world = "bone",
  className = "",
}: PageHeaderProps) {
  const isBone = world === "bone";

  return (
    <div
      className={cn(
        "border-b pb-8 sm:pb-12 mb-8 sm:mb-16 w-full max-w-full box-border",
        isBone ? "border-bone-border text-carbon" : "border-carbon-border text-bone",
        className
      )}
    >
      {/* Index & Technical Label - Stacked on narrow mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6 max-w-full">
        <NumberBadge number={index} world={world} />
        <TechnicalLabel variant={isBone ? "mineral" : "metal"}>{label}</TechnicalLabel>
      </div>

      {/* Main Page Title Statement - Editorial Wrapping */}
      <DisplayL className="mb-4 sm:mb-6 max-w-4xl">{title}</DisplayL>

      {/* Supporting Copy */}
      {description && (
        <BodyText className={cn("max-w-2xl text-xs sm:text-base lg:text-lg", isBone ? "text-carbon/80" : "text-accent-metal")}>
          {description}
        </BodyText>
      )}
    </div>
  );
}
