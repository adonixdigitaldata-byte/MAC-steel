import { Bebas_Neue, IBM_Plex_Sans, Space_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

/**
 * DISPLAY TYPOGRAPHY ARCHITECTURE
 * 
 * Currently using Google Font `Bebas_Neue` assigned to `--font-bebas-pro` and `--font-bebas`.
 * 
 * When licensed `Bebas Neue Pro` font files are provided in the future:
 * 1. Place .woff2 files in `public/fonts/`
 * 2. Import `localFont` from `next/font/local`
 * 3. Uncomment the `fontBebasPro` localFont definition below and replace `fontBebasProFallback`.
 * 
 * No component or CSS adjustments will be needed.
 */

/*
import localFont from "next/font/local";

export const fontBebasPro = localFont({
  src: [
    {
      path: "../../public/fonts/BebasNeuePro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/BebasNeuePro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bebas-pro",
  display: "swap",
});
*/

// Active Google Font mapping for Display Typography until licensed files are supplied
export const fontBebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-pro",
  display: "swap",
});

export const fontIbmPlex = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const fontSpaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const fontIbmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});
