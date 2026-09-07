const fs = require('fs');
const ts = require('typescript');

const rawTs = fs.readFileSync('src/data/products.ts', 'utf8');
const js = ts.transpileModule(rawTs, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

const mod = { exports: {} };
const fn = new Function('module', 'exports', js);
fn(mod, mod.exports);

const products = mod.exports.PRODUCTS;
console.log('Successfully loaded products count:', products.length);

const enriched = products.map((p, i) => {
  const catPrefix = p.category.includes('Structural') ? 'ST' :
                    p.category.includes('Manhole') ? 'MH' :
                    p.category.includes('Piping') ? 'PP' :
                    p.category.includes('Fastener') ? 'FS' :
                    p.category.includes('Safety') ? 'SF' : 'RB';
  const partNumber = p.partNumber || ('CTK-' + catPrefix + '-' + (78500 + i + 1));
  const finish = p.finish || (p.material && p.material.includes('Hot-Dip') ? 'Hot-Dip Galvanized (ASTM A123)' :
                  p.material && p.material.includes('Epoxy') ? 'Industrial Epoxy Finish' :
                  p.material && (p.material.includes('Stainless') || p.material.includes('SS')) ? 'Brushed / Pickled Passivated' :
                  p.material && p.material.includes('Poly') ? 'UV Stabilized Polymer' : 'Mill Standard / Galvanized');
  const thickness = p.thickness || (p.size && p.size.match(/(\d+\.?\d*)\s*mm\s*(?:THK|Thick|thk)/i) ? p.size.match(/(\d+\.?\d*)\s*mm\s*(?:THK|Thick|thk)/i)[0] : 'Engineering Standard');
  const availableSizes = p.availableSizes || (p.size ? [p.size] : ['Custom Project Specification']);
  const applications = p.applications || (p.application ? [p.application, 'Subterranean Infrastructure', 'Industrial Utility'] : ['Heavy Infrastructure', 'Industrial Plants']);
  const shortDescription = p.shortDescription || (p.description ? p.description.split('.')[0] + '.' : '');
  const shortDescriptionAr = p.shortDescriptionAr || (p.descriptionAr ? p.descriptionAr.split('.')[0] + '.' : '');
  const gallery = p.gallery || (p.image ? [p.image] : []);
  const related = p.related || products.filter((other, idx) => idx !== i && other.category === p.category).slice(0, 3).map(o => o.slug);

  return {
    ...p,
    partNumber,
    finish,
    thickness,
    availableSizes,
    applications,
    shortDescription,
    shortDescriptionAr,
    gallery,
    related
  };
});

const outputCode = `import { Product } from "@/types";

/**
 * METALLO ARABIA COMPANY (MAC) MASTER TECHNICAL CATALOGUE DATA
 * Master Single Source of Truth for Structural and Utility Steel Components
 */

export const PRODUCTS: Product[] = ${JSON.stringify(enriched, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
`;

fs.writeFileSync('src/data/products.ts', outputCode, 'utf8');
console.log('Successfully updated src/data/products.ts with all HTC-4.5 fields!');
