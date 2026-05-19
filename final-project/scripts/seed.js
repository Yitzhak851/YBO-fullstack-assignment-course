const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "socialite.db");
const DEMO_PASSWORD = "password123";

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

function usernameFrom(person, index) {
  const base = `${person.name.first}${person.name.last}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 14);
  return `${base || "creator"}${index + 1}`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API request failed: ${url}`);
  return response.json();
}

async function main() {
  const [peopleData, postsData] = await Promise.all([
    fetchJson("https://randomuser.me/api/?results=12&seed=socialite-course"),
    fetchJson("https://dummyjson.com/posts?limit=36")
  ]);

  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 12);
  const insertUser = db.prepare(
    "INSERT INTO users (username, password_hash, name, bio, profile_picture, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertPost = db.prepare("INSERT INTO posts (user_id, body_html, image_path, created_at) VALUES (?, ?, ?, ?)");
  const insertFollow = db.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)");

  const reset = db.transaction(() => {
    db.prepare("DELETE FROM follows").run();
    db.prepare("DELETE FROM posts").run();
    db.prepare("DELETE FROM users").run();
  });

  const seed = db.transaction(() => {
    reset();
    const users = peopleData.results.map((person, index) => {
      const username = usernameFrom(person, index);
      const name = `${person.name.first} ${person.name.last}`;
      const bio = [
        "Coffee-fueled visual storyteller.",
        "Sharing small moments, big colors, and useful chaos.",
        "Course project demo account from RandomUser."
      ][index % 3];
      const createdAt = new Date(Date.now() - (index + 3) * 86400000).toISOString();
      const result = insertUser.run(username, passwordHash, name, bio, person.picture.large, createdAt);
      return { id: result.lastInsertRowid, username, name };
    });

    let postIndex = 0;
    for (const user of users) {
      for (let count = 0; count < 3; count += 1) {
        const source = postsData.posts[postIndex % postsData.posts.length];
        const title = escapeHtml(source.title);
        const body = escapeHtml(source.body);
        const html = count === 0
          ? `<p><strong>${title}</strong></p><p>${body}</p>`
          : `<p><em>${title}</em></p><p>${body}</p>`;
        const imagePath = `https://picsum.photos/seed/socialite-${user.username}-${count}/900/700`;
        const createdAt = new Date(Date.now() - (postIndex + 1) * 3600000).toISOString();
        insertPost.run(user.id, html, imagePath, createdAt);
        postIndex += 1;
      }
    }

    for (let index = 0; index < users.length; index += 1) {
      const follower = users[index];
      const first = users[(index + 1) % users.length];
      const second = users[(index + 3) % users.length];
      insertFollow.run(follower.id, first.id);
      insertFollow.run(follower.id, second.id);
    }

    return users;
  });

  const users = seed();
  console.log(`Seeded ${users.length} fake users and ${users.length * 3} fake posts.`);
  console.log(`Demo password for every fake user: ${DEMO_PASSWORD}`);
  console.log(`Try logging in as: ${users[0].username}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => db.close());
