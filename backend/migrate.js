const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Check if video_url exists in product_colors
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='product_colors' AND column_name='video_url';
    `;
    
    const { rows } = await pool.query(checkColumnQuery);
    
    if (rows.length === 0) {
      console.log('Adding video_url column to product_colors table...');
      await pool.query('ALTER TABLE product_colors ADD COLUMN video_url TEXT;');
      console.log('Column added successfully.');
    } else {
      console.log('video_url column already exists.');
    }

    console.log('Migration completed successfully.');
    await pool.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
