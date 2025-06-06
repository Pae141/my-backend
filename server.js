require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://pae141.github.io'];

app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS Origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));



app.use(cookieParser());
app.use(express.json());

// ✅ เชื่อมต่อเส้นทาง users
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// ✅ Middleware ตรวจสอบ token
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ (ถ้ายังไม่มีใน controller) เพิ่ม route ทดสอบดึงข้อมูล user จาก token
app.get('/api/users/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'User profile',
    user: req.user
  });
});

app.get('/test', (req, res) => {
  res.send('Test route is working');
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
