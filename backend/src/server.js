import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flights from "./routes/flights.js";
import tickets from "./routes/tickets.js";
import passengers from "./routes/passengers.js";
import functions from "./routes/functions.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/flights", flights);
app.use("/api/tickets", tickets);
app.use("/api/passengers", passengers);
app.use("/api/functions", functions);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
