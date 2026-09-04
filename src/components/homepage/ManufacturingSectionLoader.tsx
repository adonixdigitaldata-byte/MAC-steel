"use client";

/**
 * Thin client boundary that lazy-loads ManufacturingSection with ssr:false.
 * Must live in a Client Component — next/dynamic ssr:false is forbidden in
 * Server Components (Next.js 15 App Router constraint).
 */
import dynamic from "next/dynamic";
import type { Locale } from "@/config/locales";

const ManufacturingSection = dynamic(
  () => import("@/components/homepage/ManufacturingSection"),
  { ssr: false }
);

export default function ManufacturingSectionLoader({ locale }: { locale: Locale }) {
  return <ManufacturingSection locale={locale} />;
}
