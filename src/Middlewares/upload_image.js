import multer from "multer";
import { randomBytes } from "crypto";
import { uploadsDir } from "../config/paths.js";

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const randomStr = randomBytes(12).toString("hex");
    cb(null, `${randomStr}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("تنسيق الملف غير مدعوم , يُسمح برفع الصور فقط"));
  }
};

export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
