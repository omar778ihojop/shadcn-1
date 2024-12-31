import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Chemin adapté à votre structure
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Obtenir les données du corps de la requête
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et mot de passe requis." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("db-test-flux"); // Remplacez par le nom de votre base de données
    const user = await db.collection("users").findOne({ username, password });

    if (!user) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Créer un cookie d'authentification
    const token = `${username}-${new Date().toISOString()}`;
    const response = NextResponse.json({ message: "Authentifié avec succès." });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 jour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
