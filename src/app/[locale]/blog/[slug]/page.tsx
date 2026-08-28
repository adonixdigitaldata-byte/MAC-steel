import { Locale } from "@/config/locales";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isRtl = locale === "ar";

  return (
    <main className="bg-world-bone min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <span className="font-tech text-xs tracking-widest text-accent-mineral uppercase block mb-2">
          JOURNAL ARTICLE / {slug}
        </span>
        <h1 className="font-display text-4xl uppercase text-carbon mb-6">
          {isRtl ? "مقال فني تجريبي" : "TECHNICAL JOURNAL ARTICLE PLACEHOLDER"}
        </h1>
        <p className="font-body text-sm text-carbon/80 leading-relaxed">
          {isRtl
            ? "المحتوى التحريري سيتوفر لاحقاً."
            : "Journal article post content baseline for Phase 07."}
        </p>
      </div>
    </main>
  );
}
