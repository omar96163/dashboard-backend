import mongoose from "mongoose";
import { body } from "express-validator";

const ServiceSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Service_model = mongoose.model("Service", ServiceSchema);

export const validation_Service_Schema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 3 })
      .withMessage("min length is 3 characters"),

    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("max length is 500 characters"),

    body("duration")
      .notEmpty()
      .withMessage("duration is required")
      .isInt({ min: 30 })
      .withMessage("duration must be at least 30 minutes"),

    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isFloat({ min: 50 })
      .withMessage("price must be at least 50$"),

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be true or false"),
  ];
};
