const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database");
const jwt = require("jsonwebtoken");
// Secret key (later we can move to .env)
const JWT_SECRET = process.env.JWT_SECRET

const router = express.Router();

/**
 * POST /api/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user into database
    const query =
      "INSERT INTO users (email, password) VALUES (?, ?)";

    db.run(query, [email, hashedPassword], function (err) {
      if (err) {
        // Duplicate email case
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({
            message: "User already exists",
          });
        }

        return res.status(500).json({
          message: "Registration failed",
        });
      }

      // 4. Success response
      res.status(201).json({
        message: "User registered successfully",
        userId: this.lastID,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/**
 * POST /api/login
 * Login user
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // 2. Find user
  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Success response
    res.json({
      message: "Login successful",
      token,
    });
  });
});

module.exports = router;
