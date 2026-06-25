// my-YBO-app/db/db.js - Sets up the connection to the MySQL database using mysql2 library
// This file sets up the connection to the MySQL database
// By using the mysql2 library with Promise support

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "X0f2qq64g@@",
  database: "social_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL");
    connection.release();
  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
  }
}

testConnection();

module.exports = db;