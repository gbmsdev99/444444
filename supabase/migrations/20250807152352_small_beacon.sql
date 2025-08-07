/*
  # E-Tailor Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `products` - Product catalog
    - `fabrics` - Available fabric options
    - `product_fabrics` - Many-to-many relationship between products and fabrics
    - `measurements` - Customer measurement profiles
    - `orders` - Customer orders
    - `order_items` - Order line items with customizations
    - `customizations` - Order customization details

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for product management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  address text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('shirt', 'suit', 'dress', 'pants', 'jacket')),
  base_price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fabrics table
CREATE TABLE IF NOT EXISTS fabrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  price_multiplier decimal(3,2) NOT NULL DEFAULT 1.0,
  image_url text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Product-Fabric relationship
CREATE TABLE IF NOT EXISTS product_fabrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  fabric_id uuid REFERENCES fabrics(id) ON DELETE CASCADE,
  UNIQUE(product_id, fabric_id)
);

-- Measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  neck decimal(5,2) NOT NULL,
  chest decimal(5,2) NOT NULL,
  waist decimal(5,2) NOT NULL,
  hips decimal(5,2) NOT NULL,
  arm_length decimal(5,2) NOT NULL,
  height decimal(5,2) NOT NULL,
  shoulder decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in-stitching', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  notes text,
  order_date timestamptz DEFAULT now(),
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  fabric_id uuid REFERENCES fabrics(id),
  measurement_id uuid REFERENCES measurements(id),
  quantity integer DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  customizations jsonb DEFAULT '{}',
  design_upload_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fabrics policies (public read, admin write)
CREATE POLICY "Anyone can view active fabrics"
  ON fabrics FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage fabrics"
  ON fabrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Product-Fabric policies
CREATE POLICY "Anyone can view product fabrics"
  ON product_fabrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage product fabrics"
  ON product_fabrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Measurements policies
CREATE POLICY "Users can manage own measurements"
  ON measurements FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all measurements"
  ON measurements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_measurements_updated_at BEFORE UPDATE ON measurements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Insert sample data
INSERT INTO products (name, category, base_price, image_url, description) VALUES
('Premium Cotton Dress Shirt', 'shirt', 1299, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 'Classic dress shirt perfect for business and formal occasions'),
('Bespoke Three-Piece Suit', 'suit', 4999, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 'Handcrafted three-piece suit with impeccable tailoring'),
('Elegant Evening Dress', 'dress', 3499, 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=500', 'Sophisticated evening dress for special occasions'),
('Tailored Formal Trousers', 'pants', 1599, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 'Perfectly fitted formal trousers with premium finish'),
('Custom Blazer', 'jacket', 2299, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'Versatile blazer suitable for business and casual wear'),
('Casual Cotton Shirt', 'shirt', 899, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', 'Comfortable casual shirt for everyday wear');

INSERT INTO fabrics (name, type, price_multiplier, image_url, description) VALUES
('Premium Egyptian Cotton', 'Cotton', 1.2, 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400', 'Luxurious Egyptian cotton with superior softness and durability'),
('Italian Silk Blend', 'Silk', 2.5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Elegant silk blend fabric with lustrous finish'),
('Merino Wool Suiting', 'Wool', 2.0, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', 'Premium merino wool perfect for formal suiting'),
('Linen Summer Blend', 'Linen', 1.5, 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400', 'Breathable linen blend ideal for summer wear'),
('Bamboo Eco-Friendly', 'Bamboo', 1.3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Sustainable bamboo fabric with natural antibacterial properties'),
('Cashmere Luxury', 'Cashmere', 3.0, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', 'Ultra-soft cashmere for the ultimate luxury experience');

-- Link all fabrics to all products
INSERT INTO product_fabrics (product_id, fabric_id)
SELECT p.id, f.id FROM products p CROSS JOIN fabrics f;

-- Create admin user profile (will be created when admin signs up)
-- The admin user will be created through the auth flow