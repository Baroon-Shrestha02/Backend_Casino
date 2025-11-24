const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res.status(401).json({ message: "Unauthorized - No access token" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    req.user = decoded;
    next();
  });
};

module.exports = { verifyAdmin };
