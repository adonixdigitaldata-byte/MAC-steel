import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  world?: "carbon" | "bone";
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export default function Divider({
  world = "carbon",
  className = "",
  orientation = "horizontal",
}: DividerProps) {
  const lineStyle =
    world === "carbon" ? "border-carbon-border" : "border-bone-border";

  if (orientation === "vertical") {
    return <div className={cn("border-r h-full", lineStyle, className)} />;
  }

  return <div className={cn("border-b w-full", lineStyle, className)} />;
}
