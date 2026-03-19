import mongoose from "mongoose";
import { body } from "express-validator";
import { status } from "../config/status.js";

const bookingSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookedServiceTitle: {
      type: String,
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
      enum: [
        status.PENDING,
        status.CONFIRMED,
        status.COMPLETED,
        status.CANCELLED,
      ],
      default: status.PENDING,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Booking_model = mongoose.model("Booking", bookingSchema);

export const validation_Booking_Schema = (isCreating = false) => {
  const validations = [
    body("bookingPrice")
      .optional()
      .isFloat({ min: 50 })
      .withMessage("السعر يجب أن لا يقل عن 50 $"),
    body("bookingDate")
      .optional()
      .isISO8601()
      .withMessage("التاريخ غير صحيح")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("تاريخ الحجز يجب أن يكون في المستقبل");
        }
        return true;
      }),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("الملاحظات يجب أن لا تتجاوز 500 حرف"),
    body("status")
      .optional()
      .isIn(Object.values(status))
      .withMessage(
        `الحالة يجب أن تكون واحدة من: ${Object.values(status).join(", ")}`,
      ),
  ];

  if (isCreating) {
    validations.push(
      body("serviceId")
        .notEmpty()
        .withMessage("ال ID الخاص بالخدمة مطلوب")
        .isMongoId()
        .withMessage("ال ID الخاص بالخدمة غير صحيح"),
    );
  }

  return validations;
};
