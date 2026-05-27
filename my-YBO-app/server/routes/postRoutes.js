const express = require("express");
const db = require("../db/db");

// Create a new router instance
const router = express.Router();

// Get all posts with pagination and optional user filter
router.get("/", (req, res) => {
  const start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 10;
  const userId = req.query.userId;

  let sql = "SELECT * FROM posts";
  const params = [];

  if (userId) {
    sql += " WHERE user_id = ?";
    params.push(userId);
  }

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(limit, start);

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


// Create a new post
router.post("/", (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({
      error: "userId, title and body are required",
    });
  }
  const sql = `
    INSERT INTO posts (user_id, title, body)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [userId, title, body], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: result.insertId,
        user_id: userId,
        title,
        body,
      },
    });
  });
});


module.exports = router;