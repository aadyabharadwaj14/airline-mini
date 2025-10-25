import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Flights from "./pages/Flights.jsx";
import BookTicket from "./pages/BookTicket.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Passengers from "./pages/Passengers.jsx";
import AddSchedule from "./pages/AddSchedule.jsx";
import Functions from "./pages/Functions.jsx";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <header style={{padding:"12px", borderBottom:"1px solid #eee"}}>
        <nav style={{display:"flex", gap:12}}>
          <NavLink to="/" end>Flights</NavLink>
          <NavLink to="/book">Book Ticket</NavLink>
          <NavLink to="/mybookings">My Bookings</NavLink>
          <NavLink to="/passengers">Passengers</NavLink>
          <NavLink to="/add-schedule">Add Schedule</NavLink>
          <NavLink to="/functions">Functions</NavLink>
        </nav>
      </header>
      <main style={{padding:"16px"}}>
        <Routes>
          <Route path="/" element={<Flights />} />
          <Route path="/book" element={<BookTicket />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/add-schedule" element={<AddSchedule />} />
          <Route path="/functions" element={<Functions />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
