import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

/** Book ticket via stored procedure */
router.post("/book", async (req, res) => {
  const { passenger_id, schedule_id, seat_class, amount } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.query("SET @new_ticket_id = 0");
    await conn.query("CALL book_ticket(?, ?, ?, ?, @new_ticket_id)", [
      passenger_id, schedule_id, seat_class, amount
    ]);
    const [r] = await conn.query("SELECT @new_ticket_id AS ticket_id");
    res.json(r[0]); // { ticket_id: ... }
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  } finally {
    conn.release();
  }
});

/** Confirm ticket: mark payment SUCCESS then set ticket CONFIRMED (trigger validates) */
router.post("/confirm", async (req, res) => {
  const { ticket_id } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("UPDATE Payment SET status='SUCCESS' WHERE ticket_id = ?", [ticket_id]);
    await conn.query("UPDATE Ticket SET status='CONFIRMED' WHERE ticket_id = ?", [ticket_id]);
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.sqlMessage || e.message });
  } finally {
    conn.release();
  }
});
// Cancel a ticket via stored procedure
router.post("/cancel", async (req, res) => {
  const { ticket_id } = req.body;
  if (!ticket_id) return res.status(400).json({ error: "Missing ticket_id." });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("CALL cancel_ticket_simple(?)", [ticket_id]);
    res.json(rows[0][0]); // sends back {ticket_id, message}
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  } finally {
    conn.release();
  }
});


/** List bookings for a passenger (return ARRAY) */
// List bookings for a passenger (return ARRAY)
router.get("/by-passenger/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid); // value for the ? placeholder

    const sql = `
      SELECT t.ticket_id, t.schedule_id, t.selected_class, t.status, t.booking_date, t.seat_id,
             p.status AS payment_status, p.amount
      FROM Ticket t
      LEFT JOIN Payment p ON p.ticket_id = t.ticket_id
      WHERE t.passenger_id = ?
      ORDER BY t.booking_date DESC
    `;

    // IMPORTANT: pass [pid] as the second argument so the ? gets a value
    const [rows] = await pool.query(sql, [pid]);
    res.json(rows); // return an array
  } catch (e) {
    res.status(400).json({ error: e.sqlMessage || e.message });
  }
});


export default router;
