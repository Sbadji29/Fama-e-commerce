const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // Connect to 'postgres' first to create the DB
    database: 'postgres', 
    ssl: { rejectUnauthorized: false },
  };

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to postgres...');

    const dbName = process.env.DB_NAME;
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const checkRes = await client.query(checkDbQuery, [dbName]);

    if (checkRes.rowCount === 0) {
      console.log(`Database ${dbName} does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }

    await client.end();

    // Now connect to the new DB
    const poolConfig = {
      ...dbConfig,
      database: dbName,
    };
    
    const { Pool } = require('pg');
    const pool = new Pool(poolConfig);
    
    console.log('Running schema...');
    
    // Read schema file
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

    // Handle Admin Password Hashing for Seed
    // We'll manually insert the admin if not exists instead of sql hardcoding to ensure bcrypt works
    // But for now, let's just run the sql. 
    // Wait, the SQL has a hash placeholder. I should fix that hash.
    // Let's generate a real hash for 'admin123' here.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    
    // Replace the placeholder in the SQL or run a separate insert
    const sqlStatements = schemaSQL.split(';').filter(stmt => stmt.trim() !== '');

    for (const stmt of sqlStatements) {
        if (stmt.includes('INSERT INTO admins') && stmt.includes('Z.Z.Z')) {
             // Skip the placeholder insert
             continue;
        }
        await pool.query(stmt);
    }

    // Insert Admin
    const adminCheck = await pool.query("SELECT * FROM admins WHERE username = 'admin'");
    if(adminCheck.rows.length === 0) {
        await pool.query("INSERT INTO admins (username, password) VALUES ($1, $2)", ['admin', hash]);
        console.log('Admin seeded.');
    }

    console.log('Schema applied successfully.');
    await pool.end();

  } catch (err) {
    console.error('Database setup failed:', err);
  }
}

setupDatabase();
