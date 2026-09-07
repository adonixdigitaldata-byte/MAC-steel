import React from "react";
import { Locale } from "@/config/locales";
import TechnicalLabel from "@/components/ui/TechnicalLabel";
import NumberBadge from "@/components/ui/NumberBadge";
import { DisplayM, BodyText } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string | number;
  label: string;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  locale: Locale;
  world?: "carbon" | "bone";
  className?: string;
}

export default function SectionHeader({
  index,
  label,
  title,
  description,
  actionText,
  actionHref,
  locale,
  world = "carbon",
  className = "",
}: SectionHeaderProps) {
  const isBone = world === "bone";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b pb-6 sm:pb-8 mb-8 sm:mb-12 w-full max-w-full box-border",
        isBone ? "border-bone-border text-carbon" : "border-carbon-border text-bone",
        className
      )}
    >
      <div className="space-y-3 sm:space-y-4 max-w-3xl min-w-0 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 max-w-full">
          {index && <NumberBadge number={index} world={world} />}
          <TechnicalLabel variant={isBone ? "copper" : "metal"}>{label}</TechnicalLabel>
        </div>
        <DisplayM>{title}</DisplayM>
        {description && (
          <BodyText className={isBone ? "text-carbon/75" : "text-accent-metal"}>
            {description}
          </BodyText>
        )}
      </div>

      {actionText && actionHref && (
        <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
          <Button href={actionHref} locale={locale} variant="outline" world={world} className="w-full sm:w-auto">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
