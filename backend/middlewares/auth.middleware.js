const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  return token || null;
};

const protectedRoutes = () => {
  return (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = protectedRoutes;
