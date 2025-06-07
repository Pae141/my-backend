const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
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
      `INSERT INTO events
        (name, date, time, location, price, ticket_quantity, booking_start, booking_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, date, time, location, price, ticket_quantity, booking_start, booking_deadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting event:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  const eventId = req.params.id;
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
      `UPDATE events SET
         name = $1,
         date = $2,
         time = $3,
         location = $4,
         price = $5,
         ticket_quantity = $6,
         booking_start = $7,
         booking_deadline = $8
       WHERE id = $9
       RETURNING *`,
      [name, date, time, location, price, ticket_quantity, booking_start, booking_deadline, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบอีเวนต์ที่ต้องการแก้ไข' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
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
      `UPDATE tickets SET
         name = $1,
         date = $2,
         time = $3,
         location = $4,
         price = $5,
         ticket_quantity = $6,
         booking_start = $7,
         booking_deadline = $8
       WHERE id = $9
       RETURNING *`,
      [name, date, time, location, price, ticket_quantity, booking_start, booking_deadline, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ต้องการแก้ไข' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
});

module.exports = router;
