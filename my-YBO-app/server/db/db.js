const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "X0f2qq64g@@",
  database: "social_app",
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
    return;
  }

  console.log("Connected to MySQL");
});

module.exports = connection;