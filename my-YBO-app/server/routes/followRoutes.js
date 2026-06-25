// my-YBO-app/server/routes/followRoutes.js - Routes for handling follow/unfollow actions and fetching follow stats

const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { follower_id, following_id } = req.body;

    console.log("FOLLOW BODY:", req.body);

    if (!follower_id || !following_id) {
      return res.status(400).json({ error: "Missing follower_id or following_id" });
    }

    if (Number(follower_id) === Number(following_id)) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    await db.query(
      "INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)",
      [follower_id, following_id]
    );

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { follower_id, following_id } = req.body;

    await db.query(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
      [follower_id, following_id]
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/check", async (req, res) => {
  try {
    const { follower_id, following_id } = req.query;

    const [rows] = await db.query(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [follower_id, following_id]
    );

    res.json({ isFollowing: rows.length > 0 });
  } catch (err) {
    console.error("Check follow failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;