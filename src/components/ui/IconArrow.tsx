import { ArrowRight, ArrowLeft } from "lucide-react";
import { Locale } from "@/config/locales";

interface IconArrowProps {
  locale: Locale;
  className?: string;
  size?: number;
  direction?: "forward" | "backward";
}

/**
 * Direction-aware arrow icon that points correctly in LTR (en) and RTL (ar).
 * - "forward" in LTR -> points Right (→)
 * - "forward" in RTL -> points Left (←)
 */
export default function IconArrow({
  locale,
  className = "",
  size = 16,
  direction = "forward",
}: IconArrowProps) {
  const isRtl = locale === "ar";

  const showLeft = (direction === "forward" && isRtl) || (direction === "backward" && !isRtl);

  return showLeft ? (
    <ArrowLeft size={size} className={className} />
  ) : (
    <ArrowRight size={size} className={className} />
  );
}
