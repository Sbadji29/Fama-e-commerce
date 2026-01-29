const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for: ${username}`);

  try {
    const { rows } = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    
    if (rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(`User found. Password match: ${isMatch}`);

    if (admin && isMatch) {
      res.json({
        id: admin.id,
        username: admin.username,
        token: generateToken(admin.id, admin.username),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const verifyToken = async (req, res) => {
    // If middleware passed, token is valid
    res.json({ valid: true, user: req.user });
};

module.exports = { loginAdmin, verifyToken };
