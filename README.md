# ✈️ Airline Management System (MySQL + Node + React)

This project is a full-stack airline booking system with:
- **MySQL** backend (triggers, functions, procedures)
- **Express.js** API for database access
- **React (Vite)** frontend GUI for passengers, booking, and admin actions

## Features
- Add passengers and view list
- Book tickets using stored procedure
- Cancel tickets using procedure (`cancel_ticket_simple`)
- Trigger-based validation (passport, payment, etc.)
- Function-based price & duration calculation

## Setup
1. Import `airline_schema.sql` into MySQL
2. Start backend:
   ```bash
   cd backend
   npm install
   npm run dev
