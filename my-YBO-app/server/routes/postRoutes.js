// my-YBO-app/server/routes/postRoutes.js - This file defines the routes for handling post-related operations such as fetching posts and creating new posts. 
// It uses Express.js to create a router and interacts with the database to perform CRUD operations on the posts table. 
// The routes include pagination and optional filtering by user ID when fetching posts, and validation when creating new posts.

const express = require("express");
const db = require("../db/db");

// Create a new router instance
const router = express.Router();

// Get all posts with pagination and optional user filter
router.get("/", async (req, res) => {
  try {
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

    const [results] = await db.query(sql, params);

    res.json(results);
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

    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: result.insertId,
        user_id: userId,
        title,
        body,
      },
    });
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;