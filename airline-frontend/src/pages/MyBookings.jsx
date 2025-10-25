// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import { API, getErr } from "../lib/api";

export default function MyBookings() {
  const [passenger_id, setPassengerId] = useState(1002);
  const [rows, setRows] = useState([]);   // always keep as array to avoid .map crash
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeToArray = (data) =>
    Array.isArray(data) ? data : Array.isArray(data?.rows) ? data.rows : [];

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await API.get(`/tickets/by-passenger/${passenger_id}`);
      setRows(normalizeToArray(data));
    } catch (e) {
      setErr(getErr(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmTicket = async (ticket_id) => {
    setErr("");
    try {
      await API.post("/tickets/confirm", { ticket_id });
      await load();
    } catch (e) {
      setErr(getErr(e));
    }
  };

  const cancelTicket = async (ticket_id) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    setErr("");
    try {
      const { data } = await API.post("/tickets/cancel", { ticket_id });
      // Optional UX: toast/alert
      alert(data?.message || "Ticket cancelled successfully.");
      await load();
    } catch (e) {
      setErr(getErr(e));
    }
  };

  return (
    <div>
      <h2>My Bookings</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>Passenger ID</label>
        <input
          type="number"
          value={passenger_id}
          onChange={(e) => setPassengerId(Number(e.target.value))}
          style={{ width: 140 }}
        />
        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {err && <p style={{ color: "red", marginTop: 8 }}>{err}</p>}

      <table style={{ marginTop: 12, width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Schedule</th>
            <th>Class</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Amount</th>
            <th>Seat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((r) => (
              <tr key={r.ticket_id}>
                <td>{r.ticket_id}</td>
                <td>{r.schedule_id}</td>
                <td>{r.selected_class}</td>
                <td>{r.status}</td>
                <td>{r.payment_status || "N/A"}</td>
                <td>{r.amount ?? "-"}</td>
                <td>{r.seat_id ?? "-"}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  {r.status !== "CONFIRMED" ? (
                    <button onClick={() => confirmTicket(r.ticket_id)}>
                      Confirm
                    </button>
                  ) : (
                    <span style={{ color: "gray" }}>—</span>
                  )}

                  {r.status !== "CANCELLED" &&
                  r.status !== "FLOWN" &&
                  r.status !== "CHECKED_IN" ? (
                    <button onClick={() => cancelTicket(r.ticket_id)}>
                      Cancel
                    </button>
                  ) : (
                    <span style={{ color: "gray" }}>—</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">
                {loading
                  ? "Loading..."
                  : err
                  ? "Could not load bookings. Check backend and API URL."
                  : "No bookings yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
