import { validationResult } from "express-validator";
import { Booking_model } from "../models/Booking_model.js";
import { Service_model } from "../models/Service_model.js";

export const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "Failed", errors: errors.array() });
  }

  try {
    const buyerId = req.current_user.id;
    const serviceId = req.params.id;
    const { bookingPrice, bookingDate, notes } = req.body;

    const service = await Service_model.findById(serviceId);
    if (!service || !service.isActive) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Service not found or inactive." });
    }

    const existing = await Booking_model.findOne({
      serviceId,
      bookingDate: new Date(bookingDate),
    });
    if (existing) {
      return res.status(400).json({
        status: "Failed",
        message: "Service already booked for that date.",
      });
    }

    const booking = new Booking_model({
      buyerId,
      sellerId: service.sellerId,
      serviceId,
      bookingPrice,
      bookingDate,
      notes,
    });

    await booking.save();

    res.status(201).json({
      status: "success",
      message: "Booking created successfully.",
      data: { booking },
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: `creating booking failed >> ${err.message}`,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const userId = req.current_user.id;
    const role = req.current_user.role;

    if (role === "admin") {
      const bookings = await Booking_model.find({});
      if (!bookings.length) {
        return res
          .status(404)
          .json({ status: "Failed", message: "No bookings found" });
      }
      return res.status(200).json({ status: "Success", data: { bookings } });
    }
    if (role === "seller") {
      const bookings = await Booking_model.find({ sellerId: userId });
      if (!bookings.length) {
        return res
          .status(404)
          .json({ status: "Failed", message: "No bookings found" });
      }
      return res.status(200).json({ status: "Success", data: { bookings } });
    }

    if (role === "buyer") {
      const bookings = await Booking_model.find({ buyerId: userId });
      if (!bookings.length) {
        return res
          .status(404)
          .json({ status: "Failed", message: "No bookings found" });
      }
      return res.status(200).json({ status: "Success", data: { bookings } });
    }
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: `get all bookings failed >> ${err.message}`,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.current_user.id;
    const role = req.current_user.role;

    const booking = await Booking_model.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ status: "Failed", message: "No booking found" });
    }

    if (
      (role === "seller" && booking.sellerId.toString() !== userId) ||
      (role === "buyer" && booking.buyerId.toString() !== userId)
    ) {
      return res.status(404).json({
        status: "Failed",
        message:
          "you are not authorized to view this booking, you are not the seller or the buyer",
      });
    }

    res.status(200).json({ status: "Success", data: { booking } });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: `get BookingById failed >> ${err.message}`,
    });
  }
};

export const updateBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "Failed", errors: errors.array() });
  }

  try {
    const bookingId = req.params.id;
    const userId = req.current_user.id;

    const booking = await Booking_model.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ status: "Failed", message: "Booking not found" });

    if (booking.buyerId.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message:
          "You are not authorized to update this booking, you are not the buyer",
      });
    }

    const { bookingPrice, bookingDate, notes } = req.body;
    booking.bookingPrice = bookingPrice || booking.bookingPrice;
    booking.bookingDate = bookingDate || booking.bookingDate;
    booking.notes = notes || booking.notes;
    await booking.save();

    res.status(200).json({ status: "Success", data: { booking } });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: `updating booking failed >> ${err.message}`,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.current_user.id;

    const booking = await Booking_model.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Booking not found" });
    }
    if (booking.buyerId.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message:
          "You are not authorized to delete this booking, you are not the buyer",
      });
    }

    await Booking_model.findByIdAndDelete(bookingId);
    res.json({ status: "Success", message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: `deleting booking failed >> ${err.message}`,
    });
  }
};
