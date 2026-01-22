const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

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

// 1. Categories
const categories = [...new Set(products.map(p => p.category_slug))];
sql += '-- Categories\n';
categories.forEach(slug => {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    // Handle conflict on slug do nothing
    sql += `INSERT INTO categories (name, slug) VALUES ('${name}', '${slug}') ON CONFLICT (slug) DO NOTHING;\n`;
});
sql += '\n';

// 2. Products and Variants
sql += '-- Products & Variants\n';
sql += '-- Prevent duplicates by clearing variants (since we insert them fresh)\n';
sql += 'TRUNCATE TABLE variants CASCADE;\n\n';

sql += 'DO $$\n';
sql += 'DECLARE\n';
sql += '  cat_id uuid;\n';
sql += '  prod_id uuid;\n';
sql += 'BEGIN\n';

products.forEach(p => {
    const size = p.original_url.includes('solteiro') ? 'Solteiro' :
        p.original_url.includes('casal') ? 'Casal' :
            p.original_url.includes('queen') ? 'Queen' :
                p.original_url.includes('king') ? 'King' : 'Padrão';

    // Determine dimensions based on size name (approximate for Ortobom)
    let dimensions = 'NULL';
    if (size === 'Solteiro') dimensions = "'88x188cm'";
    if (size === 'Casal') dimensions = "'138x188cm'";
    if (size === 'Queen') dimensions = "'158x198cm'";
    if (size === 'King') dimensions = "'193x203cm'";

    sql += `\n  -- Product: ${p.name}\n`;
    sql += `  SELECT id INTO cat_id FROM categories WHERE slug = '${p.category_slug}';\n`;

    // Insert Product if not exists
    sql += `  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES (${escape(p.name)}, '${p.slug}', ${escape(p.description)}, ${escape(p.featured_image)}, cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;\n`;

    // If product existed and we just updated, prod_id might be null in some SQL dialects but RETURNING in PG works on UPDATE too if row is returned. 
    // However, on conflict do update returns the row.
    // Ensure we have the ID to insert variant
    sql += `  IF prod_id IS NULL THEN\n`;
    sql += `    SELECT id INTO prod_id FROM products WHERE slug = '${p.slug}';\n`;
    sql += `  END IF;\n`;

    // Insert Variant
    sql += `  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, '${size}', ${p.price}, '${p.slug}-${size.substring(0, 3)}', ${dimensions}, 50);\n`;
});

sql += 'END $$;\n';

fs.writeFileSync(outputPath, sql);
console.log(`✅ SQL Seed generated at ${outputPath}`);
