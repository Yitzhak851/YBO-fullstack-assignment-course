// my-YBO-app/server/routes/followRoutes.js - Routes for handling follow/unfollow actions and fetching follow stats
const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.post("/:userId/follow", async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const followingId = req.params.userId;

    if (!followerId) {
      return res.status(400).json({ error: "followerId is required" });
    }

    if (Number(followerId) === Number(followingId)) {
      return res.status(400).json({ error: "User cannot follow himself" });
    }

    await db.query(
      "INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)",
      [followerId, followingId]
    );

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:userId/follow", async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const followingId = req.params.userId;

    await db.query(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId]
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId/follow-stats", async (req, res) => {
  try {
    const userId = req.params.userId;

    const [[followers]] = await db.query(
      "SELECT COUNT(*) AS count FROM follows WHERE following_id = ?",
      [userId]
    );

    const [[following]] = await db.query(
      "SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?",
      [userId]
    );

    res.json({
      followers: followers.count,
      following: following.count,
    });
  } catch (err) {
    console.error("Failed to fetch follow stats:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;