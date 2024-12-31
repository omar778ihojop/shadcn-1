import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie");
    if (!cookies) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const authToken = cookies
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const username = authToken.split("-")[0]; // Extraire le nom d'utilisateur du token
    return NextResponse.json({ username });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}