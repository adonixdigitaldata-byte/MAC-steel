import Link from "next/link";
import { DEFAULT_LOCALE } from "@/config/locales";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-carbon text-bone flex flex-col items-center justify-center p-6 text-center">
      <span className="font-tech text-xs tracking-widest text-accent-metal uppercase mb-4">
        Error 404 / System Status
      </span>
      <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4 text-bone">
        PAGE NOT FOUND
      </h1>
      <p className="max-w-md text-accent-metal mb-8 text-sm">
        The requested resource or location could not be resolved within the product system.
      </p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="px-6 py-3 border border-bone/30 text-bone hover:bg-bone hover:text-carbon transition-colors duration-200 font-tech text-xs tracking-wider uppercase"
      >
        Return to Homepage →
      </Link>
    </main>
  );
}
