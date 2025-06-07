const express = require('express');
const router = express.Router();
const pool = require('../db'); // หรือ path ที่คุณใช้เชื่อมกับ PostgreSQL

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
     res.json({ message: 'Ticket route is working!' });
  const {
    name,
    date,
    time,
    location,
    price,
    ticket_quantity,
    booking_start,
    booking_deadline,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tickets 
        (name, date, time, location, price, ticket_quantity, booking_start, booking_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, date, time, location, price, ticket_quantity, booking_start, booking_deadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting ticket:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
