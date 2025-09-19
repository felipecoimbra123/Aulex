const jwt = require('jsonwebtoken')
const { verifyJwt } = require('../lib/token')

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token não enviado" });

  const verifiedToken = verifyJwt(token);

  if (!verifiedToken) {
      return res.status(403).json({ erro: "Token inválido" });
  }

    req.usuario = verifiedToken; 
    next();
}

module.exports = {
    autenticarToken
}