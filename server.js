

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);  // Your API routes

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React app in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app (build folder)
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  // All other routes should serve the React app's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// API routes for videos
app.use("/api/videos", require("./routes/videoRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
