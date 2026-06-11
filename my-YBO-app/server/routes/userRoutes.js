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

module.exports = router;