import { useEffect, useState } from "react";
import { API, getErr } from "../lib/api";

export default function BookTicket() {
  const [passenger_id, setPid] = useState(1002);
  const [schedule_id, setSid] = useState("");
  const [seat_class, setClass] = useState("ECONOMY");
  const [amount, setAmount] = useState(4500);

  const [schedules, setSchedules] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/flights/schedules");
        setSchedules(Array.isArray(data) ? data : []);
      } catch (e) { setErr(getErr(e)); }
    })();
  }, []);

  // Filter schedules by From/To if chosen
  const filtered = schedules.filter(s =>
    (from ? s.origin_code === from : true) &&
    (to ? s.dest_code === to : true)
  );

  const selectedSchedule = filtered.find(s => String(s.schedule_id) === String(schedule_id));

  const book = async () => {
    setErr(""); setResult(null);
    try {
      // Client-side passport check: fetch passenger, see if passport exists when intl
      if (!passenger_id || !schedule_id) {
        setErr("Please select Passenger ID and Schedule.");
        return;
      }
      if (selectedSchedule?.is_international) {
        try {
          const { data: p } = await API.get(`/passengers/${passenger_id}`);
          const hasPassport = !!(p?.passport_no && p.passport_no.trim().length);
          if (!hasPassport) {
            setErr("International flight selected but passenger has no passport.");
            return; // stop before hitting DB
          }
        } catch (e) {
          setErr("Could not verify passenger passport.");
          return;
        }
      }

      // Proceed to book (DB trigger is still the final safety net)
      const { data } = await API.post("/tickets/book", {
        passenger_id: Number(passenger_id),
        schedule_id: Number(schedule_id),
        seat_class,
        amount: Number(amount)
      });
      setResult(data);
    } catch (e) {
      setErr(getErr(e));
    }
  };

  // Unique list of airport codes for dropdowns
  const uniq = (arr) => [...new Set(arr)];
  const origins = uniq(schedules.map(s => s.origin_code));
  const dests   = uniq(schedules.map(s => s.dest_code));

  return (
    <div>
      <h2>Book Ticket (via Stored Procedure)</h2>

      <div style={{maxWidth:560, background:"#fff", padding:12, border:"1px solid #eee"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label>Passenger ID</label>
            <input value={passenger_id} onChange={e=>setPid(e.target.value)} />
          </div>

          <div>
            <label>Seat Class</label>
            <select value={seat_class} onChange={e=>setClass(e.target.value)}>
              <option>ECONOMY</option><option>PREMIUM</option>
              <option>BUSINESS</option><option>FIRST</option>
            </select>
          </div>

          <div>
            <label>From</label>
            <select value={from} onChange={e=>{ setFrom(e.target.value); setSid(""); }}>
              <option value="">(any)</option>
              {origins.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label>To</label>
            <select value={to} onChange={e=>{ setTo(e.target.value); setSid(""); }}>
              <option value="">(any)</option>
              {dests.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label>Schedule</label>
            <select value={schedule_id} onChange={e=>setSid(e.target.value)}>
              <option value="">Select schedule</option>
              {filtered.map(s => (
                <option key={s.schedule_id} value={s.schedule_id}>
                  #{s.schedule_id} — {s.flight_no} {s.origin_code}→{s.dest_code} ({s.is_international ? "International" : "Domestic"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Amount</label>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
          </div>
        </div>

        {selectedSchedule && (
          <p style={{marginTop:8}}>
            Selected: <b>{selectedSchedule.flight_no}</b> {selectedSchedule.origin_code}→{selectedSchedule.dest_code} •
            <b> {selectedSchedule.is_international ? "International" : "Domestic"}</b> •
            {Number(selectedSchedule.duration_hours).toFixed(2)} hrs
          </p>
        )}

        <div style={{marginTop:10}}>
          <button onClick={book}>Book</button>
        </div>
      </div>

      {err && <p style={{color:"red"}}>{err}</p>}
      {result && (
        <>
          <h3>Success</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <p>New Ticket ID: <b>{result.ticket_id}</b></p>
        </>
      )}

      <p style={{marginTop:16, opacity:.8}}>
        Tip: Choose an <b>international</b> route and try with a passenger without a passport to see the client check,
        and remember the <b>database trigger</b> still enforces this rule even if the frontend misses it.
      </p>
    </div>
  );
}
