import { useEffect, useState } from "react";
import { API, getErr } from "../lib/api";

export default function Flights() {
  const [rows, setRows] = useState([]);      // always start as array
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/flights/schedules");

        // Normalize: accept array, or {rows:[...]} shape; otherwise empty
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.rows)
          ? data.rows
          : [];

        if (!Array.isArray(normalized)) {
          throw new Error("API did not return a list.");
        }

        setRows(normalized);
      } catch (e) {
        setErr(getErr(e));
        setRows([]); // keep safe default
        console.error("Flights load error:", e);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Flight Schedules</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <table>
        <thead>
          <tr>
            <th>Schedule</th>
            <th>Flight</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Hours</th>
            <th>Status</th>
            <th>Days</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((r) => (
              <tr key={r.schedule_id}>
                <td>{r.schedule_id}</td>
                <td>{r.flight_no}</td>
                <td>{new Date(r.departure_time).toLocaleString()}</td>
                <td>{new Date(r.arrival_time).toLocaleString()}</td>
                <td>{Number(r.duration_hours).toFixed(2)}</td>
                <td>{r.status}</td>
                <td>{r.days_of_week}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                {err
                  ? "Could not load schedules. Check backend and API URL."
                  : "No schedules yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
