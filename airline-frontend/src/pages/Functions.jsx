import { useState } from "react";
import { API, getErr } from "../lib/api";

export default function Functions() {
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [duration, setDuration] = useState(null);

  const [schedule_id, setScheduleId] = useState("");
  const [seat_class, setSeatClass] = useState("ECONOMY");
  const [base, setBase] = useState(4500);
  const [total, setTotal] = useState(null);

  const [err, setErr] = useState("");

  const calcDuration = async () => {
    setErr("");
    try {
      const { data } = await API.get("/functions/duration", {
        params: { dep, arr },
      });
      setDuration(data.duration_hours);
    } catch (e) {
      setErr(getErr(e));
    }
  };

  const calcPrice = async () => {
    setErr("");
    try {
      const { data } = await API.get("/functions/price", {
        params: { schedule_id, seat_class, base },
      });
      setTotal(data.total_price);
    } catch (e) {
      setErr(getErr(e));
    }
  };

  return (
    <div>
      <h2>MySQL Function Tester</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: 600 }}>
        <div style={{ background: "#fff", padding: "12px", border: "1px solid #ccc" }}>
          <h3>🕒 Calculate Duration</h3>
          <label>Departure Time (YYYY-MM-DD HH:MM:SS)</label>
          <input value={dep} onChange={(e) => setDep(e.target.value)} placeholder="2025-10-30 10:00:00" />

          <label>Arrival Time (YYYY-MM-DD HH:MM:SS)</label>
          <input value={arr} onChange={(e) => setArr(e.target.value)} placeholder="2025-10-30 12:30:00" />

          <button onClick={calcDuration} style={{ marginTop: 10 }}>Get Duration</button>

          {duration !== null && (
            <p style={{ marginTop: 10 }}>
              <b>Duration:</b> {duration} hours
            </p>
          )}
        </div>

        <div style={{ background: "#fff", padding: "12px", border: "1px solid #ccc" }}>
          <h3>💰 Calculate Total Price</h3>
          <label>Schedule ID</label>
          <input value={schedule_id} onChange={(e) => setScheduleId(e.target.value)} />

          <label>Seat Class</label>
          <select value={seat_class} onChange={(e) => setSeatClass(e.target.value)}>
            <option>ECONOMY</option>
            <option>PREMIUM</option>
            <option>BUSINESS</option>
            <option>FIRST</option>
          </select>

          <label>Base Price</label>
          <input
            type="number"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />

          <button onClick={calcPrice} style={{ marginTop: 10 }}>
            Get Total Price
          </button>

          {total !== null && (
            <p style={{ marginTop: 10 }}>
              <b>Total Price:</b> ₹{total}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
