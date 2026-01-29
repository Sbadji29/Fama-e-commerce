CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_colors (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  color_name VARCHAR(50) NOT NULL,
  hex_code VARCHAR(7) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS product_photos (
  id SERIAL PRIMARY KEY,
  product_color_id INTEGER REFERENCES product_colors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, validated, cancelled
  validation_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_color_id INTEGER REFERENCES product_colors(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  size_selected VARCHAR(10),
  product_name VARCHAR(255) -- stored for history
);

-- Seed Categories
INSERT INTO categories (name, slug) VALUES 
('Vêtements', 'vetements'), 
('Accessoires', 'accessoires'), 
('Promos', 'promos')
ON CONFLICT (slug) DO NOTHING;

-- Seed Admin (password: admin123)
-- Hash generated for 'admin123'
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$X7.z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z') 
ON CONFLICT (username) DO NOTHING;
