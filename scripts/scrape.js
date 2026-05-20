const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// ────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────
const BASE_URL = 'https://www.ortobom.com.br';
const OUTPUT_FILE = path.join(__dirname, 'seed-products.json');

// All 6 real categories from the website
const TARGET_CATEGORIES = [
  { slug: 'colchoes',     urlPath: 'colchoes',     type: 'colchao' },
  { slug: 'camas',        urlPath: 'bases',         type: 'cama' },
  { slug: 'cabeceiras',   urlPath: 'cabeceiras',    type: 'cabeceira' },
  { slug: 'travesseiros', urlPath: 'travesseiros',  type: 'travesseiro' },
  { slug: 'acessorios',   urlPath: 'acessorios',    type: null },
  { slug: 'moveis',       urlPath: 'moveis',        type: null },
];

// Politeness delay between requests (ms)
const DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────
function cleanImageUrl(url) {
  if (!url) return '';
  // Remove query params to get highest-resolution version
  return url.split('?')[0];
}

function makeSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: 'pt' });
}

// ────────────────────────────────────────────
// Scrape a single category page → return all product URLs
// ────────────────────────────────────────────
async function getCategoryProductLinks(page, cat) {
  const url = `${BASE_URL}/${cat.urlPath}`;
  console.log(`\n📂 Category: ${cat.slug} → ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(1000);

    // Scroll to load all lazy-loaded products
    let lastHeight = 0;
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => window.scrollBy(0, 1200));
      await sleep(800);
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === lastHeight) break;
      lastHeight = newHeight;
    }

    const links = await page.evaluate((catType) => {
      const found = new Set();
      document.querySelectorAll('a').forEach((a) => {
        const href = a.href;
        if (!href || !href.includes('/p/')) return;
        // Exclude "sob-medida" / custom variants
        if (href.includes('sob-medida') || href.includes('sobmedida') || href.includes('custom')) return;
        found.add(href);
      });
      return [...found];
    }, cat.type);

    console.log(`   Found ${links.length} product links`);
    return links;
  } catch (err) {
    console.error(`   ❌ Error scraping category ${cat.slug}: ${err.message}`);
    return [];
  }
}

// ────────────────────────────────────────────
// Scrape a single product page
// ────────────────────────────────────────────
async function scrapeProduct(page, url, categorySlug) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(800);

    // Wait for the product name
    try {
      await page.waitForSelector('h1', { timeout: 8000 });
    } catch (_) {}

    const data = await page.evaluate(() => {
      // ── Name ──────────────────────────────────────────────────────────────
      const name =
        document.querySelector('h1.titleNomeProduto')?.innerText?.trim() ||
        document.querySelector('h1')?.innerText?.trim() ||
        '';

      if (!name) return null;

      // ── Description ───────────────────────────────────────────────────────
      const descEl =
        document.querySelector('.product-description') ||
        document.querySelector('[itemprop="description"]') ||
        document.querySelector('.s-mb-1\\.5.s-fs-1') ||
        document.querySelector('[class*="description"]');
      const description = descEl ? descEl.innerText.trim() : '';
      const descriptionHtml = descEl ? descEl.innerHTML.trim() : '';

      // ── Images ────────────────────────────────────────────────────────────
      // Collect all CDN images from the gallery/splide/thumbnails
      const imageUrls = new Set();

      // Main gallery images (splide slides)
      document.querySelectorAll('.splide__slide img, .splide__list img').forEach((img) => {
        const src = (img.dataset.src || img.src || '').split('?')[0];
        if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src);
      });

      // Thumbnail strip
      document.querySelectorAll('.thumb img, [class*="thumb"] img, [class*="thumbnail"] img').forEach((img) => {
        const src = (img.dataset.src || img.src || '').split('?')[0];
        if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src);
      });

      // Any CDN image on the page as fallback
      if (imageUrls.size === 0) {
        document.querySelectorAll('img').forEach((img) => {
          const src = (img.dataset.src || img.src || '').split('?')[0];
          if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src);
        });
      }

      const images = [...imageUrls];

      // ── Variants / Sizes ──────────────────────────────────────────────────
      // The real site shows size cards with dimensions + price
      const variants = [];

      // Strategy 1: size selector buttons/cards (most reliable)
      const sizeCards = document.querySelectorAll(
        '[class*="size"] [class*="card"], [class*="tamanho"] [class*="card"], ' +
        '.product-size-item, [class*="sizeItem"], [class*="size-item"], ' +
        '[data-size], [class*="SelectSize"] > *, [class*="selectSize"] > *'
      );

      sizeCards.forEach((card) => {
        const sizeText = card.querySelector('[class*="size"], [class*="name"], strong, b')?.innerText?.trim()
          || card.innerText.split('\n')[0]?.trim();
        const priceText = card.querySelector('[class*="price"], .price')?.innerText?.trim()
          || card.innerText.match(/R\$\s*[\d.,]+/)?.[0];
        const dimText = card.querySelector('[class*="dim"], [class*="medida"]')?.innerText?.trim() || '';

        if (sizeText && priceText && !sizeText.toLowerCase().includes('sob medida')) {
          const rawPrice = priceText.replace(/[^\d,]/g, '').replace(',', '.');
          const price = parseFloat(rawPrice) || 0;
          if (price > 0) {
            variants.push({ size: sizeText, price, dimensions: dimText });
          }
        }
      });

      // Strategy 2: look for all sizes listed in the page text (fallback)
      if (variants.length === 0) {
        const sizeNames = ['Solteiro', 'Casal', 'Queen', 'King', 'Super King', 'Berço'];
        const priceEls = document.querySelectorAll('[class*="price"], .price, .newPrice');

        // Try to find each size + associate with a price
        sizeNames.forEach((sz) => {
          const el = Array.from(document.querySelectorAll('button, span, div, li')).find(
            (e) => e.innerText?.trim() === sz && e.children.length <= 2
          );
          if (el) {
            // Find nearby price
            const priceEl = el.closest('[class*="item"], [class*="card"], li')?.querySelector('[class*="price"]');
            const priceText = priceEl?.innerText?.trim() || '';
            const rawPrice = priceText.replace(/[^\d,]/g, '').replace(',', '.');
            const price = parseFloat(rawPrice) || 0;
            if (price > 0) {
              variants.push({ size: sz, price, dimensions: '' });
            }
          }
        });
      }

      // Strategy 3: single price (travesseiros / acessórios with no size choice)
      if (variants.length === 0) {
        const priceEl =
          document.querySelector('.newPrice') ||
          document.querySelector('[class*="price-value"]') ||
          document.querySelector('[class*="s-fs-3"][class*="s-fw-700"]');
        if (priceEl) {
          const raw = priceEl.innerText.replace(/[^\d,]/g, '').replace(',', '.');
          const price = parseFloat(raw) || 0;
          if (price > 0) variants.push({ size: 'Padrão', price, dimensions: '' });
        }
      }

      // ── Compare at price ──────────────────────────────────────────────────
      const compareEl =
        document.querySelector('[class*="price-old"], [class*="oldPrice"], s, del, [class*="compare"]');
      const compareRaw = compareEl?.innerText?.replace(/[^\d,]/g, '').replace(',', '.') || '';
      const compareAtPrice = parseFloat(compareRaw) || 0;

      return {
        name,
        description,
        descriptionHtml,
        images,
        variants,
        compareAtPriceBase: compareAtPrice,
      };
    });

    if (!data || !data.name) {
      console.log(`      ⚠️ Could not parse product at ${url}`);
      return null;
    }

    // De-duplicate variants by size
    const seenSizes = new Set();
    const cleanVariants = data.variants.filter((v) => {
      if (seenSizes.has(v.size)) return false;
      seenSizes.add(v.size);
      return true;
    });

    // If no variants found, put a placeholder that generate-sql will handle
    if (cleanVariants.length === 0) {
      cleanVariants.push({ size: 'Padrão', price: 0, dimensions: '' });
    }

    const featured_image = data.images[0] || '';

    return {
      name: data.name,
      slug: makeSlug(data.name),
      description: data.description,
      description_html: data.descriptionHtml,
      featured_image,
      images: data.images,           // all gallery images
      variants: cleanVariants,
      compare_at_price_base: data.compareAtPriceBase,
      category_slug: categorySlug,
      original_url: url,
    };
  } catch (err) {
    console.error(`      ❌ Error scraping ${url}: ${err.message}`);
    return null;
  }
}

// ────────────────────────────────────────────
// Scrape homepage banners
// ────────────────────────────────────────────
async function scrapeBanners(page) {
  console.log('\n🖼️  Scraping homepage banners...');
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);

    const banners = await page.evaluate(() => {
      const found = [];

      // Main hero slider
      document.querySelectorAll('.splide__slide').forEach((slide, i) => {
        const img = slide.querySelector('img');
        const link = slide.querySelector('a');
        if (!img) return;

        const src = (img.dataset.src || img.src || '').split('?')[0];
        if (!src || src.includes('loading')) return;

        // Check for mobile-specific image (picture source)
        const pictureSources = slide.querySelectorAll('picture source');
        let mobileSrc = '';
        pictureSources.forEach((src) => {
          if (src.media && src.media.includes('max-width')) {
            mobileSrc = (src.srcset || '').split('?')[0];
          }
        });

        found.push({
          title: img.alt || `Banner ${i + 1}`,
          image_desktop_url: src,
          image_mobile_url: mobileSrc || src,
          link: link?.href || '#',
          position: i,
        });
      });

      return found.filter((b) => b.image_desktop_url && b.image_desktop_url.includes('cdn.'));
    });

    console.log(`   Found ${banners.length} banners`);
    return banners;
  } catch (err) {
    console.error(`   ❌ Error scraping banners: ${err.message}`);
    return [];
  }
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────
async function scrape() {
  console.log('🚀 Starting Ortobom Full Scraper...\n');
  console.log(`   Categories: ${TARGET_CATEGORIES.map((c) => c.slug).join(', ')}`);
  console.log('   Mode: ALL products (no limit)\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // Track slugs to avoid duplicates across categories
  const seenSlugs = new Set();
  const allProducts = [];
  const banners = await scrapeBanners(page);

  for (const cat of TARGET_CATEGORIES) {
    const productLinks = await getCategoryProductLinks(page, cat);
    let scraped = 0;
    let skipped = 0;

    for (const link of productLinks) {
      if (scraped >= 10) {
        console.log(`   ⏹️ Reached limit of 10 products for category ${cat.slug}`);
        break;
      }

      // Skip "sob medida" in URL
      if (link.includes('sob-medida') || link.includes('sobmedida')) {
        skipped++;
        continue;
      }

      console.log(`   ➡️  [${cat.slug}] ${scraped + 1}/${productLinks.length} ${link}`);

      const product = await scrapeProduct(page, link, cat.slug);

      if (!product) {
        skipped++;
        continue;
      }

      // De-duplicate by slug
      if (seenSlugs.has(product.slug)) {
        console.log(`      ↩️  Duplicate slug: ${product.slug}, skipping`);
        skipped++;
        continue;
      }

      seenSlugs.add(product.slug);
      allProducts.push(product);
      scraped++;

      await sleep(DELAY_MS);
    }

    console.log(`\n   ✅ ${cat.slug}: ${scraped} scraped, ${skipped} skipped\n`);
  }

  await browser.close();

  // Write output
  const output = { products: allProducts, banners };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`\n✅ Done!`);
  console.log(`   Products: ${allProducts.length}`);
  console.log(`   Banners:  ${banners.length}`);
  console.log(`   Output:   ${OUTPUT_FILE}`);
}

scrape().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
