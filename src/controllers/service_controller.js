import { roles } from "../config/roles.js";
import { validationResult } from "express-validator";
import { Service_model } from "../models/Service_model.js";

export const createService = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: "failed", message: err.array() });
  }

  try {
    const sellerId = req.current_user.id;
    const sellerEmail = req.current_user.email;
    const { title, description, duration, price } = req.body;
    const service = new Service_model({
      sellerId,
      sellerEmail,
      title,
      description,
      duration,
      price,
    });

    await service.save();

    res.status(201).json({
      status: "success",
      message: "Service created successfully",
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error creating service >> ${error.message}`,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { role, id: userId } = req.current_user;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 9, 1);
    const skip = (page - 1) * limit;

    const filter = role === roles.FREELANCER ? { sellerId: userId } : {};

    const [services, totalServices] = await Promise.all([
      Service_model.find(filter).skip(skip).limit(limit).lean(),
      Service_model.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      results: services.length,

      totalServices,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalServices / limit),
        limit,
      },

      data: services,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
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
        .json({ status: "failed", message: "Service not found" });
    }

    if (role === roles.FREELANCER && service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized to view this service",
      });
    }

    return res.status(200).json({ status: "success", data: { service } });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Error fetching service >> ${err.message}`,
    });
  }
};

export const updateService = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: "failed", message: err.array() });
  }
  try {
    const serviceId = req.params.id;
    const sellerId = req.current_user.id;

    const service = await Service_model.findById(serviceId);

    if (!service)
      return res
        .status(404)
        .json({ status: "failed", message: "Service not found" });

    if (service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized to update this service",
      });
    }

    const { title, description, duration, price, isActive } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.isActive = isActive || service.isActive;

    await service.save();

    res.status(200).json({
      status: "success",
      message: "Service updated successfully",
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
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
        .json({ status: "failed", message: "هذة الخدمة غير موجودة" });

    if (service.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        status: "failed",
        message: "غير مسموح لك بحذف هذة الخدمة",
      });
    }

    await service.deleteOne();

    res.json({
      status: "success",
      message: `تم حذف الخدمة " ${service.title} " بنجاح`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error deleting service >> ${error.message}`,
    });
  }
};
