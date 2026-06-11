const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    let sql = `
      SELECT id, email, name, bio, profile_picture, created_at
      FROM users
    `;

    const params = [];

    if (search) {
      sql += " WHERE name LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(limit, start);

    const [users] = await db.query(sql, params);

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT id, email, name, bio, profile_picture, created_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [posts] = await db.query(
      "SELECT * FROM posts WHERE user_id = ? ORDER BY id DESC",
      [id]
    );

    res.json({
      user: users[0],
      posts,
    });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;