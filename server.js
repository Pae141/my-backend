require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://pae141.github.io'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// routes
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const bookingRoutes = require('./routes/bookings');

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/test', (req, res) => {
  res.send('Test route is working');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
