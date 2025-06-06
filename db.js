const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,          // อ่านค่าจาก env จริง ๆ
  port: Number(process.env.PGPORT),  // แปลงเป็นตัวเลขด้วย Number()
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});


module.exports = pool;
