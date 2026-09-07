export interface Application {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export const APPLICATIONS: Application[] = [
  {
    id: "app-electrical-telecom",
    name: "Electrical & Telecom",
    nameAr: "الكهرباء والاتصالات",
    slug: "electrical-telecom",
  },
  {
    id: "app-civil",
    name: "Civil",
    nameAr: "الهندسة المدنية",
    slug: "civil",
  },
  {
    id: "app-building",
    name: "Building",
    nameAr: "البناء والتشييد",
    slug: "building",
  },
  {
    id: "app-infrastructure",
    name: "Infrastructure",
    nameAr: "البنية التحتية",
    slug: "infrastructure",
  },
  {
    id: "app-utility",
    name: "Utility Systems",
    nameAr: "أنظمة المرافق",
    slug: "utility-systems",
  },
  {
    id: "app-industrial",
    name: "Industrial",
    nameAr: "الصناعة",
    slug: "industrial",
  },
];
