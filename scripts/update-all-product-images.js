const fs = require('fs');
const path = require('path');

// 1. Read all folders in public
const publicDir = path.resolve('public');
const folders = fs.readdirSync(publicDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('Total folders in public:', folders.length);

// 2. Read products from src/data/products.ts
const productsFile = path.resolve('src/data/products.ts');
let productsContent = fs.readFileSync(productsFile, 'utf8');

// List of all 31 folders and their matching product slugs / details
const folderToSlugMapping = {
  "ANGLE FRAME 78X53X3MM CO-500X500 OB 595X595": "galvanized-angle-frame-78x53x3mm-co-500",
  "CABLE HANGER ARM SS 316 ^& 304 GRADE": "cable-hanger-arm-ss316-304",
  "CABLE HANGER RAILS SS 316 ^& 304 GRADE": "cable-hanger-rails-ss316-304",
  "CABLE PULLING EYELET SS 316 ^& 304 GRADE": "cable-pulling-eyelet-ss316-304",
  "CELL TOP ^& BOTTOM PLATES - Ø1300MM X 50MM THK": "cell-top-bottom-plates-1300mm-50mm",
  "EPDM SHEET": "epdm-rubber-sheet-gs5500",
  "EPOXY COATED MUD BUCKET": "epoxy-coated-mud-bucket",
  "GALVANIZED ANGLE FRAME": "galvanized-angle-frame-standard",
  "GRAB BARS SS": "stainless-steel-grab-bars",
  "HDG LADDER": "hdg-manhole-ladder",
  "HDG LADDER SUPPORT": "hdg-ladder-support",
  "HOSE CLAMPS": "stainless-steel-hose-clamps",
  "Lifting Key ^& Key Frame Galvanized": "lifting-key-key-hole-frame",
  "Marker post ^& warning tape": "marker-post-warning-tape",
  "NAME PLATES, DIRECTIONAL PLATES AND 3M STICKERS": "directional-name-plates-3m-reflective",
  "NON SLIP LADDER RUNG Ø20MM SS": "anti-slip-ladder-rungs-20mm-ss",
  "PE PIPE CASING SPACERS": "pe-pipe-casing-spacers",
  "PIPE SLEEVES": "pvc-hdg-pipe-sleeves",
  "PORCELAIN SADDLE": "porcelain-ceramic-saddle",
  "SAFETY BOLLARD OR GUARD POST": "safety-bollard-guard-post",
  "SS 316 ANCHOR BOLT 800MM X 120MM X Ø25MM": "l-type-anchor-bolt-ss316l-800x120",
  "SS 316 ANCHOR BOLT 850MM X 120MM X Ø25MM": "l-type-anchor-bolt-ss316l-850x120",
  "SS 316 THREADED RODS, NUTS ^& WASHERS": "ss316-threaded-rods-nuts-washers",
  "SS 316L THREADED RODS, NUTS ^& WASHERS": "ss316l-threaded-rods-nuts-washers",
  "SS L-ANGLE 18MM": "ss-l-angle-18mm",
  "SS LADDER RUNGS Ø20": "ss-ladder-rungs-20mm",
  "SS PIPE SPACER WITH WHEEL": "ss-pipe-spacers-with-wheel",
  "SUMP PIT FRAME": "sump-pit-frame-standard",
  "SUMP PIT FRAME with Ø12mm Anchor": "sump-pit-frame-12mm-anchor",
  "SUMP PIT GRATINGS": "sump-pit-gratings",
  "U-CLAMP AND ANCHOR BOLTS FOR GATE VALVE": "u-clamp-anchor-bolts-gate-valve"
};

for (const [folderName, slug] of Object.entries(folderToSlugMapping)) {
  const folderPath = path.join(publicDir, folderName);
  if (!fs.existsSync(folderPath)) {
    console.error('Folder does not exist:', folderName);
    continue;
  }
  const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
  if (files.length === 0) {
    console.warn('No files in folder:', folderName);
    continue;
  }

  const mainFile = files[0];
  const mainImageUrl = '/' + encodeURI(folderName).replace(/#/g, '%23') + '/' + encodeURI(mainFile).replace(/#/g, '%23');
  const galleryUrls = files.map(file => '/' + encodeURI(folderName).replace(/#/g, '%23') + '/' + encodeURI(file).replace(/#/g, '%23'));

  // Replace in productsContent
  // Pattern: "slug": "slug", ... "shortDescriptionAr": "...", (\n    "image": "...",)? \n    "gallery": [...],
  const slugRegex = new RegExp(`("slug":\\s*"${slug}",[\\s\\S]*?"shortDescriptionAr":\\s*"[^"]*",\\r?\\n)(?:\\s*"image":\\s*"[^"]*",\\r?\\n)?(?:\\s*"gallery":\\s*\\[[^\\]]*\\],\\r?\\n)?`);
  
  if (!slugRegex.test(productsContent)) {
    console.error('Regex pattern not matched for slug:', slug);
    continue;
  }

  const galleryJson = JSON.stringify(galleryUrls, null, 6).split('\n').join('\n    ');
  const replacement = `$1    "image": "${mainImageUrl}",\n    "gallery": ${galleryJson},\n`;

  productsContent = productsContent.replace(slugRegex, replacement);
  console.log(`Updated product [${slug}] from folder [${folderName}] with ${files.length} image(s)`);
}

// Also map second variant of angle frame if needed: galvanized-angle-frame-78x53x3mm-co-500-std
const angleFrameFolder = "ANGLE FRAME 78X53X3MM CO-500X500 OB 595X595";
const stdSlug = "galvanized-angle-frame-78x53x3mm-co-500-std";
const angleFiles = fs.readdirSync(path.join(publicDir, angleFrameFolder)).filter(f => !f.startsWith('.'));
const mainImageUrl = '/' + encodeURI(angleFrameFolder).replace(/#/g, '%23') + '/' + encodeURI(angleFiles[0]).replace(/#/g, '%23');
const galleryUrls = angleFiles.map(file => '/' + encodeURI(angleFrameFolder).replace(/#/g, '%23') + '/' + encodeURI(file).replace(/#/g, '%23'));
const stdRegex = new RegExp(`("slug":\\s*"${stdSlug}",[\\s\\S]*?"shortDescriptionAr":\\s*"[^"]*",\\r?\\n)(?:\\s*"image":\\s*"[^"]*",\\r?\\n)?(?:\\s*"gallery":\\s*\\[[^\\]]*\\],\\r?\\n)?`);
if (stdRegex.test(productsContent)) {
  const galleryJson = JSON.stringify(galleryUrls, null, 6).split('\n').join('\n    ');
  productsContent = productsContent.replace(stdRegex, `$1    "image": "${mainImageUrl}",\n    "gallery": ${galleryJson},\n`);
  console.log(`Updated product [${stdSlug}]`);
}

fs.writeFileSync(productsFile, productsContent, 'utf8');
console.log('All product images successfully updated in src/data/products.ts!');
