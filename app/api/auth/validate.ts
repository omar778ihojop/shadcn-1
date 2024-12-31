import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie"; // Assurez-vous d'avoir installé le package cookie

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const parsedCookies = parse(cookies);
  const token = parsedCookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const username = token.split("-")[0]; // Extrait le nom d'utilisateur du token
  return res.status(200).json({ username });
}
