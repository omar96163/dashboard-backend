import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { User_model } from "../models/User_model.js";
import { generate_token } from "../Middlewares/jwt.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User_model.find({}, { password: false, __v: false });
    return res.json({ status: "success", data: { users } });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const getMyAccount = async (req, res) => {
  const userId = req.current_user.id;
  try {
    const myAccount = await User_model.findById(userId).select(
      "-password -__v"
    );
    if (!myAccount) {
      return res.status(404).json({
        status: "failed",
        message: "This user does not exist",
      });
    }
    return res.status(200).json({ status: "success", data: { myAccount } });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const register = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: "failed", message: err.array() });
  }
  const olduser = await User_model.findOne({ email: req.body.email });
  if (olduser) {
    return res
      .status(400)
      .json({ status: "failed", message: "البريد الإلكتروني موجود بالفعل" });
  }
  try {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedpassword;
    const user = new User_model(req.body);
    const token = generate_token(user.email, user._id, user.role);
    user.avatar = req.file?.filename || "default";
    await user.save();
    const newuser = await User_model.findById(user._id).select(
      "-password -__v"
    );
    return res.status(201).json({
      status: "success",
      message: "تم التسجيل بنجاح , سعيدون بثقتك في منصتنا",
      token: token,
      data: { newuser },
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const login = async (req, res) => {
  const user_email = req.body.email;
  const user_password = req.body.password;
  if (!user_email || !user_password) {
    return res.status(400).json({
      status: "failed",
      message: "لابد من إدخال البريد الإلكتروني وكلمة المرور",
    });
  } else {
    try {
      const matched_user = await User_model.findOne({ email: user_email });
      if (!matched_user) {
        return res.status(404).json({
          status: "failed",
          message: "البريد الإلكتروني غير موجود",
        });
      } else {
        const matched_password = await bcrypt.compare(
          user_password,
          matched_user.password
        );
        if (!matched_password) {
          return res.status(401).json({
            status: "failed",
            message: "كلمة المرور غير  صحيحه",
          });
        } else {
          const token = generate_token(
            matched_user.email,
            matched_user._id,
            matched_user.role
          );
          const user = await User_model.findById(matched_user._id).select(
            "-password -__v"
          );
          return res.json({
            status: "success",
            message: "تم تسجيل الدخول بنجاح , مرحبا بك مجدداً",
            token: token,
            data: { user },
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const deleteduser = await User_model.findByIdAndDelete(req.params.id);
    if (!deleteduser) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }
    return res.status(200).json({
      status: "success",
      message: `${deleteduser.email} , deleted`,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User_model.findOne({ _id: req.params.id });
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "user not found" });
  }
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: "failed", message: err.array() });
  }
  const matcheduser = await User_model.findOne({ email: req.body.email });
  if (matcheduser && matcheduser._id.toString() !== req.params.id) {
    return res
      .status(400)
      .json({ status: "failed", message: "email already exists" });
  }

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    req.body.avatar = req.file?.filename || "default";
    const updateduser = await User_model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password -__v");
    if (!updateduser) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }
    return res.status(200).json({ status: "success", data: { updateduser } });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
