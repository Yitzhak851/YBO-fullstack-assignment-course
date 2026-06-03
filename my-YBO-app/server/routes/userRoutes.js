// my-YBO-app/server/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// GET /api/users
// list of users + pagination + search
router.get("/", async (req, res) => {
  const start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  try {
    const [users] = await db.query(
      `
      SELECT id, email, name, bio, profile_picture
      FROM users
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY id
      LIMIT ? OFFSET ?
      `,
      [`%${search}%`, `%${search}%`, limit, start]
    );

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users",
      details: err.message,
    });
  }
});

// GET /api/users/:id
// specific user profile + his posts + followers/following count
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      `
      SELECT id, email, name, bio, profile_picture
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [posts] = await db.query(
      `
      SELECT *
      FROM posts
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [id]
    );

    const [[followers]] = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM follows
      WHERE following_id = ?
      `,
      [id]
    );

    const [[following]] = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM follows
      WHERE follower_id = ?
      `,
      [id]
    );

    res.json({
      user: users[0],
      posts,
      followers: followers.count,
      following: following.count,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      message: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;