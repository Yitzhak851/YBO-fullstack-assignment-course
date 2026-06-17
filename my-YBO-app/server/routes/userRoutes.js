// my-YBO-app/server/routes/userRoutes.js - This file defines the routes for user-related operations in the backend server. 
// It includes routes for fetching a list of users and fetching a specific user's profile along with their posts. The routes interact with the database to retrieve the necessary information and return it as JSON responses. Error handling is included to manage any issues that arise during database queries.

const express = require("express");
const db = require("../db/db");
const router = express.Router();

// Get all users with pagination and optional search
router.get("/", async (req, res) => {
  try {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    let sql = `
      SELECT
      u.id,
      u.email,
      u.name,
      u.bio,
      u.profile_picture,
      u.created_at,
      
      (
        SELECT COUNT(*)
        FROM follows f
        WHERE f.following_id = u.id
      ) AS followers,

      (
        SELECT COUNT(*)
        FROM follows f
        WHERE f.follower_id = u.id
      ) AS following

    FROM users u
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

// Get a specific user's profile and their posts
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      `
      SELECT
        u.id,
        u.email,
        u.name,
        u.bio,
        u.profile_picture,
        u.created_at,

        (
          SELECT COUNT(*)
          FROM follows f
          WHERE f.following_id = u.id
        ) AS followers,

        (
          SELECT COUNT(*)
          FROM follows f
          WHERE f.follower_id = u.id
        ) AS following

      FROM users u
      WHERE u.id = ?
    `,
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
      followers: users[0].followers,
      following: users[0].following,
    });

  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;