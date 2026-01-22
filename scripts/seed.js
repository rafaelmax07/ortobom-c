require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// IMPORTANT: For seeding/admin tasks, we usually need the SERVICE_ROLE_KEY to bypass RLS,
// but since we are using ANON key here, we rely on RLS policies allowing inserts OR user being authenticated.
// IF RLS IS ON AND NO POLICIES ALLOW ANON INSERTS, THIS WILL FAIL.
// FOR DEV/SETUP, IT'S BETTER TO TEMPORARILY DISABLE RLS OR ADD A POLICY.
// Assuming user ran the provided schema which doesn't enforce RLS by default or allows public for now?
// Actually standard Supabase tables have RLS disabled by default unless 'alter table ... enable row level security' is run.
// The schema.sql provided didn't enable RLS, so we should be good.

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Starting Seed Process...');

    const dataPath = path.join(__dirname, 'seed-products.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ seed-products.json not found. Run scrape.js first.');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const productsData = JSON.parse(rawData);

    console.log(`📦 Found ${productsData.length} products to seed.`);

    // 1. Upsert Categories
    const categories = [...new Set(productsData.map(p => p.category_slug))];
    const categoryMap = {}; // slug -> id

    for (const slug of categories) {
        const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

        // Check if exists to avoid errors on unique constraint if we run multiple times
        // or just use UPSERT (onConflict)
        const { data, error } = await supabase
            .from('categories')
            .upsert({ name, slug }, { onConflict: 'slug' })
            .select('id, slug')
            .single();

        if (error) {
            console.error(`❌ Error seeding category ${slug}:`, error.message);
        } else {
            console.log(`   ✅ Category: ${name}`);
            categoryMap[slug] = data.id;
        }
    }

    // 2. Insert Products & Variants
    for (const item of productsData) {
        // Upsert Product
        const { data: product, error: prodError } = await supabase
            .from('products')
            .upsert({
                name: item.name,
                slug: item.slug,
                description: item.description,
                featured_image: item.featured_image,
                category_id: categoryMap[item.category_slug]
            }, { onConflict: 'slug' })
            .select('id')
            .single();

        if (prodError) {
            console.error(`❌ Error seeding product ${item.name}:`, prodError.message);
            continue;
        }

        // Insert Default Variant (since we scrape one price per product)
        // We treat the scraped price/item as the main variant "Padrão" or infer size from URL if possible
        // For now we will create a generic one or use info from name if available

        // Naive logic: Extract size from name or URL?
        // URL: .../solteiro88 -> Size: Solteiro
        // URL: .../casal138 -> Size: Casal
        let size = 'Padrão';
        if (item.original_url.includes('solteiro')) size = 'Solteiro';
        if (item.original_url.includes('casal')) size = 'Casal';
        if (item.original_url.includes('queen')) size = 'Queen';
        if (item.original_url.includes('king')) size = 'King';

        const { error: varError } = await supabase
            .from('variants')
            .insert({
                product_id: product.id,
                size: size,
                price: item.price,
                sku: `${item.slug}-${size.toLowerCase().substring(0, 3)}`,
                stock: 100 // Default stock
            }); // We intentionally don't upsert variants here to avoid complexity on logic, but duplicate runs might duplicate variants. 
        // Ideally we delete old variants for this product first, or use a unique constraint on (product_id, size).
        // For this setup, we'll assume clean slate or just ignore.

        if (varError) {
            console.error(`   ⚠️ Error adding variant for ${item.name}:`, varError.message);
        } else {
            console.log(`   ✅ Product Scraped: ${item.name} | R$ ${item.price}`);
        }
    }

    console.log('✨ Seed completed!');
}

seed();
