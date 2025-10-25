import { useState } from "react";
import { API, getErr } from "../lib/api";

export default function AddSchedule() {
  const [form, setForm] = useState({
    schedule_id: "", flight_no: "",
    departure_time: "", arrival_time: "",
    days_of_week: "Mon", status: "PLANNED", aircraft_id: ""
  });
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setErr(""); setMsg("");
    try {
      if (!form.schedule_id || !form.flight_no || !form.departure_time || !form.arrival_time) {
        setErr("Schedule ID, Flight No, Departure and Arrival are required."); return;
      }
      await API.post("/flights/schedules", {
        ...form,
        schedule_id: Number(form.schedule_id) || null,
        aircraft_id: form.aircraft_id?.trim() || null
      });
      setMsg("Schedule created. Duration will be auto-filled by trigger.");
    } catch (e) { setErr(getErr(e)); }
  };

  return (
    <div>
      <h2>Add Flight Schedule</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}
      <div style={{maxWidth:560, background:"#fff", padding:12, border:"1px solid #eee"}}>
        <label>Schedule ID</label>
        <input name="schedule_id" value={form.schedule_id} onChange={onChange} />

        <label>Flight No (e.g., AI101)</label>
        <input name="flight_no" value={form.flight_no} onChange={onChange} />

        <label>Departure (YYYY-MM-DD HH:MM:SS)</label>
        <input name="departure_time" value={form.departure_time} onChange={onChange} placeholder="2025-11-01 09:00:00" />

        <label>Arrival (YYYY-MM-DD HH:MM:SS)</label>
        <input name="arrival_time" value={form.arrival_time} onChange={onChange} placeholder="2025-11-01 12:30:00" />

        <label>Days of Week (SET)</label>
        <input name="days_of_week" value={form.days_of_week} onChange={onChange} placeholder="Mon,Wed,Fri" />

        <label>Status</label>
        <select name="status" value={form.status} onChange={onChange}>
          <option>PLANNED</option><option>READY</option><option>CANCELLED</option><option>COMPLETED</option>
        </select>

        <label>Aircraft ID (optional)</label>
        <input name="aircraft_id" value={form.aircraft_id} onChange={onChange} placeholder="A320-DEL-05" />

        <div style={{marginTop:10}}>
          <button onClick={save}>Create Schedule</button>
        </div>
      </div>
    </div>
  );
}
