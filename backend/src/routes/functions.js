import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/functions/duration?dep=...&arr=...
 * Calls calc_duration_hours(dep, arr)
 */
router.get("/duration", async (req, res) => {
  const { dep, arr } = req.query;
  if (!dep || !arr) return res.status(400).json({ error: "Missing dep/arr datetime." });

  try {
    const [rows] = await pool.query(
      "SELECT calc_duration_hours(?, ?) AS duration_hours",
      [dep, arr]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

/**
 * GET /api/functions/price?schedule_id=...&class=...&base=...
 * Calls calc_total_price(schedule_id, class, base)
 */
router.get("/price", async (req, res) => {
  const { schedule_id, seat_class, base } = req.query;
  if (!schedule_id || !seat_class || !base)
    return res.status(400).json({ error: "Missing parameters." });

  try {
    const [rows] = await pool.query(
      "SELECT calc_total_price(?, ?, ?) AS total_price",
      [schedule_id, seat_class, base]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

export default router;
