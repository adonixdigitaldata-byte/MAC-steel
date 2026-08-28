import { Locale } from "@/config/locales";

export default async function CartPage({
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
          {isRtl ? "قائمة المنتجات المختارة" : "SELECTION LIST / NO ONLINE PAYMENT"}
        </span>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight uppercase text-carbon mb-8">
          {isRtl ? "طلبك الخاص" : "YOUR REQUEST"}
        </h1>

        <div className="border-t border-b border-bone-border py-12 text-center my-8 bg-bone-surface">
          <p className="font-tech text-xs text-accent-mineral uppercase mb-4">
            {isRtl ? "سلة الطلبات فارغة حالياً" : "NO PRODUCTS CURRENTLY SELECTED IN REQUEST LIST"}
          </p>
          <p className="font-body text-xs text-carbon/70 max-w-md mx-auto">
            {isRtl
              ? "سيتم تنفيذ آلية إضافة المنتجات وحفظها محلياً وإنشاء رسالة الواتساب في المرحلة ٠٦."
              : "Client-side localStorage state, quantity management, and WhatsApp message dispatch will be connected in Phase 06."}
          </p>
        </div>
      </div>
    </main>
  );
}
