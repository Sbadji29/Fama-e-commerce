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
    const users = [
      { username: 'admin', password: 'admin123' },
      { username: 'admin123', password: 'admin123' }
    ];

    for (const user of users) {
      console.log(`Resetting/Creating user ${user.username}...`);
      
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      
      // Delete if exists to valid duplicates/update password
      await pool.query('DELETE FROM admins WHERE username = $1', [user.username]);
      await pool.query('INSERT INTO admins (username, password) VALUES ($1, $2)', [user.username, hash]);
      
      console.log(`User ${user.username} created/updated successfully.`);
    }

    console.log('All admin users processed.');
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetAdmin();
