const express = require("express");
const db = require("../database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/vitals
 * Add a vital record
 */
router.post("/vitals", authMiddleware, (req, res) => {
  const { vital_type, value, date } = req.body;

  if (!vital_type || !value || !date) {
    return res.status(400).json({
      message: "Vital type, value, and date are required",
    });
  }

  const query = `
    INSERT INTO vitals (user_id, vital_type, value, date)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    query,
    [req.user.userId, vital_type, value, date],
    function (err) {
      if (err) {
        console.error("Vitals insert error:", err.message);
        return res.status(500).json({
          message: "Failed to add vital",
        });
      }

      res.status(201).json({
        message: "Vital added successfully",
        vitalId: this.lastID,
      });
    }
  );
});

/**
 * GET /api/vitals
 * Get vitals for logged-in user
 */
router.get("/vitals", authMiddleware, (req, res) => {
  const { vital_type } = req.query;

  let query = `
    SELECT vital_type, value, date
    FROM vitals
    WHERE user_id = ?
  `;

  const params = [req.user.userId];

  if (vital_type) {
    query += " AND vital_type = ?";
    params.push(vital_type);
  }

  query += " ORDER BY date ASC";

  db.all(query, params, (err, vitals) => {
    if (err) {
      console.error("Fetch vitals error:", err.message);
      return res.status(500).json({
        message: "Failed to fetch vitals",
      });
    }

    res.json({ vitals });
  });
});

module.exports = router;
