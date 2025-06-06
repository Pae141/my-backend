require('dotenv').config(); // ต้องอยู่บรรทัดแรกก่อนใช้ process.env
const { Pool } = require('pg');

console.log("PGHOST =", process.env.PGHOST); // ดูว่าอ่านค่ามาถูกไหม

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
