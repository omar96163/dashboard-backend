import fs from "fs";
import cors from "cors";
import "dotenv/config.js";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import connectDB from "./config/db.js";
import rateLimit from "express-rate-limit";
import { uploadsDir } from "./config/paths.js";
import { usersRouter } from "./routes/users_routes.js";
import { serviceRouter } from "./routes/service_routes.js";
import { bookingRouter } from "./routes/booking_routes.js";
import { listening, homeRouter } from "./Middlewares/handlers.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
  console.error("❌ JWT_SECRET is missing or too short (<64 chars).");
  process.exit(1);
}

if (!process.env.FRONTEND_URL) {
  console.warn("⚠️ FRONTEND_URL not set. Defaulting to http://localhost:3000");
}

const app = express();

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(morgan("combined"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "Too Many Requests",
    error: "Too many login attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//app.use("/api/users/login", authLimiter);
//app.use("/api/users/register", authLimiter);

app.use("/uploads", express.static(uploadsDir));
app.use("/api/users", usersRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/", homeRouter);

connectDB();

app.listen(process.env.PORT || 2000, listening);
