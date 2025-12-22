import express from "express";
import { roles } from "../config/roles.js";
import { verify_token } from "../Middlewares/jwt.js";
import { allowed_to } from "../Middlewares/handlers.js";
import { upload } from "../Middlewares/upload_image.js";
import { canManageOwnOrAll } from "../Middlewares/handlers.js";
import { validation_User_Schema } from "../models/User_model.js";
import {
  login,
  register,
  updateUser,
  getAllUsers,
  deleteUsers,
  getMyAccount,
} from "../controllers/users_controller.js";

export const usersRouter = express.Router();

usersRouter.route("/").get(verify_token, allowed_to(roles.ADMIN), getAllUsers);

usersRouter.route("/myAccount").get(verify_token, getMyAccount);

usersRouter.route("/login").post(login);

usersRouter
  .route("/register")
  .post(upload.single("avatar"), validation_User_Schema(), register);

usersRouter
  .route("/:id")
  .delete(verify_token, canManageOwnOrAll, deleteUsers)
  .patch(
    upload.single("avatar"),
    verify_token,
    canManageOwnOrAll,
    validation_User_Schema(),
    updateUser
  );
