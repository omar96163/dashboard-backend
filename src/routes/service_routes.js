import express from "express";
import { roles } from "../config/roles.js";
import { verify_token } from "../Middlewares/jwt.js";
import { allowed_to } from "../Middlewares/handlers.js";
import { validation_Service_Schema } from "../models/Service_model.js";
import {
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  createService,
} from "../controllers/service_controller.js";

export const serviceRouter = express.Router();

serviceRouter
  .route("/")
  .get(verify_token, getAllServices)
  .post(
    verify_token,
    allowed_to(roles.SELLER),
    validation_Service_Schema(),
    createService
  );

serviceRouter
  .route("/:id")
  .get(verify_token, getServiceById)
  .patch(
    verify_token,
    allowed_to(roles.SELLER),
    validation_Service_Schema(),
    updateService
  )
  .delete(verify_token, allowed_to(roles.SELLER), deleteService);
