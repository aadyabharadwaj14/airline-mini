import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/flights/schedules
 * Fetch all flight schedules with route + international flag
 */
router.get("/schedules", async (_req, res) => {
  try {
    const sql = `
      SELECT 
        fs.schedule_id,
        fs.flight_no,
        fs.departure_time,
        fs.arrival_time,
        fs.status,
        fs.days_of_week,
        f.origin_code,
        f.dest_code,
        f.is_international,
        calc_duration_hours(fs.departure_time, fs.arrival_time) AS duration_hours
      FROM Flight_Schedule fs
      JOIN Flight f ON fs.flight_no = f.flight_no
      ORDER BY fs.departure_time ASC
      LIMIT 200;
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

/**
 * POST /api/flights/schedules
 * Create a new flight schedule
 * duration_minutes is auto-filled by trigger trg_auto_duration
 */
router.post("/schedules", async (req, res) => {
  try {
    const {
      schedule_id,
      flight_no,
      departure_time,
      arrival_time,
      days_of_week,
      status = "PLANNED",
      aircraft_id = null,
    } = req.body;

    // validate minimal required fields
    if (!schedule_id || !flight_no || !departure_time || !arrival_time || !days_of_week) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const sql = `
      INSERT INTO Flight_Schedule
        (schedule_id, flight_no, departure_time, arrival_time, duration_minutes, days_of_week, status, aircraft_id)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?);
    `;

    await pool.query(sql, [
      schedule_id,
      flight_no,
      departure_time,
      arrival_time,
      days_of_week,
      status,
      aircraft_id,
    ]);

    res.json({ ok: true, msg: "Flight schedule added successfully." });
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});

export default router;
