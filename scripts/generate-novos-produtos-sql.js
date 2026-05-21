const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const dataPath = path.join(__dirname, '../docs/novas-variantes-extraidas.json');
const outputPath = path.join(__dirname, '../supabase/novos-produtos.sql');

if (!fs.existsSync(dataPath)) {
  console.error('❌ novas-variantes-extraidas.json not found in docs/.');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const allItems = Array.isArray(raw) ? raw : raw.products || [];

// Filter out products that failed to scrape
const products = allItems.filter(p => !p.error && p.name);

console.log(`📦 Loaded ${products.length} successful new products out of ${allItems.length} total entries.`);

// Helpers
const escape = (str) => (str ? `'${String(str).replace(/'/g, "''")}'` : 'NULL');
const escapeHtml = (str) => (str ? `'${String(str).replace(/'/g, "''").replace(/\n/g, '\\n')}'` : 'NULL');

function makeSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: 'pt' });
}

// Standard size order for mattresses/bases
const SIZE_ORDER = [
  'Solteiro',
  'Solteiro Extra',
  'Casal',
  'Queen',
  'King',
  'Super King',
  'Infantil',
  'Berço',
  'Padrão',
];

function sortVariants(variants) {
  return [...variants].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size);
    const bi = SIZE_ORDER.indexOf(b.size);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

// Build SQL
let sql = '-- Novos Produtos e Variantes (Non-destructive Incremental Seeding)\n';
sql += `-- Generated at: ${new Date().toISOString()}\n`;
sql += `-- Total Products to insert/update: ${products.length}\n\n`;

// ── Categories ────────────────────────────────────────────────────────────────
const categorySlugs = [...new Set(products.map((p) => p.category_slug).filter(Boolean))];
sql += '-- ═══ Categories ═══════════════════════════════════\n';
categorySlugs.forEach((slug) => {
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  sql += `INSERT INTO categories (name, slug) VALUES ('${name}', '${slug}') ON CONFLICT (slug) DO NOTHING;\n`;
});
sql += '\n';

// ── Products & Variants & Images ──────────────────────────────────────────────
sql += '-- ═══ Products, Variants & Images ═══════════════════\n';

products.forEach((p) => {
  const slug = p.slug || makeSlug(p.name);

  sql += `\n-- ── Product: ${p.name} (${p.category_slug}) ──────────────────────\n`;

  // Insert or Update the Product
  sql += `INSERT INTO products (name, slug, description, description_html, featured_image, category_id, is_active)\n`;
  sql += `  VALUES (\n`;
  sql += `    ${escape(p.name)},\n`;
  sql += `    '${slug}',\n`;
  sql += `    ${escape(p.description)},\n`;
  sql += `    ${escapeHtml(p.description_html)},\n`;
  sql += `    ${escape(p.featured_image)},\n`;
  sql += `    (SELECT id FROM categories WHERE slug = '${p.category_slug}'),\n`;
  sql += `    true\n`;
  sql += `  )\n`;
  sql += `  ON CONFLICT (slug) DO UPDATE SET\n`;
  sql += `    name = EXCLUDED.name,\n`;
  sql += `    description = EXCLUDED.description,\n`;
  sql += `    description_html = EXCLUDED.description_html,\n`;
  sql += `    featured_image = EXCLUDED.featured_image,\n`;
  sql += `    category_id = EXCLUDED.category_id,\n`;
  sql += `    is_active = EXCLUDED.is_active;\n\n`;

  // Clean old images and variants for this specific product to prevent duplication
  sql += `-- Clear old images & variants for ${slug} to avoid duplicates\n`;
  sql += `DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE slug = '${slug}');\n`;
  sql += `DELETE FROM variants WHERE product_id = (SELECT id FROM products WHERE slug = '${slug}');\n\n`;

  // Insert Images
  const images = p.images || (p.featured_image ? [p.featured_image] : []);
  if (images.length > 0) {
    sql += `INSERT INTO product_images (product_id, url, alt, position) VALUES\n`;
    const imageRows = images.map((imgUrl, pos) => {
      return `  ((SELECT id FROM products WHERE slug = '${slug}'), ${escape(imgUrl)}, ${escape(p.name)}, ${pos})`;
    });
    sql += imageRows.join(',\n') + ';\n\n';
  }

  // Insert Variants
  const variants = p.variants || [];
  const validVariants = variants.filter(v => {
    const sizeLower = v.size.toLowerCase();
    return !sizeLower.includes('sob medida') && !sizeLower.includes('medida');
  });

  const sorted = sortVariants(validVariants);

  if (sorted.length > 0) {
    sql += `INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock) VALUES\n`;
    const variantRows = sorted.map((v) => {
      const price = Math.round(v.price || 0);
      let comparePrice = 'NULL';
      if (v.compare_at_price && v.compare_at_price > price) {
        comparePrice = Math.round(v.compare_at_price);
      } else if (p.compare_at_price_base && p.compare_at_price_base > price) {
        comparePrice = Math.round(p.compare_at_price_base);
      }

      const variantSku = `${slug}-${v.size.replace(/\s+/g, '').toUpperCase().substring(0, 5)}`;
      return `  ((SELECT id FROM products WHERE slug = '${slug}'), ${escape(v.size)}, ${price}, ${comparePrice}, '${variantSku}', ${escape(v.dimensions || null)}, 50)`;
    });
    sql += variantRows.join(',\n') + ';\n';
  }
});

fs.writeFileSync(outputPath, sql);
console.log(`\n✅ Safe Incremental SQL Seed generated:`);
console.log(`   File: ${outputPath}`);
console.log(`   Products extracted and mapped: ${products.length}`);
console.log(`   Categories created/updated: ${categorySlugs.join(', ')}`);
