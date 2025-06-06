require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // เปลี่ยนเป็น URL frontend ของคุณ
  credentials: true, // สำคัญต้องมีนี้เพื่อรับส่ง cookie
}));
app.use(cookieParser());
app.use(express.json());

// Middleware ตรวจสอบ token และดึง user info
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = require('jsonwebtoken').verify(token, 'your_jwt_secret_key');
    req.user = decoded; // userId, username จาก token
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ตัวอย่าง route ที่ต้องการล็อกอิน
app.get('/api/users/profile', authMiddleware, (req, res) => {
  // เรียก controller user profile ได้เลย
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
