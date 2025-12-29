require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/auth");
const reportRoutes = require("./routes/reports");
const vitalsRoutes = require("./routes/vitals");


require("./database");

const authRoutes = require("./routes/auth");

const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔴 ADD THIS LINE (INLINE VIEW SUPPORT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api", authRoutes);
app.use("/api", reportRoutes);

app.use("/api", vitalsRoutes);

app.get("/", (req, res) => {
  res.send("Digital Health Wallet Backend is running 🚀");
});


app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
