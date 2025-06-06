require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
})

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users')
  res.json(rows)
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...')
})
