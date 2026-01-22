-- Seed Data (Generated from scraper)

-- Categories
INSERT INTO categories (name, slug) VALUES ('Colchoes', 'colchoes') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Camas', 'camas') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Travesseiros', 'travesseiros') ON CONFLICT (slug) DO NOTHING;

-- Products & Variants
DO $$
DECLARE
  cat_id uuid;
  prod_id uuid;
BEGIN

  -- Product: Colchão Fashion Standard
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Fashion Standard', 'colchao-fashion-standard', NULL, 'https://cdn.ortobom.com.br/file/892a53c2-f82a-4bd4-88e7-d5537c3c77f9/COLCHAO-PRO-SAUDE-STANDARD-SOLTEIRO--5-.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-fashion-standard';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 399, 'colchao-fashion-standard-Sol', '88x188cm', 50);

  -- Product: Colchão Pro Saude Extra
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Pro Saude Extra', 'colchao-pro-saude-extra', NULL, 'https://cdn.ortobom.com.br/file/3dff424a-b785-4b05-8001-11481a0be0a0/Ortobom4479-1.jpg.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-pro-saude-extra';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1799, 'colchao-pro-saude-extra-Cas', '138x188cm', 50);

  -- Product: Colchão Orion
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Orion', 'colchao-orion', NULL, 'https://cdn.ortobom.com.br/file/dc96b011-0d1c-432b-8457-3bf98c479e77/orion%20site.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-orion';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 4099, 'colchao-orion-Cas', '138x188cm', 50);

  -- Product: Colchão Orthopur
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Orthopur', 'colchao-orthopur', NULL, 'https://cdn.ortobom.com.br/file/46975b39-49fa-4982-86f8-cb080f859053/6040703650_ORTHOPUR_1000X1000.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-orthopur';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 3949, 'colchao-orthopur-Cas', '138x188cm', 50);

  -- Product: Colchão Ortopedico Premium
  SELECT id INTO cat_id FROM categories WHERE slug = 'colchoes';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Colchão Ortopedico Premium', 'colchao-ortopedico-premium', NULL, 'https://cdn.ortobom.com.br/file/4c4ee978-1fa1-4cba-850f-703968eadcff/605064.9781-1.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'colchao-ortopedico-premium';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 2699, 'colchao-ortopedico-premium-Cas', '138x188cm', 50);

  -- Product: Base Sommier Pró Saúde
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Pró Saúde', 'base-sommier-pro-saude', NULL, 'https://cdn.ortobom.com.br/file/1b0ec652-f98e-4c45-b572-1aac27396e56/6050649950_P.png?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-pro-saude';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Solteiro', 459, 'base-sommier-pro-saude-Sol', '88x188cm', 50);

  -- Product: Base Sommier Pró Força
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Pró Força', 'base-sommier-pro-forca', NULL, 'https://cdn.ortobom.com.br/file/1c33395d-7f30-46d6-a07c-df2c7f2eef05/BASE-SOMMIER-PRO-FORCA-CASAL--2-.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-pro-forca';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 959, 'base-sommier-pro-forca-Cas', '138x188cm', 50);

  -- Product: Base Sommier Ouro Spring
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Ouro Spring', 'base-sommier-ouro-spring', NULL, 'https://cdn.ortobom.com.br/file/10e31c87-7431-432f-9db0-be1b7f93c08f/BASE-SOMMIER-OURO-SPRING-CASAL--2-.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-ouro-spring';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 799, 'base-sommier-ouro-spring-Cas', '138x188cm', 50);

  -- Product: Base Sommier Baú Fashion Cori
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Baú Fashion Cori', 'base-sommier-bau-fashion-cori', NULL, 'https://cdn.ortobom.com.br/file/8fe66f8f-59a3-4190-8dc9-458eb595f939/PRETO.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-bau-fashion-cori';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1299, 'base-sommier-bau-fashion-cori-Cas', '138x188cm', 50);

  -- Product: Base Sommier Baú Fashion Nobuck
  SELECT id INTO cat_id FROM categories WHERE slug = 'camas';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Base Sommier Baú Fashion Nobuck', 'base-sommier-bau-fashion-nobuck', NULL, 'https://cdn.ortobom.com.br/file/79aa3d0f-ca23-4bf4-8efb-b61da47ad189/BASE-SOMMIER-BAU-FASHION-NOBUCK-CREAM-CASAL--5-.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'base-sommier-bau-fashion-nobuck';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Casal', 1299, 'base-sommier-bau-fashion-nobuck-Cas', '138x188cm', 50);

  -- Product: Travesseiro Viscopur
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Viscopur', 'travesseiro-viscopur', NULL, 'https://cdn.ortobom.com.br/file/68821870-21d0-4380-8754-bb9701d1bf9e/Travesseiro_Viscopur_Master.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-viscopur';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 189, 'travesseiro-viscopur-Pad', NULL, 50);

  -- Product: Travesseiro King Premium
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro King Premium', 'travesseiro-king-premium', NULL, 'https://cdn.ortobom.com.br/file/f55bdd80-c338-47cd-a74a-5200cc6b10a2/TRAVESSEIRO-KING-PREMIUM.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-king-premium';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 289, 'travesseiro-king-premium-Pad', NULL, 50);

  -- Product: Travesseiro Hug
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Hug', 'travesseiro-hug', NULL, 'https://cdn.ortobom.com.br/file/c16ca12e-f540-4d37-a463-628b4eb8ac94/TRAVESSEIRO-DE-CORPO-HUG.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-hug';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 169, 'travesseiro-hug-Pad', NULL, 50);

  -- Product: Travesseiro Seis Estrelas
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Seis Estrelas', 'travesseiro-seis-estrelas', NULL, 'https://cdn.ortobom.com.br/file/cd65629b-37f8-492b-bcc7-fa53b3746a72/TRAVESSEIRO-SEIS-ESTRELAS.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-seis-estrelas';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 59, 'travesseiro-seis-estrelas-Pad', NULL, 50);

  -- Product: Travesseiro Flock
  SELECT id INTO cat_id FROM categories WHERE slug = 'travesseiros';
  INSERT INTO products (name, slug, description, featured_image, category_id) 
              VALUES ('Travesseiro Flock', 'travesseiro-flock', NULL, 'https://cdn.ortobom.com.br/file/48c5f932-a7ae-4eb2-aed5-17fdcfcd606d/6090740048.jpg?w=210&h=140&v=1', cat_id)
              ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image
              RETURNING id INTO prod_id;
  IF prod_id IS NULL THEN
    SELECT id INTO prod_id FROM products WHERE slug = 'travesseiro-flock';
  END IF;
  INSERT INTO variants (product_id, size, price, sku, dimensions, stock)
              VALUES (prod_id, 'Padrão', 199, 'travesseiro-flock-Pad', NULL, 50);
END $$;
