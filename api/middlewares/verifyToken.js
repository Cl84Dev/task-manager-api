const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token.split(" ")[1], process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;
