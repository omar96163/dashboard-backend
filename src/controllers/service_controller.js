import { validationResult } from "express-validator";
import { Service_model } from "../models/Service_model.js";

export const createService = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: "Failed", message: err.array() });
  }

  try {
    const sellerId = req.current_user.id;
    const { title, description, duration, price } = req.body;
    const service = new Service_model({
      sellerId,
      title,
      description,
      duration,
      price,
    });

    await service.save();

    res.status(201).json({
      status: "Success",
      message: "Service created successfully",
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Error creating service >> ${error.message}`,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const sellerId = req.current_user.id;
    const role = req.current_user.role;

    if (role !== "seller") {
      const services = await Service_model.find({});

      if (!services.length) {
        return res
          .status(404)
          .json({
            status: "Failed",
            message: "No services found, please create one",
          });
      }

      return res.status(200).json({ status: "Success", data: { services } });
    }

    const services = await Service_model.find({ sellerId });
    if (!services.length) {
      return res
        .status(404)
        .json({ status: "Failed", message: "No services found" });
    }

    return res.status(200).json({ status: "Success", data: { services } });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: `Error fetching services >> ${err.message}`,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const sellerId = req.current_user.id;
    const role = req.current_user.role;

    const service = await Service_model.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Service not found" });
    }

    if (role === "seller" && service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not authorized to view this service",
      });
    }

    return res.status(200).json({ status: "Success", data: { service } });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: `Error fetching service >> ${err.message}`,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const sellerId = req.current_user.id;

    const service = await Service_model.findById(serviceId);

    if (!service)
      return res
        .status(404)
        .json({ status: "Failed", message: "Service not found" });

    if (service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not authorized to update this service",
      });
    }

    const { title, description, duration, price } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;

    await service.save();

    res.status(200).json({
      status: "Success",
      message: "Service updated successfully",
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Error updating service >> ${error.message}`,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const sellerId = req.current_user.id;

    const service = await Service_model.findById(serviceId);

    if (!service)
      return res
        .status(404)
        .json({ status: "Failed", message: "Service not found" });

    if (service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not authorized to delete this service",
      });
    }

    await service.deleteOne();

    res.json({
      status: "Success",
      message: `${service.title} service deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `Error deleting service >> ${error.message}`,
    });
  }
};
