const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and update it.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
