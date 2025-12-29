require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");

const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const vitalsRoutes = require("./routes/vitals");

require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

/* ✅ CORS – allow all users / all frontends */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ Middleware */
app.use(express.json());

/* ✅ Static uploads */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ✅ Routes */
app.use("/api", authRoutes);
app.use("/api", reportRoutes);
app.use("/api", vitalsRoutes);

/* ✅ Health check */
app.get("/", (req, res) => {
  res.send("Digital Health Wallet Backend is running 🚀");
});

/* ✅ Protected route */
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

/* ✅ Start server */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
