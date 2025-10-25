import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * POST /api/passengers
 * Insert or update a passenger record
 */
router.post("/", async (req, res) => {
  const { passenger_id, full_name, email, phone, passport_no, nationality, loyalty_no } = req.body;

  try {
    const sql = `
      INSERT INTO Passenger (passenger_id, full_name, email, phone, passport_no, nationality, loyalty_no)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        email = VALUES(email),
        phone = VALUES(phone),
        passport_no = VALUES(passport_no),
        nationality = VALUES(nationality),
        loyalty_no = VALUES(loyalty_no)
    `;

    await pool.query(sql, [
      passenger_id,
      full_name,
      email,
      phone,
      passport_no || null,
      nationality,
      loyalty_no || null,
    ]);

    res.json({ ok: true, msg: "Passenger saved or updated successfully." });
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

/**
 * GET /api/passengers
 * Fetch all passengers
 */
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT passenger_id, full_name, email, phone, passport_no, nationality, loyalty_no
      FROM Passenger
      ORDER BY passenger_id DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

/**
 * GET /api/passengers/:id
 * Fetch a single passenger by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Passenger WHERE passenger_id = ?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Passenger not found." });
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

export default router;
