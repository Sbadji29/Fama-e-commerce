const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: { rejectUnauthorized: false }
});

const products = [
  {
    name: "Robe d'été Fleurie",
    description: "Une robe légère et élégante pour vos sorties estivales.",
    price: 15000,
    category_id: 1, // Vêtements
    colors: [
      {
        name: "Rouge",
        hex: "#FF0000",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"]
      },
      {
        name: "Bleu",
        hex: "#0000FF",
        stock: 5,
        images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"]
      }
    ]
  },
  {
    name: "Sac à Main Luxe",
    description: "Un accessoire incontournable pour parfaire votre tenue.",
    price: 45000,
    category_id: 2, // Accessoires
    colors: [
      {
        name: "Noir",
        hex: "#000000",
        stock: 3,
        images: ["https://images.unsplash.com/photo-1584917033904-493bb3c3cc08?w=800"]
      },
      {
        name: "Doré",
        hex: "#D4AF37",
        stock: 2,
        images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800"]
      }
    ]
  },
  {
    name: "Voile en Soie",
    description: "Voile de haute qualité, doux et confortable.",
    price: 5000,
    category_id: 9, // Voile modal coton
    colors: [
      {
        name: "Beige",
        hex: "#F5F5DC",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800"]
      },
      {
        name: "Rose Pâle",
        hex: "#FFD1DC",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1520006403993-474be508c905?w=800"]
      }
    ]
  },
  {
    name: "T-Shirt Premium",
    description: "Coton 100% bio, ultra confortable.",
    price: 8000,
    category_id: 1, // Vêtements
    colors: [
      {
        name: "Blanc",
        hex: "#FFFFFF",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"]
      }
    ]
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting seeding...');
    await client.query('BEGIN');

    for (const p of products) {
      // Insert product
      const productRes = await client.query(
        'INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [p.name, p.description, p.price, p.category_id]
      );
      const productId = productRes.rows[0].id;

      for (const c of p.colors) {
        // Insert color
        const colorRes = await client.query(
          'INSERT INTO product_colors (product_id, color_name, hex_code, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING id',
          [productId, c.name, c.hex, c.stock]
        );
        const colorId = colorRes.rows[0].id;

        for (const img of c.images) {
          // Insert photo
          await client.query(
            'INSERT INTO product_photos (product_color_id, image_url) VALUES ($1, $2)',
            [colorId, img]
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
