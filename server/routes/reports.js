const express = require("express");
const multer = require("multer");
const db = require("../database");
const authMiddleware = require("../middleware/auth");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* =========================
   Multer Configuration
========================= */

const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

/* =========================
   Upload Report
========================= */

router.post(
  "/reports/upload",
  authMiddleware,
  upload.single("report"),
  (req, res) => {

    // 🔒 BLOCK VIEWER (ADD THIS HERE)
    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Read-only access",
      });
    }

    const { report_type, report_date, associated_vital } = req.body;

    if (!req.file || !report_type || !report_date || !associated_vital) {
      return res.status(400).json({
        message: "File, report type, date, and associated vital are required",
      });
    }

    const query = `
      INSERT INTO reports (user_id, filename, report_type, report_date, associated_vital)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        req.user.userId,
        req.file.filename,
        report_type,
        report_date,
        associated_vital,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: "Failed to upload report",
          });
        }

        res.status(201).json({
          message: "Report uploaded successfully",
          reportId: this.lastID,
        });
      }
    );
  }
);


/* =========================
   Get My Reports
========================= */

router.get("/reports", authMiddleware, (req, res) => {
  const { report_type, report_date } = req.query;

  let query = `
    SELECT id, filename, report_type, report_date
    FROM reports
    WHERE user_id = ?
  `;
  const params = [req.user.userId];

  if (report_type) {
    query += " AND report_type = ?";
    params.push(report_type);
  }

  if (report_date) {
    query += " AND report_date = ?";
    params.push(report_date);
  }

  query += " ORDER BY report_date DESC";

  db.all(query, params, (err, reports) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch reports",
      });
    }

    res.json({ reports });
  });
});

/* =========================
   Download Report
========================= */

router.get(
  "/reports/:id/download",
  authMiddleware,
  (req, res) => {
    const reportId = req.params.id;

    const query = `
      SELECT filename
      FROM reports
      WHERE id = ? AND user_id = ?
    `;

    db.get(query, [reportId, req.user.userId], (err, report) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch report" });
      }

      if (!report) {
        return res.status(404).json({
          message: "Report not found or access denied",
        });
      }

      const filePath = path.join(uploadDir, report.filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message: "File not found on server",
        });
      }

     
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${report.filename}"`
      );

      res.sendFile(filePath);
    });
  }
);




module.exports = router;
