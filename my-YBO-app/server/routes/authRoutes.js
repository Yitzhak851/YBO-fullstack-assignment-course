const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../db/db");
const router = express.Router();

router.post("/signup", async (req, res) => {
  // Declare input validation
  const { email, password } = req.body;
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Check email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  // TODO : maybi letter to check pasword length and complexity
  } 
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user into database
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    // Use parameterized query to prevent SQL injection
    db.query(
      sql,
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }
        res.status(201).json({
          message: "User created",
          user: {
            id: result.insertId,
            email,
          },
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/login", (req, res) => {
  // Declare input validation
  const { email, password, repeatPassword } = req.body;
  // Use parameterized query to prevent SQL injection
  const sql = "SELECT * FROM users WHERE email = ?"; 
  // Check if user exists and validate password
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    const user = results[0];
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  });
});

module.exports = router;