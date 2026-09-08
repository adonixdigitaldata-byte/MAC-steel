const fs = require('fs');
const path = require('path');

const updates = [
  {
    slug: 'cable-pulling-eyelet-ss316-304',
    image: '/CABLE%20PULLING%20EYELET%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_6upcis6upcis6upc.png',
    gallery: ['/CABLE%20PULLING%20EYELET%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_6upcis6upcis6upc.png']
  },
  {
    slug: 'ss-pipe-spacers-with-wheel',
    image: '/SS%20PIPE%20SPACER%20WITH%20WHEEL/SS%20PIPE%20SPACER%20WITH%20WHEEL.jfif',
    gallery: ['/SS%20PIPE%20SPACER%20WITH%20WHEEL/SS%20PIPE%20SPACER%20WITH%20WHEEL.jfif']
  },
  {
    slug: 'u-clamp-anchor-bolts-gate-valve',
    image: '/U-CLAMP%20AND%20ANCHOR%20BOLTS%20FOR%20GATE%20VALVE/Gemini_Generated_Image_kzvd3tkzvd3tkzvd.png',
    gallery: ['/U-CLAMP%20AND%20ANCHOR%20BOLTS%20FOR%20GATE%20VALVE/Gemini_Generated_Image_kzvd3tkzvd3tkzvd.png']
  },
  {
    slug: 'sump-pit-frame-12mm-anchor',
    image: '/SUMP%20PIT%20FRAME%20with%20%C3%9812mm%20Anchor/001.png',
    gallery: [
      '/SUMP%20PIT%20FRAME%20with%20%C3%9812mm%20Anchor/001.png',
      '/SUMP%20PIT%20FRAME%20with%20%C3%9812mm%20Anchor/002.png',
      '/SUMP%20PIT%20FRAME%20with%20%C3%9812mm%20Anchor/003.png'
    ]
  },
  {
    slug: 'sump-pit-frame-standard',
    image: '/SUMP%20PIT%20FRAME/001.png',
    gallery: [
      '/SUMP%20PIT%20FRAME/001.png',
      '/SUMP%20PIT%20FRAME/002.png',
      '/SUMP%20PIT%20FRAME/003.png'
    ]
  },
  {
    slug: 'sump-pit-gratings',
    image: '/SUMP%20PIT%20GRATINGS/Gemini_Generated_Image_46jpjw46jpjw46jp.png',
    gallery: ['/SUMP%20PIT%20GRATINGS/Gemini_Generated_Image_46jpjw46jpjw46jp.png']
  },
  {
    slug: 'galvanized-angle-frame-78x53x3mm-co-500',
    image: '/ANGLE%20FRAME%2078X53X3MM%20CO-500X500%20OB%20595X595/Gemini_Generated_Image_u4aao4u4aao4u4aa.png',
    gallery: ['/ANGLE%20FRAME%2078X53X3MM%20CO-500X500%20OB%20595X595/Gemini_Generated_Image_u4aao4u4aao4u4aa.png']
  },
  {
    slug: 'cable-hanger-arm-ss316-304',
    image: '/CABLE%20HANGER%20ARM%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_qe28glqe28glqe28.png',
    gallery: ['/CABLE%20HANGER%20ARM%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_qe28glqe28glqe28.png']
  },
  {
    slug: 'cable-hanger-rails-ss316-304',
    image: '/CABLE%20HANGER%20RAILS%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_gpumfmgpumfmgpum.png',
    gallery: ['/CABLE%20HANGER%20RAILS%20SS%20316%20%5E&%20304%20GRADE/Gemini_Generated_Image_gpumfmgpumfmgpum.png']
  }
];

const targetFile = path.resolve('src/data/products.ts');
let content = fs.readFileSync(targetFile, 'utf8');

for (const u of updates) {
  const targetPattern = new RegExp(`("slug":\\s*"${u.slug}",[\\s\\S]*?"shortDescriptionAr":\\s*"[^"]*",\\r?\\n\\s*)("gallery":\\s*\\[\\],)`);
  if (!targetPattern.test(content)) {
    console.error(`Pattern not found for slug: ${u.slug}`);
    process.exit(1);
  }
  
  const galleryJson = JSON.stringify(u.gallery, null, 6).split('\n').join('\n    ');
  const replacement = `$1"image": "${u.image}",\n    "gallery": ${galleryJson},`;
  
  content = content.replace(targetPattern, replacement);
  console.log(`Updated product: ${u.slug}`);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('src/data/products.ts updated successfully with all 9 product images!');
