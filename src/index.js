import fs from "fs";
import path from "path";
import cors from "cors";
import "dotenv/config.js";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { usersRouter } from "./routes/users_routes.js";
import { serviceRouter } from "./routes/service_routes.js";
import { bookingRouter } from "./routes/booking_routes.js";
import { listening, homeRouter } from "./Middlewares/handlers.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const imagesPath = path.join(__dirname, "uploads");

const uploadDir = path.join(process.cwd(), "src", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(imagesPath));
app.use("/api/users", usersRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/", homeRouter);
app.listen(process.env.PORT || 2000, listening);
