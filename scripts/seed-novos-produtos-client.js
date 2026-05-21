require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

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

async function seed() {
    console.log('🌱 Starting Incremental Seeding of New Products...');

    const dataPath = path.join(__dirname, '../docs/novas-variantes-extraidas.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ novas-variantes-extraidas.json not found in docs/.');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const allItems = JSON.parse(rawData).products || [];

    // Filter out products that failed to scrape
    const productsToSeed = allItems.filter(p => !p.error && p.name);

    console.log(`📦 Found ${productsToSeed.length} successful new products to seed.`);

    // 1. Process/Upsert Categories
    const categoriesSet = [...new Set(productsToSeed.map(p => p.category_slug).filter(Boolean))];
    const categoryMap = {}; // slug -> id

    console.log('\n🗂️  Seeding Categories...');
    for (const slug of categoriesSet) {
        const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

        const { data, error } = await supabase
            .from('categories')
            .upsert({ name, slug }, { onConflict: 'slug' })
            .select('id, slug')
            .single();

        if (error) {
            console.error(`  ❌ Error seeding category ${slug}:`, error.message);
        } else {
            console.log(`  ✅ Category: ${name} (${slug})`);
            categoryMap[slug] = data.id;
        }
    }

    // 2. Process Products, Images, and Variants
    console.log('\n🛍️  Seeding Products, Images, and Variants...');
    let successCount = 0;
    let totalVariantsCount = 0;
    let totalImagesCount = 0;

    for (let i = 0; i < productsToSeed.length; i++) {
        const item = productsToSeed[i];
        const slug = item.slug || makeSlug(item.name);
        const categoryId = categoryMap[item.category_slug] || null;

        console.log(`\n[${i + 1}/${productsToSeed.length}] Product: ${item.name} (${slug})`);

        // Upsert Product
        const { data: product, error: prodError } = await supabase
            .from('products')
            .upsert({
                name: item.name,
                slug: slug,
                description: item.description || '',
                description_html: item.description_html || '',
                featured_image: item.featured_image || '',
                category_id: categoryId,
                is_active: true
            }, { onConflict: 'slug' })
            .select('id')
            .single();

        if (prodError) {
            console.error(`  ❌ Error upserting product ${item.name}:`, prodError.message);
            continue;
        }

        const productId = product.id;

        // Clean existing images & variants to avoid duplicates
        const { error: delImgError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);

        if (delImgError) {
            console.error(`  ⚠️ Warning: Could not clear old images for ${item.name}:`, delImgError.message);
        }

        const { error: delVarError } = await supabase
            .from('variants')
            .delete()
            .eq('product_id', productId);

        if (delVarError) {
            console.error(`  ⚠️ Warning: Could not clear old variants for ${item.name}:`, delVarError.message);
        }

        // Insert new images
        const imagesList = item.images || (item.featured_image ? [item.featured_image] : []);
        if (imagesList.length > 0) {
            const imagesPayload = imagesList.map((url, pos) => ({
                product_id: productId,
                url: url,
                alt: item.name,
                position: pos
            }));

            const { error: imgError } = await supabase
                .from('product_images')
                .insert(imagesPayload);

            if (imgError) {
                console.error(`  ❌ Error inserting images for ${item.name}:`, imgError.message);
            } else {
                console.log(`  📸 Inserted ${imagesList.length} gallery images.`);
                totalImagesCount += imagesList.length;
            }
        }

        // Filter and Sort Variants
        const rawVariants = item.variants || [];
        const validVariants = rawVariants.filter(v => {
            const sizeLower = v.size.toLowerCase();
            return !sizeLower.includes('sob medida') && !sizeLower.includes('medida');
        });

        const sortedVariants = sortVariants(validVariants);

        if (sortedVariants.length > 0) {
            const variantsPayload = sortedVariants.map(v => {
                const price = Math.round(v.price || 0);
                let comparePrice = null;
                if (v.compare_at_price && v.compare_at_price > price) {
                    comparePrice = Math.round(v.compare_at_price);
                } else if (item.compare_at_price_base && item.compare_at_price_base > price) {
                    comparePrice = Math.round(item.compare_at_price_base);
                }

                const variantSku = `${slug}-${v.size.replace(/\s+/g, '').toUpperCase().substring(0, 5)}`;

                return {
                    product_id: productId,
                    size: v.size,
                    price: price,
                    compare_at_price: comparePrice,
                    sku: variantSku,
                    dimensions: v.dimensions || null,
                    stock: 50
                };
            });

            const { error: varError } = await supabase
                .from('variants')
                .insert(variantsPayload);

            if (varError) {
                console.error(`  ❌ Error inserting variants for ${item.name}:`, varError.message);
            } else {
                console.log(`  🏷️  Inserted ${sortedVariants.length} price variants.`);
                totalVariantsCount += sortedVariants.length;
            }
        } else {
            console.log('  ⚠️ No valid non-custom variants found.');
        }

        successCount++;
    }

    console.log('\n✨ Seeding process completed successfully!');
    console.log(`   Processed Products: ${successCount}/${productsToSeed.length}`);
    console.log(`   Total Gallery Images Inserted: ${totalImagesCount}`);
    console.log(`   Total Variants Inserted: ${totalVariantsCount}`);
}

seed().catch(err => {
    console.error('❌ Global error in seeding script:', err);
    process.exit(1);
});
