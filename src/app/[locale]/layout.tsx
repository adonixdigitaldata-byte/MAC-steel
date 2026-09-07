import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, Locale, SUPPORTED_LOCALES } from "@/config/locales";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion";
import { CartProvider } from "@/components/cart";
import MiniCartDrawer from "@/components/cart/MiniCartDrawer";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === "ar";

  const title = isRtl
    ? "كونتراتك للصلب والمكونات الهندسية | Contratek Industrial"
    : "Contratek | Precision Structural Steel & Industrial Systems";
  const description = isRtl
    ? "المورد والمصنع الرائد لمكونات الفولاذ الإنشائي، غرف التفتيش، مرابط الرسو، وأنظمة شبكات البنية التحتية المعتمدة في المملكة العربية السعودية."
    : "Precision engineered structural steel systems, heavy manhole access hardware, anchor rods, and utility solutions certified for critical infrastructure.";

  return {
    title: {
      default: title,
      template: isRtl ? "%s | كونتراتك للصلب" : "%s | Contratek",
    },
    description,
    keywords: [
      "Structural Steel",
      "Manhole Hardware",
      "SS 316L Fasteners",
      "Hot-Dip Galvanized ASTM A123",
      "Saudi Arabia Steel Manufacturing",
      "Jeddah Steel Works",
      "RFQ Steel Catalog",
      "كونتراتك للصلب",
      "مكونات الفولاذ المقاوم للصدأ",
      "جلفنة بالحرارة",
    ],
    authors: [{ name: "Contratek Engineering" }],
    creator: "Contratek",
    openGraph: {
      type: "website",
      locale: isRtl ? "ar_SA" : "en_US",
      url: `https://contratek.sa/${locale}`,
      siteName: "Contratek Industrial",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  // Global Organization Schema (JSON-LD)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Contratek Industrial Steel",
    alternateName: "شركة كونتراتك للمكونات الفولاذية",
    url: "https://contratek.sa",
    logo: "https://contratek.sa/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-00-000-0000",
      contactType: "technical specifier desk",
      areaServed: "SA",
      availableLanguage: ["English", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jeddah",
      addressRegion: "Makkah",
      addressCountry: "SA",
    },
  };

  return (
    <div dir={dir} lang={locale} className="min-h-screen flex flex-col bg-carbon text-bone">
      {/* Global Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <MotionProvider>
        <CartProvider>
          <Header locale={locale as Locale} />
          <div className="flex-1">{children}</div>
          <Footer locale={locale as Locale} />
          <MiniCartDrawer locale={locale as Locale} />
        </CartProvider>
      </MotionProvider>
    </div>
  );
}
