const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// POST /api/bookings
router.post('/', auth, async (req, res) => {
  const {
    event_id,
    full_name,
    email,
    phone,
    quantity,
    address,
    pickup_location,
  } = req.body;

  const user_id = req.user.id;

  try {
    // 🔎 ดึงชื่ออีเวนต์จาก event_id
    const eventResult = await pool.query('SELECT name FROM events WHERE id = $1', [event_id]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบอีเวนต์นี้' });
    }

    const event_name = eventResult.rows[0].name;

    // ✅ บันทึกลงตาราง bookings
    const insertResult = await pool.query(
      `
      INSERT INTO bookings (
        user_id, event_id, event_name, full_name, email, phone,
        quantity, address, pickup_location
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        user_id,
        event_id,
        event_name,
        full_name,
        email,
        phone,
        quantity,
        address,
        pickup_location,
      ]
    );

    res.status(201).json({ message: 'จองตั๋วสำเร็จ', booking: insertResult.rows[0] });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการจองตั๋ว' });
  }
});

// GET bookings ของผู้ใช้ที่ล็อกอิน
router.get("/user", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - user not found in request" });
    }

    // ดึง booking ของ user จาก PostgreSQL
    const result = await db.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows); // คืนข้อมูลทั้งหมดกลับไป
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
