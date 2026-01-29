const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function resetAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    
    console.log(`Resetting password for ${username}...`);
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('New Hash:', hash);

    await pool.query('DELETE FROM admins WHERE username = $1', [username]);
    await pool.query('INSERT INTO admins (username, password) VALUES ($1, $2)', [username, hash]);
    
    console.log('Admin reset successfully.');
    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

resetAdmin();
