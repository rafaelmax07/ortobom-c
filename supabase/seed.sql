-- Seed Data (Generated from scraper)

-- Categories
INSERT INTO categories (name, slug) VALUES ('Colchoes', 'colchoes') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Camas', 'camas') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Travesseiros', 'travesseiros') ON CONFLICT (slug) DO NOTHING;

-- Products & Variants
-- Clear variants for clean re-seed
TRUNCATE TABLE variants CASCADE;

DO $$
DECLARE
  cat_id uuid;
  prod_id uuid;
BEGIN

  -- Product: Colchão Fashion Standard
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Fashion Standard', 'colchao-fashion-standard', NULL, 'https://cdn.ortobom.com.br/file/892a53c2-f82a-4bd4-88e7-d5537c3c77f9/COLCHAO-PRO-SAUDE-STANDARD-SOLTEIRO--5-.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-fashion-standard';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 399, 519, 'colchao-fashion-standard-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 570, 741, 'colchao-fashion-standard-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 713, 927, 'colchao-fashion-standard-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 855, 1112, 'colchao-fashion-standard-KIN', '193x203cm', 50);

  -- Product: Colchão Pro Saude Extra
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Pro Saude Extra', 'colchao-pro-saude-extra', NULL, 'https://cdn.ortobom.com.br/file/3dff424a-b785-4b05-8001-11481a0be0a0/Ortobom4479-1.jpg.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-pro-saude-extra';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 1259, 1637, 'colchao-pro-saude-extra-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1799, 2339, 'colchao-pro-saude-extra-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 2249, 2924, 'colchao-pro-saude-extra-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 2699, 3509, 'colchao-pro-saude-extra-KIN', '193x203cm', 50);

  -- Product: Colchão Orion
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Orion', 'colchao-orion', NULL, 'https://cdn.ortobom.com.br/file/dc96b011-0d1c-432b-8457-3bf98c479e77/orion%20site.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-orion';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 2869, 3730, 'colchao-orion-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 4099, 5329, 'colchao-orion-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 5124, 6661, 'colchao-orion-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 6149, 7994, 'colchao-orion-KIN', '193x203cm', 50);

  -- Product: Colchão Orthopur
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Orthopur', 'colchao-orthopur', NULL, 'https://cdn.ortobom.com.br/file/46975b39-49fa-4982-86f8-cb080f859053/6040703650_ORTHOPUR_1000X1000.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-orthopur';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 2764, 3593, 'colchao-orthopur-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 3949, 5134, 'colchao-orthopur-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 4936, 6417, 'colchao-orthopur-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 5924, 7701, 'colchao-orthopur-KIN', '193x203cm', 50);

  -- Product: Colchão Ortopedico Premium
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Ortopedico Premium', 'colchao-ortopedico-premium', NULL, 'https://cdn.ortobom.com.br/file/4c4ee978-1fa1-4cba-850f-703968eadcff/605064.9781-1.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-ortopedico-premium';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 1889, 2456, 'colchao-ortopedico-premium-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 2699, 3509, 'colchao-ortopedico-premium-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 3374, 4386, 'colchao-ortopedico-premium-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 4049, 5264, 'colchao-ortopedico-premium-KIN', '193x203cm', 50);

  -- Product: Base Sommier Pró Saúde
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Pró Saúde', 'base-sommier-pro-saude', NULL, 'https://cdn.ortobom.com.br/file/1b0ec652-f98e-4c45-b572-1aac27396e56/6050649950_P.png', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-pro-saude';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 459, 597, 'base-sommier-pro-saude-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 656, 853, 'base-sommier-pro-saude-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 820, 1066, 'base-sommier-pro-saude-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 984, 1279, 'base-sommier-pro-saude-KIN', '193x203cm', 50);

  -- Product: Base Sommier Pró Força
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Pró Força', 'base-sommier-pro-forca', NULL, 'https://cdn.ortobom.com.br/file/1c33395d-7f30-46d6-a07c-df2c7f2eef05/BASE-SOMMIER-PRO-FORCA-CASAL--2-.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-pro-forca';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 671, 872, 'base-sommier-pro-forca-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 959, 1247, 'base-sommier-pro-forca-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 1199, 1559, 'base-sommier-pro-forca-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 1439, 1871, 'base-sommier-pro-forca-KIN', '193x203cm', 50);

  -- Product: Base Sommier Ouro Spring
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Ouro Spring', 'base-sommier-ouro-spring', NULL, 'https://cdn.ortobom.com.br/file/10e31c87-7431-432f-9db0-be1b7f93c08f/BASE-SOMMIER-OURO-SPRING-CASAL--2-.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-ouro-spring';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 559, 727, 'base-sommier-ouro-spring-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 799, 1039, 'base-sommier-ouro-spring-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 999, 1299, 'base-sommier-ouro-spring-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 1199, 1559, 'base-sommier-ouro-spring-KIN', '193x203cm', 50);

  -- Product: Base Sommier Baú Fashion Cori
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Baú Fashion Cori', 'base-sommier-bau-fashion-cori', NULL, 'https://cdn.ortobom.com.br/file/8fe66f8f-59a3-4190-8dc9-458eb595f939/PRETO.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-bau-fashion-cori';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 909, 1182, 'base-sommier-bau-fashion-cori-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1299, 1689, 'base-sommier-bau-fashion-cori-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 1624, 2111, 'base-sommier-bau-fashion-cori-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 1949, 2534, 'base-sommier-bau-fashion-cori-KIN', '193x203cm', 50);

  -- Product: Base Sommier Baú Fashion Nobuck
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Baú Fashion Nobuck', 'base-sommier-bau-fashion-nobuck', NULL, 'https://cdn.ortobom.com.br/file/79aa3d0f-ca23-4bf4-8efb-b61da47ad189/BASE-SOMMIER-BAU-FASHION-NOBUCK-CREAM-CASAL--5-.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-bau-fashion-nobuck';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 909, 1182, 'base-sommier-bau-fashion-nobuck-SOL', '88x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1299, 1689, 'base-sommier-bau-fashion-nobuck-CAS', '138x188cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Queen', 1624, 2111, 'base-sommier-bau-fashion-nobuck-QUE', '158x198cm', 50);
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'King', 1949, 2534, 'base-sommier-bau-fashion-nobuck-KIN', '193x203cm', 50);

  -- Product: Travesseiro Viscopur
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Viscopur', 'travesseiro-viscopur', NULL, 'https://cdn.ortobom.com.br/file/68821870-21d0-4380-8754-bb9701d1bf9e/Travesseiro_Viscopur_Master.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-viscopur';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 189, 246, 'travesseiro-viscopur-PAD', NULL, 50);

  -- Product: Travesseiro King Premium
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro King Premium', 'travesseiro-king-premium', NULL, 'https://cdn.ortobom.com.br/file/f55bdd80-c338-47cd-a74a-5200cc6b10a2/TRAVESSEIRO-KING-PREMIUM.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-king-premium';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 289, 376, 'travesseiro-king-premium-PAD', NULL, 50);

  -- Product: Travesseiro Hug
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Hug', 'travesseiro-hug', NULL, 'https://cdn.ortobom.com.br/file/c16ca12e-f540-4d37-a463-628b4eb8ac94/TRAVESSEIRO-DE-CORPO-HUG.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-hug';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 169, 220, 'travesseiro-hug-PAD', NULL, 50);

  -- Product: Travesseiro Seis Estrelas
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Seis Estrelas', 'travesseiro-seis-estrelas', NULL, 'https://cdn.ortobom.com.br/file/cd65629b-37f8-492b-bcc7-fa53b3746a72/TRAVESSEIRO-SEIS-ESTRELAS.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-seis-estrelas';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 59, 77, 'travesseiro-seis-estrelas-PAD', NULL, 50);

  -- Product: Travesseiro Flock
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Flock', 'travesseiro-flock', NULL, 'https://cdn.ortobom.com.br/file/48c5f932-a7ae-4eb2-aed5-17fdcfcd606d/6090740048.jpg', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-flock';
  END IF;
  INSERT INTO variants (product_id, size, price, compare_at_price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 199, 259, 'travesseiro-flock-PAD', NULL, 50);
END $$;
