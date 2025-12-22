import JsonWebToken from "jsonwebtoken";

export const generate_token = (email, id, role) => {
  return JsonWebToken.sign({ email, id, role }, process.env.JWT_SECRET, {
    expiresIn: "1440m",
  });
};

export const verify_token = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "Failed",
      error: "Token is required. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "Failed",
      error: "Invalid token format",
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
        error: "Token has expired. Please log in again.",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "Failed",
        error: "Invalid token. Please log in.",
      });
    } else {
      console.error("JWT verification error:", err);
      return res.status(500).json({
        status: "Error",
        error: "Internal server error",
      });
    }
  }
};
