const db = require("../db");
const bcrypt = require('bcryptjs');
const isProduction = process.env.NODE_ENV === 'production';

const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};



const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send("Invalid username or password");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,     // ✅ ตอน sign ต้องใช้ secret เดียวกับ verify
      { expiresIn: '1h' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // << สำคัญมาก
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.register = async (req, res) => {
  const { username, password, name, email,last_name, birth_date, phone, gender } = req.body;

  if (!username || !password || !name || !email
    || !last_name || !birth_date || !phone || !gender
  ) {
    return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password, name, email,last_name, birth_date, phone, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [username, hashedPassword, name, email,last_name, birth_date, phone, gender]
    );

    return res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.logout = (req, res) => {
  console.log("Logout called");
  res.cookie("token", "", {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  expires: new Date(0), // ให้หมดอายุทันที
  path: "/",
});
res.status(200).json({ message: "Logged out" });
};



exports.profile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(`
      SELECT 
        id,
        username,
        name,
        email,
        last_name,
        birth_date,
        phone,
        gender
        
      FROM users
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


exports.userprofile = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows); // rows ไม่ใช่ row
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
};


  exports.updateuser = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
  }

  const userId = req.user.userId;
  const { name, last_name, email, phone, birth_date, gender } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET name=$1, last_name=$2, email=$3, phone=$4, birth_date=$5, gender=$6 WHERE id=$7 RETURNING *`,
      [name, last_name, email, phone, birth_date, gender, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Update successful", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.delete = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);  // เปลี่ยน pool เป็น db
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะลบผู้ใช้' });
  }
};

