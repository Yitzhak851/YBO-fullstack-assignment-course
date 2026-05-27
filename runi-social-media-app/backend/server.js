const postRoutes = require("./routes/postRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);