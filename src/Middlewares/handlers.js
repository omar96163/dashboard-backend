export const listening = () => {
  return console.log("listening on port", process.env.PORT || 2000);
};

export const allowed_to = (...roles) => {
  return (req, res, next) => {
    const current_user_role = req.current_user.role;
    if (!roles.includes(current_user_role)) {
      return res
        .status(403)
        .json({ status: "Failed", error: "you are not allowed" });
    }
    next();
  };
};

export const homeRouter = (req, res) => {
  return res.send("Welcome to dashboard-backend");
};
