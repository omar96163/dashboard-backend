import JsonWebToken from "jsonwebtoken";

export const generate_token = (email, id, role) => {
  return JsonWebToken.sign({ email, id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verify_token = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "Failed",
      error:
        "انتهت صلاحية الجلسة أو رمز المصادقة غير موجود , يرجى تسجيل الدخول مرة أخرى",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "Failed",
      error: "تنسيق رمز المصادقة غير صالح",
    });
  }

  try {
    const current_user = JsonWebToken.verify(token, process.env.JWT_SECRET);
    req.current_user = current_user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Failed",
        error: "انتهت صلاحية الجلسة , يرجى تسجيل الدخول مرة أخرى",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "Failed",
        error: "رمز المصادقة غير صحيح , يرجى تسجيل الدخول مرة أخرى",
      });
    } else {
      console.error("JWT verification error:", err);
      return res.status(500).json({
        status: "Error",
        error: "حدث خطأ غير متوقع في الخادم , يرجى المحاولة لاحقًا",
      });
    }
  }
};
