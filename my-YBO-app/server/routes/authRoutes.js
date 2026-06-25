// my-YBO-app/server/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = name || normalizedEmail.split("@")[0];
    const profilePicture = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
      displayName
    )}`;

    const sql = `
      INSERT INTO users 
      (email, password, name, bio, profile_picture) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      normalizedEmail,
      hashedPassword,
      displayName,
      "New user",
      profilePicture,
    ]);

    res.status(201).json({
      message: "User created",
      user: {
        id: result.insertId,
        email: normalizedEmail,
        name: displayName,
        bio: "New user",
        profile_picture: profilePicture,
      },
    });
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    
    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profile_picture: user.profile_picture,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;