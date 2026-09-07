export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-structural",
    name: "Structural Components & Frames",
    nameAr: "مكونات وأطر هيكلية",
    slug: "structural-components-frames",
  },
  {
    id: "cat-manhole",
    name: "Manhole & Utility Hardware",
    nameAr: "معدات المناهل والمرافق",
    slug: "manhole-utility-hardware",
  },
  {
    id: "cat-piping",
    name: "Piping, Sleeves & Clamps",
    nameAr: "الأنابيب والأكمام والمشابك",
    slug: "piping-sleeves-clamps",
  },
  {
    id: "cat-fasteners",
    name: "Fasteners & Anchor Rods",
    nameAr: "أدوات التثبيت وأسياخ الرسو",
    slug: "fasteners-anchor-rods",
  },
  {
    id: "cat-safety",
    name: "Safety, Bollards & Signage",
    nameAr: "السلامة والمصدات واللوحات",
    slug: "safety-bollards-signage",
  },
  {
    id: "cat-rubber",
    name: "Rubber, Gaskets & Seals",
    nameAr: "مطاط مانع التسرب والحشوات",
    slug: "rubber-gaskets-seals",
  },
];
