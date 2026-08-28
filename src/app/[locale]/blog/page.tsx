import { Locale } from "@/config/locales";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  return (
    <main className="bg-world-bone min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <span className="font-tech text-xs tracking-widest text-accent-mineral uppercase block mb-2">
          {isRtl ? "المجلة الفنية / المقالات" : "JOURNAL / TECHNICAL ARTICLES"}
        </span>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight uppercase text-carbon mb-8">
          {isRtl ? "المجلة والبحوث الصناعية" : "INDUSTRIAL JOURNAL"}
        </h1>
        <div className="border-t border-bone-border pt-8 text-sm font-tech text-accent-mineral">
          {isRtl
            ? "السياسة التحريرية: المقالات الفنية والأوراق البحثية للمواد الصلبة."
            : "Phase 01 Editorial baseline ready for journal and technical content publication."}
        </div>
      </div>
    </main>
  );
}
