-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Categories
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id),
  featured_image text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Variants (Items for sale)
create table variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  sku text,
  size text not null, -- e.g. 'Solteiro', 'Casal'
  price numeric not null,
  compare_at_price numeric,
  dimensions text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_products_slug on products(slug);
create index idx_products_category on products(category_id);
create index idx_variants_product on variants(product_id);
