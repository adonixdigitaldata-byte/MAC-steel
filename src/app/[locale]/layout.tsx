import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, Locale, SUPPORTED_LOCALES } from "@/config/locales";
import { SITE_CONFIG } from "@/data/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion";
import { CartProvider } from "@/components/cart";
import MiniCartDrawer from "@/components/cart/MiniCartDrawer";
import FloatingMobileActions from "@/components/layout/FloatingMobileActions";

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
    ? `${SITE_CONFIG.companyName.ar} | ${SITE_CONFIG.shortBrand}`
    : `${SITE_CONFIG.companyName.en} (${SITE_CONFIG.shortBrand}) | Precision Structural Steel`;
  const description = isRtl
    ? "المورد والمصنع الرائد لمكونات الفولاذ الإنشائي، غرف التفتيش، مرابط الرسو، وأنظمة شبكات البنية التحتية المعتمدة في المملكة العربية السعودية."
    : "Precision engineered structural steel systems, heavy manhole access hardware, anchor rods, and utility solutions certified for critical infrastructure.";

  return {
    title: {
      default: title,
      template: isRtl ? `%s | ${SITE_CONFIG.companyName.ar}` : `%s | ${SITE_CONFIG.companyName.en}`,
    },
    description,
    keywords: [
      "Metallo Arabia Company",
      "MAC Steel",
      "Structural Steel Saudi Arabia",
      "Manhole Hardware Jeddah",
      "SS 316L Fasteners",
      "Hot-Dip Galvanized ASTM A123",
      "Saudi Arabia Steel Manufacturing",
      "شركة ميتالو أرابيا",
      "مكونات الفولاذ المقاوم للصدأ",
      "جلفنة بالحرارة",
    ],
    authors: [{ name: SITE_CONFIG.companyName.en }],
    creator: SITE_CONFIG.shortBrand,
    openGraph: {
      type: "website",
      locale: isRtl ? "ar_SA" : "en_US",
      url: `https://metalloarabia.com/${locale}`,
      siteName: isRtl ? SITE_CONFIG.companyName.ar : SITE_CONFIG.companyName.en,
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
    name: SITE_CONFIG.companyName.en,
    alternateName: SITE_CONFIG.companyName.ar,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.shortBrand,
    },
    url: "https://metalloarabia.com",
    logo: "https://metalloarabia.com/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.contactPhone,
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
          <FloatingMobileActions locale={locale as Locale} />
        </CartProvider>
      </MotionProvider>
    </div>
  );
}
