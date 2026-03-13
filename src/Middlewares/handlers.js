import { roles } from "../config/roles.js";

export const listening = () => {
  return console.log("listening on port", process.env.PORT || 8000);
};

export const allowed_to = (...roles) => {
  return (req, res, next) => {
    if (!req.current_user) {
      return res.status(401).json({
        status: "Unauthorized",
        error: "يلزم تسجيل الدخول للوصول إلى هذه الصفحة",
      });
    }

    const current_user_role = req.current_user.role;
    if (!roles.includes(current_user_role)) {
      return res.status(403).json({
        status: "Forbidden",
        error: "عذرًا ,  ليس لديك صلاحية للوصول إلى هذه الصفحة",
      });
    }
    next();
  };
};

export const canManageOwnOrAll = (req, res, next) => {
  const { id } = req.params;
  const { current_user } = req;

  if (!current_user) {
    return res.status(401).json({
      status: "Unauthorized",
      error: "يلزم تسجيل الدخول للوصول إلى هذه الصفحة",
    });
  }

  if (current_user.role === roles.ADMIN) {
    return next();
  }

  if (current_user.id === id) {
    return next();
  }

  return res.status(403).json({
    status: "Forbidden",
    error: "يمكنك إدارة حسابك الشخصي فقط",
  });
};

export const homeRouter = (req, res) => {
  return res.send("Welcome to dashboard-backend");
};
