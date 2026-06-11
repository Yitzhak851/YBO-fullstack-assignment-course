const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.get("/", (req, res) => {
  const start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  
  const sql = `
    SELECT id, email
    FROM users
    WHERE email LIKE ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(
    sql,
    [`%${search}%`, limit, start],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(results);
    }
  );
});

module.exports = router;