require('dotenv').config();  // ต้องอยู่บรรทัดแรกก่อนใช้ process.env

const { Pool } = require('pg');

console.log('PGHOST:', process.env.PGHOST);
console.log('PGPORT:', process.env.PGPORT);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? '***' : 'empty');
console.log('PGDATABASE:', process.env.PGDATABASE);

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
