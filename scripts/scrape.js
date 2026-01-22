const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Configuration
const BASE_URL = 'https://www.ortobom.com.br';
const OUTPUT_FILE = path.join(__dirname, 'seed-products.json');
const TARGET_CATEGORIES = [
    'colchoes',
    'camas',
    'travesseiros',
    'roupa-de-cama'
];

async function scrape() {
    console.log('🚀 Starting Ortobom Scraper...');
    const browser = await puppeteer.launch({
        headless: false, // Useful to see what's happening, change to "new" for headless
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();

    const allProducts = [];

    for (const categorySlug of TARGET_CATEGORIES) {
        const categoryUrl = `${BASE_URL}/${categorySlug}`;
        console.log(`\n📂 Scraping Category: ${categorySlug}`);

        try {
            await page.goto(categoryUrl, { waitUntil: 'networkidle2' });

            // Get product links from the listing page
            const productLinks = await page.evaluate(() => {
                // Updated selectors based on inspection:
                // The list is .product-list, cards are .product-item or we can just grab all product links
                // The most reliable finding was looking for links to /p/colchao/ etc
                const links = new Set();

                // Strategy 1: Look for specific product card links
                document.querySelectorAll('a').forEach(a => {
                    if (a.href && (a.href.includes('/p/colchao') || a.href.includes('/p/cama') || a.href.includes('/p/travesseiro'))) {
                        links.add(a.href);
                    }
                });

                return [...links];
            });

            console.log(`   Found ${productLinks.length} products. Processing top 5...`);

            // Limit to 5 per category for initial seed to be fast
            const linksToProcess = productLinks.slice(0, 5);

            for (const link of linksToProcess) {
                console.log(`   ➡️ Scraping Product: ${link}`);
                try {
                    await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

                    // Wait for critical elements to ensure page is ready
                    try {
                        await page.waitForSelector('h1', { timeout: 5000 });
                        // Attempt to wait for price, but don't fail if not found immediately (sometimes it's just very slow or different structure)
                        await page.waitForSelector('.product-price-value, .newPrice, .price-value', { timeout: 3000 }).catch(() => { });
                    } catch (e) {
                        console.log('      ⚠️ Timeout waiting for selectors, trying to scrape anyway...');
                    }

                    const productData = await page.evaluate(() => {
                        const name = document.querySelector('h1.titleNomeProduto')?.innerText?.trim()
                            || document.querySelector('h1')?.innerText?.trim()
                            || 'Unknown Product';

                        // Description
                        // Ortobom often puts description in a paragraph with class 's-fs-1' or similar
                        let description = '';
                        const descEl = document.querySelector('.product-description')
                            || document.querySelector('[itemprop="description"]')
                            || document.querySelector('.description')
                            || Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('Detalhes'))
                            || document.querySelector('.s-mb-1\\.5.s-fs-1'); // From browser agent finding
                        if (descEl) description = descEl.innerText.trim();

                        // Image
                        let featured_image = '';
                        const imgEl = document.querySelector('.splide__slide.is-active img')
                            || document.querySelector('.imgCenterProd img')
                            || document.querySelector('.product-image-gallery img')
                            || document.querySelector('.main-image img');
                        if (imgEl) {
                            // Remove query params like ?w=210&h=140 to get full resolution
                            featured_image = imgEl.src.split('?')[0];
                        }

                        // Price
                        let price = 0;
                        const priceEl = document.querySelector('.newPrice') // From browser agent finding
                            || document.querySelector('.product-price-value')
                            || document.querySelector('.price-value')
                            || document.querySelector('.s-fs-3.s-fw-700.text-blue700'); // From browser agent finding

                        if (priceEl) {
                            const pText = priceEl.innerText.replace(/[^\d,]/g, '').replace(',', '.');
                            price = parseFloat(pText) || 0;
                        }

                        return {
                            name,
                            description,
                            featured_image,
                            price
                        };
                    });
                    if (productData.name === 'Unknown Product') {
                        console.log('⚠️ Could not parse product name, skipping...');
                        continue;
                    }

                    allProducts.push({
                        ...productData,
                        slug: slugify(productData.name, { lower: true, strict: true }),
                        category_slug: categorySlug,
                        original_url: link
                    });

                    // Politeness delay
                    await new Promise(r => setTimeout(r, 1000));

                } catch (innerErr) {
                    console.error(`❌ Error processing product ${link}:`, innerErr.message);
                }
            }

        } catch (err) {
            console.error(`❌ Error scraping category ${categorySlug}:`, err.message);
        }
    }

    await browser.close();

    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
    console.log(`\n✅ Done! Saved ${allProducts.length} products to ${OUTPUT_FILE}`);
}

scrape();
