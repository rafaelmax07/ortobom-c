const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'seed-products.json');
const outputPath = path.join(__dirname, '../supabase/seed.sql');

if (!fs.existsSync(dataPath)) {
    console.error('❌ seed-products.json not found.');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let sql = '-- Seed Data (Generated from scraper)\n\n';

// Helper to escape single quotes
const escape = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

// Size variant definitions for mattresses and bases
const MATTRESS_VARIANTS = [
    { size: 'Solteiro', dimensions: '88x188cm', priceMultiplier: 0.7, skuSuffix: 'SOL' },
    { size: 'Casal', dimensions: '138x188cm', priceMultiplier: 1.0, skuSuffix: 'CAS' },
    { size: 'Queen', dimensions: '158x198cm', priceMultiplier: 1.25, skuSuffix: 'QUE' },
    { size: 'King', dimensions: '193x203cm', priceMultiplier: 1.5, skuSuffix: 'KIN' },
];

// Determine if a product is a mattress/base (needs multiple variants) or not
function needsMultipleVariants(categorySlug) {
    return categorySlug === 'colchoes' || categorySlug === 'camas';
}

// Determine the base price reference multiplier from the scraped URL
// The scraper captured one price at one size. We need to infer which size was scraped
// so we can reverse-calculate the base price, then generate all variants from it.
function getScrapedSizeMultiplier(originalUrl) {
    if (originalUrl.includes('solteiro')) return 0.7;
    if (originalUrl.includes('queen')) return 1.25;
    if (originalUrl.includes('king')) return 1.5;
    // Default assumption: scraped price is for Casal
    return 1.0;
}

// 1. Categories
const categories = [...new Set(products.map(p => p.category_slug))];
sql += '-- Categories\n';
categories.forEach(slug => {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    sql += `INSERT INTO categories (name, slug) VALUES ('${name}', '${slug}') ON CONFLICT (slug) DO NOTHING;\n`;
});
sql += '\n';

// 2. Products and Variants
sql += '-- Products & Variants\n';
sql += '-- Clear variants for clean re-seed\n';
sql += 'TRUNCATE TABLE variants CASCADE;\n\n';

sql += 'DO $$\n';
sql += 'DECLARE\n';
sql += '  cat_id uuid;\n';
sql += '  prod_id uuid;\n';
sql += 'BEGIN\n';

products.forEach(p => {
    sql += `\n  -- Product: ${p.name}\n`;
    sql += `  SELECT id INTO cat_id FROM categories WHERE slug = '${p.category_slug}';\n`;

    // Insert/upsert product
    sql += `  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES (${escape(p.name)}, '${p.slug}', ${escape(p.description)}, ${escape(p.featured_image)}, cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;\n`;

    sql += `  IF prod_id IS NULL THEN\n`;
    sql += `    SELECT id INTO prod_id FROM products WHERE slug = '${p.slug}';\n`;
    sql += `  END IF;\n`;

    if (needsMultipleVariants(p.category_slug)) {
        // Reverse-calculate base price from the scraped price
        const scrapedMultiplier = getScrapedSizeMultiplier(p.original_url);
        const basePrice = Math.round(p.price / scrapedMultiplier);

        MATTRESS_VARIANTS.forEach(variant => {
            const variantPrice = Math.round(basePrice * variant.priceMultiplier);
            // Generate a compare_at_price ~30% higher for discount display
            const comparePrice = Math.round(variantPrice * 1.3);

            sql += `  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)\n`;
            sql += `              VALUES (prod_id, '${variant.size}', ${variantPrice}, ${comparePrice}, '${p.slug}-${variant.skuSuffix}', '${variant.dimensions}', 50);\n`;
        });
    } else {
        // Travesseiros and other single-variant products
        const comparePrice = Math.round(p.price * 1.3);
        sql += `  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)\n`;
        sql += `              VALUES (prod_id, 'Padrão', ${p.price}, ${comparePrice}, '${p.slug}-PAD', NULL, 50);\n`;
    }
});

sql += 'END $$;\n';

fs.writeFileSync(outputPath, sql);
console.log(`✅ SQL Seed generated at ${outputPath} (${products.length} products with multi-variant support)`);
