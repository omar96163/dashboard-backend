import { roles } from "../config/roles.js";
import { validationResult } from "express-validator";
import { Booking_model } from "../models/Booking_model.js";
import { Service_model } from "../models/Service_model.js";
import { BOOKING_STATUS, BOOKING_STATUS_LABELS } from "../config/status.js";

export const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  try {
    const buyerId = req.current_user.id;
    const buyerEmail = req.current_user.email;
    const { serviceId, bookingPrice, bookingDate, notes } = req.body;

    const service = await Service_model.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        status: "failed",
        message: "هذه الخدمة غير موجودة أو غير نشطة",
      });
    }

    const existing = await Booking_model.findOne({
      serviceId,
      bookingDate: new Date(bookingDate),
    });
    if (existing) {
      return res.status(400).json({
        status: "failed",
        message: "هذه الخدمة محجوزة في هذا التاريخ",
      });
    }

    const sellerEmail = service.sellerEmail;
    const bookedServiceTitle = service.title;

    const booking = new Booking_model({
      buyerId,
      buyerEmail,
      sellerId: service.sellerId,
      sellerEmail,
      serviceId,
      bookedServiceTitle,
      bookingPrice,
      bookingDate,
      notes,
    });

    await booking.save();

    res.status(201).json({
      status: "success",
      message: "تم حجز الخدمة بنجاح",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `creating booking failed >> ${err.message}`,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const userId = req.current_user.id;
    const role = req.current_user.role;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 9, 1);
    const skip = (page - 1) * limit;

    const filter =
      role === roles.FREELANCER
        ? { sellerId: userId }
        : role === roles.CLIENT
          ? { buyerId: userId }
          : {};

    const [
      bookings,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      Booking_model.find(filter).skip(skip).limit(limit).lean(),
      Booking_model.countDocuments(filter),
      Booking_model.countDocuments({
        filter,
        status: BOOKING_STATUS.PENDING,
      }),
      Booking_model.countDocuments({
        filter,
        status: BOOKING_STATUS.CONFIRMED,
      }),
      Booking_model.countDocuments({
        filter,
        status: BOOKING_STATUS.COMPLETED,
      }),
      Booking_model.countDocuments({
        filter,
        status: BOOKING_STATUS.CANCELLED,
      }),
    ]);

    return res.status(200).json({
      status: "success",
      results: bookings.length,

      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        limit,
      },

      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
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
        .json({ status: "failed", message: "No booking found" });
    }

    if (
      (role === roles.FREELANCER && booking.sellerId.toString() !== userId) ||
      (role === roles.CLIENT && booking.buyerId.toString() !== userId)
    ) {
      return res.status(403).json({
        status: "failed",
        message:
          "you are not authorized to view this booking, you are not the freelancer or the client",
      });
    }

    res.status(200).json({ status: "success", data: { booking } });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `get BookingById failed >> ${err.message}`,
    });
  }
};

export const updateBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", message: errors.array() });
  }

  try {
    const bookingId = req.params.id;
    const userId = req.current_user.id;
    const userRole = req.current_user.role;

    const booking = await Booking_model.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ status: "failed", message: "هذا الحجز غير موجود" });

    const { bookingPrice, bookingDate, notes, status } = req.body;

    if (userRole === roles.CLIENT) {
      if (booking.buyerId.toString() !== userId) {
        return res.status(403).json({
          status: "failed",
          message: "غير مسموح لك بتعديل هذا الحجز",
        });
      }
      if (booking.status !== BOOKING_STATUS.PENDING) {
        return res.status(403).json({
          status: "failed",
          message: "لا يمكنك تعديل الحجز بعد تأكيده",
        });
      }
      booking.bookingPrice = bookingPrice || booking.bookingPrice;
      booking.bookingDate = bookingDate || booking.bookingDate;
      booking.notes = notes || booking.notes;
    } else if (userRole === roles.FREELANCER) {
      if (booking.sellerId.toString() !== userId) {
        return res.status(403).json({
          status: "failed",
          message: "غير مسموح لك بتعديل هذا الحجز",
        });
      }
      booking.status = BOOKING_STATUS_LABELS[status] || booking.status;
    }

    await booking.save();

    res.status(201).json({
      status: "success",
      message: "تم تعديل الحجز بنجاح",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
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
        .json({ status: "failed", message: "هذا الحجز غير موجود" });
    }
    if (booking.buyerId.toString() !== userId) {
      return res.status(403).json({
        status: "failed",
        message: "غير مسموح لك بحذف هذا الحجز",
      });
    }

    await Booking_model.findByIdAndDelete(bookingId);
    res.json({
      status: "success",
      message: "تم حذف الحجز بنجاح",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `deleting booking failed >> ${err.message}`,
    });
  }
};
