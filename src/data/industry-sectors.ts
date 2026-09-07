export interface IndustrySector {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  specs: {
    standard: string;
    corrosionRating: string;
    testingProtocol: string;
  };
  productSlugs: string[];
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    id: "SEC-01",
    slug: "electrical-telecom",
    name: "Electrical & Telecom",
    nameAr: "شبكات الكهرباء والاتصالات",
    tagline: "High-dielectric cable supports and underground vault management systems.",
    taglineAr: "حوامل كابلات عازلة كهربائياً وأنظمة غرف التفتيش والتوصيلات الأرضية.",
    challenge: "Subterranean utility vaults face high groundwater moisture, galvanic corrosion, and intense heat dissipation demands from high-voltage cables.",
    challengeAr: "تواجه غرف التفتيش الأرضية رطوبة جوفية عالية وتآكلاً جلفانياً ودرجات حرارة مرتفعة ناجمة عن كابلات الجهد العالي.",
    solution: "We engineer SS316 cable stanchions, unistrut arms, phenolic warning route plates, and high-dielectric porcelain saddles certified for utility networks.",
    solutionAr: "نوفر ركائز كابلات وأذرع تعليق من الفولاذ SS316 وسروج بورسيلين عالية العزل ولوحات تعريف فينولية معتمدة لشبكات الاتصالات والكهرباء.",
    specs: {
      standard: "SEC / SASO / ASTM A276",
      corrosionRating: "SS 316 / SS 304 High Chemical Resistance",
      testingProtocol: "Dielectric Breakdown & Salt Spray 1000h",
    },
    productSlugs: [
      "cable-hanger-arm-ss316-304",
      "cable-hanger-rails-ss316-304",
      "porcelain-ceramic-saddle",
      "cable-pulling-eyelet-ss316-304",
    ],
  },
  {
    id: "SEC-02",
    slug: "civil-construction",
    name: "Civil Construction",
    nameAr: "الإنشاءات والهندسة المدنية",
    tagline: "Structural cast-in-place anchorages and load-bearing framing assemblies.",
    taglineAr: "مرابط رسو مسبقة الصب وهياكل تثبيت إنشائية لتحمل الأحمال العالية.",
    challenge: "Heavy equipment foundations and concrete interfaces require exact millimeter tolerances to prevent shear failure under dynamic cyclic vibration.",
    challengeAr: "تتطلب قواعد المعدات الثقيلة والواجهات الخرسانية تفاوتات مليمترية دقيقة لمنع انهيار القص تحت الاهتزازات الديناميكية المتكررة.",
    solution: "Heavy L-anchor bolts (SS316L/A36), prefabricated structural L-angles, and custom cell foundation plates machined to tight tolerances.",
    solutionAr: "مرابط رسو L-Type من سبيكة 316L وألواح تثبيت سمك 50 مم وزوايا فولاذية مصنعة مسبقاً بدقة متناهية لتثبيت المنشآت الضخمة.",
    specs: {
      standard: "ASTM A36 / ASTM A193 / AWS D1.1",
      corrosionRating: "Passivated SS316L / Hot-Dip Galvanized",
      testingProtocol: "Proof Load Tensile Testing & Ultrasonic Weld NDT",
    },
    productSlugs: [
      "l-type-anchor-bolt-ss316l-800x120",
      "cell-top-bottom-plates-1300mm-50mm",
      "ss-l-angle-18mm",
      "ss316-threaded-rods-nuts-washers",
    ],
  },
  {
    id: "SEC-03",
    slug: "infrastructure",
    name: "Infrastructure & Corridors",
    nameAr: "البنية التحتية والممرات اللوجستية",
    tagline: "Heavy-traffic manhole covers, mud containment, and utility casings.",
    taglineAr: "أغطية مناهل للحمولات الثقيلة وحاويات الطين وفواصل أكمام الخطوط الرئيسية.",
    challenge: "Highway crossings and rail corridors subject subterranean pipelines and drainage vaults to continuous cyclic impact loads and soil settlement.",
    challengeAr: "تتعرض خطوط الأنابيب وغرف التصريف تحت الطرق السريعة ومسارات القطارات لأحمال تصادمية متكررة وهبوط التربة.",
    solution: "Heavy 8mm sump pit angle frames, anti-slip manhole ladders, epoxy-coated mud buckets, and wheeled stainless casing spacers.",
    solutionAr: "إطارات غرف تجميع 8 مم وشبكات تصريف شاقة وسلالم وصول مجلفنة وفواصل أكمام أنابيب مزودة بعجلات مطاطية.",
    specs: {
      standard: "AASHTO / ASTM A123 / ISO 1461",
      corrosionRating: "HDG Zinc Coating > 85 microns",
      testingProtocol: "Load Capacity BS EN 124 D400 Class",
    },
    productSlugs: [
      "sump-pit-frame-12mm-anchor",
      "hdg-manhole-ladder",
      "epoxy-coated-mud-bucket",
      "ss-pipe-spacers-with-wheel",
    ],
  },
  {
    id: "SEC-04",
    slug: "industrial-plants",
    name: "Industrial Plants & Refineries",
    nameAr: "المنشآت الصناعية والمصافي",
    tagline: "Corrosion-proof fiberglass access, chemical gaskets, and piping retention.",
    taglineAr: "سلالم وصول FRP غير موصلة وحشوات مطاطية ومرابط أنابيب مقاومة للأحماض.",
    challenge: "Chemical refineries and petrochemical facilities operate with aggressive airborne acid vapors, hydrocarbon exposure, and fire risks.",
    challengeAr: "تعمل مصافي البتروكيماويات والمنشآت الصناعية في بيئات تحتوي على أبخرة أحماض وهيدروكربونات ومخاطر حريق محتملة.",
    solution: "OSHA-compliant FRP ladders with safety cages, ASTM Type 316L heavy band hose clamps, and GS5500 high-density EPDM thermal rubber sheets.",
    solutionAr: "سلالم وأقفاص سلامة FRP غير موصلة ومرابط أنابيب SS316L بعرض 20 مم وشرائح مطاط EPDM سلسلة GS5500 المقاومة للأوزون والحرارة.",
    specs: {
      standard: "OSHA 1910.27 / ASTM E-84 Class 1 / ASTM D2000",
      corrosionRating: "VEFR Resin / SS 316L / EPDM Synthetic",
      testingProtocol: "Flame Retardant & Acid Immersion Testing",
    },
    productSlugs: [
      "frp-ladders-safety-cages",
      "stainless-steel-hose-clamps",
      "epdm-rubber-sheet-gs5500",
      "ss316l-threaded-rods-nuts-washers",
    ],
  },
  {
    id: "SEC-05",
    slug: "utilities",
    name: "Water & Municipal Utilities",
    nameAr: "أنظمة المياه والمرافق البلدية",
    tagline: "Watertight penetration sleeves, gate valve anchorage, and pipeline alignment.",
    taglineAr: "أكمام اختراق مانعة للتسرب وتثبيت محابس البوابة وفواصل أنابيب المياه.",
    challenge: "High hydraulic pressures and subterranean soil moisture necessitate zero-leakage wall penetrations and secure valve anchorage.",
    challengeAr: "تتطلب الضغوط الهيدروليكية العالية والرطوبة الجوفية عزل اختراقات الجدران تماماً وتثبيت محابس الضغط العالي.",
    solution: "PVC & HDG pipe sleeves with welded water-stops, SS316L gate valve U-clamps, and segmented HDPE casing spacers.",
    solutionAr: "أكمام أنابيب مجلفنة بشفة منع تسرب مياه ملحومة ومرابط U-Clamp لمحابس البوابة وفواصل أكمام البولي إيثيلين HDPE.",
    specs: {
      standard: "DIN 934 / ASTM A123 / SASO ISO 1461",
      corrosionRating: "Water-Stop Flanged SS 316L / HDG",
      testingProtocol: "Hydrostatic Pressure Test 16 Bar",
    },
    productSlugs: [
      "pvc-hdg-pipe-sleeves",
      "u-clamp-anchor-bolts-gate-valve",
      "pe-pipe-casing-spacers",
      "anti-slip-ladder-rungs-20mm-ss",
    ],
  },
  {
    id: "SEC-06",
    slug: "commercial-buildings",
    name: "Commercial & Mega Projects",
    nameAr: "المشاريع الكبرى والمباني التجارية",
    tagline: "Perimeter bollards, architectural frames, and reflective safety identifiers.",
    taglineAr: "مصدات حماية الموقع وإطارات معمارية ولوحات إرشادية عاكسة 3M.",
    challenge: "Modern high-value developments demand robust physical perimeter security and standardized bilingual MEP room identification.",
    challengeAr: "تتطلب المشاريع العقارية الكبرى حماية محيطية صلبة للمنشآت وتعريفاً معمارياً موحداً لغرف ومناهل الخدمات الكهروميكانيكية.",
    solution: "Schedule 40 concrete-filled HDG safety bollards, 3M microprismatic directional name plates, and standard galvanized angle frames.",
    solutionAr: "مصدات سلامة من أنابيب Sch 40 مجلفنة ومطلية باللونين الأبيض والأحمر ولوحات تعريف عاكسة 3M وإطارات زوايا قياسية.",
    specs: {
      standard: "ASTM A53 Sch 40 / 3M Diamond Grade / ASTM A123",
      corrosionRating: "Industrial Protective Coating + HDG",
      testingProtocol: "Impact Defense & 3M Retroreflective Luminescence",
    },
    productSlugs: [
      "safety-bollard-guard-post",
      "directional-name-plates-3m-reflective",
      "galvanized-angle-frame-standard",
      "marker-post-warning-tape",
    ],
  },
];
