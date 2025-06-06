const { Pool } = require('pg');
require('dotenv').config();

console.log("PGHOST:", process.env.PGHOST); // ตรวจสอบค่า
console.log("PGHOST =", process.env.PGHOST);


const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
