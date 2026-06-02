// This file sets up the connection to the MySQL database 
// By using the mysql2 library

// Import the mysql2 library
const mysql = require("mysql2");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "X0f2qq64g@@",
  database: "social_app",
});

// Connect to the database and handle any connection errors
connection.connect((err) => {
  // if the connect fasiled, log an error message and the error details
  if (err) {
    console.log("Database connection failed");
    console.log(err);
    return;
  }
  // If the connection is successful, log a success message
  console.log("Connected to MySQL");
});

// Export the connection object for use in other parts of the application
module.exports = connection;