import type { Metadata } from "next";
import "@/styles/globals.css";
import {
  fontBebas,
  fontIbmPlex,
  fontSpaceMono,
  fontIbmPlexArabic,
} from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Industrial Steel Products | B2B Catalogue",
  description: "Precision engineered steel products, infrastructure components, and material systems.",
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontBebas.variable} ${fontIbmPlex.variable} ${fontSpaceMono.variable} ${fontIbmPlexArabic.variable}`}
    >
      <body suppressHydrationWarning className="bg-carbon text-bone min-h-screen antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
