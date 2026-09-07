import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide" | "full";
}

export function Container({ children, className = "", size = "default" }: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[90rem]",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full box-border", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  world?: "carbon" | "bone";
  className?: string;
  id?: string;
}

export function Section({ children, world = "carbon", className = "", id }: SectionProps) {
  const worldClasses =
    world === "carbon" ? "bg-carbon text-bone" : "bg-world-bone text-carbon";

  return (
    <section id={id} className={cn("py-12 sm:py-24 lg:py-32 w-full max-w-full box-border overflow-hidden", worldClasses, className)}>
      {children}
    </section>
  );
}
