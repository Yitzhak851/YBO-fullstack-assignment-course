const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sanitizeHtml = require("sanitize-html");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");
const DIST_DIR = path.join(ROOT, "dist");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "socialite.db"));
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  profile_picture TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  body_html TEXT NOT NULL,
  image_path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const safeExt = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed."));
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-socialite-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 }
  })
);
app.use(express.static(path.join(ROOT, "public")));
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio || "",
    profilePicture: row.profile_picture
  };
}

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Please log in first." });
  next();
}

function currentUser(req) {
  if (!req.session.userId) return null;
  return db.prepare("SELECT id, username, name, bio, profile_picture FROM users WHERE id = ?").get(req.session.userId);
}

function cleanPostHtml(html) {
  return sanitizeHtml(html || "", {
    allowedTags: ["b", "strong", "i", "em", "a", "p", "br", "ul", "ol", "li"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" })
    }
  }).trim();
}

function mapPost(row) {
  return {
    id: row.id,
    bodyHtml: row.body_html,
    imagePath: row.image_path,
    createdAt: row.created_at,
    author: {
      id: row.user_id,
      username: row.username,
      name: row.name,
      profilePicture: row.profile_picture
    }
  };
}

app.get("/api/me", (req, res) => {
  res.json({ user: publicUser(currentUser(req)) });
});

app.patch("/api/me", requireAuth, upload.single("profilePicture"), (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const bio = String(body.bio || "").trim();
  if (!name) return res.status(400).json({ error: "Name is required." });

  const current = currentUser(req);
  const picture = req.file ? `/uploads/${req.file.filename}` : current.profile_picture;
  db.prepare("UPDATE users SET name = ?, bio = ?, profile_picture = ? WHERE id = ?").run(name, bio, picture, req.session.userId);
  res.json({ user: publicUser(currentUser(req)) });
});

app.post("/api/signup", upload.single("profilePicture"), async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const name = String(req.body.name || "").trim();
  const bio = String(req.body.bio || "").trim();
  const password = String(req.body.password || "");

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ error: "Username must be 3-20 characters: letters, numbers, or underscore." });
  }
  if (!name || password.length < 6) return res.status(400).json({ error: "Name and a 6+ character password are required." });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const picture = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db
      .prepare("INSERT INTO users (username, password_hash, name, bio, profile_picture) VALUES (?, ?, ?, ?, ?)")
      .run(username, passwordHash, name, bio, picture);
    req.session.userId = result.lastInsertRowid;
    res.status(201).json({ user: publicUser(currentUser(req)) });
  } catch (error) {
    res.status(400).json({ error: "That username is already taken." });
  }
});

app.post("/api/login", async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

app.post("/api/logout", requireAuth, (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/users/search", requireAuth, (req, res) => {
  const query = `%${String(req.query.q || "").trim().toLowerCase()}%`;
  const users = db
    .prepare("SELECT id, username, name, bio, profile_picture FROM users WHERE username LIKE ? ORDER BY username LIMIT 12")
    .all(query)
    .map(publicUser);
  res.json({ users });
});

app.get("/api/users/explore", requireAuth, (req, res) => {
  const users = db
    .prepare(
      `SELECT
        users.id,
        users.username,
        users.name,
        users.bio,
        users.profile_picture,
        COUNT(DISTINCT follower_links.follower_id) AS follower_count,
        COUNT(DISTINCT following_links.following_id) AS following_count,
        CASE WHEN my_follow.following_id IS NULL THEN 0 ELSE 1 END AS is_following
       FROM users
       LEFT JOIN follows AS follower_links ON follower_links.following_id = users.id
       LEFT JOIN follows AS following_links ON following_links.follower_id = users.id
       LEFT JOIN follows AS my_follow ON my_follow.follower_id = ? AND my_follow.following_id = users.id
       WHERE users.id != ?
       GROUP BY users.id
       ORDER BY is_following ASC, follower_count DESC, users.created_at DESC
       LIMIT 30`
    )
    .all(req.session.userId, req.session.userId)
    .map((user) => ({
      ...publicUser(user),
      followerCount: user.follower_count,
      followingCount: user.following_count,
      isFollowing: Boolean(user.is_following)
    }));

  res.json({ users });
});

app.get("/api/users/:username", requireAuth, (req, res) => {
  const profile = db
    .prepare("SELECT id, username, name, bio, profile_picture FROM users WHERE username = ?")
    .get(String(req.params.username).toLowerCase());
  if (!profile) return res.status(404).json({ error: "User not found." });

  const followerCount = db.prepare("SELECT COUNT(*) AS count FROM follows WHERE following_id = ?").get(profile.id).count;
  const followingCount = db.prepare("SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?").get(profile.id).count;
  const isFollowing = Boolean(
    db.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").get(req.session.userId, profile.id)
  );
  const posts = db
    .prepare(
      `SELECT posts.*, users.username, users.name, users.profile_picture
       FROM posts JOIN users ON users.id = posts.user_id
       WHERE users.id = ?
       ORDER BY posts.created_at DESC, posts.id DESC
       LIMIT 30`
    )
    .all(profile.id)
    .map(mapPost);

  res.json({ profile: publicUser(profile), followerCount, followingCount, isFollowing, posts });
});

app.post("/api/users/:username/follow", requireAuth, (req, res) => {
  const target = db.prepare("SELECT id FROM users WHERE username = ?").get(String(req.params.username).toLowerCase());
  if (!target) return res.status(404).json({ error: "User not found." });
  if (target.id === req.session.userId) return res.status(400).json({ error: "You cannot follow yourself." });
  db.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").run(req.session.userId, target.id);
  res.json({ ok: true });
});

app.delete("/api/users/:username/follow", requireAuth, (req, res) => {
  const target = db.prepare("SELECT id FROM users WHERE username = ?").get(String(req.params.username).toLowerCase());
  if (!target) return res.status(404).json({ error: "User not found." });
  db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").run(req.session.userId, target.id);
  res.json({ ok: true });
});

app.get("/api/feed", requireAuth, (req, res) => {
  const mode = req.query.mode === "following" ? "following" : "global";
  const limit = Math.min(Number(req.query.limit) || 6, 20);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const sort = req.query.sort === "oldest" ? "ASC" : "DESC";
  const author = String(req.query.author || "").trim().toLowerCase();
  const type = ["images", "text", "links"].includes(req.query.type) ? req.query.type : "all";
  const dateRange = ["today", "week", "month"].includes(req.query.dateRange) ? req.query.dateRange : "all";
  const filters = [];
  const params = [];

  if (mode === "following") {
    filters.push("posts.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)");
    params.push(req.session.userId);
  }

  if (author) {
    filters.push("(LOWER(users.username) LIKE ? OR LOWER(users.name) LIKE ?)");
    params.push(`%${author}%`, `%${author}%`);
  }

  if (type === "images") filters.push("posts.image_path IS NOT NULL");
  if (type === "text") filters.push("posts.image_path IS NULL");
  if (type === "links") filters.push("posts.body_html LIKE '%<a %'");

  if (dateRange === "today") filters.push("datetime(posts.created_at) >= datetime('now', '-1 day')");
  if (dateRange === "week") filters.push("datetime(posts.created_at) >= datetime('now', '-7 days')");
  if (dateRange === "month") filters.push("datetime(posts.created_at) >= datetime('now', '-30 days')");

  const base = `
    SELECT posts.*, users.username, users.name, users.profile_picture
    FROM posts JOIN users ON users.id = posts.user_id`;
  const where = filters.length ? ` WHERE ${filters.join(" AND ")}` : "";
  const rows = db
    .prepare(`${base}${where} ORDER BY posts.created_at ${sort}, posts.id ${sort} LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);
  res.json({ posts: rows.map(mapPost), nextOffset: offset + rows.length, hasMore: rows.length === limit });
});

app.post("/api/posts", requireAuth, upload.single("image"), (req, res) => {
  const html = cleanPostHtml(req.body.bodyHtml);
  if (!html && !req.file) return res.status(400).json({ error: "Write something or add an image." });
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db
    .prepare("INSERT INTO posts (user_id, body_html, image_path) VALUES (?, ?, ?)")
    .run(req.session.userId, html, imagePath);
  const row = db
    .prepare(
      `SELECT posts.*, users.username, users.name, users.profile_picture
       FROM posts JOIN users ON users.id = posts.user_id
       WHERE posts.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ post: mapPost(row) });
});

app.use((_req, res) => {
  const appShell = fs.existsSync(path.join(DIST_DIR, "index.html"))
    ? path.join(DIST_DIR, "index.html")
    : path.join(ROOT, "client", "index.html");
  res.sendFile(appShell);
});

app.listen(PORT, () => {
  console.log(`InstaRUNI is running at http://localhost:${PORT}`);
});
