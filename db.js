const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // บังคับใช้ IPv4
  // ในบางกรณีต้องใส่ connectionTimeoutMillis เพื่อช่วย
  connectionTimeoutMillis: 5000,
  keepAlive: true,
  family: 4,
});

module.exports = pool;
