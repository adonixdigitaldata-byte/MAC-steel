import { notFound } from "next/navigation";
import { isValidLocale, Locale, SUPPORTED_LOCALES } from "@/config/locales";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
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

  return (
    <div dir={dir} lang={locale} className="min-h-screen flex flex-col bg-carbon text-bone">
      <Header locale={locale as Locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale as Locale} />
    </div>
  );
}
