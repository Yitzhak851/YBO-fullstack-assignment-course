// my-YBO-app/server/routes/postRoutes.js

const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 10;
    const userId = req.query.userId;
    const followingOnly = req.query.followingOnly === "true";
    const currentUserId = req.query.currentUserId;

    let sql = `
      SELECT posts.*, users.email, users.name, users.profile_picture
      FROM posts
      JOIN users ON posts.user_id = users.id
    `;

    const params = [];

    if (followingOnly && currentUserId && !userId) {
      sql += `
        JOIN follows 
        ON follows.following_id = posts.user_id
        WHERE follows.follower_id = ?
      `;
      params.push(currentUserId);
    }

    if (userId) {
      sql += ` WHERE posts.user_id = ?`;
      params.push(userId);
    }

    sql += ` ORDER BY posts.id DESC LIMIT ? OFFSET ?`;
    params.push(limit, start);

    const [posts] = await db.query(sql, params);

    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, title, body, image_url } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        error: "userId, title and body are required",
      });
    }

    const sql = `
      INSERT INTO posts (user_id, title, body, image_url)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      userId,
      title,
      body,
      image_url || null,
    ]);

    const [newPost] = await db.query(
      `
      SELECT 
        posts.id,
        posts.user_id,
        posts.title,
        posts.body,
        posts.image_url,
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