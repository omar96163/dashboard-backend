import express from "express";
import { roles } from "../config/roles.js";
import { verify_token } from "../Middlewares/jwt.js";
import { allowed_to } from "../Middlewares/handlers.js";
import { validation_Booking_Schema } from "../models/Booking_model.js";
import {
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  createBooking,
} from "../controllers/booking_controller.js";

export const bookingRouter = express.Router();

bookingRouter
  .route("/")
  .get(verify_token, getAllBookings)
  .post(
    verify_token,
    allowed_to(roles.CLIENT),
    validation_Booking_Schema(true),
    createBooking
  );

bookingRouter
  .route("/:id")
  .patch(
    verify_token,
    allowed_to(roles.CLIENT),
    validation_Booking_Schema(false),
    updateBooking
  )
  .get(verify_token, getBookingById)
  .delete(verify_token, allowed_to(roles.CLIENT), deleteBooking);
