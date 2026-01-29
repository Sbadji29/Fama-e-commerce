const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000, 
});

async function testConnection() {
  try {
    console.log('Testing connection to', process.env.DB_HOST);
    const client = await pool.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
