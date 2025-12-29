const express = require("express");
const db = require("../database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/vitals
 * Add a vital record
 */
router.post("/vitals", authMiddleware, (req, res) => {
  const { vital_type, value, systolic, diastolic, date } = req.body;

  if (!vital_type || !date) {
    return res.status(400).json({
      message: "Vital type and date are required",
    });
  }

  const query = `
    INSERT INTO vitals (user_id, vital_type, value, systolic, diastolic, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      req.user.userId,
      vital_type,
      value || null,        // used for Sugar / HR
      systolic || null,     // used for BP
      diastolic || null,    // used for BP
      date,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Failed to add vitals",
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
 * Optional filters: vital_type, start_date, end_date
 */
router.get("/vitals", authMiddleware, (req, res) => {
  const { vital_type, start_date, end_date } = req.query;

  let query = `
    SELECT vital_type, value, systolic, diastolic, date
    FROM vitals
    WHERE user_id = ?
  `;

  const params = [req.user.userId];

  if (vital_type) {
    query += " AND vital_type = ?";
    params.push(vital_type);
  }

  if (start_date && end_date) {
    query += " AND date BETWEEN ? AND ?";
    params.push(start_date, end_date);
  }

  query += " ORDER BY date ASC";

  db.all(query, params, (err, vitals) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch vitals",
      });
    }

    res.json({
      vitals,
    });
  });
});



module.exports = router;
