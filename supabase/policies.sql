-- Enable RLS on all tables (Security Best Practice)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow Public Read Access for Categories
CREATE POLICY "Public Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- Policy 2: Allow Public Read Access for Products
CREATE POLICY "Public Products are viewable by everyone" 
ON products FOR SELECT 
USING (is_active = true);

-- Policy 3: Allow Public Read Access for Variants
CREATE POLICY "Public Variants are viewable by everyone" 
ON variants FOR SELECT 
USING (true);

-- Debugging: Verify policies
SELECT * FROM pg_policies WHERE tablename IN ('categories', 'products', 'variants');
