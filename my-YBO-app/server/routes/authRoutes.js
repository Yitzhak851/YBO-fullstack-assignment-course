// This file contains the routes for user authentication (signup and login)
const express = require("express");  // declare express to create the router and handle HTTP requests
const bcrypt = require("bcrypt");   // use bcrypt library ==> for hashing passwords

// Import database connection
const db = require("../db/db");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const displayName = name || email.split("@")[0];

    const profilePicture =
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`;

    const sql = `
      INSERT INTO users 
      (email, password, name, bio, profile_picture) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        email,
        hashedPassword,
        displayName,
        "New user",
        profilePicture,
      ],
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
            name: displayName,
            bio: "New user",
            profile_picture: profilePicture,
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
  const { email, password, repeatPassword } = req.body;  // Declare input validation
  const sql = "SELECT * FROM users WHERE email = ?";   // Use parameterized query to prevent SQL injection
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

router.get("/login", (req, res) => {
  res.json({ message: "This is a protected route", });
});

module.exports = router;