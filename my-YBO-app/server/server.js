// my-YBO-app/server/server.js - Main server file for the backend Express application
const express = require("express");
const cors = require("cors");

// Initialize Express app
const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/followRoutes"); // conect between followers to the server.js file

const healthRoutes = require("./routes/healthRoutes");




// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/follows", followRoutes);
app.use("/api", healthRoutes);

// Start the server
const PORT = 5000;

// =========TESTS========
// Test route
app.get("/", (req, res) => { res.send("Backend is running"); });
// Test route
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});