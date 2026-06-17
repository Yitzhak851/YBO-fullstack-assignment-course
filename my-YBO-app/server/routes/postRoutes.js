// my-YBO-app/server/routes/postRoutes.js

const express = require("express");
const db = require("../db/db");

const router = express.Router();

// Get all posts with pagination and optional user filter
router.get("/", async (req, res) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 10;
    const userId = req.query.userId;

    let sql = `
      SELECT 
        posts.id,
        posts.user_id,
        posts.title,
        posts.body,
        posts.created_at,
        users.name,
        users.email,
        users.profile_picture
      FROM posts
      JOIN users ON posts.user_id = users.id
    `;

    const params = [];

    if (userId) {
      sql += " WHERE posts.user_id = ?";
      params.push(userId);
    }

    sql += " ORDER BY posts.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, start);

    const [posts] = await db.query(sql, params);

    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  try {
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

    const [result] = await db.query(sql, [userId, title, body]);

    const [newPost] = await db.query(
      `
      SELECT 
        posts.id,
        posts.user_id,
        posts.title,
        posts.body,
        posts.created_at,
        users.name,
        users.email,
        users.profile_picture
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      message: "Post created successfully",
      post: newPost[0],
    });
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;