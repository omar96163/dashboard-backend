import mongoose from "mongoose";
import { body } from "express-validator";

const bookingSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookingPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Booking_model = mongoose.model("Booking", bookingSchema);

export const validation_Booking_Schema = () => {
  return [
    body("bookingPrice")
      .notEmpty()
      .withMessage("Booking price is required.")
      .isFloat({ min: 50 })
      .withMessage("Price must be at least 50$."),
    body("bookingDate")
      .notEmpty()
      .withMessage("Booking date is required.")
      .isISO8601()
      .withMessage("Invalid date format.")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("Booking date cannot be in the past.");
        }
        return true;
      }),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes cannot exceed 500 characters."),
  ];
};
