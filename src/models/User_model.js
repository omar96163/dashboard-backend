import mongoose from "mongoose";
import { roles } from "../config/roles.js";
import { body } from "express-validator";

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
      enum: [roles.SELLER, roles.ADMIN, roles.BUYER],
      required: true,
    },
    token: {
      type: String,
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
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 3 })
      .withMessage("min length is 3 characters"),
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("min length is 8 digits"),
    body("role")
      .notEmpty()
      .withMessage("role is required")
      .isIn([roles.SELLER, roles.ADMIN, roles.BUYER])
      .withMessage(`role must be one of ${Object.values(roles)}`),
  ];
};
