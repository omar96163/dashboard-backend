import mongoose from "mongoose";
import { body } from "express-validator";
import { roles } from "../config/roles.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [roles.CLIENT, roles.FREELANCER, roles.AGENT, roles.ADMIN],
      required: true,
      default: roles.CLIENT,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User_model = mongoose.model("User", UserSchema);

export const validation_User_Schema = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .optional()
      .isIn(Object.values(roles))
      .withMessage(`Role must be one of: ${Object.values(roles).join(", ")}`),
  ];
};
