// src/pages/Passengers.jsx
import { useEffect, useState } from "react";
import { API, getErr } from "../lib/api";

export default function Passengers() {
  const [form, setForm] = useState({
    passenger_id: "", full_name: "", email: "", phone: "",
    passport_no: "", nationality: "", loyalty_no: ""
  });
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  const load = async () => {
    try {
      const { data } = await API.get("/passengers");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) { setErr(getErr(e)); }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setErr(""); setMsg("");
    try {
      if (!form.passenger_id || !form.full_name) {
        setErr("Passenger ID and Full Name are required."); return;
      }
      await API.post("/passengers", {
        ...form,
        passenger_id: Number(form.passenger_id),
        passport_no: form.passport_no?.trim() || null,
        loyalty_no: form.loyalty_no?.trim() || null,
      });
      setMsg("Passenger saved.");
      await load();                   // 🔁 refresh table
    } catch (e) { setErr(getErr(e)); }
  };

  return (
    <div>
      <h2>Passengers</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}

      <div style={{maxWidth:560, background:"#fff", padding:12, border:"1px solid #eee"}}>
        <label>Passenger ID</label>
        <input name="passenger_id" value={form.passenger_id} onChange={onChange} />

        <label>Full Name</label>
        <input name="full_name" value={form.full_name} onChange={onChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={onChange} />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} />

        <label>Passport No</label>
        <input name="passport_no" value={form.passport_no} onChange={onChange} />

        <label>Nationality</label>
        <input name="nationality" value={form.nationality} onChange={onChange} />

        <label>Loyalty No</label>
        <input name="loyalty_no" value={form.loyalty_no} onChange={onChange} />

        <div style={{marginTop:10}}>
          <button onClick={save}>Save Passenger</button>
        </div>
      </div>

      <h3 style={{marginTop:16}}>Current Passengers</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            <th>Passport</th><th>Nationality</th><th>Loyalty</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map(p => (
            <tr key={p.passenger_id}>
              <td>{p.passenger_id}</td>
              <td>{p.full_name}</td>
              <td>{p.email || "-"}</td>
              <td>{p.phone || "-"}</td>
              <td>{p.passport_no || "-"}</td>
              <td>{p.nationality || "-"}</td>
              <td>{p.loyalty_no || "-"}</td>
            </tr>
          )) : (
            <tr><td colSpan="7">No passengers yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
