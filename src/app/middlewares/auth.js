import jwt from "jsonwebtoken";
import { promisify } from "util";

import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(200).json({ erro: "Token não encontrado" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.idUsuario = decoded.id;

    return next();
  } catch (err) {
    return res.status(200).json({ erro: "Token inválido" });
  }
};
