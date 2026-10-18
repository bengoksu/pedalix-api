const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      mesaj: "Token bulunamadı.",
    });
  }

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mesaj: "Token formatı hatalı.",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mesaj: "Token bulunamadı.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      mesaj: "Geçersiz veya süresi dolmuş token.",
    });
  }
};

module.exports = authMiddleware;
