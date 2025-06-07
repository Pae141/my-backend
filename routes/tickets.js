const express = require('express');
const router = express.Router();
const pool = require('../db');

// ดึง events ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// เพิ่ม event ใหม่
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

// อัปเดต event
router.put('/:id', async (req, res) => {
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
      [name, date, time, location, price, ticket_quantity, booking_start, booking_deadline, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ต้องการแก้ไข' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
});

// ลบ event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ต้องการลบ' });
    }
    res.json({ message: 'ลบรายการสำเร็จ', deleted: result.rows[0] });
  } catch (error) {
    console.error('Error deleting events:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
});

router.get('/:id/tickets-available', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        e.ticket_quantity - COALESCE(SUM(b.quantity), 0) AS available
      FROM
        events e
      LEFT JOIN
        bookings b ON e.id = b.event_id
      WHERE
        e.id = $1
      GROUP BY
        e.ticket_quantity
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบอีเว้นต์นี้' });
    }

    res.json({ available: result.rows[0].available });
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบตั๋ว' });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Received id:', id);
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    console.log('Query result:', result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบอีเว้นต์นี้' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลอีเว้นต์' });
  }
});
